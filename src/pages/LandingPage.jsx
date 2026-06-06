import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Sparkles,
  CheckCircle2,
  Brain,
  Target,
  BarChart3,
  Shield,
  Zap,
  Users,
  Play,
} from "lucide-react";
import { Navbar } from "../components/shared/Navbar";
import { useAuthStore } from "../store/authStore";
import { getPostAuthPath } from "../utils/authRedirect";

/*  
   AI Match Analysis card (hero right side)
  */
function AIMatchCard() {
  const bars = [
    { label: "Skills Match", pct: 95, color: "#14b8a6" },
    { label: "Experience", pct: 88, color: "#1e3a8a" },
    { label: "Culture Fit", pct: 92, color: "#8b5cf6" },
    { label: "Education", pct: 85, color: "#14b8a6" },
  ];

  const barRefs = useRef([]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      barRefs.current.forEach((el, i) => {
        if (el) {
          el.style.width = `${bars[i].pct}%`;
        }
      });
    }, 400);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative w-full">
      {/* Decorative blobs */}
      <div
        className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #14b8a6, transparent)" }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #1e3a8a, transparent)" }}
      />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-slate-800 font-semibold text-lg">AI Match Analysis</h3>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Demo
          </span>
        </div>

        {/* Progress bars */}
        <div className="space-y-4 mb-6">
          {bars.map((bar, i) => (
            <div key={bar.label}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm text-slate-600 font-medium">{bar.label}</span>
                <span className="text-sm font-semibold text-slate-800">{bar.pct}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  ref={(el) => (barRefs.current[i] = el)}
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: "0%", backgroundColor: bar.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Overall match */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700">Overall Match</span>
          </div>
          <span
            className="text-2xl font-bold"
            style={{
              background: "linear-gradient(135deg, #1e3a8a, #14b8a6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            90%
          </span>
        </div>
      </div>
    </div>
  );
}

/*  
   Feature card
  */
const features = [
  {
    icon: Brain,
    title: "Explainable AI",
    desc: "Understand exactly why candidates match with transparent AI scoring and insights.",
    color: "#1e3a8a",
    bg: "from-blue-50 to-indigo-50",
  },
  {
    icon: Target,
    title: "Smart Matching",
    desc: "Our AI analyzes skills, experience, culture fit, and more for perfect matches.",
    color: "#14b8a6",
    bg: "from-teal-50 to-emerald-50",
  },
  {
    icon: BarChart3,
    title: "Data-Driven Insights",
    desc: "Beautiful analytics dashboards to track your hiring funnel and optimize performance.",
    color: "#8b5cf6",
    bg: "from-violet-50 to-purple-50",
  },
  {
    icon: Shield,
    title: "Bias-Free Hiring",
    desc: "AI-powered screening reduces unconscious bias and promotes diversity.",
    color: "#10b981",
    bg: "from-emerald-50 to-green-50",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Reduce time-to-hire by 50% with automated screening and intelligent recommendations.",
    color: "#f59e0b",
    bg: "from-amber-50 to-yellow-50",
  },
  {
    icon: Users,
    title: "Candidate Experience",
    desc: "Delightful interface that makes job seeking less stressful and more successful.",
    color: "#3b82f6",
    bg: "from-blue-50 to-sky-50",
  },
];

function FeatureCard({ icon: Icon, title, desc, color, bg }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default">
      <div
        className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-gradient-to-br ${bg} group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className="w-7 h-7" style={{ color }} />
      </div>
      <h3 className="text-slate-800 font-semibold text-lg mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

/*  
   Main LandingPage
  */
export default function LandingPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const membership = useAuthStore((s) => s.membership);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isHydrated && user) {
      const target = getPostAuthPath(user, membership);
      if (target !== "/") {
        navigate(target, { replace: true });
      }
    }
  }, [isHydrated, user, membership, navigate]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Shared Navbar (no role = guest mode → shows Sign In / Get Started) */}
      <Navbar userRole={user?.role} userName={user?.fullName || user?.email} />

      <main className="flex-1">
        {/*   Hero Section   */}
        <section className="relative overflow-hidden py-20 lg:py-28">
          {/* Background gradient */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #f0fdf4 70%, #f8fafc 100%)",
            }}
          />
          {/* Decorative circles */}
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 -z-10"
            style={{
              background:
                "radial-gradient(circle at 70% 30%, #14b8a6 0%, transparent 60%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 -z-10"
            style={{
              background:
                "radial-gradient(circle at 30% 70%, #1e3a8a 0%, transparent 60%)",
            }}
          />

          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left — copy */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-teal-200 bg-teal-50 text-sm font-medium text-teal-700">
                  <Sparkles className="w-4 h-4 text-teal-500" />
                  AI-Powered Recruitment
                </div>

                {/* Headline */}
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                    Hire Smarter with{" "}
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg, #1e3a8a, #14b8a6)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      AI Intelligence
                    </span>
                  </h1>
                </div>

                {/* Sub-copy */}
                <p className="text-slate-600 text-lg leading-relaxed max-w-lg">
                  Masar revolutionizes recruitment with explainable AI, matching
                  the right talent with the right opportunities. Transparent,
                  intelligent, and human-centered.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-4">
                  <button
                    id="hero-find-job-btn"
                    onClick={() => navigate("/register")}
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-white text-base shadow-lg shadow-blue-900/25 hover:shadow-xl hover:shadow-blue-900/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                    style={{
                      background:
                        "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
                    }}
                  >
                    Find Your Dream Job
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    id="hero-hire-talent-btn"
                    onClick={() => navigate("/register")}
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-semibold text-slate-700 text-base border-2 border-slate-200 bg-white hover:border-teal-300 hover:text-teal-700 hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                  >
                    <Building2 className="w-5 h-5" />
                    Hire Top Talent
                  </button>
                </div>

                {/* Trust signals */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    No credit card required
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Free for candidates
                  </span>
                </div>
              </div>

              {/* Right — AI match card */}
              <div className="lg:pl-8">
                <AIMatchCard />
              </div>
            </div>
          </div>
        </section>

        {/*   Why Choose Masar?                  */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">
                Why Choose Masar?
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Powered by cutting-edge AI with human-centered design
              </p>
            </div>

            {/* Feature grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </div>
        </section>

        {/*   CTA Section  ─ */}
        <section
          className="py-24 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #0f766e 100%)",
          }}
        >
          {/* Decorative glow */}
          <div
            className="absolute inset-0 -z-0 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at center, #14b8a6 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Transform Your Hiring?
            </h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of companies and candidates using AI to find
              perfect matches.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                id="cta-get-started-btn"
                onClick={() => navigate("/register")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-slate-900 text-base bg-white hover:bg-slate-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                id="cta-watch-demo-btn"
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white text-base border-2 border-white/30 hover:border-white/60 hover:bg-white/10 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
              >
                <Play className="w-5 h-5 fill-current" />
                Watch Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/*   Footer    */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #1e3a8a, #14b8a6)",
              }}
            >
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-semibold text-white">Masar</span>
          </div>
          <p>© {new Date().getFullYear()} Masar. All rights reserved.</p>
          <div className="flex gap-6">
            <button className="hover:text-white transition-colors">Privacy</button>
            <button className="hover:text-white transition-colors">Terms</button>
            <button className="hover:text-white transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
