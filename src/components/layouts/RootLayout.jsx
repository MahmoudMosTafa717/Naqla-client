import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../shared/Navbar";

export default function RootLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthPage = authPaths.includes(location.pathname);
  const needsPadding = !isLandingPage && !isAuthPage;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className={`flex-1 flex flex-col relative ${needsPadding ? "pt-28" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
}
