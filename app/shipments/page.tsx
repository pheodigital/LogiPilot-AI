import { getFreightOrders } from "@/lib/cap/freight-orders";
import ShipmentTable from "@/components/shipments/ShipmentTable";

export default async function ShipmentsPage() {
  const orders = await getFreightOrders();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Shipments</h1>

        <p className="text-gray-500">Freight orders from SAP CAP</p>
      </div>

      <ShipmentTable orders={orders} />
    </div>
  );
}
