import React from 'react';
import { Briefcase } from 'lucide-react';
import PropTypes from 'prop-types';

export default function WorkExperienceTimeline({ experience = [] }) {
  return (
    <div className="border border-slate-100 rounded-2xl bg-white p-6 space-y-6 shadow-[0_4px_12px_rgba(15,23,42,0.03)]">
      <h3 className="font-extrabold text-base text-(--color-secondary-main) border-b border-slate-100 pb-3">Work Experience</h3>
      <div className="space-y-5">
        {experience.map((work, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-light-tint)] flex items-center justify-center shrink-0 shadow-2xs">
              <Briefcase className="w-5 h-5 text-[var(--color-primary-main)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-(--color-secondary-main)">{work.role}</span>
                <span className="text-xs text-(--color-secondary-muted) font-medium">{work.period}</span>
              </div>
              <p className="text-xs text-[var(--color-primary-main)] font-semibold mt-0.5">{work.company}</p>
              {work.desc && <p className="text-xs text-(--color-secondary-muted) mt-1.5 leading-relaxed">{work.desc}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

WorkExperienceTimeline.propTypes = {
  experience: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string,
      company: PropTypes.string,
      period: PropTypes.string,
      desc: PropTypes.string,
    })
  ),
};