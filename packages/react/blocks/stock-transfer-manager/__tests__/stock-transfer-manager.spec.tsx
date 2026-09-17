import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StockTransferManager } from '../StockTransferManager'

describe('StockTransferManager (React)', () => {
  it('renders transfer ID and manifest line items', () => {
    render(<StockTransferManager transferId="TRF-REACT-001" />)
    expect(screen.getByText('TRF-REACT-001')).toBeDefined()
    expect(screen.getByText('Inter-Warehouse Stock Transfer')).toBeDefined()
    expect(screen.getByText('Manifest Line Items')).toBeDefined()
  })
  it('renders without crashing', () => {
    const { container, unmount } = render(<StockTransferManager />)
    expect(container).toBeDefined()
    unmount()
  })
})
