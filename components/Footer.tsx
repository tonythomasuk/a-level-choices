import React from 'react';
import type { InitialReportData } from '../types';

interface FooterProps {
  subjects: string[];
  initialReportData: InitialReportData | null;
}

const Footer: React.FC<FooterProps> = ({ subjects, initialReportData }) => {

  const handleExport = () => {
    if (!initialReportData) return;

    const { section2Data, skippableSubjects } = initialReportData;
    const activeSubjects = subjects.filter(s => s.trim() !== '').join(', ');

    let content = `
      <style>
        body { font-family: sans-serif; line-height: 1.6; color: #333; }
        h1, h2, h3, h4 { color: #4F46E5; }
        h1 { font-size: 2.2em; border-bottom: 2px solid #ddd; }
        h2 { font-size: 1.8em; margin-top: 2em; }
        h3 { font-size: 1.4em; }
        h4 { font-size: 1.1em; color: #1F2937; }
        ul { list-style-type: disc; padding-left: 20px; }
        strong { color: #1F2937; }
        .card { border: 1px solid #eee; border-left: 5px solid #10B981; padding: 15px; margin-bottom: 20px; border-radius: 5px; background-color: #f9f9f9; }
      </style>
      <h1>A-level Choices Report</h1>
      <h2>Your Subjects: ${activeSubjects}</h2>
    `;
  
    if (section2Data) {
      content += `<div class="card"><h3>Your Future Persona</h3><h4>${section2Data.careerPersona.title}</h4><p>${section2Data.careerPersona.description}</p></div>`;
      content += `<div class="card"><h3>Your Future Story</h3><p>${section2Data.futureStory}</p></div>`;
      content += `<div class="card"><h3>University Courses</h3><ul>${section2Data.universityCourses.map(c => `<li><strong>${c.name}</strong> (${c.university})</li>`).join('')}</ul></div>`;
      content += `<div class="card"><h3>Popular Careers</h3><ul>${section2Data.popularCareers.map(c => `<li><strong>${c.name}:</strong> ${c.description}</li>`).join('')}</ul></div>`;
      content += `<div class="card"><h3>Earning Potential</h3><p><strong>${section2Data.earningPotential.range}</strong></p><p>${section2Data.earningPotential.details}</p></div>`;
    }

    if (skippableSubjects) {
        content += `<h2>Further Possibilities</h2>`;
        content += `<div class="card"><h3>Could you skip a subject?</h3>${skippableSubjects.map(s => `<div><h4>${s.subject}</h4><p>${s.isSkippable ? 'Yes' : 'No'}: ${s.reason}</p></div>`).join('')}</div>`;
    }

    const newWindow = window.open('', '_blank');
    if (newWindow) {
        newWindow.document.write(content);
        newWindow.document.close();
    }
  };


  return (
    <footer className="mt-16 text-center text-sm text-gray-500">
       {initialReportData && (
        <div className="mb-6">
          <button 
            onClick={handleExport}
            className="bg-gray-700 text-white font-bold py-2 px-5 rounded-lg shadow-sm hover:bg-gray-800 transition-colors duration-200"
          >
            Export Results to Document
          </button>
        </div>
      )}
      <div className="border-t border-gray-200 pt-6">
        <p>Copyright Tony Thomas. Experimental app using public data from official sources.</p>
        <p className="mt-2">
          Primary sources include: 
          <a href="https://www.informedchoices.ac.uk" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline">Informed Choices (Russell Group)</a>, 
          <a href="https://www.ucas.com" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline ml-2">UCAS</a>, and official UK government data.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
