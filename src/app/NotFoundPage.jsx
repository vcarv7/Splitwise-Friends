import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl">
      <span className="text-sm font-bold text-brand-dark">Error 404</span>
      <h2 className="text-3xl font-bold text-gray-900 mt-1">Esta página no existe</h2>
      <p className="text-gray-500 mt-1">
        La ruta que buscas no está registrada en la aplicación.
      </p>
      <Link
        to="/"
        className="inline-block mt-6 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
