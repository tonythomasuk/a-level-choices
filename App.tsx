import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Nexus } from './components/Nexus';
import { Architect } from './components/Architect';
import { Dreamer } from './components/Dreamer';
import { Builder } from './components/Builder';
import { Footer } from './components/Footer';
import { A_LEVEL_SUBJECTS } from './constants';
import { DREAMER_DATA } from './dreamerData';

type View = 'nexus' | 'architect' | 'dreamer' | 'builder';

const App: React.FC = () => {
    const [view, setView] = useState<View>('nexus');
    const [architectInitialSubjects, setArchitectInitialSubjects] = useState<[string, string, string, string] | undefined>(undefined);

    const handleSelectArchitect = () => {
        setArchitectInitialSubjects(undefined);
        setView('architect');
    };

    const handleSelectBuilder = () => {
        setView('builder');
    };

    const handleSelectDreamer = () => {
        setView('dreamer');
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

        setArchitectInitialSubjects(subjects);
        setView('architect');
    };

    const handleHandshake = (mandatorySubjects: string[]) => {
        const subjects: [string, string, string, string] = ['', '', '', ''];
        mandatorySubjects.forEach((s, i) => {
            if (i < 4) subjects[i] = s;
        });
        
        // Ensure at least 3 subjects for Architect
        if (mandatorySubjects.length < 3) {
            const available = A_LEVEL_SUBJECTS.filter(s => !mandatorySubjects.includes(s));
            let count = mandatorySubjects.length;
            while (count < 3) {
                const randomSub = available[Math.floor(Math.random() * available.length)];
                subjects[count] = randomSub;
                count++;
            }
        }

        setArchitectInitialSubjects(subjects);
        setView('architect');
    };

    return (
        <div className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
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
                            initialSubjects={architectInitialSubjects}
                            onBack={() => setView('nexus')}
                        />
                        <Footer />
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
                            onHandshake={handleHandshake}
                            onBack={() => setView('nexus')}
                        />
                        <Footer />
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
                            onHandshake={handleHandshake}
                            onBack={() => setView('nexus')}
                        />
                        <Footer />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default App;
