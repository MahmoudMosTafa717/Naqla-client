import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import ProfileStepper from "../features/profile/components/ProfileStepper";
import SkillsTagInput from "../features/profile/components/SkillsTagInput";
import ExperienceEducationEditor from "../features/profile/components/ExperienceEducationEditor";
import CVUploadSection from "../features/profile/components/CVUploadSection";
import ParsedCVReview from "../features/profile/components/ParsedCVReview";
import { useProfile } from "../features/profile/hooks/useProfile";
import {
  PROFILE_STEPS,
  profileToStage1,
  stage1Schema,
  stage1ToPayload,
  stage2Schema,
  validateExperienceAndEducation,
} from "../features/profile/schemas/profileSchemas";

function normalizeExperience(list) {
  return list.map((item) => ({
    company: item.company,
    title: item.title,
    description: item.description || undefined,
    currentlyWorking: Boolean(item.currentlyWorking),
    startDate: item.startDate ? new Date(item.startDate) : undefined,
    endDate:
      item.currentlyWorking || !item.endDate
        ? undefined
        : new Date(item.endDate),
  }));
}

function normalizeEducation(list) {
  return list.map((item) => ({
    institution: item.institution,
    degree: item.degree,
    field: item.field || undefined,
    startYear: item.startYear ? Number(item.startYear) : undefined,
    endYear: item.endYear ? Number(item.endYear) : undefined,
  }));
}

