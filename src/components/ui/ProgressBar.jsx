export default function ProgressBar({ value, className, label }) {
  const clamped = Math.min(100, Math.max(0, Number(value) || 0))

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label={label}
      className={['h-1.5 w-full rounded-full bg-brand-soft overflow-hidden', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="h-full rounded-full bg-brand" style={{ width: `${clamped}%` }} />
    </div>
  )
}
