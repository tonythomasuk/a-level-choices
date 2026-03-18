import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DREAMER_DATA } from '../dreamerData';
import { DreamerWorld, DreamerCourse } from '../types';

interface DreamerProps {
    onBack: () => void;
}

export const Dreamer: React.FC<DreamerProps> = ({ onBack }) => {
    const [selectedWorld, setSelectedWorld] = useState<DreamerWorld | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<DreamerCourse | null>(null);

    // Load state from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('dreamer_state');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.selectedWorldId) {
                    const world = DREAMER_DATA.find(w => w.id === parsed.selectedWorldId);
                    if (world) {
                        setSelectedWorld(world);
                        if (parsed.selectedCourseTitle) {
                            const course = world.courses.find(c => c.title === parsed.selectedCourseTitle);
                            if (course) setSelectedCourse(course);
                        }
                    }
                }
            } catch (e) {
                console.error('Failed to load dreamer state', e);
            }
        }
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        const state = {
            selectedWorldId: selectedWorld?.id,
            selectedCourseTitle: selectedCourse?.title
        };
        localStorage.setItem('dreamer_state', JSON.stringify(state));
    }, [selectedWorld, selectedCourse]);

    const handleWorldSelect = (world: DreamerWorld) => {
        setSelectedWorld(world);
        setSelectedCourse(null);
    };

    const handleCourseSelect = (course: DreamerCourse) => {
        setSelectedCourse(course);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
            <main className="container mx-auto max-w-5xl p-6">
                {!selectedWorld ? (
                    <div className="py-12">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Discovery</h2>
                            <p className="text-slate-500 text-lg font-medium">Select a major subject area to begin your journey.</p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {DREAMER_DATA.map((world, index) => (
                                <motion.div
                                    key={world.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.03, translateY: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleWorldSelect(world)}
                                    className="cursor-pointer bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-purple-500/30 transition-all group"
                                >
                                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <span className="text-xl font-black">{index + 1}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-2">{world.world_name}</h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{world.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="py-8">
                        {/* World Detail / Course Selection */}
                        <div className="mb-12">
                            <button 
                                onClick={() => setSelectedWorld(null)}
                                className="mb-6 text-purple-600 font-bold text-xs uppercase tracking-widest flex items-center hover:underline"
                            >
                                ← Back to Discovery
                            </button>
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                                <div>
                                    <h2 className="text-5xl font-black text-slate-900 mb-2 tracking-tighter">{selectedWorld.world_name}</h2>
                                    <p className="text-slate-500 text-xl font-medium">{selectedWorld.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Course List */}
                            <div className="lg:col-span-1 space-y-4">
                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Select a Course</h3>
                                {selectedWorld.courses.map((course) => (
                                    <div 
                                        key={course.title}
                                        onClick={() => handleCourseSelect(course)}
                                        className={`cursor-pointer p-6 rounded-2xl border transition-all ${selectedCourse?.title === course.title ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-white border-slate-200 text-slate-900 hover:border-purple-300'}`}
                                    >
                                        <h4 className="font-black text-lg">{course.title}</h4>
                                    </div>
                                ))}
                            </div>

                            {/* Course Detail / Blueprint */}
                            <div className="lg:col-span-2">
                                <AnimatePresence mode="wait">
                                    {selectedCourse ? (
                                        <motion.div
                                            key={selectedCourse.title}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="space-y-8"
                                        >
                                            {/* Careers */}
                                            <section>
                                                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Day in the Life</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {selectedCourse.careers.map((career) => (
                                                        <div key={career} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                            <h4 className="font-black text-xl text-slate-900 mb-2">{career}</h4>
                                                            <p className="text-slate-500 text-sm font-medium">Building the future of {selectedCourse.title.toLowerCase()}.</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            {/* The Blueprint */}
                                            <section className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full" />
                                                <div className="relative z-10">
                                                    <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-8">The Blueprint</h3>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                                        {/* Mandatory Keys */}
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-6">
                                                                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                                                    </svg>
                                                                </div>
                                                                <h4 className="text-lg font-black tracking-tight">Mandatory Keys</h4>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">GCSE</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {selectedCourse.gcse.mandatory.map(s => <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm font-bold">{s}</span>)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">A-Level</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {selectedCourse.a_level.mandatory.map(s => <span key={s} className="px-3 py-1 bg-purple-500 text-white rounded-lg text-sm font-bold">{s}</span>)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Level-Up Boosters */}
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-6">
                                                                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                                    </svg>
                                                                </div>
                                                                <h4 className="text-lg font-black tracking-tight">Level-Up Boosters</h4>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">GCSE</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {selectedCourse.gcse.helpful.map(s => <span key={s} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm font-bold">{s}</span>)}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">A-Level</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {selectedCourse.a_level.helpful.map(s => <span key={s} className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-sm font-bold">{s}</span>)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </motion.div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-[2rem]">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Select a course to view the blueprint</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
