import React from 'react';

export default function ApplicationsStats({ apps = [] }) {
  const total = apps.length;
  const inProgress = apps.filter(app => app.kanbanBucket === 'inProgress').length;
  const offers = apps.filter(app => app.kanbanBucket === 'offers').length;
  
  // Calculate Response Rate: percentage of applications progressed beyond initial stage
  const responded = apps.filter(app => app.currentStageIndex > 0 || app.status === "Rejected").length;
  const responseRate = total > 0 ? `${Math.round((responded / total) * 100)}%` : "0%";

  const stats = [
    { label: "Total Applications", value: total, color: "text-slate-900" },
    { label: "In Progress", value: inProgress, color: "text-teal-600" },
    { label: "Offers", value: offers, color: "text-emerald-600" },
    { label: "Response Rate", value: responseRate, color: "text-blue-600" }
  ];

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      {stats.map((state, idx) => (
        <div key={idx} className='bg-white rounded-xl border border-gray-100 p-5 shadow-sm'>
          <p className="text-xs font-semibold text-gray-400 mb-1">{state.label}</p>
          <span className={`text-2xl font-black ${state.color}`}>{state.value}</span>
        </div>
      ))}
    </div>
  );
}