import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEmployerStore } from "../store/employerStore";
import { createJob, updateJob, getJobById } from "../services/jobsApi";
import { Input, Textarea } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Plus,
  Trash2,
  Loader2,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Skeleton } from "../components/ui/Skeleton";

const schema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(200),
    description: z.string().min(20, "Description must be at least 20 characters").max(5000),
    location: z.string().min(2, "Location is required").max(200),
    jobType: z.enum(["remote", "onsite", "hybrid"], {
      errorMap: () => ({ message: "Please select a job type" }),
    }),
    employmentType: z.enum(
      ["full-time", "part-time", "contract", "internship", "freelance"],
      { errorMap: () => ({ message: "Please select an employment type" }) }
    ),
    experienceLevel: z.enum(
      ["entry", "mid", "senior", "lead", "executive"],
      { errorMap: () => ({ message: "Please select an experience level" }) }
    ),
    minSalary: z.coerce.number().min(0, "Minimum salary must be >= 0"),
    maxSalary: z.coerce.number().min(0, "Maximum salary must be >= 0"),
    currency: z.string().min(2, "Currency is required").max(3),
    applicationDeadline: z.string().optional().refine(
      (val) => {
        if (!val) return true;
        return new Date(val) > new Date();
      },
      { message: "Application deadline must be in the future" }
    ),
  })
  .refine((data) => data.maxSalary >= data.minSalary, {
    message: "Maximum salary must be >= minimum salary",
    path: ["maxSalary"],
  });

