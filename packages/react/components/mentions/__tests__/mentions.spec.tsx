import { describe, it, expect, afterEach } from 'vitest'
import { render, fireEvent, cleanup, act } from '@testing-library/react'
import { Mentions, type MentionOption } from '../index'

const options: MentionOption[] = [
  { value: 'alice', label: 'Alice' },
  { value: 'bob', label: 'Bob' },
]

afterEach(cleanup)

function renderMentions(props: Record<string, unknown> = {}) {
  return render(<Mentions options={options} {...(props as any)} />)
}

describe('Mentions', () => {
  it('renders a textarea input', () => {
    const { container } = renderMentions()
    expect(container.querySelector('textarea')).toBeTruthy()
  })

  it('has data-slot="mentions" and data-uipkge', () => {
    const { container } = renderMentions()
    const el = container.querySelector('[data-slot="mentions"]')
    expect(el).toBeTruthy()
    expect(el?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('textarea has role="combobox"', () => {
    const { container } = renderMentions()
    expect(container.querySelector('textarea')?.getAttribute('role')).toBe('combobox')
  })

  it('renders placeholder text', () => {
    const { container } = renderMentions({ placeholder: 'Type @ to mention' })
    expect(container.querySelector('textarea')?.getAttribute('placeholder')).toBe('Type @ to mention')
  })

  it('shows suggestions when trigger character is typed', async () => {
    const { container } = renderMentions({ value: '' })
    const textarea = container.querySelector('textarea')!
    await act(async () => {
      fireEvent.change(textarea, { target: { value: '@', selectionStart: 1 } })
    })
    const listbox = document.body.querySelector('[role="listbox"]')
    expect(listbox).toBeTruthy()
  })

  it('suggestions list contains option labels', async () => {
    const { container } = renderMentions({ value: '' })
    const textarea = container.querySelector('textarea')!
    await act(async () => {
      fireEvent.change(textarea, { target: { value: '@', selectionStart: 1 } })
    })
    const items = document.body.querySelectorAll('[role="option"]')
    expect(items.length).toBe(2)
    expect(document.body.textContent).toContain('Alice')
    expect(document.body.textContent).toContain('Bob')
  })

  it('supports custom trigger character', async () => {
    const { container } = renderMentions({ triggers: ['#'], prefix: '#', value: '' })
    const textarea = container.querySelector('textarea')!
    await act(async () => {
      fireEvent.change(textarea, { target: { value: '#', selectionStart: 1 } })
    })
    const listbox = document.body.querySelector('[role="listbox"]')
    expect(listbox).toBeTruthy()
  })

  it('does not show suggestions without trigger character', async () => {
    const { container } = renderMentions({ value: '' })
    const textarea = container.querySelector('textarea')!
    await act(async () => {
      fireEvent.change(textarea, { target: { value: 'hello', selectionStart: 5 } })
    })
    const listbox = document.body.querySelector('[role="listbox"]')
    expect(listbox).toBeFalsy()
  })
})

describe('MentionTag', () => {
  it('renders with data-slot="mention-tag"', async () => {
    const { MentionTag } = await import('../index')
    const { container } = render(<MentionTag name="Sarah Connor" handle="sarahc" trigger="@" />)
    const el = container.querySelector('[data-slot="mention-tag"]')
    expect(el).toBeTruthy()
    expect(el?.textContent).toContain('@')
    expect(el?.textContent).toContain('Sarah Connor')
  })
})
