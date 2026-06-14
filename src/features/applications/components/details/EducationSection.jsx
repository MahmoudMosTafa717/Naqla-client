import { GraduationCap } from "lucide-react";
import PropTypes from 'prop-types';

export default function EducationSection({ education }) {
  const { degree, university, meta } = education || {};
  return (
    <div className='bg-white border border-slate-100 rounded-2xl p-6 space-y-6 shadow-[0_4px_12px_rgba(15,23,42,0.03)]'>
      <h3 className="font-extrabold text-base text-(--color-secondary-main) border-b border-slate-100 pb-3">Education</h3>
      <div className="flex items-center gap-4 p-4 bg-slate-100/30 rounded-xl border border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-light-tint)] flex items-center justify-center shrink-0 shadow-2xs">
          <GraduationCap className="w-5 h-5 text-[var(--color-primary-main)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-(--color-secondary-main)">{degree}</span>
            <span className="text-xs text-(--color-secondary-muted) font-medium">{university}</span>
          </div>
          <p className="text-xs text-(--color-secondary-muted) font-semibold mt-1">{meta}</p>
        </div>
      </div>
    </div>
  );
}

EducationSection.propTypes = {
  education: PropTypes.shape({
    degree: PropTypes.string,
    university: PropTypes.string,
    meta: PropTypes.string,
  }).isRequired,
};