import React, { useState } from 'react';
import PipelineHeader from '../features/piplines/components/PipelineHeader';
import KanbanColumn from '../features/piplines/components/KanbanColumn';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

const mockData = {
  
  applied: [
    { id: '1', initials: 'SJ', name: 'Sarah Johnson', role: 'Senior Frontend Developer', email: 'sarah.j@email.com', phone: '+1 234-567-8900', appliedAt: '2 days ago', experience: 6, location: 'San Francisco', score: 95, isStarred: true, skills: ['React', 'TypeScript', 'Tailwind'] },
    { id: '2', initials: 'MC', name: 'Michael Chen', role: 'Senior Frontend Developer', email: 'mchen@email.com', phone: '+1 234-567-8901', appliedAt: '3 days ago', experience: 5, location: 'Remote', score: 88, skills: ['React', 'Next.js', 'Redux'] }
  ],
  shortlisted: [
    { id: '3', initials: 'DK', name: 'David Kim', role: 'Senior Frontend Developer', email: 'david.k@email.com', phone: '+1 234-567-8903', appliedAt: '5 days ago', experience: 7, location: 'Seattle', score: 91, skills: ['React', 'JavaScript', 'CSS'] },
    { id: '4', initials: 'LA', name: 'Lisa Anderson', role: 'Senior Frontend Developer', email: 'lisa.a@email.com', phone: '+1 234-567-8904', appliedAt: '6 days ago', experience: 5, location: 'Austin', score: 85, redFlags: 'Gap in employment', skills: ['React', 'TypeScript', 'GraphQL'] }
  ],
  interview: [
    { id: '5', initials: 'JW', name: 'James Wilson', role: 'Senior Frontend Developer', email: 'james.w@email.com', phone: '+1 234-567-8905', appliedAt: '1 week ago', experience: 6, location: 'Boston', score: 93, isStarred: true, skills: ['React', 'TypeScript', 'Node.js'] }
  ],
  offerSent: [
    { id: '6', initials: 'AM', name: 'Anna Martinez', role: 'Senior Frontend Developer', email: 'anna.m@email.com', phone: '+1 234-567-8906', appliedAt: '2 weeks ago', experience: 8, location: 'Los Angeles', score: 94, skills: ['React', 'TypeScript', 'Next.js'] }
  ],
  hired: [],
  rejected: [
    { id: '7', initials: 'TB', name: 'Tom Brown', role: 'Senior Frontend Developer', email: 'tom.b@email.com', phone: '+1 234-567-8907', appliedAt: '1 week ago', experience: 2, location: 'Chicago', score: 45, redFlags: 'Insufficient experience, Skills mismatch', skills: ['HTML', 'CSS', 'JavaScript'] }
  ]
};

function KanbanPipeline() {
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState(mockData);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );
  const handleDragEnd = (event) => {
    const {active, over} = event;
    if(!over) return;

    const cardId = active.id;
    const targetColumnId = over.id;
    let sourceColumnId = null;

    Object.keys(columns).forEach(colId => {
      if (columns[colId].some(candidate => candidate.id === cardId)) {
        sourceColumnId = colId;
      }
    });
    if (sourceColumnId === targetColumnId) return;
    const sourceColumn = [...columns[sourceColumnId]];
    const targetColumn = [...columns[targetColumnId]];

    const cardIndex = sourceColumn.findIndex(c => c.id === cardId);
    const [movedCard] = sourceColumn.splice(cardIndex, 1);
    targetColumn.push(movedCard);
    setColumns({
      ...columns,
      [sourceColumnId]: sourceColumn,
      [targetColumnId]: targetColumn
    });


  }

  if(loading) {
    return (
      <div className="p-6 bg-slate-50/50 min-h-screen space-y-6">
        <div className="h-24 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-gray-100 border border-gray-200/60 rounded-2xl p-4 h-[600px] space-y-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
              <div className="h-40 bg-gray-200 rounded-xl"></div>
              <div className="h-40 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="p-6 bg-slate-50/50 min-h-screen text-gray-800 font-sans flex flex-col gap-6">
      <PipelineHeader />
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-6 select-none flex-1 items-start">
        <KanbanColumn id="applied" title="Applied" count={columns.applied.length} candidates={columns.applied} colorClass="border-t-blue-500" />
        <KanbanColumn id="shortlisted" title="Shortlisted" count={columns.shortlisted.length} candidates={columns.shortlisted} colorClass="border-t-teal-400" />
        <KanbanColumn id="interview" title="Interview" count={columns.interview.length} candidates={columns.interview} colorClass="border-t-purple-500" />
        <KanbanColumn id="offerSent" title="Offer Sent" count={columns.offerSent.length} candidates={columns.offerSent} colorClass="border-t-amber-500" />
        <KanbanColumn id="hired" title="Hired" count={columns.hired.length} candidates={columns.hired} colorClass="border-t-emerald-500" />
        <KanbanColumn id="rejected" title="Rejected" count={columns.rejected.length} candidates={columns.rejected} colorClass="border-t-red-500" />
      </div>
      </DndContext>
    </div>
  );
}

export default KanbanPipeline;