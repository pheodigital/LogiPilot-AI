export type FreightOrderStatus =
  | "PLANNED"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "DELAYED"
  | "CANCELLED";

export interface FreightOrder {
  id: string;
  status: FreightOrderStatus;
  creationDate: string;
  plannedStart: string;
  plannedEnd: string;
  actualStart?: string;
  actualEnd?: string;
  origin: string;
  destination: string;
  carrierId: string;
  carrierName: string; // new — resolved name, same pattern as origin/destination
  totalCost: number;
  currency: string;
}
