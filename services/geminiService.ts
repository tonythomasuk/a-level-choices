import { GoogleGenAI, Type } from "@google/genai";
import type { BaseAnalysis, UniversityCourse, SkipSubjectInfo } from '../types';

// Commented out to replace with Vercel flexibility
//const getApiKey = (): string => {
//    return process.env.API_KEY as string;
//};

//Get Application ready to work in a Vercel environment
const getApiKey = (): string => {
    // Vercel automatically injects environment variables prefixed with VITE_ into the import.meta.env object.
    // We check the hostname to determine if the app is running in the Vercel environment.
    if (window.location.hostname.endsWith('.vercel.app')) {
        // In a Vercel environment (or during local dev with a .env file),
        // use the custom key. 'VITE_API_KEY' is a standard convention.
        return import.meta.env.VITE_API_KEY as string;
    }

    // In the default environment (e.g., Google's Canvas), use the provided API_KEY.
    return process.env.API_KEY as string;
};
//End of newly inserted text

const getAIClient = () => new GoogleGenAI({ apiKey: getApiKey() });

const baseAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        futureStory: {
            type: Type.OBJECT,
            description: "A structured, inspirational story about the subject combination.",
            properties: {
                introduction: { type: Type.STRING, description: "A compelling opening paragraph (markdown formatted)." },
                body: { type: Type.STRING, description: "2-3 paragraphs (markdown formatted) detailing skills, real-world application, and synergy between subjects. Use bold for key skills." },
                conclusion: { type: Type.STRING, description: "A powerful concluding paragraph (markdown formatted) to inspire the student." }
            },
            required: ["introduction", "body", "conclusion"]
        },
        popularCareers: {
            type: Type.ARRAY,
            description: "A list of up to 5 popular careers for this subject combination.",
            items: {
                type: Type.OBJECT,
                properties: {
                    careerName: { type: Type.STRING },
                    summary: { type: Type.STRING, description: "A one-line summary of the career and how the subjects are helpful." },
                    companies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "1-2 example UK companies from different sectors that hire for this role." },
                },
                required: ["careerName", "summary", "companies"]
            },
        },
        earningPotential: {
            type: Type.OBJECT,
            description: "A structured summary of earning potential based on official UK data.",
            properties: {
                summary: { type: Type.STRING, description: "An introductory paragraph (markdown formatted) summarizing the overall earning potential." },
                careerSpecifics: {
                    type: Type.ARRAY,
                    description: "A list of earning potentials for specific careers.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            careerName: { type: Type.STRING },
                            earningInfo: { type: Type.STRING, description: "A sentence (markdown formatted) with quantitative data (e.g., salary ranges) for this career 2 years post-graduation." }
                        },
                        required: ["careerName", "earningInfo"]
                    }
                },
                outlook: { type: Type.STRING, description: "A concluding sentence (markdown formatted) on the financial outlook." }
            },
            required: ["summary", "careerSpecifics", "outlook"]
        },
    },
    required: ["futureStory", "popularCareers", "earningPotential"]
};

