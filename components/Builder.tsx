import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UNIVERSITY_SUBJECT_CATEGORIES, RUSSELL_GROUP_UNIVERSITIES } from '../constants';
import { generateBuilderCourses } from '../services/geminiService';
import { BuilderCourse } from '../types';
import { LoadingSpinner } from './LoadingSpinner';

interface BuilderProps {
    onHandshake: (subjects: string[]) => void;
    onBack: () => void;
}

export const Builder: React.FC<BuilderProps> = ({ onHandshake, onBack }) => {
    const [major, setMajor] = useState('');
    const [minor1, setMinor1] = useState('');
    const [minor2, setMinor2] = useState('');
    const [targetUnis, setTargetUnis] = useState<string[]>(['', '', '']);
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<BuilderCourse[]>([]);
    const [error, setError] = useState<string | null>(null);

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
            {/* Header */}
            <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-30">
                <div className="container mx-auto max-w-5xl flex items-center justify-between">
                    <button onClick={onBack} className="flex items-center text-slate-500 hover:text-slate-900 transition-colors font-bold text-sm uppercase tracking-widest">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Nexus
                    </button>
                    <div className="text-center">
                        <h1 className="text-xl font-black tracking-tighter">THE <span className="text-emerald-600">BUILDER</span></h1>
                    </div>
                    <div className="w-24"></div>
                </div>
            </header>

            <main className="container mx-auto max-w-5xl p-6">
                <div className="py-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Construct Your Course</h2>
                        <p className="text-slate-500 text-lg font-medium">Choose your Major and optional Minors to find the perfect Russell Group combination.</p>
                    </motion.div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 mb-12">
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

                    {loading && <LoadingSpinner />}

                    {courses.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-center"
                        >
                            <p className="text-emerald-800 font-medium text-sm">
                                <span className="font-black uppercase tracking-widest text-[10px] block mb-1">Note</span>
                                This listing is an illustration of the range of choices offered by different universities and is not meant to be a comprehensive database of all available courses.
                            </p>
                        </motion.div>
                    )}

                    <div className="space-y-8">
                        {courses.map((course, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden"
                            >
                                <div className="p-8">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                                        <div>
                                            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100 mb-4">
                                                {course.university}
                                            </span>
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{course.title}</h3>
                                        </div>
                                        {course.url && (
                                            <a 
                                                href={course.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all text-center"
                                            >
                                                View Course Page
                                            </a>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                        {/* A-Level Requirements */}
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Mandatory A-Levels</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {course.a_level.mandatory.map(s => (
                                                        <span key={s} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Helpful A-Levels</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {course.a_level.helpful.map(s => (
                                                        <span key={s} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-100">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* GCSE & Special Conditions */}
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Helpful GCSEs</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {course.gcse.helpful.map(s => (
                                                        <span key={s} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Special Conditions</h4>
                                                <p className="text-sm text-slate-600 font-medium leading-relaxed">{course.specialConditions}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-100">
                                        <button 
                                            onClick={() => onHandshake(course.a_level.mandatory)}
                                            className="w-full py-4 bg-emerald-50 text-emerald-700 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-emerald-100 transition-all"
                                        >
                                            🤝 Check my current subjects against this path
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};
