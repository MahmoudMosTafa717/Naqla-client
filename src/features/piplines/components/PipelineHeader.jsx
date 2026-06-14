import { Briefcase, SlidersHorizontal, Download } from 'lucide-react';
import PropTypes from 'prop-types';

function PipelineHeader({ jobTitle = "Loading Job...", totalCandidates = 0, avgMatchScore = 0, avgTimeToHire = "14d", sortBy = "score", onSortChange, onExport }) {
  return (
    <div className="space-y-4">
      {/* Top Title & Actions Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">Candidate Pipeline</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Drag and drop candidates to move them through your hiring process</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white border border-(--color-border) rounded-[24px] px-4 py-2 shadow-micro">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[var(--color-primary-main)]" />
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => onSortChange(e.target.value)}
              className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none font-bold text-(--color-secondary-main) cursor-pointer text-xs ml-1"
            >
              <option value="score">AI Match Score</option>
              <option value="date">Applied Date</option>
            </select>
          </div>
          <button 
            onClick={onExport}
            className="bg-white border-2 border-[var(--color-primary-main)] text-[var(--color-primary-main)] hover:bg-[var(--color-bg-light-tint)] text-xs font-bold px-5 py-2.5 rounded-[24px] shadow-micro transition-all flex items-center gap-1.5 cursor-pointer ml-auto md:ml-0"
          >
            <Download className="w-3.5 h-3.5" /> Export Pipeline
          </button>
        </div>
      </div>

      {/* Info Card Row */}
      <div className="bg-white rounded-2xl border border-(--color-border) p-5 shadow-micro flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 bg-[var(--color-bg-light-tint)] rounded-[24px] text-[var(--color-primary-main)] shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">{jobTitle}</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{totalCandidates} total candidates in pipeline</p>
          </div>
        </div>

        <div className="flex gap-6 sm:gap-8 items-center sm:text-right pr-0 sm:pr-4 w-full sm:w-auto justify-between sm:justify-end border-t border-(--color-border) sm:border-t-0 pt-3 sm:pt-0">
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{avgMatchScore}%</span>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-0.5">Avg AI Match</p>
          </div>
          <div className="hidden sm:block border-l border-(--color-border) h-8"></div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{avgTimeToHire}</span>
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 mt-0.5">Avg Time to Hire</p>
          </div>
        </div>
      </div>
    </div>
  );
}

PipelineHeader.propTypes = {
  jobTitle: PropTypes.string,
  totalCandidates: PropTypes.number,
  avgMatchScore: PropTypes.number,
  avgTimeToHire: PropTypes.string,
  sortBy: PropTypes.string,
  onSortChange: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};

export default PipelineHeader;
