import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Nexus } from './components/Nexus';
import { Architect } from './components/Architect';
import { Dreamer } from './components/Dreamer';
import { Builder } from './components/Builder';
import { Footer } from './components/Footer';
import { GlobalNav } from './components/GlobalNav';
import { PrintPreview } from './components/PrintPreview';
import { GlobalStateProvider } from './context/GlobalStateContext';
import { Toaster } from 'sonner';
import { ScrollToTop } from './components/ScrollToTop';

type View = 'nexus' | 'architect' | 'dreamer' | 'builder';

const App: React.FC = () => {
    const [view, setView] = useState<View>('nexus');

    // Persistence logic
    useEffect(() => {
        try {
            const savedView = localStorage.getItem('nexus_current_view');
            if (savedView) setView(savedView as View);
        } catch (e) {
            console.error('Failed to load view from localStorage', e);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('nexus_current_view', view);
        } catch (e) {
            console.error('Failed to save view to localStorage', e);
        }
    }, [view]);

    const handleSelectArchitect = () => {
        handleNavigate('architect');
    };

    const handleSelectBuilder = () => {
        handleNavigate('builder');
    };

    const handleSelectDreamer = () => {
        handleNavigate('dreamer');
    };

    const handleNavigate = (newView: View) => {
        if (newView === 'dreamer') {
            localStorage.removeItem('dreamer_state');
        }
        setView(newView);
        window.scrollTo(0, 0);
    };

    return (
        <GlobalStateProvider>
            <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
                <Toaster position="top-right" richColors />
                {view !== 'nexus' && (
                    <GlobalNav currentView={view} onNavigate={handleNavigate} />
                )}
                
                <AnimatePresence mode="wait">
                    {view === 'nexus' && (
                        <motion.div
                            key="nexus"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Nexus 
                                onSelectArchitect={handleSelectArchitect}
                                onSelectBuilder={handleSelectBuilder}
                                onSelectDreamer={handleSelectDreamer}
                            />
                        </motion.div>
                    )}

                    {view === 'architect' && (
                        <motion.div
                            key="architect"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Architect 
                                onBack={() => handleNavigate('nexus')}
                                onNavigateToBuilder={() => handleNavigate('builder')}
                            />
                        </motion.div>
                    )}

                    {view === 'builder' && (
                        <motion.div
                            key="builder"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Builder 
                                onBack={() => handleNavigate('nexus')}
                            />
                        </motion.div>
                    )}

                    {view === 'dreamer' && (
                        <motion.div
                            key="dreamer"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Dreamer 
                                onBack={() => handleNavigate('nexus')}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
                <Footer />
                <ScrollToTop />
            </div>
        </GlobalStateProvider>
    );
};

export default App;
