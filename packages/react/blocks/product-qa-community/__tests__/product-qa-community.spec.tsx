import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ProductQaCommunity } from '../ProductQaCommunity'

describe('ProductQaCommunity (React)', () => {
  it('renders questions and answers', () => {
    render(<ProductQaCommunity productName="React Studio Headphone" />)
    expect(screen.getByText('Questions & Answers')).toBeDefined()
    expect(screen.getByText('Ask a Question')).toBeDefined()
    expect(screen.getByText(/Julian R./)).toBeDefined()
  })
  it('renders without crashing', () => {
    const { container, unmount } = render(<ProductQaCommunity />)
    expect(container).toBeDefined()
    unmount()
  })
})
