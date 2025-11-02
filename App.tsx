import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { SubjectSelector } from './components/SubjectSelector';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Section } from './components/Section';
import { FutureStory } from './components/FutureStory';
import { UniversityCourses } from './components/UniversityCourses';
import { PopularCareers } from './components/PopularCareers';
import { WhatIf } from './components/WhatIf';
import { SkipSubject } from './components/SkipSubject';
import { Footer } from './components/Footer';
import { generateInitialAnalysis, generateUniversityCourses, generateSkipInfo } from './services/geminiService';
import type { AnalysisResult, UniversityCourse, SkipSubjectInfo } from './types';
import { A_LEVEL_SUBJECTS } from './constants';

const SelectedSubjectsBanner: React.FC<{ subjects: string[] }> = ({ subjects }) => (
    <div className="mb-6 p-4 bg-slate-100 rounded-lg border border-slate-200 print:hidden">
        <p className="text-sm font-medium text-slate-600 mb-2">Analysis based on A-level subjects:</p>
        <div className="flex flex-wrap gap-2">
            {subjects.map((subject, index) => (
                <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm font-semibold rounded-full">
                    {subject}
                </span>
            ))}
        </div>
    </div>
);

const App: React.FC = () => {
    const [subjects, setSubjects] = useState<[string, string, string, string]>(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [skipInfo, setSkipInfo] = useState<SkipSubjectInfo[] | null>(null);
    const [visibleSections, setVisibleSections] = useState({
        section2: false,
        section3: false,
        section4: false,
    });
    const [cachedCourses, setCachedCourses] = useState<Record<string, UniversityCourse[]>>({});

    const initialSubjects = useMemo(() => {
        const shuffled = [...A_LEVEL_SUBJECTS].sort(() => 0.5 - Math.random());
        return [shuffled[0], shuffled[1], shuffled[2], ''] as [string, string, string, string];
    }, []);

    useEffect(() => {
        setSubjects(initialSubjects);
    }, [initialSubjects]);

    const handleExplore = useCallback(async (selectedSubjects: [string, string, string, string]) => {
        setSubjects(selectedSubjects); // Ensure the app's main state is updated immediately.
        
        setLoading(true);
        setError(null);
        setAnalysisResult(null);
        setSkipInfo(null);
        setCachedCourses({});
        setVisibleSections({ section2: false, section3: false, section4: false });

        const validSubjects = selectedSubjects.filter(s => s.trim() !== '');
        if (validSubjects.length < 3) {
            setError('Please select at least 3 subjects.');
            setLoading(false);
            return;
        }

        try {
            const [baseAnalysis, initialCourses, skipSubjectInfo] = await Promise.all([
                generateInitialAnalysis(validSubjects),
                generateUniversityCourses(validSubjects, 'All Universities'),
                generateSkipInfo(validSubjects)
            ]);

            const result: AnalysisResult = {
                ...baseAnalysis,
                universityCourses: initialCourses,
            };
            
            setAnalysisResult(result);
            setSkipInfo(skipSubjectInfo);
            setCachedCourses({'All Universities': initialCourses});
            setVisibleSections(prev => ({ ...prev, section2: true }));
        } catch (err) {
            console.error(err);
            setError('An error occurred while generating the analysis. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);
    
    const handleRerunAnalysis = (newSubjects: [string, string, string, string]) => {
        setSubjects(newSubjects);
        handleExplore(newSubjects);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <div className="min-h-screen font-sans text-slate-800 antialiased">
                <main className="container mx-auto max-w-4xl p-4 md:p-8">
                    <Header />
                    
                    <Section>
                        <SubjectSelector
                            initialSubjects={subjects}
                            onSubmit={handleExplore}
                            disabled={loading}
                        />
                    </Section>

                    {loading && <LoadingSpinner />}
                    {error && <div className="mt-6 text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}

                    {visibleSections.section2 && analysisResult && (
                        <>
                            <Section title="Your Future Story" iconPrompt="a book opening up to a bright path">
                                <SelectedSubjectsBanner subjects={subjects.filter(s => s)} />
                                <FutureStory story={analysisResult.futureStory} />
                            </Section>

                            <Section title="University Courses" iconPrompt="a university building with a graduation cap">
                                <SelectedSubjectsBanner subjects={subjects.filter(s => s)} />
                                <UniversityCourses 
                                    initialCourses={analysisResult.universityCourses}
                                    subjects={subjects.filter(s => s)}
                                    cachedCourses={cachedCourses}
                                    setCachedCourses={setCachedCourses}
                                />
                            </Section>

                            <div className="my-8 text-center">
                                <button
                                    onClick={() => setVisibleSections(prev => ({ ...prev, section3: true }))}
                                    className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg"
                                >
                                    Explore Careers & Earning Potential
                                </button>
                            </div>
                        </>
                    )}

                    {visibleSections.section3 && analysisResult && (
                         <>
                            <Section title="Popular Careers & Earning Potential" iconPrompt="a briefcase with a rising stock chart">
                                <SelectedSubjectsBanner subjects={subjects.filter(s => s)} />
                                <PopularCareers 
                                    careers={analysisResult.popularCareers} 
                                    earningPotential={analysisResult.earningPotential}
                                />
                            </Section>

                            <div className="my-8 text-center">
                                <button
                                    onClick={() => setVisibleSections(prev => ({ ...prev, section4: true }))}
                                    className="px-8 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-lg"
                                >
                                    Through the Looking Glass
                                </button>
                            </div>
                        </>
                    )}

                    {visibleSections.section4 && analysisResult && (
                         <>
                            <Section title="University Entry Flexibility" iconPrompt="a flexible path or a key unlocking a door">
                                <SelectedSubjectsBanner subjects={subjects.filter(s => s)} />
                                <SkipSubject info={skipInfo} />
                            </Section>

                            <Section title="What If..." iconPrompt="a crystal ball showing alternate paths">
                                <SelectedSubjectsBanner subjects={subjects.filter(s => s)} />
                                <WhatIf 
                                    currentSubjects={subjects.filter(s => s)}
                                    onRerun={handleRerunAnalysis}
                                />
                            </Section>
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </>
    );
};

export default App;