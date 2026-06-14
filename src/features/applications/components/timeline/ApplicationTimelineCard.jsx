import React from "react";
import { Calendar, MessageSquare, Briefcase, CheckCircle2, MapPin, Check, X } from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../../../store/chatStore";
import { toast } from "react-toastify";

export default function ApplicationTimelineCard({ app }) {
  const navigate = useNavigate();
  const openChat = useChatStore((state) => state.openChat);
  const targetStages = ["Applied", "Reviewed", "Interview", "Offer"];

  const renderAlertBanner = () => {
    if (app.status === "Interview Scheduled") {
      return (
        <div className="mt-4 bg-sky-50/50 border border-sky-100/80 rounded-xl p-3.5 flex gap-2.5 items-center text-xs md:text-sm text-sky-700 font-semibold shadow-2xs">
          <Calendar className="w-4 h-4 shrink-0" />
          <span>Interview scheduled — {app.alertMessage}</span>
        </div>
      );
    }
    if (app.status === "Rejected") {
      return (
        <div className="mt-4 bg-red-50/50 border border-red-100/80 rounded-xl p-3.5 flex gap-2.5 items-start text-xs md:text-sm text-red-650 font-semibold shadow-2xs">
          <div className="w-4.5 h-4.5 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            ✕
          </div>
          <div>
            <span className="block font-bold">Application not successful</span>
            <span className="text-(--color-secondary-muted) font-medium text-xs mt-0.5 block">{app.alertMessage}</span>
          </div>
        </div>
      );
    }
    if (app.status === "Offer Received" || app.status === "Hired") {
      return (
        <div className="mt-4 bg-emerald-50/50 border border-emerald-100/80 rounded-xl p-3.5 flex gap-2.5 items-center text-xs md:text-sm text-emerald-700 font-semibold shadow-2xs">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-650 shrink-0" />
          <div>
            <span className="block font-bold">{app.status === "Hired" ? "Hired!" : "Offer received!"}</span>
            <span className="text-emerald-650/80 font-medium text-xs mt-0.5 block">{app.alertMessage}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const getStatusBadgeClass = (status) => {
    if (status === "Rejected") {
      return "bg-red-50 text-red-750 border-red-100/60";
    }
    if (status === "Offer Received" || status === "Hired") {
      return "bg-emerald-50 text-emerald-750 border-emerald-100/60";
    }
    if (status === "Interview Scheduled") {
      return "bg-sky-50 text-sky-750 border-sky-100/60";
    }
    return "bg-blue-50 text-blue-750 border-blue-100/60";
  };

  return (
    <div className="bg-white border border-(--color-border) shadow-micro p-6 rounded-2xl w-full hover:border-blue-200/50 hover:shadow-hover hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Left: Avatar Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-primary-main)] to-[#3b82f6] text-white font-bold text-2xl shrink-0 flex items-center justify-center shadow-sm">
          <Briefcase className="w-7 h-7" />
        </div>

        {/* Right: Content details */}
        <div className="flex-1 min-w-0">
          {/* Top Line: Title & Score Badge on Left, Status Badge on Right */}
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <div className="flex items-center gap-2.5">
              <h3 className="text-xl font-extrabold text-(--color-secondary-main) tracking-tight">
                {app.role}
              </h3>
            </div>
            <div className="shrink-0">
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusBadgeClass(app.status)}`}>
                {app.status}
              </span>
            </div>
          </div>

          {/* Company Name */}
          <p className="text-sm text-(--color-secondary-muted) font-bold mt-1">{app.company}</p>

          {/* Location & Applied Date */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2 text-xs md:text-sm text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-350 shrink-0" />
              {app.location}
            </span>
            <span className="hidden md:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-350 shrink-0" />
              Applied {app.appliedDate}
            </span>
          </div>
        </div>
      </div>

      {renderAlertBanner()}

      <div className="relative flex justify-between items-center px-4 pb-14 pt-2 mt-6 w-full">
        {targetStages.map((stage, idx) => {
          const isPassed = idx <= app.currentStageIndex;
          const isRejectedStage = app.status === "Rejected" && stage === "Offer";

          const isLineActive = idx < app.currentStageIndex;
          const isLineRejected = app.status === "Rejected" && idx >= app.currentStageIndex;
          const lineColorClass = isLineActive
            ? "bg-[var(--color-primary-main)]"
            : isLineRejected
              ? "bg-red-500"
              : "bg-slate-100";

          return (
            <React.Fragment key={stage}>
              <div className="relative flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isRejectedStage
                      ? "bg-red-500 border-red-500 text-white"
                      : isPassed
                        ? "bg-[var(--color-primary-main)] border-[var(--color-primary-main)] text-white"
                        : "bg-white border-slate-200 text-slate-300"
                    }`}
                >
                  {isPassed || isRejectedStage ? (
                    isRejectedStage ? (
                      <X className="w-4 h-4 text-white" />
                    ) : (
                      <Check className="w-4 h-4 text-white" />
                    )
                  ) : (
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
                  )}
                </div>

                <div className="absolute top-10 flex flex-col items-center whitespace-nowrap">
                  <span className="text-xs md:text-sm font-bold text-(--color-secondary-main)">
                    {isRejectedStage ? "Rejected" : stage}
                  </span>
                  <span className="text-[10px] md:text-xs text-slate-400 font-semibold mt-0.5">
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
      <div className="flex flex-wrap items-center gap-3 border-t border-(--color-border) pt-4 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/candidate/jobs/${app.jobId}`)}
          className="hover:bg-[var(--color-primary-main)] hover:text-white px-4 py-2 rounded-[24px] text-xs md:text-sm font-bold transition-all shadow-2xs"
        >
          View Job
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/candidate/application/${app.id}`)}
          className="hover:bg-[var(--color-primary-main)] hover:text-white px-4 py-2 rounded-[24px] text-xs md:text-sm font-bold transition-all shadow-2xs"
        >
          View Application
        </Button>
        {app.status === "Interview Scheduled" && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => toast.info(app.alertMessage || "Check your email for details")}
            className="hover:bg-blue-700 px-4 py-2 rounded-[24px] text-xs md:text-sm font-bold transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" /> Interview Details
          </Button>
        )}
      </div>
    </div>
  );
}

import PropTypes from "prop-types";

ApplicationTimelineCard.propTypes = {
  app: PropTypes.shape({
    id: PropTypes.string.isRequired,
    jobId: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    company: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    appliedDate: PropTypes.string.isRequired,
    aiScore: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired,
    alertMessage: PropTypes.string,
    currentStageIndex: PropTypes.number.isRequired,
    stageDates: PropTypes.shape({
      applied: PropTypes.string,
      reviewed: PropTypes.string,
      interview: PropTypes.string,
      offer: PropTypes.string,
    }).isRequired,
  }).isRequired,
};