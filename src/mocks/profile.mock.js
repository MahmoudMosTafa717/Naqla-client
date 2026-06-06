export const mockProfile = {
  fullName: "Alex Thompson",
  basicInfo: {
    headline: "Senior Frontend Developer",
    bio: "Passionate frontend developer with 6+ years of experience building scalable web applications. Specialized in React, TypeScript, and modern web technologies.",
    phone: "+1 (555) 123-4567",
    location: {
      city: "San Francisco",
      country: "CA",
    },
    socialLinks: {
      linkedin: "linkedin.com/in/alexthompson",
      github: "github.com/alexthompson",
      portfolio: "alexthompson.dev",
    },
  },
  skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS", "Redux"],
  experience: [
    {
      title: "Senior Frontend Developer",
      company: "Tech Innovations Inc.",
      location: "San Francisco, CA",
      startDate: "2021",
      endDate: "Present",
      currentlyWorking: true,
      description: "Leading development of customer-facing web applications using React and TypeScript. Improved performance by 40% through optimization.",
    },
    {
      title: "Frontend Developer",
      company: "StartupXYZ",
      location: "Remote",
      startDate: "2019",
      endDate: "2021",
      currentlyWorking: false,
      description: "Built responsive web applications and collaborated with design team to implement pixel-perfect UIs.",
    },
  ],
  education: [
    {
      institution: "Stanford University",
      degree: "BS in Computer Science",
      field: "Computer Science",
      startYear: 2014,
      endYear: 2018,
    },
  ],
  profileCompletion: 85,
  onboardingCompleted: true,
};
export default mockProfile;
