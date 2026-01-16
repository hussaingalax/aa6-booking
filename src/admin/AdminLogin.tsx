import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const nav = useNavigate();
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");

  const adminPin = import.meta.env.VITE_ADMIN_PIN || "7788";

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
        <h2 style={{ margin: 0 }}>Admin Login</h2>
        <p style={{ marginTop: 6, opacity: 0.7 }}>Enter PIN to continue</p>

        <label style={{ display: "block", marginTop: 16, fontWeight: 700 }}>PIN</label>
        <input
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 8))}
          placeholder="Enter PIN"
          style={{ width: "100%", marginTop: 8, padding: 12, borderRadius: 12, border: "1px solid #e5e7eb" }}
        />

        {err && <div style={{ marginTop: 12, color: "#dc2626", fontWeight: 800 }}>{err}</div>}

        <button
          onClick={() => {
            setErr("");
            if (pin === adminPin) {
              localStorage.setItem("AA6_ADMIN_OK", "1");
              nav("/admin");
              return;
            }
            setErr("Wrong PIN");
          }}
          style={{
            width: "100%",
            marginTop: 14,
            padding: 14,
            borderRadius: 14,
            border: "none",
            fontWeight: 900,
            fontSize: 16,
            cursor: "pointer",
            background: "#111827",
            color: "#fff",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}
