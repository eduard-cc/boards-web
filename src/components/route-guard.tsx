import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "@/services/auth-service";

const RouteGuard: React.FC<{
  children: React.ReactNode;
  protectedRoute?: boolean;
}> = ({ children, protectedRoute }) => {
  if (AuthService.isAuthenticated()) {
    if (protectedRoute) {
      return <>{children}</>;
    } else {
      return <Navigate to="/profile" replace />;
    }
  } else {
    if (protectedRoute) {
      return <Navigate to="/" replace />;
    } else {
      return <>{children}</>;
    }
  }
};

export default RouteGuard;
