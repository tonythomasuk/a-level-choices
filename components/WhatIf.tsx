
import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { A_LEVEL_SUBJECTS } from '../constants';
import { generateWhatIfStory } from '../services/geminiService';
import { marked } from 'marked';

interface WhatIfProps {
    currentSubjects: string[];
    onRerun: (newSubjects: [string, string, string, string]) => void;
}

export const WhatIf: React.FC<WhatIfProps> = ({ currentSubjects, onRerun }) => {
    const [subjectToReplace, setSubjectToReplace] = useState(currentSubjects[0]);
    const [newSubject, setNewSubject] = useState('');
    const [newStory, setNewStory] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerateStory = useCallback(async () => {
        if (!subjectToReplace || !newSubject || subjectToReplace === newSubject) {
            setError('Please select a subject to replace and a different new subject.');
            return;
        }
        setLoading(true);
        setError('');
        setNewStory('');

        const newCombination = currentSubjects.map(s => s === subjectToReplace ? newSubject : s);
        
        try {
            const story = await generateWhatIfStory(currentSubjects, newCombination);
            setNewStory(story);
        } catch (err) {
            console.error(err);
            setError('Could not generate the new story. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [subjectToReplace, newSubject, currentSubjects]);

    const handleRerun = () => {
        const newSubjectsCombination = currentSubjects.map(s => s === subjectToReplace ? newSubject : s);
        // Ensure the array has 4 elements for the parent state
        while (newSubjectsCombination.length < 4) {
            newSubjectsCombination.push('');
        }
        onRerun(newSubjectsCombination as [string, string, string, string]);
    };

    const newStoryHtml = marked.parse(newStory);

    return (
        <div>
            <p className="mb-4">Explore how your future could change by swapping just one subject.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-slate-50/50 rounded-3xl border border-slate-100">
                <div>
                    <label htmlFor="replace-select" className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Replace Subject</label>
                    <select id="replace-select" value={subjectToReplace} onChange={e => setSubjectToReplace(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
                        {currentSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="new-subject-input" className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">With Subject</label>
                    <input 
                        type="text" 
                        id="new-subject-input"
                        list="subject-list"
                        value={newSubject}
                        onChange={e => setNewSubject(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="e.g., Computer Science"
                    />
                     <datalist id="subject-list">
                        {A_LEVEL_SUBJECTS.map(s => <option key={s} value={s} />)}
                    </datalist>
                </div>
                <div className="md:self-end">
                    <button 
                        onClick={handleGenerateStory}
                        disabled={loading || !newSubject || newSubject === subjectToReplace}
                        className="w-full px-6 py-3 bg-purple-600 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:bg-purple-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-purple-100"
                    >
                        {loading ? 'Generating...' : 'See the Change'}
                    </button>
                </div>
            </div>
            {error && <p className="mt-4 text-sm text-red-600 font-bold px-4">{error}</p>}
            
            {newStory && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-3xl border border-purple-100 shadow-inner"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-black">?</div>
                        <h4 className="font-black text-2xl text-slate-900">An Alternate Story</h4>
                    </div>
                    <div className="prose prose-purple max-w-none text-lg leading-relaxed text-slate-700 italic" dangerouslySetInnerHTML={{ __html: newStoryHtml }} />
                    <div className="mt-10 pt-8 border-t border-purple-200/50 text-center">
                        <p className="text-sm font-bold text-slate-500 mb-6 uppercase tracking-widest">Like this new direction?</p>
                        <button 
                            onClick={handleRerun}
                            className="px-10 py-4 bg-slate-900 text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-black transition-all transform hover:scale-105 active:scale-95 shadow-xl"
                        >
                            Rerun Full Analysis with {newSubject}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
};
