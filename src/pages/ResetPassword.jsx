import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Loader2, ArrowLeft, AlertCircle, CheckCircle, ShieldAlert } from "lucide-react";
import { resetPassword } from "../services/authApi";
import AuthLayout from "../components/layouts/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [authError, setAuthError] = useState("");
  const [isDone, setIsDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data) => {
    setAuthError("");
    if (!token) {
      setAuthError("Reset token is missing or invalid. Please request a new link.");
      return;
    }

    try {
      await resetPassword(token, data.password);
      setIsDone(true);
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 2500);
    } catch (err) {
      setAuthError(err.response?.data?.message || err.message || "Failed to reset password. The link may have expired.");
    }
  };

  return (
    <AuthLayout>
      {/* 1. STATE: INVALID/MISSING TOKEN OR COMPROMISED LINK */}
      {!token ? (
        <Card className="w-full max-w-lg border border-slate-100 shadow-xl shadow-slate-100/40 p-6 sm:p-8 rounded-2xl bg-white text-center">
          <CardContent className="space-y-6 flex flex-col items-center">
            {/* Illustrative Warning Icon */}
            <div className="w-16 h-16 bg-red-50 border border-red-100 text-red-600 rounded-full flex items-center justify-center shadow-xs select-none">
              <ShieldAlert className="w-8 h-8 stroke-[1.8]" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Invalid reset link</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                This password reset link is missing a validation token or has expired. Please request a new password reset email.
              </p>
            </div>

            {/* Action buttons */}
            <div className="w-full space-y-3 pt-2">
              <Button
                onClick={() => navigate("/forgot-password")}
                className="w-full py-3.5 rounded-xl font-bold tracking-wide"
              >
                Request New Link
              </Button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 text-sm font-bold text-slate-400 hover:text-slate-700 transition-colors mx-auto select-none"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : isDone ? (
        /* 2. STATE: RESET SUCCESS STATE */
        <Card className="w-full max-w-lg border border-slate-100 shadow-xl shadow-slate-100/40 p-6 sm:p-8 rounded-2xl bg-white text-center">
          <CardContent className="space-y-6 flex flex-col items-center">
            {/* Illustrative Check Icon */}
            <div className="w-16 h-16 bg-teal-50 border border-teal-100 text-brand-teal rounded-full flex items-center justify-center shadow-xs select-none animate-bounce">
              <CheckCircle className="w-8 h-8 stroke-[1.8]" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Password Reset Complete</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-sm mx-auto">
                Your password has been successfully updated. You will be redirected to the sign-in page in a moment...
              </p>
            </div>

            {/* Mini Inline Loader */}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider animate-pulse select-none">
              <Loader2 className="w-4 h-4 animate-spin text-brand-blue" />
              <span>Redirecting...</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* 3. STATE: STANDARD RESET INPUT FORM */
        <Card className="w-full max-w-lg border border-slate-100 shadow-xl shadow-slate-100/40 p-2 sm:p-4 rounded-2xl bg-white">
          <CardContent className="space-y-6">
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Reset Password</h2>
              <p className="text-sm text-slate-500 font-medium">
                {email ? (
                  <>
                    Set a new password for{" "}
                    <span className="font-semibold text-slate-800">{email}</span>
                  </>
                ) : (
                  "Please enter your new password below."
                )}
              </p>
            </div>

            {/* Error Banner */}
            {authError && (
              <div
                className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm animate-fadeIn"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4.5 h-4.5 text-slate-400 stroke-[2]" />}
                  error={errors.password?.message}
                  disabled={isSubmitting}
                  {...register("password")}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4.5 h-4.5 text-slate-400 stroke-[2]" />}
                  error={errors.confirmPassword?.message}
                  disabled={isSubmitting}
                  {...register("confirmPassword")}
                />
              </div>

              <Button
                type="submit"
                className="w-full py-3.5 rounded-xl shadow-lg shadow-brand-blue/10 flex items-center justify-center font-bold tracking-wide"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </AuthLayout>
  );
}
