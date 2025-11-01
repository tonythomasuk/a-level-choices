import React, { useState, useEffect, useCallback } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import Header from './components/Header';
import SubjectInputs from './components/SubjectInputs';
import LoadingIndicator from './components/LoadingIndicator';
import ResultsContainer from './components/ResultsContainer';
import Footer from './components/Footer';
import { generateInitialReport } from './services/geminiService';
import { InitialReportData } from './types';
import { LOADING_MESSAGES, A_LEVEL_SUBJECTS } from './constants';


const App: React.FC = () => {
  const [subjects, setSubjects] = useState<string[]>(['', '', '', '']);
  const [initialReportData, setInitialReportData] = useState<InitialReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const shuffled = [...A_LEVEL_SUBJECTS].sort(() => 0.5 - Math.random());
    setSubjects([shuffled[0], shuffled[1], shuffled[2], '']);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
          return LOADING_MESSAGES[nextIndex];
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleGenerateFutures = useCallback(async (subjectsOverride?: string[]) => {
    const subjectsToUse = subjectsOverride || subjects;
    const mandatorySubjects = subjectsToUse.slice(0, 3).filter(s => s.trim() !== '');
    if (mandatorySubjects.length < 3) {
      setError('Please enter three mandatory A-level subjects.');
      return;
    }

    setError(null);
    setInitialReportData(null);
    setIsLoading(true);
    setLoadingMessage(LOADING_MESSAGES[0]);

    try {
      const activeSubjects = subjectsToUse.filter(s => s.trim() !== '');
      const data = await generateInitialReport(activeSubjects);
      setInitialReportData(data);
    } catch (e: any) {
      console.error(e);
      // Set a user-friendly error message that hints at a missing or invalid API key.
      // This message is generic enough for both Vercel and Canvas/AIStudio environments.
      setError('An error occurred while generating your report. This might be due to a missing or invalid API key. Please ensure it is configured correctly for your environment and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [subjects]);

  const handleRerun = (newSubjects: string[]) => {
    const paddedSubjects = [...newSubjects, '', '', ''].slice(0, 4);
    setSubjects(paddedSubjects);
    handleGenerateFutures(paddedSubjects);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-brand-dark">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <Header />
        
        <main>
          <SubjectInputs subjects={subjects} setSubjects={setSubjects} onGenerate={() => handleGenerateFutures()} disabled={isLoading} />
          
          {error && (
            <div className="my-4 p-4 bg-red-100 text-red-800 border border-red-300 rounded-lg text-center" role="alert">
              <p className="font-bold">An Error Occurred</p>
              <p>{error}</p>
            </div>
          )}

          {isLoading && <LoadingIndicator message={loadingMessage} />}

          {initialReportData && !isLoading && <ResultsContainer initialReportData={initialReportData} subjects={subjects} onRerun={handleRerun} />}
        </main>
        
        <Footer subjects={subjects} initialReportData={initialReportData} />
      </div>
      <SpeedInsights />
    </div>
  );
};

export default App;