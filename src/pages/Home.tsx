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
        <div style={{ fontWeight: 900, fontSize: 18 }}>Arithuyil Arivom • Advance Level-1</div>
        <div style={{ opacity: 0.95, marginTop: 4, fontWeight: 800 }}>6th Batch Registration</div>

        <div
          style={{
            marginTop: 10,
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

          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ fontWeight: 900 }}>
              <span style={{ opacity: 0.95 }}>Original: </span>
              <span style={{ textDecoration: "line-through", opacity: 0.95 }}>₹22,000</span>
            </div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Now: ₹8,500</div>
          </div>

          <div style={{ marginTop: 10, padding: 10, borderRadius: 12, background: "rgba(255,255,255,0.14)" }}>
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

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.95 }}>
            For details call: <b>9840851295</b>
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
