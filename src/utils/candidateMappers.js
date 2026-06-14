export const mapApplicationToCandidateCard = (app) => {
  if (!app) return null;

  const candidate = app.candidateId || {};
  const profile = candidate.profile || {};
  const basicInfo = profile.basicInfo || {};
  const aiScreening = app.aiScreening || {};
  const internalRating = app.internalRating || {};

  // Safely compute initials
  let initials = "AN";
  if (typeof candidate.fullName === 'string' && candidate.fullName.trim()) {
    initials = candidate.fullName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  } else if (typeof candidate.name === 'string' && candidate.name.trim()) {
    initials = candidate.name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Safely compute location
  let locationStr = "";
  if (basicInfo.location && typeof basicInfo.location === 'object') {
    const city = basicInfo.location.city || "";
    const country = basicInfo.location.country || "";
    locationStr = `${city}${city && country ? ', ' : ''}${country}`.trim();
  }

  return {
    id: app._id || Math.random().toString(36).substr(2, 9),
    name: candidate.fullName || candidate.name || "Unnamed Candidate",
    initials,
    role: basicInfo.headline || "Software Engineer",
    email: candidate.email || "",
    phone: basicInfo.phone || "",
    appliedAt: app.createdAt || new Date().toISOString(),
    hiredAt: app.stage?.key === 'hired' ? (app.stage.changedAt || app.updatedAt || new Date().toISOString()) : null,
    score: typeof aiScreening.overallScore === 'number' ? aiScreening.overallScore : 0,
    skills: Array.isArray(aiScreening.matchedSkills) 
      ? aiScreening.matchedSkills 
      : (Array.isArray(profile.skills) ? profile.skills : []),
    location: locationStr,
    experience: typeof profile.resume?.parsedData?.experienceYears === 'number'
      ? profile.resume.parsedData.experienceYears
      : (Array.isArray(profile.experience) ? profile.experience.length : 0),
    redFlags: Array.isArray(aiScreening.redFlags) && aiScreening.redFlags.length > 0
      ? aiScreening.redFlags.map(r => r?.message || '').filter(Boolean).join(', ')
      : null,
    isStarred: typeof internalRating.average === 'number' && internalRating.average >= 4,
  };
};

export const calculateAverageMatchScore = (allCandidates) => {
  if (!allCandidates || allCandidates.length === 0) return 0;
  const totalScore = allCandidates.reduce((acc, c) => acc + (c.score || 0), 0);
  return Math.round(totalScore / allCandidates.length);
};

export const calculateAverageTimeToHire = (hiredCandidates) => {
  if (!hiredCandidates || hiredCandidates.length === 0) return "14d";
  
  const totalDays = hiredCandidates.reduce((sum, c) => {
    if (!c || !c.appliedAt) return sum + 14;
    const start = new Date(c.appliedAt);
    const end = c.hiredAt ? new Date(c.hiredAt) : new Date();
    // Prevent invalid math if dates are corrupted
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return sum + 14;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return sum + diffDays;
  }, 0);

  return `${Math.round(totalDays / hiredCandidates.length)}d`;
};

export const mapApplicationToCandidateDetails = (app) => {
  if (!app) return null;

  const candidate = app.candidateId || {};
  const profile = candidate.profile || {};
  const basicInfo = profile.basicInfo || {};
  const aiScreening = app.aiScreening || {};

  // Safely compute initials
  let initials = "CN";
  if (typeof candidate.fullName === 'string' && candidate.fullName.trim()) {
    initials = candidate.fullName
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  } else if (typeof candidate.name === 'string' && candidate.name.trim()) {
    initials = candidate.name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // Safely compute location
  let locationStr = "";
  if (basicInfo.location && typeof basicInfo.location === 'object') {
    const city = basicInfo.location.city || "";
    const country = basicInfo.location.country || "";
    locationStr = `${city}${city && country ? ', ' : ''}${country}`.trim();
  }

  // Format experience years text
  const experienceYearsText = profile.resume?.parsedData?.experienceYears
    ? `${profile.resume.parsedData.experienceYears} years experience`
    : "Experience not specified";

  // Map experience timeline defensively
  const mappedExperience = (profile.experience || []).map((exp) => {
    let period = "";
    if (exp.startDate) {
      const startYear = new Date(exp.startDate).getFullYear();
      const endYear = exp.endDate ? new Date(exp.endDate).getFullYear() : (exp.current ? "Present" : "");
      period = `${isNaN(startYear) ? "" : startYear} - ${isNaN(Number(endYear)) ? endYear : (endYear || "")}`;
    } else {
      period = exp.current ? "Present" : "Dates not specified";
    }
    return {
      role: exp.title || "Software Engineer",
      company: exp.company || "Company",
      period,
      desc: exp.description || "",
    };
  });

  // Map education defensively
  const primaryEducation = profile.education?.[0]
    ? {
        degree: profile.education[0].degree || "Not specified",
        university: profile.education[0].school || "",
        meta: `${profile.education[0].fieldOfStudy || ""} • ${
          profile.education[0].startDate && !isNaN(new Date(profile.education[0].startDate).getFullYear())
            ? new Date(profile.education[0].startDate).getFullYear()
            : ""
        } - ${
          profile.education[0].endDate && !isNaN(new Date(profile.education[0].endDate).getFullYear())
            ? new Date(profile.education[0].endDate).getFullYear()
            : ""
        }`,
      }
    : { degree: "Not specified", university: "", meta: "" };

  return {
    id: app._id,
    initials,
    name: candidate.fullName || candidate.name || "Candidate Name",
    role: basicInfo.headline || "Applicant",
    email: candidate.email || "",
    phone: basicInfo.phone || "",
    location: locationStr,
    experienceYears: experienceYearsText,
    skills: aiScreening.matchedSkills || profile.skills || [],
    overallScore: aiScreening.overallScore || 0,
    screeningSummary: [
      {
        label: "Skills Match",
        percentage: aiScreening.skillsMatchScore || 0,
        desc: aiScreening.skillsAnalysis || "Skills matching analysis",
      },
      {
        label: "Experience",
        percentage: aiScreening.experienceMatchScore || 0,
        desc: aiScreening.experienceAnalysis || "Experience matching analysis",
      },
      {
        label: "Culture Fit",
        percentage: aiScreening.cultureFitScore || 0,
        desc: aiScreening.cultureFitAnalysis || "Culture fit matching analysis",
      },
      {
        label: "Education",
        percentage: aiScreening.educationMatchScore || 0,
        desc: aiScreening.educationAnalysis || "Education matching analysis",
      },
    ],
    strengths: aiScreening.strengths || [],
    experience: mappedExperience,
    education: primaryEducation,
    meta: {
      appliedDate: app.createdAt ? new Date(app.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
      status: app.stage?.key || "applied",
      resumeName: app.resumeUrl ? app.resumeUrl.split("/").pop() : "resume.pdf",
      uploadedTime: "Uploaded at applying time",
    },
  };
};
