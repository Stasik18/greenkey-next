import { NextResponse } from "next/server";
import { handleLeadRequest } from "@/features/lead/lib/handler";

export const runtime = "nodejs";

async function handle(request: Request) {
  try {
    const result = await handleLeadRequest(request);

    if (result.status === 204) {
      return new NextResponse(null, {
        status: 204,
        headers: result.headers,
      });
    }

    return NextResponse.json(result.payload, {
      status: result.status,
      headers: result.headers,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "internal_error",
        message: "Не удалось обработать заявку. Позвоните нам — ответим сразу.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "X-Content-Type-Options": "nosniff",
          "Referrer-Policy": "no-referrer",
        },
      },
    );
  }
}

export async function POST(request: Request) {
  return handle(request);
}

export async function GET(request: Request) {
  return handle(request);
}

export async function OPTIONS(request: Request) {
  return handle(request);
}
