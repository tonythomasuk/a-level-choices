import React, { useState, useCallback } from 'react';
import type { InitialReportData, UniversityCourse, WhatIfScenario } from '../types';
import LoadingIndicator from './LoadingIndicator';
import RequirementsModal from './RequirementsModal';
import { generateWhatIfScenario } from '../services/geminiService';
import { A_LEVEL_SUBJECTS } from '../constants';

const SectionCard: React.FC<{ title: string; icon: React.ReactElement; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-brand-primary/50">
        <div className="flex items-center mb-4">
            <div className="bg-brand-primary/10 p-2 rounded-full mr-4">{icon}</div>
            <h3 className="text-2xl font-bold text-brand-dark">{title}</h3>
        </div>
        <div className="prose prose-lg max-w-none text-gray-600">
            {children}
        </div>
    </div>
);

const SectionDivider: React.FC = () => (
    <div className="my-10">
        <div className="w-full h-px bg-gray-200"></div>
    </div>
);

// Icons
const PersonaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const StoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" /></svg>;
const UniversityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10.5 21l-7-7 7-7" /><path d="M21 21V3" /></svg>;
const CareerIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const EarningsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const WhatIfIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const SkipIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>;

const WhatIfScenarioResult: React.FC<{ scenario: WhatIfScenario }> = ({ scenario }) => (
    <div className="mt-4 p-4 border-l-4 border-brand-secondary/50 bg-green-50/50 rounded-r-lg animate-fade-in">
        <p className="font-bold text-lg mb-2">New Scenario: Substituting <span className="text-brand-secondary">{scenario.substitutedSubject}</span></p>
        <p className="mb-2"><strong>New Combination:</strong> {scenario.newCombination.join(', ')}</p>
        <p>{scenario.scenarioStory}</p>
    </div>
);

interface ResultsContainerProps {
    initialReportData: InitialReportData;
    subjects: string[];
}

const ResultsContainer: React.FC<ResultsContainerProps> = ({ initialReportData, subjects }) => {
    const { section2Data, skippableSubjects } = initialReportData;
    const [showMore, setShowMore] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<UniversityCourse | null>(null);

    // State for interactive 'What If'
    const [subjectToReplace, setSubjectToReplace] = useState(subjects[0] || '');
    const [newSubject, setNewSubject] = useState('');
    const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
    const [generatedScenario, setGeneratedScenario] = useState<WhatIfScenario | null>(null);
    const [scenarioError, setScenarioError] = useState<string | null>(null);

    const handleGenerateScenario = useCallback(async () => {
        if (!subjectToReplace || !newSubject || subjectToReplace === newSubject) {
            setScenarioError("Please select two different subjects to generate a scenario.");
            return;
        }
        setIsGeneratingScenario(true);
        setGeneratedScenario(null);
        setScenarioError(null);
        try {
            const scenario = await generateWhatIfScenario(subjects, subjectToReplace, newSubject);
            setGeneratedScenario(scenario);
        } catch (e) {
            console.error(e);
            setScenarioError("Sorry, we couldn't generate this scenario. Please try a different combination.");
        } finally {
            setIsGeneratingScenario(false);
        }
    }, [subjects, subjectToReplace, newSubject]);

    const alternativeSubjects = A_LEVEL_SUBJECTS.filter(s => !subjects.includes(s));

    return (
        <div id="results-content" className="mt-12 animate-fade-in">
            {/* Section 2 */}
            <SectionCard title="Your Future Persona" icon={<PersonaIcon />}>
                <h4 className="text-2xl font-bold text-brand-primary mb-2">{section2Data.careerPersona.title}</h4>
                <p>{section2Data.careerPersona.description}</p>
            </SectionCard>

            <SectionCard title="Your Future Story" icon={<StoryIcon />}>
                <p>{section2Data.futureStory}</p>
            </SectionCard>

            <SectionCard title="University Courses" icon={<UniversityIcon />}>
                <ul className="list-disc pl-6 space-y-4">
                    {section2Data.universityCourses.map((course, index) => (
                        <li key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div><strong>{course.name}</strong> ({course.university})</div>
                            <button onClick={() => setSelectedCourse(course)} className="mt-2 sm:mt-0 text-sm bg-brand-primary/10 text-brand-primary font-semibold py-1 px-3 rounded-full hover:bg-brand-primary/20 transition-colors duration-200 self-start">
                                See Requirements
                            </button>
                        </li>
                    ))}
                </ul>
            </SectionCard>

            <SectionCard title="Popular Careers" icon={<CareerIcon />}>
                <ul className="list-disc pl-6 space-y-4">
                    {section2Data.popularCareers.map((career, index) => (
                        <li key={index}>
                           <strong>{career.name}</strong>: {career.description}
                        </li>
                    ))}
                </ul>
            </SectionCard>

            <SectionCard title="How much could you earn?" icon={<EarningsIcon />}>
                <p className="text-2xl font-bold text-brand-primary mb-2">{section2Data.earningPotential.range}</p>
                <p>{section2Data.earningPotential.details}</p>
            </SectionCard>

            {!showMore && (
                <div className="text-center mt-8">
                    <button onClick={() => setShowMore(true)} className="bg-gradient-to-r from-brand-secondary to-green-600 text-white font-bold py-4 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                        Reveal More Possibilities
                    </button>
                </div>
            )}
            
            {/* Section 3 */}
            {showMore && (
                <div className="animate-fade-in mt-12">
                   <SectionDivider />
                    <SectionCard title="What if you did this subject instead?" icon={<WhatIfIcon />}>
                        <p className="mb-4">Explore alternative pathways by swapping one of your subjects.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-gray-50 p-4 rounded-lg">
                            <div className="flex flex-col">
                                <label className="mb-1 font-semibold text-sm text-gray-600">Replace Subject</label>
                                <select value={subjectToReplace} onChange={(e) => setSubjectToReplace(e.target.value)} className="p-2 border border-gray-300 rounded-md shadow-sm">
                                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="mb-1 font-semibold text-sm text-gray-600">With Subject</label>
                                <select value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="p-2 border border-gray-300 rounded-md shadow-sm">
                                    <option value="">Select a new subject...</option>
                                    {alternativeSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <button onClick={handleGenerateScenario} disabled={isGeneratingScenario} className="bg-brand-secondary text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isGeneratingScenario ? 'Generating...' : 'Create Scenario'}
                            </button>
                        </div>
                        {scenarioError && <p className="text-red-600 mt-3">{scenarioError}</p>}
                        {isGeneratingScenario && <div className="mt-4"><LoadingIndicator message="Crafting your new path..." /></div>}
                        {generatedScenario && <WhatIfScenarioResult scenario={generatedScenario} />}
                    </SectionCard>

                    <SectionCard title="Could you skip this subject and return to it at Uni?" icon={<SkipIcon />}>
                       {skippableSubjects.map((subjectInfo, index) => (
                             <div key={index} className="mb-4 last:mb-0">
                                <h4 className="font-bold text-lg">{subjectInfo.subject}</h4>
                                <p>
                                    <span className={`font-semibold ${subjectInfo.isSkippable ? 'text-green-600' : 'text-red-600'}`}>
                                        {subjectInfo.isSkippable ? 'Likely possible' : 'Difficult/Impossible'}
                                    </span>
                                    : {subjectInfo.reason}
                                </p>
                             </div>
                         ))}
                    </SectionCard>
                </div>
            )}

            {selectedCourse && (
                <RequirementsModal 
                    course={selectedCourse}
                    onClose={() => setSelectedCourse(null)}
                />
            )}
        </div>
    );
};

export default ResultsContainer;
