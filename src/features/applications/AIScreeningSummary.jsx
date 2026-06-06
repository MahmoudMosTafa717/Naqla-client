import React from 'react';
import { Target, TrendingUp, Award, GraduationCap, CheckCircle2 } from 'lucide-react';

const getIcon = (label) => {
  const normalized = label.toLowerCase().trim();
  if (normalized.includes('skills')) {
    return <Target className="w-5 h-5 text-white" />;
  }
  if (normalized.includes('experience')) {
    return <TrendingUp className="w-5 h-5 text-white" />;
  }
  if (normalized.includes('culture')) {
    return <Award className="w-5 h-5 text-white" />;
  }
  if (normalized.includes('education')) {
    return <GraduationCap className="w-5 h-5 text-white" />;
  }
  return <Target className="w-5 h-5 text-white" />;
};

export default function AIScreeningSummary({ summary = [], strengths = [] }) {
  return (
    <div className='bg-white border border-gray-100 rounded-2xl p-6 space-y-6 shadow-sm'>
      <h3 className="font-bold text-base text-slate-900 border-b border-gray-100 pb-3">AI Screening Summary</h3>
      <div className='space-y-5'>
        {summary.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--color-brand-blue) to-(--color-brand-teal) flex items-center justify-center shrink-0 shadow-xs">
              {getIcon(item.label)}
            </div>

            <div className="flex-1 min-w-0">
              <div className='flex justify-between items-center'>
                <span className="text-sm font-bold text-slate-900">{item.label}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{item.percentage}%</span>
              </div>
              {item.desc && <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>}
              <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-linear-to-br from-(--color-brand-blue) to-(--color-brand-teal)  h-full rounded-full" style={{ width: `${item.percentage}%` }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {strengths && strengths.length > 0 && (
        <div className="space-y-3 pt-5 border-t border-gray-100">
          <h4 className="text-sm font-bold text-slate-900">Key Strengths</h4>
          <ul className="space-y-2">
            {strengths.map((strength, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}