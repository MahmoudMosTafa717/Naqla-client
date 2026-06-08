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
          <h1 className="text-2xl md:text-3xl font-bold text-blue-950">My Applications</h1>
          <p className="text-sm text-gray-400 font-medium mt-1">
            Track the status of all your job applications
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-gray-100 p-1 rounded-xl flex border border-gray-200/40">
            <button
              onClick={() => setViewMode("timeline")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                viewMode === "timeline"
                  ? "bg-white shadow-sm text-blue-950"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="w-4 h-4" /> Timeline View
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${
                viewMode === "kanban"
                  ? "bg-white shadow-sm text-blue-950"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Kanban View
            </button>
          </div>

          <Button
            variant={showFilters ? "primary" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="!py-2 !px-4 text-sm font-bold gap-2 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mt-4 w-full flex flex-col sm:flex-row gap-4 items-center transition-all duration-300">
          <div className="flex-1 w-full relative">
            <input
              type="text"
              placeholder="Search by role or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          {viewMode === "timeline" && (
            <div className="w-full sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-250 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-bold text-slate-700 bg-white"
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