export const generateInitialAnalysis = async (subjects: string[]): Promise<BaseAnalysis> => {
    const ai = getAIClient();
    const subjectCombination = subjects.join(', ');
    const prompt = `
        You are an expert UK university admissions and careers advisor for GCSE students (age 14-15).
        Analyze the A-level subject combination: ${subjectCombination}.
        Your response must be grounded in official, authoritative UK sources like the Russell Group's 'Informed Choices' guide, UCAS, HESA, and OfQual data.
        Your analysis should first consider the types of university degrees these subjects typically lead to. Based on those degree pathways, then identify popular career paths and earning potentials.
        Provide a detailed, inspirational, and accurate analysis.
        Correct any subject name typos to their standard A-level names.
        Return the data in the specified JSON schema. Ensure all markdown fields are formatted for readability with paragraphs, bold text for emphasis on skills and figures, and lists where appropriate.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: baseAnalysisSchema,
            thinkingConfig: { thinkingBudget: 32768 }
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as BaseAnalysis;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonText);
        throw new Error("The AI returned an invalid response format.");
    }
};

export const generateUniversityCourses = async (subjects: string[], university: string = 'All Universities'): Promise<UniversityCourse[]> => {
    const ai = getAIClient();
    const subjectCombination = subjects.join(', ');
    const universityFilter = university === 'All Universities'
        ? "Provide a representative sample of 5 courses from a variety of UK Russell Group universities."
        : `Provide up to 5 courses specifically from ${university}.`;

    const prompt = `
        You are an expert UK university admissions advisor.
        For the A-level subject combination "${subjectCombination}", find suitable undergraduate degree courses.
        ${universityFilter}
        Verify all information using the official university website and UCAS. Ensure all URLs are valid and direct to the course page.
        CRITICAL RULE: For a course to be included, its 'requiredSubjects' list must ONLY contain subjects from the student's combination of "${subjectCombination}". If a course requires an A-level that the student has not chosen, it MUST be excluded. 'recommendedSubjects' can be outside this list.
        Return the data as a JSON array matching this schema:
        [{
            "courseName": "string",
            "universityName": "string",
            "url": "string (direct link to course page)",
            "typicalOffer": "string",
            "requiredSubjects": ["string"],
            "recommendedSubjects": ["string"],
            "gcseRequirements": "string"
        }]
    `;
    
     const courseSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                courseName: { type: Type.STRING },
                universityName: { type: Type.STRING },
                url: { type: Type.STRING },
                typicalOffer: { type: Type.STRING },
                requiredSubjects: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedSubjects: { type: Type.ARRAY, items: { type: Type.STRING } },
                gcseRequirements: { type: Type.STRING },
            },
            required: ["courseName", "universityName", "url", "typicalOffer", "requiredSubjects", "recommendedSubjects", "gcseRequirements"]
        }
    };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: courseSchema,
            thinkingConfig: { thinkingBudget: 32768 }
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as UniversityCourse[];
    } catch (e) {
        console.error("Failed to parse JSON response for university courses:", jsonText);
        throw new Error("The AI returned an invalid response format for university courses.");
    }
}


export const generateWhatIfStory = async (originalSubjects: string[], newCombination: string[]): Promise<string> => {
    const ai = getAIClient();
    const prompt = `
        A GCSE student is considering changing one of their A-level subjects.
        Original combination: ${originalSubjects.join(', ')}.
        New combination: ${newCombination.join(', ')}.
        Write an inspirational "Future Story" (2-3 paragraphs, markdown formatted) for them. Focus on the new possibilities and career paths opened up by this change. Maintain an encouraging and ambitious tone suitable for a 14-15 year old.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
             thinkingConfig: { thinkingBudget: 32768 }
        }
    });
    return response.text;
};


export const generateSkipInfo = async (subjects: string[]): Promise<SkipSubjectInfo[]> => {
    const ai = getAIClient();
    const prompt = `
        For each of the following A-level subjects, analyze whether a student can study a related degree at a top UK (Russell Group) university without having taken the subject at A-level.
        Subjects: ${subjects.join(', ')}.
        Rely on official UCAS and university guidance.
        For each subject, determine if it can be skipped and provide a brief explanation.
        Return the response as a JSON array with this exact structure:
        [{"subject": "Subject Name", "canSkip": boolean, "details": "Explanation..."}]
    `;
    
    const skipSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                subject: { type: Type.STRING },
                canSkip: { type: Type.BOOLEAN },
                details: { type: Type.STRING }
            },
            required: ["subject", "canSkip", "details"]
        }
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: skipSchema,
            thinkingConfig: { thinkingBudget: 32768 }
        }
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as SkipSubjectInfo[];
    } catch (e) {
        console.error("Failed to parse JSON response for skip info:", jsonText);
        return subjects.map(s => ({
            subject: s,
            canSkip: false,
            details: "Could not retrieve information for this subject."
        }));
    }
};
