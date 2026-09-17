import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ChatThread } from '../ChatThread'

describe('ChatThread', () => {
  it('renders without crashing', () => {
    const { container } = render(<ChatThread />)
    expect(container.firstChild).toBeTruthy()
  })

  it('renders message bubbles with message text', () => {
    const { container } = render(<ChatThread />)
    expect(container.textContent).toContain('did you get a chance to look at the onboarding doc')
    expect(container.textContent).toContain('looks solid')
  })

  it('renders the composer textarea', () => {
    const { container } = render(<ChatThread />)
    const textarea = container.querySelector('textarea')
    expect(textarea).toBeTruthy()
  })

  it('renders the Send button', () => {
    const { container } = render(<ChatThread />)
    const sendBtn = container.querySelector('button[aria-label="Send"]')
    expect(sendBtn).toBeTruthy()
  })

  it('disables the Send button when the draft is empty', () => {
    const { container } = render(<ChatThread />)
    const sendBtn = container.querySelector('button[aria-label="Send"]') as HTMLButtonElement
    expect(sendBtn).toBeTruthy()
    expect(sendBtn.disabled).toBe(true)
  })
})
