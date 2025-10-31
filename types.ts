

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
  subjectRequirements?: string;
  link: string;
}

// Removed the AIStudio interface and global Window declaration for aistudio.
// The application no longer uses window.aistudio for API key management.