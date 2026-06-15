import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  Loader2,
  ChevronDown,
  Check,
  Plus,
  Building,
  Bookmark,
  Briefcase,
  Calendar,
  Info,
  ClipboardList,
  X,
} from "lucide-react";
import { useSignOut } from "../../hooks/useSignOut";
import { useEmployerStore } from "../../store/employerStore";
import { useProfile } from "../../features/profile/hooks/useProfile";
import { useNotificationStore } from "../../store/notificationStore";
import { useAuthStore } from "../../store/authStore";

/* ── Brand logo mark ── */
function BrandLogo({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-full p-1 pr-3 transition-colors hover:bg-slate-50/80"
      aria-label="Naqla Homepage"
    >
      <img
        src="/logo_mark.png"
        alt="Naqla Logo"
        className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105 shrink-0"
      />
      <span
        className="font-bold text-lg tracking-tight select-none"
        style={{
          background: "linear-gradient(135deg, #1e3a8a, #2563EB)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Naqla
      </span>
    </button>
  );
}

/* ── Candidate avatar ── */
function CandidateAvatar({ userName }) {
  const { profile } = useProfile();
  if (profile?.profilePicture?.url) {
    return (
      <img
        src={profile.profilePicture.url}
        alt={userName}
        className="w-8 h-8 rounded-full object-cover shadow-sm border border-slate-100"
      />
    );
  }
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
      style={{ background: "linear-gradient(135deg, #1e3a8a, #2563EB)" }}
    >
      <span className="text-white text-sm font-semibold">
        {userName?.[0] || "U"}
      </span>
    </div>
  );
}

/* ── Nav link pill ── */
function NavLink({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 relative focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none ${active ? "text-blue-700" : "text-slate-600 hover:text-slate-900"
        }`}
    >
      {active && (
        <span
          className="absolute inset-0 bg-blue-50 rounded-full"
          style={{ zIndex: -1 }}
        />
      )}
      {!active && (
        <span
          className="absolute inset-0 bg-slate-100/80 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"
          style={{ zIndex: -1 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, isLoading } = useSignOut();
  const { user } = useAuthStore();
  const userRole = user?.role;
  const userName = user?.fullName || user?.email;
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const {
    memberships,
    activeCompanyId,
    activeCompany,
    fetchMemberships,
    setActiveCompanyId,
  } = useEmployerStore();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = React.useState(false);

  const userMenuRef = React.useRef(null);
  const notificationsRef = React.useRef(null);
  const workspaceMenuRef = React.useRef(null);
  const mobileMenuRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target))
        setShowUserMenu(false);
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      )
        setShowNotifications(false);
      if (
        workspaceMenuRef.current &&
        !workspaceMenuRef.current.contains(event.target)
      )
        setShowWorkspaceMenu(false);
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-btn")
      )
        setShowMobileMenu(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (userRole === "employer" && user?._id) {
      fetchMemberships().catch((err) =>
        console.error("Error loading memberships:", err),
      );
    }
  }, [userRole, fetchMemberships, user?._id]);

  const handleSwitchCompany = (companyId) => {
    setActiveCompanyId(companyId);
    setShowWorkspaceMenu(false);
    navigate(`/employer/company/${companyId}`);
  };

  const handleSignOut = async () => {
    setShowUserMenu(false);
    setShowMobileMenu(false);
    setShowNotifications(false);
    setShowWorkspaceMenu(false);
    await signOut();
  };

  const { notifications, unreadCount, markRead } = useNotificationStore();

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setShowMobileMenu(false);
    }
  };

  return (
    <nav className="fixed top-4 inset-x-0 z-50 mx-auto w-[95%] max-w-7xl transition-all duration-300 pointer-events-none">
      <div
        className="flex items-center justify-between h-[4.25rem] px-3 rounded-full relative pointer-events-auto"
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow:
            "0 8px 32px 0 rgba(0, 0, 0, 0.08), 0 2px 8px 0 rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255, 255, 255, 0.4)",
        }}
      >
        {/* Subtle noise overlay for premium feel */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none mix-blend-overlay rounded-full overflow-hidden"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        {/* Left: Logo + Workspace */}
        <div className="flex items-center gap-3 relative z-10 flex-1 lg:flex-none">
          <BrandLogo onClick={() => navigate("/")} />

          {/* Workspace Switcher (employer only) */}
          {userRole === "employer" && memberships.length > 0 && (
            <div className="relative hidden sm:block" ref={workspaceMenuRef}>
              <button
                onClick={() => {
                  setShowWorkspaceMenu(!showWorkspaceMenu);
                  setShowUserMenu(false);
                  setShowNotifications(false);
                }}
                className="cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all max-w-[12rem] focus-visible:ring-2 focus-visible:ring-slate-300 focus:outline-none"
                style={{
                  background: showWorkspaceMenu
                    ? "#f1f5f9"
                    : "rgba(248, 250, 252, 0.8)",
                  border: "1px solid rgba(226, 232, 240, 0.8)",
                  color: "#334155",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = showWorkspaceMenu
                    ? "#f1f5f9"
                    : "rgba(248, 250, 252, 0.8)";
                }}
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-semibold text-slate-700 shrink-0 overflow-hidden shadow-sm border border-slate-100">
                  {activeCompany?.logo ? (
                    <img
                      src={activeCompany.logo}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building className="w-3 h-3" />
                  )}
                </div>
                <span className="truncate">
                  {activeCompany?.name || "Select Company"}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-0.5" />
              </button>

              {showWorkspaceMenu && (
                <div
                  className="absolute left-0 top-full mt-3 w-64 rounded-3xl py-3 z-50 overflow-hidden origin-top-left animate-in fade-in slide-in-from-top-2 duration-200 pointer-events-auto"
                  style={{
                    background: "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(20px) saturate(150%)",
                    WebkitBackdropFilter: "blur(20px) saturate(150%)",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 12px 32px -4px rgba(0,0,0,0.1), 0 4px 12px -4px rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Workspaces
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {memberships.map((m) => (
                      <button
                        key={m.company?._id}
                        onClick={() => handleSwitchCompany(m.company?._id)}
                        className="cursor-pointer w-full px-5 py-2.5 text-left text-sm flex items-center justify-between gap-3 transition-colors hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                        style={{ color: "#334155" }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0 overflow-hidden shadow-sm"
                            style={{ border: "1px solid #e2e8f0" }}
                          >
                            {m.company?.logo ? (
                              <img
                                src={m.company.logo}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Building className="w-4 h-4" />
                            )}
                          </div>
                          <div className="truncate text-left">
                            <p className="font-semibold text-slate-800 truncate">
                              {m.company?.name}
                            </p>
                            <p className="text-[11px] text-slate-400 capitalize mt-0.5">
                              {m.role}
                            </p>
                          </div>
                        </div>
                        {m.company?._id === activeCompanyId && (
                          <Check className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="mx-4 my-2 border-t border-slate-100" />
                  <button
                    onClick={() => { setShowWorkspaceMenu(false); navigate("/employer/company-onboarding"); }}
                    className="cursor-pointer w-full px-5 py-2 text-left text-sm flex items-center gap-2.5 transition-colors text-slate-500 hover:text-slate-800 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                  >
                    <Plus className="w-4 h-4 text-slate-400" /> Create Company
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: Nav links (Desktop) - Absolutely positioned for perfect centering */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 z-0">
          {/* Landing page anchor links */}
          {location.pathname === "/" && (
            <>
              <NavLink
                active={false}
                onClick={() => scrollToSection("how-it-works")}
              >
                How it works
              </NavLink>
              <NavLink
                active={false}
                onClick={() => scrollToSection("features")}
              >
                Features
              </NavLink>
              <NavLink
                active={false}
                onClick={() => scrollToSection("testimonials")}
              >
                Testimonials
              </NavLink>
            </>
          )}
          {userRole === "candidate" && (
            <>
              <NavLink
                active={isActive("/candidate/dashboard")}
                onClick={() => navigate("/candidate/dashboard")}
              >
                Dashboard
              </NavLink>
              <NavLink
                active={isActive("/candidate/jobs")}
                onClick={() => navigate("/candidate/jobs")}
              >
                Find Jobs
              </NavLink>
              <NavLink
                active={isActive("/candidate/applications")}
                onClick={() => navigate("/candidate/applications")}
              >
                My Applications
              </NavLink>
              <NavLink
                active={isActive("/candidate/profile")}
                onClick={() => navigate("/candidate/profile")}
              >
                Profile
              </NavLink>
            </>
          )}
          {userRole === "employer" && (
            <>
              <NavLink
                active={isActive(activeCompanyId ? `/employer/company/${activeCompanyId}` : "/employer/dashboard") && !location.pathname.includes('/jobs')}
                onClick={() => navigate(activeCompanyId ? `/employer/company/${activeCompanyId}` : "/employer/dashboard")}
              >
                Dashboard
              </NavLink>
              <NavLink
                active={isActive(activeCompanyId ? `/employer/company/${activeCompanyId}/jobs` : "/employer/jobs")}
                onClick={() => navigate(activeCompanyId ? `/employer/company/${activeCompanyId}/jobs` : "/employer/jobs")}
              >
                Jobs
              </NavLink>
            </>
          )}
          {userRole === "admin" && (
            <>
              <NavLink
                active={isActive("/admin/dashboard")}
                onClick={() => navigate("/admin/dashboard")}
              >
                Dashboard
              </NavLink>
              <NavLink
                active={isActive("/admin/users")}
                onClick={() => navigate("/admin/users")}
              >
                Users
              </NavLink>
              <NavLink
                active={isActive("/admin/companies")}
                onClick={() => navigate("/admin/companies")}
              >
                companies
              </NavLink>
              <NavLink
                active={isActive("/admin/analytics")}
                onClick={() => navigate("/admin/analytics")}
              >
                Analytics
              </NavLink>
            </>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 relative z-10 flex-1 lg:flex-none">
          {userRole && (
            <>
              {/* Notification bell */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
                  className="cursor-pointer relative p-2.5 rounded-full transition-all duration-200 hover:bg-slate-100/80 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300 focus:outline-none"
                  style={{ color: "#64748b" }}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[1.1rem] h-[1.1rem] bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div
                    className="absolute right-0 top-full mt-3 w-80 rounded-3xl py-2 z-50 overflow-hidden origin-top-right animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                      background: "#f7f9fc",
                      backdropFilter: "blur(20px) saturate(150%)",
                      WebkitBackdropFilter: "blur(20px) saturate(150%)",
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                      boxShadow: "0 12px 32px -4px rgba(0,0,0,0.1), 0 4px 12px -4px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100">
                      <h3 className="font-semibold text-sm text-slate-900">
                        Notifications
                      </h3>
                      <button
                        onClick={() => { setShowNotifications(false); navigate("/notifications"); }}
                        className="cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        See all
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-12 text-center">
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell className="w-6 h-6 text-slate-300" />
                          </div>
                          <p className="text-sm font-medium text-slate-600">
                            No notifications yet
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            We'll let you know when something happens.
                          </p>
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notif) => {
                          const getIcon = (type) => {
                            switch (type) {
                              case "application":
                                return (
                                  <ClipboardList
                                    className="w-4 h-4"
                                    style={{ color: "#6366f1" }}
                                  />
                                );
                              case "job":
                                return (
                                  <Briefcase
                                    className="w-4 h-4"
                                    style={{ color: "#2563EB" }}
                                  />
                                );
                              case "interview":
                                return (
                                  <Calendar
                                    className="w-4 h-4"
                                    style={{ color: "#0891b2" }}
                                  />
                                );
                              case "system":
                                return (
                                  <Settings
                                    className="w-4 h-4"
                                    style={{ color: "#64748b" }}
                                  />
                                );
                              default:
                                return (
                                  <Info
                                    className="w-4 h-4"
                                    style={{ color: "#2563EB" }}
                                  />
                                );
                            }
                          };
                          return (
                            <div
                              key={notif._id}
                              onClick={() => {
                                markRead(notif._id);
                                if (notif.link) navigate(notif.link);
                                setShowNotifications(false);
                              }}
                              className="px-5 py-3 cursor-pointer relative flex gap-3 transition-colors hover:bg-slate-50 group"
                              style={{
                                background: !notif.read
                                  ? "rgba(239, 246, 255, 0.4)"
                                  : "transparent",
                              }}
                            >
                              {!notif.read && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />
                              )}
                              <div className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                                {getIcon(notif.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p
                                  className={`text-sm tracking-tight ${!notif.read ? "font-bold text-slate-900" : "font-medium text-slate-600"}`}
                                >
                                  {notif.title}
                                </p>
                                <p
                                  className={`text-xs mt-0.5 line-clamp-2 ${!notif.read ? "text-slate-700" : "text-slate-400"}`}
                                >
                                  {notif.message}
                                </p>
                                <p className="text-[10px] font-medium text-slate-400 mt-1.5">
                                  {new Date(notif.createdAt).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    {notifications.length > 5 && (
                      <div className="px-5 py-3 text-center border-t border-slate-100 bg-slate-50/50">
                        <button
                          onClick={() => { setShowNotifications(false); navigate("/notifications"); }}
                          className="cursor-pointer text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                        >
                          View all {notifications.length} notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
                  className="cursor-pointer flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full transition-all duration-200 border border-transparent hover:bg-slate-100/80 hover:border-slate-200 focus-visible:ring-2 focus-visible:ring-slate-300 focus:outline-none"
                  style={{ background: showUserMenu ? "#f1f5f9" : "transparent" }}
                >
                  {userRole === "candidate" ? (
                    <CandidateAvatar userName={userName} />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm"
                      style={{
                        background: "linear-gradient(135deg, #1e3a8a, #2563EB)",
                      }}
                    >
                      <span className="text-white text-sm font-semibold">
                        {userName?.[0] || "U"}
                      </span>
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 top-full mt-3 w-56 rounded-3xl py-2 z-50 overflow-hidden origin-top-right animate-in fade-in slide-in-from-top-2 duration-200"
                    style={{
                      background: "#f7f9fc",
                      backdropFilter: "blur(20px) saturate(150%)",
                      WebkitBackdropFilter: "blur(20px) saturate(150%)",
                      border: "1px solid rgba(255, 255, 255, 0.5)",
                      boxShadow: "0 12px 32px -4px rgba(0,0,0,0.1), 0 4px 12px -4px rgba(0,0,0,0.06)",
                    }}
                  >
                    <div className="px-5 py-3 border-b border-slate-100">
                      <p className="font-semibold text-sm text-slate-900 truncate">
                        {userName}
                      </p>
                      <p className="text-xs font-medium text-slate-400 capitalize mt-0.5">
                        {userRole}
                      </p>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={() => { setShowUserMenu(false); navigate(`/${userRole === "employer" ? "employer" : "candidate"}/profile`); }}
                        className="cursor-pointer w-full px-5 py-2.5 text-left text-sm font-medium flex items-center gap-3 transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                      >
                        <User className="w-4 h-4 text-slate-400" /> Profile
                      </button>
                      {userRole === "candidate" && (
                        <button
                          onClick={() => { setShowUserMenu(false); navigate("/candidate/saved-jobs"); }}
                          className="cursor-pointer w-full px-5 py-2.5 text-left text-sm font-medium flex items-center gap-3 transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none"
                        >
                          <Bookmark className="w-4 h-4 text-slate-400" /> Saved
                          Jobs
                        </button>
                      )}
                    </div>
                    <div className="mx-4 my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={isLoading}
                      className="cursor-pointer w-full px-5 py-2.5 text-left text-sm font-medium flex items-center gap-3 transition-colors text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Guest buttons — desktop */}
          {!userRole && (
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="cursor-pointer px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-slate-400 focus:outline-none text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="cursor-pointer px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #1d4ed8)",
                  boxShadow: "0 4px 14px -2px rgba(37,99,235,0.4)",
                }}
              >
                Get Started
              </button>
            </div>
          )}

          {/* Hamburger — mobile */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden mobile-menu-btn p-2.5 rounded-full transition-colors hover:bg-slate-100 text-slate-500 focus-visible:ring-2 focus-visible:ring-slate-300 focus:outline-none ml-1"
          >
            {showMobileMenu ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu floating dropdown */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden absolute left-0 right-0 top-full mt-3 rounded-3xl overflow-hidden transition-all duration-300 origin-top shadow-2xl ${showMobileMenu ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        style={{
          background: "#f7f9fc",
          backdropFilter: "blur(20px) saturate(150%)",
          WebkitBackdropFilter: "blur(20px) saturate(150%)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 12px 32px -4px rgba(0,0,0,0.1), 0 4px 12px -4px rgba(0,0,0,0.06)",
        }}
      >
        <div className="p-4 space-y-1 max-h-[85vh] overflow-y-auto">
          {/* Landing page anchor links in mobile */}
          {location.pathname === "/" && (
            <div className="mb-2 pb-2 border-b border-slate-100">
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="cursor-pointer w-full px-5 py-3 text-left text-sm font-semibold rounded-2xl transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                How it works
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="cursor-pointer w-full px-5 py-3 text-left text-sm font-semibold rounded-2xl transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="cursor-pointer w-full px-5 py-3 text-left text-sm font-semibold rounded-2xl transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              >
                Testimonials
              </button>
            </div>
          )}
          {userRole === "candidate" && (
            <>
              {[
                { label: "Dashboard", path: "/candidate/dashboard" },
                { label: "Find Jobs", path: "/candidate/jobs" },
                { label: "My Applications", path: "/candidate/applications" },
                { label: "Profile", path: "/candidate/profile" },
              ].map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => { setShowMobileMenu(false); navigate(path); }}
                  className={`cursor-pointer w-full px-5 py-3 text-left text-sm font-semibold rounded-2xl transition-colors ${isActive(path)
                      ? "text-blue-700 bg-blue-50/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  {label}
                </button>
              ))}
            </>
          )}
          {userRole === "employer" && (
            <>
              {[
                {
                  label: "Dashboard",
                  path: activeCompanyId
                    ? `/employer/company/${activeCompanyId}`
                    : "/employer/dashboard",
                },
                {
                  label: "Jobs",
                  path: activeCompanyId
                    ? `/employer/company/${activeCompanyId}/jobs`
                    : "/employer/jobs",
                },
                { label: "Profile", path: "/employer/profile" },
              ].map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => { setShowMobileMenu(false); navigate(path); }}
                  className={`cursor-pointer w-full px-5 py-3 text-left text-sm font-semibold rounded-2xl transition-colors ${isActive(path)
                      ? "text-blue-700 bg-blue-50/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  {label}
                </button>
              ))}
            </>
          )}
          {userRole === "admin" && (
            <>
              {[
                { label: "Dashboard", path: "/admin/dashboard" },
                { label: "Users", path: "/admin/users" },
              ].map(({ label, path }) => (
                <button
                  key={path}
                  onClick={() => { setShowMobileMenu(false); navigate(path); }}
                  className={`cursor-pointer w-full px-5 py-3 text-left text-sm font-semibold rounded-2xl transition-colors ${isActive(path)
                      ? "text-blue-700 bg-blue-50/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  {label}
                </button>
              ))}
            </>
          )}

          {!userRole && (
            <div className="flex flex-col gap-2 pt-2 pb-1">
              <button
                onClick={() => { setShowMobileMenu(false); navigate("/login"); }}
                className="cursor-pointer w-full py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors border-2 border-slate-200"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  navigate("/register");
                }}
                className="w-full py-3 rounded-2xl text-sm font-semibold text-white transition-all shadow-md active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #2563EB, #1d4ed8)",
                }}
              >
                Get Started
              </button>
            </div>
          )}

          {userRole && (
            <div className="pt-2 mt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isLoading}
                className="cursor-pointer w-full px-5 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 rounded-2xl flex items-center gap-3 disabled:opacity-50 transition-colors"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <LogOut className="w-5 h-5" />
                )}
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
