import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building, Loader2, AlertCircle } from "lucide-react";
import { Input, Textarea } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { onboardOwnerCompany } from "../services/employerApi.js";
import { useAuthStore } from "../store/authStore";

const schema = z.object({
  name: z.string().min(2, "Company name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  industry: z.string().min(2, "Industry is required"),
  location: z.string().optional(),
});

export default function EmployerCompanyOnboarding() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      industry: "",
      location: "",
    },
  });

  const onSubmit = async (data) => {
    setError("");

    try {
      const result = await onboardOwnerCompany({
        name: data.name,
        description: data.description,
        industry: data.industry,
        location: data.location || undefined,
      });
      if (result.membership) {
        useAuthStore.setState({
          user: result.user,
          membership: result.membership,
        });
      }
      navigate("/employer/pending-approval", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to submit company.");
    }
  };

  return (
    <div className="py-10 px-4 max-w-lg mx-auto">
      <Card className="border border-slate-100 shadow-xl rounded-2xl bg-white">
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Company Onboarding</h2>
            <p className="text-sm text-slate-500 mt-1">
              Register your company to complete owner setup.
            </p>
          </div>

          {error && (
            <div className="flex gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg" role="alert">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Company name"
              icon={<Building className="w-4 h-4 text-slate-400" />}
              error={errors.name?.message}
              disabled={isSubmitting}
              {...register("name")}
            />
            <Textarea
              label="Description"
              rows={3}
              error={errors.description?.message}
              disabled={isSubmitting}
              {...register("description")}
            />
            <Input
              label="Industry"
              error={errors.industry?.message}
              disabled={isSubmitting}
              {...register("industry")}
            />
            <Input
              label="Location (optional)"
              disabled={isSubmitting}
              {...register("location")}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit company"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
