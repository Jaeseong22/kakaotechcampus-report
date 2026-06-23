import { NextRequest, NextResponse } from "next/server";
import backend, { getApiError } from "@/lib/backend";

type Context = { params: Promise<{ todoId: string }> };

export async function GET(_request: NextRequest, { params }: Context) {
  try {
    const { todoId } = await params;
    const response = await backend.get(`/todos/${todoId}`);
    return NextResponse.json(response.data);
  } catch (error) {
    const apiError = getApiError(error);
    return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
  }
}

export async function PUT(request: NextRequest, { params }: Context) {
  try {
    const { todoId } = await params;
    const response = await backend.put(`/todos/${todoId}`, await request.json());
    return NextResponse.json(response.data);
  } catch (error) {
    const apiError = getApiError(error);
    return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
  }
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  try {
    const { todoId } = await params;
    await backend.delete(`/todos/${todoId}`);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const apiError = getApiError(error);
    return NextResponse.json({ detail: apiError.message }, { status: apiError.status });
  }
}
