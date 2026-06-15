import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Building, Loader2, ArrowLeft, AlertCircle, ShieldAlert, Sparkles, Users } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { getPostAuthPath } from "../utils/authRedirect.js";
import { useSignOut } from "../hooks/useSignOut";
import AuthLayout from "../components/layouts/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

const candidateSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full Name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email Address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

const employerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full Name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: z
    .string()
    .min(1, "Email Address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

export default function Register() {
  const navigate = useNavigate();
  const registerAction = useAuthStore((state) => state.register);
  const { signOut, isLoading: isSigningOut } = useSignOut();

  const [step, setStep] = useState("role-selection"); // role-selection, form, pending-approval
  const [role, setRole] = useState("candidate"); // candidate, employer
  const [employerType, setEmployerType] = useState("owner"); // owner | hr
  const [authError, setAuthError] = useState("");

  const candidateForm = useForm({
    resolver: zodResolver(candidateSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const employerForm = useForm({
    resolver: zodResolver(employerSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setStep("form");
    setAuthError("");
  };

  const onSubmit = async (data) => {
    setAuthError("");
    try {
      const response = await registerAction(
        data.email,
        data.password,
        role,
        data.fullName,
        role === "employer" ? employerType : undefined,
      );

      if (response?.needsCompanyOnboarding) {
        navigate(
          getPostAuthPath(response.user, response.membership),
          { replace: true },
        );
      } else if (response?.pendingApproval) {
        setStep("pending-approval");
      } else if (role === "candidate") {
        navigate("/candidate/profile-builder", { replace: true });
      } else if (role === "employer") {
        navigate(
          getPostAuthPath(response.user, response.membership),
          { replace: true },
        );
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      setAuthError(err.message || "Registration failed. Please check your credentials and try again.");
    }
  };

  const handleBackToRoleSelection = () => {
    setStep("role-selection");
    setAuthError("");
  };

  const currentForm = role === "candidate" ? candidateForm : employerForm;
  const isSubmitting = currentForm.formState.isSubmitting;
  const errors = currentForm.formState.errors;

  return (
    <AuthLayout>
      {/* 1. ROLE SELECTION STEP */}
      {step === "role-selection" && (
        <Card className="w-full max-w-lg p-2 sm:p-4 rounded-2xl bg-transparent border-none shadow-none animate-fade-in">
          <CardContent className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
              <p className="text-sm text-slate-500 font-medium">
                Get started with your free account today.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 select-none"></div>

            {/* Role Options */}
            <div className="space-y-4">
              <span className="block text-sm font-semibold text-slate-700 tracking-wide select-none">
                I am a...
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Candidate Selector */}
                <button
                  type="button"
                  onClick={() => onRoleSelect("candidate")}
                  className="p-6 border-2 border-slate-100 hover:border-[#2563EB] hover:shadow-[0_8px_30px_-10px_rgba(37,99,235,0.15)] rounded-2xl bg-white transition-all duration-300 text-center flex flex-col items-center gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-[#2563EB] group-hover:border-blue-100 transition-all duration-300">
                    <User className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Job Seeker</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Find your dream job</p>
                  </div>
                </button>

                {/* Employer Selector */}
                <button
                  type="button"
                  onClick={() => onRoleSelect("employer")}
                  className="p-6 border-2 border-slate-100 hover:border-[#2563EB] hover:shadow-[0_8px_30px_-10px_rgba(37,99,235,0.15)] rounded-2xl bg-white transition-all duration-300 text-center flex flex-col items-center gap-3 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-[#2563EB] group-hover:border-blue-100 transition-all duration-300">
                    <Building className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">Employer</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">Hire top talent</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Switch to Login */}
            <p className="text-center text-sm text-slate-500 font-medium select-none pt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#3b82f6] hover:text-[#2563EB] font-bold hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      {/* 2. REGISTRATION FORM STEP */}
      {step === "form" && (
        <Card className="w-full max-w-lg p-2 sm:p-4 rounded-2xl bg-transparent border-none shadow-none animate-fade-in">
          <CardContent className="space-y-6">
            {/* Back Arrow & Header */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleBackToRoleSelection}
                disabled={isSubmitting}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-wider focus:outline-none disabled:opacity-50 select-none"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                <span>Back to Role</span>
              </button>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
                <p className="text-sm text-slate-500 font-medium">
                  {role === "candidate"
                    ? "Get started with your free seeker account today."
                    : "Register to manage and recruit elite candidates."}
                </p>
              </div>
            </div>

            {/* Form Error Banner */}
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
            <form onSubmit={currentForm.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Doe"
                  icon={<User className="w-4.5 h-4.5 text-slate-400 stroke-[2]" />}
                  error={errors.fullName?.message}
                  disabled={isSubmitting}
                  {...currentForm.register("fullName")}
                />

                {role === "employer" && (
                  <div className="space-y-2">
                    <span className="block text-sm font-semibold text-slate-700">
                      I am registering as
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setEmployerType("owner")}
                        className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                          employerType === "owner"
                            ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                            : "border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <Building className="w-4 h-4 mx-auto mb-1" />
                        Owner
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmployerType("hr")}
                        className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                          employerType === "hr"
                            ? "border-[#2563EB] bg-blue-50 text-[#2563EB]"
                            : "border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <Users className="w-4 h-4 mx-auto mb-1" />
                        HR
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">
                      {employerType === "owner"
                        ? "You will register your company next, then wait for admin approval."
                        : "You can sign in immediately and join a company when invited."}
                    </p>
                  </div>
                )}

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  icon={<Mail className="w-4.5 h-4.5 text-slate-400 stroke-[2]" />}
                  error={errors.email?.message}
                  disabled={isSubmitting}
                  {...currentForm.register("email")}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock className="w-4.5 h-4.5 text-slate-400 stroke-[2]" />}
                  error={errors.password?.message}
                  disabled={isSubmitting}
                  {...currentForm.register("password")}
                />
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                className="w-full py-3.5 rounded-xl shadow-lg shadow-blue-500/20 bg-[#2563EB] hover:bg-[#1d4ed8] text-white hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center font-bold tracking-wide transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {/* Switch to Sign In */}
            <p className="text-center text-sm text-slate-500 font-medium select-none">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#3b82f6] hover:text-[#2563EB] font-bold hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      {/* 3. EMPLOYER PENDING APPROVAL STEP */}
      {step === "pending-approval" && (
        <Card className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-transparent border-none shadow-none text-center animate-fade-in">
          <CardContent className="space-y-6 flex flex-col items-center">
            {/* Illustrative Heavy Icon */}
            <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-brand-blue rounded-full flex items-center justify-center shadow-sm select-none">
              <ShieldAlert className="w-8 h-8 stroke-[1.8]" />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Approval Pending</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
                Thank you for joining Naqla! Your employer account has been successfully created.
                To protect our candidates and secure the network, an administrator must approve your company before you can gain platform access.
              </p>
            </div>

            {/* Bullet Info Card */}
            <div className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-left space-y-2 select-none">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>What's Next?</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Our verification team checks all employer registrations within 24 hours. You will receive a notification email once approved.
              </p>
            </div>

            {/* Back Button */}
            <Button
              onClick={signOut}
              disabled={isSigningOut}
              className="w-full py-3.5 rounded-xl shadow-lg shadow-blue-500/20 bg-[#2563EB] hover:bg-[#1d4ed8] text-white hover:shadow-xl hover:-translate-y-0.5 font-bold tracking-wide transition-all duration-200"
            >
              {isSigningOut ? "Signing out…" : "Sign Out"}
            </Button>
          </CardContent>
        </Card>
      )}
    </AuthLayout>
  );
}
