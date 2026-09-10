"use client";

import { useEffect, useState } from "react";
import type { FreightOrder } from "@/lib/types/freight-order";

interface CarrierSummary {
  carrierId: string;
  carrierName: string;
  orderCount: number;
  totalCost: number;
  currency: string;
}

export default function CarriersPage() {
  const [orders, setOrders] = useState<FreightOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/freight-orders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load carriers");
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading carriers...</div>;
  if (error) return <div style={{ padding: 24, color: "red" }}>{error}</div>;

  // Derive unique carriers with aggregate stats from the orders we already have.
  const carrierMap = new Map<string, CarrierSummary>();
  for (const order of orders) {
    const existing = carrierMap.get(order.carrierId);
    if (existing) {
      existing.orderCount += 1;
      existing.totalCost += order.totalCost;
    } else {
      carrierMap.set(order.carrierId, {
        carrierId: order.carrierId,
        carrierName: order.carrierName,
        orderCount: 1,
        totalCost: order.totalCost,
        currency: order.currency,
      });
    }
  }
  const carriers = Array.from(carrierMap.values());

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>Carriers</h1>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "2px solid #ddd" }}>
            <th style={{ padding: 8 }}>Carrier</th>
            <th style={{ padding: 8 }}>ID</th>
            <th style={{ padding: 8 }}>Orders</th>
            <th style={{ padding: 8 }}>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {carriers.map((c) => (
            <tr key={c.carrierId} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8, fontWeight: 500 }}>{c.carrierName}</td>
              <td style={{ padding: 8, color: "#888" }}>{c.carrierId}</td>
              <td style={{ padding: 8 }}>{c.orderCount}</td>
              <td style={{ padding: 8 }}>
                {c.currency} {c.totalCost.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
