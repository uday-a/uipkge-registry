import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { OrganizationChart } from '../index'
import type { OrgNode } from '../types'

const data: OrgNode = {
  id: '1',
  name: 'Alice Smith',
  title: 'CEO',
  children: [
    { id: '2', name: 'Bob Jones', title: 'CTO' },
    {
      id: '3',
      name: 'Carol White',
      title: 'CFO',
      children: [{ id: '4', name: 'Dave Brown', title: 'Accountant' }],
    },
  ],
}

describe('OrganizationChart', () => {
  it('renders container with data-slot="organization-chart"', () => {
    const { container } = render(<OrganizationChart data={data} />)
    expect(container.querySelector('[data-slot="organization-chart"]')).toBeTruthy()
  })

  it('has data-uipkge on container', () => {
    const { container } = render(<OrganizationChart data={data} />)
    expect(container.querySelector('[data-slot="organization-chart"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('applies data-direction="top-down" by default', () => {
    const { container } = render(<OrganizationChart data={data} />)
    expect(container.querySelector('[data-slot="organization-chart"]')?.getAttribute('data-direction')).toBe('top-down')
  })

  it('renders node names', () => {
    const { container } = render(<OrganizationChart data={data} />)
    expect(container.textContent).toContain('Alice Smith')
    expect(container.textContent).toContain('Bob Jones')
  })

  it('renders connector elements when showConnectors is true', () => {
    const { container } = render(<OrganizationChart data={data} showConnectors />)
    expect(container.querySelector('.org-v-line-down')).toBeTruthy()
  })

  it('renders all nodes when defaultExpanded is true', () => {
    const { container } = render(<OrganizationChart data={data} defaultExpanded />)
    expect(container.textContent).toContain('Dave Brown')
  })

  it('collapses children when toggle button is clicked', () => {
    const { container } = render(<OrganizationChart data={data} defaultExpanded />)
    expect(container.textContent).toContain('Bob Jones')
    const toggleBtn = container.querySelector('button[aria-label="Collapse"]')
    fireEvent.click(toggleBtn!)
    expect(container.textContent).not.toContain('Bob Jones')
  })
})
