import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UNIVERSITY_SUBJECT_CATEGORIES, RUSSELL_GROUP_UNIVERSITIES } from '../constants';
import { generateBuilderCourses } from '../services/geminiService';
import { BuilderCourse, UniversityCourse } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { UniversityCourses } from './UniversityCourses';
import { CourseCard } from './CourseCard';

interface BuilderProps {
    onBack: () => void;
}

export const Builder: React.FC<BuilderProps> = ({ onBack }) => {
    const [mode, setMode] = useState<'majors' | 'subjects'>(() => {
        const builderMode = localStorage.getItem('builder_mode');
        if (builderMode) {
            localStorage.removeItem('builder_mode');
            return builderMode as 'majors' | 'subjects';
        }
        return 'majors';
    });
    const [major, setMajor] = useState('');
    const [minor1, setMinor1] = useState('');
    const [minor2, setMinor2] = useState('');
    const [targetUnis, setTargetUnis] = useState<string[]>(['', '', '']);
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<BuilderCourse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [cachedCourses, setCachedCourses] = useState<Record<string, UniversityCourse[]>>({});

    // Load state from localStorage on mount
    useEffect(() => {
        window.scrollTo(0, 0);
        const saved = localStorage.getItem('builder_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setMajor(parsed.major || '');
                setMinor1(parsed.minor1 || '');
                setMinor2(parsed.minor2 || '');
                setTargetUnis(parsed.targetUnis || ['', '', '']);
                setCourses(parsed.courses || []);
                setCachedCourses(parsed.cachedCourses || {});
                if (parsed.mode) {
                    setMode(parsed.mode);
                }
            } catch (e) {
                console.error('Failed to load builder state', e);
            }
        }
        
        const builderMode = localStorage.getItem('builder_mode');
        if (builderMode) {
            setMode(builderMode as 'majors' | 'subjects');
            localStorage.removeItem('builder_mode');
        }
        
        const architectSaved = localStorage.getItem('architect_state');
        if (architectSaved) {
            try {
                const parsed = JSON.parse(architectSaved);
                setSubjects(parsed.subjects.filter((s: string) => s.trim() !== ''));
            } catch (e) {
                console.error('Failed to load architect state', e);
            }
        }
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        const state = { major, minor1, minor2, targetUnis, courses, cachedCourses, mode };
        localStorage.setItem('builder_state', JSON.stringify(state));
    }, [major, minor1, minor2, targetUnis, courses, cachedCourses, mode]);

    const canUseSubjectsMode = subjects.length >= 3;

    const toggleMode = (newMode: 'majors' | 'subjects') => {
        if (newMode === 'subjects' && !canUseSubjectsMode) {
            setError('Please select at least 3 subjects in The Architect first.');
            return;
        }
        setMode(newMode);
        setError(null);
    };

    const handleSearch = async () => {
        if (!major) {
            setError('Major is mandatory.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const selectedUnis = targetUnis.filter(u => u !== '');
            const results = await generateBuilderCourses(major, [minor1, minor2], selectedUnis);
            setCourses(results);
        } catch (err) {
            console.error(err);
            setError('Failed to find courses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateTargetUni = (index: number, value: string) => {
        const newUnis = [...targetUnis];
        newUnis[index] = value;
        setTargetUnis(newUnis);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
            <main className="container mx-auto max-w-5xl p-6">
                <div className="py-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <p className="text-slate-400 text-sm font-medium mb-2">
                            Choose between exploring courses by specific majors or by A-level subjects you've selected in The Architect.
                        </p>
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">The Builder</h2>
                        <div className="flex justify-center gap-4 mb-6">
                            <button 
                                onClick={() => toggleMode('majors')}
                                className={`px-6 py-2 rounded-full font-bold text-sm ${mode === 'majors' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'}`}
                            >
                                Majors/Minors
                            </button>
                            <button 
                                onClick={() => toggleMode('subjects')}
                                className={`px-6 py-2 rounded-full font-bold text-sm ${mode === 'subjects' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'} ${!canUseSubjectsMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Subjects
                            </button>
                        </div>
                        <p className="text-slate-500 text-lg font-medium">
                            {mode === 'majors' ? 'Choose your Major and optional Minors to find the perfect Russell Group combination.' : 'Explore courses based on your A-level choices.'}
                        </p>
                    </motion.div>

                    {mode === 'majors' && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 mb-12">
                            {/* ... existing majors/minors form ... */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                {/* Major */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Major (Mandatory)</label>
                                    <select 
                                        value={major}
                                        onChange={(e) => setMajor(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    >
                                        <option value="">Select Major</option>
                                        {UNIVERSITY_SUBJECT_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Minor 1 */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Minor 1 (Optional)</label>
                                    <select 
                                        value={minor1}
                                        onChange={(e) => setMinor1(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    >
                                        <option value="">Select Minor</option>
                                        {UNIVERSITY_SUBJECT_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Minor 2 */}
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Minor 2 (Optional)</label>
                                    <select 
                                        value={minor2}
                                        onChange={(e) => setMinor2(e.target.value)}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    >
                                        <option value="">Select Minor</option>
                                        {UNIVERSITY_SUBJECT_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Target Universities */}
                            <div className="mb-8 pt-8 border-t border-slate-100">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Target Russell Group Universities (Optional - Prioritised in search)</label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {targetUnis.map((uni, idx) => (
                                        <select 
                                            key={idx}
                                            value={uni}
                                            onChange={(e) => updateTargetUni(idx, e.target.value)}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                        >
                                            <option value="">Select University {idx + 1}</option>
                                            {RUSSELL_GROUP_UNIVERSITIES.map(u => (
                                                <option key={u} value={u}>{u}</option>
                                            ))}
                                        </select>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={handleSearch}
                                disabled={loading || !major}
                                className="w-full py-4 bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-emerald-700 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
                            >
                                {loading ? 'Searching Russell Group...' : 'Find Combinations'}
                            </button>
                            {error && <p className="mt-4 text-center text-red-600 font-bold text-sm">{error}</p>}
                        </div>
                    )}

                    {loading && (
                        <div className="mt-8 text-center">
                            <LoadingSpinner />
                            <p className="text-emerald-600 font-bold mt-4 animate-pulse">Searching for the perfect courses...</p>
                        </div>
                    )}

                    {mode === 'majors' && courses.length > 0 && (
                        <div className="space-y-8">
                            {courses.map((course, index) => (
                                <CourseCard
                                    key={index}
                                    title={course.title}
                                    university={course.university}
                                    mandatorySubjects={course.a_level?.mandatory || []}
                                    helpfulSubjects={course.a_level?.helpful || []}
                                    helpfulGCSEs={course.gcse?.helpful || []}
                                    specialConditions={course.specialConditions}
                                    url={course.url}
                                />
                            ))}
                        </div>
                    )}

                    {mode === 'subjects' && subjects.length > 0 && (
                        <div className="mb-12 p-8 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
                            <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">University Courses based on your subjects: {subjects.join(', ')}</h3>
                            <UniversityCourses 
                                initialCourses={[]}
                                subjects={subjects}
                                cachedCourses={cachedCourses}
                                setCachedCourses={setCachedCourses}
                            />
                        </div>
                    )}
                </div>

                {/* Bottom Prompt */}
                <div className="mt-16 p-8 bg-white rounded-3xl border border-emerald-100 text-center shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-2">Where to next?</h3>
                    <p className="text-slate-600 mb-4 font-medium">
                        Explore more career choices based on subjects in <span className="font-bold text-indigo-600">The Architect</span> or want to start with a vision? Try <span className="font-bold text-purple-600">The Dreamer</span>.
                    </p>
                    <p className="text-sm text-slate-400 font-medium">
                        Select your next path from the navigation menu at the top of the page.
                    </p>
                </div>
            </main>
        </div>
    );
};
