import React from "react";
import { LayoutGrid, List, SlidersHorizontal, Search } from "lucide-react";
import { Button } from "../../../../components/ui/Button.jsx";

export default function ApplicationsHeader({
  viewMode,
  setViewMode,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  showFilters,
  setShowFilters,
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-(--color-secondary-main) tracking-tight">My Applications</h1>
          <p className="text-sm text-(--color-secondary-muted) font-semibold mt-1">
            Track the status of all your job applications
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-slate-100/80 p-1 rounded-[24px] flex border border-slate-200/40 shadow-2xs">
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold rounded-[24px] transition-all duration-200 ease-in-out cursor-pointer ${viewMode === "timeline"
                  ? "bg-white shadow-xs text-(--color-secondary-main)"
                  : "text-slate-400 hover:text-slate-650"
                }`}
            >
              <List className="w-4 h-4" /> Timeline View
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-bold rounded-[24px] transition-all duration-200 ease-in-out cursor-pointer ${viewMode === "kanban"
                  ? "bg-white shadow-xs text-(--color-secondary-main)"
                  : "text-slate-400 hover:text-slate-650"
                }`}
            >
              <LayoutGrid className="w-4 h-4" /> Kanban View
            </button>
          </div>

          <Button
            variant={showFilters ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="!py-2 !px-5 text-xs md:text-sm font-bold gap-2 rounded-[24px] cursor-pointer transition-all duration-200 ease-in-out shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_12px_rgba(15,23,42,0.03)] mt-4 w-full flex flex-col sm:flex-row gap-4 items-center animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex-1 w-full relative">
            <input
              type="text"
              placeholder="Search by role or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 focus:border-[var(--color-primary-main)] rounded-xl text-sm focus:outline-hidden focus:ring-1 focus:ring-[var(--color-primary-main)] font-semibold text-(--color-secondary-main) transition-all duration-200"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>

          {viewMode === "timeline" && (
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-200 focus:border-[var(--color-primary-main)] focus:ring-1 focus:ring-[var(--color-primary-main)] rounded-xl text-sm focus:outline-hidden font-bold text-slate-700 bg-white transition-all duration-200 cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="inProgress">In Progress</option>
                <option value="offers">Offers</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import PropTypes from "prop-types";

ApplicationsHeader.propTypes = {
  viewMode: PropTypes.oneOf(["timeline", "kanban"]).isRequired,
  setViewMode: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  statusFilter: PropTypes.string.isRequired,
  setStatusFilter: PropTypes.func.isRequired,
  showFilters: PropTypes.bool.isRequired,
  setShowFilters: PropTypes.func.isRequired,
};
