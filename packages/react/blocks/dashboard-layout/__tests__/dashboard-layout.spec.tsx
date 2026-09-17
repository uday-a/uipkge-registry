import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { DashboardLayout } from '../DashboardLayout'

describe('DashboardLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(<DashboardLayout />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders the sidebar with nav items', () => {
    const { container } = render(<DashboardLayout />)
    expect(container.textContent).toContain('Dashboard')
    expect(container.textContent).toContain('People')
    expect(container.textContent).toContain('Settings')
  })

  it('renders a header area with breadcrumb', () => {
    const { container } = render(<DashboardLayout breadcrumbs={[{ label: 'Home' }, { label: 'Dashboard' }]} />)
    expect(container.querySelector('header')).toBeTruthy()
    expect(container.textContent).toContain('Home')
    expect(container.textContent).toContain('Dashboard')
  })

  it('renders the sidebar trigger button', () => {
    const { container } = render(<DashboardLayout />)
    // SidebarTrigger renders as a button inside the header
    const header = container.querySelector('header')
    expect(header).toBeTruthy()
    expect(header?.querySelector('button')).toBeTruthy()
  })

  it('renders children inside the main content area', () => {
    const { container } = render(
      <DashboardLayout>
        <div data-testid="child-content">Hello world</div>
      </DashboardLayout>,
    )
    const main = container.querySelector('main')
    expect(main).toBeTruthy()
    expect(main?.textContent).toContain('Hello world')
  })
})
