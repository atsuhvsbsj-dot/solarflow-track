import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import authService from "@/services/authService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await authService.myRoles();
        setIsAdmin(roles.includes("admin"));
      } catch (err) {
        console.error("Error fetching roles:", err);
        setIsAdmin(false);
      }
    };

    fetchRoles();
  }, []);

  if (isAdmin === null) {
    return null;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
