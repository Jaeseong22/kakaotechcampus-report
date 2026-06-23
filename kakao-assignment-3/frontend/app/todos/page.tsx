import { Suspense } from "react";
import { ArrowUpRight, ListChecks, Plus, Target } from "lucide-react";
import Link from "next/link";
import { getTodos } from "@/app/actions";
import DateNavigator from "@/components/date-navigator";
import TodoCard from "@/components/todo-card";
import TodoToolbar from "@/components/todo-toolbar";
import WeekStrip from "@/components/week-strip";
import { getWeekDates, normalizeDateKey } from "@/lib/date";
import type { TodoFilter } from "@/types/todo";

type SearchParams = Promise<{
  date?: string | string[];
  filter?: string | string[];
  search?: string | string[];
}>;

function normalizeFilter(value?: string | string[]): TodoFilter {
  const filter = Array.isArray(value) ? value[0] : value;
  return filter === "active" || filter === "completed" ? filter : "all";
}

export default async function TodosPage({ searchParams }: { searchParams: SearchParams }) {
  const query = await searchParams;
  const date = normalizeDateKey(query.date);
  const filter = normalizeFilter(query.filter);
  const search = (Array.isArray(query.search) ? query.search[0] : query.search)?.trim() ?? "";

  const [todos, allTodos, weekTodos] = await Promise.all([
    getTodos({ date, filter, search }),
    getTodos({ date, filter: "all", search: "" }),
    getTodos({ date: "", filter: "all", search: "" }),
  ]);

  const weekDateSet = new Set(getWeekDates(date));
  const weekCounts = weekTodos.reduce<Record<string, number>>((acc, todo) => {
    if (weekDateSet.has(todo.date)) acc[todo.date] = (acc[todo.date] ?? 0) + 1;
    return acc;
  }, {});
  const completedCount = allTodos.filter((todo) => todo.completed).length;
  const activeCount = allTodos.length - completedCount;
  const completionRate = allTodos.length ? Math.round((completedCount / allTodos.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
      <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-lime-700">My workspace</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-slate-950 sm:text-4xl">오늘의 할 일</h1>
          <p className="mt-2 text-sm text-slate-500">작은 단위로 기록하고, 하나씩 끝내세요.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Suspense fallback={<div className="h-9 w-64 animate-pulse rounded-lg bg-slate-200" />}>
            <DateNavigator date={date} />
          </Suspense>
          <Link
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white transition hover:bg-slate-700"
            href={`/todos/new?date=${date}`}
          >
            <Plus size={17} />
            새 할 일
          </Link>
        </div>
      </header>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">오늘 전체</span>
            <ListChecks size={18} className="text-slate-400" />
          </div>
          <strong className="mt-3 block text-3xl font-black text-slate-950">{allTodos.length}</strong>
          <p className="mt-1 text-xs text-slate-400">개의 할 일이 등록됨</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">진행 중</span>
            <Target size={18} className="text-slate-400" />
          </div>
          <strong className="mt-3 block text-3xl font-black text-slate-950">{activeCount}</strong>
          <p className="mt-1 text-xs text-slate-400">개의 할 일이 남음</p>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-[var(--lime)] p-5 text-slate-950">
          <ArrowUpRight className="absolute right-4 top-4 opacity-50" size={20} />
          <span className="text-xs font-black">완료율</span>
          <strong className="mt-3 block text-3xl font-black">{completionRate}%</strong>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-900/15">
            <div className="h-full rounded-full bg-slate-900" style={{ width: `${completionRate}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-7">
        <Suspense fallback={<div className="h-24 animate-pulse rounded-2xl bg-slate-200" />}>
          <WeekStrip selectedDate={date} counts={weekCounts} />
        </Suspense>
      </div>

      <section className="mt-8">
        <Suspense fallback={<div className="h-14 animate-pulse rounded-xl bg-slate-200" />}>
          <TodoToolbar
            key={`${date}-${filter}-${search}`}
            filter={filter}
            search={search}
            counts={{ all: allTodos.length, active: activeCount, completed: completedCount }}
          />
        </Suspense>

        {todos.length > 0 ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {todos.map((todo) => (
              <TodoCard key={todo.id} todo={todo} />
            ))}
          </div>
        ) : (
          <div className="grid-texture mt-5 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
              <ListChecks size={22} />
            </span>
            <h2 className="mt-4 font-black text-slate-900">{search ? "검색 결과가 없습니다" : "등록된 할 일이 없습니다"}</h2>
            <p className="mt-2 text-sm text-slate-500">새 할 일을 추가해 하루의 흐름을 만들어 보세요.</p>
          </div>
        )}
      </section>
    </div>
  );
}
