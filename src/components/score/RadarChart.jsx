import { useState, useEffect } from "react";
import C from "../../constants/colors";

function RadarChart() {
  const dims = [
    { label: "Profile Completeness", value: 87 },
    { label: "Content Quality", value: 78 },
    { label: "Keyword Optimization", value: 72 },
    { label: "Visual Appeal", value: 90 },
    { label: "Recruiter Readiness", value: 78 },
  ];
  const size = 260, cx = size / 2, cy = size / 2;
  const R = size / 2 - 30;
  const n = dims.length;

  const point = (i, r) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", margin: "0 auto" }}>
      {[0.25, 0.5, 0.75, 1].map(f => (
        <polygon key={f} points={dims.map((_, i) => point(i, R * f).join(",")).join(" ")} fill="none" stroke="#E5E7EB" strokeWidth={1}/>
      ))}
      {dims.map((_, i) => {
        const [x, y] = point(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E5E7EB" strokeWidth={1}/>;
      })}
      <polygon points={dims.map((_, i) => point(i, R * dims[i].value / 100).join(",")).join(" ")} fill={C.indigo[400]} opacity={0.3} stroke={C.indigo[600]} strokeWidth={2}/>
      {dims.map((d, i) => {
        const [x, y] = point(i, R * d.value / 100);
        return <circle key={i} cx={x} cy={y} r={3.5} fill={C.indigo[600]}/>;
      })}
      {dims.map((d, i) => {
        const [x, y] = point(i, R + 18);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" fontSize={10} fill="#64748B" fontWeight={600}>{d.label.split(" ")[0]} {d.value}</text>
        );
      })}
    </svg>
  );
}

export default RadarChart;