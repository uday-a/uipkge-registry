import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { CodeBlock } from '../index'

const writeText = vi.fn().mockResolvedValue(undefined)

beforeEach(() => {
  writeText.mockReset().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
    writable: true,
  })
})

function mountCodeBlock(props: Record<string, unknown> = {}) {
  return mount(CodeBlock, { props, attachTo: document.body })
}

describe('CodeBlock', () => {
  it('renders a code element', () => {
    const w = mountCodeBlock({ code: 'const x = 1' })
    expect(w.find('code').exists()).toBe(true)
    w.unmount()
  })

  it('has data-slot="code-block" and data-uipkge', () => {
    const w = mountCodeBlock({ code: 'const x = 1' })
    const root = w.find('[data-slot="code-block"]')
    expect(root.exists()).toBe(true)
    expect(root.attributes('data-uipkge')).toBeDefined()
    w.unmount()
  })

  it('renders code content', () => {
    const w = mountCodeBlock({ code: 'console.log(42)' })
    expect(w.find('code').text()).toContain('console.log(42)')
    w.unmount()
  })

  it('shows language label in header', () => {
    const w = mountCodeBlock({ code: 'x = 1', language: 'python' })
    expect(w.text()).toContain('python')
    w.unmount()
  })

  it('has a copy button', () => {
    const w = mountCodeBlock({ code: 'copy this' })
    const buttons = w.findAll('button')
    const copyBtn = buttons.find((b) => b.text().includes('Copy'))
    expect(copyBtn).toBeTruthy()
    w.unmount()
  })

  it('copy button copies code to clipboard', async () => {
    const w = mountCodeBlock({ code: 'copy this' })
    const buttons = w.findAll('button')
    const copyBtn = buttons.find((b) => b.text().includes('Copy'))!
    await copyBtn.trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('copy this')
    w.unmount()
  })

  it('hides header when showHeader is false', () => {
    const w = mountCodeBlock({ code: 'x = 1', showHeader: false })
    const buttons = w.findAll('button')
    expect(buttons.length).toBe(0)
    w.unmount()
  })

  it('keeps code visible when the hidden header removes the disclosure control', () => {
    const w = mountCodeBlock({ code: 'x = 1', showHeader: false, defaultExpanded: false })
    expect(w.find('code').isVisible()).toBe(true)
    w.unmount()
  })

  it('exposes disclosure state and the controlled code region', async () => {
    const w = mountCodeBlock({ code: 'x = 1', language: 'typescript' })
    const toggle = w.findAll('button').find((button) => button.text().includes('Hide code'))!
    const region = w.find('[role="region"]')

    expect(region.attributes('id')).toBeTruthy()
    expect(region.attributes('aria-label')).toBe('typescript code sample')
    expect(region.attributes('tabindex')).toBe('0')
    expect(toggle.attributes('aria-expanded')).toBe('true')
    expect(toggle.attributes('aria-controls')).toBe(region.attributes('id'))

    await toggle.trigger('click')
    expect(toggle.attributes('aria-expanded')).toBe('false')
    expect(region.isVisible()).toBe(false)
    w.unmount()
  })

  it('renders the supplied source text verbatim', () => {
    const code = 'const x = 1  \n\n'
    const w = mountCodeBlock({ code })
    expect(w.find('code').element.textContent).toBe(code)
    w.unmount()
  })

  it('syntax-highlights recognized languages', async () => {
    const w = mountCodeBlock({ code: 'const answer = 42', language: 'ts' })

    await vi.waitFor(() => expect(w.findAll('[data-syntax-token]').length).toBeGreaterThan(1))

    expect(w.find('[data-syntax-token]').attributes('style')).toContain('--shiki-light')
    w.unmount()
  })

  it('keeps block elements outside the pre element', () => {
    const w = mountCodeBlock({ code: 'x = 1' })
    const childTags = Array.from(w.find('pre').element.children).map((child) => child.tagName)
    expect(childTags).toEqual(['CODE'])
    w.unmount()
  })

  it('shows an announced error when clipboard access fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    writeText.mockRejectedValueOnce(new Error('denied'))
    const w = mountCodeBlock({ code: 'copy this' })
    const copyBtn = w.findAll('button').find((button) => button.text().includes('Copy'))!

    await copyBtn.trigger('click')
    await flushPromises()

    expect(copyBtn.text()).toContain('Copy failed')
    expect(copyBtn.find('[aria-live="polite"]').exists()).toBe(true)
    warn.mockRestore()
    w.unmount()
  })
})
