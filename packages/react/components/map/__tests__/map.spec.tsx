import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup } from '@testing-library/react'

afterEach(cleanup)

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', resolvedTheme: 'light' }),
}))

vi.mock('react-map-gl/mapbox', () => ({
  default: ({ children }: { children?: React.ReactNode }) => <div className="mock-map">{children}</div>,
  NavigationControl: () => <div className="mock-nav" />,
  FullscreenControl: () => <div className="mock-fullscreen" />,
  Marker: () => <div />,
  Popup: () => <div />,
  Layer: () => <div />,
  Source: () => <div />,
}))

import { Map } from '../map'

describe('Map', () => {
  it('renders container with data-slot="map"', () => {
    const { container } = render(<Map accessToken="test-token" />)
    expect(container.querySelector('[data-slot="map"]')).toBeTruthy()
  })

  it('has data-uipkge on container', () => {
    const { container } = render(<Map accessToken="test-token" />)
    expect(container.querySelector('[data-slot="map"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders without crashing', () => {
    const { container } = render(<Map accessToken="test-token" />)
    expect(container.querySelector('[data-slot="map"]')).toBeTruthy()
  })

  it('applies custom class', () => {
    const { container } = render(<Map accessToken="test-token" className="h-96" />)
    expect(container.querySelector('[data-slot="map"]')?.className).toContain('h-96')
  })

  it('renders as a div', () => {
    const { container } = render(<Map accessToken="test-token" />)
    expect(container.querySelector('[data-slot="map"]')?.tagName.toLowerCase()).toBe('div')
  })

  it('has bg-muted class by default', () => {
    const { container } = render(<Map accessToken="test-token" />)
    expect(container.querySelector('[data-slot="map"]')?.className).toContain('bg-muted')
  })

  it('renders a token-required placeholder when accessToken is empty', () => {
    const { container } = render(<Map accessToken="" />)
    expect(container.querySelector('[data-slot="map"]')?.textContent).toContain('Mapbox token required')
  })
})
