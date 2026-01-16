import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Otp from "./pages/Otp";
import Offer from "./pages/Offer";
import Pay from "./pages/Pay";
import Success from "./pages/Success";

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#f7fafc" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/offer" element={<Offer />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="/success" element={<Success />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
