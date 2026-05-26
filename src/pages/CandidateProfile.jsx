import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Briefcase,
  ExternalLink,
  GraduationCap,
  Loader2,
  MapPin,
  Pencil,
  Phone,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input, Textarea } from "../components/ui/Input";
import SkillsTagInput from "../features/profile/components/SkillsTagInput";
import ExperienceEducationEditor from "../features/profile/components/ExperienceEducationEditor";
import CVUploadSection from "../features/profile/components/CVUploadSection";
import { useProfile } from "../features/profile/hooks/useProfile";
import {
  profileToStage1,
  stage1Schema,
  stage1ToPayload,
} from "../features/profile/schemas/profileSchemas";

export default function CandidateProfile() {
  const [editing, setEditing] = useState(false);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
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

  const { profile, loading, error, saving, saveProfile, uploadCV } = useProfile({
    pollParse: true,
    onProfileLoaded: hydrateFromProfile,
  });

  const handleSave = form.handleSubmit(async (values) => {
    const exp = experience.filter((e) => e.company || e.title);
    const edu = education.filter((e) => e.institution || e.degree);
    await saveProfile({
      ...stage1ToPayload(values),
      skills,
      experience: exp.map((item) => ({
        ...item,
        startDate: item.startDate ? new Date(item.startDate) : undefined,
        endDate:
          item.currentlyWorking || !item.endDate
            ? undefined
            : new Date(item.endDate),
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
          if (evt.total) {
            setUploadProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center" role="status">
        <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
      </div>
    );
  }

  const basic = profile?.basicInfo ?? {};
  const location = basic.location ?? {};
  const social = basic.socialLinks ?? {};
  const completion = profile?.profileCompletion ?? 0;

  return (
    <div
      className="py-10 px-4 sm:px-8 lg:px-16 max-w-5xl mx-auto"
      style={{
        backgroundImage:
          "linear-gradient(139.64deg, rgb(239, 246, 255) 0%, rgb(255, 255, 255) 50%, rgb(240, 253, 250) 100%)",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue">My Profile</h1>
          <p className="text-slate-500 mt-1">
            Profile completion: <strong>{completion}%</strong>
          </p>
          {!profile?.onboardingCompleted && (
            <p className="text-sm text-amber-700 mt-2">
              <Link
                to="/candidate/profile-builder"
                className="underline font-medium"
              >
                Complete your onboarding
              </Link>{" "}
              to unlock better job matches.
            </p>
          )}
        </div>
        <Button
          variant={editing ? "outline" : "primary"}
          onClick={() => (editing ? setEditing(false) : setEditing(true))}
        >
          <Pencil className="w-4 h-4" />
          {editing ? "Cancel" : "Edit profile"}
        </Button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-6">
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-blue mb-4">Basic Information</h2>
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  {...form.register("firstName")}
                  error={form.formState.errors.firstName?.message}
                />
                <Input
                  label="Last Name"
                  {...form.register("lastName")}
                  error={form.formState.errors.lastName?.message}
                />
              </div>
              <Input
                label="Phone"
                {...form.register("phone")}
                error={form.formState.errors.phone?.message}
              />
              <Input
                label="Job Title"
                {...form.register("headline")}
                error={form.formState.errors.headline?.message}
              />
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="City" {...form.register("city")} />
                <Input label="Country" {...form.register("country")} />
              </div>
              <Textarea label="Bio" rows={4} {...form.register("bio")} />
              <div className="grid sm:grid-cols-3 gap-4">
                <Input label="LinkedIn" {...form.register("linkedin")} />
                <Input label="GitHub" {...form.register("github")} />
                <Input label="Portfolio" {...form.register("portfolio")} />
              </div>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save changes"}
              </Button>
            </form>
          ) : (
            <div className="space-y-3 text-sm text-slate-700">
              <p className="text-xl font-semibold text-slate-900">
                {profile?.fullName || "—"}
              </p>
              {basic.headline && (
                <p className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-brand-teal" />
                  {basic.headline}
                </p>
              )}
              {(location.city || location.country) && (
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-teal" />
                  {[location.city, location.country].filter(Boolean).join(", ")}
                </p>
              )}
              {basic.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-teal" />
                  {basic.phone}
                </p>
              )}
              {basic.bio && (
                <p className="leading-relaxed text-slate-600">{basic.bio}</p>
              )}
              <div className="flex flex-wrap gap-3 pt-2">
                {social.linkedin && (
                  <a
                    href={social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue text-sm flex items-center gap-1 hover:underline"
                  >
                    LinkedIn <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {social.github && (
                  <a
                    href={social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue text-sm flex items-center gap-1 hover:underline"
                  >
                    GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {social.portfolio && (
                  <a
                    href={social.portfolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-blue text-sm flex items-center gap-1 hover:underline"
                  >
                    Portfolio <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-blue mb-4">Skills</h2>
          {editing ? (
            <SkillsTagInput value={skills} onChange={setSkills} />
          ) : skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No skills listed.</p>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-blue mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" /> Experience & Education
          </h2>
          {editing ? (
            <ExperienceEducationEditor
              experience={experience}
              education={education}
              onExperienceChange={setExperience}
              onEducationChange={setEducation}
            />
          ) : (
            <div className="space-y-6 text-sm text-slate-700">
              {experience?.length > 0 ? (
                experience.map((exp, i) => (
                  <div key={i} className="border-l-2 border-brand-teal pl-4">
                    <p className="font-semibold text-slate-900">{exp.title}</p>
                    <p>{exp.company}</p>
                    {exp.description && (
                      <p className="text-slate-500 mt-1">{exp.description}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No experience listed.</p>
              )}
              {education?.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4" /> Education
                  </p>
                  {education.map((edu, i) => (
                    <p key={i}>
                      {edu.degree}
                      {edu.field ? ` in ${edu.field}` : ""} — {edu.institution}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-brand-blue mb-4">Resume</h2>
          <CVUploadSection
            profile={profile}
            onUpload={handleCVUpload}
            uploading={uploading}
            uploadProgress={uploadProgress}
          />
          {profile?.resume?.parsedData?.summary && (
            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
              <p className="text-sm font-medium text-slate-800 mb-1">Parsed summary</p>
              <p className="text-sm text-slate-600">
                {profile.resume.parsedData.summary}
              </p>
            </div>
          )}
        </section>

        {editing && (
          <div className="flex justify-end">
            <Button variant="primary" disabled={saving} onClick={handleSave}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save all changes"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
