import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { getPostAuthPath } from "../utils/authRedirect.js";
import AuthLayout from "../components/layouts/AuthLayout";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email Address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data) => {
    setAuthError("");
    try {
      const result = await login(data.email, data.password);
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      navigate(getPostAuthPath(result.user, result.membership), { replace: true });
    } catch (err) {
      setAuthError(err.message || "Failed to sign in. Please check your credentials.");
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-lg p-2 sm:p-4 rounded-2xl bg-transparent border-none shadow-none">
        <CardContent className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In</h2>
            <p className="text-sm text-slate-500 font-medium">
              Welcome back! Please sign in to continue.
            </p>
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                icon={<Mail className="w-4.5 h-4.5 text-slate-400 stroke-[2]" />}
                error={errors.email?.message}
                disabled={isSubmitting}
                {...register("email")}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                icon={<Lock className="w-4.5 h-4.5 text-slate-400 stroke-[2]" />}
                error={errors.password?.message}
                disabled={isSubmitting}
                {...register("password")}
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm select-none">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium group">
                <input
                  type="checkbox"
                  className="w-4.5 h-4.5 rounded-sm border-slate-300 text-[#2563EB] focus:ring-[#2563EB]/20 transition-all cursor-pointer"
                  disabled={isSubmitting}
                  {...register("rememberMe")}
                />
                <span className="group-hover:text-slate-900 transition-colors">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-[#3b82f6] hover:text-[#2563EB] font-semibold hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3.5 rounded-xl shadow-lg shadow-blue-500/20 bg-[#2563EB] hover:bg-[#1d4ed8] text-white hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center font-bold tracking-wide transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Switch to Sign Up */}
          <p className="text-center text-sm text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#3b82f6] hover:text-[#2563EB] font-bold hover:underline transition-colors"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
