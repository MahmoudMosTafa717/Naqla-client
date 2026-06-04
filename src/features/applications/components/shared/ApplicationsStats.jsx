import React from 'react';

export default function ApplicationsStats() {
  const stats = [
    { label: "Total Applications", value: 5, color: "text-slate-900" },
    { label: "In Progress", value: 3, color: "text-teal-600" },
    { label: "Offers", value: 1, color: "text-emerald-600" },
    { label: "Response Rate", value: "60%", color: "text-blue-600" }
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