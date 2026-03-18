import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import type { BaseAnalysis, UniversityCourse, SkipSubjectInfo, BuilderCourse } from '../types';

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
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: baseAnalysisSchema,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
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

export const generateBuilderCourses = async (major: string, minors: string[], targetUniversities: string[] = []): Promise<BuilderCourse[]> => {
    const ai = getAIClient();
    const uniFilter = targetUniversities.length > 0 
        ? `Prioritize searching for courses at these specific universities: ${targetUniversities.join(', ')}. If courses are available at these universities, include them first. `
        : "";
    const prompt = `
        You are an expert UK university admissions advisor.
        A student wants to study a combination of "${major}" as a major and "${minors.join(', ')}" as minors at a Russell Group university.
        ${uniFilter}Search across the 24 Russell Group Universities and identify up to 10 undergraduate course titles featuring this particular combination (e.g., Joint Honours, Major/Minor, or single honours that heavily feature these subjects).
        For each course, provide:
        1. Course Title
        2. University Name
        3. Mandatory A-level subjects (subjects they MUST study)
        4. Helpful A-level subjects (not required but beneficial)
        5. Helpful GCSE subjects (not required but beneficial)
        6. Any relevant special conditions (e.g., portfolios, interviews, specific grades in certain subjects).
        7. A valid URL to the course page if possible.
        
        Return the data as a JSON array matching the specified schema.
    `;
    
    const builderSchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                university: { type: Type.STRING },
                a_level: {
                    type: Type.OBJECT,
                    properties: {
                        mandatory: { type: Type.ARRAY, items: { type: Type.STRING } },
                        helpful: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["mandatory", "helpful"]
                },
                gcse: {
                    type: Type.OBJECT,
                    properties: {
                        helpful: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["helpful"]
                },
                specialConditions: { type: Type.STRING },
                url: { type: Type.STRING }
            },
            required: ["title", "university", "a_level", "gcse", "specialConditions"]
        }
    };

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: builderSchema
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as BuilderCourse[];
    } catch (e) {
        console.error("Failed to parse JSON response for builder courses:", jsonText);
        throw new Error("The AI returned an invalid response format for builder courses.");
    }
};

export const generateUniversityCourses = async (subjects: string[], university: string = 'All Universities'): Promise<UniversityCourse[]> => {
    const ai = getAIClient();
    const subjectCombination = subjects.join(', ');
    const universityFilter = university === 'All Universities'
        ? "Provide a representative sample of 5 courses from a variety of UK Russell Group universities."
        : `Provide up to 5 courses specifically from ${university}.`;

    const prompt = `
        You are an expert UK university admissions advisor, acting as a nuanced data filter.
        Your task is to find suitable undergraduate degree courses for a student with the A-level subjects: "${subjectCombination}".
        ${universityFilter}
        You must follow these rules:
        1.  **Verification:** All information MUST be verified against the official university website and UCAS for the upcoming academic year. All URLs must be valid and deep-link directly to the course information page.
        2.  **Subject Matching:** A course is a valid match if its list of *required* A-level subjects is a subset of the student's subjects ("${subjectCombination}"). Use fuzzy matching for subject names (e.g., "Maths" matches "Mathematics", "Biology" matches "a science subject").
        3.  **No Extraneous Requirements:** If a course requires any A-level subject not in the student's list, it MUST be excluded from the results.
        4.  **Recommended Subjects:** 'recommendedSubjects' can include subjects outside the student's list.
        5.  **Matching Explanation:** Provide a detailed explanation in 'matchingExplanation' about how the student's subjects fit the course requirements, especially for recommended subjects. For example, "Your Maths and Physics are required, and your Chemistry is highly recommended for this Engineering course."
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
                matchingExplanation: { type: Type.STRING, description: "Detailed explanation of how the student's subjects fit the requirements." },
            },
            required: ["courseName", "universityName", "url", "typicalOffer", "requiredSubjects", "recommendedSubjects", "gcseRequirements", "matchingExplanation"]
        }
    };

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: courseSchema
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
        model: "gemini-3-flash-preview",
        contents: prompt
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
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: skipSchema
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

export const mapCareerToDreamerCourse = async (careerInput: string, worlds: any[]): Promise<{ worldId: string, courseTitle: string } | null> => {
    const ai = getAIClient();
    const worldsInfo = worlds.map(w => ({
        id: w.id,
        name: w.world_name,
        courses: w.courses.map(c => c.title)
    }));

    const prompt = `
        You are a career mapping expert.
        A student says: "${careerInput}".
        Map this interest to the most relevant "World" and "Course" from the following list:
        ${JSON.stringify(worldsInfo)}
        
        Return ONLY a JSON object with "worldId" and "courseTitle". If no reasonable match exists, return null.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    worldId: { type: Type.STRING },
                    courseTitle: { type: Type.STRING }
                },
                required: ["worldId", "courseTitle"]
            }
        },
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse career mapping:", jsonText);
        return null;
    }
};
