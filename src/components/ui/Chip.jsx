const base =
  'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap'

const tones = {
  success: 'bg-chip-success text-brand-dark',
  warn: 'bg-chip-warn text-yellow-800',
  neutral: 'bg-gray-100 text-gray-600',
}

export default function Chip({ tone = 'neutral', className, children }) {
  return (
    <span className={[base, tones[tone], className].filter(Boolean).join(' ')}>{children}</span>
  )
}
