import apiClient from "../config/axios.js";
import { mockRecommendations } from "../mocks/recommendations.mock.js";

export async function getJobsByCompany(companyId, params) {
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== '' && v != null)
  );
  const { data } = await apiClient.get(`/jobs/company/${companyId}`, { params: filteredParams });
  return data;
}

export async function getJobById(jobId) {
  const { data } = await apiClient.get(`/jobs/${jobId}`);
  return data;
}

export async function createJob(payload) {
  const { data } = await apiClient.post("/jobs", payload);
  return data;
}

export async function updateJob(jobId, payload) {
  const { data } = await apiClient.put(`/jobs/${jobId}`, payload);
  return data;
}

export async function deleteJob(jobId) {
  const { data } = await apiClient.delete(`/jobs/${jobId}`);
  return data;
}

// query filters
const JOB_TYPE_MAP = {
  remote: { key: "jobType", value: "remote" },
  onsite: { key: "jobType", value: "onsite" },
  hybrid: { key: "jobType", value: "hybrid" },
  "full-time": { key: "employmentType", value: "full-time" },
  "fulltime": { key: "employmentType", value: "full-time" },
  "part-time": { key: "employmentType", value: "part-time" },
  "parttime": { key: "employmentType", value: "part-time" },
  contract: { key: "employmentType", value: "contract" },
  internship: { key: "employmentType", value: "internship" },
  freelance: { key: "employmentType", value: "freelance" },
};

const EXP_LEVELS = ["entry", "mid", "senior", "lead", "executive"];

export async function getJobs(params = {}) {
  try {
    const query = {
      page: params.page || 1,
      limit: params.limit || 10,
    };
    if (params.search) query.search = params.search;
    if (params.salaryMin != null) query.minSalary = Number(params.salaryMin);
    if (params.salaryMax != null) query.maxSalary = Number(params.salaryMax);

    // Map UI jobType selections
    if (params.jobType) {
      const jobTypes = [];
      const employmentTypes = [];
      params.jobType.split(",").forEach((t) => {
        const mapped = JOB_TYPE_MAP[t.trim().toLowerCase()];
        if (mapped) {
          if (mapped.key === "jobType") {
            jobTypes.push(mapped.value);
          } else if (mapped.key === "employmentType") {
            employmentTypes.push(mapped.value);
          }
        }
      });
      if (jobTypes.length) query.jobType = jobTypes.join(",");
      if (employmentTypes.length) query.employmentType = employmentTypes.join(",");
    }

    // Map UI experience level selections
    if (params.level) {
      const levels = [];
      params.level.split(",").forEach((l) => {
        const lower = l.trim().toLowerCase();
        const matched = EXP_LEVELS.find((lvl) => lower.includes(lvl));
        if (matched) {
          levels.push(matched);
        }
      });
      if (levels.length) query.experienceLevel = levels.join(",");
    }

    const { data } = await apiClient.get("/jobs", { params: query });
    return data;
  } catch (error) {
    console.error("Failed to fetch jobs:", error.message);
    throw error;
  }
}

export async function getRecommendations() {
  try {
    const { data } = await apiClient.get("/jobs/recommendations");
    return data;
  } catch {
    return { success: true, data: mockRecommendations };
  }
}
