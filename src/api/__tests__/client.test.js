import { afterEach, describe, expect, it, vi } from 'vitest'

import { api } from '@/api/client.js'
import { jsonResponse, mockFetch } from '@/test/apiMocks.js'

const TOKEN_PATH = '/api/v1/usuario/token/'
const REFRESH_PATH = '/api/v1/usuario/token/refresh/'
const ACCESS_KEY = 'splitwise_access_token'
const REFRESH_KEY = 'splitwise_refresh_token'
const USERNAME = 'orestesvcv'
const PASSWORD = 'Clave#Segura2026'

// The HTTP-date test freezes the clock; hand the real timers back afterwards.
afterEach(() => {
  vi.useRealTimers()
})

describe('api client', () => {
  it('persiste access y refresh al iniciar sesión', async () => {
    mockFetch({
      [`POST ${TOKEN_PATH}`]: () =>
        jsonResponse(200, { access: 'a1', refresh: 'r1' }),
    })

    await api.login({ username: USERNAME, password: PASSWORD })

    expect(window.localStorage.getItem(ACCESS_KEY)).toBe('a1')
    expect(window.localStorage.getItem(REFRESH_KEY)).toBe('r1')
  })

  it('rota ambos tokens al refrescar', async () => {
    window.localStorage.setItem(ACCESS_KEY, 'old-access')
    window.localStorage.setItem(REFRESH_KEY, 'old-refresh')
    const fetchMock = mockFetch({
      [`POST ${REFRESH_PATH}`]: () =>
        jsonResponse(200, { access: 'new-access', refresh: 'new-refresh' }),
    })

    await api.refresh()

    expect(window.localStorage.getItem(ACCESS_KEY)).toBe('new-access')
    expect(window.localStorage.getItem(REFRESH_KEY)).toBe('new-refresh')
    const [, refreshInit] = fetchMock.mock.calls[0]
    expect(JSON.parse(refreshInit.body)).toEqual({ refresh: 'old-refresh' })
  })

  it('cae al status cuando el cuerpo del error no es JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 500,
        json: async () => {
          throw new SyntaxError('Unexpected token <')
        },
      })),
    )

    await expect(
      api.login({ username: USERNAME, password: PASSWORD }),
    ).rejects.toThrow('Request failed with status 500')
  })

  it('expone status y retryAfter al recibir un 429', async () => {
    mockFetch({
      [`POST ${TOKEN_PATH}`]: () =>
        jsonResponse(
          429,
          { detail: 'Expected available in 42 seconds.' },
          { 'Retry-After': '42' },
        ),
    })

    await expect(
      api.login({ username: USERNAME, password: PASSWORD }),
    ).rejects.toMatchObject({ status: 429, retryAfter: 42 })
  })

  it('usa el detalle como fallback cuando falta Retry-After', async () => {
    mockFetch({
      [`POST ${TOKEN_PATH}`]: () =>
        jsonResponse(429, { detail: 'Expected available in 17 seconds.' }),
    })

    await expect(
      api.login({ username: USERNAME, password: PASSWORD }),
    ).rejects.toMatchObject({ status: 429, retryAfter: 17 })
  })

  it('interpreta Retry-After como fecha HTTP', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'))
    const retryAt = new Date(Date.now() + 30_000).toUTCString()
    mockFetch({
      [`POST ${TOKEN_PATH}`]: () =>
        jsonResponse(429, {}, { 'Retry-After': retryAt }),
    })

    await expect(
      api.login({ username: USERNAME, password: PASSWORD }),
    ).rejects.toMatchObject({ status: 429, retryAfter: 30 })
  })

  it('trata una fecha HTTP ya vencida como reintento inmediato', async () => {
    mockFetch({
      [`POST ${TOKEN_PATH}`]: () =>
        jsonResponse(
          429,
          {},
          { 'Retry-After': 'Wed, 21 Oct 2015 07:28:00 GMT' },
        ),
    })

    await expect(
      api.login({ username: USERNAME, password: PASSWORD }),
    ).rejects.toMatchObject({ status: 429, retryAfter: 0 })
  })

  it.each([
    ['0', 0],
    ['1.2', 2],
    ['-5', 60],
    ['abc', 60],
    ['Infinity', 60],
    ['   ', 60],
  ])('normaliza un Retry-After %j a %i segundos', async (header, expected) => {
    mockFetch({
      [`POST ${TOKEN_PATH}`]: () =>
        jsonResponse(429, {}, { 'Retry-After': header }),
    })

    await expect(
      api.login({ username: USERNAME, password: PASSWORD }),
    ).rejects.toMatchObject({ status: 429, retryAfter: expected })
  })

  it('lee Retry-After cuando el 429 no trae cuerpo JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: false,
        status: 429,
        headers: { get: () => '30' },
        json: async () => {
          throw new SyntaxError('Unexpected token <')
        },
      })),
    )

    await expect(
      api.login({ username: USERNAME, password: PASSWORD }),
    ).rejects.toMatchObject({
      status: 429,
      retryAfter: 30,
      message: 'Request failed with status 429',
    })
  })
})
