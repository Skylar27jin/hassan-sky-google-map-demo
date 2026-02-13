// src/components/parking_lot_detail.tsx
import React from "react";
import type { ParkingLot } from "../api/parking_lot_info";

function Row(props: { label: string; value?: React.ReactNode }) {
  if (props.value === undefined || props.value === null || props.value === "") return null;
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "6px 0" }}>
      <div style={{ color: "#6b7280" }}>{props.label}</div>
      <div style={{ textAlign: "right", fontWeight: 600 }}>{props.value}</div>
    </div>
  );
}

export default function parking_lot_detail(props: {
  lot: ParkingLot | null;
  onClose: () => void;
}) {
  const lot = props.lot;

  return (
    <div
      style={{
        width: 360,
        borderLeft: "1px solid #eee",
        background: "white",
        padding: 14,
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 16, fontWeight: 800 }}>Lot Details</div>
        <button
          onClick={props.onClose}
          style={{
            border: "1px solid #ddd",
            background: "white",
            borderRadius: 10,
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>

      {!lot ? (
        <div style={{ marginTop: 12, color: "#6b7280" }}>
          Click a marker to view details.
        </div>
      ) : (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{lot.lotName}</div>
          <div style={{ color: "#6b7280", marginTop: 4 }}>{lot.address}</div>

          <div style={{ marginTop: 14, borderTop: "1px solid #eee", paddingTop: 10 }}>
            <Row label="Campus" value={lot.campus} />
            <Row label="Public Lot" value={lot.publicLot ? "Yes" : "No"} />
            <Row label="Height Clearance" value={lot.heightClearance} />
            <Row label="EV Charging" value={lot.evChargingSpaces ?? 0} />
            <Row label="Latitude" value={lot.latitude} />
            <Row label="Longitude" value={lot.longitude} />
          </div>

          <div style={{ marginTop: 14, borderTop: "1px solid #eee", paddingTop: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Capacity (future)</div>
            <Row label="Total Spots" value={lot.totalSpots} />
            <Row label="Handicapped Spots" value={lot.handicappedSpots} />
            <Row label="Reserved Spots" value={lot.reservedSpots} />
            <Row label="Free Regular" value={lot.freeRegularSpots} />
            <Row label="Free Handicapped" value={lot.freeHandicappedSpots} />
          </div>

          <div style={{ marginTop: 14, borderTop: "1px solid #eee", paddingTop: 10 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Permits</div>
            <div style={{ whiteSpace: "pre-wrap", color: "#111827" }}>
              {lot.permitsAccepted || "(none)"}
            </div>
          </div>

          {lot.notes ? (
            <div style={{ marginTop: 14, borderTop: "1px solid #eee", paddingTop: 10 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Notes</div>
              <div style={{ whiteSpace: "pre-wrap", color: "#111827" }}>{lot.notes}</div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}