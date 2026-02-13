import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AdvancedMarker,
  APIProvider,
  Map,
  type MapCameraChangedEvent,
  Pin,
  useMap,
} from "@vis.gl/react-google-maps";

import { getAllParkingLots, type ParkingLot } from "./api/parking_lot_info";
import Navbar from "./components/navbar";
import RightPanel from "./components/parking_lot_detail";

type Poi = { 
  key: string; 
  location: google.maps.LatLngLiteral; 
  lot: ParkingLot;
};
//ignore error if there is one on google.maps.LatLngLiteral above, 
// it is defined in the @types/googlemaps package which is a dependency of @vis.gl/react-google-maps
const PoiMarkers = (props: {
  pois: Poi[];
  onSelect: (lot: ParkingLot) => void;
}) => {
  const map = useMap(); //imported from google

  const handleClick = useCallback(
    (ev: google.maps.MapMouseEvent, lot: ParkingLot) => {
      props.onSelect(lot);

      // optional: pan to marker location (like the doc)
      if (!map) return;
      if (!ev.latLng) return;
      map.panTo(ev.latLng);
    },
    [map, props]
  );

  return (
    <>
      {props.pois.map((poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          clickable={true}
          onClick={(ev) => handleClick(ev, poi.lot)}
        >
          <Pin background={"#FBBC04"} glyphColor={"#000"} borderColor={"#000"} />
        </AdvancedMarker>
      ))}
    </>
  );
};

export default function App() {
  const [lots, setLots] = useState<ParkingLot[]>([]);
  const [selectedLot, setSelectedLot] = useState<ParkingLot | null>(null);
  const [loadErr, setLoadErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllParkingLots();
        setLots(data);
        console.log("Loaded parking lots:", data.length);
      } catch (e: any) {
        setLoadErr(e?.message ?? String(e));
        console.error("CSV load failed:", e);
      }
    })();
  }, []);

  const pois: Poi[] = useMemo(() => {
    return lots.map((l) => ({
      key: l.lotName || `${l.latitude},${l.longitude}`,
      location: { lat: l.latitude, lng: l.longitude },
      lot: l,
    }));
  }, [lots]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div style={{ flex: 1 }}>
          <APIProvider
            apiKey={"AIzaSyAH_FqQQeVvbDPd3ZrQACiRGfdGu1SoYn4"}
            onLoad={() => console.log("Maps API has loaded.")}
          >
            <Map
              style={{ width: "100%", height: "100%" }}
              defaultZoom={15.5}
              mapId="5526f5efcd60758c2895a69f"
              defaultCenter={{ lat: 42.350876, lng: -71.106918 }}
              onCameraChanged={(ev: MapCameraChangedEvent) =>
                console.log("camera changed:", ev.detail.center, "zoom:", ev.detail.zoom)
              }
            >
              <PoiMarkers pois={pois} onSelect={setSelectedLot} />
            </Map>

            {/* small error indicator */}
            {loadErr ? (
              <div style={{ position: "absolute", top: 70, left: 12, background: "white", padding: 8, borderRadius: 8 }}>
                CSV load error: {loadErr}
              </div>
            ) : null}
          </APIProvider>
        </div>

        {/* right-side detail panel */}
        <RightPanel lot={selectedLot} onClose={() => setSelectedLot(null)} />
      </div>
    </div>
  );
}