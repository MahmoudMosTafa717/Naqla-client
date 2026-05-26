import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getPostAuthPath } from "../utils/authRedirect";

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const membership = useAuthStore((s) => s.membership);

  if (user) {
    const target = getPostAuthPath(user, membership);
    if (target !== "/") {
      return <Navigate to={target} replace />;
    }
  }

  return <div className="p-8">Dashboard</div>;
}
