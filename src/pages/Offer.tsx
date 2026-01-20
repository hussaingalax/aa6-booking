import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function formatMMSS(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Offer() {
  const nav = useNavigate();
  const name = localStorage.getItem("AA6_NAME") || "user";
  const mobile = localStorage.getItem("AA6_MOBILE") || "";

  const originalPrice = 22000;
  const offerPrice = 8500;

  const storageKey = useMemo(() => "AA6_OFFER_EXPIRES_AT", []);
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);

  useEffect(() => {
    if (!mobile) nav("/");
  }, [mobile, nav]);

  useEffect(() => {
    const now = Date.now();
    const saved = localStorage.getItem(storageKey);

    let expiresAt = saved ? Number(saved) : 0;
    if (!expiresAt || Number.isNaN(expiresAt) || expiresAt < now) {
      expiresAt = now + 5 * 60 * 1000;
      localStorage.setItem(storageKey, String(expiresAt));
    }

    const tick = () => {
      const diff = Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000));
      setSecondsLeft(diff);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [storageKey]);

  const expired = secondsLeft <= 0;

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 20 }}>
      <div style={{ background: "#16a34a", color: "#fff", borderRadius: 18, padding: 18, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Arithuyil Arivom • Advance Level-1</div>
        <div style={{ marginTop: 6, opacity: 0.9 }}>6th Batch Registration • Activated for {name}</div>
      </div>

      <div style={{ margin: "14px auto 10px", width: 140, padding: "10px 14px", borderRadius: 999, textAlign: "center", fontWeight: 900, fontSize: 18, background: expired ? "#e5e7eb" : "#fee2e2" }}>
        ⏱ {expired ? "00:00" : formatMMSS(secondsLeft)}
      </div>

      <div style={{ background: "#fff", borderRadius: 18, padding: 16, border: "1px solid #eef2f7", boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 10, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Original Price</div>
            <div style={{ marginTop: 6, fontSize: 20, textDecoration: "line-through", opacity: 0.55, fontWeight: 900 }}>
              ₹{originalPrice.toLocaleString("en-IN")}/-
            </div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, opacity: 0.5 }}>→</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Your Price</div>
            <div style={{ marginTop: 6, fontSize: 28, fontWeight: 900, color: "#16a34a" }}>
              ₹{offerPrice.toLocaleString("en-IN")}/-
            </div>
            <div style={{ marginTop: 10, display: "inline-block", padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: 900, background: "#dcfce7" }}>
              You Save ₹{(originalPrice - offerPrice).toLocaleString("en-IN")}/-
            </div>
          </div>
        </div>

        <h3 style={{ marginTop: 18, marginBottom: 10, textAlign: "center" }}>Class Details</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ padding: 12, borderRadius: 14, background: "#f8fafc", border: "1px solid #eef2f7" }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Date</div>
            <div style={{ fontWeight: 900, marginTop: 4 }}>15th Feb 2026 (Sunday)</div>
          </div>
          <div style={{ padding: 12, borderRadius: 14, background: "#f8fafc", border: "1px solid #eef2f7" }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Venue</div>
            <div style={{ fontWeight: 900, marginTop: 4 }}>RV Towers, Guindy</div>
<a
  href="https://maps.app.goo.gl/NCruiwkWrxryVjrA8"
  target="_blank"
  rel="noreferrer"
  style={{ display: "inline-block", marginTop: 6, fontWeight: 900, fontSize: 12 }}
>
  View Map
</a>
          </div>
          <div style={{ padding: 12, borderRadius: 14, background: "#f8fafc", border: "1px solid #eef2f7" }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Eligibility</div>
            <div style={{ fontWeight: 900, marginTop: 4 }}>Existing Students</div>
          </div>
          <div style={{ padding: 12, borderRadius: 14, background: "#f8fafc", border: "1px solid #eef2f7" }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Mode</div>
            <div style={{ fontWeight: 900, marginTop: 4 }}>Offline</div>
          </div>
        </div>

        <div style={{ marginTop: 12, padding: 12, borderRadius: 14, background: "#fff7ed", border: "1px solid #fde68a", textAlign: "center", fontWeight: 800 }}>
          ⚠️ Advance Level-1 – 6th Batch • Limited Seats Only
        </div>

        <button
          disabled={expired}
          onClick={() => nav("/pay")}
          style={{
            width: "100%",
            marginTop: 14,
            padding: 14,
            borderRadius: 14,
            border: "none",
            fontWeight: 900,
            fontSize: 16,
            cursor: expired ? "not-allowed" : "pointer",
            opacity: expired ? 0.6 : 1,
            background: expired ? "#94a3b8" : "#16a34a",
            color: "#fff",
          }}
        >
          {expired ? "Offer Expired" : `Book Now at ₹${offerPrice.toLocaleString("en-IN")}/-`}
        </button>

        <div style={{ marginTop: 10, textAlign: "center", fontSize: 12, opacity: 0.7 }}>
          Secure booking • 100% safe payment
        </div>
      </div>
    </div>
  );
}
