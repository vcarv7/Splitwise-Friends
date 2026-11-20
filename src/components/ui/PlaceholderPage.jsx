/**
 * Minimal placeholder for modules that are not implemented yet.
 * Replace each usage with the real page as its feature gets built.
 */
export default function PlaceholderPage({ title, description }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <p className="text-gray-500 mt-1">{description}</p>
      <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white/60 p-8 text-sm text-gray-400">
        Módulo en construcción.
      </div>
    </div>
  )
}
