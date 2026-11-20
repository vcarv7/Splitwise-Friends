import { ArrowUpRight, Plus } from 'lucide-react'
import Button from '@/components/ui/Button'

function getGreeting(hour) {
  if (hour < 12) return 'Buenos días'
  if (hour < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function DashboardIntro({ userName, onAddExpense, onSettleUp }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold text-ink">
          {getGreeting(new Date().getHours())}, {userName}
        </h2>
        <p className="text-gray-500 mt-1">Aquí tienes un resumen de tus gastos compartidos.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={onSettleUp}>
          <ArrowUpRight size={16} />
          Liquidar saldos
        </Button>
        <Button variant="primary" onClick={onAddExpense}>
          <Plus size={16} />
          Añadir gasto
        </Button>
      </div>
    </div>
  )
}
