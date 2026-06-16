import { NextResponse } from "next/server";

import { getTicketUpgradeInfo } from "@/lib/ticketing";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { orderCode?: string };
    const data = await getTicketUpgradeInfo(body.orderCode ?? "");

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Khong the tra cuu ma ve."
      },
      { status: 400 }
    );
  }
}
