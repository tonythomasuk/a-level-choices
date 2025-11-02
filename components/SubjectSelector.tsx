import React, { useState, useEffect } from 'react';
import { A_LEVEL_SUBJECTS } from '../constants';

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
        <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg border border-slate-200">
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {subjects.map((subject, index) => (
                        <div key={index}>
                            <label htmlFor={`subject-${index}`} className="block text-sm font-medium text-slate-700 mb-1">
                                Subject {index + 1} <span className={index < 3 ? "text-red-500" : "text-slate-400"}>{index < 3 ? '(Mandatory)' : '(Optional)'}</span>
                            </label>
                            <select
                                id={`subject-${index}`}
                                value={subject}
                                onChange={(e) => handleChange(index, e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                required={index < 3}
                                disabled={disabled}
                            >
                                <option value="" disabled>Select a subject...</option>
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
                        </div>
                    ))}
                </div>
                <p className="text-xs text-slate-500 mt-4">
                    Choose 3 to 4 A-level subjects you're interested in. You'll have a chance to explore alternatives later.
                </p>
                <div className="mt-6 text-center">
                    <button
                        type="submit"
                        disabled={disabled}
                        className="w-full md:w-auto px-10 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-lg"
                    >
                        Explore Possible Futures
                    </button>
                </div>
            </form>
        </div>
    );
};