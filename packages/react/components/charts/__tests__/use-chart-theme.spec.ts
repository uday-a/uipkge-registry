import { describe, expect, it } from 'vitest'
import { toCanvasColor } from '../useChartTheme'

describe('toCanvasColor', () => {
  it('converts light theme OKLCH chart tokens to canvas-safe RGB', () => {
    expect(toCanvasColor('oklch(0.646 0.222 41.116)')).toBe('rgb(245, 73, 0)')
    expect(toCanvasColor('oklch(82.8% .189 84.429)')).toBe('rgb(255, 185, 0)')
  })

  it('converts dark theme OKLCH chart tokens instead of falling back to black', () => {
    expect(toCanvasColor('oklch(0.488 0.243 264.376)')).toBe('rgb(20, 71, 230)')
  })
})
