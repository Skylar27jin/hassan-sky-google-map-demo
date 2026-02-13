// src/components/Navbar.tsx
import { useState } from "react";

type TabKey = "Map" | "Lots" | "Settings";

export default function Navbar() {
  const [tab, setTab] = useState<TabKey>("Map");

  const TabBtn = (props: { k: TabKey }) => (
    <button
      onClick={() => setTab(props.k)}
      style={{
        padding: "8px 12px",
        borderRadius: 10,
        border: "1px solid #ddd",
        background: tab === props.k ? "#f3f4f6" : "white",
        cursor: "pointer",
      }}
    >
      {props.k}
    </button>
  );

  return (
    <div
      style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        borderBottom: "1px solid #eee",
        background: "white",
      }}
    >
      <div style={{ fontWeight: 700 }}>BU Parking Map(This navbar is still a dummy one.)</div>

      <div style={{ display: "flex", gap: 8 }}>
        <TabBtn k="Map" />
        <TabBtn k="Lots" />
        <TabBtn k="Settings" />
      </div>

      <div style={{ fontSize: 12, color: "#6b7280" }}>dummy navbar</div>
    </div>
  );
}