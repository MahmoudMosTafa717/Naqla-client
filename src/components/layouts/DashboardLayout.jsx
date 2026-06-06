import { Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Navbar } from "../shared/Navbar";

export default function DashboardLayout() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar userRole={user?.role} userName={user?.fullName || user?.email} />
      <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
