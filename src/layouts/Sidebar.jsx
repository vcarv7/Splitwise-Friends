import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  Activity,
  Users,
  User,
  Settings,
  LogOut,
  ArrowLeftRight,
} from 'lucide-react'

// Navigation groups keep the markup DRY instead of repeating each link.
const navGroups = [
  {
    title: 'ESPACIO PERSONAL',
    items: [
      { to: '/', label: 'Inicio', icon: LayoutGrid, end: true },
      { to: '/actividad', label: 'Actividad', icon: Activity },
      { to: '/grupos', label: 'Grupos', icon: Users },
    ],
  },
  {
    title: 'TU CUENTA',
    items: [
      { to: '/perfil', label: 'Perfil', icon: User },
      { to: '/ajustes', label: 'Ajustes', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  return (
    <aside className="w-[280px] shrink-0 h-full bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 gap-3">
        <div className="bg-brand p-2 rounded-xl text-white">
          <ArrowLeftRight size={20} strokeWidth={2.5} />
        </div>
        <span className="font-bold text-gray-900 text-lg tracking-tight">Splitwise Friends</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-8">
            <h3 className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-brand-soft text-brand-dark'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                    >
                      <Icon size={18} className="shrink-0" />
                      {item.label}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User card pinned to the bottom */}
      <div className="mt-auto p-4">
        <div className="bg-surface-muted rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-soft text-brand-dark flex items-center justify-center font-bold text-sm">
              LR
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-gray-900 leading-tight">Laura Rodríguez</span>
              <span className="text-xs text-gray-500">laura.rodriguez@email.com</span>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 text-sm font-medium text-brand-dark hover:text-brand-darker transition-colors mt-2 text-left"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  )
}
