import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2, Briefcase } from 'lucide-react';
import { DREAMER_DATA } from '../dreamerData';
import { DreamerWorld, DreamerCourse } from '../types';
import { useGlobalState } from '../context/GlobalStateContext';
import { ScrollToTop } from './ScrollToTop';
import { LoadingSpinner } from './LoadingSpinner';
import { JOB_TITLES } from '../src/constants/jobTitles';
import { generateCareerRequirements } from '../src/services/careerService';
import { toast } from 'sonner';

interface DreamerProps {
    onBack: () => void;
}

export const Dreamer: React.FC<DreamerProps> = ({ onBack }) => {
    const { dreamerState, setDreamerState } = useGlobalState();
    const { expandedWorldId, expandedCourseTitle, randomCourses } = dreamerState;

    const [searchQuery, setSearchQuery] = useState('');
    const [careerSearchQuery, setCareerSearchQuery] = useState('');
    const [careerSuggestions, setCareerSuggestions] = useState<string[]>([]);
    const [careerRequirements, setCareerRequirements] = useState<any>(null);
    const [loadingCareer, setLoadingCareer] = useState(false);

    useEffect(() => {
        if (careerSearchQuery.length > 1) {
            const filtered = JOB_TITLES.filter(job => job.toLowerCase().includes(careerSearchQuery.toLowerCase())).slice(0, 5);
            setCareerSuggestions(filtered);
        } else {
            setCareerSuggestions([]);
        }
    }, [careerSearchQuery]);

    const handleDeriveRequirements = async () => {
        setLoadingCareer(true);
        try {
            const requirements = await generateCareerRequirements(careerSearchQuery);
            setCareerRequirements(requirements);
        } catch (error) {
            toast.error('Failed to derive career requirements. Please try again.');
        } finally {
            setLoadingCareer(false);
        }
    };

    // Memoize filtered worlds for performance
    const filteredWorlds = useMemo(() => {
        if (!searchQuery.trim()) return DREAMER_DATA;
        const query = searchQuery.toLowerCase();
        return DREAMER_DATA.filter(world => 
            world.world_name.toLowerCase().includes(query) ||
            world.description.toLowerCase().includes(query) ||
            world.courses.some(course => 
                course.title.toLowerCase().includes(query) ||
                course.careers.some(career => 
                    career.name.toLowerCase().includes(query) ||
                    career.description.toLowerCase().includes(query)
                )
            )
        );
    }, [searchQuery]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleWorldToggle = (worldId: string) => {
        if (expandedWorldId === worldId) {
            setDreamerState({ ...dreamerState, expandedWorldId: null, expandedCourseTitle: null });
        } else {
            // Initialize random courses for this world if not already set
            let newRandomCourses = { ...randomCourses };
            if (!newRandomCourses[worldId]) {
                const world = DREAMER_DATA.find(w => w.id === worldId);
                if (world) {
                    newRandomCourses[worldId] = [...world.courses].sort(() => 0.5 - Math.random()).slice(0, 3);
                }
            }
            setDreamerState({ 
                ...dreamerState, 
                expandedWorldId: worldId, 
                expandedCourseTitle: null,
                randomCourses: newRandomCourses
            });
        }
    };

    const handleCourseToggle = (courseTitle: string) => {
        setDreamerState({ 
            ...dreamerState, 
            expandedCourseTitle: expandedCourseTitle === courseTitle ? null : courseTitle 
        });
    };

    const handleTryOtherCourses = (worldId: string) => {
        const world = DREAMER_DATA.find(w => w.id === worldId);
        if (world) {
            setDreamerState({ 
                ...dreamerState, 
                randomCourses: {
                    ...randomCourses,
                    [worldId]: [...world.courses].sort(() => 0.5 - Math.random()).slice(0, 3)
                },
                expandedCourseTitle: null
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
            <ScrollToTop />
            <main className="container mx-auto max-w-5xl p-6">
                <div className="py-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">The Dreamer</h2>
                        <p className="text-slate-500 text-lg font-medium">Start with the world you want to build. Explore career archetypes, discover potential courses, and identify which subjects at GCSE/A-level are needed to get there</p>
                    </motion.div>

                    {/* Explore career archetypes */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Explore career archetypes</h2>
                        <div className="space-y-6">
                            {filteredWorlds.map((world, index) => (
                                <div key={world.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div
                                        onClick={() => handleWorldToggle(world.id)}
                                        className={`cursor-pointer p-8 flex items-center justify-between transition-all ${expandedWorldId === world.id ? 'bg-purple-50' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${expandedWorldId === world.id ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-600'}`}>
                                                <span className="text-xl font-black">{index + 1}</span>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900">{world.world_name}</h3>
                                                <p className="text-slate-500 text-sm font-medium">{world.description}</p>
                                            </div>
                                        </div>
                                        <div className={`transform transition-transform ${expandedWorldId === world.id ? 'rotate-180' : ''}`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {expandedWorldId === world.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-8 pb-8"
                                            >
                                                <div className="pt-6 border-t border-slate-100">
                                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Here are some courses you might study:</h4>
                                                    <div className="space-y-4">
                                                        {(randomCourses[world.id] || []).map((course: DreamerCourse) => (
                                                            <div key={course.title} className="border border-slate-200 rounded-2xl overflow-hidden">
                                                                <div 
                                                                    onClick={() => handleCourseToggle(course.title)}
                                                                    className={`cursor-pointer p-6 flex items-center justify-between ${expandedCourseTitle === course.title ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
                                                                >
                                                                    <h5 className="font-black text-lg text-slate-900">{course.title}</h5>
                                                                    <div className={`transform transition-transform ${expandedCourseTitle === course.title ? 'rotate-180' : ''}`}>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                
                                                                <AnimatePresence>
                                                                    {expandedCourseTitle === course.title && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: 'auto', opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            className="p-6 pt-0 border-t border-slate-100 bg-slate-50"
                                                                        >
                                                                            {/* Day in the Life */}
                                                                            <div className="py-6">
                                                                                <h6 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Day in the Life (Indicative for exploration only)</h6>
                                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                                    {course.careers.slice(0, 3).map((career) => (
                                                                                        <div key={career.name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                                                            <p className="font-bold text-slate-900 mb-1 text-sm">{career.name}</p>
                                                                                            <p className="text-xs text-slate-500 leading-relaxed">{career.description}</p>
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                            {/* The Blueprint */}
                                                                            <div className="bg-slate-900 rounded-2xl p-6 text-white">
                                                                                <h6 className="text-xs font-black text-purple-400 uppercase tracking-[0.2em] mb-6">The Blueprint</h6>
                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                                                    <div>
                                                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Mandatory Keys</p>
                                                                                        <div className="space-y-3">
                                                                                            <div>
                                                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">GCSE</p>
                                                                                                <div className="flex flex-wrap gap-2">
                                                                                                    {course.gcse.mandatory.map(s => <span key={s} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold">{s}</span>)}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">A-Level</p>
                                                                                                <div className="flex flex-wrap gap-2">
                                                                                                    {course.a_level.mandatory.map(s => <span key={s} className="px-2 py-1 bg-purple-500 text-white rounded-lg text-xs font-bold">{s}</span>)}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Level-Up Boosters</p>
                                                                                        <div className="space-y-3">
                                                                                            <div>
                                                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">GCSE</p>
                                                                                                <div className="flex flex-wrap gap-2">
                                                                                                    {course.gcse.helpful.map(s => <span key={s} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold">{s}</span>)}
                                                                                                </div>
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">A-Level</p>
                                                                                                <div className="flex flex-wrap gap-2">
                                                                                                    {course.a_level.helpful.map(s => <span key={s} className="px-2 py-1 bg-indigo-500 text-white rounded-lg text-xs font-bold">{s}</span>)}
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        ))}
                                                        <button
                                                            onClick={() => handleTryOtherCourses(world.id)}
                                                            className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                                                        >
                                                            Try other courses
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Explore specific careers */}
                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-purple-100 mb-12 space-y-6">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Explore specific careers</h2>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="text"
                                value={careerSearchQuery}
                                onChange={(e) => setCareerSearchQuery(e.target.value)}
                                placeholder="Search for a specific job title..."
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all font-medium"
                            />
                            {careerSuggestions.length > 0 && careerSearchQuery && (
                                <ul className="absolute z-10 w-full bg-white border border-slate-200 rounded-2xl mt-2 shadow-lg max-h-60 overflow-y-auto">
                                    {careerSuggestions.map(job => (
                                        <li 
                                            key={job} 
                                            onClick={() => {
                                                setCareerSearchQuery(job);
                                                setCareerSuggestions([]);
                                            }}
                                            className="px-4 py-3 hover:bg-purple-50 cursor-pointer text-sm font-medium"
                                        >
                                            {job}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button
                            onClick={handleDeriveRequirements}
                            disabled={loadingCareer || !careerSearchQuery.trim()}
                            className="w-full py-4 bg-purple-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
                        >
                            {loadingCareer ? 'Deriving requirements...' : 'Derive requirements'}
                        </button>

                        {loadingCareer && (
                            <div className="mt-4 text-center">
                                <LoadingSpinner messages={["Analyzing career pathways...", "Identifying A-level subjects...", "Mapping university courses..."]} />
                            </div>
                        )}

                        {careerRequirements && !loadingCareer && (
                            <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                                <h3 className="font-black text-lg mb-4">{careerSearchQuery} Requirements</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">A-Level Subjects</p>
                                        <div className="flex flex-wrap gap-2">
                                            {careerRequirements.aLevelSubjects.map((s: string) => <span key={s} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-bold">{s}</span>)}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">University Courses</p>
                                        <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                                            {careerRequirements.universityCourses.map((c: string) => <li key={c}>{c}</li>)}
                                        </ul>
                                    </div>
                                    <p className="text-sm text-slate-600 italic">{careerRequirements.explanation}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Bottom Prompt */}
                    <div className="mt-16 p-8 bg-white rounded-3xl border border-purple-100 text-center shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-2">Where to next?</h3>
                        <p className="text-slate-600 mb-4 font-medium">
                            Explore a subject-based view in <span className="font-bold text-indigo-600">The Architect</span> or a University course-based view in <span className="font-bold text-emerald-600">The Builder</span>.
                        </p>
                        <p className="text-sm text-slate-400 font-medium">
                            Select your next path from the navigation menu at the top of the page.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};
