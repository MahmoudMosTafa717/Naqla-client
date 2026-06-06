import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  Camera,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Loader2,
  MapPin,
  Mail,
  Pencil,
  Phone,
  Globe,
  Upload,
  AlertCircle,
  Code2,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import { AIScoreCircular } from "../components/ui/AIScoreBadge";
import SkillsTagInput from "../features/profile/components/SkillsTagInput";
import ExperienceEducationEditor from "../features/profile/components/ExperienceEducationEditor";
import { useProfile } from "../features/profile/hooks/useProfile";
import {
  profileToStage1,
  stage1Schema,
  stage1ToPayload,
  validateExperienceAndEducation,
} from "../features/profile/schemas/profileSchemas";
import { uploadCandidateAvatar } from "../services/profileApi";

/*  
   Avatar component – edit mode shows camera overlay
  */
function AvatarUpload({ profile, onAvatarChange, onError }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const initials = profile?.fullName
    ? profile.fullName
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "?";

  const handleFile = async (file) => {
    if (!file) return;
    onError?.("");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      onError?.("Only JPG, PNG, or WEBP images are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      onError?.("Image file must be smaller than 2MB.");
      return;
    }
    setUploading(true);
    try {
      const data = await uploadCandidateAvatar(file);
      if (data?.success) {
        onAvatarChange(data.profile);
      } else {
        onError?.(data?.message || "Failed to upload profile picture.");
      }
    } catch (err) {
      onError?.(err.message || "Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative group cursor-pointer"
        onClick={() => !uploading && inputRef.current?.click()}
        title="Click to upload new profile picture"
      >
        <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold text-white shadow-md relative border border-slate-100 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
          style={{ background: "linear-gradient(135deg, #1e3a8a, #14b8a6)" }}>
          {profile?.profilePicture?.url ? (
            <img
              src={profile.profilePicture.url}
              alt="Avatar"
              className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-90"
            />
          ) : (
            <span className="transition-all duration-300 group-hover:scale-105">{initials}</span>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full backdrop-blur-[1px]">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
            </div>
          )}
        </div>
        <button
          type="button"
          disabled={uploading}
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-teal-600 border-2 border-white flex items-center justify-center text-white shadow-md hover:bg-teal-700 hover:scale-110 active:scale-95 transition-all duration-200"
          title="Upload Profile Picture"
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          <Camera className="w-4 h-4" />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>
      <div className="text-center">
        <p className="font-semibold text-slate-900 text-lg">{profile?.fullName || "—"}</p>
        <p className="text-slate-500 text-sm">{profile?.basicInfo?.headline || ""}</p>
      </div>
    </div>
  );
}

/*  
   Resume Section – shows current file or upload zone
  */
function ResumeSection({ profile, onUpload, uploading, uploadProgress }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState("");

  const hasResume = !!(profile?.resume?.url || profile?.resume?.fileName);
  const parseStatus = profile?.resume?.parseStatus ?? "none";
  const fileName = profile?.resume?.fileName;

  const validateAndUpload = async (file) => {
    setLocalError("");
    if (!file) return;
    if (file.type !== "application/pdf") {
      setLocalError("Only PDF files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLocalError("File must be smaller than 5MB.");
      return;
    }
    await onUpload(file);
  };

  // When resume already uploaded: show file info card + replace option
  if (hasResume) {
    return (
      <div className="space-y-4">
        {/* Current resume card */}
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">{fileName || "resume.pdf"}</p>
            <p className="text-xs text-slate-400 capitalize">{parseStatus === "done" ? "Parsed ✓" : parseStatus}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {profile?.resume?.url && (
              <button
                type="button"
                onClick={() => window.open(profile.resume.url, "_blank", "noopener")}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                View
              </button>
            )}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium border border-slate-200 rounded-lg px-2 py-1 hover:bg-slate-50"
              disabled={uploading}
            >
              Replace
            </button>
          </div>
        </div>

        {/* Hidden input for replace */}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={(e) => validateAndUpload(e.target.files?.[0])}
        />

        {uploading && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Loader2 className="w-3 h-3 animate-spin" /> Uploading… {uploadProgress}%
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        {parseStatus === "pending" || parseStatus === "processing" ? (
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <Loader2 className="w-4 h-4 animate-spin" /> Parsing with AI…
          </div>
        ) : parseStatus === "failed" ? (
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-xs text-red-700">
            <AlertCircle className="w-4 h-4" /> {profile?.resume?.parseError || "Parsing failed."}
          </div>
        ) : null}

        {localError && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {localError}
          </p>
        )}
      </div>
    );
  }

  // No resume yet — show upload zone
  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); validateAndUpload(e.dataTransfer.files?.[0]); }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === "Enter") inputRef.current?.click(); }}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${dragOver ? "border-teal-400 bg-teal-50" : "border-slate-200 hover:border-teal-300 bg-slate-50"
          }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={(e) => validateAndUpload(e.target.files?.[0])}
        />
        <Upload className="w-10 h-10 mx-auto text-slate-400 mb-3" />
        <p className="text-sm font-semibold text-slate-700">Upload your resume</p>
        <p className="text-xs text-slate-400 mt-1">PDF, DOC, or DOCX up to 10MB</p>
        <button
          type="button"
          className="mt-4 px-5 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        >
          Choose File
        </button>
      </div>
      {localError && (
        <p className="text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {localError}
        </p>
      )}
      {uploading && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-3 h-3 animate-spin" /> Uploading… {uploadProgress}%
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-teal-500 transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

/*  
   Main CandidateProfile Page
  */
export default function CandidateProfile() {
  const [editing, setEditing] = useState(false);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [editorErrors, setEditorErrors] = useState({ experience: [], education: [] });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(stage1Schema),
    defaultValues: profileToStage1(null),
  });

  const hydratedRef = useRef(null);
  const hydrateFromProfile = useCallback(
    (p) => {
      if (!p || hydratedRef.current === p._id) return;
      hydratedRef.current = p._id;
      form.reset(profileToStage1(p));
      setSkills(p.skills ?? []);
      setExperience(p.experience ?? []);
      setEducation(p.education ?? []);
    },
    [form],
  );

  const { profile, setProfile, loading, error, setError, saving, saveProfile, uploadCV } = useProfile({
    pollParse: true,
    onProfileLoaded: hydrateFromProfile,
  });

  // Provide a setProfile fallback when not returned by the hook
  const updateLocalProfile = (updated) => {
    if (typeof setProfile === "function") setProfile(updated);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditorErrors({ experience: [], education: [] });
    setError("");
    if (profile) {
      form.reset(profileToStage1(profile));
      setSkills(profile.skills ?? []);
      setExperience(profile.experience ?? []);
      setEducation(profile.education ?? []);
    }
  };

  const handleSave = form.handleSubmit(async (values) => {
    const validation = validateExperienceAndEducation(experience, education);
    if (!validation.isValid) {
      setEditorErrors(validation);
      return;
    }
    setEditorErrors({ experience: [], education: [] });

    const exp = experience.filter((e) => e.company || e.title);
    const edu = education.filter((e) => e.institution || e.degree);
    await saveProfile({
      ...stage1ToPayload(values),
      skills,
      experience: exp.map((item) => ({
        ...item,
        startDate: item.startDate ? new Date(item.startDate) : undefined,
        endDate: item.currentlyWorking || !item.endDate ? undefined : new Date(item.endDate),
      })),
      education: edu.map((item) => ({
        institution: item.institution,
        degree: item.degree,
        field: item.field || undefined,
        startYear: item.startYear ? Number(item.startYear) : undefined,
        endYear: item.endYear ? Number(item.endYear) : undefined,
      })),
    });
    setEditing(false);
  });

  const handleCVUpload = async (file) => {
    setUploading(true);
    setUploadProgress(0);
    try {
      await uploadCV(file, {
        onUploadProgress: (evt) => {
          if (evt.total) setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
        },
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
      </div>
    );
  }

  const basic = profile?.basicInfo ?? {};
  const location = basic.location ?? {};
  const social = basic.socialLinks ?? {};
  const completion = profile?.profileCompletion ?? 0;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(139deg, #eff6ff 0%, #fff 50%, #f0fdf4 100%)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-500 mt-1 text-sm">Manage your profile and increase your visibility to employers</p>
            {!profile?.onboardingCompleted && (
              <p className="text-sm text-amber-700 mt-2">
                <Link to="/candidate/profile-builder" className="underline font-medium">Complete your onboarding</Link>{" "}
                to unlock better job matches.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => editing ? handleCancel() : setEditing(true)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 ${editing
              ? "border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
              : "text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
              }`}
            style={editing ? {} : { background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)" }}
          >
            <Pencil className="w-4 h-4" />
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          {/* ── LEFT SIDEBAR ─────────────────────────────────── */}
          <div className="space-y-4">
            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
              <AvatarUpload
                profile={profile}
                onAvatarChange={updateLocalProfile}
                onError={setError}
              />
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {(location.city || location.country) && (
                  <p className="flex items-center justify-center gap-1.5">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    {[location.city, location.country].filter(Boolean).join(", ")}
                  </p>
                )}
                {profile?.email && (
                  <p className="flex items-center justify-center gap-1.5">
                    <Mail className="w-4 h-4 text-teal-500" />
                    <span className="truncate">{profile.email}</span>
                  </p>
                )}
                {basic.phone && (
                  <p className="flex items-center justify-center gap-1.5">
                    <Phone className="w-4 h-4 text-teal-500" />
                    {basic.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Strength */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 mb-4">Profile Strength</h2>
              <div className="flex flex-col items-center gap-3">
                <AIScoreCircular score={completion} size={120} strokeWidth={8} />
                <p className="text-xs text-slate-500 text-center">
                  Your profile is {completion}% complete. Add more details to improve visibility.
                </p>
              </div>
            </div>

            {/* Links */}
            {(social.linkedin || social.github || social.portfolio) && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="font-semibold text-slate-800 mb-4">Links</h2>
                <div className="space-y-3">
                  {social.linkedin && (
                    <a href={social.linkedin} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 hover:underline truncate">
                      <ExternalLink className="w-4 h-4 shrink-0" />
                      <span className="truncate">{social.linkedin.replace(/^https?:\/\//, "")}</span>
                    </a>
                  )}
                  {social.github && (
                    <a href={social.github} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-slate-700 hover:underline truncate">
                      <Code2 className="w-4 h-4 shrink-0" />
                      <span className="truncate">{social.github.replace(/^https?:\/\//, "")}</span>
                    </a>
                  )}
                  {social.portfolio && (
                    <a href={social.portfolio} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-slate-700 hover:underline truncate">
                      <Globe className="w-4 h-4 shrink-0" />
                      <span className="truncate">{social.portfolio.replace(/^https?:\/\//, "")}</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT CONTENT ────────────────────────────────── */}
          <div className="space-y-4">
            {editing ? (
              /* ── EDIT MODE ── */
              <form onSubmit={handleSave}>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
                  <h2 className="font-semibold text-slate-800 text-lg">Edit Profile</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="First Name" {...form.register("firstName")} error={form.formState.errors.firstName?.message} />
                    <Input label="Last Name" {...form.register("lastName")} error={form.formState.errors.lastName?.message} />
                  </div>
                  <Input label="Job Title" {...form.register("headline")} error={form.formState.errors.headline?.message} />
                  <Input label="Phone" {...form.register("phone")} error={form.formState.errors.phone?.message} />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input label="City" {...form.register("city")} />
                    <Input label="Country" {...form.register("country")} />
                  </div>
                  <Textarea label="About" rows={4} {...form.register("bio")} />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input label="LinkedIn URL" {...form.register("linkedin")} error={form.formState.errors.linkedin?.message} />
                    <Input label="GitHub URL" {...form.register("github")} error={form.formState.errors.github?.message} />
                    <Input label="Portfolio URL" {...form.register("portfolio")} error={form.formState.errors.portfolio?.message} />
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium text-slate-700 mb-2">Skills</p>
                    <SkillsTagInput value={skills} onChange={setSkills} />
                  </div>

                  <div className="pt-2">
                    <p className="text-sm font-medium text-slate-700 mb-2">Experience & Education</p>
                    <ExperienceEducationEditor
                      experience={experience}
                      education={education}
                      onExperienceChange={setExperience}
                      onEducationChange={setEducation}
                      errors={editorErrors}
                      setErrors={setEditorErrors}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button type="button" onClick={handleCancel}
                      className="px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
                      Cancel
                    </button>
                    <button type="submit" disabled={saving}
                      className="px-6 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-60 inline-flex items-center gap-2"
                      style={{ background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)" }}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* ── VIEW MODE ── */
              <>
                {/* About */}
                {basic.bio && (
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h2 className="font-semibold text-slate-800 text-lg mb-3">About</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">{basic.bio}</p>
                  </div>
                )}

                {/* Skills */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-800 text-lg mb-3">Skills</h2>
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span key={skill}
                          className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No skills listed.</p>
                  )}
                </div>

                {/* Work Experience */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-800 text-lg mb-4">Work Experience</h2>
                  {experience?.length > 0 ? (
                    <div className="space-y-5">
                      {experience.map((exp, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <Briefcase className="w-5 h-5 text-slate-500" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 text-sm">{exp.title}</p>
                            <p className="text-sm text-slate-600">{exp.company}</p>
                            {(exp.startDate || exp.endDate) && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                {exp.startDate ? new Date(exp.startDate).getFullYear() : ""}
                                {" – "}
                                {exp.currentlyWorking ? "Present" : exp.endDate ? new Date(exp.endDate).getFullYear() : ""}
                                {location.city || location.country ? ` • ${[location.city, location.country].filter(Boolean).join(", ")}` : ""}
                              </p>
                            )}
                            {exp.description && (
                              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{exp.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No experience listed.</p>
                  )}
                </div>

                {/* Education */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-800 text-lg mb-4">Education</h2>
                  {education?.length > 0 ? (
                    <div className="space-y-4">
                      {education.map((edu, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5 text-violet-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">
                              {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                            </p>
                            <p className="text-sm text-slate-600">{edu.institution}</p>
                            {(edu.startYear || edu.endYear) && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                Graduated {edu.endYear || edu.startYear}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">No education listed.</p>
                  )}
                </div>

                {/* Resume */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="font-semibold text-slate-800 text-lg mb-4">Resume</h2>
                  <ResumeSection
                    profile={profile}
                    onUpload={handleCVUpload}
                    uploading={uploading}
                    uploadProgress={uploadProgress}
                  />
                  {profile?.resume?.parsedData?.summary && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl">
                      <p className="text-xs font-medium text-slate-600 mb-1">AI Parsed Summary</p>
                      <p className="text-sm text-slate-700">{profile.resume.parsedData.summary}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
