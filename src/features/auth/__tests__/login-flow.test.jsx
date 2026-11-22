import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AuthProvider } from '@/features/auth/AuthContext.jsx'
import RequireAuth from '@/features/auth/components/RequireAuth.jsx'
import { useRateLimitCountdown } from '@/features/auth/hooks/useRateLimitCountdown.js'
import LoginPage from '@/features/auth/pages/LoginPage.jsx'
import { deferred, jsonResponse, mockFetch } from '@/test/apiMocks.js'

// Tests that freeze the clock must hand the real timers back: the next test
// would otherwise inherit a frozen Date.now().
afterEach(() => {
  vi.useRealTimers()
})

const TOKEN_PATH = '/api/v1/usuario/token/'
const ME_PATH = '/api/v1/usuario/me/'

const ACCESS_KEY = 'splitwise_access_token'
const REFRESH_KEY = 'splitwise_refresh_token'
const USERNAME = 'orestesvcv'
const PASSWORD = 'Clave#Segura2026'

const USER = {
  id: 'user-1',
  username: USERNAME,
  email: 'orestesvcv@example.com',
}

const GUEST_DETAIL = 'Authentication credentials were not provided.'

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<div>Inicio protegido</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )
}

// The first /me/ belongs to the bootstrap (guest); the second one runs after a
// successful login and must return the user.
function meAfterLogin() {
  let calls = 0
  return () => {
    calls += 1
    return calls === 1
      ? jsonResponse(401, { detail: GUEST_DETAIL })
      : jsonResponse(200, USER)
  }
}

describe('LoginPage', () => {
  it('guarda los tokens y navega al inicio tras un login correcto', async () => {
    const tokenResponse = deferred()
    const fetchMock = mockFetch({
      [`GET ${ME_PATH}`]: meAfterLogin(),
      [`POST ${TOKEN_PATH}`]: () => tokenResponse.promise,
    })

    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Usuario'), USERNAME)
    await user.type(screen.getByLabelText('Contraseña'), PASSWORD)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    // The request is still pending: the form must lock and announce progress.
    expect(await screen.findByRole('button', { name: 'Ingresando…' })).toBeDisabled()

    tokenResponse.resolve(
      jsonResponse(200, { access: 'access-1', refresh: 'refresh-1' }),
    )

    expect(await screen.findByText('Inicio protegido')).toBeInTheDocument()
    expect(window.localStorage.getItem(ACCESS_KEY)).toBe('access-1')
    expect(window.localStorage.getItem(REFRESH_KEY)).toBe('refresh-1')

    const [tokenUrl, tokenInit] = fetchMock.mock.calls.find(
      ([url, init]) =>
        String(url).endsWith(TOKEN_PATH) && init?.method === 'POST',
    )
    expect(new URL(tokenUrl).pathname).toBe(TOKEN_PATH)
    expect(JSON.parse(tokenInit.body)).toEqual({
      username: USERNAME,
      password: PASSWORD,
    })
    expect(tokenInit.headers['Content-Type']).toBe('application/json')
  })

  it('muestra el mensaje del backend y no guarda tokens con credenciales inválidas', async () => {
    mockFetch({
      [`GET ${ME_PATH}`]: () => jsonResponse(401, { detail: GUEST_DETAIL }),
      [`POST ${TOKEN_PATH}`]: () =>
        jsonResponse(401, {
          detail: 'No active account found with the given credentials',
        }),
    })

    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Usuario'), USERNAME)
    await user.type(screen.getByLabelText('Contraseña'), 'incorrecta')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(
      await screen.findByText(
        'No active account found with the given credentials',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Iniciar sesión' }),
    ).toBeInTheDocument()
    expect(window.localStorage.getItem(ACCESS_KEY)).toBeNull()
    expect(window.localStorage.getItem(REFRESH_KEY)).toBeNull()
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeEnabled()
  })

  it('usa Retry-After para un countdown en vivo sin repetir el detalle del backend', async () => {
    mockFetch({
      [`GET ${ME_PATH}`]: () => jsonResponse(401, { detail: GUEST_DETAIL }),
      [`POST ${TOKEN_PATH}`]: () =>
        jsonResponse(
          429,
          { detail: 'Expected available in 2 seconds.' },
          { 'Retry-After': '2' },
        ),
    })

    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Usuario'), USERNAME)
    await user.type(screen.getByLabelText('Contraseña'), PASSWORD)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(
      await screen.findByText('Demasiados intentos. Espera antes de reintentar.'),
    ).toBeInTheDocument()
    // The backend detail repeats the seconds; the button is the only visible
    // source of the number.
    expect(screen.queryByText(/Expected available/)).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reintentar en 2s' }),
    ).toBeDisabled()
    expect(window.localStorage.getItem(ACCESS_KEY)).toBeNull()
    expect(window.localStorage.getItem(REFRESH_KEY)).toBeNull()

    // The button unlocks by itself once the deadline passes.
    expect(
      await screen.findByRole('button', { name: 'Entrar' }, { timeout: 3000 }),
    ).toBeEnabled()
  })

  it('usa los segundos del detalle cuando el navegador no puede leer Retry-After', async () => {
    mockFetch({
      [`GET ${ME_PATH}`]: () => jsonResponse(401, { detail: GUEST_DETAIL }),
      [`POST ${TOKEN_PATH}`]: () =>
        jsonResponse(429, { detail: 'Expected available in 30 seconds.' }),
    })

    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Usuario'), USERNAME)
    await user.type(screen.getByLabelText('Contraseña'), PASSWORD)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(
      await screen.findByRole('button', { name: 'Reintentar en 30s' }),
    ).toBeDisabled()
    expect(screen.queryByText(/Expected available/)).not.toBeInTheDocument()
  })

  it('cae a 60 segundos cuando el 429 no trae header ni detalle', async () => {
    mockFetch({
      [`GET ${ME_PATH}`]: () => jsonResponse(401, { detail: GUEST_DETAIL }),
      [`POST ${TOKEN_PATH}`]: () => jsonResponse(429, {}),
    })

    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Usuario'), USERNAME)
    await user.type(screen.getByLabelText('Contraseña'), PASSWORD)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(
      await screen.findByRole('button', { name: 'Reintentar en 60s' }),
    ).toBeDisabled()
  })

  it('ignora un submit mientras el countdown sigue activo', async () => {
    const fetchMock = mockFetch({
      [`GET ${ME_PATH}`]: () => jsonResponse(401, { detail: GUEST_DETAIL }),
      [`POST ${TOKEN_PATH}`]: () =>
        jsonResponse(429, {}, { 'Retry-After': '30' }),
    })

    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Usuario'), USERNAME)
    await user.type(screen.getByLabelText('Contraseña'), PASSWORD)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(
      await screen.findByRole('button', { name: 'Reintentar en 30s' }),
    ).toBeDisabled()

    // Enter or a programmatic submit bypasses the disabled button; the guard in
    // handleSubmit is what stops the extra request.
    fireEvent.submit(screen.getByLabelText('Usuario').closest('form'))

    const tokenCalls = fetchMock.mock.calls.filter(
      ([url, init]) =>
        String(url).endsWith(TOKEN_PATH) && init?.method === 'POST',
    )
    expect(tokenCalls).toHaveLength(1)
  })

  it('reemplaza el countdown anterior con el valor del segundo 429', async () => {
    let loginCalls = 0
    mockFetch({
      [`GET ${ME_PATH}`]: () => jsonResponse(401, { detail: GUEST_DETAIL }),
      [`POST ${TOKEN_PATH}`]: () => {
        loginCalls += 1
        return loginCalls === 1
          ? jsonResponse(429, {}, { 'Retry-After': '2' })
          : jsonResponse(429, {}, { 'Retry-After': '60' })
      },
    })

    const user = userEvent.setup()
    renderLogin()

    await user.type(screen.getByLabelText('Usuario'), USERNAME)
    await user.type(screen.getByLabelText('Contraseña'), PASSWORD)
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(
      await screen.findByRole('button', { name: 'Reintentar en 2s' }),
    ).toBeDisabled()

    const retry = await screen.findByRole(
      'button',
      { name: 'Entrar' },
      { timeout: 3000 },
    )
    await user.click(retry)

    // The second header replaces the first deadline; it must not be ignored or
    // added to the previous value.
    expect(
      await screen.findByRole('button', { name: /^Reintentar en (59|60)s$/ }),
    ).toBeDisabled()
    expect(loginCalls).toBe(2)
  })
})

