import { FreightOrder } from "@/lib/types/freight-order";

export const freightOrders: FreightOrder[] = [
  {
    id: "4500001234",
    status: "DELAYED",
    creationDate: "2026-08-10",
    plannedStart: "2026-08-15",
    plannedEnd: "2026-08-18",
    actualStart: "2026-08-15",
    actualEnd: "2026-08-20",
    origin: "Rotterdam",
    destination: "Frankfurt",
    carrierId: "DHL",
    totalCost: 1240,
    currency: "EUR",
  },

  {
    id: "4500001235",
    status: "IN_TRANSIT",
    creationDate: "2026-08-12",
    plannedStart: "2026-08-17",
    plannedEnd: "2026-08-21",
    actualStart: "2026-08-17",
    origin: "Hamburg",
    destination: "Munich",
    carrierId: "DBS",
    totalCost: 980,
    currency: "EUR",
  },

  {
    id: "4500001236",
    status: "DELIVERED",
    creationDate: "2026-08-05",
    plannedStart: "2026-08-08",
    plannedEnd: "2026-08-12",
    actualStart: "2026-08-08",
    actualEnd: "2026-08-12",
    origin: "Berlin",
    destination: "Paris",
    carrierId: "DSV",
    totalCost: 1560,
    currency: "EUR",
  },
];
