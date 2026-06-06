import { useState } from "react";
import { Plus, Trash2, Briefcase, GraduationCap, Calendar, Building, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input, Textarea } from "../../../components/ui/Input";

const emptyExperience = {
  company: "",
  title: "",
  startDate: "",
  endDate: "",
  currentlyWorking: false,
  description: "",
};

const emptyEducation = {
  institution: "",
  degree: "",
  field: "",
  startYear: "",
  endYear: "",
};

export default function ExperienceEducationEditor({
  experience = [],
  education = [],
  onExperienceChange,
  onEducationChange,
  errors = { experience: [], education: [] },
  setErrors,
}) {
  const [confirmDeleteExp, setConfirmDeleteExp] = useState(null);
  const [confirmDeleteEdu, setConfirmDeleteEdu] = useState(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear + 10 - 1950 + 1 }, (_, i) => currentYear + 10 - i);

  const updateExperience = (index, field, val) => {
    const next = [...experience];
    if (field === "currentlyWorking") {
      next[index] = { 
        ...next[index], 
        currentlyWorking: val, 
        endDate: val ? "" : (next[index].endDate || "") 
      };
    } else {
      next[index] = { ...next[index], [field]: val };
    }
    onExperienceChange(next);

    // Clear validation error when editing field
    if (errors?.experience?.[index]?.[field]) {
      const nextErrors = { ...errors };
      if (nextErrors.experience[index]) {
        delete nextErrors.experience[index][field];
        if (Object.keys(nextErrors.experience[index]).length === 0) {
          delete nextErrors.experience[index];
        }
      }
      setErrors?.(nextErrors);
    }
  };

  const updateEducation = (index, field, val) => {
    const next = [...education];
    next[index] = { ...next[index], [field]: val };
    onEducationChange(next);

    // Clear validation error when editing field
    if (errors?.education?.[index]?.[field]) {
      const nextErrors = { ...errors };
      if (nextErrors.education[index]) {
        delete nextErrors.education[index][field];
        if (Object.keys(nextErrors.education[index]).length === 0) {
          delete nextErrors.education[index];
        }
      }
      setErrors?.(nextErrors);
    }
  };

  return (
    <div className="space-y-12">
      {/* Work Experience Section */}
      <section aria-labelledby="experience-heading" className="relative space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 id="experience-heading" className="text-lg font-bold text-brand-blue">
              Work Experience
            </h3>
            <p className="text-xs text-slate-500">Add details about your professional roles and accomplishments.</p>
          </div>
        </div>

        {experience.length > 0 && (
          <div className="absolute left-[34px] top-[72px] bottom-[20px] w-0.5 bg-slate-100 hidden sm:block"></div>
        )}

        {experience.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <Briefcase className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">No work experience listed</p>
            <p className="text-xs text-slate-400 mt-0.5">Click the button below to add your first job.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="relative sm:pl-12 group transition-all duration-300">
                {/* Timeline Icon */}
                <div className="absolute left-2.5 top-5 w-9 h-9 rounded-full bg-white border-2 border-blue-500 hidden sm:flex items-center justify-center shrink-0 text-blue-500 shadow-sm z-10 group-hover:scale-110 transition-transform">
                  <Briefcase className="w-4 h-4" />
                </div>

                {/* Card Container */}
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
                  {/* Top Bar / Header */}
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" /> Experience #{index + 1}
                    </span>

                    {confirmDeleteExp !== index ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteExp(index)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        aria-label={`Remove experience ${index + 1}`}
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    ) : null}
                  </div>

                  {/* Confirm Deletion Alert */}
                  {confirmDeleteExp === index && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3 text-sm animate-in fade-in duration-200">
                      <span className="text-red-800 font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        Are you sure you want to delete this experience?
                      </span>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onExperienceChange(experience.filter((_, i) => i !== index));
                            setConfirmDeleteExp(null);
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs shadow-sm transition-colors"
                        >
                          Yes, Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteExp(null)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Input Fields Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Job Title"
                      value={exp.title || ""}
                      placeholder="e.g., Senior Frontend Engineer"
                      onChange={(e) => updateExperience(index, "title", e.target.value)}
                      error={errors?.experience?.[index]?.title}
                      className="focus:ring-blue-500"
                    />
                    <Input
                      label="Company"
                      value={exp.company || ""}
                      placeholder="e.g., Google"
                      onChange={(e) => updateExperience(index, "company", e.target.value)}
                      error={errors?.experience?.[index]?.company}
                      className="focus:ring-blue-500"
                    />
                    <Input
                      label="Start Date"
                      type="month"
                      value={exp.startDate?.slice?.(0, 7) ?? exp.startDate ?? ""}
                      onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                      error={errors?.experience?.[index]?.startDate}
                      className="focus:ring-blue-500"
                    />
                    {!exp.currentlyWorking && (
                      <Input
                        label="End Date"
                        type="month"
                        value={exp.endDate?.slice?.(0, 7) ?? exp.endDate ?? ""}
                        onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                        error={errors?.experience?.[index]?.endDate}
                        className="focus:ring-blue-500"
                      />
                    )}
                  </div>

                  <div className="flex items-center pt-1">
                    <label className="relative flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={Boolean(exp.currentlyWorking)}
                        onChange={(e) => updateExperience(index, "currentlyWorking", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-slate-300 rounded-md bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 flex items-center justify-center transition-all">
                        <svg className="w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-slate-700 select-none group-hover:text-slate-900 transition-colors">
                        I currently work here
                      </span>
                    </label>
                  </div>

                  <Textarea
                    label="Description"
                    rows={3}
                    placeholder="Describe your core responsibilities, key achievements, and technologies used..."
                    value={exp.description ?? ""}
                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                    error={errors?.experience?.[index]?.description}
                    className="focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-start sm:pl-12 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => onExperienceChange([...experience, { ...emptyExperience }])}
            className="group flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50/50 hover:border-blue-300 transition-all font-semibold rounded-xl"
          >
            <Plus className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
            Add Work Experience
          </Button>
        </div>
      </section>

      {/* Education Section */}
      <section aria-labelledby="education-heading" className="relative space-y-6 pt-6 border-t border-slate-100">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="p-2 rounded-lg bg-violet-50 text-violet-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 id="education-heading" className="text-lg font-bold text-brand-blue">
              Education
            </h3>
            <p className="text-xs text-slate-500">Provide details about your academic background and degrees.</p>
          </div>
        </div>

        {education.length > 0 && (
          <div className="absolute left-[34px] top-[148px] bottom-[20px] w-0.5 bg-slate-100 hidden sm:block"></div>
        )}

        {education.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <GraduationCap className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">No education listed</p>
            <p className="text-xs text-slate-400 mt-0.5">Click the button below to add your academic degrees.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div key={index} className="relative sm:pl-12 group transition-all duration-300">
                {/* Timeline Icon */}
                <div className="absolute left-2.5 top-5 w-9 h-9 rounded-full bg-white border-2 border-violet-500 hidden sm:flex items-center justify-center shrink-0 text-violet-500 shadow-sm z-10 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-4 h-4" />
                </div>

                {/* Card Container */}
                <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow space-y-4">
                  {/* Top Bar / Header */}
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" /> Education #{index + 1}
                    </span>

                    {confirmDeleteEdu !== index ? (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteEdu(index)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                        aria-label={`Remove education ${index + 1}`}
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    ) : null}
                  </div>

                  {/* Confirm Deletion Alert */}
                  {confirmDeleteEdu === index && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between gap-3 text-sm animate-in fade-in duration-200">
                      <span className="text-red-800 font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        Are you sure you want to delete this education?
                      </span>
                      <div className="flex gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            onEducationChange(education.filter((_, i) => i !== index));
                            setConfirmDeleteEdu(null);
                          }}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-xs shadow-sm transition-colors"
                        >
                          Yes, Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteEdu(null)}
                          className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Input Fields Grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Institution"
                      value={edu.institution || ""}
                      placeholder="e.g., Cairo University"
                      onChange={(e) => updateEducation(index, "institution", e.target.value)}
                      error={errors?.education?.[index]?.institution}
                      className="focus:ring-violet-500"
                    />
                    <Input
                      label="Degree"
                      value={edu.degree || ""}
                      placeholder="e.g., Bachelor of Science"
                      onChange={(e) => updateEducation(index, "degree", e.target.value)}
                      error={errors?.education?.[index]?.degree}
                      className="focus:ring-violet-500"
                    />
                    <Input
                      label="Field of Study"
                      value={edu.field || ""}
                      placeholder="e.g., Computer Science"
                      onChange={(e) => updateEducation(index, "field", e.target.value)}
                      error={errors?.education?.[index]?.field}
                      className="focus:ring-violet-500"
                    />
                    
                    {/* Start Year Dropdown */}
                    <div className="w-full">
                      <label className="block text-sm font-medium mb-2 text-slate-800">
                        Start Year
                      </label>
                      <div className="relative">
                        <select
                          value={edu.startYear || ""}
                          onChange={(e) => updateEducation(index, "startYear", e.target.value)}
                          className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-slate-700 text-sm ${
                            errors?.education?.[index]?.startYear ? "border-red-500" : "border-slate-200"
                          }`}
                        >
                          <option value="">Select Year</option>
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors?.education?.[index]?.startYear && (
                        <p className="mt-1 text-sm text-red-600">{errors.education[index].startYear}</p>
                      )}
                    </div>

                    {/* End Year Dropdown */}
                    <div className="w-full">
                      <label className="block text-sm font-medium mb-2 text-slate-800">
                        End Year (or Expected)
                      </label>
                      <div className="relative">
                        <select
                          value={edu.endYear || ""}
                          onChange={(e) => updateEducation(index, "endYear", e.target.value)}
                          className={`w-full px-4 py-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all text-slate-700 text-sm ${
                            errors?.education?.[index]?.endYear ? "border-red-500" : "border-slate-200"
                          }`}
                        >
                          <option value="">Select Year</option>
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                      {errors?.education?.[index]?.endYear && (
                        <p className="mt-1 text-sm text-red-600">{errors.education[index].endYear}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-start sm:pl-12 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => onEducationChange([...education, { ...emptyEducation }])}
            className="group flex items-center gap-2 border-violet-200 text-violet-600 hover:bg-violet-50/50 hover:border-violet-300 transition-all font-semibold rounded-xl"
          >
            <Plus className="w-4 h-4 text-violet-500 group-hover:scale-110 transition-transform" />
            Add Academic Education
          </Button>
        </div>
      </section>
    </div>
  );
}
