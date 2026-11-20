import { inicioMock } from '../data/inicio.mock.js'

/**
 * Single entry point for the Inicio page data.
 *
 * Returns the contract an async API would return (`data` / `loading` / `error`),
 * so switching to `fetch` later only touches this file.
 */
export function useDashboardData() {
  return {
    data: inicioMock,
    loading: false,
    error: null,
  }
}
