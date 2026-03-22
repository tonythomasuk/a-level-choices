import React, { useState, useEffect } from 'react';
import { A_LEVEL_SUBJECTS } from '../constants';
import { motion } from 'motion/react';

interface SubjectSelectorProps {
    initialSubjects: [string, string, string, string];
    onSubmit: (subjects: [string, string, string, string]) => void;
    disabled: boolean;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({ initialSubjects, onSubmit, disabled }) => {
    const [subjects, setSubjects] = useState<[string, string, string, string]>(initialSubjects);

    useEffect(() => {
        setSubjects(initialSubjects);
    }, [initialSubjects]);

    const handleChange = (index: number, value: string) => {
        const newSubjects = [...subjects] as [string, string, string, string];
        newSubjects[index] = value;
        setSubjects(newSubjects);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(subjects);
    };
    
    const selectedSubjects = subjects.filter(s => s !== '');

    return (
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-2xl shadow-indigo-100/50 border border-indigo-50/50">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Select Your A-level Combination</h3>
                <p className="text-sm text-slate-500">
                    Choose 3 mandatory subjects and 1 optional subject to see where they could take you.
                </p>
                <p className="text-xs text-slate-400 mt-2 italic">Schools may sometimes label subjects differently e.g., "Politics" is here listed under "Government and Politics".</p>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subjects.map((subject, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <label htmlFor={`subject-${index}`} className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                                {index < 3 ? `Mandatory Subject ${index + 1}` : 'Optional 4th Subject'}
                            </label>
                            <div className="relative">
                                <select
                                    id={`subject-${index}`}
                                    value={subject}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent rounded-xl focus:outline-none focus:ring-0 focus:border-indigo-500 transition-all appearance-none cursor-pointer font-medium text-slate-700 hover:bg-slate-100"
                                    required={index < 3}
                                    disabled={disabled}
                                >
                                    <option value="" disabled>Choose a subject...</option>
                                    {A_LEVEL_SUBJECTS.map(s => (
                                        <option
                                            key={s}
                                            value={s}
                                            disabled={selectedSubjects.includes(s) && s !== subject}
                                        >
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold ${selectedSubjects.length >= i ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                                    {selectedSubjects.length >= i ? '✓' : i}
                                </div>
                            ))}
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                            {selectedSubjects.length < 3 ? `${3 - selectedSubjects.length} more needed` : 'Ready to explore!'}
                        </span>
                    </div>
                    
                    <button
                        type="submit"
                        disabled={disabled || selectedSubjects.length < 3}
                        className="w-full md:w-auto px-12 py-4 bg-indigo-600 text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-indigo-700 transition-all transform hover:scale-105 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed shadow-xl shadow-indigo-100"
                    >
                        {disabled ? 'Analyzing...' : 'Explore Possible Futures'}
                    </button>
                </div>
            </form>
        </div>
    );
};
