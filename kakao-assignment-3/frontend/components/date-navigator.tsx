"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatLongDate, moveDate } from "@/lib/date";

export default function DateNavigator({ date }: { date: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const navigate = (amount: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", moveDate(date, amount));
    router.push(`/todos?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-400 hover:text-slate-900"
        type="button"
        aria-label="이전 날짜"
        onClick={() => navigate(-1)}
      >
        <ChevronLeft size={17} />
      </button>
      <p className="min-w-44 text-center text-sm font-bold text-slate-700">{formatLongDate(date)}</p>
      <button
        className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-400 hover:text-slate-900"
        type="button"
        aria-label="다음 날짜"
        onClick={() => navigate(1)}
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
}
