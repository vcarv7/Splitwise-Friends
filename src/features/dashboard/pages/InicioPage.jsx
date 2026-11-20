import { useNavigate } from 'react-router-dom'
import DashboardIntro from '../components/DashboardIntro.jsx'
import BalanceSummaryCard from '../components/BalanceSummaryCard.jsx'
import MonthlySpendCard from '../components/MonthlySpendCard.jsx'
import GroupsOverviewCard from '../components/GroupsOverviewCard.jsx'
import RecentActivityCard from '../components/RecentActivityCard.jsx'
import UpcomingSettlementsCard from '../components/UpcomingSettlementsCard.jsx'
import { useDashboardData } from '../hooks/useDashboardData.js'

export default function InicioPage() {
  const { data, loading, error } = useDashboardData()
  const navigate = useNavigate()

  if (loading) return <p className="text-sm text-gray-500">Cargando resumen…</p>
  if (error) return <p className="text-sm text-red-600">No se pudo cargar el resumen.</p>

  const { user, balance, monthSpend, groups, activity, settlements } = data

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <DashboardIntro
        userName={user.name.split(' ')[0]}
        onAddExpense={() => navigate('/nuevo-gasto')}
        onSettleUp={() => navigate('/liquidar')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* The balance card is wider than the monthly card in the reference design. */}
          <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-6 items-start">
            <BalanceSummaryCard
              total={balance.total}
              owedToYou={balance.owedToYou}
              youOwe={balance.youOwe}
            />
            <MonthlySpendCard
              total={monthSpend.total}
              deltaPct={monthSpend.deltaPct}
              compareLabel={monthSpend.compareLabel}
              sharePct={monthSpend.sharePct}
            />
          </div>

          <RecentActivityCard activity={activity} onSeeAll={() => navigate('/actividad')} />
        </div>

        <div className="space-y-6">
          <GroupsOverviewCard
            groups={groups}
            onOpenGroup={() => navigate('/grupos')}
            onCreateGroup={() => navigate('/grupos')}
          />
          <UpcomingSettlementsCard
            settlements={settlements}
            onSeeAll={() => navigate('/liquidar')}
          />
        </div>
      </div>
    </div>
  )
}
