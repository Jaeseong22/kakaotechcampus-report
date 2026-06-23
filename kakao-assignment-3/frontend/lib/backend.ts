import axios, { AxiosError } from "axios";
import type { Todo, TodoFilter } from "@/types/todo";

const backendUrl = process.env.BACKEND_URL;

if (!backendUrl) {
  throw new Error("BACKEND_URL 환경변수가 설정되지 않았습니다.");
}

const backend = axios.create({
  baseURL: backendUrl,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export async function fetchTodos(params: {
  date?: string;
  filter?: TodoFilter;
  search?: string;
}) {
  const query = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== ""),
  );
  const response = await backend.get<Todo[]>("/todos", { params: query });
  return response.data;
}

export async function fetchTodo(todoId: number) {
  const response = await backend.get<Todo>(`/todos/${todoId}`);
  return response.data;
}

export function getApiError(error: unknown) {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail;
    return {
      status: error.response?.status ?? 502,
      message: typeof detail === "string" ? detail : "백엔드 API 요청에 실패했습니다.",
    };
  }

  return { status: 500, message: "알 수 없는 오류가 발생했습니다." };
}

export default backend;
