import { Sparkles } from "lucide-react";

export function AIScoreBadge({
  score,
  size = "md",
  showIcon = true,
  showLabel = false,
}) {
  const getColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60)
      return "text-[var(--color-brand-teal)] bg-teal-50 border-teal-200";
    if (score >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const sizes = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${getColor(score)} ${sizes[size]}`}
    >
      {showIcon && <Sparkles className="w-3.5 h-3.5" />}
      {showLabel && <span>AI Match</span>}
      <span>{score}%</span>
    </div>
  );
}

export function AIScoreCircular({ score, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#14B8A6";
    if (score >= 40) return "#f59e0b";
    return "#64748b";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(score)}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color: getColor(score) }}>
          {score}%
        </span>
        <span className="text-xs text-gray-500">Completion</span>
      </div>
    </div>
  );
}
