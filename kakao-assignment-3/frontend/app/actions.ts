"use server";

import { fetchTodo, fetchTodos } from "@/lib/backend";
import type { TodoFilter } from "@/types/todo";

export async function getTodos(query: {
  date: string;
  filter: TodoFilter;
  search: string;
}) {
  return fetchTodos(query);
}

export async function getTodo(todoId: number) {
  return fetchTodo(todoId);
}
