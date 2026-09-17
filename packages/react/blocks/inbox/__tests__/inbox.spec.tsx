import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Inbox } from '../Inbox'

describe('Inbox', () => {
  it('renders without crashing', () => {
    const { container } = render(<Inbox />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders the folder list with folder labels', () => {
    const { container } = render(<Inbox />)
    const aside = container.querySelector('aside')
    expect(aside).toBeTruthy()
    expect(aside?.textContent).toContain('Inbox')
    expect(aside?.textContent).toContain('Starred')
    expect(aside?.textContent).toContain('Sent')
    expect(aside?.textContent).toContain('Trash')
  })

  it('renders the mail list with mail subjects', () => {
    const { container } = render(<Inbox />)
    expect(container.textContent).toContain('Q2 OKR draft')
    expect(container.textContent).toContain('Dashboard review tomorrow')
  })

  it('renders the search input', () => {
    const { container } = render(<Inbox />)
    const searchInput = container.querySelector('input[placeholder*="Search"]')
    expect(searchInput).toBeTruthy()
  })

  it('renders the Compose button', () => {
    const { container } = render(<Inbox />)
    const buttons = container.querySelectorAll('button')
    const compose = Array.from(buttons).find((b) => b.textContent?.includes('Compose'))
    expect(compose).toBeTruthy()
  })
})
