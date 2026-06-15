import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

function statusVariant(status) {
  const map = {
    "Interview Scheduled": "info",
    "In Review": "warning",
    Reviewing: "warning",
    Applied: "default",
    Rejected: "error",
    "Offer Received": "success",
  };
  return map[status] ?? "default";
}

export default function ApplicationActivityCard({ applications }) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="bg-slate-50/50 p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 text-lg tracking-tight">Recent Application Activity</h3>
      </div>
      <CardContent>
        {applications.length === 0 ? (
          <p className="text-sm font-medium text-center text-slate-500 py-6 bg-slate-50 rounded-xl border border-slate-100">
            No applications yet.{" "}
            <button
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
              onClick={() => navigate("/candidate/jobs")}
            >
              Browse jobs to get started.
            </button>
          </p>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app._id ?? app.id}
                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => navigate("/candidate/applications")}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {app.jobId?.title ?? app.role ?? app.jobTitle ?? "Role"}
                  </h4>
                  <p className="text-sm font-medium text-slate-500 truncate">
                    {app.companyId?.name ?? app.company ?? app.companyName ?? ""}
                  </p>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <Badge variant={statusVariant(app.stage?.key ?? app.status)}>{app.stage?.key ?? app.status}</Badge>
                  {(app.createdAt || app.appliedDate) && (
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md">
                      {new Date(app.createdAt || app.appliedDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
