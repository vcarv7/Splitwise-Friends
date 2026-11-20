export default function CardHeader({ title, subtitle, action, className }) {
  return (
    <div
      className={['flex items-start justify-between gap-4 px-6 pt-6 pb-4', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="min-w-0">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        {subtitle ? <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
