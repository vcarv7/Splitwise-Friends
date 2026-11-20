const base = 'inline-flex items-center justify-center shrink-0'

const tones = {
  brand: 'bg-brand-soft text-brand-dark',
  warn: 'bg-badge-warn text-yellow-800',
  white: 'bg-white/30 text-white',
}

const sizes = {
  md: 'w-10 h-10 rounded-xl',
  sm: 'w-8 h-8 rounded-lg',
}

export default function IconBadge({ tone = 'brand', size = 'md', className, children }) {
  return (
    <span className={[base, tones[tone], sizes[size], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  )
}
