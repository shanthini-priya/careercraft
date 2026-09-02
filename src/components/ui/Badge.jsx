import C from "../../constants/colors";

function Badge({ children, color = "indigo" }) {
  const map = {
    indigo: { bg: C.indigo[50], text: C.indigo[400] },
    teal:   { bg: C.teal[50],   text: C.teal[400] },
    violet: { bg: C.violet[50], text: C.violet[400] },
    amber:  { bg: C.amber[50],  text: C.amber[400] },
    coral:  { bg: C.coral[50],  text: C.coral[400] },
  };
  return (
    <span style={{
      background: map[color].bg, color: map[color].text,
      fontSize: 12, fontWeight: 600, borderRadius: 999,
      padding: "3px 11px", display: "inline-block",
    }}>{children}</span>
  );
}

export default Badge;
