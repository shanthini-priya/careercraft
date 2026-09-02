import C from "../../constants/colors";

function CTASection({ nav }) {
  return (
    <section style={{ padding: "80px 24px", background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]})` }}>
      <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "#fff", marginBottom: 16 }}>Ready to build your professional identity?</h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", marginBottom: 36 }}>
          Join 2,400+ students and developers who created their portfolio in under 30 seconds.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => nav("#register")} style={{ background: "#fff", color: C.indigo[600], fontWeight: 700, fontSize: 16, padding: "14px 32px", borderRadius: 12, border: "none", cursor: "pointer" }}>
            Create my portfolio — free
          </button>
          <button onClick={() => nav("#how")} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600, fontSize: 16, padding: "14px 32px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.4)", cursor: "pointer" }}>
            See how it works
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
