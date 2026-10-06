// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiTagsInputComponent } from './tags-input.component'

// Behaviour parity with the React TagsInput. If these break, users notice: Enter / comma no
// longer turn the draft into a chip, duplicates slip in, Backspace does not remove the last
// chip, pasting a list adds one giant tag, the max cap is ignored, the chip X does nothing,
// or a disabled field still shows an input.

const tick = (ms = 0) => new Promise((r) => setTimeout(r, ms))

@Component({
  standalone: true,
  imports: [UiTagsInputComponent],
  template: `
    @if (controlled()) {
      <ui-tags-input
        [value]="tags()"
        (valueChange)="tags.set($event); changes.push($event)"
        [max]="max()"
        [delimiter]="delimiter()"
        [disabled]="disabled()"
        addOnPaste
        placeholder="Add a tag..."
      />
    } @else {
      <ui-tags-input [defaultValue]="['one']" (valueChange)="changes.push($event)" />
    }
  `,
})
class HostComponent {
  readonly controlled = signal(true)
  readonly tags = signal<string[]>(['react'])
  readonly max = signal<number | undefined>(undefined)
  readonly delimiter = signal<string | undefined>(undefined)
  readonly disabled = signal(false)
  changes: string[][] = []
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const root = () => fixture.nativeElement.querySelector('[data-slot="tags-input"]') as HTMLElement
  const input = () => root().querySelector<HTMLInputElement>('input')
  const chips = () => [...root().querySelectorAll('[data-slot="tags-input-item-text"]')].map((c) => c.textContent)
  const settle = async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    await tick()
  }
  const type = async (text: string) => {
    input()!.value = text
    input()!.dispatchEvent(new Event('input'))
    await settle()
  }
  const key = async (k: string) => {
    input()!.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
    await settle()
  }
  return { fixture, host: fixture.componentInstance, root, input, chips, settle, type, key }
}

describe('TagsInput (angular, 8 checks)', () => {
  it('1: renders React chip + input DOM with the React class strings', async () => {
    const { root, input, chips } = await setup()
    for (const c of ['border-input', 'bg-background', 'flex', 'flex-wrap', 'rounded-md', 'px-2', 'py-1']) {
      expect(root().classList).toContain(c)
    }
    expect(chips()).toEqual(['react'])
    expect(root().querySelector('[data-slot="tags-input-item"]')!.className).toContain('bg-secondary')
    expect(root().querySelector('[aria-label="Remove react"] svg.lucide-x')).not.toBeNull()
    expect(input()!.placeholder).toBe('Add a tag...')
  })

  it('2: Enter and comma commit the trimmed draft and clear it', async () => {
    const { host, type, key, input } = await setup()
    await type('  vue  ')
    await key('Enter')
    await type('svelte')
    await key(',')
    expect(host.tags()).toEqual(['react', 'vue', 'svelte'])
    expect(input()!.value).toBe('')
  })

  it('3: duplicates are rejected (unique) and the draft is cleared', async () => {
    const { host, type, key, input } = await setup()
    await type('react')
    await key('Enter')
    expect(host.changes).toEqual([])
    expect(input()!.value).toBe('')
  })

  it('4: Backspace on an empty draft removes the last tag; the chip X removes that tag', async () => {
    const { host, key, root, settle } = await setup((h) => h.tags.set(['a', 'b', 'c']))
    await key('Backspace')
    expect(host.tags()).toEqual(['a', 'b'])
    root().querySelector<HTMLButtonElement>('[aria-label="Remove a"]')!.click()
    await settle()
    expect(host.tags()).toEqual(['b'])
  })

  it('5: addOnPaste splits on whitespace and skips duplicates', async () => {
    const { host, input, settle } = await setup()
    const paste = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent
    Object.defineProperty(paste, 'clipboardData', { value: { getData: () => 'red  green\nreact blue' } })
    input()!.dispatchEvent(paste)
    await settle()
    expect(host.tags()).toEqual(['react', 'red', 'green', 'blue'])
    expect(paste.defaultPrevented).toBe(true)
  })

  it('6: max caps the list and disables the input without a placeholder', async () => {
    const { host, type, key, input } = await setup((h) => {
      h.tags.set(['a'])
      h.max.set(2)
    })
    await type('b')
    await key('Enter')
    expect(host.tags()).toEqual(['a', 'b'])
    expect(input()!.disabled).toBe(true)
    expect(input()!.hasAttribute('placeholder')).toBe(false)
  })

  it('7: delimiter replaces the default commit keys; blur commits the draft', async () => {
    const { host, type, key, input, settle } = await setup((h) => h.delimiter.set(';'))
    await type('x')
    await key('Enter')
    expect(host.tags()).toEqual(['react'])
    await key(';')
    expect(host.tags()).toEqual(['react', 'x'])
    await type('y')
    input()!.dispatchEvent(new Event('blur'))
    await settle()
    expect(host.tags()).toEqual(['react', 'x', 'y'])
  })

  it('8: disabled hides the input; uncontrolled use keeps its own list', async () => {
    const a = await setup((h) => h.disabled.set(true))
    expect(a.input()).toBeNull()
    expect(a.root().classList).toContain('opacity-50')
    TestBed.resetTestingModule()
    const b = await setup((h) => h.controlled.set(false))
    await b.type('two')
    await b.key('Enter')
    expect(b.chips()).toEqual(['one', 'two'])
    expect(b.host.changes).toEqual([['one', 'two']])
  })
})
