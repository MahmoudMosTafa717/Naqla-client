import { useAuthStore } from "../store/authStore";

/** Shown when an HR employer has no company assignment yet */
export default function EmployerOnboarding() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-brand-blue">Employer Onboarding</h1>
      <p className="text-slate-600 mt-2">
        Hi {user?.fullName || user?.email}, you are not linked to a company yet. Ask a company owner to invite you as HR.
      </p>
    </div>
  );
}
