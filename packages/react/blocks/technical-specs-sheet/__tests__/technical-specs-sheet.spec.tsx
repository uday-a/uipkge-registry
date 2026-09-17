import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TechnicalSpecsSheet } from '../TechnicalSpecsSheet'

describe('TechnicalSpecsSheet (React)', () => {
  it('renders engineering specs and parameter names', () => {
    render(<TechnicalSpecsSheet modelNumber="APX-REACT-900" />)
    expect(screen.getAllByText(/APX-REACT-900/)[0]).toBeDefined()
    expect(screen.getByText('Frequency Response')).toBeDefined()
    expect(screen.getByText('Metric (SI)')).toBeDefined()
  })
  it('renders without crashing', () => {
    const { container, unmount } = render(<TechnicalSpecsSheet />)
    expect(container).toBeDefined()
    unmount()
  })
})
