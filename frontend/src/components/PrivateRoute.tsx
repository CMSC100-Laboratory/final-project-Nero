import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function PrivateRoute({ allowedRoles }: { allowedRoles?: string[] }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p className="text-muted-foreground font-medium">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If roles are provided and the user's role isn't in the list, redirect them to their respective default home
  if (allowedRoles && user && !allowedRoles.includes(user.userType)) {
    return <Navigate to={user.userType === "admin" ? "/dashboard" : "/"} replace />;
  }

  return <Outlet />;
}
