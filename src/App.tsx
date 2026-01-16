import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Otp from "./pages/Otp";
import Offer from "./pages/Offer";
import Pay from "./pages/Pay";
import Success from "./pages/Success";

/* Admin */
import AdminGuard from "./admin/AdminGuard";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import Bookings from "./admin/Bookings";
import Payments from "./admin/Payments";
import Attendance from "./admin/Attendance";
import Reports from "./admin/Reports";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f7fafc" }}>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/success" element={<Success />} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="payments" element={<Payments />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