export default function JobFormPage({ mode = "create" }) {
  const { jobId } = useParams(); // will be undefined in create mode, and contain the job ID in edit mode
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { activeCompanyId } = useEmployerStore();

  // can use useFieldArray for better handling of dynamic lists, but keeping it simple with useState for now
  const [requirements, setRequirements] = useState([""]);
  const [skills, setSkills] = useState([""]);
  const [generalError, setGeneralError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      jobType: "remote",
      employmentType: "full-time",
      experienceLevel: "mid",
      minSalary: 0,
      maxSalary: 0,
      currency: "USD",
      applicationDeadline: "",
    },
  });

  // Fetch job details if editing
  const { data: editJobData, isLoading: isJobLoading } = useQuery({
    queryKey: ["jobDetail", jobId],
    queryFn: () => getJobById(jobId),
    enabled: mode === "edit" && Boolean(jobId),
  });

  // Populate form if editing
  useEffect(() => {
    if (mode === "edit" && editJobData?.data) {
      const job = editJobData.data;
      reset({
        title: job.title,
        description: job.description,
        location: job.location,
        jobType: job.jobType,
        employmentType: job.employmentType,
        experienceLevel: job.experienceLevel || "mid",
        minSalary: job.salaryRange?.min || 0,
        maxSalary: job.salaryRange?.max || 0,
        currency: job.salaryRange?.currency || "USD",
        applicationDeadline: job.applicationDeadline
          ? new Date(job.applicationDeadline).toISOString().split("T")[0]
          : "",
      });
      if (job.requirements && job.requirements.length > 0) {
        setRequirements(job.requirements);
      }
      if (job.skills && job.skills.length > 0) {
        setSkills(job.skills);
      }
    }
  }, [mode, editJobData, reset]);

  // Mutations
  const createJobMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries(["companyJobs", activeCompanyId]);
      navigate(`/employer/company/${activeCompanyId}/jobs`);
    },
    onError: (err) => {
      setGeneralError(err.message || "Failed to create job posting.");
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: (payload) => updateJob(jobId, payload),
    onSuccess: (data) => {
      const updatedJob = data.data;
      queryClient.invalidateQueries(["companyJobs", updatedJob.company._id || updatedJob.company]);
      queryClient.invalidateQueries(["jobDetail", jobId]);
      navigate(`/employer/company/${updatedJob.company._id || updatedJob.company}/jobs`);
    },
    onError: (err) => {
      setGeneralError(err.message || "Failed to update job posting.");
    },
  });

  // Requirements array handlers
  const handleAddRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const handleRemoveRequirement = (index) => {
    const next = [...requirements];
    next.splice(index, 1);
    setRequirements(next.length === 0 ? [""] : next);
  };

  const handleRequirementChange = (index, value) => {
    const next = [...requirements];
    next[index] = value;
    setRequirements(next);
  };

  // Skills array handlers
  const handleAddSkill = () => {
    setSkills([...skills, ""]);
  };

  const handleRemoveSkill = (index) => {
    const next = [...skills];
    next.splice(index, 1);
    setSkills(next.length === 0 ? [""] : next);
  };

  const handleSkillChange = (index, value) => {
    const next = [...skills];
    next[index] = value;
    setSkills(next);
  };

  const onSubmit = (data) => {
    setGeneralError("");

    // Validate lists
    const cleanRequirements = requirements.map((r) => r.trim()).filter(Boolean);
    if (cleanRequirements.length === 0) {
      setGeneralError("Please add at least one requirement.");
      return;
    }

    const cleanSkills = skills.map((s) => s.trim()).filter(Boolean);

    const payload = {
      title: data.title,
      description: data.description,
      location: data.location,
      jobType: data.jobType,
      employmentType: data.employmentType,
      experienceLevel: data.experienceLevel,
      company: activeCompanyId,
      salaryRange: {
        min: Number(data.minSalary) >= 0 ? Number(data.minSalary) : 0,
        max: Number(data.maxSalary) >= 0 ? Number(data.maxSalary) : 0,
        currency: data.currency || "USD",
      },
      requirements: cleanRequirements,
      skills: cleanSkills,
      applicationDeadline: data.applicationDeadline || undefined,
    };

    if (mode === "edit") {
      updateJobMutation.mutate(payload);
    } else {
      if (!activeCompanyId) {
        setGeneralError("Active company workspace not found. Please switch company and try again.");
        return;
      }
      createJobMutation.mutate(payload);
    }
  };

  const isSubmitting = createJobMutation.isPending || updateJobMutation.isPending;

  if (mode === "edit" && isJobLoading) {
    return (
      <div className="p-8 max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          {mode === "create" ? "Post a New Job" : "Edit Job Posting"}
          <Sparkles className="w-6 h-6 text-brand-teal" />
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {mode === "create"
            ? "Publish a new job role in your workspace to source applications."
            : "Modify details of your published job posting."}
        </p>
      </div>

      {generalError && (
        <div className="flex gap-2 p-4 bg-red-50 text-red-700 text-sm rounded-lg" role="alert">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Form Card */}
      <Card className="border border-slate-100 shadow-xl rounded-2xl bg-white">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Title & Description */}
            <div className="space-y-4">
              <Input
                label="Job Title"
                placeholder="e.g. Senior Full Stack Engineer"
                disabled={isSubmitting}
                error={errors.title?.message}
                icon={<Briefcase className="w-4 h-4 text-slate-400" />}
                {...register("title")}
              />

              <Textarea
                label="Job Description"
                placeholder="Describe the responsibilities, project scope, and daily tasks..."
                rows={5}
                disabled={isSubmitting}
                error={errors.description?.message}
                {...register("description")}
              />
            </div>

            {/* Role Properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Job Type</label>
                <select
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-accent"
                  {...register("jobType")}
                >
                  <option value="remote">Remote</option>
                  <option value="onsite">Onsite</option>
                  <option value="hybrid">Hybrid</option>
                </select>
                {errors.jobType && <p className="mt-1 text-xs text-red-500">{errors.jobType.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Employment Type</label>
                <select
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-accent"
                  {...register("employmentType")}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="freelance">Freelance</option>
                </select>
                {errors.employmentType && <p className="mt-1 text-xs text-red-500">{errors.employmentType.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Level</label>
                <select
                  disabled={isSubmitting}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-accent"
                  {...register("experienceLevel")}
                >
                  <option value="entry">Entry</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
                {errors.experienceLevel && <p className="mt-1 text-xs text-red-500">{errors.experienceLevel.message}</p>}
              </div>

              <Input
                label="Location"
                placeholder="e.g. Cairo, Egypt or Cairo (Hybrid)"
                disabled={isSubmitting}
                error={errors.location?.message}
                icon={<MapPin className="w-4 h-4 text-slate-400" />}
                {...register("location")}
              />
            </div>

            {/* Salary Range */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm">Salary & Package</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Minimum Salary"
                  type="number"
                  disabled={isSubmitting}
                  error={errors.minSalary?.message}
                  icon={<DollarSign className="w-4 h-4 text-slate-400" />}
                  {...register("minSalary")}
                />
                <Input
                  label="Maximum Salary"
                  type="number"
                  disabled={isSubmitting}
                  error={errors.maxSalary?.message}
                  icon={<DollarSign className="w-4 h-4 text-slate-400" />}
                  {...register("maxSalary")}
                />
                <Input
                  label="Currency (e.g. USD, EGP)"
                  placeholder="USD"
                  disabled={isSubmitting}
                  error={errors.currency?.message}
                  {...register("currency")}
                />
              </div>
            </div>

            {/* Application Deadline */}
            <div className="border-t border-slate-100 pt-5">
              <Input
                label="Application Deadline (optional)"
                type="date"
                disabled={isSubmitting}
                error={errors.applicationDeadline?.message}
                {...register("applicationDeadline")}
              />
            </div>

            {/* Requirements (Dynamic List) */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-slate-800">Job Requirements</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddRequirement}
                  disabled={isSubmitting}
                  className="px-3 py-1 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Requirement
                </Button>
              </div>

              <div className="space-y-3">
                {requirements.map((req, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder={`Requirement #${index + 1}`}
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                    {requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(index)}
                        disabled={isSubmitting}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills (Dynamic List) */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-bold text-slate-800">Key Skills / Tags</label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSkill}
                  disabled={isSubmitting}
                  className="px-3 py-1 text-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </Button>
              </div>

              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder={`Skill / Tech #${index + 1}`}
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      disabled={isSubmitting}
                      className="flex-1"
                    />
                    {skills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(index)}
                        disabled={isSubmitting}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submission buttons */}
            <div className="border-t border-slate-100 pt-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="min-w-[8rem]">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    Saving...
                  </>
                ) : mode === "create" ? (
                  "Post Job"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}
