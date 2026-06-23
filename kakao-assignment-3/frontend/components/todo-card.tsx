"use client";

import axios, { AxiosError } from "axios";
import { Check, Clock3, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatTimeRange } from "@/lib/date";
import type { Todo } from "@/types/todo";

export default function TodoCard({ todo }: { todo: Todo }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  const getErrorMessage = (error: unknown) =>
    error instanceof AxiosError && typeof error.response?.data?.detail === "string"
      ? error.response.data.detail
      : "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";

  const toggleTodo = async () => {
    setPending(true);
    setMessage("");
    try {
      await axios.put(`/api/todos/${todo.id}`, { completed: !todo.completed });
      router.refresh();
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setPending(false);
    }
  };

  const deleteTodo = async () => {
    if (!window.confirm(`"${todo.title}" 할 일을 삭제할까요?`)) return;
    setPending(true);
    setMessage("");
    try {
      await axios.delete(`/api/todos/${todo.id}`);
      router.refresh();
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setPending(false);
    }
  };

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/5 ${
        pending ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <span className="absolute inset-y-0 left-0 w-1.5" style={{ backgroundColor: todo.color }} />
      <div className="flex items-start gap-3">
        <button
          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 transition ${
            todo.completed
              ? "border-slate-900 bg-slate-900 text-[var(--lime)]"
              : "border-slate-300 bg-white text-transparent hover:border-slate-700"
          }`}
          type="button"
          aria-label={todo.completed ? "완료 해제" : "완료 처리"}
          onClick={toggleTodo}
        >
          <Check size={13} strokeWidth={3} />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className={`font-bold leading-6 text-slate-900 ${todo.completed ? "text-slate-400 line-through" : ""}`}>
            {todo.title}
          </h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 text-slate-500 ${todo.completed ? "opacity-60" : ""}`}>
            {todo.description || "설명이 없습니다."}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Clock3 size={14} />
            {formatTimeRange(todo.start_time, todo.end_time)}
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 pt-3">
        <Link
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          href={`/todos/${todo.id}`}
        >
          <Pencil size={13} />
          수정
        </Link>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
          type="button"
          onClick={deleteTodo}
        >
          <Trash2 size={13} />
          삭제
        </button>
      </div>
      {message && (
        <p role="alert" className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">
          {message}
        </p>
      )}
    </article>
  );
}
