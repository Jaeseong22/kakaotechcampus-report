import Link from "next/link";
import { CalendarDays, CheckCircle2, LayoutDashboard, ListTodo, Sparkles } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b border-slate-800 bg-[var(--navy)] px-5 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between lg:block">
          <Link className="flex items-center gap-3" href="/todos">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--lime)] font-black text-slate-950">
              K
            </span>
            <span>
              <strong className="block text-base tracking-tight">KTC Todo</strong>
              <span className="text-[11px] text-slate-400">Build the day.</span>
            </span>
          </Link>
          <span className="rounded-full border border-slate-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--lime)] lg:hidden">
            Full stack
          </span>
        </div>

        <nav className="mt-5 hidden space-y-2 lg:block">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
          <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
            <LayoutDashboard size={17} />
            개요
          </div>
          <Link
            className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 text-sm font-bold text-white"
            href="/todos"
          >
            <ListTodo size={17} className="text-[var(--lime)]" />
            할 일 목록
            <span className="ml-auto size-1.5 rounded-full bg-[var(--lime)]" />
          </Link>
          <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500">
            <CalendarDays size={17} />
            캘린더
          </div>
        </nav>

        <div className="absolute bottom-5 left-5 right-5 hidden rounded-2xl border border-white/10 bg-white/5 p-4 lg:block">
          <Sparkles className="mb-3 text-[var(--lime)]" size={20} />
          <p className="text-sm font-bold">Next.js × FastAPI</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">서버에 안전하게 저장되는 나만의 주간 Todo.</p>
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold text-slate-300">
            <CheckCircle2 size={14} className="text-[var(--lime)]" />
            SQLite 연결됨
          </div>
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
