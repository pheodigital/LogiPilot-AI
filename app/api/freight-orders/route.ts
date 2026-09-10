import { NextResponse } from "next/server";
import { freightOrderService } from "@/lib/services";

export async function GET() {
  try {
    const freightOrders = await freightOrderService.getAll();

    return NextResponse.json(freightOrders);
  } catch {
    return NextResponse.json(
      { message: "Unable to retrieve freight orders" },
      { status: 500 },
    );
  }
}
