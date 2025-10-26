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
  // Fix: Initialize useState with the first element of LOADING_MESSAGES
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);
  // Assume API key is selected / available via process.env.API_KEY by default
  const [hasApiKeySelected, setHasApiKeySelected] = useState(true);

  useEffect(() => {
    // Set random default subjects on initial load
    const shuffled = [...A_LEVEL_SUBJECTS].sort(() => 0.5 - Math.random());
    setSubjects([shuffled[0], shuffled[1], shuffled[2], '']);
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = LOADING_MESSAGES.indexOf(prev);
          const nextIndex = (currentIndex + 1) % LOADING_MESSAGES.length;
          // The setter function `setLoadingMessage` should be called with the new state value.
          // This line was already mostly correct once `setLoadingMessage` was properly typed.
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

    // No longer need to check hasApiKeySelected here, as we assume it's available via env var.
    // The service will handle the actual API key availability.

    // Reset state for new generation
    setError(null);
    setInitialReportData(null);
    setIsLoading(true);
    setLoadingMessage(LOADING_MESSAGES[0]);

    try {
      const activeSubjects = subjects.filter(s => s.trim() !== '');
      const data = await generateInitialReport(activeSubjects);
      setInitialReportData(data);
    } catch (e: any) {
      console.error(e);
      // As per guidelines, if "Requested entity was not found.", reset key selection state and prompt user to select key again.
      // This path is now only triggered if process.env.API_KEY is truly inaccessible or invalid
      if (e && e.message && typeof e.message === 'string' && e.message.toLowerCase().includes("requested entity was not found.")) {
         setError('Your API key might be invalid or has issues. Please ensure it is correctly set as an environment variable (VITE_API_KEY on Vercel) and try again.');
         // Removed setHasApiKeySelected(false) as it no longer serves a purpose with the API key selection UI removed.
      } else {
        setError('An error occurred while generating your results. Please try again. If the issue persists, check your browser console for details.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [subjects]); // Removed hasApiKeySelected from dependencies

  // Removed handleSelectApiKey function as the button and logic are removed.

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-brand-dark">
      <div className="container mx-auto p-4 md:p-8 max-w-4xl">
        <Header />
        
        {/* The API key selection UI is removed as per user request */}
        {/* {!hasApiKeySelected && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md mb-6" role="alert">
                <p className="font-bold">Configuration Error</p>
                <p className="mb-3">The Gemini API key is not selected. Please select your API key to proceed.</p>
                <button 
                  onClick={handleSelectApiKey} 
                  className="bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-sm hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Select Gemini API Key
                </button>
                <p className="mt-3 text-sm">
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-red-700 underline hover:text-red-900">
                    Learn about billing for Gemini API
                  </a>
                </p>
            </div>
        )} */}

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