import { FreightOrderRepository } from "@/lib/repositories/freight-order.repository";
import { FreightOrderService } from "@/lib/services/freight-order.service";

const freightOrderRepository = new FreightOrderRepository();

export const freightOrderService = new FreightOrderService(
  freightOrderRepository,
);
