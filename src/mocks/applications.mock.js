export const mockApplications = [
  {
    id: "1",
    company: "TechCorp",
    role: "Senior Frontend Developer",
    location: "San Francisco, CA",
    appliedDate: "2026-05-15",
    status: "Interview Scheduled",
    statusColor: "info",
    aiScore: 92,
    interviewDate: "2026-06-08",
    timeline: [
      { stage: "Applied", date: "2026-05-15", completed: true },
      { stage: "Reviewed", date: "2026-05-16", completed: true },
      { stage: "Interview", date: "2026-06-08", completed: false },
      { stage: "Offer", date: null, completed: false }
    ],
    logo: "🚀"
  },
  {
    id: "2",
    company: "StartupXYZ",
    role: "React Engineer",
    location: "Remote",
    appliedDate: "2026-05-12",
    status: "In Review",
    statusColor: "warning",
    aiScore: 88,
    timeline: [
      { stage: "Applied", date: "2026-05-12", completed: true },
      { stage: "Reviewed", date: null, completed: false },
      { stage: "Interview", date: null, completed: false },
      { stage: "Offer", date: null, completed: false }
    ],
    logo: "⚡"
  },
  {
    id: "3",
    company: "Innovation Labs",
    role: "Full Stack Developer",
    location: "New York, NY",
    appliedDate: "2026-05-10",
    status: "Applied",
    statusColor: "default",
    aiScore: 85,
    timeline: [
      { stage: "Applied", date: "2026-05-10", completed: true },
      { stage: "Reviewed", date: null, completed: false },
      { stage: "Interview", date: null, completed: false },
      { stage: "Offer", date: null, completed: false }
    ],
    logo: "💡"
  },
  {
    id: "4",
    company: "Meta",
    role: "Software Engineer",
    location: "Menlo Park, CA",
    appliedDate: "2026-05-08",
    status: "Rejected",
    statusColor: "error",
    aiScore: 78,
    rejectionReason: "Position filled",
    timeline: [
      { stage: "Applied", date: "2026-05-08", completed: true },
      { stage: "Reviewed", date: "2026-05-09", completed: true },
      { stage: "Rejected", date: "2026-05-11", completed: true }
    ],
    logo: "👥"
  },
  {
    id: "5",
    company: "Google",
    role: "Frontend Developer",
    location: "Mountain View, CA",
    appliedDate: "2026-05-05",
    status: "Offer Received",
    statusColor: "success",
    aiScore: 95,
    offerDetails: "Competitive package: $160k base + 15% bonus + RSU options.",
    timeline: [
      { stage: "Applied", date: "2026-05-05", completed: true },
      { stage: "Reviewed", date: "2026-05-06", completed: true },
      { stage: "Interview", date: "2026-05-10", completed: true },
      { stage: "Offer", date: "2026-05-14", completed: true }
    ],
    logo: "🔍"
  }
];
