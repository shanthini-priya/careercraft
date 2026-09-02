import C from "../../constants/colors";

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: C.surface, borderRadius: 16,
      border: `1px solid ${C.border}`,
      padding: "24px 28px", ...style,
    }}>{children}</div>
  );
}

export default Card;
