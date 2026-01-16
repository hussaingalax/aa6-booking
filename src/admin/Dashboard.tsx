import { useMemo } from "react";
import { useBookings } from "./useBookings";

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 14, boxShadow: "0 10px 25px rgba(0,0,0,0.06)", border: "1px solid #eef2f7" }}>
      <div style={{ opacity: 0.7, fontWeight: 800 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 1000, marginTop: 6 }}>{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const { rows, loading, error } = useBookings();

  const stats = useMemo(() => {
    const total = rows.length;
    const completed = rows.filter(r => r.payment_status === "completed").length;
    const pending = rows.filter(r => r.payment_status === "pending").length;
    const rejected = rows.filter(r => r.payment_status === "rejected").length;
    const totalCollection = rows.filter(r => r.payment_status === "completed").reduce((s, r) => s + (r.amount || 0), 0);
    const attended = rows.filter(r => r.attendance_status === "attended").length;
    const notAttended = rows.filter(r => r.attendance_status !== "attended").length;
    return { total, completed, pending, rejected, totalCollection, attended, notAttended };
  }, [rows]);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "#dc2626", fontWeight: 900 }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0, 1fr))", gap: 12 }}>
        <Card title="Total Bookings" value={stats.total} />
        <Card title="Completed Payments" value={stats.completed} />
        <Card title="Pending Payments" value={stats.pending} />
        <Card title="Total Collection" value={`₹${stats.totalCollection.toLocaleString("en-IN")}`} />
        <Card title="Attended" value={stats.attended} />
        <Card title="Not Attended" value={stats.notAttended} />
      </div>

      <div style={{ marginTop: 16, background: "#fff", borderRadius: 16, padding: 14, border: "1px solid #eef2f7", boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
        <div style={{ fontWeight: 1000, fontSize: 18 }}>Recent Bookings</div>
        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          {rows.slice(0, 8).map(r => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", borderTop: "1px solid #eef2f7", paddingTop: 10 }}>
              <div>
                <div style={{ fontWeight: 1000 }}>{r.name}</div>
                <div style={{ opacity: 0.7, fontSize: 12 }}>{r.id.slice(-6)} • ₹{r.amount}</div>
              </div>
              <div style={{ fontWeight: 900, padding: "6px 10px", borderRadius: 999, background: r.payment_status === "completed" ? "#dcfce7" : r.payment_status === "rejected" ? "#fee2e2" : "#fef9c3" }}>
                {r.payment_status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
