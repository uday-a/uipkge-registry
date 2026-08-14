import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FlashSaleOfferBar } from '../FlashSaleOfferBar'

describe('FlashSaleOfferBar (React)', () => {
  it('renders sale title and claim status', () => {
    render(<FlashSaleOfferBar saleTitle="React Flash Deal" claimedPercent={90} itemsLeft={4} />)
    expect(screen.getByText('React Flash Deal')).toBeDefined()
    expect(screen.getByText('90% Claimed')).toBeDefined()
    expect(screen.getByText('Only 4 units remaining in stock')).toBeDefined()
  })
  it('renders without crashing', () => {
    const { container, unmount } = render(<FlashSaleOfferBar />)
    expect(container).toBeDefined()
    unmount()
  })
})
