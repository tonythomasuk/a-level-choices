export interface UniversityCourse {
    courseName: string;
    universityName: string;
    url: string;
    typicalOffer: string;
    requiredSubjects: string[];
    recommendedSubjects: string[];
    gcseRequirements: string;
    matchingExplanation: string;
}

export interface PopularCareer {
    careerName: string;
    summary: string;
    degreePathways: string[];
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

export interface DreamerWorld {
    id: string;
    world_name: string;
    description: string;
    courses: DreamerCourse[];
}

export interface DreamerCareer {
    name: string;
    description: string;
}

export interface DreamerCourse {
    title: string;
    careers: DreamerCareer[];
    gcse: {
        mandatory: string[];
        helpful: string[];
    };
    a_level: {
        mandatory: string[];
        helpful: string[];
    };
}

export interface BuilderCourse {
    title: string;
    university: string;
    a_level: {
        mandatory: string[];
        helpful: string[];
    };
    gcse: {
        helpful: string[];
    };
    specialConditions: string;
    url?: string;
}
