import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 10; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function Success() {
  const nav = useNavigate();
  const name = localStorage.getItem("AA6_NAME") || "user";
  const mobile = localStorage.getItem("AA6_MOBILE") || "";
  const bookingCode = useMemo(() => makeCode(), []);

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 18, padding: 18, border: "1px solid #eef2f7", boxShadow: "0 10px 25px rgba(0,0,0,0.06)", textAlign: "center" }}>
        <div style={{ fontSize: 48 }}>✅</div>
        <h1 style={{ margin: "6px 0" }}>Booking Confirmed Successfully</h1>
        <div style={{ opacity: 0.8 }}>Thank you, {name}! 🎉</div>

        <div style={{ marginTop: 16, padding: 16, borderRadius: 16, background: "#4f46e5", color: "#fff" }}>
          <div style={{ opacity: 0.9 }}>Your Booking ID</div>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2, marginTop: 6 }}>{bookingCode}</div>
          <button
            onClick={() => navigator.clipboard.writeText(bookingCode)}
            style={{ marginTop: 10, background: "#fff", color: "#111827", border: "none", padding: "8px 12px", borderRadius: 10, cursor: "pointer", fontWeight: 800 }}
          >
            Copy
          </button>
        </div>

        <div style={{ marginTop: 14, padding: 12, borderRadius: 14, background: "#fff7ed", border: "1px solid #fde68a", fontWeight: 800 }}>
          ✨ Your booking is confirmed. Our team will contact you shortly.
        </div>

        <div style={{ textAlign: "left", marginTop: 18 }}>
          <h3>Your Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8 }}>
            <div style={{ opacity: 0.7 }}>Name</div><div style={{ fontWeight: 800 }}>{name}</div>
            <div style={{ opacity: 0.7 }}>Mobile</div><div style={{ fontWeight: 800 }}>+91 {mobile}</div>
            <div style={{ opacity: 0.7 }}>Amount Paid</div><div style={{ fontWeight: 800 }}>₹8,500/-</div>
          </div>

          <h3 style={{ marginTop: 16 }}>Class Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8 }}>
            <div style={{ opacity: 0.7 }}>Class</div><div style={{ fontWeight: 800 }}>Advance Level-1 Practical Class</div>
            <div style={{ opacity: 0.7 }}>Batch</div><div style={{ fontWeight: 800 }}>6th Batch</div>
            <div style={{ opacity: 0.7 }}>Date</div><div style={{ fontWeight: 800 }}>1st February 2026</div>
            <div style={{ opacity: 0.7 }}>Venue</div><div style={{ fontWeight: 800 }}>RV Towers, Guindy</div>
          </div>
        </div>

        <button
          onClick={() => nav("/")}
          style={{ width: "100%", marginTop: 16, padding: 12, borderRadius: 14, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer", fontWeight: 900 }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
