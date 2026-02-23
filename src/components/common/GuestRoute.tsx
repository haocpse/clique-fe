import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/constants";
import type { ReactNode } from "react";

interface GuestRouteProps {
  children: ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-accent">
        <div className="text-white/50 text-lg font-display">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={ROUTES.PROFILE_ME} replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
