import React from "react";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "../../../../components/ui/Button";


export default function ApplicationsHeader({ viewMode, setViewMode }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
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

        <Button size="sm" className="!py-2 !px-4 text-sm font-bold gap-2">
          <SlidersHorizontal className="w-4 h-4" /> Filter
        </Button>
      </div>
    </div>
  );
}
