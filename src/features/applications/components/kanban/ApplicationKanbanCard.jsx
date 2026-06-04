import React from 'react';
import { Briefcase } from 'lucide-react';
import { AIScoreBadge } from '../../../../components/ui/AIScoreBadge';

export default function ApplicationKanbanCard({ app }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all space-y-3.5 w-full">
      <div className="flex gap-3 items-center">

        <div className="w-11 h-11 rounded-lg bg-blue-50 text-[var(--color-brand-blue)] flex items-center justify-center shrink-0">
          <Briefcase className="w-5.5 h-5.5" />
        </div>

        <div className="truncate">
          <h4 className="font-bold text-slate-900 text-sm md:text-base truncate">{app.role}</h4>
          <p className="text-xs md:text-sm text-gray-400 font-bold truncate mt-0.5">{app.company}</p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-1 gap-2">
        <AIScoreBadge score={app.aiScore} showIcon={true} />
        <button className="border border-[var(--color-brand-blue)] text-[var(--color-brand-blue)] font-bold text-xs md:text-sm px-4 py-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer shrink-0">
          View
        </button>
      </div>
    </div>
  );
}