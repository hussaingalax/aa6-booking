import { supabase } from "./supabaseAdmin";
import { useBookings } from "./useBookings";

export default function Attendance() {
  const { rows, loading, error, reload } = useBookings();

  async function setAttendance(id: string, status: "attended" | "not_attended") {
    await supabase
      .from("aa6_bookings")
      .update({ attendance_status: status, attendance_at: status === "attended" ? new Date().toISOString() : null })
      .eq("id", id);
    reload();
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Attendance Management</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#dc2626", fontWeight: 900 }}>{error}</div>}

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eef2f7", boxShadow: "0 10px 25px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 850 }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {["Booking", "Name", "Mobile", "Status", "Attendance At", "Actions"].map(h => (
                  <th key={h} style={{ padding: 12, fontWeight: 1000, borderBottom: "1px solid #eef2f7" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const shortId = r.id.replace(/\D/g, "").slice(-6) || r.id.slice(-6);
                return (
                  <tr key={r.id}>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7", fontWeight: 1000 }}>{shortId}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>{r.name}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>+91 {r.mobile}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>
                      <span style={{ padding: "6px 10px", borderRadius: 999, fontWeight: 900, background: r.attendance_status === "attended" ? "#dcfce7" : "#e5e7eb" }}>
                        {r.attendance_status === "attended" ? "Attended" : "Not Attended"}
                      </span>
                    </td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>{r.attendance_at ? new Date(r.attendance_at).toLocaleString() : "-"}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => setAttendance(r.id, "attended")} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #d1fae5", background: "#dcfce7", fontWeight: 900, cursor: "pointer" }}>
                          Mark Present
                        </button>
                        <button onClick={() => setAttendance(r.id, "not_attended")} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#f3f4f6", fontWeight: 900, cursor: "pointer" }}>
                          Mark Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && !loading && (
                <tr><td colSpan={6} style={{ padding: 14, textAlign: "center", opacity: 0.7 }}>No students yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
