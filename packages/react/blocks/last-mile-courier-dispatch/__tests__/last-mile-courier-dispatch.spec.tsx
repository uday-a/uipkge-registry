import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LastMileCourierDispatch } from '../LastMileCourierDispatch'

describe('LastMileCourierDispatch (React)', () => {
  it('renders route ID and delivery manifest table', () => {
    render(<LastMileCourierDispatch routeId="RTE-TEST-REACT" />)
    expect(screen.getByText('RTE-TEST-REACT')).toBeDefined()
    expect(screen.getByText('Last-Mile Courier Dispatch & POD Telemetry')).toBeDefined()
    expect(screen.getByText('Delivery Manifest & Proof of Delivery (POD)')).toBeDefined()
  })
  it('renders without crashing', () => {
    const { container, unmount } = render(<LastMileCourierDispatch />)
    expect(container).toBeDefined()
    unmount()
  })
})
