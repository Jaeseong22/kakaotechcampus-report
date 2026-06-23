import TodoForm from "@/components/todo-form";
import { normalizeDateKey } from "@/lib/date";

export default async function NewTodoPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[] }>;
}) {
  const { date } = await searchParams;
  return <TodoForm defaultDate={normalizeDateKey(date)} />;
}
