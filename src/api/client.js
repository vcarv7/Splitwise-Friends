const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'
const ACCESS_TOKEN_KEY = 'splitwise_access_token'
const REFRESH_TOKEN_KEY = 'splitwise_refresh_token'
const DEFAULT_RETRY_AFTER_SECONDS = 60

function readToken(key) {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeToken(key, value) {
  try {
    if (value) {
      window.localStorage.setItem(key, value)
    } else {
      window.localStorage.removeItem(key)
    }
  } catch {
    // Storage can be unavailable (private mode, etc.); tokens simply won't persist.
  }
}

function clearTokens() {
  writeToken(ACCESS_TOKEN_KEY, null)
  writeToken(REFRESH_TOKEN_KEY, null)
}

// DRF sends Retry-After as whole seconds; the HTTP-date branch keeps the parser
// correct if a proxy ever rewrites it to the other valid form.
function readRetryAfter(headerValue, detail) {
  const raw = headerValue?.trim()
  if (raw) {
    const seconds = Number(raw)
    if (Number.isFinite(seconds) && seconds >= 0) {
      return Math.ceil(seconds)
    }
    // Only a non-numeric value can be an HTTP-date. `Date.parse("-5")` returns
    // a valid date in the past, so trying it for an invalid negative header
    // would unlock the form instead of applying the safe default.
    if (!Number.isFinite(seconds)) {
      const date = Date.parse(raw)
      if (!Number.isNaN(date)) {
        return Math.max(0, Math.ceil((date - Date.now()) / 1000))
      }
    }
  }

  // The detail carries the same number. It is only a fallback: the UI never
  // renders it, so the countdown stays the single visible source.
  const match = /(\d+)\s*seconds?/i.exec(detail ?? '')
  return match ? Number(match[1]) : DEFAULT_RETRY_AFTER_SECONDS
}

async function request(path, { method = 'GET', body, authenticated = false } = {}) {
  const accessToken = readToken(ACCESS_TOKEN_KEY)
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authenticated && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(
      data?.detail ?? `Request failed with status ${response.status}`,
    )
    error.status = response.status
    if (response.status === 429) {
      error.retryAfter = readRetryAfter(
        response.headers?.get('Retry-After'),
        data?.detail,
      )
    }
    throw error
  }
  return data
}

export const api = {
  me: () => request('/api/v1/usuario/me/', { authenticated: true }),
  login: async ({ username, password }) => {
    const data = await request('/api/v1/usuario/token/', {
      method: 'POST',
      body: { username, password },
    })
    writeToken(ACCESS_TOKEN_KEY, data.access)
    writeToken(REFRESH_TOKEN_KEY, data.refresh)
    return data
  },
  register: async ({ username, email, password }) => {
    const data = await request('/api/v1/usuario/register/', {
      method: 'POST',
      body: { username, email, password },
    })
    return data
  },
  refresh: async () => {
    const refreshToken = readToken(REFRESH_TOKEN_KEY)
    const data = await request('/api/v1/usuario/token/refresh/', {
      method: 'POST',
      body: { refresh: refreshToken },
    })
    writeToken(ACCESS_TOKEN_KEY, data.access)
    writeToken(REFRESH_TOKEN_KEY, data.refresh)
    return data
  },
  clearTokens,
}

export function getApiBaseUrl() {
  return API_BASE_URL
}
