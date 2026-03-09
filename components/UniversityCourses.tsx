import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UniversityCourse } from '../types';
import { RUSSELL_GROUP_UNIVERSITIES } from '../constants';
import { generateUniversityCourses } from '../services/geminiService';

interface UniversityCoursesProps {
    initialCourses: UniversityCourse[];
    subjects: string[];
    cachedCourses: Record<string, UniversityCourse[]>;
    setCachedCourses: React.Dispatch<React.SetStateAction<Record<string, UniversityCourse[]>>>
}

export const UniversityCourses: React.FC<UniversityCoursesProps> = ({ initialCourses, subjects, cachedCourses, setCachedCourses }) => {
    const [selectedUniversity, setSelectedUniversity] = useState('All Universities');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUniversityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const uni = e.target.value;
        setSelectedUniversity(uni);
        setError(null);

        if (cachedCourses[uni]) {
            return; // Use cached data
        }

        if (uni !== 'All Universities') {
            setLoading(true);
            try {
                const courses = await generateUniversityCourses(subjects, uni);
                setCachedCourses(prev => ({...prev, [uni]: courses}));
            } catch (err) {
                setError(`Could not fetch courses for ${uni}. Please try again.`);
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
    };
    
    const coursesToDisplay = cachedCourses[selectedUniversity] || [];
    
    const renderSubjectList = (list: string[]) => {
        if (!list || list.length === 0) {
            return <span className="text-slate-500">None specified</span>;
        }
        const text = list.join(', ');
        // Create a regex to find all matching subjects, case-insensitively
        const allSubjectsRegex = new RegExp(`(${subjects.join('|')})`, 'gi');
        
        // Split the string by the regex to interleave text and subjects
        const parts = text.split(allSubjectsRegex);

        return (
            <span>
                {parts.map((part, index) => {
                    // Check if the part is one of the user's subjects (case-insensitive)
                    const isSubject = subjects.some(s => s.toLowerCase() === part.toLowerCase());
                    return isSubject ? (
                        <strong key={index} className="bg-indigo-100 text-indigo-800 px-1 py-0.5 rounded">{part}</strong>
                    ) : (
                        <React.Fragment key={index}>{part}</React.Fragment>
                    );
                })}
            </span>
        );
    };


    return (
        <div>
            <p className="mb-4">Here is a representative sample of courses from Russell Group Universities that your A-level choices could lead to.</p>
            
            <div className="mb-6">
                <label htmlFor="university-select" className="block text-sm font-medium text-slate-700 mb-1">Filter by University:</label>
                <select 
                    id="university-select"
                    value={selectedUniversity}
                    onChange={handleUniversityChange}
                    className="w-full md:w-1/2 p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="All Universities">All Russell Group Universities</option>
                    {RUSSELL_GROUP_UNIVERSITIES.sort().map(uni => (
                        <option key={uni} value={uni}>{uni}</option>
                    ))}
                </select>
            </div>

            {loading && <p className="text-center p-4">Loading courses...</p>}
            {error && <p className="text-center p-4 text-red-600 bg-red-100 rounded">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 gap-6">
                    {coursesToDisplay.length > 0 ? coursesToDisplay.map((course, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 border border-slate-100 rounded-2xl bg-white hover:shadow-2xl hover:shadow-indigo-100/50 transition-all group"
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="font-black text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        <a href={course.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {course.courseName}
                                        </a>
                                    </h3>
                                    <p className="font-bold text-indigo-600/70 text-sm uppercase tracking-widest mt-1">{course.universityName}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-center">
                                        <span className="block text-[10px] font-black uppercase tracking-widest opacity-60">Typical Offer</span>
                                        <span className="text-lg font-black">{course.typicalOffer}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Required Subjects</span>
                                        <div className="flex flex-wrap gap-2">
                                            {renderSubjectList(course.requiredSubjects)}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Recommended</span>
                                        <div className="flex flex-wrap gap-2">
                                            {renderSubjectList(course.recommendedSubjects)}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">GCSE Requirements</span>
                                        <p className="text-sm font-medium text-slate-600">{course.gcseRequirements || 'Standard requirements apply'}</p>
                                    </div>
                                    <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block mb-2">Subject Fit Analysis</span>
                                        <p className="text-xs font-medium text-slate-700 leading-relaxed">{course.matchingExplanation}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end">
                                <a 
                                    href={course.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 flex items-center gap-2 transition-colors"
                                >
                                    View Course Details 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                    </svg>
                                </a>
                            </div>
                        </motion.div>
                    )) : <p className="text-center py-12 text-slate-400 font-medium">No specific courses found for this combination at {selectedUniversity}.</p>}
                </div>
            )}
        </div>
    );
};