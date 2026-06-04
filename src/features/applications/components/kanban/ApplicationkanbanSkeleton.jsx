import React from 'react';


function KanbanCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-xs space-y-3.5 w-full animate-pulse">
      <div className="flex gap-3 items-center">

        <div className="w-11 h-11 rounded-lg bg-slate-200 shrink-0" />

        <div className="truncate flex-1 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
          <div className="h-3 bg-slate-100 rounded w-1/2" />
        </div>
      </div>

      <div className="flex justify-between items-center pt-1 gap-2">
        <div className="h-6 bg-slate-100 rounded-md w-16" />
        <div className="h-8 bg-slate-200 rounded-lg w-16" />
      </div>
    </div>
  );
}

export default function ApplicationkanbanSkeleton() {
  
  const columnData = [
    { title: 'In Progress', cardCount: 3 },
    { title: 'Offers', cardCount: 1 },
    { title: 'Rejected', cardCount: 1 }
  ];

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full items-stretch">
      {columnData.map((col, idx) => (
        <div key={idx} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 flex flex-col space-y-4 w-full h-full animate-pulse">
          <div className="flex justify-between items-center px-1">
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="w-6 h-6 rounded-full bg-slate-100" />
          </div>

          <div className="bg-slate-50/50 border border-slate-100/50 p-3 rounded-xl flex-1 flex flex-col gap-3 min-h-[350px]">
            {Array.from({ length: col.cardCount }).map((_, cardIdx) => (
              <KanbanCardSkeleton key={cardIdx} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
