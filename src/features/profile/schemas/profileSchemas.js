import { z } from "zod";

export const PROFILE_STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Skills" },
  { id: 3, label: "Experience" },
  { id: 4, label: "Upload Resume" },
];

export const stage1Schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
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
    .refine((v) => !v || /^https?:\/\/.+/i.test(v), "Enter a valid URL"),
  github: z
    .string()
    .optional()
    .refine((v) => !v || /^https?:\/\/.+/i.test(v), "Enter a valid URL"),
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
