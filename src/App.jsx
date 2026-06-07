import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { Suspense, useEffect } from "react";
import { router } from "./routes";
import { useAuthStore } from "./store/authStore";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationListener from "./components/shared/NotificationListener";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (!isHydrated) {
    return (
      <div 
        className="min-h-screen bg-linear-to-tr from-brand-blue/5 to-brand-teal/5 flex flex-col items-center justify-center p-6"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex flex-col items-center max-w-sm w-full text-center">
          {/* Sleek dynamic logo wrapper */}
          <div className="w-16 h-16 bg-linear-to-br from-brand-blue to-brand-teal rounded-2xl flex items-center justify-center shadow-xl shadow-brand-blue/15 animate-bounce mb-6">
            <span className="text-white font-bold text-3xl select-none">A</span>
          </div>
          
          {/* Modern styled progress loader */}
          <div className="relative w-14 h-14 mb-5">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-brand-teal border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>

          {/* Informative screen reader & visual status messages */}
          <h2 className="text-xl font-semibold text-slate-800 tracking-tight mb-2">
            Initializing Session
          </h2>
          <p className="text-sm text-slate-500 font-medium animate-pulse">
            Securing your connection...
          </p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationListener />
      <ToastContainer theme="light" />
      <Suspense
        fallback={<div className="p-5 text-center text-slate-500 font-medium">Loading Platform...</div>}
      >
        <RouterProvider router={router} />
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;
