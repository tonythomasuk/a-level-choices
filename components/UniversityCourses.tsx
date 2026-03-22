import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UniversityCourse } from '../types';
import { RUSSELL_GROUP_UNIVERSITIES } from '../constants';
import { generateUniversityCourses } from '../services/geminiService';
import { CourseCard } from './CourseCard';

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

    useEffect(() => {
        if (subjects.length > 0 && selectedUniversity === 'All Universities' && !cachedCourses['All Universities']) {
            fetchAllUniversities();
        }
    }, [subjects, selectedUniversity]);

    const fetchAllUniversities = async () => {
        setLoading(true);
        setError(null);
        try {
            let foundUnis = 0;
            let allCourses: UniversityCourse[] = [];
            let pool = [...RUSSELL_GROUP_UNIVERSITIES].sort(() => 0.5 - Math.random());
            
            while (foundUnis < 5 && pool.length > 0) {
                const uni = pool.pop()!;
                const courses = await generateUniversityCourses(subjects, uni);
                if (courses.length > 0) {
                    allCourses.push(courses[0]); // Take only one
                    foundUnis++;
                }
            }
            setCachedCourses(prev => ({...prev, 'All Universities': allCourses}));
        } catch (err) {
            setError('Could not fetch courses. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

            {selectedUniversity === 'All Universities' && coursesToDisplay.length > 0 && (
                <p className="mb-6 text-sm text-slate-500 italic">
                    Note: This is just a random selection. You can choose a preferred University from the dropdown list to see a more complete set of courses from that University.
                </p>
            )}

            {loading && <p className="text-center p-4">Loading courses...</p>}
            {error && <p className="text-center p-4 text-red-600 bg-red-100 rounded">{error}</p>}

            {!loading && !error && (
                <div className="grid grid-cols-1 gap-6">
                    {coursesToDisplay.length > 0 ? coursesToDisplay.map((course, index) => (
                        <CourseCard
                            key={index}
                            title={course.courseName}
                            university={course.universityName}
                            typicalOffer={course.typicalOffer}
                            mandatorySubjects={course.requiredSubjects}
                            helpfulSubjects={course.recommendedSubjects}
                            helpfulGCSEs={[]} // Not available in UniversityCourse type
                            specialConditions={course.gcseRequirements || 'Standard requirements apply'}
                            subjectFitAnalysis={course.matchingExplanation}
                            url={course.url}
                        />
                    )) : <p className="text-center py-12 text-slate-400 font-medium">No specific courses found for this combination at {selectedUniversity}.</p>}
                </div>
            )}
        </div>
    );
};
