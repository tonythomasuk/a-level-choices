import React, { useState } from 'react';
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
                <div className="space-y-6">
                    {coursesToDisplay.length > 0 ? coursesToDisplay.map((course, index) => (
                        <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50/50">
                            <h3 className="font-bold text-lg text-indigo-700">
                                <a href={course.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                    {course.courseName}
                                </a>
                            </h3>
                            <p className="font-semibold text-slate-600">{course.universityName}</p>
                            <div className="mt-2 text-sm space-y-2">
                                <p><strong>Typical Offer:</strong> {course.typicalOffer}</p>
                                <p><strong className="text-green-700">Required:</strong> {renderSubjectList(course.requiredSubjects)}</p>
                                <p><strong className="text-blue-700">Recommended:</strong> {renderSubjectList(course.recommendedSubjects)}</p>
                                <p><strong>GCSEs:</strong> {course.gcseRequirements || 'Standard requirements apply'}</p>
                            </div>
                        </div>
                    )) : <p>No specific courses found for this combination at {selectedUniversity}. This could mean it's a unique combination, or broader entry requirements apply.</p>}
                </div>
            )}
        </div>
    );
};