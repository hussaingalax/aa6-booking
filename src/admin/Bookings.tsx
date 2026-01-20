// src/admin/Bookings.tsx
import { useMemo, useState } from "react";
import { supabase } from "./supabaseAdmin";
import { useBookings } from "./useBookings";

function waLink(to: string, text: string) {
  const clean = String(to || "").replace(/\D/g, "").slice(-10);
  return `https://wa.me/91${clean}?text=${encodeURIComponent(text)}`;
}

type PayStatus = "pending" | "completed" | "rejected";
type AttendStatus = "attended" | "not_attended";

export default function Bookings() {
  const { rows, loading, error, reload } = useBookings();

  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>("");

  const list = useMemo(
    () =>
      rows.map((r: any) => ({
        ...r,
        shortId: String(r.id || "").replace(/\D/g, "").slice(-6) || String(r.id || "").slice(-6),
        payment_status: (r.payment_status ?? r.status ?? "pending") as PayStatus,
        attendance_status: (r.attendance_status ?? "not_attended") as AttendStatus,
      })),
    [rows]
  );

  async function setPayment(id: string, status: PayStatus) {
    setMsg("");
    setBusyId(id);

    try {
      // ✅ keep both columns in sync (table has both `payment_status` and `status`)
      const res = await supabase
        .from("aa6_bookings")
        .update({
          payment_status: status,
          status,
          verified_at: status === "completed" ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (res.error) throw res.error;

      await reload();
      setMsg(status === "completed" ? "✅ Payment verified" : status === "rejected" ? "❌ Payment rejected" : "Updated");
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Payment update failed");
      setMsg(`Error: ${e?.message || "Payment update failed"}`);
    } finally {
      setBusyId(null);
    }
  }

  async function setAttendance(id: string, status: AttendStatus) {
    setMsg("");
    setBusyId(id);

    try {
      const res = await supabase
        .from("aa6_bookings")
        .update({
          attendance_status: status,
          attendance_at: status === "attended" ? new Date().toISOString() : null, // ✅ Absent => null
        })
        .eq("id", id);

      if (res.error) throw res.error;

      await reload();
      setMsg(status === "attended" ? "✅ Marked present" : "✅ Marked absent");
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Attendance update failed");
      setMsg(`Error: ${e?.message || "Attendance update failed"}`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Student Bookings</h1>

      {msg && (
        <div style={{ marginBottom: 10, fontWeight: 900, color: msg.startsWith("Error:") ? "#dc2626" : "#16a34a" }}>
          {msg}
        </div>
      )}

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#dc2626", fontWeight: 900 }}>{error}</div>}

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #eef2f7",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 950 }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {["Booking", "Name", "Mobile", "Amount", "Txn ID", "Payment", "Attendance", "Screenshot", "Actions"].map(
                  (h) => (
                    <th key={h} style={{ padding: 12, fontWeight: 1000, borderBottom: "1px solid #eef2f7" }}>
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {list.map((r: any) => {
                const paymentMsg =
                  `AA6 Payment Verified\n\n` +
                  `Name: ${r.name}\n` +
                  `Mobile: +91 ${r.mobile}\n` +
                  `Booking ID: ${r.shortId}\n` +
                  `Amount: ₹${r.amount}/-\n\n` +
                  `Your payment is received and your seat is confirmed.`;

                const reminderMsg =
                  `AA6 Class Reminder\n\n` +
                  `Name: ${r.name}\n` +
                  `Booking ID: ${r.shortId}\n` +
                  `Date: 15th Feb 2026 (Sunday)\n` +
                  `Time: 9 AM to 7 PM\n` +
                  `Venue: RV Towers, Guindy\n` +
                  `Map: https://maps.app.goo.gl/NCruiwkWrxryVjrA8\n\n` +
                  `Please arrive on time.`;

                const isBusy = busyId === r.id;

                return (
                  <tr key={r.id}>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7", fontWeight: 1000 }}>{r.shortId}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>{r.name}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>+91 {String(r.mobile || "").replace(/\D/g, "").slice(-10)}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>₹{r.amount}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>{r.txn_id}</td>

                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontWeight: 900,
                          background:
                            r.payment_status === "completed"
                              ? "#dcfce7"
                              : r.payment_status === "rejected"
                              ? "#fee2e2"
                              : "#fef9c3",
                        }}
                      >
                        {r.payment_status}
                      </span>
                    </td>

                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontWeight: 900,
                          background: r.attendance_status === "attended" ? "#dcfce7" : "#e5e7eb",
                        }}
                      >
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
                        <button
                          onClick={() => setPayment(r.id, "completed")}
                          disabled={isBusy}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #d1fae5",
                            background: "#dcfce7",
                            fontWeight: 900,
                            cursor: isBusy ? "not-allowed" : "pointer",
                            opacity: isBusy ? 0.6 : 1,
                          }}
                        >
                          {isBusy ? "Working..." : "Verify"}
                        </button>

                        <button
                          onClick={() => setPayment(r.id, "rejected")}
                          disabled={isBusy}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #fecaca",
                            background: "#fee2e2",
                            fontWeight: 900,
                            cursor: isBusy ? "not-allowed" : "pointer",
                            opacity: isBusy ? 0.6 : 1,
                          }}
                        >
                          {isBusy ? "Working..." : "Reject"}
                        </button>

                        <button
                          onClick={() => setAttendance(r.id, "attended")}
                          disabled={isBusy}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #d1fae5",
                            background: "#dcfce7",
                            fontWeight: 900,
                            cursor: isBusy ? "not-allowed" : "pointer",
                            opacity: isBusy ? 0.6 : 1,
                          }}
                        >
                          {isBusy ? "Working..." : "Mark Present"}
                        </button>

                        <button
                          onClick={() => setAttendance(r.id, "not_attended")}
                          disabled={isBusy}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #e5e7eb",
                            background: "#f3f4f6",
                            fontWeight: 900,
                            cursor: isBusy ? "not-allowed" : "pointer",
                            opacity: isBusy ? 0.6 : 1,
                          }}
                        >
                          {isBusy ? "Working..." : "Mark Absent"}
                        </button>

                        <button
                          onClick={() => window.open(waLink(r.mobile, paymentMsg), "_blank")}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #bbf7d0",
                            background: "#16a34a",
                            color: "#fff",
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          WhatsApp Paid
                        </button>

                        <button
                          onClick={() => window.open(waLink(r.mobile, reminderMsg), "_blank")}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #bfdbfe",
                            background: "#2563eb",
                            color: "#fff",
                            fontWeight: 900,
                            cursor: "pointer",
                          }}
                        >
                          Class Reminder
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {list.length === 0 && !loading && (
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
