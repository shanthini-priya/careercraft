import C from "../../constants/colors";

function NavLink({ to, children, nav, current }) {
  const active = current === to;
  return (
    <a
      href={to}
      onClick={(e) => { e.preventDefault(); nav(to); }}
      style={{
        fontSize: 14, fontWeight: active ? 600 : 400,
        color: active ? C.indigo[400] : "#94A3B8",
        textDecoration: "none", padding: "6px 0",
        borderBottom: active ? `2px solid ${C.indigo[400]}` : "2px solid transparent",
        transition: "all 0.18s",
      }}
    >{children}</a>
  );
}

export default NavLink;
