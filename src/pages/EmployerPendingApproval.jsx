import { Link } from "react-router-dom";
import { ShieldAlert, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { useSignOut } from "../hooks/useSignOut";

export default function EmployerPendingApproval() {
  const { signOut, isLoading } = useSignOut();

  return (
    <div className="py-10 px-4 max-w-lg mx-auto">
      <Card className="border border-slate-100 shadow-xl p-6 sm:p-8 rounded-2xl bg-white text-center">
        <CardContent className="space-y-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-brand-blue rounded-full flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Approval Pending
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md">
              Thank you for joining Masar! Your employer account and company
              have been submitted. An administrator must approve your company
              before you can access the platform.
            </p>
          </div>
          <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-left space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
              <span>What&apos;s next?</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our team reviews employer registrations within 24 hours. You will
              receive an email once approved.
            </p>
          </div>
          <Button onClick={signOut} disabled={isLoading} className="w-full">
            {isLoading ? "Signing out…" : "Sign Out"}
          </Button>
          <p className="text-sm text-slate-500">
            <Link
              to="/home"
              className="text-brand-blue font-semibold hover:underline"
            >
              Back to home page
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
