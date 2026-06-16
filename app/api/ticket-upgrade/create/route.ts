import { NextResponse } from "next/server";

import { createTicketUpgrade } from "@/lib/ticketing";
import type { CreateTicketUpgradeInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateTicketUpgradeInput;
    const data = await createTicketUpgrade(body);

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Khong the tao yeu cau nang hang."
      },
      { status: 400 }
    );
  }
}
