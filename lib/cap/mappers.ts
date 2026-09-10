import type { FreightOrder as CapFreightOrder } from "@/lib/cap/types";
import type { FreightOrder } from "@/lib/types/freight-order";

export function toFreightOrder(capOrder: CapFreightOrder): FreightOrder {
  return {
    id: capOrder.ID,
    status: capOrder.status as FreightOrder["status"],
    creationDate: capOrder.creationDate,
    plannedStart: capOrder.plannedStart,
    plannedEnd: capOrder.plannedEnd,
    actualStart: capOrder.actualStart ?? undefined,
    actualEnd: capOrder.actualEnd ?? undefined,
    origin: capOrder.origin?.name ?? capOrder.origin_ID,
    destination: capOrder.destination?.name ?? capOrder.destination_ID,
    carrierId: capOrder.carrier_ID,
    carrierName: capOrder.carrier?.name ?? capOrder.carrier_ID, // new
    totalCost: Number(capOrder.totalCost),
    currency: capOrder.currency,
  };
}
