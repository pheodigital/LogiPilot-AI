"use client";

import { useEffect, useState } from "react";
import type { FreightOrder } from "@/lib/types/freight-order";

export default function DashboardPage() {
  const [orders, setOrders] = useState<FreightOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/freight-orders")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load freight orders");
        return res.json();
      })
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const totalOrders = orders.length;
  const delayedCount = orders.filter((o) => o.status === "DELAYED").length;
  const inTransitCount = orders.filter((o) => o.status === "IN_TRANSIT").length;
  const totalCost = orders.reduce((sum, o) => sum + o.totalCost, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Freight operations overview</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">Total Shipments</p>
          <p className="mt-2 text-3xl font-bold">{totalOrders}</p>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">Delayed</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{delayedCount}</p>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">In Transit</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {inTransitCount}
          </p>
        </div>

        <div className="rounded-lg border bg-white p-6">
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="mt-2 text-3xl font-bold">€{totalCost.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-gray-500">
              <th className="p-4">ID</th>
              <th className="p-4">Status</th>
              <th className="p-4">Carrier</th>
              <th className="p-4">Origin</th>
              <th className="p-4">Destination</th>
              <th className="p-4">Cost</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b last:border-0">
                <td className="p-4">{order.id}</td>
                <td className="p-4 font-medium">{order.status}</td>
                <td className="p-4">
                  {order.carrierName}{" "}
                  <span className="text-gray-400">({order.carrierId})</span>
                </td>
                <td className="p-4">{order.origin}</td>
                <td className="p-4">{order.destination}</td>
                <td className="p-4">
                  {order.currency} {order.totalCost.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
