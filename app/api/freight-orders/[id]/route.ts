import { NextResponse } from "next/server";
import { freightOrderService } from "@/lib/services";
import { FreightOrderNotFoundError } from "@/lib/errors/freight-order-not-found.error";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const freightOrder = await freightOrderService.getById(id);

    return NextResponse.json(freightOrder);
  } catch (error) {
    if (error instanceof FreightOrderNotFoundError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Unable to retrieve freight order",
      },
      {
        status: 500,
      },
    );
  }
}
