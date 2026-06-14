import CandidateCard from './CandidateCard';
import { useDroppable } from '@dnd-kit/core';
import PropTypes from 'prop-types';

function KanbanColumn({title, id, count, candidates, colorClass}) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col gap-3 w-[300px] sm:w-[340px] shrink-0 p-2.5 rounded-2xl transition-all duration-300 border-2 ${
        isOver ? 'bg-[#EFF6FF]/55 border-blue-200/60 shadow-md scale-[1.01] ring-4 ring-blue-500/5' : 'bg-[#EFF6FF]/25 border-(--color-border)'
      }`}
    >
      {/* Column Header Card */}
      <div className={`bg-white rounded-xl shadow-micro p-3.5 flex justify-between items-center border-t-4 border-l border-r border-b border-l-slate-100/50 border-r-slate-100/50 border-b-slate-100/50 ${colorClass}`}>
        <h3 className='font-extrabold text-(--color-secondary-main) text-sm tracking-wide'>{title}</h3>
        <span className='rounded-full bg-[var(--color-bg-light-tint)] text-[var(--color-primary-main)] px-2.5 py-0.5 text-xs font-bold border border-blue-100 shadow-2xs'>{count || 0}</span>
      </div>

      {/* Cards List */}
      <div className='space-y-3 overflow-y-auto flex-1 max-h-[500px] md:max-h-[calc(100vh-240px)] scrollbar-none pb-4'>
        {candidates && candidates.length > 0 ? (
          candidates.map(candidate => (
            <CandidateCard key={`${candidate.id}-${id}`} candidateDate={candidate} />
          ))
        ) : (
          <div className='flex items-center justify-center h-48 text-(--color-secondary-muted) text-xs font-semibold border-2 border-dashed border-(--color-border) rounded-2xl bg-white/40'>
            No candidates
          </div>
        )}
      </div>
    </div>
  );
}

KanbanColumn.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  count: PropTypes.number,
  candidates: PropTypes.arrayOf(PropTypes.object).isRequired,
  colorClass: PropTypes.string,
};

export default KanbanColumn;