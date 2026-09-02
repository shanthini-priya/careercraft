import Card from "../ui/Card";
import C from "../../constants/colors";

function ScoreTrendChart() {
  const data = [72, 74, 75, 78, 79, 81, 82];
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const W = 720, H = 200, P = 34;
  const max = 100, min = 60;
  const innerW = W - P * 2, innerH = H - P * 2;
  const x = i => P + (i / (data.length - 1)) * innerW;
  const y = v => P + innerH - ((v - min) / (max - min)) * innerH;
  const pts = data.map((v, i) => [x(i), y(v)]);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const [first, ...rest] = pts;
  const smooth = `M${first[0].toFixed(1)},${first[1].toFixed(1)} ` + rest.map((p, i) => {
    const prev = pts[i];
    const cx = (prev[0] + p[0]) / 2;
    return `C${cx},${prev[1].toFixed(1)} ${cx},${p[1].toFixed(1)} ${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  }).join(" ");
  const area = `${smooth} L${x(data.length - 1).toFixed(1)},${P + innerH} L${P},${P + innerH} Z`;
  const gridY = [60, 70, 80, 90, 100];
  return (
    <Card>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 14 }}>Portfolio Score Trend</h3>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.indigo[400]} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={C.indigo[400]} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {gridY.map(g => (
          <g key={g}>
            <line x1={P} y1={y(g)} x2={W - P} y2={y(g)} stroke="#F1F5F9" strokeWidth={1}/>
            <text x={P - 6} y={y(g) + 3} textAnchor="end" fontSize={10} fill="#94A3B8">{g}</text>
          </g>
        ))}
        {data.map((v, i) => (
          <text key={i} x={x(i)} y={H - 10} textAnchor="middle" fontSize={11} fill="#94A3B8">{labels[i]}</text>
        ))}
        <path d={area} fill="url(#lineFill)"/>
        <path d={smooth} fill="none" stroke={C.indigo[600]} strokeWidth={2.5} strokeLinecap="round"/>
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p[0]} cy={p[1]} r={4.5} fill="#fff" stroke={C.indigo[600]} strokeWidth={2}/>
          </g>
        ))}
      </svg>
    </Card>
  );
}

export default ScoreTrendChart;