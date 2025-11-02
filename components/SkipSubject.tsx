
import React from 'react';
import { SkipSubjectInfo } from '../types';

interface SkipSubjectProps {
    info: SkipSubjectInfo[] | null;
}

export const SkipSubject: React.FC<SkipSubjectProps> = ({ info }) => {

    if (info === null) {
        return <p>Analyzing university requirements...</p>;
    }

    if (info.length === 0) {
        return <p>Could not retrieve information for the selected subjects.</p>;
    }

    return (
        <div>
            <p className="mb-4">Can you still study a subject at university if you don't take it for A-level? Here's a look based on your selections.</p>
            <div className="space-y-4">
                {info.map((item, index) => (
                    <div key={index} className="p-4 rounded-lg border" style={{ borderLeft: `5px solid ${item.canSkip ? '#10B981' : '#EF4444'}`}}>
                        <h4 className="font-bold text-lg">{item.subject}</h4>
                        <p className={`font-semibold ${item.canSkip ? 'text-green-600' : 'text-red-600'}`}>
                            {item.canSkip ? "Often possible to study at university without the A-level." : "Usually required at A-level for related degrees."}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">{item.details}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
