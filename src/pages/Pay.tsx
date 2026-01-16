import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";

function buildUpiUri(pa: string, pn: string, am: number, tn: string) {
  const params = new URLSearchParams({ pa, pn, am: String(am), cu: "INR", tn });
  return `upi://pay?${params.toString()}`;
}

export default function Pay() {
  const nav = useNavigate();
  const name = localStorage.getItem("AA6_NAME") || "user";
  const mobile = localStorage.getItem("AA6_MOBILE") || "";

  const UPI_ID = "trueselfmindgym@okicici";
  const TEST_NUMBER = "9789489288";
  const amount = mobile === TEST_NUMBER ? 1 : 8500;

  const upiUri = useMemo(
    () => buildUpiUri(UPI_ID, "Arithuyil Arivom", amount, `AA6 Payment for ${name}`),
    [UPI_ID, amount, name]
  );

  const [txn, setTxn] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const url = await QRCode.toDataURL(upiUri, { margin: 1, scale: 8 });
        if (!cancelled) setQrDataUrl(url);
      } catch {
        if (!cancelled) setQrDataUrl("");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [upiUri]);

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 20 }}>
      <button onClick={() => nav("/offer")} style={{ background: "transparent", border: "none", cursor: "pointer", marginBottom: 10 }}>
        ← Back to offer
      </button>

      <div style={{ background: "#fff", borderRadius: 18, padding: 16, border: "1px solid #eef2f7", boxShadow: "0 10px 25px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: 12, borderRadius: 14, background: "#ecfdf5", border: "1px solid #bbf7d0" }}>
          ✅ <div><b>100% Safe & Verified Payment</b><div style={{ fontSize: 12, opacity: 0.7 }}>Your payment is secure and encrypted</div></div>
        </div>

        <h2 style={{ textAlign: "center", marginTop: 16 }}>Payment Amount for {name}</h2>
        <div style={{ textAlign: "center", fontSize: 36, fontWeight: 900 }}>₹{amount.toLocaleString("en-IN")}/-</div>

        {/* QR + UPI block */}
        <div style={{ marginTop: 14, padding: 12, borderRadius: 14, border: "1px dashed #cbd5e1", background: "#f8fafc" }}>
          <div style={{ fontWeight: 800 }}>Scan & Pay — 100% Safe UPI Payment</div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="UPI QR"
                style={{ width: 220, height: 220, borderRadius: 14, border: "1px solid #e5e7eb", background: "#fff", padding: 10 }}
              />
            ) : (
              <div style={{ width: 220, height: 220, borderRadius: 14, border: "1px solid #e5e7eb", background: "#fff", display: "grid", placeItems: "center" }}>
                Generating QR...
              </div>
            )}
          </div>

          <div style={{ marginTop: 12, fontWeight: 800 }}>UPI ID</div>
          <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
            <div style={{ wordBreak: "break-all" }}>{UPI_ID}</div>
            <button
              onClick={() => navigator.clipboard.writeText(UPI_ID)}
              style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 10px", cursor: "pointer", background: "#fff" }}
            >
              Copy
            </button>
          </div>

          <a href={upiUri} style={{ display: "inline-block", marginTop: 10, fontWeight: 900 }}>
            Pay using UPI app (click)
          </a>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
            Steps: Open GPay/PhonePe → Scan QR → Pay → Enter Transaction ID → Upload screenshot.
          </div>
        </div>

        <h3 style={{ marginTop: 16 }}>Transaction ID / UTR Number *</h3>
        <input
          value={txn}
          onChange={(e) => setTxn(e.target.value)}
          placeholder="Enter transaction ID from payment app"
          style={{ width: "100%", marginTop: 8, padding: 12, borderRadius: 12, border: "1px solid #e5e7eb" }}
        />

        <h3 style={{ marginTop: 16 }}>Upload Payment Screenshot *</h3>
        <div style={{ marginTop: 8, padding: 18, borderRadius: 14, border: "2px dashed #cbd5e1", textAlign: "center", opacity: 0.8 }}>
          (Next Step) Supabase Storage upload add பண்ணுவோம்
        </div>

        <button
          onClick={() => nav("/success")}
          disabled={txn.trim().length < 6}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 14,
            borderRadius: 14,
            border: "none",
            fontWeight: 900,
            fontSize: 16,
            cursor: txn.trim().length >= 6 ? "pointer" : "not-allowed",
            opacity: txn.trim().length >= 6 ? 1 : 0.6,
            background: "#10b981",
            color: "#fff",
          }}
        >
          Confirm Payment
        </button>

        <div style={{ marginTop: 10, textAlign: "center", fontSize: 12, opacity: 0.7 }}>
          Need help? Contact: 9789489288
        </div>
      </div>
    </div>
  );
}
