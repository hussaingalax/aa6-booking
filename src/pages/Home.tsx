import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const canContinue = name.trim().length >= 2 && /^\d{10}$/.test(mobile);

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
        <h2 style={{ margin: 0 }}>Welcome</h2>
        <p style={{ marginTop: 6, opacity: 0.7 }}>Enter your details to continue</p>

        <label style={{ display: "block", marginTop: 16, fontWeight: 700 }}>Your Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your full name"
          style={{ width: "100%", marginTop: 8, padding: 12, borderRadius: 12, border: "1px solid #e5e7eb" }}
        />

        <label style={{ display: "block", marginTop: 16, fontWeight: 700 }}>Mobile Number</label>
        <div style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 10, marginTop: 8 }}>
          <div style={{ padding: 12, borderRadius: 12, border: "1px solid #e5e7eb", background: "#f9fafb", textAlign: "center" }}>
            +91
          </div>
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="Enter 10-digit number"
            style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #e5e7eb" }}
          />
        </div>

        <div style={{ marginTop: 14, padding: 14, borderRadius: 14, border: "1px solid #fde68a", background: "#fff7ed", textAlign: "center" }}>
          ✨ This special offer is unlocked only for you
        </div>

        <button
          disabled={!canContinue}
          onClick={() => {
  localStorage.setItem("AA6_NAME", name.trim());
  localStorage.setItem("AA6_MOBILE", mobile);

  const generatedOtp = String(Math.floor(1000 + Math.random() * 9000));
  localStorage.setItem("AA6_DEV_OTP", generatedOtp);
  localStorage.setItem("AA6_OTP_CREATED_AT", String(Date.now()));

  nav("/otp");
}}

          style={{
            width: "100%",
            marginTop: 14,
            padding: 14,
            borderRadius: 14,
            border: "none",
            fontWeight: 900,
            fontSize: 16,
            cursor: canContinue ? "pointer" : "not-allowed",
            opacity: canContinue ? 1 : 0.6,
            background: "#4f46e5",
            color: "#fff",
          }}
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}
