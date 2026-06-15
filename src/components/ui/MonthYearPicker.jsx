import { useState, useMemo } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

export function MonthYearPicker({
  value,
  onChange,
  label,
  yearOnly = false,
  placeholder = "Select Date",
  error,
  className = "",
}) {
  // Determine initial year/month based on passed value
  const initialYear = value ? parseInt(value.slice(0, 4), 10) : new Date().getFullYear();
  
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(isNaN(initialYear) ? new Date().getFullYear() : initialYear);
  const [selectingYear, setSelectingYear] = useState(yearOnly);

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  // Calculate the decade bounds for the year view
  const currentDecadeStart = Math.floor(viewYear / 10) * 10;
  const decadeYears = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => currentDecadeStart - 1 + i);
  }, [currentDecadeStart]);

  const handleSelectYear = (year) => {
    if (yearOnly) {
      onChange(year.toString());
      setOpen(false);
    } else {
      setViewYear(year);
      setSelectingYear(false);
    }
  };

  const handleSelectMonth = (monthIndex) => {
    const mm = (monthIndex + 1).toString().padStart(2, "0");
    onChange(`${viewYear}-${mm}`);
    setOpen(false);
  };

  // Determine display text
  let displayText = placeholder;
  if (value) {
    if (yearOnly) {
      displayText = value;
    } else if (value.length >= 7) {
      const y = value.slice(0, 4);
      const m = parseInt(value.slice(5, 7), 10);
      if (!isNaN(m) && m >= 1 && m <= 12) {
        displayText = `${months[m - 1]} ${y}`;
      } else {
        displayText = value; // Fallback if format is odd
      }
    }
  }

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (isOpen) {
      const parsedYear = value ? parseInt(value.slice(0, 4), 10) : new Date().getFullYear();
      setViewYear(isNaN(parsedYear) ? new Date().getFullYear() : parsedYear);
      setSelectingYear(yearOnly);
    }
  };

  return (
    <div className={`flex flex-col w-full ${className}`}>
      {label && <label className="block text-sm font-medium mb-2 text-slate-800">{label}</label>}
      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={`flex items-center justify-between w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm group ${
              error ? "border-red-500" : "border-slate-200 hover:border-slate-300"
            } ${!value ? "text-slate-400" : "text-slate-700 font-medium"}`}
          >
            <span>{displayText}</span>
            <Calendar className={`w-4 h-4 transition-colors ${error ? "text-red-400 group-hover:text-red-500" : "text-slate-400 group-hover:text-blue-500"}`} />
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={8}
            className="z-50 w-[280px] bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-4 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 outline-none select-none"
          >
            {selectingYear ? (
              // YEAR SELECTION MODE
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setViewYear(viewYear - 10)}
                    className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-semibold text-slate-700 tracking-tight">
                    {decadeYears[1]} - {decadeYears[10]}
                  </span>
                  <button
                    onClick={() => setViewYear(viewYear + 10)}
                    className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {decadeYears.map((year, idx) => {
                    const isSelected = value && value.slice(0, 4) === year.toString();
                    const isOutsideDecade = idx === 0 || idx === 11;
                    return (
                      <button
                        key={year}
                        onClick={() => handleSelectYear(year)}
                        className={`py-2 text-sm rounded-xl font-medium transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : isOutsideDecade
                            ? "text-slate-300 hover:bg-slate-50 hover:text-slate-500"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              // MONTH SELECTION MODE
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setViewYear(viewYear - 1)}
                    className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectingYear(true)}
                    className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors px-3 py-1 rounded-md hover:bg-blue-50 flex items-center gap-1"
                  >
                    {viewYear}
                  </button>
                  <button
                    onClick={() => setViewYear(viewYear + 1)}
                    className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {months.map((m, idx) => {
                    const mm = (idx + 1).toString().padStart(2, "0");
                    const isSelected = value === `${viewYear}-${mm}`;
                    return (
                      <button
                        key={m}
                        onClick={() => handleSelectMonth(idx)}
                        className={`py-2 text-sm rounded-xl font-medium transition-all ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}
