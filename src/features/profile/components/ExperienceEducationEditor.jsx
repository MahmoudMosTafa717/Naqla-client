import { Plus, Trash2 } from "lucide-react";
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
  experience,
  education,
  onExperienceChange,
  onEducationChange,
}) {
  const updateExperience = (index, field, val) => {
    const next = [...experience];
    next[index] = { ...next[index], [field]: val };
    onExperienceChange(next);
  };

  const updateEducation = (index, field, val) => {
    const next = [...education];
    next[index] = { ...next[index], [field]: val };
    onEducationChange(next);
  };

  return (
    <div className="space-y-10">
      <section aria-labelledby="experience-heading">
        <div className="flex items-center justify-between mb-4">
          <h3 id="experience-heading" className="text-lg font-semibold text-slate-800">
            Work Experience
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onExperienceChange([...experience, { ...emptyExperience }])}
          >
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
        {experience.length === 0 ? (
          <p className="text-sm text-slate-500">No experience added yet.</p>
        ) : (
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/50"
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onExperienceChange(experience.filter((_, i) => i !== index))
                    }
                    className="text-red-600 text-sm flex items-center gap-1 hover:underline"
                    aria-label={`Remove experience ${index + 1}`}
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    label="Job Title"
                    value={exp.title}
                    onChange={(e) => updateExperience(index, "title", e.target.value)}
                  />
                  <Input
                    label="Company"
                    value={exp.company}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                  />
                  <Input
                    label="Start Date"
                    type="month"
                    value={exp.startDate?.slice?.(0, 7) ?? exp.startDate ?? ""}
                    onChange={(e) =>
                      updateExperience(index, "startDate", e.target.value)
                    }
                  />
                  <Input
                    label="End Date"
                    type="month"
                    disabled={exp.currentlyWorking}
                    value={exp.endDate?.slice?.(0, 7) ?? exp.endDate ?? ""}
                    onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(exp.currentlyWorking)}
                    onChange={(e) =>
                      updateExperience(index, "currentlyWorking", e.target.checked)
                    }
                    className="rounded border-slate-300 text-brand-teal focus:ring-brand-teal"
                  />
                  I currently work here
                </label>
                <Textarea
                  label="Description"
                  rows={3}
                  value={exp.description ?? ""}
                  onChange={(e) =>
                    updateExperience(index, "description", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="education-heading">
        <div className="flex items-center justify-between mb-4">
          <h3 id="education-heading" className="text-lg font-semibold text-slate-800">
            Education
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEducationChange([...education, { ...emptyEducation }])}
          >
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
        {education.length === 0 ? (
          <p className="text-sm text-slate-500">No education added yet.</p>
        ) : (
          <div className="space-y-6">
            {education.map((edu, index) => (
              <div
                key={index}
                className="p-4 border border-slate-200 rounded-xl space-y-3 bg-slate-50/50"
              >
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      onEducationChange(education.filter((_, i) => i !== index))
                    }
                    className="text-red-600 text-sm flex items-center gap-1 hover:underline"
                    aria-label={`Remove education ${index + 1}`}
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    label="Institution"
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(index, "institution", e.target.value)
                    }
                  />
                  <Input
                    label="Degree"
                    value={edu.degree}
                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                  />
                  <Input
                    label="Field of Study"
                    value={edu.field ?? ""}
                    onChange={(e) => updateEducation(index, "field", e.target.value)}
                  />
                  <Input
                    label="Start Year"
                    type="number"
                    value={edu.startYear ?? ""}
                    onChange={(e) =>
                      updateEducation(index, "startYear", e.target.value)
                    }
                  />
                  <Input
                    label="End Year"
                    type="number"
                    value={edu.endYear ?? ""}
                    onChange={(e) =>
                      updateEducation(index, "endYear", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
