import { Search, Bell, ChevronDown } from 'lucide-react'
import { useMatches } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { getInitials } from '@/features/auth/utils.js'

const dateLabel = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())

const capitalizedDate = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1)

export default function Header() {
  const { user } = useAuth()
  const initials = getInitials(user?.username)
  const matches = useMatches()
  const title =
    [...matches].reverse().find((match) => match.handle?.title)?.handle.title ?? ''

  return (
    <header className="h-20 bg-surface flex items-center justify-between px-8 border-b border-gray-200/50">
      {/* Left zone: date and current page title */}
      <div className="flex flex-col justify-center">
        <span className="text-sm text-gray-500 font-medium mb-0.5">{capitalizedDate}</span>
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
      </div>

      {/* Right zone: actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative flex items-center">
          <Search size={18} className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar gastos o grupos"
            className="w-64 pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
          />
          {/* Keyboard shortcut hint */}
          <div className="absolute right-2 flex items-center gap-0.5 px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-[10px] font-bold text-gray-400">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notificaciones"
          className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors relative"
        >
          <Bell size={18} />
        </button>

        {/* User profile */}
        <button
          type="button"
          className="flex items-center gap-2 p-1 pr-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-brand-soft text-brand-dark flex items-center justify-center font-bold text-xs">
            {initials}
          </div>
          <ChevronDown size={14} className="text-gray-500" />
        </button>
      </div>
    </header>
  )
}