export default function ProfileBuilder() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [skillsError, setSkillsError] = useState("");
  const [editorErrors, setEditorErrors] = useState({ experience: [], education: [] });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [resumeSubStep, setResumeSubStep] = useState("upload");

  const stage1Form = useForm({
    resolver: zodResolver(stage1Schema),
    defaultValues: profileToStage1(null),
  });

  const hydratedRef = useRef(null);
  const lastParseStatusRef = useRef(null);

  const hydrateFromProfile = useCallback(
    (p) => {
      if (!p) return;

      if (hydratedRef.current !== p._id) {
        hydratedRef.current = p._id;
        stage1Form.reset(profileToStage1(p));
        setExperience(p.experience ?? []);
        setEducation(p.education ?? []);
        setSkills(p.skills ?? []);
      }

      const parseStatus = p.resume?.parseStatus;
      if (
        parseStatus === "done" &&
        lastParseStatusRef.current !== "done"
      ) {
        const parsedSkills = p.resume?.parsedData?.skills ?? [];
        setSkills((prev) => [...new Set([...prev, ...parsedSkills])]);
        setResumeSubStep("review");
      }
      lastParseStatusRef.current = parseStatus;
    },
    [stage1Form],
  );

  const { profile, loading, error, saving, saveProfile, uploadCV } = useProfile({
    pollParse: step === 4,
    onProfileLoaded: hydrateFromProfile,
  });

  const stepMeta = PROFILE_STEPS.find((s) => s.id === step);
  const parseStatus = profile?.resume?.parseStatus;

  const handleStage1 = stage1Form.handleSubmit(async (values) => {
    await saveProfile(stage1ToPayload(values));
    setStep(2);
  });
  const handleStage2 = async () => {
    const parsed = stage2Schema.safeParse({ skills });
    if (!parsed.success) {
      const msg = parsed.error.issues?.[0]?.message || parsed.error.errors?.[0]?.message || "Add at least one skill";
      setSkillsError(msg);
      return;
    }
    setSkillsError("");
    await saveProfile({ skills });
    setStep(3);
  };  const handleStage3 = async () => {
    const validation = validateExperienceAndEducation(experience, education);
    if (!validation.isValid) {
      setEditorErrors(validation);
      return;
    }
    setEditorErrors({ experience: [], education: [] });

    const exp = experience.filter((e) => e.company || e.title);
    const edu = education.filter((e) => e.institution || e.degree);
    await saveProfile({
      experience: normalizeExperience(exp),
      education: normalizeEducation(edu),
    });
    setStep(4);
  };

  const handleCVUpload = async (file) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      await uploadCV(file, {
        onUploadProgress: (evt) => {
          if (evt.total) {
            setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      });
      setResumeSubStep("upload");
    } finally {
      setUploading(false);
    }
  };

  const handleFinish = async () => {
    const validation = validateExperienceAndEducation(experience, education);
    if (!validation.isValid) {
      setEditorErrors(validation);
      setStep(3);
      return;
    }
    setEditorErrors({ experience: [], education: [] });

    const exp = experience.filter((e) => e.company || e.title);
    const edu = education.filter((e) => e.institution || e.degree);
    await saveProfile({
      skills,
      experience: normalizeExperience(exp),
      education: normalizeEducation(edu),
      onboardingCompleted: true,
    });
    navigate("/candidate/dashboard", { replace: true });
  };

  if (loading) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
        <span className="sr-only">Loading profile…</span>
      </div>
    );
  }

  return (
    <div
      className="py-12 px-4 sm:px-8 lg:px-32"
      style={{
        backgroundImage:
          "linear-gradient(139.64deg, rgb(239, 246, 255) 0%, rgb(255, 255, 255) 50%, rgb(240, 253, 250) 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-sm font-medium">
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            Welcome to Masar
          </div>
          <h1 className="text-3xl font-bold text-brand-blue tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-slate-500 text-base">
            Let&apos;s set up your profile to find the perfect job matches
          </p>
        </div>

        <ProfileStepper currentStep={step} />

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-brand-blue">{stepMeta?.label}</h2>
            <p className="text-slate-500 text-sm mt-1">
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Add your core skills and expertise"}
              {step === 3 && "Share your work history and education"}
              {step === 4 && "Upload your resume and review parsed data"}
            </p>
          </div>

          <div className="px-6 py-8">
            {error && (
              <p className="mb-4 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            {step === 1 && (
              <form onSubmit={handleStage1} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    {...stage1Form.register("firstName")}
                    error={stage1Form.formState.errors.firstName?.message}
                  />
                  <Input
                    label="Last Name"
                    {...stage1Form.register("lastName")}
                    error={stage1Form.formState.errors.lastName?.message}
                  />
                </div>
                <Input
                  label="Phone"
                  type="tel"
                  {...stage1Form.register("phone")}
                  error={stage1Form.formState.errors.phone?.message}
                />
                <Input
                  label="Job Title"
                  placeholder="e.g., Senior Frontend Developer"
                  {...stage1Form.register("headline")}
                  error={stage1Form.formState.errors.headline?.message}
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="City"
                    {...stage1Form.register("city")}
                    error={stage1Form.formState.errors.city?.message}
                  />
                  <Input
                    label="Country"
                    {...stage1Form.register("country")}
                    error={stage1Form.formState.errors.country?.message}
                  />
                </div>
                <Textarea
                  label="Bio"
                  rows={4}
                  placeholder="Tell us about yourself and your career goals..."
                  {...stage1Form.register("bio")}
                  error={stage1Form.formState.errors.bio?.message}
                />
                <div className="grid sm:grid-cols-3 gap-4 pt-2">
                  <Input
                    label="LinkedIn (optional)"
                    {...stage1Form.register("linkedin")}
                    error={stage1Form.formState.errors.linkedin?.message}
                  />
                  <Input
                    label="GitHub (optional)"
                    {...stage1Form.register("github")}
                    error={stage1Form.formState.errors.github?.message}
                  />
                  <Input
                    label="Portfolio (optional)"
                    {...stage1Form.register("portfolio")}
                    error={stage1Form.formState.errors.portfolio?.message}
                  />
                </div>
              </form>
            )}

            {step === 2 && (
              <SkillsTagInput
                value={skills}
                onChange={setSkills}
                error={skillsError}
              />
            )}

            {step === 3 && (
              <ExperienceEducationEditor
                experience={experience}
                education={education}
                onExperienceChange={setExperience}
                onEducationChange={setEducation}
                errors={editorErrors}
                setErrors={setEditorErrors}
              />
            )}

            {step === 4 && (
              <>
                {resumeSubStep === "upload" && (
                  <CVUploadSection
                    profile={profile}
                    onUpload={handleCVUpload}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                  />
                )}
                {(resumeSubStep === "review" ||
                  parseStatus === "done" ||
                  parseStatus === "failed") && (
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <ParsedCVReview
                      profile={profile}
                      skills={skills}
                      experience={experience}
                      education={education}
                      onSkillsChange={setSkills}
                      onExperienceChange={setExperience}
                      onEducationChange={setEducation}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="px-6 py-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            {step > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                disabled={saving}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </Button>
            )}
            <div className="flex-1" />
            {(step === 2 || step === 3) && (
              <Button
                type="button"
                variant="ghost"
                className="text-slate-500 hover:text-slate-800"
                disabled={saving}
                onClick={() => {
                  if (step === 2) {
                    setSkillsError("");
                    setStep(3);
                  } else if (step === 3) {
                    setEditorErrors({ experience: [], education: [] });
                    setStep(4);
                  }
                }}
              >
                Skip for now
              </Button>
            )}
            {step < 4 && (
              <Button
                type="button"
                variant="primary"
                className="w-full sm:w-auto"
                disabled={saving}
                onClick={() => {
                  if (step === 1) stage1Form.handleSubmit(handleStage1)();
                  else if (step === 2) handleStage2();
                  else if (step === 3) handleStage3();
                }}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Continue <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            )}
            {step === 4 && (
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {parseStatus === "done" || parseStatus === "failed" ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setResumeSubStep("review")}
                  >
                    Review parsed data
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="primary"
                  disabled={saving}
                  onClick={handleFinish}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Finish profile"
                  )}
                </Button>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-slate-500 pb-6">
            Step {step} of {PROFILE_STEPS.length}
          </p>
        </div>
      </div>
    </div>
  );
}
