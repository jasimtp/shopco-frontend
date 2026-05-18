import { Navigate } from "react-router-dom";

type AdminRouteProps = {
  children: React.ReactNode;
};

export default function AdminRoute({ children }: AdminRouteProps) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}