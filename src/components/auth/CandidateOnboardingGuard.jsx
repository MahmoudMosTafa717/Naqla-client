import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { getCandidateProfile } from "../../services/profileApi";

export default function CandidateOnboardingGuard() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();
  const isCandidate = user?.role === "candidate";
  const [status, setStatus] = useState(isCandidate ? "loading" : "ready");

  useEffect(() => {
    if (!isCandidate) return undefined;

    let cancelled = false;

    void (async () => {
      try {
        const data = await getCandidateProfile();
        if (cancelled) return;
        setStatus(
          data?.profile?.onboardingCompleted ? "ready" : "needs-onboarding",
        );
      } catch {
        if (!cancelled) setStatus("ready");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isCandidate, location.pathname]);

  if (isCandidate && status === "loading") {
    return (
      <div className="min-h-[40vh] flex items-center justify-center" role="status">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  if (
    isCandidate &&
    status === "needs-onboarding" &&
    location.pathname !== "/candidate/profile-builder"
  ) {
    return <Navigate to="/candidate/profile-builder" replace />;
  }

  if (
    isCandidate &&
    status === "ready" &&
    location.pathname === "/candidate/profile-builder"
  ) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
