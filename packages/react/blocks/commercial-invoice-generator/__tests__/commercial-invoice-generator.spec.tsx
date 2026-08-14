import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommercialInvoiceGenerator } from '../CommercialInvoiceGenerator'

describe('CommercialInvoiceGenerator (React)', () => {
  it('renders invoice number and customs line items', () => {
    render(<CommercialInvoiceGenerator invoiceNumber="INV-EXP-TEST-REACT" />)
    expect(screen.getByText('INV-EXP-TEST-REACT')).toBeDefined()
    expect(screen.getByText('International Commercial Customs Invoice')).toBeDefined()
    expect(screen.getByText('Customs Line Item Breakdown')).toBeDefined()
  })
  it('renders without crashing', () => {
    const { container, unmount } = render(<CommercialInvoiceGenerator />)
    expect(container).toBeDefined()
    unmount()
  })
})
