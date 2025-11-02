
import React, { useState, useEffect } from 'react';
import { generateSkipInfo } from '../services/geminiService';
import { SkipSubjectInfo } from '../types';

interface SkipSubjectProps {
    subjects: string[];
}

export const SkipSubject: React.FC<SkipSubjectProps> = ({ subjects }) => {
    const [skipInfo, setSkipInfo] = useState<SkipSubjectInfo[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkipInfo = async () => {
            setLoading(true);
            try {
                const info = await generateSkipInfo(subjects);
                setSkipInfo(info);
            } catch (error) {
                console.error("Failed to fetch skip info:", error);
                setSkipInfo([]); // or handle error state
            } finally {
                setLoading(false);
            }
        };
        fetchSkipInfo();
    }, [subjects]);

    if (loading) {
        return <p>Analyzing university requirements...</p>;
    }

    if (!skipInfo) {
        return <p>Could not retrieve information.</p>;
    }

    return (
        <div>
            <p className="mb-4">Can you still study a subject at university if you don't take it for A-level? Here's a look based on your selections.</p>
            <div className="space-y-4">
                {skipInfo.map((info, index) => (
                    <div key={index} className="p-4 rounded-lg border" style={{ borderLeft: `5px solid ${info.canSkip ? '#10B981' : '#EF4444'}`}}>
                        <h4 className="font-bold text-lg">{info.subject}</h4>
                        <p className={`font-semibold ${info.canSkip ? 'text-green-600' : 'text-red-600'}`}>
                            {info.canSkip ? "Often possible to study at university without the A-level." : "Usually required at A-level for related degrees."}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">{info.details}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
