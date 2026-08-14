import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WavePickingConsole } from '../WavePickingConsole'

describe('WavePickingConsole (React)', () => {
  it('renders wave ID and pick route sequence table', () => {
    render(<WavePickingConsole waveId="WAVE-TEST-REACT" />)
    expect(screen.getByText('WAVE-TEST-REACT')).toBeDefined()
    expect(screen.getByText('Batch Order Wave Picking Console')).toBeDefined()
    expect(screen.getByText('Optimized Pick Route Sequence')).toBeDefined()
  })
  it('renders without crashing', () => {
    const { container, unmount } = render(<WavePickingConsole />)
    expect(container).toBeDefined()
    unmount()
  })
})
