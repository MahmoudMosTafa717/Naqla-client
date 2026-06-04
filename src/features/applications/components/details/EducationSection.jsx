import { GraduationCap } from "lucide-react";

export default function EducationSection({ education }) {
  const { degree, university, meta } = education || {};
  return (
    <div className='bg-white border border-gray-100 rounded-2xl p-6 space-y-6 shadow-sm'>
      <h3 className="font-bold text-base text-slate-900 border-b border-gray-100 pb-3">Education</h3>
      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 shadow-xs">
          <GraduationCap className="w-5 h-5 text-blue-900" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-bold text-slate-900">{degree}</span>
            <span className="text-xs text-slate-500 font-medium">{university}</span>
          </div>
          <p className="text-xs text-slate-600 font-semibold mt-0.5">{meta}</p>
        </div>
      </div>
    </div>
  );
}