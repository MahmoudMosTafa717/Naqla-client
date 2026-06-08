import React from 'react';
import { Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ApplicationKanbanCard({ app }) {
  const navigate = useNavigate();
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
        <button
          onClick={() => navigate(`/candidate/jobs/${app.jobId}`)}
          className="border border-gray-200 text-gray-700 font-bold text-xs md:text-sm px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shrink-0">
          View Job
        </button>
        <button
          onClick={() => navigate(`/candidate/application/${app.id}`)}
          className="border border-[var(--color-brand-blue)] text-[var(--color-brand-blue)] font-bold text-xs md:text-sm px-3 py-1.5 rounded-lg hover:bg-blue-50/50 transition-colors cursor-pointer shrink-0">
          View Application
        </button>
      </div>
    </div>
  );
}