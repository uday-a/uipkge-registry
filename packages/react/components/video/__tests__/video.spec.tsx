import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, waitFor, within } from '@testing-library/react'
import { Video } from '../Video'

describe('Video', () => {
  it('renders container with data-slot="video"', () => {
    const { container } = render(<Video src="test.mp4" />)
    expect(container.querySelector('[data-slot="video"]')).toBeTruthy()
  })

  it('has data-uipkge on container', () => {
    const { container } = render(<Video src="test.mp4" />)
    expect(container.querySelector('[data-slot="video"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders video element with data-slot="video-element"', () => {
    const { container } = render(<Video src="test.mp4" />)
    expect(container.querySelector('video[data-slot="video-element"]')).toBeTruthy()
  })

  it('renders custom controls with data-slot="video-controls" by default', () => {
    const { container } = render(<Video src="test.mp4" />)
    expect(container.querySelector('[data-slot="video-controls"]')).toBeTruthy()
  })

  it('does not render custom controls when nativeControls is true', () => {
    const { container } = render(<Video src="test.mp4" nativeControls />)
    expect(container.querySelector('[data-slot="video-controls"]')).toBeFalsy()
  })

  it('has role="region" and aria-label', () => {
    const { container } = render(<Video src="test.mp4" />)
    const el = container.querySelector('[data-slot="video"]')
    expect(el?.getAttribute('role')).toBe('region')
    expect(el?.getAttribute('aria-label')).toBe('Video player')
  })

  it('sets src attribute on video element', () => {
    const { container } = render(<Video src="my-video.mp4" />)
    expect(container.querySelector('video')?.getAttribute('src')).toBe('my-video.mp4')
  })
})

it('shows a recoverable error when the browser rejects playback', async () => {
  const { container, unmount } = render(<Video src="unsupported.mp4" />)
  const { getByRole, queryByRole } = within(container)
  const video = container.querySelector('video')!
  vi.spyOn(video, 'play').mockRejectedValue(new DOMException('Unsupported', 'NotSupportedError'))
  fireEvent.click(getByRole('button', { name: 'Play', exact: true }))
  await waitFor(() => expect(getByRole('alert').textContent).toContain('Unable to play'))
  fireEvent.play(video)
  expect(queryByRole('alert')).toBeNull()
  unmount()
})
