import { FreightOrderNotFoundError } from "@/lib/errors/freight-order-not-found.error";
import { FreightOrderRepository } from "@/lib/repositories/freight-order.repository";
import type { FreightOrder } from "@/lib/types/freight-order";

export class FreightOrderService {
  constructor(private readonly repository: FreightOrderRepository) {}

  async getAll(): Promise<FreightOrder[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<FreightOrder> {
    const freightOrder = await this.repository.findById(id);

    if (!freightOrder) {
      throw new FreightOrderNotFoundError(id);
    }

    return freightOrder;
  }
}
