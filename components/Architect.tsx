import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './Header';
import { SubjectSelector } from './SubjectSelector';
import { LoadingSpinner } from './LoadingSpinner';
import { Section } from './Section';
import { FutureStory } from './FutureStory';
import { PopularCareers } from './PopularCareers';
import { WhatIf } from './WhatIf';
import { SkipSubject } from './SkipSubject';
import { generateInitialAnalysis, generateSkipInfo } from '../services/geminiService';
import type { AnalysisResult, SkipSubjectInfo } from '../types';
import { A_LEVEL_SUBJECTS } from '../constants';

interface ArchitectProps {
    onBack: () => void;
    onNavigateToBuilder: () => void;
}

const SelectedSubjectsBanner: React.FC<{ subjects: string[] }> = ({ subjects }) => (
    <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50 print:hidden"
    >
        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">Analysis based on:</p>
        <div className="flex flex-wrap gap-2">
            {subjects.map((subject, index) => (
                <span key={index} className="px-3 py-1 bg-white text-indigo-700 text-sm font-bold rounded-lg shadow-sm border border-indigo-100">
                    {subject}
                </span>
            ))}
        </div>
    </motion.div>
);

const StickySummary: React.FC<{ subjects: string[] }> = ({ subjects }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setIsScrolled(window.scrollY > 400);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isScrolled && (
                <motion.div 
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    exit={{ y: -100 }}
                    className="fixed top-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm print:hidden"
                >
                    <div className="container mx-auto max-w-5xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">Exploring:</span>
                            <div className="flex gap-2">
                                {subjects.map((s, i) => (
                                    <span key={i} className="px-2 py-1 bg-indigo-600 text-white text-[10px] font-black rounded uppercase">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                        >
                            Change Subjects ↑
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const Architect: React.FC<ArchitectProps> = ({ onBack, onNavigateToBuilder }) => {
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

    const randomInitialSubjects = useMemo(() => {
        const shuffled = [...A_LEVEL_SUBJECTS].sort(() => 0.5 - Math.random());
        return [shuffled[0], shuffled[1], shuffled[2], ''] as [string, string, string, string];
    }, []);

    const handleExplore = useCallback(async (selectedSubjects: [string, string, string, string]) => {
        setSubjects(selectedSubjects);
        
        setLoading(true);
        setError(null);
        setAnalysisResult(null);
        setSkipInfo(null);
        setVisibleSections({ section2: false, section3: false, section4: false });

        const validSubjects = selectedSubjects.filter(s => s.trim() !== '');
        if (validSubjects.length < 3) {
            setError('Please select at least 3 subjects.');
            setLoading(false);
            return;
        }

        try {
            const [baseAnalysis, skipSubjectInfo] = await Promise.all([
                generateInitialAnalysis(validSubjects),
                generateSkipInfo(validSubjects)
            ]);

            const result: AnalysisResult = {
                ...baseAnalysis,
            };
            
            setAnalysisResult(result);
            setSkipInfo(skipSubjectInfo);
            setVisibleSections(prev => ({ ...prev, section2: true }));
        } catch (err) {
            console.error(err);
            setError('An error occurred while generating the analysis. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load state from localStorage on mount
    useEffect(() => {
        window.scrollTo(0, 0);
        const saved = localStorage.getItem('architect_state');
        
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSubjects(parsed.subjects);
                setAnalysisResult(parsed.analysisResult);
                setSkipInfo(parsed.skipInfo);
                setVisibleSections(parsed.visibleSections);
            } catch (e) {
                console.error('Failed to load architect state', e);
            }
        } else {
            setSubjects(randomInitialSubjects);
        }
    }, []); // Removed randomInitialSubjects dependency

    // Save state to localStorage whenever it changes
    useEffect(() => {
        const state = {
            subjects,
            analysisResult,
            skipInfo,
            visibleSections,
        };
        localStorage.setItem('architect_state', JSON.stringify(state));
    }, [subjects, analysisResult, skipInfo, visibleSections]);
    
    const handleRerunAnalysis = (newSubjects: [string, string, string, string]) => {
        setSubjects(newSubjects);
        handleExplore(newSubjects);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
            <StickySummary subjects={subjects.filter(s => s)} />
            
            <main className="container mx-auto max-w-5xl p-6">
                <Header />
                
                <Section>
                    <SubjectSelector
                        initialSubjects={subjects}
                        onSubmit={handleExplore}
                        disabled={loading}
                    />
                </Section>

                {loading && (
                    <div className="mt-8 text-center">
                        <LoadingSpinner />
                        <p className="text-indigo-600 font-bold mt-4 animate-pulse">Analyzing your subjects and generating insights...</p>
                    </div>
                )}
                {error && <div className="mt-6 text-center text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}

                <AnimatePresence mode="wait">
                    {visibleSections.section2 && analysisResult && (
                        <motion.div
                            key="section2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Section title="Your Future Story" iconPrompt="a book opening up to a bright path">
                                <SelectedSubjectsBanner subjects={subjects.filter(s => s)} />
                                <FutureStory story={analysisResult.futureStory} />
                            </Section>

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="my-12 text-center"
                            >
                                <button
                                    onClick={() => {
                                        localStorage.setItem('builder_mode', 'subjects');
                                        onNavigateToBuilder();
                                    }}
                                    className="px-10 py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-indigo-700 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-xl shadow-indigo-200 mb-8"
                                >
                                    Explore University Courses for these subjects
                                </button>
                                {!visibleSections.section3 && (
                                    <button
                                        onClick={() => setVisibleSections(prev => ({ ...prev, section3: true }))}
                                        className="px-10 py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-indigo-700 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-xl shadow-indigo-200"
                                    >
                                        Explore Careers & Earning Potential ↓
                                    </button>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {visibleSections.section3 && analysisResult && (
                        <motion.div
                            key="section3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Section title="Popular Careers & Earning Potential" iconPrompt="a briefcase with a rising stock chart">
                                <SelectedSubjectsBanner subjects={subjects.filter(s => s)} />
                                <PopularCareers 
                                    careers={analysisResult.popularCareers} 
                                    earningPotential={analysisResult.earningPotential}
                                />
                            </Section>

                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="my-12 text-center"
                            >
                                {!visibleSections.section4 && (
                                    <button
                                        onClick={() => setVisibleSections(prev => ({ ...prev, section4: true }))}
                                        className="px-10 py-4 bg-purple-600 text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-purple-700 transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-300 shadow-xl shadow-purple-200"
                                    >
                                        Through the Looking Glass ↓
                                    </button>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {visibleSections.section4 && analysisResult && (
                        <motion.div
                            key="section4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
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
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Bottom Prompt */}
                <div className="mt-16 p-8 bg-white rounded-3xl border border-indigo-100 text-center shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-2">Where to next?</h3>
                    <p className="text-slate-600 mb-4 font-medium">
                        Explore a University course-based view in <span className="font-bold text-emerald-600">The Builder</span> or want to dream up new careers? Try <span className="font-bold text-purple-600">The Dreamer</span>.
                    </p>
                    <p className="text-sm text-slate-400 font-medium">
                        Select your next path from the navigation menu at the top of the page.
                    </p>
                </div>
            </main>
        </div>
    );
};
