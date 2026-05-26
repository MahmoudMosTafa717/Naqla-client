import { useAuthStore } from "../store/authStore";

export default function EmployerDashboard() {
  const user = useAuthStore((s) => s.user);
  const membership = useAuthStore((s) => s.membership);

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-brand-blue">Company Workspace</h1>
      <p className="text-slate-600 mt-2">
        Welcome, {user?.fullName || user?.email}. Manage jobs and applications for your company here.
      </p>
      {membership?.companyStatus && (
        <p className="mt-4 text-sm text-slate-500">
          Company status: <strong>{membership.companyStatus}</strong>
        </p>
      )}
    </div>
  );
}
