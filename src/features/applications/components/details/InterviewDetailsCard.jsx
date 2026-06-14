import { Calendar, ExternalLink } from 'lucide-react';
import PropTypes from 'prop-types';

function InterviewDetailsCard({ latestInterview }) {
  if (!latestInterview) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_4px_12px_rgba(15,23,42,0.03)] space-y-4">
      <h3 className="font-extrabold text-sm text-(--color-secondary-main) border-b border-slate-100 pb-3 flex items-center gap-2">
        <Calendar className="h-4.5 w-4.5 text-[var(--color-primary-main)]" />
        Interview Details
      </h3>
      <div className="space-y-3.5">
        <div>
          <span className="text-xs text-(--color-secondary-muted) font-semibold block mb-1">
            Status
          </span>
          <span
            className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-all duration-200 ease-in-out hover:scale-105 ${
              latestInterview.status === "scheduled" ||
              latestInterview.status === "rescheduled"
                ? "bg-[var(--color-bg-light-tint)] text-[var(--color-primary-main)] border border-blue-200/50"
                : latestInterview.status === "completed"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                  : "bg-red-50 text-red-700 border border-red-200/50"
            }`}
          >
            {latestInterview.status}
          </span>
        </div>
        <div>
          <span className="text-xs text-(--color-secondary-muted) font-semibold block mb-1">
            Date & Time
          </span>
          <span className="text-(--color-secondary-main) font-bold text-sm block">
            {new Date(latestInterview.interviewDate).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="text-(--color-secondary-muted) text-xs block mt-0.5">
            {new Date(latestInterview.interviewDate).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            ({latestInterview.timezone || 'GMT'})
          </span>
        </div>
        <div>
          <span className="text-xs text-(--color-secondary-muted) font-semibold block mb-1">
            Type
          </span>
          <span className="text-(--color-secondary-main) font-semibold text-sm capitalize">
            {latestInterview.interviewType} Interview
          </span>
        </div>

        {latestInterview.interviewType === "online" && latestInterview.meetingLink && (
          <div>
            <span className="text-xs text-(--color-secondary-muted) font-semibold block mb-1">
              Meeting Link
            </span>
            <a
              href={latestInterview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary-main)] hover:text-blue-700 text-xs font-semibold underline flex items-center gap-1 transition-all duration-200 ease-in-out"
            >
              Join Video Call <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        {latestInterview.interviewType === "onsite" && latestInterview.location && (
          <div>
            <span className="text-xs text-(--color-secondary-muted) font-semibold block mb-1">
              Location
            </span>
            <span className="text-(--color-secondary-main) text-xs font-medium">
              {latestInterview.location}
            </span>
          </div>
        )}

        {latestInterview.notes && (
          <div className="bg-slate-100/30 p-3 rounded-xl border border-slate-100">
            <span className="text-[10px] text-(--color-secondary-muted) font-bold uppercase tracking-wider block mb-1">
              Instructions
            </span>
            <p className="text-(--color-secondary-muted) text-xs whitespace-pre-line leading-relaxed">
              {latestInterview.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

InterviewDetailsCard.propTypes = {
  latestInterview: PropTypes.shape({
    status: PropTypes.string,
    interviewDate: PropTypes.string,
    timezone: PropTypes.string,
    interviewType: PropTypes.string,
    meetingLink: PropTypes.string,
    location: PropTypes.string,
    notes: PropTypes.string,
  }),
};

export default InterviewDetailsCard;
