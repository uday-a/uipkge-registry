import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Terminal } from '../Terminal'

const lines = [
  { prompt: '$', command: 'npm install', output: 'added 42 packages' },
  { prompt: '$', command: 'npm run build' },
  { type: 'output' as const, output: 'Build complete' },
]

describe('Terminal', () => {
  it('renders container with data-slot="terminal"', () => {
    const { container } = render(<Terminal lines={lines} />)
    expect(container.querySelector('[data-slot="terminal"]')).toBeTruthy()
  })

  it('has data-uipkge', () => {
    const { container } = render(<Terminal lines={lines} />)
    expect(container.querySelector('[data-slot="terminal"]')?.hasAttribute('data-uipkge')).toBe(true)
  })

  it('renders terminal lines with data-slot="terminal-line"', () => {
    const { container } = render(<Terminal lines={lines} />)
    expect(container.querySelectorAll('[data-slot="terminal-line"]').length).toBe(3)
  })

  it('renders command lines with data-slot="terminal-command"', () => {
    const { container } = render(<Terminal lines={lines} />)
    const commands = container.querySelectorAll('[data-slot="terminal-command"]')
    expect(commands.length).toBe(2)
    expect(commands[0].textContent).toContain('npm install')
  })

  it('renders output with data-slot="terminal-output"', () => {
    const { container } = render(<Terminal lines={lines} />)
    const outputs = container.querySelectorAll('[data-slot="terminal-output"]')
    expect(outputs.length).toBe(2)
    expect(outputs[0].textContent).toContain('added 42 packages')
  })

  it('applies data-theme="dark" by default', () => {
    const { container } = render(<Terminal lines={lines} />)
    expect(container.querySelector('[data-slot="terminal"]')?.getAttribute('data-theme')).toBe('dark')
  })

  it('applies data-theme="light" when theme prop is set', () => {
    const { container } = render(<Terminal lines={lines} theme="light" />)
    expect(container.querySelector('[data-slot="terminal"]')?.getAttribute('data-theme')).toBe('light')
  })

  it('renders the title in the title bar', () => {
    const { container } = render(<Terminal lines={lines} title="zsh" />)
    expect(container.textContent).toContain('zsh')
  })
})
