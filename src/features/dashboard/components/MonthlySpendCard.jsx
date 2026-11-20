import { CalendarDays, TrendingUp } from 'lucide-react'
import Card from '@/components/ui/Card'
import IconBadge from '@/components/ui/IconBadge'
import Money from '@/components/ui/Money'
import ProgressBar from '@/components/ui/ProgressBar'

export default function MonthlySpendCard({ total, deltaPct, compareLabel, sharePct }) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-gray-500">Este mes</p>
        <IconBadge tone="warn">
          <CalendarDays size={18} />
        </IconBadge>
      </div>

      <Money value={total} tone="neutral" className="block text-3xl font-bold text-ink mt-2" />

      <div className="flex items-center gap-1 text-xs font-semibold text-brand mt-1">
        <TrendingUp size={14} />
        <span>
          {deltaPct}% vs. {compareLabel}
        </span>
      </div>

      <ProgressBar value={sharePct} label="Gasto compartido" className="mt-4" />

      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Gasto compartido</span>
        <span>{sharePct}%</span>
      </div>
    </Card>
  )
}
