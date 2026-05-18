import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const ProtectedRoute = () => {
  const token = useSelector(
    (state: RootState) => state.auth.token
  );

  // ❌ login ഇല്ല
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ login ഉണ്ട്
  return <Outlet />;
};

export default ProtectedRoute;
