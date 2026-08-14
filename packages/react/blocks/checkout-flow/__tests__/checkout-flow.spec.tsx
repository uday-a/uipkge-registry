import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { CheckoutFlow } from '../CheckoutFlow'

const items = [
  { id: 'i1', name: 'Wireless Headphones', qty: 2, price: 99.0 },
  { id: 'i2', name: 'USB-C Cable', qty: 1, price: 12.5 },
]

describe('CheckoutFlow', () => {
  it('renders without crashing', () => {
    const { container } = render(<CheckoutFlow items={items} />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders the stepper with steps', () => {
    const { container } = render(<CheckoutFlow items={items} />)
    expect(container.textContent).toContain('Cart')
    expect(container.textContent).toContain('Payment')
    expect(container.textContent).toContain('Confirm')
  })

  it('renders cart items with names', () => {
    const { container } = render(<CheckoutFlow items={items} />)
    expect(container.textContent).toContain('Wireless Headphones')
    expect(container.textContent).toContain('USB-C Cable')
  })

  it('renders quantity controls (decrease and increase buttons)', () => {
    const { container } = render(<CheckoutFlow items={items} />)
    const decBtn = container.querySelector('button[aria-label="Decrease"]')
    const incBtn = container.querySelector('button[aria-label="Increase"]')
    expect(decBtn).toBeTruthy()
    expect(incBtn).toBeTruthy()
  })

  it('renders the total summary with Subtotal and Total', () => {
    const { container } = render(<CheckoutFlow items={items} />)
    expect(container.textContent).toContain('Subtotal')
    expect(container.textContent).toContain('Total')
  })

  it('renders the Continue to payment button on the cart step', () => {
    const { container } = render(<CheckoutFlow items={items} />)
    const buttons = container.querySelectorAll('button')
    const continueBtn = Array.from(buttons).find((b) => b.textContent?.includes('Continue to payment'))
    expect(continueBtn).toBeTruthy()
  })

  it('increases quantity when the increase button is clicked', () => {
    const { container } = render(<CheckoutFlow items={items} />)
    // Initial qty for first item is 2
    const qtySpans = container.querySelectorAll('span.w-8')
    expect(qtySpans[0]?.textContent).toBe('2')
    const incBtn = container.querySelector('button[aria-label="Increase"]')!
    fireEvent.click(incBtn)
    const updatedSpans = container.querySelectorAll('span.w-8')
    expect(updatedSpans[0]?.textContent).toBe('3')
  })
})
