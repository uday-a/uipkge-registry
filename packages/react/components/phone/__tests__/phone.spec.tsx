import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { Phone } from '../index'

describe('Phone', () => {
  it('renders the iPhone geometry and preserves screen content by default', () => {
    const { container, getByAltText } = render(
      <Phone>
        <img src="/app.png" alt="App screenshot" />
      </Phone>,
    )

    const root = container.querySelector('[data-slot="phone"]')
    expect(root?.getAttribute('data-model')).toBe('iphone-17-pro')
    expect(root?.getAttribute('role')).toBe('group')
    expect(container.querySelector('[data-slot="phone-chassis"]')).toBeTruthy()
    expect(container.querySelector('[data-slot="phone-bezel"]')).toBeTruthy()
    expect(container.querySelector('[data-slot="phone-screen"]')).toBeTruthy()
    expect(container.querySelector('[data-slot="phone-island"]')).toBeTruthy()
    expect(container.querySelector('[data-slot="phone-camera-control"][data-side="right"]')).toBeTruthy()
    expect(container.querySelectorAll('[data-slot="phone-volume-button"][data-side="left"]')).toHaveLength(2)
    expect(getByAltText('App screenshot')).toBeTruthy()
  })

  it('uses the official iPhone chassis aspect ratio', () => {
    const { container } = render(<Phone model="iphone-17-pro" />)
    const chassis = container.querySelector('[data-slot="phone-chassis"]') as HTMLElement
    expect(chassis.style.aspectRatio).toBe('71.9 / 150')
  })

  it('renders Galaxy controls on the right only', () => {
    const { container } = render(<Phone model="galaxy-s26-ultra" />)
    const root = container.querySelector('[data-slot="phone"]')
    const chassis = container.querySelector('[data-slot="phone-chassis"]') as HTMLElement

    expect(root?.getAttribute('data-model')).toBe('galaxy-s26-ultra')
    expect(chassis.style.aspectRatio).toBe('78.1 / 163.6')
    expect(container.querySelector('[data-slot="phone-camera"]')).toBeTruthy()
    expect(container.querySelector('[data-slot="phone-volume-button"][data-side="right"]')).toBeTruthy()
    expect(container.querySelector('[data-slot="phone-side-button"][data-side="right"]')).toBeTruthy()
    expect(container.querySelector('[data-side="left"]')).toBeNull()
    expect(container.querySelector('[data-slot="phone-camera-control"]')).toBeNull()
  })

  it('keeps the deprecated android variant working', () => {
    const { container } = render(<Phone variant="android" />)
    expect(container.querySelector('[data-slot="phone"]')?.getAttribute('data-model')).toBe('galaxy-s26-ultra')
  })

  it('uses the selected size as the chassis width without wrapper padding', () => {
    const { container } = render(<Phone size="lg" />)
    const root = container.querySelector('[data-slot="phone"]')
    expect(root?.className).toContain('w-[340px]')
    expect(root?.className).not.toContain('px-1')
  })
})
