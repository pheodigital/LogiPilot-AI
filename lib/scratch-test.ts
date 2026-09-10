/* import { getOrdersByFilters } from "@/lib/cap/freight-orders";

async function main() {
  console.log("Test 1 — status only:");
  console.log(await getOrdersByFilters({ status: "DELAYED" }));

  console.log("Test 2 — status + country:");
  console.log(
    await getOrdersByFilters({ status: "DELAYED", destinationCountry: "DE" }),
  );

  console.log("Test 3 — no filters:");
  console.log((await getOrdersByFilters({})).length, "orders returned");
}

main();
 */

/* import { config } from "dotenv";
config({ path: ".env.local" });

import { langchainModel } from "@/lib/ai/langchain-ollama";

async function main() {
  const response = await langchainModel.invoke("Say hello in one sentence.");
  console.log(response.content);
} */
import { config } from "dotenv";
config({ path: ".env.local" });

import { langchainModel } from "@/lib/ai/langchain-ollama";
import { getOrdersByFilters } from "@/lib/cap/freight-orders";

async function main() {
  // Step 1: fetch real data via an existing, already-tested CAP function.
  // No new backend code needed — reusing getOrdersByFilters from Lesson 5.
  const orders = await getOrdersByFilters({
    status: "DELAYED",
    destinationCountry: "DE",
  });

  if (orders.length === 0) {
    console.log("No delayed orders found — nothing to draft an email about.");
    return;
  }

  const order = orders[0]; // just handle the first match for this first test

  // Step 2: build a prompt that grounds the email in the real order data,
  // rather than letting the model invent details.
  const prompt = `You are a logistics customer service assistant. Write a short, professional email to a customer notifying them their shipment is delayed. Use only the facts provided below — do not invent any details.

Shipment facts:
- Order ID: ${order.ID}
- Status: ${order.status}
- Origin: ${order.origin?.name ?? order.origin_ID}
- Destination: ${order.destination?.name ?? order.destination_ID}
- Planned delivery: ${order.plannedEnd}
- Actual/revised delivery: ${order.actualEnd ?? "not yet available"}
- Carrier: ${order.carrier?.name ?? order.carrier_ID}

Address the email to "Valued Customer" since we don't have a specific customer name on file. Keep it concise — 3-4 short paragraphs. Sign off as "LogiPilot Customer Service Team".`;

  // Step 3: second LLM call — this is the actual "chain" step, generation
  // grounded in the tool result from step 1.
  const response = await langchainModel.invoke(prompt);

  console.log("=== DRAFTED EMAIL ===\n");
  console.log(response.content);
}

main();
