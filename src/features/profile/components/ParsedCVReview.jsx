import SkillsTagInput from "./SkillsTagInput";
import ExperienceEducationEditor from "./ExperienceEducationEditor";
import { Textarea } from "../../../components/ui/Input";

export default function ParsedCVReview({
  profile,
  skills,
  experience,
  education,
  onSkillsChange,
  onExperienceChange,
  onEducationChange,
}) {
  const parsed = profile?.resume?.parsedData ?? {};

  return (
    <div className="space-y-8">
      <div
        role="status"
        aria-live="polite"
        className="p-4 rounded-xl bg-brand-teal/5 border border-brand-teal/20 text-sm text-slate-700"
      >
        Review AI-extracted data below. Edit anything before finishing your profile.
      </div>

      {parsed.summary && (
        <div>
          <p className="text-sm font-medium text-slate-800 mb-1">AI Summary</p>
          <p className="text-sm text-slate-600 leading-relaxed">{parsed.summary}</p>
        </div>
      )}

      {parsed.experienceYears > 0 && (
        <p className="text-sm text-slate-600">
          Estimated experience: <strong>{parsed.experienceYears} years</strong>
        </p>
      )}

      {parsed.jobTitles?.length > 0 && (
        <div>
          <p className="text-sm font-medium text-slate-800 mb-2">Detected roles</p>
          <div className="flex flex-wrap gap-2">
            {parsed.jobTitles.map((title) => (
              <span
                key={title}
                className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
              >
                {title}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-sm font-medium text-slate-800 mb-2">Skills</p>
        <SkillsTagInput value={skills} onChange={onSkillsChange} />
      </div>

      <div>
        <p className="text-sm font-medium text-slate-800 mb-2">Professional summary (optional)</p>
        <Textarea
          rows={4}
          value={parsed.summary ?? ""}
          readOnly
          className="bg-slate-50"
        />
      </div>

      <ExperienceEducationEditor
        experience={experience}
        education={education}
        onExperienceChange={onExperienceChange}
        onEducationChange={onEducationChange}
      />
    </div>
  );
}
