import { useState, useEffect } from "react";
import Card from "../ui/Card";
import C from "../../constants/colors";

function AssetBarChart() {
  const bars = [
    { label: "Portfolio", value: 1, color: C.indigo[400] },
    { label: "Resume", value: 3, color: C.violet[400] },
    { label: "LinkedIn", value: 2, color: C.teal[400] },
    { label: "GitHub", value: 1, color: C.amber[400] },
    { label: "Cover Ltr", value: 2, color: C.coral[400] },
    { label: "Score", value: 5, color: C.indigo[600] },
  ];
  const [heights, setHeights] = useState(bars.map(() => 0));
  useEffect(() => {
    const t = setTimeout(() => setHeights(bars.map(b => b.value)), 60);
    return () => clearTimeout(t);
  }, []);
  const max = Math.max(...bars.map(b => b.value));
  return (
    <Card>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 14 }}>Assets Generated</h3>
      <div style={{ display: "flex", alignItems: "flex-end", height: 180, gap: 24 }}>
        {bars.map((b, i) => {
          const h = (heights[i] / max) * 150;
          return (
            <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ height: 170, display: "flex", alignItems: "flex-end", width: "100%" }}>
                <div style={{
                  width: "100%", height: h, background: b.color, borderRadius: "8px 8px 0 0",
                  display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 8,
                  transition: "height 0.6s ease",
                }}>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{b.value}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#64748B", marginTop: 8, textAlign: "center" }}>{b.label}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default AssetBarChart;