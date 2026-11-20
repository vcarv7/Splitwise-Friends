const sizes = {
  md: 'w-10 h-10 text-sm',
  sm: 'w-8 h-8 text-xs',
}

function getInitials(name) {
  const words = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
}

export default function Avatar({ name, size = 'md', className }) {
  return (
    <span
      className={[
        'inline-flex items-center justify-center rounded-full bg-brand-soft text-brand-dark font-bold',
        sizes[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {getInitials(name)}
    </span>
  )
}
