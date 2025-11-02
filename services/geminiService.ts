import { GoogleGenAI, Type } from "@google/genai";
import type { BaseAnalysis, UniversityCourse, SkipSubjectInfo } from '../types';

const getApiKey = (): string => {
    return process.env.API_KEY as string;
};

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
            description: "A list of up to 5 popular careers for this subject combination, explicitly linked to degree pathways.",
            items: {
                type: Type.OBJECT,
                properties: {
                    careerName: { type: Type.STRING },
                    summary: { type: Type.STRING, description: "A one-line summary of the career and how the subjects are helpful." },
                    degreePathways: { type: Type.ARRAY, items: { type: Type.STRING }, description: "The university degree categories that typically lead to this career (e.g., 'STEM Degrees')." },
                    companies: { type: Type.ARRAY, items: { type: Type.STRING }, description: "1-2 example UK companies from different sectors that hire for this role." },
                },
                required: ["careerName", "summary", "degreePathways", "companies"]
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
        CRITICAL INSTRUCTION: Your analysis must first identify the most common university degree categories these subjects lead to (e.g., 'STEM & Engineering', 'Humanities & Social Sciences', 'Creative Arts', 'Business & Economics'). Then, for each career you suggest, you MUST populate the 'degreePathways' field with the relevant categories. This creates a clear pathway from A-levels to degree to career.
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
        You are an expert UK university admissions advisor, acting as a strict data filter.
        Your task is to find suitable undergraduate degree courses for a student with the A-level subjects: "${subjectCombination}".
        ${universityFilter}
        You must follow these rules without exception:
        1.  **Verification:** All information MUST be verified against the official university website and UCAS for the upcoming academic year. All URLs must be valid and deep-link directly to the course information page.
        2.  **Strict Subject Requirement:** A course is ONLY a valid match if its list of *required* A-level subjects is a subset of the student's subjects ("${subjectCombination}"). For example, if a student has (Maths, Physics, Chemistry) and a course requires (Maths, Physics), it is a match. If a course requires (Maths, Further Maths), it is NOT a match.
        3.  **No Extraneous Requirements:** If a course requires any A-level subject not in the student's list, it MUST be excluded from the results.
        4.  **Recommended Subjects:** 'recommendedSubjects' can include subjects outside the student's list.
        Return the data as a JSON array matching the specified schema.
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