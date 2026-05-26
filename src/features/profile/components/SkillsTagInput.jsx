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
          className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
          aria-label="Add a skill"
        />
        <Button type="button" variant="secondary" size="sm" onClick={addSkill}>
          Add
        </Button>
      </div>
      {value.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Selected skills">
          {value.map((skill) => (
            <li key={skill}>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-sm font-medium">
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="p-0.5 rounded-full hover:bg-brand-teal/20 focus-visible:ring-2 focus-visible:ring-brand-teal"
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
