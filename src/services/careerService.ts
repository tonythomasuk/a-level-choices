import { GoogleGenAI, Type } from "@google/genai";

const getApiKey = (): string => {
    return process.env.API_KEY as string;
};

const getAIClient = () => new GoogleGenAI({ apiKey: getApiKey() });

const COMMON_A_LEVEL_SUBJECTS = [
    "Mathematics", "Further Mathematics", "Physics", "Chemistry", "Biology", "Computer Science",
    "English Literature", "English Language", "History", "Geography", "Economics", "Psychology",
    "Sociology", "Religious Studies", "Philosophy", "Art and Design", "Music", "Drama",
    "French", "German", "Spanish", "Business Studies", "Accounting", "Politics"
];

const careerRequirementsSchema = {
    type: Type.OBJECT,
    properties: {
        aLevelSubjects: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: `Typical UK A-level subjects required or highly recommended. MUST be from this list or standard UK A-levels: ${COMMON_A_LEVEL_SUBJECTS.join(", ")}. Do not include non-A-level subjects like Statistics or general skills.`
        },
        universityCourses: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Typical university degree pathways for this career."
        },
        explanation: {
            type: Type.STRING,
            description: "A brief explanation of why these subjects and courses are relevant."
        }
    },
    required: ["aLevelSubjects", "universityCourses", "explanation"]
};

// Simple in-memory cache
const cache = new Map<string, any>();

export const generateCareerRequirements = async (jobTitle: string) => {
    // Check cache first
    if (cache.has(jobTitle)) {
        return cache.get(jobTitle);
    }

    const ai = getAIClient();
    const prompt = `
        You are an expert UK careers advisor.
        For the job title: "${jobTitle}", identify:
        1. Typical UK A-level subjects required or highly recommended. ONLY include standard UK A-level subjects (e.g., Mathematics, Physics, Chemistry, Biology, Computer Science, English, History, etc.). DO NOT include non-A-level subjects like Statistics, Programming, or general skills.
        2. Typical university degree pathways.
        3. A brief explanation of the relevance.
        
        Return the data as a JSON object matching the specified schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: careerRequirementsSchema
            },
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        
        // Cache the result
        cache.set(jobTitle, result);
        
        return result;
    } catch (e) {
        console.error("Failed to generate career requirements:", e);
        throw new Error("Could not generate career requirements.");
    }
};
