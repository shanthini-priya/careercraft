import { useState } from "react";
import C from "../../constants/colors";
import NavLink from "../ui/NavLink";
import Btn from "../ui/Btn";

function Navbar({ nav, route }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    ["#home", "Home"], ["#features", "Features"],
    ["#how", "How It Works"], ["#templates", "Templates"],
  ];
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid #E5E7EB",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 64, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => nav("#home")}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, #EC4899)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <span style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>C</span>
            <svg style={{ position: "absolute", top: -3, right: -3 }} width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 0 L5.6 3.4 L9 4 L5.6 4.6 L5 8 L4.4 4.6 L1 4 L4.4 3.4 Z" fill="#FBBF24"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#111827" }}>CareerCraft</span>
        </div>

        <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} nav={nav} current={route}>{label}</NavLink>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="outline" small onClick={() => nav("#login")}>Log in</Btn>
          <Btn variant="primary" small onClick={() => nav("#register")}>Get started</Btn>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
