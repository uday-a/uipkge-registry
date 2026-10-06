// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiClipboardComponent } from './clipboard.component'

// Clipboard, as install-command / API-key rows use it. If these break, users see: clicking the
// copy icon does nothing (nothing lands in their clipboard), no green check / "Copied!"
// confirmation (or one that never resets), a disabled button that still copies, the button
// submitting a surrounding form, or the render-prop label never reacting to the copy.

@Component({
  standalone: true,
  imports: [UiClipboardComponent],
  template: `
    <form (submit)="submitted = true; $event.preventDefault()">
      <ui-clipboard
        [text]="text"
        [label]="label"
        [disabled]="disabled"
        [timeout]="50"
        class="px-3"
        (copyText)="copies.push($event)"
        (success)="ok.push($event)"
        (error)="errors.push($event)"
      >
        <ng-template let-state
          ><span id="rp">{{ state === 'success' ? 'Done!' : 'Copy me' }}</span></ng-template
        >
      </ui-clipboard>
    </form>
  `,
})
class Host {
  text = 'npm install @uipkge/ui'
  label = ''
  disabled = false
  submitted = false
  copies: string[] = []
  ok: string[] = []
  errors: Error[] = []
}

const flush = () => new Promise((r) => setTimeout(r, 0))

async function render(init: Partial<Host> = {}) {
  const f = TestBed.createComponent(Host)
  Object.assign(f.componentInstance, init)
  document.body.appendChild(f.nativeElement)
  f.detectChanges()
  await f.whenStable()
  const btn = f.nativeElement.querySelector('button[data-slot=clipboard]') as HTMLButtonElement
  const click = async () => {
    btn.click()
    await flush()
    f.detectChanges()
  }
  return { f, btn, host: f.componentInstance, click }
}

function mockClipboard(impl: (t: string) => Promise<void>) {
  const writeText = vi.fn(impl)
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  return writeText
}

describe('Clipboard (angular, 7 checks)', () => {
  afterEach(() => Reflect.deleteProperty(navigator, 'clipboard'))

  it('1: renders a native type=button with React classes + the copy icon', async () => {
    const { btn, f } = await render()
    expect(btn.tagName).toBe('BUTTON')
    expect(btn.type).toBe('button')
    expect(btn.className).toContain('text-muted-foreground')
    expect(btn.className).toContain('px-3')
    expect(btn.querySelector('svg.lucide-copy')).not.toBeNull()
    expect(btn.getAttribute('aria-label')).toBe('Copy')
    expect((f.nativeElement.querySelector('ui-clipboard') as HTMLElement).className).toContain('contents')
  })

  it('2: click writes the text to the clipboard and emits copyText then success', async () => {
    const write = mockClipboard(async () => {})
    const { click, host } = await render()
    await click()
    expect(write).toHaveBeenCalledWith('npm install @uipkge/ui')
    expect(host.copies).toEqual(['npm install @uipkge/ui'])
    expect(host.ok).toEqual(['npm install @uipkge/ui'])
  })

  it('3: success swaps to the green check + "Copied!" and resets after timeout', async () => {
    mockClipboard(async () => {})
    const { click, btn, f } = await render()
    await click()
    expect(btn.getAttribute('data-feedback-state')).toBe('success')
    expect(btn.querySelector('svg.lucide-check.text-emerald-500')).not.toBeNull()
    expect(btn.getAttribute('aria-label')).toBe('Copied!')
    await new Promise((r) => setTimeout(r, 70))
    f.detectChanges()
    expect(btn.getAttribute('data-feedback-state')).toBe('idle')
  })

  it('4: a failed write shows the error state and emits error', async () => {
    mockClipboard(async () => {
      throw new Error('denied')
    })
    const { click, btn, host } = await render()
    await click()
    expect(btn.getAttribute('data-feedback-state')).toBe('error')
    expect(btn.getAttribute('aria-label')).toBe('Failed')
    expect(host.errors[0].message).toBe('denied')
  })

  it('5: disabled uses the native attribute and never copies', async () => {
    const write = mockClipboard(async () => {})
    const { click, btn, host } = await render({ disabled: true })
    expect(btn.disabled).toBe(true)
    await click()
    expect(write).not.toHaveBeenCalled()
    expect(host.copies).toEqual([])
  })

  it('6: label renders, and clicking inside a form never submits it', async () => {
    mockClipboard(async () => {})
    const { click, btn, host } = await render({ label: 'Copy key' })
    expect(btn.querySelector('[data-slot=clipboard-label]')?.textContent).toBe('Copy key')
    await click()
    expect(host.submitted).toBe(false)
  })

  it('7: the render-prop template receives the live state', async () => {
    mockClipboard(async () => {})
    const { click, btn } = await render()
    expect(btn.querySelector('#rp')?.textContent).toBe('Copy me')
    await click()
    expect(btn.querySelector('#rp')?.textContent).toBe('Done!')
  })
})
