import React from 'react';
import ApplicationKanbanCard from './ApplicationKanbanCard';

export default function ApplicationKanbanColumn({ title, apps = [] }) {
  return (
    <div className="bg-[#EFF6FF]/25 border border-(--color-border) shadow-micro rounded-2xl p-5 flex flex-col space-y-4 w-full h-full">
      {/* Column Header */}
      <div className="flex justify-between items-center px-1">
        <h3 className="font-extrabold text-(--color-secondary-main) text-sm tracking-wide">{title}</h3>
        <span className="bg-[var(--color-bg-light-tint)] text-[var(--color-primary-main)] border border-blue-100 text-xs px-2.5 py-0.5 rounded-full font-bold shadow-2xs">
          {apps.length}
        </span>
      </div>

      {/* Cards Tracks Area */}
      <div className="bg-white/40 border border-(--color-border) p-3 rounded-2xl flex-1 flex flex-col gap-3 min-h-[350px]">
        {apps.map(app => (
          <ApplicationKanbanCard key={app.id} app={app} />
        ))}
        {apps.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-(--color-secondary-muted) text-xs font-semibold py-12">
            No applications
          </div>
        )}
      </div>
    </div>
  );
}

import PropTypes from "prop-types";

ApplicationKanbanColumn.propTypes = {
  title: PropTypes.string.isRequired,
  apps: PropTypes.arrayOf(PropTypes.object),
};