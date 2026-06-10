import { useState } from 'react'
import { X } from 'lucide-react'

const EMPTY_FORM = {
  title: '',
  description: '',
  startTime: '',
  endTime: '',
}

function TodoModal({ onClose, onSubmit }) {
  const [formValues, setFormValues] = useState(EMPTY_FORM)
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!formValues.title.trim()) {
      setMessage('제목을 입력해야 할 일을 추가할 수 있습니다.')
      return
    }

    onSubmit({
      ...formValues,
      title: formValues.title.trim(),
      description: formValues.description.trim(),
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <form className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl" onSubmit={handleSubmit}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-950">새 할 일 추가</h2>
          <button
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">제목</span>
          <input
            className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#672be0]"
            name="title"
            type="text"
            value={formValues.title}
            placeholder="할 일 제목을 입력하세요"
            autoComplete="off"
            onChange={handleChange}
          />
        </label>

        {message && <p className="mb-4 text-sm font-medium text-rose-500">{message}</p>}

        <label className="mb-4 block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">설명</span>
          <textarea
            className="min-h-28 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-[#672be0]"
            name="description"
            value={formValues.description}
            placeholder="할 일 설명을 입력하세요"
            onChange={handleChange}
          />
        </label>

        <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">시작 시간</span>
            <input
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#672be0]"
              name="startTime"
              type="time"
              step="1"
              value={formValues.startTime}
              onChange={handleChange}
            />
          </label>
          <span className="hidden pb-3 text-sm font-bold text-slate-400 sm:block">~</span>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">종료 시간</span>
            <input
              className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-[#672be0]"
              name="endTime"
              type="time"
              step="1"
              value={formValues.endTime}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="h-10 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            type="button"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="h-10 rounded-lg bg-[#672be0] px-4 text-sm font-semibold text-white transition hover:bg-[#5522c4]"
            type="submit"
          >
            추가
          </button>
        </div>
      </form>
    </div>
  )
}

export default TodoModal
