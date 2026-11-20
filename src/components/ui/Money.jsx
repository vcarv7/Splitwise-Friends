const tones = {
  positive: 'text-brand',
  negative: 'text-red-600',
  neutral: '',
}

export default function Money({
  value,
  currency = 'EUR',
  locale = 'es-ES',
  sign = false,
  tone = 'auto',
  className,
}) {
  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value)

  const resolvedTone =
    tone === 'auto' ? (value > 0 ? 'positive' : value < 0 ? 'negative' : 'neutral') : tone

  const prefix = sign && value > 0 ? '+' : ''

  return (
    <span className={[tones[resolvedTone], className].filter(Boolean).join(' ')}>
      {prefix}
      {formatted}
    </span>
  )
}
