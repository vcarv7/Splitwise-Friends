import { vi } from 'vitest'

export function jsonResponse(status, body, headers = {}) {
  const entries = Object.entries(headers).map(([name, value]) => [
    name.toLowerCase(),
    value,
  ])
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {
      get: (name) => {
        const entry = entries.find(
          ([key]) => key === String(name).toLowerCase(),
        )
        return entry ? entry[1] : null
      },
    },
    json: async () => body,
  }
}

export function deferred() {
  let resolve
  const promise = new Promise((res) => {
    resolve = res
  })
  return { promise, resolve }
}

// Keyed by "METHOD path" instead of a queue: AuthProvider requests /me/ on
// mount, so a queue would make every test depend on incidental call order.
export function mockFetch(handlers) {
  const fetchMock = vi.fn(async (input, init = {}) => {
    const url = new URL(input, 'http://localhost')
    const method = (init.method ?? 'GET').toUpperCase()
    const key = `${method} ${url.pathname}`
    const handler = handlers[key]
    if (!handler) {
      throw new Error(`Petición inesperada: ${key}`)
    }
    return handler({ body: init.body ? JSON.parse(init.body) : undefined })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
