import { useEffect } from "react";
import CandidateProfileHeader from "../features/applications/components/details/CandidateProfileHeader";
import AIScreeningSummary from "../features/applications/components/details/AIScreeningSummary";
import WorkExperienceTimeline from "../features/applications/components/details/WorkExperienceTimeline";
import EducationSection from "../features/applications/components/details/EducationSection";
import InternalNotesSection from "../features/applications/components/details/InternalNotesSection";
import ResumeDownloadCard from "../features/applications/components/details/ResumeDownloadCard";
import { ArrowLeft } from "lucide-react";
import AIMatchScoreCircle from "../features/applications/components/details/AIMatchScoreCircle";
import ApplicationDetails from "../features/applications/components/details/ApplicationDetails";
import AIRecommendation from "../features/applications/components/details/AIRecommendation";
import CandidateDetailsSkeleton from "../features/applications/components/details/CandidateDetailsSkeleton";
import { useNavigate, useParams } from "react-router-dom";
import { useApplicationStore } from "../store/applicationStore";
import { useAuthStore } from "../store/authStore";

export default function CandidateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentApplication, fetchApplicationDetails, loading } = useApplicationStore();
  const user = useAuthStore((s) => s.user);
  const isHR = user?.role === "employer";

  useEffect(() => {
    if (id) {
      fetchApplicationDetails(id);
    }
  }, [id, fetchApplicationDetails]);

  if (loading || !currentApplication) {
    return <CandidateDetailsSkeleton />;
  }

  const candidate = {
    id: currentApplication._id,
    initials: currentApplication.candidateId?.fullName 
      ? currentApplication.candidateId.fullName.split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : "CN",
    name: currentApplication.candidateId?.fullName || "Candidate Name",
    role: currentApplication.candidateId?.profile?.basicInfo?.headline || "Applicant",
    email: currentApplication.candidateId?.email || "",
    phone: currentApplication.candidateId?.profile?.basicInfo?.phone || "",
    location: currentApplication.candidateId?.profile?.basicInfo?.location 
      ? `${currentApplication.candidateId.profile.basicInfo.location.city || ''}, ${currentApplication.candidateId.profile.basicInfo.location.country || ''}`.replace(/^,\s*|,\s*$/, '')
      : "",
    experienceYears: currentApplication.candidateId?.profile?.resume?.parsedData?.experienceYears 
      ? `${currentApplication.candidateId.profile.resume.parsedData.experienceYears} years experience`
      : "Experience not specified",
    skills: currentApplication.aiScreening?.matchedSkills || currentApplication.candidateId?.profile?.skills || [],
    overallScore: currentApplication.aiScreening?.overallScore || 0,
    screeningSummary: [
      { label: "Skills Match", percentage: currentApplication.aiScreening?.skillsMatchScore || 0, desc: currentApplication.aiScreening?.skillsAnalysis || "Skills matching analysis" },
      { label: "Experience", percentage: currentApplication.aiScreening?.experienceMatchScore || 0, desc: currentApplication.aiScreening?.experienceAnalysis || "Experience matching analysis" },
      { label: "Culture Fit", percentage: currentApplication.aiScreening?.cultureFitScore || 0, desc: currentApplication.aiScreening?.cultureFitAnalysis || "Culture fit matching analysis" },
      { label: "Education", percentage: currentApplication.aiScreening?.educationMatchScore || 0, desc: currentApplication.aiScreening?.educationAnalysis || "Education matching analysis" }
    ],
    strengths: currentApplication.aiScreening?.strengths || [],
    experience: (currentApplication.candidateId?.profile?.experience || []).map(exp => ({
      role: exp.title,
      company: exp.company,
      period: `${exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - ${exp.endDate ? new Date(exp.endDate).getFullYear() : (exp.current ? 'Present' : '')}`,
      desc: exp.description
    })),
    education: currentApplication.candidateId?.profile?.education?.[0] ? {
      degree: currentApplication.candidateId.profile.education[0].degree,
      university: currentApplication.candidateId.profile.education[0].school,
      meta: `${currentApplication.candidateId.profile.education[0].fieldOfStudy || ''} • ${currentApplication.candidateId.profile.education[0].startDate ? new Date(currentApplication.candidateId.profile.education[0].startDate).getFullYear() : ''} - ${currentApplication.candidateId.profile.education[0].endDate ? new Date(currentApplication.candidateId.profile.education[0].endDate).getFullYear() : ''}`
    } : { degree: "Not specified", university: "", meta: "" },
    meta: {
      appliedDate: new Date(currentApplication.createdAt).toLocaleDateString(),
      status: currentApplication.stage?.key || "applied",
      resumeName: currentApplication.resumeUrl ? currentApplication.resumeUrl.split('/').pop() : "resume.pdf",
      uploadedTime: "Uploaded at applying time"
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-screen text-slate-800 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-blue-950 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> {isHR ? "Back to Pipeline" : "Back to Applications"}
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <CandidateProfileHeader candidate={candidate} hideActions={!isHR} />
            {isHR && <AIScreeningSummary summary={candidate.screeningSummary} strengths={candidate.strengths} />}
            <WorkExperienceTimeline experience={candidate.experience} />
            <EducationSection education={candidate.education} />
            {isHR && <InternalNotesSection applicationId={candidate.id} />}
          </div>
          <div className="space-y-6">
            {isHR && <AIMatchScoreCircle score={candidate.overallScore} />}
            <ApplicationDetails meta={candidate.meta} />
            <ResumeDownloadCard resumeName={candidate.meta.resumeName} uploadedTime={candidate.meta.uploadedTime} />
            {isHR && <AIRecommendation />}
          </div>
        </div>
      </div>
    </div>
  );
}