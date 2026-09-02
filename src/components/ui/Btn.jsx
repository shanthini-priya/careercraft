import C from "../../constants/colors";

function Btn({ children, variant = "primary", onClick, small, href }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    fontWeight: 600, borderRadius: 10, cursor: "pointer",
    textDecoration: "none", border: "none", transition: "all 0.18s",
    fontSize: small ? 13 : 15, padding: small ? "8px 18px" : "13px 28px",
  };
  const styles = {
    primary: { background: `linear-gradient(135deg, ${C.indigo[600]}, ${C.violet[600]}, ${C.violet[400]})`, color: "#fff" },
    outline:  { background: "transparent", color: C.indigo[400], border: `1.5px solid ${C.indigo[400]}` },
    ghost:    { background: "rgba(255,255,255,0.08)", color: "#CBD5E1", border: "none" },
    teal:     { background: `linear-gradient(135deg, ${C.cyan[400]}, ${C.teal[400]})`, color: "#fff" },
  };
  const style = { ...base, ...styles[variant] };
  const Tag = href ? "a" : "button";
  return <Tag style={style} onClick={onClick} href={href}>{children}</Tag>;
}

export default Btn;
