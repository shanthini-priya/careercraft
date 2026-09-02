import { useState } from "react";
import C from "../../constants/colors";
import Card from "../ui/Card";

function RegisterPage({ nav }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); nav("#onboarding"); }, 1200);
  };
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", padding: 24 }}>
      <Card style={{ width: "100%", maxWidth: 420, padding: 40 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, #EC4899)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", position: "relative" }}>
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>C</span>
            <svg style={{ position: "absolute", top: -2, right: -2 }} width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 0 L5.6 3.4 L9 4 L5.6 4.6 L5 8 L4.4 4.6 L1 4 L4.4 3.4 Z" fill="#FBBF24"/>
            </svg>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: 22, color: "#0F172A", margin: 0 }}>Create your account</h2>
          <p style={{ color: "#64748B", fontSize: 14, marginTop: 6 }}>Start building your professional identity</p>
        </div>
        {[["name","Full name","Alex Johnson"], ["email","Email","you@example.com"], ["password","Password","••••••••"], ["confirm","Confirm password","••••••••"]].map(([field, label, placeholder]) => (
          <div key={field} style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>{label}</label>
            <input
              type={field.includes("pass") || field === "confirm" ? "password" : "text"}
              placeholder={placeholder}
              value={form[field]}
              onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, boxSizing: "border-box", outline: "none" }}
            />
          </div>
        ))}
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 10, background: loading ? "#94A3B8" : `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: 6 }}>
          {loading ? "Creating account…" : "Create my account"}
        </button>
        <div style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: "#64748B" }}>
          Already have an account?{" "}
          <span onClick={() => nav("#login")} style={{ color: C.indigo[600], fontWeight: 600, cursor: "pointer" }}>Sign in</span>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;
