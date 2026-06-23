import { notFound } from "next/navigation";
import { getTodo } from "@/app/actions";
import TodoForm from "@/components/todo-form";

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ todoId: string }>;
}) {
  const { todoId } = await params;
  const id = Number(todoId);
  if (!Number.isInteger(id)) notFound();

  let todo;
  try {
    todo = await getTodo(id);
  } catch {
    notFound();
  }

  return <TodoForm todo={todo} defaultDate={todo.date} />;
}
