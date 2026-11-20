import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()

  const status = isRouteErrorResponse(error) ? error.status : 500
  const message = isRouteErrorResponse(error)
    ? error.statusText
    : (error instanceof Error ? error.message : 'Error inesperado')

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-surface px-6 text-center">
      <span className="text-sm font-bold text-brand-dark">Error {status}</span>
      <h1 className="text-3xl font-bold text-gray-900">Algo se rompió</h1>
      <p className="max-w-md text-gray-500">{message}</p>
      <Link
        to="/"
        className="mt-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
