import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

const mockCandidate = {
  id:1,
  initials: "SJ",
  name: "Sarah Johnson",
  role: "Senior Frontend Developer",
  email: "sarah.johnson@email.com",
  phone: "+1 (234) 567-8900",
  location: "San Francisco, CA",
  experienceYears: "6 years experience",
  skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Redux", "Jest", "Git"],
  overallScore: 95,
  screeningSummary: [
    { label: "Skills Match", percentage: 96, desc: "Excellent proficiency in React, TypeScript, and modern frontend technologies" },
    { label: "Experience", percentage: 94, desc: "6 years of relevant experience aligns perfectly with job requirements" },
    { label: "Culture Fit", percentage: 93, desc: "Strong alignment with company values based on profile analysis" },
    { label: "Education", percentage: 95, desc: "CS degree from top-tier university with strong academic record" }
  ],
  strengths: ["Strong React and TypeScript expertise", "Excellent problem-solving skills", "Great communication abilities", "Leadership experience"],
  experience: [
    { role: "Senior Frontend Developer", company: "Tech Innovations Inc.", period: "2021 - Present", desc: "Led development of customer-facing web applications using React and TypeScript. Improved performance by 40%." },
    { role: "Frontend Developer", company: "StartupXYZ", period: "2019 - 2021", desc: "Built responsive web applications and collaborated with design team to implement pixel-perfect UIs." }
  ],
  resumeData: {},
  education: { degree: "BS in Computer Science", university: "Stanford University", meta: "Graduated 2018 • GPA: 3.8" },
  meta: { appliedDate: "May 15, 2024", status: "Applied", resumeName: "Sarah_Johnson_Resume.pdf", uploadedTime: "Uploaded 2 days ago" }
};

export default function CandidateDetails() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <CandidateDetailsSkeleton />;
  }

  return (
    <div className="bg-slate-50/50 min-h-screen text-slate-800 font-sans py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <button className="flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-blue-950 mb-6 transition-colors">
          <ArrowLeft onClick={() => navigate(`/pipeline/${jobId}`)}  className="w-4 h-4" /> Back to Pipeline
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <CandidateProfileHeader candidate={mockCandidate} />
            <AIScreeningSummary summary={mockCandidate.screeningSummary} strengths={mockCandidate.strengths} />
            <WorkExperienceTimeline experience={mockCandidate.experience} />
            <EducationSection education={mockCandidate.education} />
            <InternalNotesSection />
          </div>
          <div className="space-y-6">
            <AIMatchScoreCircle score={mockCandidate.overallScore} />
            <ApplicationDetails meta={mockCandidate.meta} />
            <ResumeDownloadCard resumeName={mockCandidate.meta.resumeName} uploadedTime={mockCandidate.meta.uploadedTime} />
            <AIRecommendation />
          </div>
        </div>
      </div>
    </div>
  );
}