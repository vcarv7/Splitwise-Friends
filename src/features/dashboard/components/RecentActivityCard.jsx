import { createElement } from 'react'
import { ArrowRight, ChevronRight } from 'lucide-react'
import Card from '@/components/ui/Card'
import CardHeader from '@/components/ui/CardHeader'
import Chip from '@/components/ui/Chip'
import IconBadge from '@/components/ui/IconBadge'
import Money from '@/components/ui/Money'
import { ACTIVITY_ICONS, getIcon } from './icons.jsx'

const STATUS = {
  favorable: { tone: 'success', label: 'A tu favor', badge: 'brand' },
  pending: { tone: 'warn', label: 'Pendiente', badge: 'warn' },
}

function StatusChip({ status }) {
  const meta = STATUS[status]
  if (!meta) return null
  return <Chip tone={meta.tone}>{meta.label}</Chip>
}

// Icon + title/detail block shared by the table and the mobile list.
function ActivitySummary({ row, showMeta = false }) {
  // Rendering via createElement keeps the registry lookup out of JSX: the React
  // Compiler static-components rule flags a resolved component used as a tag.
  const icon = getIcon(ACTIVITY_ICONS, row.icon)
  const badgeTone = STATUS[row.status]?.badge ?? 'brand'

  return (
    <>
      <IconBadge tone={badgeTone} size="sm">
        {createElement(icon, { size: 16 })}
      </IconBadge>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 truncate">{row.title}</p>
        <p className="text-xs text-gray-500 truncate">{row.detail}</p>
        {showMeta ? (
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">
            {row.groupName} · {row.dateLabel}
          </p>
        ) : null}
      </div>
    </>
  )
}

function AmountBlock({ row, className }) {
  return (
    <div className={['flex flex-col items-end gap-1', className].filter(Boolean).join(' ')}>
      <Money value={row.amount} sign tone="auto" className="text-sm font-semibold" />
      <StatusChip status={row.status} />
    </div>
  )
}

export default function RecentActivityCard({ activity, onSeeAll }) {
  return (
    <Card>
      <CardHeader
        title="Actividad reciente"
        subtitle="Los últimos movimientos de tus grupos"
        action={
          <button
            type="button"
            onClick={onSeeAll}
            className="flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
          >
            Ver toda la actividad
            <ArrowRight size={14} />
          </button>
        }
      />

      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-y border-gray-100">
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                Movimiento
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                Grupo
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                Importe
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {activity.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <ActivitySummary row={row} />
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {row.groupName}
                </td>
                <td className="px-6 py-3 text-sm text-gray-500 whitespace-nowrap">
                  {row.dateLabel}
                </td>
                <td className="px-6 py-3">
                  <AmountBlock row={row} />
                </td>
                <td className="pl-0 pr-6 py-3 text-gray-400">
                  <ChevronRight size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked list */}
      <div className="md:hidden border-t border-gray-100 divide-y divide-gray-100">
        {activity.map((row) => (
          <div key={row.id} className="flex items-start gap-3 px-6 py-4">
            <ActivitySummary row={row} showMeta />
            <AmountBlock row={row} className="shrink-0 pt-0.5" />
          </div>
        ))}
      </div>
    </Card>
  )
}
