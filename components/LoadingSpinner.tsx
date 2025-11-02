
import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Analyzing A-Level Synergy...",
    "Consulting Russell Group Guidance...",
    "Cross-referencing University Courses...",
    "Calculating HESA Earnings Data...",
    "Mapping Career Pathways...",
    "Crafting Your Future Story...",
];

export const LoadingSpinner: React.FC = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center my-10">
            <div className="w-16 h-16 border-4 border-t-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600 font-medium text-center transition-opacity duration-500">
                {loadingMessages[messageIndex]}
            </p>
        </div>
    );
};
