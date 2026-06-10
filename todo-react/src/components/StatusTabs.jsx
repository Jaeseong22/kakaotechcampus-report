const TAB_ITEMS = [
  { key: 'all', label: '전체' },
  { key: 'active', label: '진행 중' },
  { key: 'completed', label: '완료' },
]

function StatusTabs({ activeTab, onChange }) {
  return (
    <div className="flex gap-6 border-b border-slate-200">
      {TAB_ITEMS.map((tab) => (
        <button
          key={tab.key}
          className={`relative pb-3 text-sm font-semibold transition ${
            activeTab === tab.key ? 'text-slate-950' : 'text-slate-400 hover:text-slate-700'
          }`}
          type="button"
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
          {activeTab === tab.key && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#672be0]" />
          )}
        </button>
      ))}
    </div>
  )
}

export default StatusTabs
