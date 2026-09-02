import C from "../../constants/colors";

function Footer({ nav }) {
  return (
    <footer style={{ background: "#0F172A", padding: "48px 24px 32px", color: "#94A3B8" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, #EC4899)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <span style={{ color: "#fff", fontSize: 15, fontWeight: 800 }}>C</span>
                <svg style={{ position: "absolute", top: -3, right: -3 }} width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M5 0 L5.6 3.4 L9 4 L5.6 4.6 L5 8 L4.4 4.6 L1 4 L4.4 3.4 Z" fill="#FBBF24"/>
                </svg>
              </div>
              <span style={{ fontWeight: 700, fontSize: 16, color: "#fff" }}>CareerCraft</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
              Your Career, Crafted by AI — Transform your skills and experiences into a complete professional identity.
            </p>
          </div>
          {[["Product", ["Features", "Templates", "Pricing", "Changelog"]], ["Resources", ["Documentation", "Blog", "Career tips", "FAQ"]], ["Company", ["About", "Contact", "Privacy", "Terms"]]].map(([col, items]) => (
            <div key={col}>
              <div style={{ fontWeight: 600, fontSize: 14, color: "#fff", marginBottom: 14 }}>{col}</div>
              {items.map(i => (
                <div key={i} style={{ fontSize: 14, marginBottom: 10, cursor: "pointer" }}>{i}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid #1E293B", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13 }}>© 2025 CareerCraft. Your Career, Crafted by AI.</span>
          <span style={{ fontSize: 13 }}>Made by your team · Innovation Lab Project</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
