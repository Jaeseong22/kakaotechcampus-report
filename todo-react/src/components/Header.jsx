import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react'

function Header({
  searchQuery,
  selectedDateLabel,
  onOpenModal,
  onPreviousDate,
  onNextDate,
  onPreviousWeek,
  onNextWeek,
  onSearchChange,
}) {
  return (
    <header className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">할 일 목록</h1>
        <p className="mt-1 text-sm text-slate-500">날짜별로 할 일을 추가하고 진행 상태를 관리합니다.</p>
      </div>

      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:text-[#672be0]"
              type="button"
              onClick={onPreviousWeek}
            >
              <ChevronLeft size={16} />
              이전 주
            </button>
            <button
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:text-[#672be0]"
              type="button"
              onClick={onPreviousDate}
            >
              <ChevronLeft size={16} />
              이전 날짜
            </button>
          </div>

          <p className="min-w-40 rounded-lg border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-700">
            {selectedDateLabel}
          </p>

          <div className="flex items-center gap-2">
            <button
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:text-[#672be0]"
              type="button"
              onClick={onNextDate}
            >
              다음 날짜
              <ChevronRight size={16} />
            </button>
            <button
              className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:border-indigo-200 hover:text-[#672be0]"
              type="button"
              onClick={onNextWeek}
            >
              다음 주
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#672be0] sm:w-64"
              type="search"
              value={searchQuery}
              placeholder="목록 검색"
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </label>

          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#672be0] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5522c4]"
            type="button"
            onClick={onOpenModal}
          >
            <Plus size={17} />
            새 목록 추가
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
