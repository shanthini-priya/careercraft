import { useState } from "react";
import EnhancedSidebar from "./EnhancedSidebar";
import TopHeader from "./TopHeader";

function DashboardLayout({ children, nav, route }) {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidth = collapsed ? 64 : 240;
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
      <EnhancedSidebar nav={nav} route={route} collapsed={collapsed} onToggle={() => setCollapsed(c => !c)}/>
      <div style={{ marginLeft: sidebarWidth, flex: 1, transition: "margin-left 0.25s ease", minWidth: 0 }}>
        <TopHeader route={route} nav={nav}/>
        <div style={{ paddingTop: 64 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;