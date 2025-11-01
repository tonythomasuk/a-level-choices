import React, { useState, useEffect, useCallback } from 'react';
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
  const [hasApiKeySelected, setHasApiKeySelected] = useState(true);

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
      if (e && e.message && typeof e.message === 'string' && e.message.toLowerCase().includes("requested entity was not found.")) {
         setError('Your API key might be invalid or has issues. Please ensure it is correctly set as an environment variable (API_KEY) and try again.');
         setHasApiKeySelected(false);
      } else {
        setError('An error occurred while generating your results. Please try again. If the issue persists, check your browser console for details.');
      }
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
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative my-4 shadow-sm" role="alert">
              <strong className="font-bold">Oops! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading && <LoadingIndicator message={loadingMessage} />}
          
          {initialReportData && (
            <ResultsContainer 
              initialReportData={initialReportData}
              subjects={subjects.filter(s => s.trim() !== '')}
              onRerun={handleRerun}
            />
          )}
        </main>
        
        <Footer initialReportData={initialReportData} subjects={subjects} />
      </div>
    </div>
  );
};

export default App;