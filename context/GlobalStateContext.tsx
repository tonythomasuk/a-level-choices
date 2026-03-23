import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { DreamerCourse, AnalysisResult, SkipSubjectInfo } from '../types';

interface DreamerState {
    expandedWorldId: string | null;
    expandedCourseTitle: string | null;
    randomCourses: Record<string, DreamerCourse[]>;
}

interface GlobalState {
    subjects: [string, string, string, string];
    builderMode: 'majors' | 'subjects';
    dreamerState: DreamerState;
    analysisResult: AnalysisResult | null;
    skipInfo: SkipSubjectInfo[] | null;
    visibleSections: { section2: boolean; section3: boolean; section4: boolean; };
    setSubjects: (subjects: [string, string, string, string]) => void;
    setBuilderMode: (mode: 'majors' | 'subjects') => void;
    setDreamerState: (state: DreamerState) => void;
    setAnalysisResult: (result: AnalysisResult | null) => void;
    setSkipInfo: (info: SkipSubjectInfo[] | null) => void;
    setVisibleSections: (sections: { section2: boolean; section3: boolean; section4: boolean; }) => void;
}

const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [subjects, setSubjects] = useState<[string, string, string, string]>(() => {
        const saved = localStorage.getItem('global_subjects');
        return saved ? JSON.parse(saved) : ['', '', '', ''];
    });
    const [builderMode, setBuilderMode] = useState<'majors' | 'subjects'>(() => {
        const saved = localStorage.getItem('global_builder_mode');
        return saved ? (saved as 'majors' | 'subjects') : 'majors';
    });
    const [dreamerState, setDreamerState] = useState<DreamerState>(() => {
        const saved = localStorage.getItem('global_dreamer_state');
        return saved ? JSON.parse(saved) : { expandedWorldId: null, expandedCourseTitle: null, randomCourses: {} };
    });
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(() => {
        const saved = localStorage.getItem('global_analysis_result');
        return saved ? JSON.parse(saved) : null;
    });
    const [skipInfo, setSkipInfo] = useState<SkipSubjectInfo[] | null>(() => {
        const saved = localStorage.getItem('global_skip_info');
        return saved ? JSON.parse(saved) : null;
    });
    const [visibleSections, setVisibleSections] = useState(() => {
        const saved = localStorage.getItem('global_visible_sections');
        return saved ? JSON.parse(saved) : { section2: false, section3: false, section4: false };
    });

    useEffect(() => {
        localStorage.setItem('global_subjects', JSON.stringify(subjects));
    }, [subjects]);

    useEffect(() => {
        localStorage.setItem('global_builder_mode', builderMode);
    }, [builderMode]);

    useEffect(() => {
        localStorage.setItem('global_dreamer_state', JSON.stringify(dreamerState));
    }, [dreamerState]);

    useEffect(() => {
        localStorage.setItem('global_analysis_result', JSON.stringify(analysisResult));
    }, [analysisResult]);

    useEffect(() => {
        localStorage.setItem('global_skip_info', JSON.stringify(skipInfo));
    }, [skipInfo]);

    useEffect(() => {
        localStorage.setItem('global_visible_sections', JSON.stringify(visibleSections));
    }, [visibleSections]);

    return (
        <GlobalStateContext.Provider value={{ subjects, builderMode, dreamerState, analysisResult, skipInfo, visibleSections, setSubjects, setBuilderMode, setDreamerState, setAnalysisResult, setSkipInfo, setVisibleSections }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error('useGlobalState must be used within a GlobalStateProvider');
    }
    return context;
};
