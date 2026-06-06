import React from 'react';
import { Briefcase, SlidersHorizontal, Download } from 'lucide-react';

function PipelineHeader() {
  return (
    <div className="space-y-4">
      {/* Top Title & Actions Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-blue-950">Candidate Pipeline</h1>
          <p className="text-xs text-gray-400 font-medium mt-0.5">Drag and drop candidates to move them through your hiring process</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 cursor-pointer">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-500" /> Sorted by AI match score
          </button>
          <button className="bg-white border-2 border-blue-900 text-blue-900 hover:bg-blue-50 text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ml-auto md:ml-0">
            <Download className="w-3.5 h-3.5" /> Export Pipeline
          </button>
        </div>
      </div>

      {/* Info Card Row */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-50 rounded-xl text-cyan-700 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-base">Senior Frontend Developer</h2>
            <p className="text-xs text-gray-400 font-medium">8 total candidates in pipeline</p>
          </div>
        </div>

        <div className="flex gap-6 sm:gap-8 items-center sm:text-right pr-0 sm:pr-4 w-full sm:w-auto justify-between sm:justify-end border-t border-gray-50 sm:border-t-0 pt-3 sm:pt-0">
          <div>
            <span className="text-2xl font-black text-gray-900">84%</span>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Avg AI Match</p>
          </div>
          <div className="hidden sm:block border-l border-gray-100 h-8"></div>
          <div>
            <span className="text-2xl font-black text-emerald-600">21d</span>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Avg Time to Hire</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PipelineHeader;
