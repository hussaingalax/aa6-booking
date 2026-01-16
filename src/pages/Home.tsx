import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const canContinue = name.trim().length >= 2 && /^\d{10}$/.test(mobile);

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 20 }}>
      {/* Info Card */}
      <div
        style={{
          background: "linear-gradient(135deg, #16a34a 0%, #0ea5e9 100%)",
          borderRadius: 18,
          padding: 16,
          color: "#fff",
          boxShadow: "0 10px 25px rgba(0,0,0,0.10)",
          marginBottom: 14,
        }}
      >
        {/* Title */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span
            style={{
              fontWeight: 1000,
              fontSize: 20,
              padding: "6px 12px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.22)",
              border: "1px solid rgba(255,255,255,0.30)",
              letterSpacing: 0.5,
            }}
          >
            ARITHUYIL ARIVOM
          </span>

          <span style={{ fontWeight: 900, fontSize: 16, opacity: 0.98 }}>
            Advance Level-1 • 6th Batch Registration
          </span>
        </div>

        <div
          style={{
            marginTop: 12,
            background: "rgba(255,255,255,0.16)",
            border: "1px solid rgba(255,255,255,0.25)",
            padding: 12,
            borderRadius: 14,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>Date</div>
              <div style={{ fontWeight: 900 }}>1st Feb 2026 (Sunday)</div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>Time</div>
              <div style={{ fontWeight: 900 }}>9 AM to 7 PM</div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>Venue</div>
              <div style={{ fontWeight: 900 }}>RV Towers, Guindy</div>
            </div>
            <div>
              <div style={{ fontSize: 12, opacity: 0.9 }}>Mode</div>
              <div style={{ fontWeight: 900 }}>Offline</div>
            </div>
          </div>

          {/* Topics */}
          <div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: "rgba(255,255,255,0.14)" }}>
            <div style={{ fontWeight: 900 }}>Topics Covered (Completely Practical)</div>
            <ol style={{ marginTop: 8, marginBottom: 0, paddingLeft: 18, lineHeight: 1.5 }}>
              <li>Self Hypnotism</li>
              <li>Different methods of taking to hypnotic Stage</li>
              <li>Pendulum programming</li>
              <li>Trigger for Instant Confidence</li>
              <li>Tiles Break Using Bulb</li>
              <li>Bring anyone&apos;s talent in you</li>
              <li>Negative Deletion</li>
              <li>...and much more</li>
            </ol>
          </div>

          {/* Contact highlight */}
          <div
            style={{
              marginTop: 12,
              padding: 12,
              borderRadius: 14,
              background: "rgba(0,0,0,0.18)",
              border: "1px solid rgba(255,255,255,0.25)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontWeight: 1000, fontSize: 16 }}>Ayyappan Leelaram</div>
            <div style={{ fontWeight: 1000, fontSize: 18 }}>9840851295</div>
          </div>
        </div>
      </div>

      {/* Login Card */}
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

        <div style={{ marginTop: 14, padding: 14, borderRadius: 14, border: "1px solid #fde68a", background: "#fff7ed", textAlign: "center", fontWeight: 800 }}>
          Limited seats. Complete your registration now.
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
