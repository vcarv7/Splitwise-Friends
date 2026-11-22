import { useCallback, useEffect, useState } from 'react'

/**
 * Countdown driven by a deadline timestamp instead of a decrementing counter.
 *
 * Timers are throttled in background tabs and can be delayed, so subtracting
 * one every tick drifts. Recomputing from `retryUntil` always shows the real
 * remaining time and settles on zero by itself.
 */
export function useRateLimitCountdown() {
  const [retryUntil, setRetryUntil] = useState(null)
  const [remaining, setRemaining] = useState(0)

  useEffect(() => {
    if (retryUntil === null) return

    const tick = () => {
      const left = Math.max(0, Math.ceil((retryUntil - Date.now()) / 1000))
      setRemaining(left)
      if (left === 0) setRetryUntil(null)
    }

    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [retryUntil])

  const start = useCallback((seconds) => {
    const safe = Number.isFinite(seconds) ? Math.max(0, Math.ceil(seconds)) : 60
    if (safe === 0) {
      setRetryUntil(null)
      setRemaining(0)
      return
    }
    setRemaining(safe)
    setRetryUntil(Date.now() + safe * 1000)
  }, [])

  const reset = useCallback(() => {
    setRetryUntil(null)
    setRemaining(0)
  }, [])

  return { remaining, isCounting: remaining > 0, start, reset }
}
