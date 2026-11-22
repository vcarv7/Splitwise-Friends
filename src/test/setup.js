import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  // Testing Library only auto-registers cleanup when Vitest globals are on.
  cleanup()
  vi.unstubAllGlobals()
  window.localStorage.clear()
})
