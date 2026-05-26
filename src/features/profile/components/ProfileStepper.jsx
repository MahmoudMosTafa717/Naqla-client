import { PROFILE_STEPS } from "../schemas/profileSchemas.js";

export default function ProfileStepper({ currentStep }) {
  return (
    <div
      className="flex items-center justify-between w-full max-w-3xl mx-auto"
      aria-label="Profile setup progress"
    >
      {PROFILE_STEPS.map((step, index) => {
        const isActive = currentStep === step.id;
        const isComplete = currentStep > step.id;

        return (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-medium border-2 transition-colors ${
                  isActive
                    ? "bg-brand-teal border-brand-teal text-white"
                    : isComplete
                      ? "bg-brand-teal/10 border-brand-teal text-brand-teal"
                      : "border-slate-300 text-slate-400"
                }`}
                aria-current={isActive ? "step" : undefined}
              >
                {step.id}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isActive ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < PROFILE_STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-2 mb-6 ${
                  isComplete ? "bg-brand-teal" : "bg-slate-200"
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
