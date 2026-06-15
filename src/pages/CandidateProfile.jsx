import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Loader2, Pencil } from "lucide-react";

import ProfileSidebar from "../components/candidate-profile/ProfileSidebar";
import ProfileViewMode from "../components/candidate-profile/ProfileViewMode";
import ProfileEditForm from "../components/candidate-profile/ProfileEditForm";

import { useProfile } from "../features/profile/hooks/useProfile";
import {
  profileToStage1,
  stage1Schema,
  stage1ToPayload,
  validateExperienceAndEducation,
} from "../features/profile/schemas/profileSchemas";

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

  const { profile, setProfile, loading, error, setError, saving, saveProfile, uploadCV } =
    useProfile({ pollParse: true, onProfileLoaded: hydrateFromProfile });

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
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  const basic = profile?.basicInfo ?? {};
  const completion = profile?.profileCompletion ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage your profile and increase your visibility to employers
            </p>
            {!profile?.onboardingCompleted && (
              <p className="text-sm text-amber-700 mt-2">
                <Link to="/candidate/profile-builder" className="underline font-medium">
                  Complete your onboarding
                </Link>{" "}
                to unlock better job matches.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => (editing ? handleCancel() : setEditing(true))}
            className={`cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 ${
              editing
                ? "border-2 border-slate-300 text-slate-700 hover:bg-slate-50"
                : "text-white bg-[#2563EB] hover:bg-[#1d4ed8] shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 active:scale-95"
            }`}
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
          {/* Left Sidebar */}
          <ProfileSidebar
            profile={profile}
            completion={completion}
            onAvatarChange={updateLocalProfile}
            onError={setError}
          />

          {/* Right Content */}
          <div className="space-y-4">
            {editing ? (
              <ProfileEditForm
                form={form}
                skills={skills}
                setSkills={setSkills}
                experience={experience}
                setExperience={setExperience}
                education={education}
                setEducation={setEducation}
                editorErrors={editorErrors}
                setEditorErrors={setEditorErrors}
                saving={saving}
                onCancel={handleCancel}
                onSave={handleSave}
              />
            ) : (
              <ProfileViewMode
                profile={profile}
                basic={basic}
                skills={skills}
                experience={experience}
                education={education}
                uploading={uploading}
                uploadProgress={uploadProgress}
                onCVUpload={handleCVUpload}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
