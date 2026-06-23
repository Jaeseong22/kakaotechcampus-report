import { NextRequest, NextResponse } from "next/server";
import backend, { getApiError } from "@/lib/backend";

export async function GET(request: NextRequest) {
  try {
    const response = await backend.get("/todos", {
      params: Object.fromEntries(request.nextUrl.searchParams),
    });
    return NextResponse.json(response.data);
  } catch (error) {
    const apiError = getApiError(error);
    return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
  }
}

export async function POST(request: NextRequest) {
  try {
    const response = await backend.post("/todos", await request.json());
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    const apiError = getApiError(error);
    return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
  }
}
