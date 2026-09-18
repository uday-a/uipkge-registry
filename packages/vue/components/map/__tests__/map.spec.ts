import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('mapbox-gl', () => {
  class NavigationControl {
    showCompass = false
  }
  class FullscreenControl {}
  return {
    default: {
      NavigationControl,
      FullscreenControl,
      Map: class {},
    },
    NavigationControl,
    FullscreenControl,
  }
})

vi.mock('@studiometa/vue-mapbox-gl', () => ({
  MapboxMap: {
    name: 'MapboxMap',
    props: { accessToken: { type: String, default: '' }, mapStyle: { type: String, default: '' } },
    template: '<div class="mock-mapbox-map"><slot /></div>',
  },
  MapboxMarker: { name: 'MapboxMarker', template: '<div><slot /></div>' },
  MapboxPopup: { name: 'MapboxPopup', template: '<div><slot /></div>' },
  MapboxLayer: { name: 'MapboxLayer', template: '<div />' },
  MapboxSource: { name: 'MapboxSource', template: '<div />' },
  MapboxNavigationControl: { name: 'MapboxNavigationControl', template: '<div />' },
  MapboxFullscreenControl: { name: 'MapboxFullscreenControl', template: '<div />' },
}))

import { Map } from '../index'

describe('Map', () => {
  it('renders container with data-slot="map"', () => {
    const w = mount(Map, { props: { accessToken: 'test-token' }, attachTo: document.body })
    expect(w.find('[data-slot="map"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge on container', () => {
    const w = mount(Map, { props: { accessToken: 'test-token' }, attachTo: document.body })
    expect(w.find('[data-slot="map"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders without crashing', () => {
    const w = mount(Map, { props: { accessToken: 'test-token' }, attachTo: document.body })
    expect(w.find('[data-slot="map"]').exists()).toBe(true)
    w.unmount()
  })

  it('applies custom class', () => {
    const w = mount(Map, { props: { accessToken: 'test-token', class: 'h-96' }, attachTo: document.body })
    expect(w.find('[data-slot="map"]').classes()).toContain('h-96')
    w.unmount()
  })

  it('renders as a div', () => {
    const w = mount(Map, { props: { accessToken: 'test-token' }, attachTo: document.body })
    expect(w.find('div[data-slot="map"]').exists()).toBe(true)
    w.unmount()
  })

  it('has bg-muted class by default', () => {
    const w = mount(Map, { props: { accessToken: 'test-token' }, attachTo: document.body })
    expect(w.find('[data-slot="map"]').classes()).toContain('bg-muted')
    w.unmount()
  })
})
