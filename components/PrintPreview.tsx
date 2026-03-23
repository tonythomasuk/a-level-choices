import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FutureStory } from './FutureStory';
import { UniversityCourses } from './UniversityCourses';
import { PopularCareers } from './PopularCareers';
import { SkipSubject } from './SkipSubject';
import { Section } from './Section';
import { DREAMER_DATA } from '../dreamerData';

export const PrintPreview = forwardRef<HTMLDivElement, { config?: { includeArchitect: boolean, includeBuilder: boolean, includeDreamer: boolean } }>((props, ref) => {
    const [architectData, setArchitectData] = useState<any>(null);
    const [builderData, setBuilderData] = useState<any>(null);
    const [dreamerData, setDreamerData] = useState<any>(null);

    const config = props.config || { includeArchitect: true, includeBuilder: false, includeDreamer: false };

    useEffect(() => {
        // Load data from localStorage
        const arch = localStorage.getItem('architect_state');
        if (arch) setArchitectData(JSON.parse(arch));

        const build = localStorage.getItem('builder_state');
        if (build) setBuilderData(JSON.parse(build));

        const dream = localStorage.getItem('dreamer_state');
        if (dream) {
            const parsed = JSON.parse(dream);
            const world = DREAMER_DATA.find(w => w.id === parsed.selectedWorldId);
            if (world) {
                const course = world.courses.find(c => c.title === parsed.selectedCourseTitle);
                if (course) {
                    setDreamerData({ world, selectedCourse: course });
                }
            }
        }
    }, [props.config]);

    return (
        <div ref={ref} id="print-preview" className="p-12 bg-white text-slate-900 min-h-screen">
            <div className="mb-12 border-b-4 border-indigo-600 pb-6 print:border-indigo-600">
                <h1 className="text-4xl font-black tracking-tighter uppercase text-slate-900">Pathfinder <span className="text-indigo-600">Nexus</span> Report</h1>
                <p className="text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest">Generated on {new Date().toLocaleDateString()}</p>
            </div>

            {config.includeDreamer && dreamerData?.selectedCourse && (
                <div className="space-y-8 mb-16">
                    <div className="p-8 bg-purple-50 rounded-3xl border border-purple-100">
                        <h2 className="text-3xl font-black text-purple-900 uppercase tracking-tight mb-2">The Dreamer: Career Vision</h2>
                        <p className="text-sm font-bold text-purple-600 uppercase tracking-widest">{dreamerData.selectedCourse.title}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8">
                        <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-black uppercase tracking-tight mb-4 text-slate-900">The Mission</h3>
                            <p className="text-slate-600 leading-relaxed">Exploring the world of {dreamerData.world.world_name} through {dreamerData.selectedCourse.title}.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Academic Foundation</h4>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-purple-600 uppercase mb-1">Mandatory A-Levels</p>
                                        <div className="flex flex-wrap gap-2">
                                            {dreamerData.selectedCourse.a_level.mandatory?.map((s: string) => (
                                                <span key={s} className="px-3 py-1 bg-white text-slate-900 text-xs font-bold rounded border border-slate-200">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Helpful A-Levels</p>
                                        <div className="flex flex-wrap gap-2">
                                            {dreamerData.selectedCourse.a_level.helpful?.map((s: string) => (
                                                <span key={s} className="px-3 py-1 bg-white text-slate-400 text-xs font-bold rounded border border-slate-200">{s}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Career Pathways</h4>
                                <div className="space-y-4">
                                    {dreamerData.selectedCourse.careers?.map((item: any, i: number) => (
                                        <div key={i} className="text-sm">
                                            <p className="font-bold text-slate-900 flex items-center gap-2">
                                                <span className="text-purple-500">•</span>
                                                {item.name}
                                            </p>
                                            <p className="text-slate-500 text-xs mt-1 ml-4 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {config.includeArchitect && architectData?.analysisResult && (
                <div className="space-y-8 mb-16">
                    {(config.includeDreamer && dreamerData?.selectedCourse) && <div className="page-break" />}
                    <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
                        <h2 className="text-3xl font-black text-indigo-900 uppercase tracking-tight mb-4">The Architect: Subject Analysis</h2>
                        <div className="flex flex-wrap gap-2">
                            {architectData.subjects?.filter((s: string) => s).map((s: string, i: number) => (
                                <span key={i} className="px-4 py-2 bg-white text-indigo-700 text-xs font-bold rounded-full shadow-sm border border-indigo-100">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>

                    <Section title="Your Future Story">
                        <FutureStory story={architectData.analysisResult.futureStory} />
                    </Section>

                    <div className="page-break" />

                    <Section title="University Courses">
                        <div className="grid grid-cols-1 gap-4">
                            {architectData.analysisResult.universityCourses?.map((course: any, i: number) => (
                                <div key={i} className="p-6 border border-slate-200 rounded-2xl bg-white shadow-sm">
                                    <h3 className="font-black text-indigo-600 text-lg mb-1">{course.courseName}</h3>
                                    <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-widest">{course.universityName}</p>
                                    <p className="text-sm text-slate-600 leading-relaxed">{course.matchingExplanation}</p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Careers & Earning Potential">
                        <PopularCareers 
                            careers={architectData.analysisResult.popularCareers} 
                            earningPotential={architectData.analysisResult.earningPotential}
                        />
                    </Section>

                    <Section title="Entry Flexibility">
                        <SkipSubject info={architectData.skipInfo} />
                    </Section>
                </div>
            )}

            {config.includeBuilder && builderData?.courses?.length > 0 && (
                <div className="space-y-8 mb-16">
                    {( (config.includeDreamer && dreamerData?.selectedCourse) || (config.includeArchitect && architectData?.analysisResult) ) && <div className="page-break" />}
                    <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
                        <h2 className="text-3xl font-black text-emerald-900 uppercase tracking-tight mb-4">The Builder: Degree Construction</h2>
                        <div className="flex flex-wrap gap-8 text-sm font-bold">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-emerald-600 uppercase tracking-widest">Major</span>
                                <span className="text-lg">{builderData.major}</span>
                            </div>
                            {builderData.minor1 && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-emerald-600 uppercase tracking-widest">Minor 1</span>
                                    <span className="text-lg">{builderData.minor1}</span>
                                </div>
                            )}
                            {builderData.minor2 && (
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-emerald-600 uppercase tracking-widest">Minor 2</span>
                                    <span className="text-lg">{builderData.minor2}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {builderData.courses.map((course: any, i: number) => (
                            <div key={i} className="p-8 border border-slate-200 rounded-3xl bg-white shadow-sm">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-black text-slate-900 mb-1">{course.title}</h3>
                                    <p className="text-emerald-600 font-black text-sm uppercase tracking-widest">{course.university}</p>
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-8">{course.specialConditions}</p>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ideal A-Levels</p>
                                    <div className="flex flex-wrap gap-3">
                                        {course.a_level.mandatory.map((sub: string, idx: number) => (
                                            <span key={idx} className="px-4 py-2 bg-white text-slate-900 text-xs font-bold rounded-lg border border-slate-200">
                                                {sub} (Mandatory)
                                            </span>
                                        ))}
                                        {course.a_level.helpful.map((sub: string, idx: number) => (
                                            <span key={idx} className="px-4 py-2 bg-white text-slate-500 text-xs font-bold rounded-lg border border-slate-200">
                                                {sub} (Helpful)
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>
                {`
                @media print {
                    .page-break {
                        page-break-before: always;
                    }
                }
                `}
            </style>
        </div>
    );
});

PrintPreview.displayName = 'PrintPreview';
