import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../components/ui/Button";

export default function SkillsTagInput({ value = [], onChange, error }) {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const skill = input.trim();
    if (!skill || value.includes(skill)) return;
    onChange([...value, skill]);
    setInput("");
  };

  const removeSkill = (skill) => {
    onChange(value.filter((s) => s !== skill));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill();
            }
          }}
          placeholder="e.g., React, Node.js, TypeScript"
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 shadow-inner transition-all placeholder:text-slate-400"
          aria-label="Add a skill"
        />
        <Button type="button" variant="primary" size="sm" onClick={addSkill}>
          Add
        </Button>
      </div>
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Selected skills">
          {value.map((skill) => (
            <li key={skill}>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md group">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="p-0.5 rounded-md hover:bg-blue-200 text-blue-400 hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                  aria-label={`Remove ${skill}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
