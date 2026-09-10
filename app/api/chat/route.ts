import { draftDelayEmail } from "@/lib/ai/draft-delay-email";
import {
  streamText,
  convertToModelMessages,
  toUIMessageStream,
  createUIMessageStreamResponse,
  tool,
  stepCountIs,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { chatModel } from "@/lib/ai/ollama";
import {
  getFreightOrderById,
  getDelayedOrders,
  getOrdersByCarrier,
  summarizeCostsByCarrier,
  getOrdersByFilters,
} from "@/lib/cap/freight-orders";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: chatModel,
    system: `You are LogiPilot AI, a freight and logistics operations assistant. Today's date is ${new Date().toISOString().split("T")[0]}. You can only help with questions about freight orders, shipments, carriers, and logistics costs, using the tools provided. When a user mentions a relative time period (e.g. "last month", "this week", "this quarter"), calculate the actual date range based on today's date and use it with getOrdersByFilters. If the user asks about anything unrelated to freight/logistics operations (e.g. general programming, coding help, unrelated trivia, math problems, or general knowledge questions), politely decline and explain that you're scoped to freight operations only. Do not answer unrelated questions even if you know the answer.`,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(3),

    tools: {
      getFreightOrderById: tool({
        description:
          "Look up a single freight order by its exact ID, e.g. 4500001234.",
        inputSchema: z.object({
          id: z.string().describe("The freight order ID to look up"),
        }),
        execute: async ({ id }) => {
          const order = await getFreightOrderById(id);
          return order ?? { error: `No freight order found with ID ${id}` };
        },
      }),

      getDelayedOrders: tool({
        description:
          "Get all freight orders currently in DELAYED status, with no other filters. Use this only when the user asks about delays with no other condition (e.g. destination or carrier).",
        inputSchema: z.object({}),
        execute: async () => getDelayedOrders(),
      }),

      getOrdersByCarrier: tool({
        description:
          "Get all freight orders handled by a specific carrier, given the carrier's ID (e.g. C001 for DHL).",
        inputSchema: z.object({
          carrierId: z.string().describe("The carrier ID, e.g. C001"),
        }),
        execute: async ({ carrierId }) => getOrdersByCarrier(carrierId),
      }),

      summarizeCostsByCarrier: tool({
        description:
          "Get total shipment cost and order count grouped by carrier, across all currently available freight orders. This tool has no filters — it always returns all orders. Call it for ANY cost-summary question regardless of time period mentioned (e.g. 'for Q3', 'this month', 'this year') — do not refuse or decline just because a time period was mentioned; instead, call this tool and note in your answer that the summary covers all available data.",
        inputSchema: z.object({}),
        execute: async () => summarizeCostsByCarrier(),
      }),

      getOrdersByFilters: tool({
        description:
          "Get freight orders matching any combination of status, destination country, carrier ID, and/or a creation-date range. Use this whenever the user's question combines more than one condition, or mentions a specific time period like 'last month', 'this week', or a quarter — prefer this over getDelayedOrders or getOrdersByCarrier whenever more than one filter applies, and always convert relative time phrases (e.g. 'last month') into an actual fromDate/toDate range based on today's date.",
        inputSchema: z.object({
          status: z
            .string()
            .optional()
            .describe(
              "Order status, e.g. DELAYED, PLANNED, IN_TRANSIT, DELIVERED",
            ),
          destinationCountry: z
            .string()
            .optional()
            .describe("Destination country code, e.g. DE for Germany"),
          carrierId: z.string().optional().describe("Carrier ID, e.g. C001"),
          fromDate: z
            .string()
            .optional()
            .describe("Start of date range (inclusive), ISO format YYYY-MM-DD"),
          toDate: z
            .string()
            .optional()
            .describe("End of date range (inclusive), ISO format YYYY-MM-DD"),
        }),
        execute: async ({
          status,
          destinationCountry,
          carrierId,
          fromDate,
          toDate,
        }) =>
          getOrdersByFilters({
            status,
            destinationCountry,
            carrierId,
            fromDate,
            toDate,
          }),
      }),
      draftDelayEmail: tool({
        description:
          "Draft a customer notification email about a delayed shipment. Use this when the user asks to write, draft, compose, or send an email/notification about a delay — not for just checking status. Requires a destination country to find the relevant delayed order.",
        inputSchema: z.object({
          destinationCountry: z
            .string()
            .describe(
              "Destination country code of the delayed shipment, e.g. DE for Germany",
            ),
        }),
        execute: async ({ destinationCountry }) =>
          draftDelayEmail(destinationCountry),
      }),
    },
  });

  const uiStream = toUIMessageStream({ stream: result.stream });
  return createUIMessageStreamResponse({ stream: uiStream });
}
