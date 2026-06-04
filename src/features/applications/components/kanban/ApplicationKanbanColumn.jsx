import React from 'react';
import ApplicationKanbanCard from './ApplicationKanbanCard';

export default function ApplicationKanbanColumn({ title, apps = [] }) {
  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col space-y-4 w-full h-full">
      {/* Column Header */}
      <div className="flex justify-between items-center px-1">
        <h3 className="font-bold text-slate-800 text-sm tracking-wide">{title}</h3>
        <span className="bg-blue-50 text-[var(--color-brand-blue)] text-xs px-2.5 py-0.5 rounded-full font-bold">
          {apps.length}
        </span>
      </div>

      {/* Cards Tracks Area */}
      <div className="bg-slate-50/50 border border-slate-100/50 p-3 rounded-xl flex-1 flex flex-col gap-3 min-h-[350px]">
        {apps.map(app => (
          <ApplicationKanbanCard key={app.id} app={app} />
        ))}
        {apps.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-xs font-semibold py-12">
            No applications
          </div>
        )}
      </div>
    </div>
  );
}