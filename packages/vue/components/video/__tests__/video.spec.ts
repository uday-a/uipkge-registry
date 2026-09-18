import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { Video } from '../index'

describe('Video', () => {
  it('renders container with data-slot="video"', () => {
    const w = mount(Video, { props: { src: 'test.mp4' }, attachTo: document.body })
    expect(w.find('[data-slot="video"]').exists()).toBe(true)
    w.unmount()
  })

  it('has data-uipkge on container', () => {
    const w = mount(Video, { props: { src: 'test.mp4' }, attachTo: document.body })
    expect(w.find('[data-slot="video"]').attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders video element with data-slot="video-element"', () => {
    const w = mount(Video, { props: { src: 'test.mp4' }, attachTo: document.body })
    expect(w.find('video[data-slot="video-element"]').exists()).toBe(true)
    w.unmount()
  })

  it('renders custom controls with data-slot="video-controls" by default', () => {
    const w = mount(Video, { props: { src: 'test.mp4' }, attachTo: document.body })
    expect(w.find('[data-slot="video-controls"]').exists()).toBe(true)
    w.unmount()
  })

  it('does not render custom controls when nativeControls is true', () => {
    const w = mount(Video, { props: { src: 'test.mp4', nativeControls: true }, attachTo: document.body })
    expect(w.find('[data-slot="video-controls"]').exists()).toBe(false)
    w.unmount()
  })

  it('has role="region" and aria-label', () => {
    const w = mount(Video, { props: { src: 'test.mp4' }, attachTo: document.body })
    const el = w.find('[data-slot="video"]')
    expect(el.attributes('role')).toBe('region')
    expect(el.attributes('aria-label')).toBe('Video player')
    w.unmount()
  })

  it('sets src attribute on video element', () => {
    const w = mount(Video, { props: { src: 'my-video.mp4' }, attachTo: document.body })
    expect(w.find('video').attributes('src')).toBe('my-video.mp4')
    w.unmount()
  })
})

it('shows a recoverable error when the browser rejects playback', async () => {
  const w = mount(Video, { props: { src: 'unsupported.mp4' } })
  vi.spyOn(w.get('video').element, 'play').mockRejectedValue(new DOMException('Unsupported', 'NotSupportedError'))
  await w.get('button[aria-label="Play"]').trigger('click')
  await flushPromises()
  expect(w.get('[role="alert"]').text()).toContain('Unable to play')
  await w.get('video').trigger('play')
  expect(w.find('[role="alert"]').exists()).toBe(false)
  w.unmount()
})