describe('useRateLimitCountdown', () => {
  it('recalcula desde el deadline aunque el timer se retrase', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useRateLimitCountdown())

    act(() => result.current.start(3))
    expect(result.current.remaining).toBe(3)
    expect(result.current.isCounting).toBe(true)

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.remaining).toBe(2)

    // A suspended tab can jump several seconds at once; the deadline keeps the
    // value honest instead of subtracting one per tick.
    act(() => vi.advanceTimersByTime(5000))
    expect(result.current.remaining).toBe(0)
    expect(result.current.isCounting).toBe(false)
  })

  it('reemplaza el deadline al recibir un nuevo valor', () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useRateLimitCountdown())

    act(() => result.current.start(10))
    act(() => vi.advanceTimersByTime(4000))
    expect(result.current.remaining).toBe(6)

    // A second 429 arrives with a shorter window: the new deadline wins.
    act(() => result.current.start(3))
    expect(result.current.remaining).toBe(3)

    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.remaining).toBe(2)
  })
})

describe('RequireAuth', () => {
  function renderProtected() {
    return render(
      <MemoryRouter initialEntries={['/']}>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <RequireAuth>
                  <div>Contenido privado</div>
                </RequireAuth>
              }
            />
            <Route path="/login" element={<div>Pantalla de login</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    )
  }

  it('redirige a /login cuando no hay sesión', async () => {
    mockFetch({
      [`GET ${ME_PATH}`]: () => jsonResponse(401, { detail: GUEST_DETAIL }),
    })

    renderProtected()

    expect(await screen.findByText('Pantalla de login')).toBeInTheDocument()
    expect(screen.queryByText('Contenido privado')).not.toBeInTheDocument()
  })

  it('muestra el contenido protegido cuando la sesión es válida', async () => {
    window.localStorage.setItem(ACCESS_KEY, 'access-1')
    window.localStorage.setItem(REFRESH_KEY, 'refresh-1')
    mockFetch({
      [`GET ${ME_PATH}`]: () => jsonResponse(200, USER),
    })

    renderProtected()

    expect(await screen.findByText('Contenido privado')).toBeInTheDocument()
  })
})

