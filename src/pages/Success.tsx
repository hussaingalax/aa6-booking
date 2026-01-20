import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Success() {
  const nav = useNavigate();

  const name = localStorage.getItem("AA6_NAME") || "user";
  const mobile = localStorage.getItem("AA6_MOBILE") || "";
  const bookingIdFromPay = localStorage.getItem("AA6_BOOKING_ID") || "";
  const amount = Number(localStorage.getItem("AA6_AMOUNT") || "8500");

  const bookingCode = useMemo(() => {
    // Prefer a stable, short code from booking UUID
    const clean = (bookingIdFromPay || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (clean.length >= 8) return clean.slice(-8); // last 8 chars
    if (clean.length >= 6) return clean.slice(-6);
    // fallback random 6 digit
    return String(Math.floor(100000 + Math.random() * 900000));
  }, [bookingIdFromPay]);

  const waAdmin = "9789489288";
  const waText = encodeURIComponent(
    `Arithuyil Arivom\n\n` +
      `Name: ${name}\n` +
      `Mobile: +91 ${mobile}\n` +
      `Booking ID: ${bookingCode}\n` +
      `Amount: ₹${amount}/-\n\n` +
      `Class: Advance Level-1 Practical Class\n` +
      `Batch: 6th Batch\n` +
      `Date: 15th Feb 2026 (Sunday)\n` +
      `Venue: RV Towers, Guindy\n\n` +
      `Please verify payment & confirm seat.`
  );
  const waLink = `https://wa.me/91${waAdmin}?text=${waText}`;

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 20 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 18,
          border: "1px solid #eef2f7",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48 }}>✅</div>
        <h1 style={{ margin: "6px 0" }}>Payment Submitted Successfully</h1>
        <div style={{ opacity: 0.8 }}>Thank you, {name}! 🎉</div>

        <div style={{ marginTop: 16, padding: 16, borderRadius: 16, background: "#4f46e5", color: "#fff" }}>
          <div style={{ opacity: 0.9 }}>Your Booking ID</div>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 2, marginTop: 6 }}>{bookingCode}</div>
          <button
            onClick={() => navigator.clipboard.writeText(bookingCode)}
            style={{
              marginTop: 10,
              background: "#fff",
              color: "#111827",
              border: "none",
              padding: "8px 12px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            Copy
          </button>
        </div>

        <div style={{ marginTop: 14, padding: 12, borderRadius: 14, background: "#fff7ed", border: "1px solid #fde68a", fontWeight: 800 }}>
          We received your payment details. Our team will verify and confirm your seat shortly.
        </div>

        <button
          onClick={() => window.open(waLink, "_blank")}
          style={{
            width: "100%",
            marginTop: 14,
            padding: 14,
            borderRadius: 14,
            border: "none",
            fontWeight: 900,
            fontSize: 16,
            cursor: "pointer",
            background: "#16a34a",
            color: "#fff",
          }}
        >
          Send WhatsApp Confirmation
        </button>

        <div style={{ textAlign: "left", marginTop: 18 }}>
          <h3>Your Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8 }}>
            <div style={{ opacity: 0.7 }}>Name</div><div style={{ fontWeight: 800 }}>{name}</div>
            <div style={{ opacity: 0.7 }}>Mobile</div><div style={{ fontWeight: 800 }}>+91 {mobile}</div>
            <div style={{ opacity: 0.7 }}>Amount</div><div style={{ fontWeight: 800 }}>₹{amount.toLocaleString("en-IN")}/-</div>
          </div>

          <h3 style={{ marginTop: 16 }}>Class Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 8 }}>
            <div style={{ opacity: 0.7 }}>Class</div><div style={{ fontWeight: 800 }}>Advance Level-1 Practical Class</div>
            <div style={{ opacity: 0.7 }}>Batch</div><div style={{ fontWeight: 800 }}>6th Batch</div>
            <div style={{ opacity: 0.7 }}>Date</div><div style={{ fontWeight: 800 }}>15th February 2026</div>
            <div style={{ opacity: 0.7 }}>Venue</div><div style={{ fontWeight: 800 }}>RV Towers, Guindy</div>
          </div>
        </div>

        <button
          onClick={() => nav("/")}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 12,
            borderRadius: 14,
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 900,
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
