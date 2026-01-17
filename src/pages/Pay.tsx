import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { supabase } from "../lib/supabase";

function buildUpiUri(pa: string, pn: string, am: number, tn: string) {
  // IMPORTANT: keep it simple and properly encoded
  const params = new URLSearchParams({
    pa,
    pn,
    am: String(am),
    cu: "INR",
    tn,
  });
  return `upi://pay?${params.toString()}`;
}

function normalizeMobile(m: string) {
  return (m || "").replace(/\D/g, "").slice(-10);
}

function isMobileDevice() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export default function Pay() {
  const nav = useNavigate();

  const name = localStorage.getItem("AA6_NAME") || "user";
  const mobileRaw = localStorage.getItem("AA6_MOBILE") || "";
  const mobile = normalizeMobile(mobileRaw);

  const UPI_ID = "trueselfmindgym@okicici";
  const PAYEE_NAME = "Arithuyil Arivom";

  const TEST_NUMBER = "9789489288";
  const amount = mobile === TEST_NUMBER ? 1 : 8500;

  const note = `AA6 Payment for ${name}`;

  const upiUri = useMemo(
    () => buildUpiUri(UPI_ID, PAYEE_NAME, amount, note),
    [UPI_ID, PAYEE_NAME, amount, note]
  );

  const [txn, setTxn] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // Optional: show hint if user is on desktop
  const [hint, setHint] = useState<string>("");

  useEffect(() => {
    setHint(isMobileDevice() ? "" : "Tip: Use your phone to open UPI apps directly. Desktop is best for QR scan only.");
  }, []);

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

  const canSubmit = txn.trim().length >= 6 && !!file && !busy;

  function openUpi() {
    setErr("");

    // MUST be called from a user click to avoid popup blocking
    try {
      // Some Android browsers behave better with location.assign than anchor href
      window.location.assign(upiUri);

      // If app doesn't open, user can still copy UPI ID / scan QR.
      // We don't show "error" immediately because browser can't confirm failure.
    } catch {
      setErr("Unable to open UPI app. Please copy UPI ID and pay manually, then upload screenshot + UTR.");
    }
  }

  function copyText(text: string, okMsg?: string) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        if (okMsg) setHint(okMsg);
      })
      .catch(() => {
        // fallback prompt
        try {
          // @ts-ignore
          window.prompt("Copy this:", text);
        } catch {}
      });
  }

  // App specific intents (Android)
  // NOTE: These help when generic upi://pay gets intercepted weirdly.
  const gpayIntent = useMemo(() => `intent://${upiUri.replace("upi://", "")}#Intent;scheme=upi;package=com.google.android.apps.nbu.paisa.user;end`, [upiUri]);
  const phonePeIntent = useMemo(() => `intent://${upiUri.replace("upi://", "")}#Intent;scheme=upi;package=com.phonepe.app;end`, [upiUri]);
  const paytmIntent = useMemo(() => `intent://${upiUri.replace("upi://", "")}#Intent;scheme=upi;package=net.one97.paytm;end`, [upiUri]);

  async function confirmPayment() {
    setErr("");
    if (!file) return setErr("Please upload payment screenshot.");
    if (txn.trim().length < 6) return setErr("Please enter valid Transaction ID / UTR.");

    try {
      setBusy(true);

      // 1) upload screenshot to Supabase Storage
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const safeExt = ["png", "jpg", "jpeg", "webp"].includes(ext) ? ext : "jpg";
      const path = `aa6/${Date.now()}-${mobile}-${Math.random().toString(16).slice(2)}.${safeExt}`;

      const up = await supabase.storage.from("aa6-screenshots").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (up.error) throw up.error;

      const pub = supabase.storage.from("aa6-screenshots").getPublicUrl(path);
      const screenshotUrl = pub.data.publicUrl;

      // 2) insert booking row
      const ins = await supabase
        .from("aa6_bookings")
        .insert({
          name,
          mobile,
          amount,
          txn_id: txn.trim(),
          screenshot_url: screenshotUrl,
          status: "pending",
        })
        .select("id")
        .single();

      if (ins.error) throw ins.error;

      localStorage.setItem("AA6_BOOKING_ID", ins.data.id);
      nav("/success");
    } catch (e: any) {
      setErr(e?.message || "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 20 }}>
      <button
        onClick={() => nav("/offer")}
        style={{ background: "transparent", border: "none", cursor: "pointer", marginBottom: 10 }}
      >
        ← Back to offer
      </button>

      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 16,
          border: "1px solid #eef2f7",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 10,
            alignItems: "center",
            padding: 12,
            borderRadius: 14,
            background: "#ecfdf5",
            border: "1px solid #bbf7d0",
          }}
        >
          ✅{" "}
          <div>
            <b>100% Safe & Verified Payment</b>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Your payment is secure and encrypted</div>
          </div>
        </div>

        <h2 style={{ textAlign: "center", marginTop: 16 }}>Payment Amount for {name}</h2>
        <div style={{ textAlign: "center", fontSize: 36, fontWeight: 900 }}>₹{amount.toLocaleString("en-IN")}/-</div>

        {hint && (
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75, textAlign: "center" }}>
            {hint}
          </div>
        )}

        <div style={{ marginTop: 14, padding: 12, borderRadius: 14, border: "1px dashed #cbd5e1", background: "#f8fafc" }}>
          <div style={{ fontWeight: 800 }}>Scan & Pay — UPI Payment</div>

          <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}>
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="UPI QR"
                style={{ width: 220, height: 220, borderRadius: 14, border: "1px solid #e5e7eb", background: "#fff", padding: 10 }}
              />
            ) : (
              <div
                style={{
                  width: 220,
                  height: 220,
                  borderRadius: 14,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                Generating QR...
              </div>
            )}
          </div>

          <div style={{ marginTop: 12, fontWeight: 800 }}>UPI ID</div>
          <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
            <div style={{ wordBreak: "break-all" }}>{UPI_ID}</div>
            <button
              onClick={() => copyText(UPI_ID, "UPI ID copied. Paste it in your UPI app and pay.")}
              style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 10px", cursor: "pointer", background: "#fff", fontWeight: 800 }}
            >
              Copy
            </button>
          </div>

          {/* IMPORTANT: Use button click instead of anchor href */}
          <button
            onClick={openUpi}
            style={{
              width: "100%",
              marginTop: 12,
              padding: 12,
              borderRadius: 14,
              border: "none",
              fontWeight: 900,
              cursor: "pointer",
              background: "#111827",
              color: "#fff",
            }}
          >
            Pay using UPI App (Open Now)
          </button>

          {/* Fallbacks for Android */}
          <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
            <button
              onClick={() => window.location.assign(gpayIntent)}
              style={{ width: "100%", padding: 12, borderRadius: 14, border: "1px solid #e5e7eb", fontWeight: 900, cursor: "pointer", background: "#fff" }}
            >
              Open in Google Pay
            </button>
            <button
              onClick={() => window.location.assign(phonePeIntent)}
              style={{ width: "100%", padding: 12, borderRadius: 14, border: "1px solid #e5e7eb", fontWeight: 900, cursor: "pointer", background: "#fff" }}
            >
              Open in PhonePe
            </button>
            <button
              onClick={() => window.location.assign(paytmIntent)}
              style={{ width: "100%", padding: 12, borderRadius: 14, border: "1px solid #e5e7eb", fontWeight: 900, cursor: "pointer", background: "#fff" }}
            >
              Open in Paytm
            </button>
            <button
              onClick={() => copyText(upiUri, "UPI payment link copied. You can paste it in notes/WhatsApp and open.")}
              style={{ width: "100%", padding: 12, borderRadius: 14, border: "1px solid #e5e7eb", fontWeight: 900, cursor: "pointer", background: "#fff" }}
            >
              Copy UPI Payment Link
            </button>
          </div>

          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75, lineHeight: 1.4 }}>
            Note: ₹2,000 limit applies only when paying by selecting a QR image from gallery in some UPI apps. Using the buttons above opens UPI payment directly, which supports higher amounts.
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
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} style={{ width: "100%", marginTop: 8 }} />
        {file && (
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
            Selected: <b>{file.name}</b>
          </div>
        )}

        {err && <div style={{ marginTop: 12, color: "#dc2626", fontWeight: 800 }}>{err}</div>}

        <button
          onClick={confirmPayment}
          disabled={!canSubmit}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 14,
            borderRadius: 14,
            border: "none",
            fontWeight: 900,
            fontSize: 16,
            cursor: canSubmit ? "pointer" : "not-allowed",
            opacity: canSubmit ? 1 : 0.6,
            background: "#10b981",
            color: "#fff",
          }}
        >
          {busy ? "Submitting..." : "Confirm Payment"}
        </button>

        <div style={{ marginTop: 10, textAlign: "center", fontSize: 12, opacity: 0.7 }}>
          Need help? Contact: 9789489288
        </div>
      </div>
    </div>
  );
}
