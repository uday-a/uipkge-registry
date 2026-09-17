import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VendorSupplierPortal } from '../VendorSupplierPortal'

describe('VendorSupplierPortal (React)', () => {
  it('renders vendor name, id and open purchase orders', () => {
    render(<VendorSupplierPortal vendorName="Test Vendor Inc" vendorId="VND-REACT-01" />)
    expect(screen.getByText('Test Vendor Inc')).toBeDefined()
    expect(screen.getByText('VND-REACT-01')).toBeDefined()
    expect(screen.getByText('ON-TIME DELIVERY (OTD)')).toBeDefined()
    expect(screen.getByText('Active Purchase Orders (3)')).toBeDefined()
  })
  it('renders without crashing', () => {
    const { container, unmount } = render(<VendorSupplierPortal />)
    expect(container).toBeDefined()
    unmount()
  })
})
