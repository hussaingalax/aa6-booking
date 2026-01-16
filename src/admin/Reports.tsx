import { useBookings } from "./useBookings";

function downloadCsv(filename: string, rows: any[]) {
  const cols = Object.keys(rows[0] || {});
  const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [cols.join(","), ...rows.map(r => cols.map(c => escape(r[c])).join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const { rows, loading, error } = useBookings();

  const reportRows = rows.map(r => ({
    booking_id: (r.id.replace(/\D/g, "").slice(-6) || r.id.slice(-6)),
    name: r.name,
    mobile: r.mobile,
    amount: r.amount,
    txn_id: r.txn_id,
    payment_status: r.payment_status,
    verified_at: r.verified_at || "",
    attendance_status: r.attendance_status,
    attendance_at: r.attendance_at || "",
    screenshot_url: r.screenshot_url || "",
    created_at: r.created_at,
  }));

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Reports</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#dc2626", fontWeight: 900 }}>{error}</div>}

      <div style={{ display: "grid", gap: 12, maxWidth: 700 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 14, border: "1px solid #eef2f7", boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
          <div style={{ fontWeight: 1000, fontSize: 18 }}>Export Student List</div>
          <div style={{ opacity: 0.7, marginTop: 6 }}>Export all bookings with details</div>
          <button
            disabled={reportRows.length === 0}
            onClick={() => downloadCsv("aa6_students.csv", reportRows)}
            style={{
              marginTop: 12,
              padding: "12px 14px",
              borderRadius: 14,
              border: "none",
              background: "#16a34a",
              color: "#fff",
              fontWeight: 1000,
              cursor: reportRows.length ? "pointer" : "not-allowed",
              opacity: reportRows.length ? 1 : 0.6,
            }}
          >
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
}
