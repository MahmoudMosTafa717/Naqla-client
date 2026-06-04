import React from 'react';
import CandidateCard from './CandidateCard';
import { useDroppable } from '@dnd-kit/core';

function KanbanColumn({title, id, count, candidates, colorClass}) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`flex flex-col gap-3 w-[300px] sm:w-[340px] shrink-0 p-2.5 rounded-2xl transition-all duration-200 border-2 ${
        isOver ? 'bg-blue-50/40 border-blue-200/60 shadow-xs' : 'bg-transparent border-transparent'
      }`}
    >
      {/* Column Header Card */}
      <div className={`bg-white rounded-xl shadow-xs p-3.5 flex justify-between items-center border-t-4 ${colorClass}`}>
        <h3 className='font-bold text-slate-800 text-sm tracking-wide'>{title}</h3>
        <span className='rounded-full bg-slate-100 text-slate-600 px-2 py-0.5 text-xs font-bold border border-slate-200/50 shadow-2xs'>{count || 0}</span>
      </div>

      {/* Cards List */}
      <div className='space-y-3 overflow-y-auto flex-1 max-h-[500px] md:max-h-[calc(100vh-240px)] scrollbar-none pb-4'>
        {candidates && candidates.length > 0 ? (
          candidates.map(candidate => (
            <CandidateCard key={candidate.id} candidateDate={candidate} />
          ))
        ) : (
          <div className='flex items-center justify-center h-48 text-slate-400/80 text-xs font-medium border-2 border-dashed border-slate-200/60 rounded-xl bg-white/50'>
            No candidates
          </div>
        )}
      </div>
    </div>
  );
}

export default KanbanColumn;