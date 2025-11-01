import React from 'react';
import AutocompleteInput from './AutocompleteInput';
import { A_LEVEL_SUBJECTS } from '../constants';

interface SubjectInputsProps {
  subjects: string[];
  setSubjects: (subjects: string[]) => void;
  onGenerate: () => void;
  disabled: boolean;
}

const SubjectInputs: React.FC<SubjectInputsProps> = ({ subjects, setSubjects, onGenerate, disabled }) => {
  const handleSubjectChange = (index: number, value: string) => {
    const newSubjects = [...subjects];
    newSubjects[index] = value;
    setSubjects(newSubjects);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg mb-8 border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AutocompleteInput label="Subject 1" value={subjects[0]} onChange={(value) => handleSubjectChange(0, value)} placeholder="e.g., Mathematics" suggestions={A_LEVEL_SUBJECTS} disabled={disabled} />
        <AutocompleteInput label="Subject 2" value={subjects[1]} onChange={(value) => handleSubjectChange(1, value)} placeholder="e.g., Physics" suggestions={A_LEVEL_SUBJECTS} disabled={disabled} />
        <AutocompleteInput label="Subject 3" value={subjects[2]} onChange={(value) => handleSubjectChange(2, value)} placeholder="e.g., Chemistry" suggestions={A_LEVEL_SUBJECTS} disabled={disabled} />
        <AutocompleteInput label="Subject 4" value={subjects[3]} onChange={(value) => handleSubjectChange(3, value)} placeholder="e.g., History" suggestions={A_LEVEL_SUBJECTS} isOptional disabled={disabled} />
      </div>
      <button
        onClick={onGenerate}
        disabled={disabled}
        className="w-full flex items-center justify-center bg-gradient-to-r from-brand-primary to-indigo-600 text-white font-bold py-4 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <svg xmlns="http://www.w.3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Generate Possible Futures
      </button>
    </div>
  );
};

export default SubjectInputs;
