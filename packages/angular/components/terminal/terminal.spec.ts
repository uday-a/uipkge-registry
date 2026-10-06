// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiTerminalComponent, type TerminalLine } from './terminal.component'

// Terminal, as the docs demos use it. If these break, users see: an empty box instead of the
// title bar + command history, the "$" prompt missing (or shown on log-only lines), the typing
// demo never revealing lines, or a live log tail that does not show newly appended output.

@Component({
  standalone: true,
  imports: [UiTerminalComponent],
  template: `<ui-terminal
    [lines]="lines"
    [title]="title"
    [theme]="theme"
    [typing]="typing"
    [typingSpeed]="50"
    [promptChar]="promptChar"
    maxHeight="160px"
    class="mt-2"
  />`,
})
class Host {
  lines: TerminalLine[] = [
    { command: 'npm run build', output: 'built' },
    { command: 'cd app' },
    { type: 'output', output: '[vite] connected.' },
  ]
  title = 'build — zsh'
  theme: 'dark' | 'light' = 'dark'
  typing = false
  promptChar = '$'
}

async function render(init: Partial<Host> = {}) {
  const f = TestBed.createComponent(Host)
  Object.assign(f.componentInstance, init)
  f.detectChanges()
  await f.whenStable()
  f.detectChanges()
  const el = f.nativeElement.querySelector('ui-terminal') as HTMLElement
  return { f, el, lines: () => el.querySelectorAll('[data-slot=terminal-line]') }
}

describe('Terminal (angular, 7 checks)', () => {
  afterEach(() => vi.useRealTimers())

  it('1: renders the title bar with three dots and the title', async () => {
    const { el } = await render()
    const bar = el.firstElementChild as HTMLElement
    expect(bar.querySelectorAll('.rounded-full').length).toBe(3)
    expect(bar.textContent).toContain('build — zsh')
  })

  it('2: every line renders; commands get the prompt, output-only lines do not', async () => {
    const { el, lines } = await render()
    expect(lines().length).toBe(3)
    const cmds = el.querySelectorAll('[data-slot=terminal-command]')
    expect(cmds.length).toBe(2)
    expect(cmds[0].textContent?.replace(/\s+/g, ' ').trim()).toBe('$npm run build')
    expect(lines()[2].querySelector('[data-slot=terminal-command]')).toBeNull()
    expect(lines()[2].textContent?.trim()).toBe('[vite] connected.')
  })

  it('3: custom promptChar and per-line prompt override', async () => {
    const { el } = await render({
      promptChar: '>',
      lines: [{ command: 'a' }, { prompt: '➜ git:(main)', command: 'b' }],
    })
    const prompts = [...el.querySelectorAll('[data-slot=terminal-command] span:first-child')].map((s) => s.textContent)
    expect(prompts).toEqual(['>', '➜ git:(main)'])
  })

  it('4: dark / light theme classes and data-theme match React', async () => {
    const dark = (await render()).el
    expect(dark.getAttribute('data-theme')).toBe('dark')
    expect(dark.className).toContain('bg-card')
    expect(dark.className).toContain('mt-2')
    const light = (await render({ theme: 'light' })).el
    expect(light.getAttribute('data-theme')).toBe('light')
    expect(light.className).toContain('bg-muted')
  })

  it('5: maxHeight caps the scrolling body', async () => {
    const { el } = await render()
    expect((el.children[1] as HTMLElement).style.maxHeight).toBe('160px')
  })

  it('6: typing reveals one line per typingSpeed tick', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    const { f, lines } = await render({ typing: true })
    expect(lines().length).toBe(0)
    vi.advanceTimersByTime(50)
    f.detectChanges()
    expect(lines().length).toBe(1)
    vi.advanceTimersByTime(100)
    f.detectChanges()
    expect(lines().length).toBe(3)
  })

  it('7: appending a line shows it (live log tail)', async () => {
    const { f, lines } = await render()
    const cmp = f.debugElement.children[0].componentInstance as UiTerminalComponent
    cmp.lines = [...cmp.lines, { command: 'curl /health', output: 'ok' }]
    f.detectChanges()
    expect(lines().length).toBe(4)
  })
})
