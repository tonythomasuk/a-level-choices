import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Nexus } from './components/Nexus';
import { Architect } from './components/Architect';
import { Dreamer } from './components/Dreamer';
import { Builder } from './components/Builder';
import { Footer } from './components/Footer';
import { GlobalNav } from './components/GlobalNav';
import { PrintPreview } from './components/PrintPreview';
import { A_LEVEL_SUBJECTS } from './constants';
import { DREAMER_DATA } from './dreamerData';

type View = 'nexus' | 'architect' | 'dreamer' | 'builder';

const App: React.FC = () => {
    const [view, setView] = useState<View>('nexus');

    // Persistence logic
    useEffect(() => {
        const savedView = localStorage.getItem('nexus_current_view');
        if (savedView) setView(savedView as View);
    }, []);

    useEffect(() => {
        localStorage.setItem('nexus_current_view', view);
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

    const handleSelectChaos = () => {
        // Pick a random career from Dreamer data
        const allCourses = DREAMER_DATA.flatMap(w => w.courses);
        const randomCourse = allCourses[Math.floor(Math.random() * allCourses.length)];
        const mandatory = randomCourse.a_level.mandatory;
        
        // Fill up to 4 subjects
        const subjects: [string, string, string, string] = ['', '', '', ''];
        mandatory.forEach((s, i) => {
            if (i < 4) subjects[i] = s;
        });
        
        // If less than 3, add randoms
        let count = mandatory.length;
        const available = A_LEVEL_SUBJECTS.filter(s => !mandatory.includes(s));
        while (count < 3) {
            const randomSub = available[Math.floor(Math.random() * available.length)];
            subjects[count] = randomSub;
            count++;
        }

        // We'll just set the view to architect and let it handle its own state
        setView('architect');
    };

    const handleNavigate = (newView: View) => {
        if (newView === 'dreamer') {
            localStorage.removeItem('dreamer_state');
        }
        setView(newView);
    };

    return (
        <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
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
                            onSelectChaos={handleSelectChaos}
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
        </div>
    );
};

export default App;
