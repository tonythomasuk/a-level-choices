
import React, { useState, useCallback } from 'react';
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                    <label htmlFor="replace-select" className="text-sm font-medium">Replace Subject:</label>
                    <select id="replace-select" value={subjectToReplace} onChange={e => setSubjectToReplace(e.target.value)} className="w-full mt-1 p-2 border border-slate-300 rounded-md">
                        {currentSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="new-subject-input" className="text-sm font-medium">With Subject:</label>
                    <input 
                        type="text" 
                        id="new-subject-input"
                        list="subject-list"
                        value={newSubject}
                        onChange={e => setNewSubject(e.target.value)}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-md"
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
                        className="w-full px-4 py-2 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 disabled:bg-slate-400"
                    >
                        {loading ? 'Generating...' : 'Generate New Story'}
                    </button>
                </div>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            
            {newStory && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-bold text-xl text-purple-800 mb-2">An Alternate Story</h4>
                    <div dangerouslySetInnerHTML={{ __html: newStoryHtml }} />
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600 mb-2">Like this new direction? Rerun the full analysis to see new university courses and career paths.</p>
                        <button 
                            onClick={handleRerun}
                            className="px-6 py-2 bg-green-600 text-white font-bold rounded-full hover:bg-green-700"
                        >
                            Rerun Full Analysis with {newSubject}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
