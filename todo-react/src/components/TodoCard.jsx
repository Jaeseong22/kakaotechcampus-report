import { useState } from 'react'
import { Check, Pencil, Trash2 } from 'lucide-react'

function TodoCard({ todo, onDelete, onToggle, onUpdate, splitTimeRange }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValues, setEditValues] = useState({
    title: todo.title,
    description: todo.description || '',
    startTime: '',
    endTime: '',
  })
  const [message, setMessage] = useState('')

  const startEditing = () => {
    const timeRange = splitTimeRange(todo.time)

    setEditValues({
      title: todo.title,
      description: todo.description || '',
      startTime: timeRange.startTime,
      endTime: timeRange.endTime,
    })
    setMessage('')
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setMessage('')
    setIsEditing(false)
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setEditValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!editValues.title.trim()) {
      setMessage('제목을 입력해야 수정할 수 있습니다.')
      return
    }

    onUpdate(todo.id, {
      ...editValues,
      title: editValues.title.trim(),
      description: editValues.description.trim(),
    })
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <article
        className="flex min-h-40 flex-col rounded-2xl p-5 shadow-sm ring-2 ring-[#672be0]/20"
        style={{ backgroundColor: todo.color }}
      >
        <form className="flex flex-1 flex-col gap-3" onSubmit={handleSubmit}>
          <input
            className="h-10 rounded-lg border border-white/70 bg-white/85 px-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#672be0]"
            name="title"
            type="text"
            value={editValues.title}
            placeholder="할 일 제목"
            onChange={handleChange}
          />

          {message && <p className="text-xs font-semibold text-rose-500">{message}</p>}

          <textarea
            className="min-h-20 resize-none rounded-lg border border-white/70 bg-white/85 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#672be0]"
            name="description"
            value={editValues.description}
            placeholder="할 일 설명"
            onChange={handleChange}
          />

          <div className="grid gap-2 sm:grid-cols-2">
            <input
              className="h-9 rounded-lg border border-white/70 bg-white/85 px-3 text-xs text-slate-700 outline-none focus:border-[#672be0]"
              name="startTime"
              type="time"
              step="1"
              value={editValues.startTime}
              onChange={handleChange}
            />
            <input
              className="h-9 rounded-lg border border-white/70 bg-white/85 px-3 text-xs text-slate-700 outline-none focus:border-[#672be0]"
              name="endTime"
              type="time"
              step="1"
              value={editValues.endTime}
              onChange={handleChange}
            />
          </div>

          <div className="mt-auto flex flex-wrap gap-2">
            <button
              className="inline-flex h-8 items-center rounded-lg bg-[#672be0] px-3 text-xs font-semibold text-white transition hover:bg-[#5522c4]"
              type="submit"
            >
              저장
            </button>
            <button
              className="inline-flex h-8 items-center rounded-lg bg-white/80 px-3 text-xs font-semibold text-slate-600 transition hover:bg-white"
              type="button"
              onClick={cancelEditing}
            >
              취소
            </button>
          </div>
        </form>
      </article>
    )
  }

  return (
    <article
      className="flex min-h-40 flex-col rounded-2xl p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
      style={{ backgroundColor: todo.color }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3
          className={`text-base font-bold leading-snug text-slate-950 ${
            todo.completed ? 'text-slate-500 line-through' : ''
          }`}
        >
          {todo.title}
        </h3>
      </div>

      <p className={`line-clamp-3 flex-1 text-sm leading-6 text-slate-600 ${todo.completed ? 'opacity-60' : ''}`}>
        {todo.description || '설명이 없습니다.'}
      </p>

      <p className={`mt-4 text-xs font-semibold text-slate-500 ${todo.completed ? 'opacity-60' : ''}`}>
        {todo.time || '시간 미정'}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="inline-flex h-8 items-center gap-1 rounded-lg bg-white/80 px-3 text-xs font-semibold text-slate-600 transition hover:bg-white"
          type="button"
          onClick={startEditing}
        >
          <Pencil size={13} />
          수정
        </button>
        <button
          className="inline-flex h-8 items-center gap-1 rounded-lg bg-white/80 px-3 text-xs font-semibold text-[#672be0] transition hover:bg-white"
          type="button"
          onClick={() => onToggle(todo.id)}
        >
          <Check size={13} />
          {todo.completed ? '완료 해제' : '완료'}
        </button>
        <button
          className="inline-flex h-8 items-center gap-1 rounded-lg bg-white/80 px-3 text-xs font-semibold text-rose-500 transition hover:bg-white"
          type="button"
          onClick={() => onDelete(todo.id)}
        >
          <Trash2 size={13} />
          삭제
        </button>
      </div>
    </article>
  )
}

export default TodoCard
