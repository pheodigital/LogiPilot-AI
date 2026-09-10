import type { FreightOrder } from "@/lib/cap/types";

interface ShipmentTableProps {
  orders: FreightOrder[];
}

export default function ShipmentTable({ orders }: ShipmentTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <table className="w-full">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-sm">Freight Order</th>

            <th className="px-4 py-3 text-left text-sm">Status</th>

            <th className="px-4 py-3 text-left text-sm">Carrier</th>

            <th className="px-4 py-3 text-left text-sm">Destination</th>

            <th className="px-4 py-3 text-right text-sm">Cost</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.ID} className="border-b last:border-0">
              <td className="px-4 py-3">{order.ID}</td>

              <td className="px-4 py-3">{order.status}</td>

              <td className="px-4 py-3">{order.carrier?.name ?? "-"}</td>

              <td className="px-4 py-3">{order.destination?.city ?? "-"}</td>

              <td className="px-4 py-3 text-right">
                {order.totalCost} {order.currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
