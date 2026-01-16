import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }: { children: JSX.Element }) {
  const ok = localStorage.getItem("AA6_ADMIN_OK") === "1";
  if (!ok) return <Navigate to="/admin/login" replace />;
  return children;
}
