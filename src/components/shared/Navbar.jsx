import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Settings, LogOut, Menu, Loader2, ChevronDown, Check, Plus, Building, Bookmark } from "lucide-react";
import { Button } from "../ui/Button";
import { useSignOut } from "../../hooks/useSignOut";
import { useEmployerStore } from "../../store/employerStore";
import { useProfile } from "../../features/profile/hooks/useProfile";
import { useNotificationStore } from "../../store/notificationStore";

function CandidateAvatar({ userName }) {
  const { profile } = useProfile();
  if (profile?.profilePicture?.url) {
    return <img src={profile.profilePicture.url} alt={userName} className="w-8 h-8 rounded-full object-cover" />;
  }
  return (
    <div className="w-8 h-8 bg-linear-to-br from-(--color-brand-blue) to-(--color-brand-teal) rounded-full flex items-center justify-center">
      <span className="text-white text-sm font-medium">{userName?.[0] || "U"}</span>
    </div>
  );
}

export function Navbar({ userRole, userName }) {
  const navigate = useNavigate();
  const { signOut, isLoading } = useSignOut();
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  const { memberships, activeCompanyId, activeCompany, fetchMemberships, setActiveCompanyId } = useEmployerStore();
  const [showWorkspaceMenu, setShowWorkspaceMenu] = React.useState(false);

  const userMenuRef = React.useRef(null);
  const notificationsRef = React.useRef(null);
  const workspaceMenuRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (workspaceMenuRef.current && !workspaceMenuRef.current.contains(event.target)) {
        setShowWorkspaceMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (userRole === "employer" && memberships.length === 0) {
      fetchMemberships().catch((err) => console.error("Error loading memberships:", err));
    }
  }, [userRole, fetchMemberships, memberships.length]);

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

  return (
    <nav className="bg-white border-b border-(--color-border) sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nav links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 group"
            >
              <div className="w-10 h-10 bg-linear-to-br from-(--color-brand-blue) to-(--color-brand-teal) rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-(--color-brand-blue) to-(--color-brand-teal) bg-clip-text text-transparent">
                Masar
              </span>
            </button>

            {/* Workspace Switcher */}
            {userRole === "employer" && memberships.length > 0 && (
              <div className="relative" ref={workspaceMenuRef}>
                <button
                  onClick={() => {
                    setShowWorkspaceMenu(!showWorkspaceMenu);
                    setShowUserMenu(false);
                    setShowNotifications(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-all text-left max-w-[12rem] cursor-pointer"
                >
                  <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700 shrink-0 overflow-hidden">
                    {activeCompany?.logo ? (
                      <img src={activeCompany.logo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Building className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-slate-700 truncate">
                    {activeCompany?.name || "Select Company"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-1" />
                </button>

                {showWorkspaceMenu && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-(--color-border) py-2 z-50">
                    <div className="px-4 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Workspaces
                    </div>
                    <div className="max-h-60 overflow-y-auto py-1">
                      {memberships.map((m) => (
                        <button
                          key={m.company?._id}
                          onClick={() => handleSwitchCompany(m.company?._id)}
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-slate-50 flex items-center justify-between gap-3 group transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-600 shrink-0 overflow-hidden border border-slate-200">
                              {m.company?.logo ? (
                                <img src={m.company.logo} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Building className="w-4 h-4" />
                              )}
                            </div>
                            <div className="truncate text-left">
                              <p className="font-medium text-slate-800 truncate">{m.company?.name}</p>
                              <p className="text-xs text-slate-400 capitalize">{m.role}</p>
                            </div>
                          </div>
                          {m.company?._id === activeCompanyId && (
                            <Check className="w-4 h-4 text-(--color-brand-teal) shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        setShowWorkspaceMenu(false);
                        navigate("/employer/company-onboarding");
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-600 font-medium cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-slate-400" /> Create Company
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Nav links by role */}
            {userRole && (
              <div className="hidden md:flex items-center gap-1">
                {userRole === "candidate" && (
                  <>
                    <button
                      onClick={() => navigate("/candidate/dashboard")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-(--color-brand-blue) hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate("/candidate/jobs")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-(--color-brand-blue) hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Find Jobs
                    </button>
                    <button
                      onClick={() => navigate("/candidate/applications")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-(--color-brand-blue) hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      My Applications
                    </button>
                    <button
                      onClick={() => navigate("/candidate/profile")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-(--color-brand-blue) hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Profile
                    </button>
                  </>
                )}

                {userRole === "employer" && (
                  <>
                    <button
                      onClick={() => navigate(activeCompanyId ? `/employer/company/${activeCompanyId}` : "/employer/dashboard")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-(--color-brand-blue) hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate(activeCompanyId ? `/employer/company/${activeCompanyId}/jobs` : "/employer/jobs")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-(--color-brand-blue) hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                    >
                      Jobs
                    </button>
                    <button
                      onClick={() => navigate("/employer/pipeline")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-(--color-brand-blue) hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Pipeline
                    </button>
                    <button
                      onClick={() => navigate("/employer/analytics")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-(--color-brand-blue) hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Analytics
                    </button>
                  </>
                )}

                {userRole === "admin" && (
                  <>
                    <button
                      onClick={() => navigate("/admin/dashboard")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-(--color-brand-blue) hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate("/admin/users")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-(--color-brand-blue) hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Users
                    </button>
                    <button
                      onClick={() => navigate("/admin/moderation")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-(--color-brand-blue) hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Moderation
                    </button>
                    <button
                      onClick={() => navigate("/admin/analytics")}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-(--color-brand-blue) hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Analytics
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right — Notifications + User menu */}
          <div className="flex items-center gap-4">
            {userRole && (
              <>
                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                      setShowUserMenu(false);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white px-1 shadow-sm">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-(--color-border) py-2 z-50">
                      <div className="px-4 py-2 border-b border-(--color-border) flex items-center justify-between">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            navigate("/notifications");
                          }}
                          className="text-xs text-(--color-brand-blue) hover:underline font-medium"
                        >
                          See All
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm">No notifications</p>
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => {
                                markRead(notif._id);
                                if (notif.link) navigate(notif.link);
                                setShowNotifications(false);
                              }}
                              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-l-4 transition-all relative ${
                                !notif.read ? "border-blue-500 bg-blue-50/40" : "border-transparent"
                              }`}
                            >
                              {!notif.read && (
                                <div className="absolute right-3 top-3 w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <p className={`text-sm tracking-tight ${!notif.read ? "font-bold text-gray-900" : "font-semibold text-gray-600"}`}>
                                {notif.title}
                              </p>
                              <p className={`text-xs mt-0.5 line-clamp-2 ${!notif.read ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                                {notif.message}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1 font-medium">
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                      {notifications.length > 5 && (
                        <div className="px-4 py-2 border-t border-(--color-border) text-center">
                          <button
                            onClick={() => {
                              setShowNotifications(false);
                              navigate("/notifications");
                            }}
                            className="text-xs text-gray-500 hover:text-(--color-brand-blue) font-medium"
                          >
                            View {notifications.length - 5} more
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => {
                      setShowUserMenu(!showUserMenu);
                      setShowNotifications(false);
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {userRole === "candidate" ? (
                      <CandidateAvatar userName={userName} />
                    ) : (
                      <div className="w-8 h-8 bg-linear-to-br from-(--color-brand-blue) to-(--color-brand-teal) rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {userName?.[0] || "U"}
                        </span>
                      </div>
                    )}
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-(--color-border) py-2 z-50">
                      <div className="px-4 py-2 border-b border-(--color-border)">
                        <p className="font-semibold text-sm">{userName}</p>
                        <p className="text-xs text-gray-500 capitalize">
                          {userRole}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate(`/${userRole === "employer" ? "employer" : "candidate"}/profile`);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                      >
                        <User className="w-4 h-4" /> Profile
                      </button>
                      {userRole === "candidate" && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate("/candidate/saved-jobs");
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                        >
                          <Bookmark className="w-4 h-4" /> Saved Jobs
                        </button>
                      )}
                      <div className="border-t border-(--color-border) my-2"></div>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={isLoading}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600 disabled:opacity-50"
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

            {/* Guest buttons */}
            {!userRole && (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Sign In
                </Button>
                <Button variant="primary" onClick={() => navigate("/register")}>
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t border-(--color-border) bg-white">
          <div className="px-4 py-2 space-y-1">
            {userRole === "candidate" && (
              <>
                <button
                  onClick={() => navigate("/candidate/dashboard")}
                  className="w-full px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/candidate/jobs")}
                  className="w-full px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  Find Jobs
                </button>
                <button
                  onClick={() => navigate("/candidate/applications")}
                  className="w-full px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  My Applications
                </button>
              </>
            )}
            {userRole === "employer" && (
              <>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    navigate(activeCompanyId ? `/employer/company/${activeCompanyId}` : "/employer/dashboard");
                  }}
                  className="w-full px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    navigate(activeCompanyId ? `/employer/company/${activeCompanyId}/jobs` : "/employer/jobs");
                  }}
                  className="w-full px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  Jobs
                </button>
              </>
            )}
            {userRole === "admin" && (
              <>
                <button
                  onClick={() => navigate("/admin/dashboard")}
                  className="w-full px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate("/admin/users")}
                  className="w-full px-4 py-2 text-left text-sm font-medium hover:bg-gray-50 rounded-lg"
                >
                  Users
                </button>
              </>
            )}
            {/* Guest Mobile Buttons */}
            {!userRole && (
              <div className="flex flex-col gap-2 p-2 pt-4 border-t border-(--color-border)">
                <Button variant="ghost" onClick={() => { setShowMobileMenu(false); navigate("/login"); }} className="w-full justify-center">
                  Sign In
                </Button>
                <Button variant="primary" onClick={() => { setShowMobileMenu(false); navigate("/register"); }} className="w-full justify-center">
                  Get Started
                </Button>
              </div>
            )}

            {/* Logged In Sign Out */}
            {userRole && (
              <div className="border-t border-(--color-border) my-2 pt-2">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 disabled:opacity-50"
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
        </div>
      )}
    </nav>
  );
}
