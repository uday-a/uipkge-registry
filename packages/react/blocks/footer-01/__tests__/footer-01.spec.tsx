import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Footer01 } from '../Footer01'

describe('Footer01', () => {
  it('renders without crashing', () => {
    const { container } = render(<Footer01 />)
    expect(container.querySelector('footer')).toBeTruthy()
  })

  it('renders the brand section with name Acme', () => {
    const { container } = render(<Footer01 />)
    expect(container.textContent).toContain('Acme')
  })

  it('renders link columns with headings', () => {
    const { container } = render(<Footer01 />)
    expect(container.textContent).toContain('Product')
    expect(container.textContent).toContain('Company')
    expect(container.textContent).toContain('Resources')
    expect(container.textContent).toContain('Legal')
  })

  it('renders the newsletter form with email input and subscribe button', () => {
    const { container } = render(<Footer01 />)
    const form = container.querySelector('form')
    expect(form).toBeTruthy()
    const emailInput = form?.querySelector('input[type="email"]')
    expect(emailInput).toBeTruthy()
    const subscribeBtn = Array.from(form?.querySelectorAll('button') ?? []).find((b) =>
      b.textContent?.includes('Subscribe'),
    )
    expect(subscribeBtn).toBeTruthy()
  })

  it('shows a confirmation message after subscribing', () => {
    const { container } = render(<Footer01 />)
    const form = container.querySelector('form')
    const input = form?.querySelector('input[type="email"]') as HTMLInputElement
    expect(input).toBeTruthy()
    fireEvent.change(input, { target: { value: 'you@company.com' } })
    fireEvent.submit(form!)
    expect(container.textContent).toContain('Thanks')
  })
})
