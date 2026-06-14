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
import { AIInterviewCoach } from "../components/interview-recommendations/AIInterviewCoach.jsx";
import InterviewDetailsCard from "../features/applications/components/details/InterviewDetailsCard";
import { useCandidateDetails } from "../hooks/useCandidateDetails";

export default function CandidateDetails() {
  const {
    id,
    navigate,
    currentApplication,
    loading,
    isHR,
    recommendation,
    candidate,
    latestInterview,
    error,
    handleRetry,
  } = useCandidateDetails();

  if (!id) {
    return (
      <div className="p-12 text-center text-(--color-secondary-muted) bg-(--color-bg-page) min-h-screen flex items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-2xl border border-(--color-border) shadow-micro max-w-md">
          <h2 className="text-xl font-extrabold text-(--color-secondary-main) mb-2 tracking-tight">No Candidate Selected</h2>
          <p className="text-sm text-(--color-secondary-muted) leading-relaxed">
            Please select a candidate from your dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center text-(--color-secondary-muted) bg-(--color-bg-page) min-h-screen flex items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-micro max-w-md">
          <h2 className="text-xl font-extrabold text-red-600 mb-2 tracking-tight">Error Loading Details</h2>
          <p className="text-sm text-(--color-secondary-muted) leading-relaxed mb-6">
            {error}
          </p>
          <button
            onClick={handleRetry}
            className="w-full bg-[var(--color-primary-main)] text-white font-bold rounded-[24px] py-2.5 text-sm hover:opacity-90 transition-opacity cursor-pointer shadow-md"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (loading || !currentApplication || !candidate) {
    return <CandidateDetailsSkeleton />;
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-(--color-secondary-main) font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-[var(--color-primary-main)] hover:text-blue-700 mb-6 transition-all duration-200 ease-in-out cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />{" "}
          {isHR ? "Back to Pipeline" : "Back to Applications"}
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <CandidateProfileHeader candidate={candidate} hideActions={!isHR} />
            {isHR && (
              <AIScreeningSummary
                summary={candidate.screeningSummary}
                strengths={candidate.strengths}
              />
            )}
            <WorkExperienceTimeline experience={candidate.experience} />
            <EducationSection education={candidate.education} />
            {isHR && <InternalNotesSection applicationId={candidate.id} />}

            {recommendation && (
              <div className="pt-6 border-t border-slate-100">
                <AIInterviewCoach recommendation={recommendation} />
              </div>
            )}
          </div>
          <div className="space-y-6">
            {isHR && <AIMatchScoreCircle score={candidate.overallScore} />}
            <ApplicationDetails meta={candidate.meta} />

            <InterviewDetailsCard latestInterview={latestInterview} />

            <ResumeDownloadCard
              resumeName={candidate.meta.resumeName}
              uploadedTime={candidate.meta.uploadedTime}
              resumeUrl={currentApplication?.resumeUrl}
            />
            {isHR && <AIRecommendation />}
          </div>
        </div>
      </div>
    </div>
  );
}
