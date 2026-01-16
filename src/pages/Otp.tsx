import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Otp() {
  const nav = useNavigate();
  const name = localStorage.getItem("AA6_NAME") || "";
  const mobile = localStorage.getItem("AA6_MOBILE") || "";
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!mobile) nav("/");
  }, [mobile, nav]);

  const canVerify = /^\d{4}$/.test(otp);

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
        <h2 style={{ margin: 0 }}>Verify OTP</h2>
        <p style={{ marginTop: 6, opacity: 0.7 }}>
          Enter the 4-digit code sent to <b>+91 {mobile}</b>
        </p>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
          placeholder="____"
          style={{
            width: "100%",
            marginTop: 14,
            padding: 14,
            borderRadius: 14,
            border: "2px solid #22c55e",
            fontSize: 22,
            letterSpacing: 10,
            textAlign: "center",
          }}
        />

        <button
          disabled={!canVerify}
          onClick={() => {
            // for now: accept any 4 digits (Step C will validate via WhatsApp)
            localStorage.setItem("AA6_OTP_VERIFIED", "yes");
            nav("/offer");
          }}
          style={{
            width: "100%",
            marginTop: 14,
            padding: 14,
            borderRadius: 14,
            border: "none",
            fontWeight: 900,
            fontSize: 16,
            cursor: canVerify ? "pointer" : "not-allowed",
            opacity: canVerify ? 1 : 0.6,
            background: "#16a34a",
            color: "#fff",
          }}
        >
          Verify & Continue
        </button>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 13 }}>
          <button onClick={() => nav("/")} style={{ background: "transparent", border: "none", color: "#334155", cursor: "pointer" }}>
            ← Change Number
          </button>
          <button
            onClick={() => alert("Step C: WhatsApp resend OTP will be added")}
            style={{ background: "transparent", border: "none", color: "#2563eb", cursor: "pointer" }}
          >
            Resend OTP
          </button>
        </div>

        <div style={{ marginTop: 10, opacity: 0.6, fontSize: 12 }}>
          Activated for <b>{name || "user"}</b>
        </div>
      </div>
    </div>
  );
}
