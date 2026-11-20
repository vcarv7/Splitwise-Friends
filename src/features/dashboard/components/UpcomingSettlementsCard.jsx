import { ArrowRight, Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import IconBadge from '@/components/ui/IconBadge'
import Money from '@/components/ui/Money'

export default function UpcomingSettlementsCard({ settlements, onSeeAll }) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-3">
        <IconBadge tone="warn">
          <Clock size={18} />
        </IconBadge>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-900">Próximas liquidaciones</h3>
          <p className="text-sm text-gray-500">
            Tienes {settlements.length} pagos pendientes de revisar.
          </p>
        </div>
      </div>

      <ul className="space-y-2 mt-4">
        {settlements.map((settlement) => (
          <li
            key={settlement.id}
            className="bg-surface-muted rounded-xl p-3 flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {settlement.counterpart} te debe
              </p>
              <p className="text-xs text-gray-500 truncate">{settlement.groupName}</p>
            </div>
            <Money
              value={settlement.amount}
              tone="auto"
              className="text-sm font-bold shrink-0 whitespace-nowrap"
            />
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSeeAll}
        className="flex items-center justify-between w-full mt-4 text-sm font-semibold text-brand hover:text-brand-dark"
      >
        Ver liquidaciones
        <ArrowRight size={16} />
      </button>
    </Card>
  )
}
