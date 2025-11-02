export interface UniversityCourse {
    courseName: string;
    universityName: string;
    url: string;
    typicalOffer: string;
    requiredSubjects: string[];
    recommendedSubjects: string[];
    gcseRequirements: string;
}

export interface PopularCareer {
    careerName: string;
    summary: string;
    companies: string[];
}

export interface FutureStory {
    introduction: string;
    body: string;
    conclusion: string;
}

export interface EarningPotential {
    summary: string;
    careerSpecifics: {
        careerName: string;
        earningInfo: string;
    }[];
    outlook: string;
}

// Base type for the main analysis (story, careers, earnings)
export interface BaseAnalysis {
    futureStory: FutureStory;
    popularCareers: PopularCareer[];
    earningPotential: EarningPotential;
}

// Full result type including the university courses
export interface AnalysisResult extends BaseAnalysis {
    universityCourses: UniversityCourse[];
}

export interface SkipSubjectInfo {
    subject: string;
    canSkip: boolean;
    details: string;
}

export interface SavedState {
    subjects: [string, string, string, string];
    analysisResult: AnalysisResult | null;
    visibleSections: {
        section2: boolean;
        section3: boolean;
        section4: boolean;
    };
    cachedCourses: Record<string, UniversityCourse[]>;
}
