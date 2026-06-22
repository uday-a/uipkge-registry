import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, cleanup, waitFor } from '@testing-library/react'

afterEach(cleanup)

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', resolvedTheme: 'light' }),
}))

vi.mock('leaflet', () => {
  const fakeLayer = () => ({
    addTo: vi.fn().mockReturnThis(),
    remove: vi.fn().mockReturnThis(),
    setLatLng: vi.fn(),
    setLatLngs: vi.fn(),
    setStyle: vi.fn(),
    setRadius: vi.fn(),
    setUrl: vi.fn(),
    setOpacity: vi.fn(),
    setZIndex: vi.fn(),
    setZIndexOffset: vi.fn(),
    on: vi.fn(),
    bindPopup: vi.fn(),
    bindTooltip: vi.fn(),
    unbindPopup: vi.fn(),
    unbindTooltip: vi.fn(),
    clearLayers: vi.fn(),
    addData: vi.fn(),
  })
  return {
    map: vi.fn(() => ({
      addLayer: vi.fn(),
      removeLayer: vi.fn(),
      remove: vi.fn(),
      setView: vi.fn(),
      flyTo: vi.fn(),
      panTo: vi.fn(),
      fitBounds: vi.fn(),
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
      invalidateSize: vi.fn(),
      getCenter: vi.fn(() => ({ lat: 20, lng: 0 })),
      getZoom: vi.fn(() => 2),
      getMaxZoom: vi.fn(() => 18),
      getMinZoom: vi.fn(() => 0),
      eachLayer: vi.fn(),
      scrollWheelZoom: { enable: vi.fn(), disable: vi.fn() },
      on: vi.fn(),
    })),
    tileLayer: vi.fn(() => fakeLayer()),
    marker: vi.fn(() => fakeLayer()),
    polyline: vi.fn(() => fakeLayer()),
    polygon: vi.fn(() => fakeLayer()),
    circle: vi.fn(() => fakeLayer()),
    circleMarker: vi.fn(() => fakeLayer()),
    geoJSON: vi.fn(() => fakeLayer()),
    popup: vi.fn(() => ({
      ...fakeLayer(),
      setLatLng: vi.fn().mockReturnThis(),
      setContent: vi.fn().mockReturnThis(),
      openOn: vi.fn(),
    })),
    tooltip: vi.fn(() => ({
      ...fakeLayer(),
      setLatLng: vi.fn().mockReturnThis(),
      setContent: vi.fn().mockReturnThis(),
    })),
    divIcon: vi.fn((opts: any) => opts),
    latLngBounds: vi.fn((a: any, b: any) => [a, b]),
    control: {
      zoom: vi.fn(() => ({ addTo: vi.fn(), remove: vi.fn() })),
      attribution: vi.fn(() => ({ addTo: vi.fn(), remove: vi.fn() })),
    },
    Icon: { Default: { mergeOptions: vi.fn() } },
  }
})

import { LeafletMap } from '../leaflet-map'

describe('LeafletMap', () => {
  it('renders container with data-slot="leaflet-map"', () => {
    const { container } = render(<LeafletMap />)
    expect(container.querySelector('[data-slot="leaflet-map"]')).toBeTruthy()
  })

  it('has data-uipkge on container', () => {
    const { container } = render(<LeafletMap />)
    expect(container.querySelector('[data-slot="leaflet-map"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders without an access token (free tiles)', () => {
    const { container } = render(<LeafletMap />)
    expect(container.textContent).not.toContain('token required')
  })

  it('applies custom class', () => {
    const { container } = render(<LeafletMap className="h-96" />)
    expect(container.querySelector('[data-slot="leaflet-map"]')?.className).toContain('h-96')
  })

  it('renders as a div', () => {
    const { container } = render(<LeafletMap />)
    expect(container.querySelector('[data-slot="leaflet-map"]')?.tagName.toLowerCase()).toBe('div')
  })

  it('has bg-muted class by default', () => {
    const { container } = render(<LeafletMap />)
    expect(container.querySelector('[data-slot="leaflet-map"]')?.className).toContain('bg-muted')
  })

  it('sets data-variant from the variant prop', () => {
    const { container } = render(<LeafletMap variant="satellite" />)
    expect(container.querySelector('[data-slot="leaflet-map"]')?.getAttribute('data-variant')).toBe('satellite')
  })

  it('marks data-muted for the muted variant', () => {
    const { container } = render(<LeafletMap variant="muted" />)
    expect(container.querySelector('[data-slot="leaflet-map"]')?.getAttribute('data-muted')).toBe('true')
  })

  it('shows a fullscreen button only when fullscreen is set', async () => {
    const { container: off } = render(<LeafletMap />)
    expect(off.querySelector('[aria-label="Toggle fullscreen"]')).toBeNull()
    const { container: on } = render(<LeafletMap fullscreen />)
    await waitFor(() => {
      expect(on.querySelector('[aria-label="Toggle fullscreen"]')).toBeTruthy()
    })
  })
})
