import { PROFILE_STEPS } from "../schemas/profileSchemas.js";
import { Check } from "lucide-react";

export default function ProfileStepper({ currentStep }) {
  return (
    <div
      className="flex items-center justify-between w-full max-w-4xl mx-auto relative pb-8 px-2 sm:px-8 translate-x-2 sm:translate-x-4"
      aria-label="Profile setup progress"
    >
      {PROFILE_STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isComplete = currentStep > step.id;

        return (
          <div key={step.id} className="contents">
            <div className="flex flex-col items-center shrink-0 relative z-10 group">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-2 transition-all duration-500 ease-out ${isActive
                  ? "bg-blue-600 border-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-110"
                  : isComplete
                    ? "bg-blue-50 border-blue-600 text-blue-600"
                    : "bg-white border-slate-200 text-slate-300"
                  }`}
                aria-current={isActive ? "step" : undefined}
              >
                {isComplete ? <Check className="w-6 h-6 animate-fade-in" strokeWidth={3} /> : step.id}
              </div>
              <span
                className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-center text-[11px] font-bold tracking-wider uppercase transition-colors duration-300 whitespace-nowrap ${isActive ? "text-blue-600" : isComplete ? "text-slate-700" : "text-slate-400"
                  }`}
              >
                {step.label}
              </span>
            </div>
            {index < PROFILE_STEPS.length - 1 && (
              <div
                className="h-[3px] flex-1 mx-2 sm:mx-4 rounded-full bg-slate-100 overflow-hidden relative"
                aria-hidden="true"
              >
                <div
                  className="h-full bg-blue-600 transition-all duration-700 ease-out"
                  style={{ width: isComplete ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
