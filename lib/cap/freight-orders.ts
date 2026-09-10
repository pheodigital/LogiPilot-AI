import { capFetch } from "./client";
import type { FreightOrder, ODataResponse } from "./types";

// const path1 = "$filter=status%20eq%20%27DELAYED%27&$expand=carrier,destination";
// const path2 = "$expand=carrier,origin,destination";

export interface CarrierCostSummary {
  carrierId: string;
  carrierName: string;
  totalCost: number;
  currency: string;
  orderCount: number;
}

export async function getFreightOrders(): Promise<FreightOrder[]> {
  const response = await capFetch<ODataResponse<FreightOrder>>(
    `/freight/FreightOrders?$expand=carrier,origin,destination`,
  );

  return response.value;
}

export async function getFreightOrderById(
  id: string,
): Promise<FreightOrder | null> {
  const response = await capFetch<ODataResponse<FreightOrder>>(
    `/freight/FreightOrders?$filter=ID eq '${id}'&$expand=carrier,origin,destination`,
  );

  return response.value[0] ?? null;
}

export async function getDelayedOrders(): Promise<FreightOrder[]> {
  const response = await capFetch<ODataResponse<FreightOrder>>(
    `/freight/FreightOrders?$filter=status eq 'DELAYED'&$expand=carrier,destination`,
  );

  return response.value;
}

export async function getOrdersByCarrier(
  carrierId: string,
): Promise<FreightOrder[]> {
  const response = await capFetch<ODataResponse<FreightOrder>>(
    `/freight/FreightOrders?$filter=carrier_ID eq '${carrierId}'&$expand=carrier,origin,destination`,
  );

  return response.value;
}

export async function summarizeCostsByCarrier(): Promise<CarrierCostSummary[]> {
  const orders = await getFreightOrders();

  const summaryMap = new Map<string, CarrierCostSummary>();

  for (const order of orders) {
    const carrierId = order.carrier_ID;
    const carrierName = order.carrier?.name ?? carrierId;
    const cost = Number(order.totalCost);

    const existing = summaryMap.get(carrierId);

    if (existing) {
      existing.totalCost += cost;
      existing.orderCount += 1;
    } else {
      summaryMap.set(carrierId, {
        carrierId,
        carrierName,
        totalCost: cost,
        currency: order.currency,
        orderCount: 1,
      });
    }
  }

  return Array.from(summaryMap.values());
}

export interface FreightOrderFilters {
  status?: string;
  destinationCountry?: string;
  carrierId?: string;
  fromDate?: string; // ISO date string, e.g. "2026-08-01"
  toDate?: string; // ISO date string, e.g. "2026-08-31"
}

export async function getOrdersByFilters(
  filters: FreightOrderFilters,
): Promise<FreightOrder[]> {
  const conditions: string[] = [];

  if (filters.status) {
    conditions.push(`status eq '${filters.status}'`);
  }
  if (filters.destinationCountry) {
    conditions.push(`destination/country eq '${filters.destinationCountry}'`);
  }
  if (filters.carrierId) {
    conditions.push(`carrier_ID eq '${filters.carrierId}'`);
  }
  // Filter on creationDate — the field consistently populated across all orders,
  // unlike actualStart/actualEnd which can be null for PLANNED orders.
  if (filters.fromDate) {
    conditions.push(`creationDate ge ${filters.fromDate}`);
  }
  if (filters.toDate) {
    conditions.push(`creationDate le ${filters.toDate}`);
  }

  const filterClause =
    conditions.length > 0 ? `$filter=${conditions.join(" and ")}&` : "";

  const response = await capFetch<ODataResponse<FreightOrder>>(
    `/freight/FreightOrders?${filterClause}$expand=carrier,origin,destination`,
  );

  return response.value;
}
