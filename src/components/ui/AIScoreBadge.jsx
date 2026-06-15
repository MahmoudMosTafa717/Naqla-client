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

export function AIScoreCircular({ score, size = 120, strokeWidth = 8, label = "Matching score" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center group cursor-pointer">
      <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-sm">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth - 2}
          fill="none"
          className="text-slate-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#blue-gradient-circular)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.5)]"
        />
        <defs>
          <linearGradient id="blue-gradient-circular" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#4F46E5" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <div className="flex items-baseline justify-center mt-1">
          <span className={`${score === 100 ? 'text-2xl' : 'text-3xl'} font-black text-slate-900 tracking-tight leading-none`}>
            {score}
          </span>
          <span className="text-sm font-bold text-slate-400 ml-0.5">%</span>
        </div>
        <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mt-1 px-1 text-center">
          {label}
        </span>
      </div>
    </div>
  );
}
