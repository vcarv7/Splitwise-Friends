import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { AuthProvider } from '@/features/auth/AuthContext.jsx'
import RegisterPage from '@/features/auth/pages/RegisterPage.jsx'
import { jsonResponse, mockFetch } from '@/test/apiMocks.js'

const TOKEN_PATH = '/api/v1/usuario/token/'
const ME_PATH = '/api/v1/usuario/me/'
const REGISTER_PATH = '/api/v1/usuario/register/'

const USERNAME = 'orestesvcv'
const EMAIL = 'orestesvcv@example.com'
const PASSWORD = 'Clave#Segura2026'
const USER = { id: 'user-1', username: USERNAME, email: EMAIL }
const GUEST_DETAIL = 'Authentication credentials were not provided.'

function renderRegister() {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
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

describe('RegisterPage', () => {
  it('no vuelve a registrar la cuenta cuando el login posterior queda limitado', async () => {
    let registerCalls = 0
    let loginCalls = 0
    mockFetch({
      [`GET ${ME_PATH}`]: meAfterLogin(),
      [`POST ${REGISTER_PATH}`]: () => {
        registerCalls += 1
        return jsonResponse(201, {
          id: 'user-1',
          username: USERNAME,
          email: EMAIL,
        })
      },
      [`POST ${TOKEN_PATH}`]: () => {
        loginCalls += 1
        return loginCalls === 1
          ? jsonResponse(
              429,
              { detail: 'Expected available in 2 seconds.' },
              { 'Retry-After': '2' },
            )
          : jsonResponse(200, { access: 'a1', refresh: 'r1' })
      },
    })

    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByLabelText('Usuario'), USERNAME)
    await user.type(screen.getByLabelText('Email'), EMAIL)
    await user.type(screen.getByLabelText('Contraseña'), PASSWORD)
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(
      await screen.findByText('Demasiados intentos. Espera antes de reintentar.'),
    ).toBeInTheDocument()
    expect(screen.queryByText(/Expected available/)).not.toBeInTheDocument()
    expect(registerCalls).toBe(1)
    expect(loginCalls).toBe(1)

    const retry = await screen.findByRole(
      'button',
      { name: 'Crear cuenta' },
      { timeout: 3000 },
    )
    await user.click(retry)

    expect(await screen.findByText('Inicio protegido')).toBeInTheDocument()
    expect(registerCalls).toBe(1)
    expect(loginCalls).toBe(2)
  })

  it('muestra el countdown cuando el propio registro queda limitado', async () => {
    let loginCalls = 0
    mockFetch({
      [`GET ${ME_PATH}`]: () => jsonResponse(401, { detail: GUEST_DETAIL }),
      [`POST ${REGISTER_PATH}`]: () =>
        jsonResponse(
          429,
          { detail: 'Expected available in 2 seconds.' },
          { 'Retry-After': '2' },
        ),
      [`POST ${TOKEN_PATH}`]: () => {
        loginCalls += 1
        return jsonResponse(200, { access: 'a1', refresh: 'r1' })
      },
    })

    const user = userEvent.setup()
    renderRegister()

    await user.type(screen.getByLabelText('Usuario'), USERNAME)
    await user.type(screen.getByLabelText('Email'), EMAIL)
    await user.type(screen.getByLabelText('Contraseña'), PASSWORD)
    await user.click(screen.getByRole('button', { name: 'Crear cuenta' }))

    expect(
      await screen.findByText('Demasiados intentos. Espera antes de reintentar.'),
    ).toBeInTheDocument()
    expect(screen.queryByText(/Expected available/)).not.toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Reintentar en 2s' }),
    ).toBeDisabled()
    // The register failed, so the credentials were never sent to the login
    // endpoint.
    expect(loginCalls).toBe(0)
  })
})
