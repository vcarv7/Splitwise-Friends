const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-50 disabled:pointer-events-none'

const variants = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  outline: 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50',
  ghost: 'text-brand-dark hover:bg-brand-soft',
}

const sizes = {
  sm: 'px-3 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={[base, variants[variant], sizes[size], className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}
