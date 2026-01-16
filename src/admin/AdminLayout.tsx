import { NavLink, Outlet, useNavigate } from "react-router-dom";

const linkStyle = ({ isActive }: any) => ({
  display: "block",
  padding: "10px 12px",
  borderRadius: 12,
  textDecoration: "none",
  fontWeight: 900,
  color: isActive ? "#fff" : "rgba(255,255,255,0.85)",
  background: isActive ? "rgba(99,102,241,0.9)" : "transparent",
});

export default function AdminLayout() {
  const nav = useNavigate();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh", background: "#f3f4f6" }}>
      <aside style={{ background: "#0b1220", padding: 14, color: "#fff" }}>
        <div style={{ fontWeight: 1000, fontSize: 18 }}>Arithuyil Arivom</div>
        <div style={{ opacity: 0.7, marginTop: 2 }}>Admin Panel</div>

        <div style={{ marginTop: 14, display: "grid", gap: 8 }}>
          <NavLink to="/admin" style={linkStyle} end>Dashboard</NavLink>
          <NavLink to="/admin/bookings" style={linkStyle}>Student Bookings</NavLink>
          <NavLink to="/admin/payments" style={linkStyle}>Payments</NavLink>
          <NavLink to="/admin/attendance" style={linkStyle}>Attendance</NavLink>
          <NavLink to="/admin/reports" style={linkStyle}>Reports</NavLink>
          <button
            onClick={() => {
              localStorage.removeItem("AA6_ADMIN_OK");
              nav("/admin/login");
            }}
            style={{
              marginTop: 10,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "transparent",
              color: "#fff",
              fontWeight: 900,
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      <main style={{ padding: 18 }}>
        <Outlet />
      </main>
    </div>
  );
}
