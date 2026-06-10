const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일']

function WeekView({ weekDates, selectedDateKey, todayKey, getDateKey, getTodoCount, onSelectDate }) {
  return (
    <section className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
      {weekDates.map((date, index) => {
        const dateKey = getDateKey(date)
        const isSelected = dateKey === selectedDateKey
        const isToday = dateKey === todayKey

        return (
          <button
            key={dateKey}
            className={`rounded-xl border bg-white p-3 text-left transition hover:border-indigo-200 ${
              isSelected ? 'border-[#672be0] bg-indigo-50 shadow-sm' : 'border-slate-200'
            } ${isToday ? 'ring-2 ring-emerald-300 ring-offset-1' : ''}`}
            type="button"
            onClick={() => onSelectDate(date)}
          >
            <span className="text-xs font-semibold text-slate-400">{DAY_LABELS[index]}</span>
            <strong className="mt-1 block text-base text-slate-900">{date.getDate()}일</strong>
            <span className="mt-2 block text-xs text-slate-500">Todo {getTodoCount(dateKey)}개</span>
          </button>
        )
      })}
    </section>
  )
}

export default WeekView
