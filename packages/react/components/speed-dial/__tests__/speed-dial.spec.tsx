import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, fireEvent, cleanup, act } from '@testing-library/react'
import { Mail, Share } from 'lucide-react'
import { SpeedDial, type SpeedDialAction } from '../index'

afterEach(cleanup)

const actions: SpeedDialAction[] = [
  { icon: Mail, label: 'Email' },
  { icon: Share, label: 'Share' },
]

describe('SpeedDial', () => {
  it('renders a trigger with data-slot="speed-dial" and data-uipkge', () => {
    const { container } = render(<SpeedDial actions={actions} />)
    const trigger = container.querySelector('[data-slot="speed-dial"]')
    expect(trigger).toBeTruthy()
    expect(trigger?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders the main FAB trigger button', () => {
    const { container } = render(<SpeedDial actions={actions} />)
    expect(container.querySelector('[data-slot="fab"]')).toBeTruthy()
  })

  it('renders default Plus icon when no icon prop given', () => {
    const { container } = render(<SpeedDial actions={actions} />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('renders action items when popover is open', async () => {
    const { container } = render(<SpeedDial actions={actions} />)
    await act(async () => {
      fireEvent.click(container.querySelector('[data-slot="fab"]')!)
    })
    const actionButtons = document.body.querySelectorAll('[data-slot="speed-dial-action"]')
    expect(actionButtons.length).toBe(2)
  })

  it('action items have aria-label from action label', async () => {
    const { container } = render(<SpeedDial actions={actions} />)
    await act(async () => {
      fireEvent.click(container.querySelector('[data-slot="fab"]')!)
    })
    const labels = Array.from(document.body.querySelectorAll('[data-slot="speed-dial-action"]')).map((b) =>
      b.getAttribute('aria-label'),
    )
    expect(labels).toEqual(['Email', 'Share'])
  })

  it('action items render icons', async () => {
    const { container } = render(<SpeedDial actions={actions} />)
    await act(async () => {
      fireEvent.click(container.querySelector('[data-slot="fab"]')!)
    })
    const actionButtons = document.body.querySelectorAll('[data-slot="speed-dial-action"]')
    actionButtons.forEach((btn) => {
      expect(btn.querySelector('svg')).toBeTruthy()
    })
  })

  it('calls action handler on click and closes popover', async () => {
    const handler = vi.fn()
    const { container } = render(<SpeedDial actions={[{ icon: Mail, label: 'Email', handler }]} closeOnAction />)
    await act(async () => {
      fireEvent.click(container.querySelector('[data-slot="fab"]')!)
    })
    const actionBtn = document.body.querySelector('[data-slot="speed-dial-action"]')!
    await act(async () => {
      fireEvent.click(actionBtn)
    })
    expect(handler).toHaveBeenCalledOnce()
  })
})
