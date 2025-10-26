

export interface UniversityCourse {
  name: string;
  university: string;
}

export interface Career {
  name:string;
  description: string;
}

export interface EarningInfo {
  range: string;
  details: string;
}

export interface CareerPersona {
  title: string;
  description: string;
}

export interface Section2Data {
  careerPersona: CareerPersona;
  futureStory: string;
  universityCourses: UniversityCourse[];
  popularCareers: Career[];
  earningPotential: EarningInfo;
}

export interface WhatIfScenario {
  substitutedSubject: string;
  newCombination: string[];
  scenarioStory: string;
}

export interface SkippableSubjectInfo {
  subject: string;
  isSkippable: boolean;
  reason: string;
}

export interface InitialReportData {
  section2Data: Section2Data;
  skippableSubjects: SkippableSubjectInfo[];
}

export interface CourseRequirements {
  requirements: string;
  link: string;
}

// Fix: Define the AIStudio interface to be used in the global Window declaration.
// This resolves the "All declarations of 'aistudio' must have identical modifiers"
// and "Subsequent property declarations must have the same type" errors.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

// Declare window.aistudio globally in a single place to avoid conflicts.
declare global {
  interface Window {
    aistudio: AIStudio;
  }
}
