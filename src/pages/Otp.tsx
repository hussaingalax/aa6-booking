import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Otp() {
  const nav = useNavigate();
  const name = localStorage.getItem("AA6_NAME") || "";
  const mobile = localStorage.getItem("AA6_MOBILE") || "";
  const devOtp = localStorage.getItem("AA6_DEV_OTP") || "";
  const createdAt = Number(localStorage.getItem("AA6_OTP_CREATED_AT") || "0");

  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");

  // OTP validity: 5 minutes
  const expiresInSec = 5 * 60;
  const [secondsLeft, setSecondsLeft] = useState(expiresInSec);

  useEffect(() => {
    if (!mobile) nav("/");
  }, [mobile, nav]);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, Math.ceil((createdAt + expiresInSec * 1000 - Date.now()) / 1000));
      setSecondsLeft(diff);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [createdAt]);

  const expired = secondsLeft <= 0;

  const canVerify = useMemo(() => /^\d{4}$/.test(otp), [otp]);

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
        <h2 style={{ margin: 0 }}>Verify OTP</h2>
        <p style={{ marginTop: 6, opacity: 0.7 }}>
          Enter the 4-digit code for <b>+91 {mobile}</b>
        </p>

        {/* DEV OTP highlight */}
        <div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <div style={{ fontSize: 12, opacity: 0.7, fontWeight: 800 }}>TEMP OTP (WhatsApp connect later)</div>
          <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 6 }}>
              {devOtp || "----"}
            </div>
            <div style={{ fontWeight: 900, background: expired ? "#e5e7eb" : "#fee2e2", padding: "6px 10px", borderRadius: 999 }}>
              ⏱ {expired ? "00:00" : formatMMSS(secondsLeft)}
            </div>
          </div>
        </div>

        <input
          value={otp}
          onChange={(e) => {
            setErr("");
            setOtp(e.target.value.replace(/\D/g, "").slice(0, 4));
          }}
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

        {err && <div style={{ marginTop: 10, color: "#dc2626", fontWeight: 800 }}>{err}</div>}

        <button
          disabled={!canVerify || expired}
          onClick={() => {
            if (expired) {
              setErr("OTP expired. Please resend OTP.");
              return;
            }
            if (otp !== devOtp) {
              setErr("Wrong OTP. Please enter correct OTP.");
              return;
            }
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
            cursor: !canVerify || expired ? "not-allowed" : "pointer",
            opacity: !canVerify || expired ? 0.6 : 1,
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
            onClick={() => {
              const newOtp = String(Math.floor(1000 + Math.random() * 9000));
              localStorage.setItem("AA6_DEV_OTP", newOtp);
              localStorage.setItem("AA6_OTP_CREATED_AT", String(Date.now()));
              setOtp("");
              setErr("");
            }}
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
