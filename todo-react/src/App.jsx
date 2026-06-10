import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import StatusTabs from './components/StatusTabs'
import TodoCard from './components/TodoCard'
import TodoModal from './components/TodoModal'
import WeekView from './components/WeekView'

const TODO_STORAGE_KEY = 'todoVanillaDailyItems'
const SELECTED_DATE_STORAGE_KEY = 'todoReactSelectedDate'
const WEEK_START_STORAGE_KEY = 'todoReactWeekStartDate'
const PASTEL_COLORS = ['#e6f0ff', '#f0e6ff', '#fff9e6', '#ffe6f0', '#e6ffe6']

function createStartDate() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date
}

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getStartOfWeek(date) {
  const copiedDate = new Date(date)
  copiedDate.setHours(0, 0, 0, 0)

  const day = copiedDate.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day
  copiedDate.setDate(copiedDate.getDate() + diffToMonday)

  return copiedDate
}

function getWeekDates(baseDate) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(baseDate)
    date.setDate(baseDate.getDate() + index)
    return date
  })
}

function formatDateLabel(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}. ${month}. ${day}.`
}

function normalizeTimeValue(timeValue) {
  if (!timeValue) {
    return ''
  }

  const timeParts = String(timeValue).split(':')

  if (timeParts.length === 2) {
    return `${timeParts[0]}:${timeParts[1]}:00`
  }

  return String(timeValue)
}

function formatTodoTimeRange(startTime, endTime) {
  const normalizedStartTime = normalizeTimeValue(startTime)
  const normalizedEndTime = normalizeTimeValue(endTime)

  if (!normalizedStartTime && !normalizedEndTime) {
    return '시간 미정'
  }

  if (normalizedStartTime && !normalizedEndTime) {
    return `${normalizedStartTime} - 미정`
  }

  if (!normalizedStartTime && normalizedEndTime) {
    return `미정 - ${normalizedEndTime}`
  }

  return `${normalizedStartTime} - ${normalizedEndTime}`
}

function splitTimeRange(timeRange) {
  if (!timeRange || timeRange === '시간 미정') {
    return { startTime: '', endTime: '' }
  }

  const [startTime = '', endTime = ''] = String(timeRange).split(' - ')

  return {
    startTime: startTime === '미정' ? '' : startTime,
    endTime: endTime === '미정' ? '' : endTime,
  }
}

function loadDateFromLocalStorage(storageKey, fallbackDate) {
  const savedValue = localStorage.getItem(storageKey)

  if (!savedValue) {
    return fallbackDate
  }

  const parsedDate = new Date(savedValue)

  if (Number.isNaN(parsedDate.getTime())) {
    return fallbackDate
  }

  parsedDate.setHours(0, 0, 0, 0)
  return parsedDate
}

function loadTodosFromLocalStorage(selectedDateKey) {
  const savedValue = localStorage.getItem(TODO_STORAGE_KEY)

  if (!savedValue) {
    return []
  }

  try {
    const parsedTodos = JSON.parse(savedValue)

    if (!Array.isArray(parsedTodos)) {
      return []
    }

    // 예전 Vanilla JS 저장 데이터도 React 앱에서 그대로 사용할 수 있도록 기본 필드를 보정한다.
    return parsedTodos.map((todo, index) => ({
      id: String(todo.id ?? Date.now() + index),
      title: String(todo.title ?? ''),
      description: String(todo.description ?? '설명이 없습니다.'),
      time: String(todo.time ?? '시간 미정'),
      color: String(todo.color ?? PASTEL_COLORS[index % PASTEL_COLORS.length]),
      completed: Boolean(todo.completed),
      dateKey: String(todo.dateKey ?? selectedDateKey),
    }))
  } catch (error) {
    console.error('로컬스토리지 데이터를 불러오지 못했습니다.', error)
    return []
  }
}

function App() {
  const [selectedDate, setSelectedDate] = useState(() =>
    loadDateFromLocalStorage(SELECTED_DATE_STORAGE_KEY, createStartDate()),
  )
  const [weekStartDate, setWeekStartDate] = useState(() =>
    loadDateFromLocalStorage(WEEK_START_STORAGE_KEY, getStartOfWeek(createStartDate())),
  )
  const selectedDateKey = formatDateKey(selectedDate)
  const todayKey = formatDateKey(createStartDate())

  const [todos, setTodos] = useState(() => loadTodosFromLocalStorage(formatDateKey(createStartDate())))
  const [activeTab, setActiveTab] = useState('active')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem(SELECTED_DATE_STORAGE_KEY, selectedDateKey)
  }, [selectedDateKey])

  useEffect(() => {
    localStorage.setItem(WEEK_START_STORAGE_KEY, formatDateKey(weekStartDate))
  }, [weekStartDate])

  const weekDates = useMemo(() => getWeekDates(weekStartDate), [weekStartDate])

  const activeTodosForSidebar = useMemo(
    () => todos.filter((todo) => todo.dateKey === selectedDateKey && !todo.completed),
    [selectedDateKey, todos],
  )

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      const matchesDate = todo.dateKey === selectedDateKey
      const matchesSearch = todo.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
      const matchesStatus =
        activeTab === 'all' ||
        (activeTab === 'active' && !todo.completed) ||
        (activeTab === 'completed' && todo.completed)

      return matchesDate && matchesSearch && matchesStatus
    })
  }, [activeTab, searchQuery, selectedDateKey, todos])

  const getTodoCountByDate = (dateKey) => todos.filter((todo) => todo.dateKey === dateKey).length

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const openCreateModal = () => {
    setIsModalOpen(true)
  }

  const handleSubmitTodo = (formValues) => {
    const newTodo = {
      id: `${Date.now()}`,
      title: formValues.title,
      description: formValues.description || '설명이 없습니다.',
      time: formatTodoTimeRange(formValues.startTime, formValues.endTime),
      color: PASTEL_COLORS[todos.length % PASTEL_COLORS.length],
      completed: false,
      dateKey: selectedDateKey,
    }

    setTodos((currentTodos) => [...currentTodos, newTodo])
    closeModal()
  }

  const handleUpdateTodo = (todoId, formValues) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === todoId
          ? {
              ...todo,
              title: formValues.title,
              description: formValues.description || '설명이 없습니다.',
              time: formatTodoTimeRange(formValues.startTime, formValues.endTime),
            }
          : todo,
      ),
    )
  }

  const handleToggleTodo = (todoId) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === todoId ? { ...todo, completed: !todo.completed } : todo)),
    )
  }

  const handleDeleteTodo = (todoId) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId))
  }

  const moveDate = (amount) => {
    const nextDate = new Date(selectedDate)
    nextDate.setDate(selectedDate.getDate() + amount)
    nextDate.setHours(0, 0, 0, 0)

    setSelectedDate(nextDate)
    setWeekStartDate(getStartOfWeek(nextDate))
  }

  const moveWeek = (amount) => {
    const dateAmount = amount * 7
    const nextWeekStartDate = new Date(weekStartDate)
    const nextDate = new Date(selectedDate)

    nextWeekStartDate.setDate(weekStartDate.getDate() + dateAmount)
    nextWeekStartDate.setHours(0, 0, 0, 0)
    nextDate.setDate(selectedDate.getDate() + dateAmount)
    nextDate.setHours(0, 0, 0, 0)

    setWeekStartDate(nextWeekStartDate)
    setSelectedDate(nextDate)
  }

  const selectDate = (date) => {
    const nextDate = new Date(date)
    nextDate.setHours(0, 0, 0, 0)
    setSelectedDate(nextDate)
    setWeekStartDate(getStartOfWeek(nextDate))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0ff] to-[#f7f9ff] p-4 text-slate-900 md:p-8">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)] md:flex-row">
        <Sidebar activeTodos={activeTodosForSidebar} />

        <main className="flex flex-1 flex-col gap-6 overflow-y-auto bg-[#fafbfc] p-5 sm:p-8 lg:p-10">
          <Header
            searchQuery={searchQuery}
            selectedDateLabel={formatDateLabel(selectedDate)}
            onOpenModal={openCreateModal}
            onPreviousDate={() => moveDate(-1)}
            onNextDate={() => moveDate(1)}
            onPreviousWeek={() => moveWeek(-1)}
            onNextWeek={() => moveWeek(1)}
            onSearchChange={setSearchQuery}
          />

          <StatusTabs activeTab={activeTab} onChange={setActiveTab} />

          <WeekView
            weekDates={weekDates}
            selectedDateKey={selectedDateKey}
            todayKey={todayKey}
            getDateKey={formatDateKey}
            getTodoCount={getTodoCountByDate}
            onSelectDate={selectDate}
          />

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleTodos.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
                현재 날짜/상태 조건에 맞는 할 일이 없습니다.
              </div>
            ) : (
              visibleTodos.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  onToggle={handleToggleTodo}
                  onUpdate={handleUpdateTodo}
                  splitTimeRange={splitTimeRange}
                />
              ))
            )}
          </section>
        </main>
      </div>

      {isModalOpen && (
        <TodoModal
          key="create"
          splitTimeRange={splitTimeRange}
          onClose={closeModal}
          onSubmit={handleSubmitTodo}
        />
      )}
    </div>
  )
}

export default App
