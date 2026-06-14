import React from 'react';

export default function ApplicationsStats({ apps = [] }) {
  const total = apps.length;
  const inProgress = apps.filter(app => app.kanbanBucket === 'inProgress').length;
  const offers = apps.filter(app => app.kanbanBucket === 'offers').length;

  // Calculate Response Rate: percentage of applications progressed beyond initial stage
  const responded = apps.filter(app => app.currentStageIndex > 0 || app.status === "Rejected").length;
  const responseRate = total > 0 ? `${Math.round((responded / total) * 100)}%` : "0%";

  const stats = [
    { label: "Total Applications", value: total, color: "text-(--color-secondary-main)" },
    { label: "In Progress", value: inProgress, color: "text-[var(--color-primary-main)]" },
    { label: "Offers", value: offers, color: "text-emerald-600" },
    { label: "Response Rate", value: responseRate, color: "text-sky-600" }
  ];

  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
      {stats.map((state, idx) => (
        <div key={idx} className='bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_4px_12px_rgba(15,23,42,0.03)] hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300 ease-in-out'>
          <p className="text-xs font-bold text-(--color-secondary-muted) mb-1">{state.label}</p>
          <span className={`text-2xl font-extrabold ${state.color}`}>{state.value}</span>
        </div>
      ))}
    </div>
  );
}

import PropTypes from "prop-types";

ApplicationsStats.propTypes = {
  apps: PropTypes.arrayOf(
    PropTypes.shape({
      kanbanBucket: PropTypes.string,
      currentStageIndex: PropTypes.number,
      status: PropTypes.string,
    })
  ),
};