// import { freightOrders } from "@/lib/data/freight-orders";
import {
  getFreightOrders,
  getFreightOrderById,
} from "@/lib/cap/freight-orders";
import { toFreightOrder } from "@/lib/cap/mappers";
import type { FreightOrder } from "@/lib/types/freight-order";

export class FreightOrderRepository {
  /* findAll(): FreightOrder[] {
    return freightOrders;
  }

  findById(id: string): FreightOrder | undefined {
    return freightOrders.find((freightOrder) => freightOrder.id === id);
  } */
  async findAll(): Promise<FreightOrder[]> {
    const orders = await getFreightOrders();
    return orders.map(toFreightOrder);
  }

  async findById(id: string): Promise<FreightOrder | undefined> {
    const order = await getFreightOrderById(id);
    return order ? toFreightOrder(order) : undefined;
  }
}
