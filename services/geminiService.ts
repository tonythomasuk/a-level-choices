import { GoogleGenAI, Type } from "@google/genai";
import type { InitialReportData, CourseRequirements, WhatIfScenario } from '../types';

// Add type declarations for import.meta.env
// This resolves the TypeScript error 'Property 'env' does not exist on type 'ImportMeta''
// in environments where global type augmentation from bundlers like Vite might not be automatically picked up.
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
    // Add other VITE_ variables here if they are used elsewhere in this module
    // For example:
    // readonly VITE_SOME_OTHER_VAR: string;
  }
}

// System instruction remains global as it's consistent across calls
const systemInstruction = `You are an expert UK university admissions and careers advisor for GCSE students. Your advice must be inspirational, accurate, and strictly based on authoritative sources like the Russell Group's 'Informed Choices' guide, UCAS, and official UK graduate earnings data (HESA/LEO). Do not hallucinate course names or university details. All university courses must be from one of the 24 Russell Group universities. Format your entire response as a single, valid JSON object that adheres to the provided schema. Do not include any markdown formatting like \`\`\`json or any text outside of the JSON object.`;

const initialReportSchema = {
    type: Type.OBJECT,
    properties: {
        section2Data: {
            type: Type.OBJECT,
            properties: {
                careerPersona: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "A creative, aspirational persona title like 'The Creative Engineer' or 'The Data-Driven Historian'." },
                        description: { type: Type.STRING, description: "A short, engaging one-paragraph description of the persona's strengths." },
                    },
                    required: ['title', 'description']
                },
                futureStory: { type: Type.STRING, description: "An inspirational story connecting the subjects." },
                universityCourses: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT, properties: { name: { type: Type.STRING }, university: { type: Type.STRING }, }, required: ['name', 'university'],
                    },
                },
                popularCareers: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, }, required: ['name', 'description'],
                    },
                },
                earningPotential: {
                    type: Type.OBJECT, properties: { range: { type: Type.STRING, description: "Salary range, e.g., £25,000 - £40,000" }, details: { type: Type.STRING, description: "Details about earning potential." }, }, required: ['range', 'details'],
                },
            },
            required: ['careerPersona', 'futureStory', 'universityCourses', 'popularCareers', 'earningPotential'],
        },
        skippableSubjects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT, properties: { subject: { type: Type.STRING }, isSkippable: { type: Type.BOOLEAN }, reason: { type: Type.STRING } }, required: ['subject', 'isSkippable', 'reason']
            }
        }
    },
    required: ['section2Data', 'skippableSubjects']
};

const commonApiCallWrapper = async <T>(apiCall: (apiKey: string) => Promise<T>): Promise<T> => {
  try {
    // For Vite client-side applications, environment variables are exposed via import.meta.env
    // and must be prefixed with VITE_.
    const apiKey = import.meta.env.VITE_API_KEY;

    // Throw an error if API key is still not available after check, before API call
    if (!apiKey) {
      // This specific error message will be caught in App.tsx to prompt for API key setup
      throw new Error("Requested entity was not found."); 
    }
    
    // Pass apiKey to the apiCall function
    return await apiCall(apiKey);
  } catch (error: any) {
    console.error("Gemini API call error:", error);
    // Re-throw the error for App.tsx to handle, including specific "Requested entity was not found." for API key reset
    throw error;
  }
};

export const generateInitialReport = async (subjects: string[]): Promise<InitialReportData> => {
  return commonApiCallWrapper(async (apiKey: string) => {
    // Create new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey }); 
    const model = 'gemini-2.5-flash';
    const prompt = `For the A-level subject combination ${subjects.join(', ')}, provide the following information:
      1. Career Persona: A creative, aspirational persona title (e.g., 'The Creative Engineer') and a short description.
      2. Future Story: An inspirational story (2 paragraphs) connecting these subjects.
      3. University Courses: A list of 5 relevant degree courses at Russell Group universities (4 popular, 1 less obvious).
      4. Popular Careers: A list of 3-5 typical careers with brief descriptions.
      5. Earning Potential: A summary of likely earnings 2 years after graduation, based on HESA/LEO data.
      6. Skippable Subjects: For each of the original subjects (${subjects.join(', ')}), analyze if it can be studied at a Russell Group university without the A-level, providing a boolean and a reason.`;
    
    const response = await ai.models.generateContent({
      model, contents: prompt, config: { systemInstruction, responseMimeType: "application/json", responseSchema: initialReportSchema, temperature: 0.7, },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  });
};


const courseRequirementsSchema = {
    type: Type.OBJECT,
    properties: {
        requirements: { type: Type.STRING, description: "Typical A-level grade requirements, e.g., A*AA or ABB." },
        link: { type: Type.STRING, description: "The direct URL to the official course page on the university's website." },
    },
    required: ['requirements', 'link']
};

export const getCourseRequirements = async (courseName: string, universityName: string): Promise<CourseRequirements> => {
  return commonApiCallWrapper(async (apiKey: string) => { 
    // Create new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';
    const prompt = `What are the typical A-level grade requirements for the course "${courseName}" at "${universityName}"? Provide the requirements and a direct link to the official course page.`;
    
    const response = await ai.models.generateContent({
        model, contents: prompt, config: { systemInstruction, responseMimeType: "application/json", responseSchema: courseRequirementsSchema, temperature: 0.2, },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  });
};

const whatIfScenarioSchema = {
    type: Type.OBJECT,
    properties: {
        substitutedSubject: { type: Type.STRING },
        newCombination: { type: Type.ARRAY, items: { type: Type.STRING } },
        scenarioStory: { type: Type.STRING, description: "A brief, inspirational story (1-2 paragraphs) for the new combination." }
    },
    required: ['substitutedSubject', 'newCombination', 'scenarioStory']
};

export const generateWhatIfScenario = async (subjects: string[], subjectToReplace: string, newSubject: string): Promise<WhatIfScenario> => {
  return commonApiCallWrapper(async (apiKey: string) => { 
    // Create new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';
    const newCombination = subjects.map(s => s === subjectToReplace ? newSubject : s);
    const prompt = `Generate a "What If" scenario. The student's original A-level subjects were ${subjects.join(', ')}. They are replacing "${subjectToReplace}" with "${newSubject}".
    Describe the new opportunities and pathways this new combination of ${newCombination.join(', ')} opens up in a brief, inspirational story.
    The 'substitutedSubject' in the JSON response must be '${subjectToReplace}'.`;

    const response = await ai.models.generateContent({
        model, contents: prompt, config: { systemInstruction, responseMimeType: "application/json", responseSchema: whatIfScenarioSchema, temperature: 0.8, },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  });
};