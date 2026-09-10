import { langchainModel } from "@/lib/ai/langchain-ollama";
import { getOrdersByFilters } from "@/lib/cap/freight-orders";

export async function draftDelayEmail(destinationCountry: string) {
  const orders = await getOrdersByFilters({
    status: "DELAYED",
    destinationCountry,
  });

  if (orders.length === 0) {
    return {
      error: `No delayed orders found for destination country ${destinationCountry}`,
    };
  }

  const order = orders[0];

  const prompt = `You are a logistics customer service assistant. Write a short, professional email to a customer notifying them their shipment is delayed. Use only the facts provided below — do not invent any details.

Shipment facts:
- Order ID: ${order.ID}
- Status: ${order.status}
- Origin: ${order.origin?.name ?? order.origin_ID}
- Destination: ${order.destination?.name ?? order.destination_ID}
- Planned delivery: ${order.plannedEnd}
- Actual/revised delivery: ${order.actualEnd ?? "not yet available"}
- Carrier: ${order.carrier?.name ?? order.carrier_ID}

Address the email to "Valued Customer". Keep it concise — 3-4 short paragraphs. Sign off as "LogiPilot Customer Service Team".`;

  const response = await langchainModel.invoke(prompt);
  return { email: response.content, orderUsed: order.ID };
}
