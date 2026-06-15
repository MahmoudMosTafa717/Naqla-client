import { useNavigate, useLocation } from "react-router-dom";
import { Sparkles, Check } from "lucide-react";
import { Button } from "../ui/Button";

export default function AuthLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  const marketingFeatures = [
    "AI-powered job matching",
    "Transparent screening process",
    "Real-time application tracking",
    "Bias-free candidate evaluation",
  ];

  return (
    <div className="flex-1 bg-linear-to-br from-[#f8fafc] to-[#eff6ff] flex flex-col font-sans animate-fade-in relative min-h-0">

      {/* Main Grid Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 max-w-7xl w-full mx-auto">
        {/* Left Side: Branding / Marketing (Desktop only) */}
        <section className="lg:col-span-5 hidden lg:flex flex-col justify-center px-12 xl:px-16 pb-12 pt-28 lg:pt-32 text-left animate-slide-up">
          <div className="space-y-8 max-w-md">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[#2563EB] text-xs font-semibold select-none w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Recruitment</span>
            </div>

            {/* Title & Desc */}
            <div className="space-y-4">
              <h1 className="text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Welcome to <span className="bg-linear-to-r from-[#1e3a8a] to-[#2563EB] bg-clip-text text-transparent">Naqla</span>
              </h1>
              <p className="text-slate-500 text-base leading-relaxed">
                Join the future of intelligent recruitment. Find perfect matches with explainable AI.
              </p>
            </div>

            {/* Feature List */}
            <ul className="space-y-4 pt-4" aria-label="Key Platform Features">
              {marketingFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3.5 text-slate-600 text-sm font-medium">
                  <div className="w-6.5 h-6.5 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-[#2563EB] shadow-xs shrink-0 select-none">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Right Side: Form / Children Container */}
        <section className="lg:col-span-7 flex flex-col justify-center items-center p-6 sm:p-12 pt-28 sm:pt-32 animate-slide-up-delayed">
          {children}
        </section>
      </main>
    </div>
  );
}
