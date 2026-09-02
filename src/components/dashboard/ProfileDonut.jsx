import Card from "../ui/Card";
import C from "../../constants/colors";

function ProfileDonut() {
  const sections = [
    { label: "Personal", value: 100, color: C.indigo[400] },
    { label: "Skills", value: 90, color: C.violet[400] },
    { label: "Projects", value: 80, color: C.teal[400] },
    { label: "Experience", value: 60, color: C.amber[400] },
    { label: "Certs", value: 40, color: C.coral[400] },
  ];
  const size = 180, cx = size / 2, cy = size / 2;
  const radius = size / 2 - 20;
  return (
    <Card>
      <h3 style={{ fontWeight: 700, fontSize: 16, color: "#0F172A", marginBottom: 14 }}>Profile Completion Breakdown</h3>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#F1F5F9" strokeWidth={16}/>
          {sections.map(s => (
            <circle key={s.label} cx={cx} cy={cy} r={radius} fill="none" stroke={s.color} strokeWidth={16}
              strokeDasharray={`${s.value} ${100 - s.value}`}
              strokeLinecap="round"
              transform={`rotate(${sections.indexOf(s) * (360 / sections.length) - 90} ${cx} ${cy})`}
            />
          ))}
          <text x="50%" y="47%" textAnchor="middle" fontSize={22} fontWeight={800} fill="#0F172A">87%</text>
          <text x="50%" y="60%" textAnchor="middle" fontSize={11} fill="#94A3B8">complete</text>
        </svg>
        <div style={{ flex: 1 }}>
          {sections.map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: s.color, flexShrink: 0 }}/>
              <span style={{ fontSize: 13, color: "#374151", flex: 1 }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{s.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default ProfileDonut;