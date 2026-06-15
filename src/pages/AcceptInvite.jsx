import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building,
  Loader2,
  AlertCircle,
  CheckCircle2,
  User,
  Lock,
  Eye,
  EyeOff,
  Briefcase,
} from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { validateHRInvite, acceptHRInvite } from "../services/authApi.js";
import { useAuthStore } from "../store/authStore";

const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const { user: currentUser, isAuthenticated } = useAuthStore();

  const tokenMissing = !token;
  const [loading, setLoading] = useState(!tokenMissing);
  const [error, setError] = useState(
    tokenMissing
      ? "Invitation token is missing. Please check the link in your email."
      : "",
  );
  const [inviteData, setInviteData] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      password: "",
      confirmPassword: "",
    },
  });

  // 1. Validate token on mount
  useEffect(() => {
    if (!token) {
      return;
    }

    async function checkToken() {
      try {
        const response = await validateHRInvite(token);
        if (response.success) {
          setInviteData(response);
        } else {
          setError(response.message || "Failed to validate invitation token.");
        }
      } catch (err) {
        setError(err.message || "Failed to validate invitation token.");
      } finally {
        setLoading(false);
      }
    }
    checkToken();
  }, [token]);

  const handleAcceptInvite = async (formData = {}) => {
    setAccepting(true);
    setError("");

    try {
      const payload = {
        token,
        fullName:
          formData.fullName ||
          currentUser?.fullName ||
          inviteData?.email?.split("@")[0] ||
          "HR Recruiter",
        password: formData.password || undefined,
      };

      const response = await acceptHRInvite(payload);

      if (response.success) {
        // Persist session tokens to authStore
        useAuthStore.setState({
          user: response.user,
          accessToken: response.accessToken,
          isAuthenticated: true,
        });
        localStorage.setItem("accessToken", response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }

        setSuccess(true);
        setTimeout(() => {
          navigate("/employer/dashboard", { replace: true });
        }, 2000);
      } else {
        throw new Error(response.message || "Failed to accept invitation.");
      }
    } catch (err) {
      setError(err.message || "Failed to accept invitation.");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-blue-50 border border-blue-100 text-brand-blue rounded-full flex items-center justify-center animate-bounce mb-6">
            <Briefcase className="w-8 h-8 text-brand-blue" />
          </div>
          <Loader2 className="w-10 h-10 animate-spin text-brand-blue mb-4" />
          <h2 className="text-xl font-bold text-slate-800">
            Verifying Invitation
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Please wait while we secure your workspace link...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Card className="border border-slate-100 shadow-xl max-w-md w-full rounded-2xl bg-white text-center p-6">
          <CardContent className="space-y-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 border border-red-100 text-red-500 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Invitation Error
              </h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                {error}
              </p>
            </div>
            <Link to="/login" className="w-full">
              <Button variant="primary" className="w-full">
                Go to Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <Card className="border border-slate-100 shadow-xl max-w-md w-full rounded-2xl bg-white text-center p-6">
          <CardContent className="space-y-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-green-50 border border-green-100 text-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Welcome Aboard!
              </h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                You have successfully joined **{inviteData?.companyName}** as an
                HR recruiter. Redirecting to workspace...
              </p>
            </div>
            <Loader2 className="w-6 h-6 animate-spin text-brand-blue" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <Card className="border border-slate-100 shadow-xl max-w-md w-full rounded-2xl bg-white overflow-hidden">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center mx-auto text-brand-blue">
              <Building className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Join Workspace
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              You are invited to join{" "}
              <span className="font-semibold text-slate-800">
                {inviteData?.companyName}
              </span>{" "}
              as an HR Recruiter.
            </p>
          </div>

          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm space-y-1">
                <p className="text-slate-500">Currently logged in as:</p>
                <p className="font-semibold text-slate-800">
                  {currentUser?.fullName} ({currentUser?.email})
                </p>
              </div>

              {currentUser?.email?.toLowerCase() !==
                inviteData?.email?.toLowerCase() && (
                <div
                  className="flex gap-2 p-3 bg-amber-50 text-amber-800 text-xs rounded-lg"
                  role="alert">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Warning: Your logged-in email does not match the invited
                    email ({inviteData?.email}).
                  </span>
                </div>
              )}

              <Button
                onClick={() => handleAcceptInvite()}
                disabled={accepting}
                className="w-full py-2.5"
                variant="primary">
                {accepting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    Joining Workspace...
                  </>
                ) : (
                  "Accept Invitation & Join"
                )}
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(handleAcceptInvite)}
              className="space-y-4">
              <Input
                label="Email Address"
                value={inviteData?.email}
                disabled
                icon={<User className="w-4 h-4 text-slate-400" />}
              />

              <Input
                label="Full Name"
                placeholder="e.g. John Doe"
                error={errors.fullName?.message}
                disabled={accepting}
                icon={<User className="w-4 h-4 text-slate-400" />}
                {...register("fullName")}
              />

              <div className="relative">
                <Input
                  label="Create Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  disabled={accepting}
                  icon={<Lock className="w-4 h-4 text-slate-400" />}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <Input
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                error={errors.confirmPassword?.message}
                disabled={accepting}
                icon={<Lock className="w-4 h-4 text-slate-400" />}
                {...register("confirmPassword")}
              />

              <Button
                type="submit"
                disabled={accepting}
                className="w-full py-2.5 mt-2"
                variant="primary">
                {accepting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    Creating Account...
                  </>
                ) : (
                  "Register & Accept Invitation"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
