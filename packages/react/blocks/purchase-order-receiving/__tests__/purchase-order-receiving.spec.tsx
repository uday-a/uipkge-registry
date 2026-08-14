import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PurchaseOrderReceiving } from '../PurchaseOrderReceiving'

describe('PurchaseOrderReceiving (React)', () => {
  it('renders PO number and table', () => {
    render(<PurchaseOrderReceiving poNumber="PO-2026-TEST-REACT" />)
    expect(screen.getByText('PO-2026-TEST-REACT')).toBeDefined()
    expect(screen.getByText('Inbound Goods Receipt & QA Inspection')).toBeDefined()
    expect(screen.getByText('Purchase Order Line Verification')).toBeDefined()
  })
  it('renders without crashing', () => {
    const { container, unmount } = render(<PurchaseOrderReceiving />)
    expect(container).toBeDefined()
    unmount()
  })
})
