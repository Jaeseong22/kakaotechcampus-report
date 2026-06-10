import { CalendarDays, ClipboardList, LayoutGrid } from 'lucide-react'

function Sidebar({ activeTodos }) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-100 bg-white px-5 py-6 md:w-64 md:border-b-0 md:border-r">
      <div className="mb-9 flex items-center gap-3">
        <img className="h-8 w-8 object-contain" src="/logo.png" alt="Kakao Tech Campus Logo" />
        <span className="text-lg font-bold text-slate-950">KTC-Todo</span>
      </div>

      <nav className="flex flex-col gap-2 text-sm">
        <div className="flex items-center gap-3 rounded-xl px-3 py-3 font-medium text-slate-500">
          <LayoutGrid size={16} />
          <span>개요</span>
        </div>

        <div>
          <div className="flex items-center gap-3 rounded-xl bg-indigo-50 px-3 py-3 font-semibold text-[#672be0]">
            <ClipboardList size={17} />
            <span>할 일 목록</span>
            <span className="ml-auto text-xs">•</span>
          </div>

          <div className="ml-6 mt-3 flex flex-col gap-2 border-l border-slate-200 pl-4">
            {activeTodos.length === 0 ? (
              <span className="text-xs text-slate-400">진행 중인 할 일이 없습니다</span>
            ) : (
              activeTodos.map((todo) => (
                <span key={todo.id} className="truncate text-xs text-slate-500" title={todo.title}>
                  {todo.title}
                </span>
              ))
            )}
          </div>
        </div>
      </nav>

      <div className="mt-auto hidden rounded-2xl bg-slate-50 p-4 text-xs text-slate-500 md:block">
        <div className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
          <CalendarDays size={15} />
          <span>주간 Todo</span>
        </div>
        <p>선택한 날짜 기준으로 할 일을 관리합니다.</p>
      </div>
    </aside>
  )
}

export default Sidebar
