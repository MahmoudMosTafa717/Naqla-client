import React from 'react';
import { Briefcase } from 'lucide-react';

export default function WorkExperienceTimeline({ experience = [] }) {
  return (
    <div className="border border-gray-100 rounded-2xl bg-white p-6 space-y-6 shadow-sm">
      <h3 className="font-bold text-base text-slate-900 border-b border-gray-100 pb-3">Work Experience</h3>
      <div className="space-y-5">
        {experience.map((work, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 shadow-xs">
              <Briefcase className="w-5 h-5 text-blue-900" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-900">{work.role}</span>
                <span className="text-xs text-slate-500 font-medium">{work.period}</span>
              </div>
              <p className="text-xs text-blue-600 font-semibold mt-0.5">{work.company}</p>
              {work.desc && <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{work.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}