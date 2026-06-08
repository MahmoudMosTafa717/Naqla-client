import React from "react";
import { Calendar, MessageSquare, Briefcase, CheckCircle2, MapPin, Check, X, ArrowRight } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function ApplicationTimelineCard({ app }) {
  const navigate = useNavigate();
  const targetStages = ["Applied", "Reviewed", "Interview", "Offer"];

  const renderAlertBanner = () => {
    if (app.status === "Interview Scheduled") {
      return (
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 flex gap-2 items-center text-sm text-blue-700 font-semibold">
          <Calendar className="w-4 h-4 shrink-0" />
          <span>Interview scheduled — {app.alertMessage}</span>
        </div>
      );
    }
    if (app.status === "Rejected") {
      return (
        <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3 flex gap-2 items-center text-sm text-red-600 font-semibold">
          <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">
            ✕
          </div>
          <div>
            <span className="block font-bold">Application not successful</span>
            <span className="text-gray-500 font-medium">{app.alertMessage}</span>
          </div>
        </div>
      );
    }
    if (app.status === "Offer Received") {
      return (
        <div className="mt-4 bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-2 items-center text-sm text-emerald-700 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <div>
            <span className="block font-bold">Offer received!</span>
            <span className="text-emerald-600 font-medium">{app.alertMessage}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm p-6 rounded-2xl w-full hover:border-(--color-brand-teal)">
      <div className="flex items-start gap-4">
        {/* Left: Avatar Icon */}
        <div className="w-16 h-16 rounded-full bg-linear-to-br from-(--color-brand-blue) to-(--color-brand-teal) text-white font-bold text-2xl shrink-0 flex items-center justify-center">
          <Briefcase className="w-8 h-8" />
        </div>

        {/* Right: Content details */}
        <div className="flex-1 min-w-0">
          {/* Top Line: Title & Score Badge on Left, Status Badge on Right */}
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-bold text-[var(--color-brand-text)]">
                {app.role}
              </h3>
            </div>
            <div className="shrink-0">
              <span
                className={`text-xs font-bold px-3.5 py-1.5 rounded-full border uppercase tracking-wider ${
                  app.status === "Rejected"
                    ? "bg-red-50 text-red-500 border-red-100"
                    : app.status === "Offer Received"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}
              >
                {app.status}
              </span>
            </div>
          </div>

          {/* Company Name */}
          <p className="text-sm text-gray-500 font-bold mt-1.5">{app.company}</p>

          {/* Location & Applied Date */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs md:text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              {app.location}
            </span>
            <span className="hidden md:inline text-gray-300">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              Applied {app.appliedDate}
            </span>
          </div>
        </div>
      </div>

      {renderAlertBanner()}

      <div className="relative flex justify-between items-center px-4 pb-14 pt-2 mt-4 w-full">
        {targetStages.map((stage, idx) => {
          const isPassed = idx <= app.currentStageIndex;
          const isRejectedStage = app.status === "Rejected" && stage === "Offer";


          const isLineActive = idx < app.currentStageIndex;
          const isLineRejected = app.status === "Rejected" && idx >= app.currentStageIndex;
          const lineColorClass = isLineActive
            ? "bg-emerald-500"
            : isLineRejected
            ? "bg-red-500"
            : "bg-gray-100";

          return (
            <React.Fragment key={stage}>
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                    isRejectedStage
                      ? "bg-red-500 border-red-500 text-white"
                      : isPassed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "bg-white border-gray-200 text-gray-300"
                  }`}
                >
                  {isPassed || isRejectedStage ? (
                    isRejectedStage ? (
                      <X className="w-4.5 h-4.5 text-white" />
                    ) : (
                      <Check className="w-4.5 h-4.5 text-white" />
                    )
                  ) : (
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  )}
                </div>

                <div className="absolute top-10 flex flex-col items-center whitespace-nowrap">
                  <span className="text-xs md:text-sm font-bold text-slate-800">
                    {isRejectedStage ? "Rejected" : stage}
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-400 font-semibold mt-0.5">
                    {isPassed || isRejectedStage ? app.stageDates[stage.toLowerCase()] : ""}
                  </span>
                </div>
              </div>

              {/* 2. Connecting Line to Next Stage */}
              {idx < targetStages.length - 1 && (
                <div className={`flex-1 h-[2px] mx-2 transition-all duration-500 ${lineColorClass}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Action Buttons Section */}
      <div className="flex items-center gap-4 border-t border-gray-100 pt-4 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/candidate/jobs/${app.jobId}`)}
          className="hover:bg-[var(--color-brand-blue)] hover:text-white px-4 py-2 text-sm font-semibold"
        >
          View Job
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/candidate/application/${app.id}`)}
          className="hover:bg-[var(--color-brand-blue)] hover:text-white px-4 py-2 text-sm font-semibold"
        >
          View Application
        </Button>
        {app.status === "Interview Scheduled"  && (
          <Button variant="primary" size="sm" className="border border-transparent hover:text-[var(--color-brand-blue)] hover:bg-white hover:border-[var(--color-brand-blue)]  px-4 py-2 text-sm font-semibold">
            <Calendar className="w-3.5 h-3.5" /> Interview Details
          </Button>
        )}
        {app.status === "Offer Received"  && (
          <Button variant="primary" size="sm" className="border border-transparent hover:text-[var(--color-brand-blue)] hover:bg-white hover:border-[var(--color-brand-blue)]  px-4 py-2 text-sm font-semibold">
            <Check className="w-3.5 h-3.5" /> Offer Letter
          </Button>
        )}
        {(app.status === "In Review" || app.status === "Interview Scheduled")  && (
          <button className="flex items-center gap-2 bg-blue-50 text-[var(--color-brand-blue)] border border-transparent hover:text-[var(--color-brand-blue)] hover:bg-white hover:border-[var(--color-brand-blue)] px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer">
            <MessageSquare className="w-3.5 h-3.5" /> Message
          </button>
        )}
      </div>
    </div>
  );
}