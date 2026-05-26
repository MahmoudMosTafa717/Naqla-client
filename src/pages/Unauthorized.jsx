import { useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-linear-to-tr from-brand-blue/[0.02] to-brand-teal/[0.04] flex items-center justify-center p-6 font-sans">
      <Card className="w-full max-w-lg border border-slate-100 shadow-xl shadow-slate-100/40 p-6 sm:p-8 rounded-2xl bg-white text-center">
        <CardContent className="space-y-6 flex flex-col items-center">
          {/* Large Shield Alert Icon */}
          <div className="w-16 h-16 bg-red-50 border border-red-100 text-red-600 rounded-full flex items-center justify-center shadow-xs select-none">
            <ShieldAlert className="w-8 h-8 stroke-[1.8]" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Access Denied</h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
              You do not have the required permissions to view this page. This resource is restricted to authorized roles only.
            </p>
          </div>

          {/* Spacer / Divider */}
          <div className="border-t border-slate-100 w-full select-none"></div>

          {/* Action buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1 py-3 border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 font-bold"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
              <span>Go Back</span>
            </Button>

            <Button
              onClick={() => navigate("/")}
              className="flex-1 py-3 flex items-center justify-center gap-2 font-bold"
            >
              <Home className="w-4 h-4 stroke-[2.2]" />
              <span>Return Home</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
