import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BackorderSplitShipmentManager } from '../BackorderSplitShipmentManager'

describe('BackorderSplitShipmentManager (React)', () => {
  it('renders order ID and split packages', () => {
    render(<BackorderSplitShipmentManager orderId="ORD-REACT-SPLIT" />)
    expect(screen.getByText('ORD-REACT-SPLIT')).toBeDefined()
    expect(screen.getByText('Split Shipment & Backorder Triage')).toBeDefined()
    expect(screen.getByText('READY SHIPMENT VALUE')).toBeDefined()
  })
  it('renders without crashing', () => {
    const { container, unmount } = render(<BackorderSplitShipmentManager />)
    expect(container).toBeDefined()
    unmount()
  })
})
