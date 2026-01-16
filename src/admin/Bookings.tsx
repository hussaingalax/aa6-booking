import { supabase } from "./supabaseAdmin";
import { useBookings } from "./useBookings";

function waLink(to: string, text: string) {
  return `https://wa.me/91${to}?text=${encodeURIComponent(text)}`;
}

export default function Bookings() {
  const { rows, loading, error, reload } = useBookings();

  async function setPayment(id: string, status: "completed" | "rejected" | "pending") {
    await supabase
      .from("aa6_bookings")
      .update({ payment_status: status, verified_at: status === "completed" ? new Date().toISOString() : null })
      .eq("id", id);
    reload();
  }

  async function setAttendance(id: string, status: "attended" | "not_attended") {
    await supabase
      .from("aa6_bookings")
      .update({ attendance_status: status, attendance_at: status === "attended" ? new Date().toISOString() : null })
      .eq("id", id);
    reload();
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Student Bookings</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#dc2626", fontWeight: 900 }}>{error}</div>}

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eef2f7", boxShadow: "0 10px 25px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 950 }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {["Booking", "Name", "Mobile", "Amount", "Txn ID", "Payment", "Attendance", "Screenshot", "Actions"].map(h => (
                  <th key={h} style={{ padding: 12, fontWeight: 1000, borderBottom: "1px solid #eef2f7" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const shortId = r.id.replace(/\D/g, "").slice(-6) || r.id.slice(-6);
                const paymentMsg =
                  `AA6 Payment Verified\n\nName: ${r.name}\nMobile: +91 ${r.mobile}\nBooking ID: ${shortId}\nAmount: ₹${r.amount}/-\n\nYour payment is received and your seat is confirmed.`;
                const reminderMsg =
                  `AA6 Class Reminder\n\nName: ${r.name}\nBooking ID: ${shortId}\nDate: 1st Feb 2026 (Sunday)\nTime: 9 AM to 7 PM\nVenue: RV Towers, Guindy\n\nPlease arrive on time.`;

                return (
                  <tr key={r.id}>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7", fontWeight: 1000 }}>{shortId}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>{r.name}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>+91 {r.mobile}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>₹{r.amount}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>{r.txn_id}</td>

                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>
                      <span style={{ padding: "6px 10px", borderRadius: 999, fontWeight: 900, background: r.payment_status === "completed" ? "#dcfce7" : r.payment_status === "rejected" ? "#fee2e2" : "#fef9c3" }}>
                        {r.payment_status}
                      </span>
                    </td>

                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>
                      <span style={{ padding: "6px 10px", borderRadius: 999, fontWeight: 900, background: r.attendance_status === "attended" ? "#dcfce7" : "#e5e7eb" }}>
                        {r.attendance_status === "attended" ? "Attended" : "Not Attended"}
                      </span>
                    </td>

                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>
                      {r.screenshot_url ? (
                        <a href={r.screenshot_url} target="_blank" rel="noreferrer" style={{ fontWeight: 900 }}>
                          View
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button onClick={() => setPayment(r.id, "completed")} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #d1fae5", background: "#dcfce7", fontWeight: 900, cursor: "pointer" }}>
                          Verify
                        </button>
                        <button onClick={() => setPayment(r.id, "rejected")} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #fecaca", background: "#fee2e2", fontWeight: 900, cursor: "pointer" }}>
                          Reject
                        </button>

                        <button onClick={() => setAttendance(r.id, "attended")} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #d1fae5", background: "#dcfce7", fontWeight: 900, cursor: "pointer" }}>
                          Mark Present
                        </button>
                        <button onClick={() => setAttendance(r.id, "not_attended")} style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#f3f4f6", fontWeight: 900, cursor: "pointer" }}>
                          Mark Absent
                        </button>

                        <button
                          onClick={() => window.open(waLink(r.mobile, paymentMsg), "_blank")}
                          style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #bbf7d0", background: "#16a34a", color: "#fff", fontWeight: 900, cursor: "pointer" }}
                        >
                          WhatsApp Paid
                        </button>

                        <button
                          onClick={() => window.open(waLink(r.mobile, reminderMsg), "_blank")}
                          style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #bfdbfe", background: "#2563eb", color: "#fff", fontWeight: 900, cursor: "pointer" }}
                        >
                          Class Reminder
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && !loading && (
                <tr>
                  <td colSpan={9} style={{ padding: 14, textAlign: "center", opacity: 0.7 }}>
                    No bookings yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
