"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getWeekDates, todayKey } from "@/lib/date";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

export default function WeekStrip({
  selectedDate,
  counts,
}: {
  selectedDate: string;
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dates = getWeekDates(selectedDate);
  const today = todayKey();

  const selectDate = (date: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", date);
    router.push(`/todos?${params.toString()}`);
  };

  return (
    <section className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
      {dates.map((date, index) => {
        const selected = date === selectedDate;
        const isToday = date === today;
        const day = Number(date.slice(-2));

        return (
          <button
            key={date}
            className={`min-w-[92px] flex-1 rounded-2xl border px-3 py-3 text-left transition ${
              selected
                ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
            }`}
            type="button"
            onClick={() => selectDate(date)}
          >
            <span className={`text-[10px] font-black uppercase tracking-widest ${selected ? "text-slate-400" : "text-slate-400"}`}>
              {DAYS[index]}
            </span>
            <span className="mt-2 flex items-center justify-between">
              <strong className="text-xl">{day}</strong>
              {isToday && <span className="size-2 rounded-full bg-[var(--lime)]" title="오늘" />}
            </span>
            <span className={`mt-2 block text-[11px] ${selected ? "text-slate-300" : "text-slate-500"}`}>
              Todo {counts[date] ?? 0}
            </span>
          </button>
        );
      })}
    </section>
  );
}
