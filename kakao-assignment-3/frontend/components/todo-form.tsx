"use client";

import axios, { AxiosError } from "axios";
import { ArrowLeft, CalendarDays, Clock3, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { Todo, TodoPayload } from "@/types/todo";

const COLORS = ["#c8ff54", "#89d9ff", "#c7b8ff", "#ffb5c7", "#ffd66b"];

export default function TodoForm({
  todo,
  defaultDate,
}: {
  todo?: Todo;
  defaultDate: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: todo?.title ?? "",
    description: todo?.description ?? "",
    date: todo?.date ?? defaultDate,
    start_time: todo?.start_time?.slice(0, 5) ?? "",
    end_time: todo?.end_time?.slice(0, 5) ?? "",
    color: todo?.color ?? COLORS[0],
  });
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title.trim()) {
      setMessage("제목을 입력해 주세요.");
      return;
    }

    const payload: TodoPayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      date: form.date,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      color: form.color,
    };

    setPending(true);
    setMessage("");
    try {
      if (todo) await axios.put(`/api/todos/${todo.id}`, payload);
      else await axios.post("/api/todos", payload);
      router.push(`/todos?date=${form.date}`);
      router.refresh();
    } catch (error) {
      const detail =
        error instanceof AxiosError && typeof error.response?.data?.detail === "string"
          ? error.response.data.detail
          : "저장하지 못했습니다. 백엔드 서버 상태를 확인해 주세요.";
      setMessage(detail);
      setPending(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8 lg:py-12">
      <Link
        className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-950"
        href={`/todos?date=${form.date}`}
      >
        <ArrowLeft size={16} />
        목록으로
      </Link>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
        <header className="grid-texture border-b border-slate-200 bg-slate-50 px-6 py-7 sm:px-9">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-lime-700">
            {todo ? "Edit task" : "New task"}
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            {todo ? "할 일 수정" : "새 할 일 만들기"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">필요한 내용만 간결하게 기록하고 바로 실행하세요.</p>
        </header>

        <form className="space-y-6 p-6 sm:p-9" onSubmit={submit}>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">제목 *</span>
            <input
              className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm font-semibold outline-none transition focus:border-slate-600"
              value={form.title}
              maxLength={120}
              placeholder="예: API 연동 마무리하기"
              onChange={(event) => setForm({ ...form, title: event.target.value })}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wider text-slate-500">설명</span>
            <textarea
              className="min-h-32 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-600"
              value={form.description}
              maxLength={1000}
              placeholder="완료 조건이나 참고할 내용을 적어 주세요."
              onChange={(event) => setForm({ ...form, description: event.target.value })}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500">
                <CalendarDays size={14} />
                날짜
              </span>
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-600"
                type="date"
                value={form.date}
                required
                onChange={(event) => setForm({ ...form, date: event.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500">
                <Clock3 size={14} />
                시작
              </span>
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-600"
                type="time"
                value={form.start_time}
                onChange={(event) => setForm({ ...form, start_time: event.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500">
                <Clock3 size={14} />
                종료
              </span>
              <input
                className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-slate-600"
                type="time"
                value={form.end_time}
                onChange={(event) => setForm({ ...form, end_time: event.target.value })}
              />
            </label>
          </div>

          <fieldset>
            <legend className="mb-3 text-xs font-black uppercase tracking-wider text-slate-500">카드 컬러</legend>
            <div className="flex gap-3">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`size-8 rounded-full border-4 transition hover:scale-110 ${
                    form.color === color ? "border-slate-800" : "border-white ring-1 ring-slate-200"
                  }`}
                  style={{ backgroundColor: color }}
                  type="button"
                  aria-label={`${color} 색상`}
                  onClick={() => setForm({ ...form, color })}
                />
              ))}
            </div>
          </fieldset>

          {message && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600">{message}</p>}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-6">
            <Link
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              href={`/todos?date=${form.date}`}
            >
              취소
            </Link>
            <button
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
              type="submit"
              disabled={pending}
            >
              <Save size={16} />
              {pending ? "저장 중..." : todo ? "변경사항 저장" : "할 일 추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
