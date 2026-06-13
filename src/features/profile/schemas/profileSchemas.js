import { z } from "zod";

export const PROFILE_STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Skills" },
  { id: 3, label: "Experience" },
  { id: 4, label: "Resume" },
];

export const stage1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{6,14}$/, "Phone number must be a valid international format (e.g. +201234567890)"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  headline: z.string().min(1, "Job title is required"),
  bio: z
    .string()
    .min(1, "Bio is required")
    .max(1500, "Bio must be 1500 characters or less"),
  linkedin: z
    .string()
    .optional()
    .refine((v) => !v || /^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(v), "Enter a valid LinkedIn URL"),
  github: z
    .string()
    .optional()
    .refine((v) => !v || /^https?:\/\/(www\.)?github\.com\/.+/i.test(v), "Enter a valid GitHub URL"),
  portfolio: z
    .string()
    .optional()
    .refine((v) => !v || /^https?:\/\/.+/i.test(v), "Enter a valid URL"),
});

export const stage2Schema = z.object({
  skills: z
    .array(z.string().min(1))
    .min(1, "Add at least one skill"),
});

const experienceEntrySchema = z.object({
  company: z.string().min(1, "Company is required"),
  title: z.string().min(1, "Title is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  currentlyWorking: z.boolean().optional(),
  description: z.string().optional(),
});

const educationEntrySchema = z.object({
  institution: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  field: z.string().optional(),
  startYear: z.coerce.number().optional(),
  endYear: z.coerce.number().optional(),
});

export const stage3Schema = z.object({
  experience: z.array(experienceEntrySchema).default([]),
  education: z.array(educationEntrySchema).default([]),
});

export function validateExperienceAndEducation(experience, education) {
  const errors = {
    experience: [],
    education: [],
    isValid: true,
  };

  experience.forEach((exp, idx) => {
    const isAllEmpty = !exp.company?.trim() && !exp.title?.trim() && !exp.startDate && !exp.endDate && !exp.description?.trim();
    if (isAllEmpty) return;

    const itemErrors = {};
    if (!exp.company?.trim()) itemErrors.company = "Company name is required";
    if (!exp.title?.trim()) itemErrors.title = "Job title is required";
    if (!exp.startDate) {
      itemErrors.startDate = "Start date is required";
    }

    if (!exp.currentlyWorking && exp.startDate && exp.endDate) {
      if (new Date(exp.endDate) < new Date(exp.startDate)) {
        itemErrors.endDate = "End date must be after start date";
      }
    }

    if (exp.description && exp.description.length > 2000) {
      itemErrors.description = "Description must be 2000 characters or less";
    }

    if (Object.keys(itemErrors).length > 0) {
      errors.experience[idx] = itemErrors;
      errors.isValid = false;
    }
  });

  education.forEach((edu, idx) => {
    const isAllEmpty = !edu.institution?.trim() && !edu.degree?.trim() && !edu.field?.trim() && !edu.startYear && !edu.endYear;
    if (isAllEmpty) return;

    const itemErrors = {};
    if (!edu.institution?.trim()) itemErrors.institution = "Institution is required";
    if (!edu.degree?.trim()) itemErrors.degree = "Degree is required";
    if (!edu.field?.trim()) itemErrors.field = "Field of study is required";

    const currentYear = new Date().getFullYear();
    if (!edu.startYear) {
      itemErrors.startYear = "Start year is required";
    } else {
      const sy = Number(edu.startYear);
      if (isNaN(sy) || sy < 1950 || sy > currentYear + 10) {
        itemErrors.startYear = `Start year must be between 1950 and ${currentYear + 10}`;
      }
    }

    if (edu.endYear) {
      const ey = Number(edu.endYear);
      if (isNaN(ey) || ey < 1950 || ey > currentYear + 10) {
        itemErrors.endYear = `End year must be between 1950 and ${currentYear + 10}`;
      } else if (edu.startYear && ey < Number(edu.startYear)) {
        itemErrors.endYear = "End year must be after or equal to start year";
      }
    }

    if (Object.keys(itemErrors).length > 0) {
      errors.education[idx] = itemErrors;
      errors.isValid = false;
    }
  });

  return errors;
}

export function splitFullName(fullName = "") {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

export function joinFullName(firstName, lastName) {
  return [firstName?.trim(), lastName?.trim()].filter(Boolean).join(" ");
}

export function profileToStage1(profile) {
  const { firstName, lastName } = splitFullName(profile?.fullName ?? "");
  const basic = profile?.basicInfo ?? {};
  const location = basic.location ?? {};
  const social = basic.socialLinks ?? {};

  return {
    firstName,
    lastName,
    phone: basic.phone ?? "",
    city: location.city ?? "",
    country: location.country ?? "",
    headline: basic.headline ?? "",
    bio: basic.bio ?? "",
    linkedin: social.linkedin ?? "",
    github: social.github ?? "",
    portfolio: social.portfolio ?? "",
  };
}

export function stage1ToPayload(values) {
  return {
    fullName: joinFullName(values.firstName, values.lastName),
    basicInfo: {
      phone: values.phone,
      headline: values.headline,
      bio: values.bio,
      location: {
        city: values.city,
        country: values.country,
      },
      socialLinks: {
        linkedin: values.linkedin || undefined,
        github: values.github || undefined,
        portfolio: values.portfolio || undefined,
      },
    },
  };
}
