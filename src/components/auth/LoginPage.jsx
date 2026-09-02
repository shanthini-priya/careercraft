import { useState } from "react";
import C from "../../constants/colors";
import Card from "../ui/Card";

function LoginPage({ nav }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); nav("#dashboard"); }, 1200);
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
          <h2 style={{ fontWeight: 800, fontSize: 22, color: "#0F172A", margin: 0 }}>Welcome back</h2>
          <p style={{ color: "#64748B", fontSize: 14, marginTop: 6 }}>Sign in to your account</p>
        </div>
        {["email", "password"].map(field => (
          <div key={field} style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              {field === "email" ? "Email" : "Password"}
            </label>
            <input
              type={field}
              placeholder={field === "email" ? "you@example.com" : "••••••••"}
              value={form[field]}
              onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1px solid #E2E8F0", fontSize: 14, boxSizing: "border-box", outline: "none" }}
            />
          </div>
        ))}
        <div style={{ textAlign: "right", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: C.indigo[600], cursor: "pointer", fontWeight: 500 }}>Forgot password?</span>
        </div>
        <button onClick={handleSubmit} disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 10, background: loading ? "#94A3B8" : `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})`, color: "#fff", fontWeight: 700, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#64748B" }}>
          Don't have an account?{" "}
          <span onClick={() => nav("#register")} style={{ color: C.indigo[600], fontWeight: 600, cursor: "pointer" }}>Create one</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#E2E8F0" }}/><span style={{ fontSize: 12, color: "#94A3B8" }}>or</span><div style={{ flex: 1, height: 1, background: "#E2E8F0" }}/>
        </div>
        <button onClick={handleSubmit} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "#fff", border: "1px solid #E2E8F0", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span style={{ fontSize: 18 }}>G</span> Continue with Google
        </button>
      </Card>
    </div>
  );
}

export default LoginPage;
