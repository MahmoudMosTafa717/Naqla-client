/**
 * Shared footer — multi-column nav grid (inspired by design.md Section 12).
 */
export default function Footer() {
  const nav = [
    {
      title: "Product",
      links: ["AI Matching", "Analytics", "Job Search", "For Employers", "For Candidates"],
    },
    {
      title: "Company",
      links: ["About Naqla", "Blog", "Careers", "Press"],
    },
    {
      title: "Resources",
      links: ["Documentation", "Help Center", "Status", "API"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service", "GDPR", "Cookie Policy"],
    },
  ];

  return (
    <footer style={{ background: "#0f172a" }}>
      {/* Main nav grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Brand col */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <img
                src="/logo_mark.png"
                alt="Naqla Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-bold text-white text-lg tracking-tight">Naqla</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "#64748b" }}>
              AI-powered recruitment that explains itself. Match talent to opportunity with
              transparency.
            </p>
          </div>

          {/* Nav cols */}
          {nav.map((col) => (
            <div key={col.title}>
              <p
                className="text-xs font-bold uppercase tracking-[0.15em] mb-4"
                style={{ color: "#475569" }}
              >
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      className="text-sm transition-colors duration-150"
                      style={{ color: "#64748b" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid #1e293b" }}
      >
        <p className="text-xs" style={{ color: "#475569" }}>
          © {new Date().getFullYear()} Naqla Technologies. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {["Privacy", "Terms", "Contact"].map((item) => (
            <button
              key={item}
              className="text-xs transition-colors duration-150"
              style={{ color: "#475569" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
