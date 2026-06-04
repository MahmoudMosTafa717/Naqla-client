import React from 'react';

export default function ApplicationTImelineSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-xs animate-pulse space-y-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-4 items-center w-full md:w-auto">
          <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0" />

          <div className="space-y-2.5 flex-1 md:flex-initial min-w-[200px]">
            <div className="h-5 bg-slate-200 rounded-md w-3/4" />
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <div className="h-3.5 bg-slate-100 rounded-md w-24" />
              <div className="h-3.5 bg-slate-100 rounded-md w-32" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="h-7 bg-slate-100 rounded-full w-20" />
          <div className="h-7 bg-slate-200 rounded-full w-28" />
        </div>
      </div>

      <div className="h-11 bg-slate-50 rounded-xl w-full" />

      <div className="py-4 flex items-center justify-between gap-2 w-full">
        {[1, 2, 3, 4].map((step, idx) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-full bg-slate-200" />
              <div className="h-3 bg-slate-100 rounded-md w-12" />
              <div className="h-2 bg-slate-50 rounded-md w-8" />
            </div>
            {idx < 3 && <div className="flex-1 h-0.5 bg-slate-100" />}
          </React.Fragment>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <div className="h-9 bg-slate-200 rounded-lg w-28" />
        <div className="h-9 bg-slate-100 rounded-lg w-36" />
        <div className="h-9 bg-slate-100 rounded-lg w-28" />
      </div>
    </div>
  );
}
