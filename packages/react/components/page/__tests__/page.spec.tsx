import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Page, PageHeader, PageHeaderHeading, PageBody } from '../page'

describe('Page', () => {
  it('renders with data-slot="page"', () => {
    const { container } = render(<Page />)
    expect(container.querySelector('[data-slot="page"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<Page />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders children', () => {
    const { container } = render(
      <Page>
        <p>Body</p>
      </Page>,
    )
    expect(container.textContent).toContain('Body')
  })
})

describe('PageHeader', () => {
  it('renders with data-slot="page-header"', () => {
    const { container } = render(<PageHeader />)
    expect(container.querySelector('[data-slot="page-header"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<PageHeader />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders children', () => {
    const { container } = render(
      <PageHeader>
        <span>Heading</span>
      </PageHeader>,
    )
    expect(container.textContent).toContain('Heading')
  })

  it('renders actions prop content', () => {
    const { container } = render(<PageHeader actions={<button>Action</button>} />)
    expect(container.textContent).toContain('Action')
  })
})

describe('PageHeaderHeading', () => {
  it('renders with data-slot="page-header-heading"', () => {
    const { container } = render(<PageHeaderHeading title="My Title" />)
    expect(container.querySelector('[data-slot="page-header-heading"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<PageHeaderHeading title="My Title" />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })

  it('renders the title in an h2', () => {
    const { container } = render(<PageHeaderHeading title="My Title" />)
    expect(container.querySelector('h2')?.textContent).toBe('My Title')
  })

  it('renders description when provided', () => {
    const { container } = render(<PageHeaderHeading title="T" description="Desc" />)
    expect(container.textContent).toContain('Desc')
  })
})

describe('PageBody', () => {
  it('renders with data-slot="page-body"', () => {
    const { container } = render(<PageBody />)
    expect(container.querySelector('[data-slot="page-body"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<PageBody />)
    expect(container.querySelector('[data-uipkge]')).toBeTruthy()
  })
})
