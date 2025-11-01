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

  useEffect(() => {
    // Set random default subjects on initial load
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

  const handleGenerateFutures = useCallback(async () => {
    const mandatorySubjects = subjects.slice(0, 3).filter(s => s.trim() !== '');
    if (mandatorySubjects.length < 3) {
      setError('Please enter three mandatory A-level subjects.');
      return;
    }

    // Reset state for new generation
    setError(null);
    setInitialReportData(null);
    setIsLoading(true);
    setLoadingMessage(LOADING_MESSAGES[0]);

    try {
      const activeSubjects = subjects.filter(s => s.trim() !== '');
      const data = await generateInitialReport(activeSubjects);
      setInitialReportData(data);
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating your results. Please check your API key and try again. A 403 error often indicates an issue with the API key setup.');
    } finally {
      setIsLoading(false);
    }
  }, [subjects]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-brand-dark">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <Header />
        
        {!process.env.API_KEY && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-6" role="alert">
                <p className="font-bold">Configuration Error</p>
                <p>The Gemini API key is missing. Please ensure the `API_KEY` environment variable is set correctly in your hosting environment (e.g., Vercel).</p>
            </div>
        )}

        <main>
          <SubjectInputs subjects={subjects} setSubjects={setSubjects} onGenerate={handleGenerateFutures} disabled={isLoading} />
          
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
            />
          )}
        </main>
        
        <Footer initialReportData={initialReportData} subjects={subjects} />
      </div>
    </div>
  );
};

export default App;
