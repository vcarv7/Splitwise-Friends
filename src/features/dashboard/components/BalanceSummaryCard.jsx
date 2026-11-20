import { TrendingUp, Wallet } from 'lucide-react'
import IconBadge from '@/components/ui/IconBadge'
import Money from '@/components/ui/Money'

export default function BalanceSummaryCard({ total, owedToYou, youOwe }) {
  return (
    // Deliberately not a Card: this is the only solid-brand surface on the page,
    // and overriding Card's bg-white would need an !important escape hatch.
    <div className="bg-brand text-white rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-white/80">Tu saldo total</p>
        <IconBadge tone="white">
          <Wallet size={18} />
        </IconBadge>
      </div>

      {/* tone="neutral" avoids the primitive's text-brand, which would vanish on bg-brand. */}
      <Money value={total} sign tone="neutral" className="block text-4xl font-bold mt-2" />

      <div className="flex items-center gap-1.5 text-white/80 text-sm mt-1">
        <TrendingUp size={16} />
        <span>A tu favor en todos tus grupos</span>
      </div>

      <div className="border-t border-white/20 my-5" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-white/70">Te deben</p>
          <Money value={owedToYou} tone="neutral" className="block text-lg font-semibold mt-1" />
        </div>
        <div>
          <p className="text-xs text-white/70">Debes</p>
          <Money value={youOwe} tone="neutral" className="block text-lg font-semibold mt-1" />
        </div>
      </div>
    </div>
  )
}
