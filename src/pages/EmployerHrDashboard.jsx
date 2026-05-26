import { useAuthStore } from "../store/authStore";

export default function EmployerHrDashboard() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-brand-blue">HR Dashboard</h1>
      <p className="text-slate-600 mt-2">
        Welcome, {user?.fullName || user?.email}. You are a standalone HR recruiter until a company owner invites you.
      </p>
    </div>
  );
}
