
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
import { generateInitialAnalysis, generateUniversityCourses } from './services/geminiService';
import type { AnalysisResult, UniversityCourse, SavedState } from './types';
import { A_LEVEL_SUBJECTS } from './constants';

const SAVE_KEY = 'alevel-explorer-save';

const App: React.FC = () => {
    const [subjects, setSubjects] = useState<[string, string, string, string]>(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [visibleSections, setVisibleSections] = useState({
        section2: false,
        section3: false,
        section4: false,
    });
    const [cachedCourses, setCachedCourses] = useState<Record<string, UniversityCourse[]>>({});
    const [saveDataExists, setSaveDataExists] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);

    const initialSubjects = useMemo(() => {
        const shuffled = [...A_LEVEL_SUBJECTS].sort(() => 0.5 - Math.random());
        return [shuffled[0], shuffled[1], shuffled[2], ''] as [string, string, string, string];
    }, []);

    useEffect(() => {
        setSubjects(initialSubjects);
        if (localStorage.getItem(SAVE_KEY)) {
            setSaveDataExists(true);
        }
    }, [initialSubjects]);

    const handleExplore = useCallback(async (selectedSubjects: [string, string, string, string]) => {
        setLoading(true);
        setError(null);
        setAnalysisResult(null);
        setCachedCourses({});
        setVisibleSections({ section2: false, section3: false, section4: false });

        const validSubjects = selectedSubjects.filter(s => s.trim() !== '');
        if (validSubjects.length < 3) {
            setError('Please select at least 3 subjects.');
            setLoading(false);
            return;
        }

        try {
            const [baseAnalysis, initialCourses] = await Promise.all([
                generateInitialAnalysis(validSubjects),
                generateUniversityCourses(validSubjects, 'All Universities')
            ]);

            const result: AnalysisResult = {
                ...baseAnalysis,
                universityCourses: initialCourses,
            };
            
            setAnalysisResult(result);
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

    const handleSave = () => {
        if (!analysisResult) return;

        const stateToSave: SavedState = {
            subjects,
            analysisResult,
            visibleSections,
            cachedCourses
        };

        localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
        setSaveDataExists(true);
        setNotification('Analysis saved successfully!');
        setTimeout(() => setNotification(null), 3000);
    };

    const handleLoad = () => {
        const savedDataString = localStorage.getItem(SAVE_KEY);
        if (savedDataString) {
            try {
                const savedState: SavedState = JSON.parse(savedDataString);
                setSubjects(savedState.subjects);
                setAnalysisResult(savedState.analysisResult);
                setVisibleSections(savedState.visibleSections);
                setCachedCourses(savedState.cachedCourses);
                setError(null);
                setLoading(false);
                setNotification('Analysis loaded successfully!');
                setTimeout(() => setNotification(null), 3000);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (e) {
                console.error("Failed to load saved state:", e);
                setNotification('Failed to load analysis. The data may be corrupt.');
                setTimeout(() => setNotification(null), 3000);
                localStorage.removeItem(SAVE_KEY);
                setSaveDataExists(false);
            }
        }
    };

    return (
        <>
            <div className="min-h-screen font-sans text-slate-800 antialiased">
                <main className="container mx-auto max-w-4xl p-4 md:p-8">
                    <Header 
                        onSave={handleSave}
                        onLoad={handleLoad}
                        isSaveDisabled={!analysisResult || loading}
                        isLoadDisabled={!saveDataExists}
                    />
                    
                    {notification && (
                        <div className="fixed top-5 right-5 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-out z-50">
                            {notification}
                        </div>
                    )}

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
                                <FutureStory story={analysisResult.futureStory} />
                            </Section>

                            <Section title="University Courses" iconPrompt="a university building with a graduation cap">
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
                                <SkipSubject subjects={subjects.filter(s => s)} />
                            </Section>

                            <Section title="What If..." iconPrompt="a crystal ball showing alternate paths">
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