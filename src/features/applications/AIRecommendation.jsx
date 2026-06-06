import React from 'react';
import { Sparkles } from 'lucide-react';

export default function AIRecommendation() {
  return (
    <div className="bg-linear-to-br from-(--color-brand-blue) to-(--color-brand-teal)  text-white rounded-2xl p-5 shadow-md space-y-4 relative overflow-hidden">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-cyan-300" />
        <h3 className="font-bold text-sm tracking-wide">AI Recommendation</h3>
      </div>
      <p className="text-xs text-cyan-50/90 leading-relaxed font-medium">
        Based on comprehensive analysis, we strongly recommend moving this candidate to the interview stage.
      </p>
      <button className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer">
        Schedule Interview
      </button>
    </div>
  );
}