"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { TodoFilter } from "@/types/todo";

const FILTERS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "active", label: "진행 중" },
  { value: "completed", label: "완료" },
];

export default function TodoToolbar({
  filter,
  search,
  counts,
}: {
  filter: TodoFilter;
  search: string;
  counts: Record<TodoFilter, number>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(search);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (query === search) return;
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) params.set("search", query.trim());
      else params.delete("search");
      router.replace(`${pathname}?${params.toString()}`);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [pathname, query, router, search, searchParams]);

  const changeFilter = (value: TodoFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("filter");
    else params.set("filter", value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
      <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
        {FILTERS.map((item) => (
          <button
            key={item.value}
            className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
              filter === item.value ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
            type="button"
            onClick={() => changeFilter(item.value)}
          >
            {item.label}
            <span className="ml-1.5 text-[10px] text-slate-400">{counts[item.value]}</span>
          </button>
        ))}
      </div>
      <label className="relative block">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-500 md:w-64"
          type="search"
          value={query}
          placeholder="할 일 검색"
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
    </div>
  );
}
