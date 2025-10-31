
import React, { useState, useEffect } from 'react';
import type { UniversityCourse, CourseRequirements } from '../types';
import { getCourseRequirements } from '../services/geminiService';

interface RequirementsModalProps {
    course: UniversityCourse;
    onClose: () => void;
}

const RequirementsModal: React.FC<RequirementsModalProps> = ({ course, onClose }) => {
    const [requirements, setRequirements] = useState<CourseRequirements | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequirements = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getCourseRequirements(course.name, course.university);
                setRequirements(data);
            } catch (e) {
                console.error(e);
                setError("Could not fetch requirements. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequirements();
    }, [course]);

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 md:p-8 transform transition-transform duration-300 scale-95 animate-scale-in"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-brand-dark">{course.name}</h3>
                        <p className="text-md text-gray-500">{course.university}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="mt-6 min-h-[120px]">
                    {isLoading && (
                         <div className="flex flex-col items-center justify-center text-center">
                             <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                             <p className="text-gray-600">Fetching entry requirements...</p>
                         </div>
                    )}
                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
                            <p className="font-semibold">Oops!</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {requirements && (
                        <div className="animate-fade-in space-y-6">
                            <div>
                                <p className="text-gray-600 font-semibold mb-2">Standard A-Level Offer:</p>
                                <p className="text-3xl font-extrabold text-brand-primary bg-gray-50 p-4 rounded-lg text-center">{requirements.requirements}</p>
                            </div>
                            
                            {requirements.subjectRequirements && (
                                <div>
                                    <p className="text-gray-600 font-semibold mb-2">Subject Requirements:</p>
                                    <p className="text-base text-gray-800 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">{requirements.subjectRequirements}</p>
                                </div>
                            )}

                            <a 
                                href={requirements.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-full block text-center bg-brand-secondary text-white font-bold py-3 px-5 rounded-lg shadow-sm hover:bg-green-700 transition-colors duration-200"
                            >
                                View Official Course Page
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RequirementsModal;