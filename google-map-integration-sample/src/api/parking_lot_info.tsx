// src/api/parking_lot_info.tsx

export type ParkingLot = {
  campus: string;
  lotName: string;
  address: string;
  latitude: number;
  longitude: number;

  heightClearance?: string;
  permitsAccepted?: string;
  evChargingSpaces?: number;
  publicLot?: boolean;

  totalSpots?: number;
  handicappedSpots?: number;
  reservedSpots?: number;
  freeRegularSpots?: number;
  freeHandicappedSpots?: number;

  notes?: string;
};


const parking_lot_csv_addr = "src/api/parking_lot_info.csv";

export async function getAllParkingLots(
): Promise<ParkingLot[]> {
    console.info("Fetching parking lot data from CSV:", parking_lot_csv_addr);
  const res = await fetch(parking_lot_csv_addr, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch CSV: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) return [];

  const header = parseCsvLine(lines[0]).map(h => h.toLowerCase());
  const idx = (name: string) => header.indexOf(name.toLowerCase());

  const get = (row: string[], name: string) => {
    const i = idx(name);
    return i >= 0 ? row[i] : undefined;
  };

  const lots: ParkingLot[] = [];

  for (let i = 1; i < lines.length; i++) {
    const row = parseCsvLine(lines[i]);

    const lat = toNum(get(row, "Latitude"));
    const lng = toNum(get(row, "Longitude"));
    if (lat === undefined || lng === undefined) continue; // skip invalid coords

    lots.push({
      campus: get(row, "Campus") ?? "",
      lotName: get(row, "Lot Name") ?? "",
      address: get(row, "Address") ?? "",
      latitude: lat,
      longitude: lng,

      heightClearance: get(row, "Height Clearance") ?? undefined,
      permitsAccepted: get(row, "Permits Accepted") ?? undefined,
      evChargingSpaces: toNum(get(row, "EV Charging Spaces")),
      publicLot: toBool(get(row, "Public Lot")),

      totalSpots: toNum(get(row, "total_spots")),
      handicappedSpots: toNum(get(row, "handicapped_spots")),
      reservedSpots: toNum(get(row, "reserved_spots")),
      freeRegularSpots: toNum(get(row, "free_regular_spots")),
      freeHandicappedSpots: toNum(get(row, "free_handicapped_spots")),

      notes: get(row, "Notes") ?? undefined,
    });
  }

  return lots;
}

// --- tiny CSV parser (handles quoted fields + commas inside quotes) ---
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      // escaped quote
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }

    cur += ch;
  }

  out.push(cur);
  return out.map(s => s.trim());
}

function toNum(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const t = v.trim();
  if (t === "") return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

function toBool(v: string | undefined): boolean | undefined {
  if (!v) return undefined;
  const t = v.trim().toLowerCase();
  if (t === "yes" || t === "true" || t === "1") return true;
  if (t === "no" || t === "false" || t === "0") return false;
  return undefined;
}