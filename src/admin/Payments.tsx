// src/admin/Payments.tsx
import { useMemo, useState } from "react";
import { supabase } from "./supabaseAdmin";
import { useBookings } from "./useBookings";

type PayStatus = "pending" | "completed" | "rejected";

export default function Payments() {
  const { rows, loading, error, reload } = useBookings();

  const [busyId, setBusyId] = useState<string | null>(null);
  const [msg, setMsg] = useState<string>("");

  const list = useMemo(
    () =>
      rows.map((r: any) => ({
        ...r,
        shortId: String(r.id || "").replace(/\D/g, "").slice(-6) || String(r.id || "").slice(-6),
      })),
    [rows]
  );

  async function setPayment(id: string, status: PayStatus) {
    setMsg("");
    setBusyId(id);

    try {
      const upd = await supabase
        .from("aa6_bookings")
        .update({
          payment_status: status,
          status, // ✅ keep both columns in sync
          verified_at: status === "completed" ? new Date().toISOString() : null,
        })
        .eq("id", id);

      if (upd.error) throw upd.error;

      await reload();
      setMsg(status === "completed" ? "✅ Payment verified" : status === "rejected" ? "❌ Payment rejected" : "Updated");
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Update failed");
      setMsg(`Error: ${e?.message || "Update failed"}`);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Payment Details</h1>

      {msg && (
        <div style={{ marginBottom: 10, fontWeight: 900, color: msg.startsWith("Error:") ? "#dc2626" : "#16a34a" }}>
          {msg}
        </div>
      )}

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#dc2626", fontWeight: 900 }}>{error}</div>}

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #eef2f7", boxShadow: "0 10px 25px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left" }}>
                {["Booking", "Name", "Txn ID", "Amount", "Status", "Verified At", "Screenshot", "Actions"].map((h) => (
                  <th key={h} style={{ padding: 12, fontWeight: 1000, borderBottom: "1px solid #eef2f7" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((r: any) => {
                const st: PayStatus = (r.payment_status ?? r.status ?? "pending") as PayStatus;

                return (
                  <tr key={r.id}>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7", fontWeight: 1000 }}>{r.shortId}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>{r.name}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>{r.txn_id}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>₹{r.amount}</td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>
                      <span
                        style={{
                          padding: "6px 10px",
                          borderRadius: 999,
                          fontWeight: 900,
                          background: st === "completed" ? "#dcfce7" : st === "rejected" ? "#fee2e2" : "#fef9c3",
                        }}
                      >
                        {st}
                      </span>
                    </td>
                    <td style={{ padding: 12, borderTop: "1px solid #eef2f7" }}>
                      {r.verified_at ? new Date(r.verified_at).toLocaleString() : "-"}
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
                          disabled={busyId === r.id}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #d1fae5",
                            background: "#dcfce7",
                            fontWeight: 900,
                            cursor: busyId === r.id ? "not-allowed" : "pointer",
                            opacity: busyId === r.id ? 0.6 : 1,
                          }}
                        >
                          {busyId === r.id ? "Verifying..." : "Verify"}
                        </button>
                        <button
                          onClick={() => setPayment(r.id, "rejected")}
                          disabled={busyId === r.id}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #fecaca",
                            background: "#fee2e2",
                            fontWeight: 900,
                            cursor: busyId === r.id ? "not-allowed" : "pointer",
                            opacity: busyId === r.id ? 0.6 : 1,
                          }}
                        >
                          {busyId === r.id ? "Rejecting..." : "Reject"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {list.length === 0 && !loading && (
                <tr>
                  <td colSpan={8} style={{ padding: 14, textAlign: "center", opacity: 0.7 }}>
                    No payments yet
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
