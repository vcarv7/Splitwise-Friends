import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '@/api/client.js'
import { AuthContext } from '@/features/auth/context/AuthContext.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    api.me()
      .then((data) => {
        if (cancelled) return
        setUser(data)
        setStatus('authenticated')
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        setStatus('guest')
        setError(null)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async ({ username, password }) => {
    await api.login({ username, password })
    const data = await api.me()
    setUser(data)
    setStatus('authenticated')
    setError(null)
    return data
  }, [])

  const register = useCallback(async ({ username, email, password }) => {
    const data = await api.register({ username, email, password })
    return data
  }, [])

  const logout = useCallback(() => {
    api.clearTokens()
    setUser(null)
    setStatus('guest')
  }, [])

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      isAuthenticated: status === 'authenticated',
      login,
      register,
      logout,
    }),
    [user, status, error, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
