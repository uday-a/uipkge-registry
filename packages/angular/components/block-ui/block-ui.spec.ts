// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiBlockUiComponent, blockUiVariants } from './block-ui.component'
import { blockUiVariants as reactVariants } from '../../../registry-react/components/block-ui/block-ui.variants'

// React BlockUi parity. If these break, users see: forms that stay editable (or tabbable)
// while a save is in flight, the spinner / message fading with the backdrop opacity, a custom
// icon rendered next to the spinner instead of replacing it, or a rich message rendered
// alongside the default "Loading..." text.

@Component({
  standalone: true,
  imports: [UiBlockUiComponent],
  template: `
    <ui-block-ui id="a" [blocking]="blocked()" message="Saving…" blur><input id="field" /></ui-block-ui>
    <ng-template #ico><svg id="ico"></svg></ng-template>
    <ng-template #msg><p id="rich">Auditing schema</p></ng-template>
    <ui-block-ui id="b" blocking [showSpinner]="false" [icon]="ico" [messageSlot]="msg" class="max-w-md">x</ui-block-ui>
    <ui-block-ui id="c" blocking overlayColor="#0a0a0a" [opacity]="0.7">y</ui-block-ui>
  `,
})
class Host {
  blocked = signal(false)
}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  const q = (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
  return { fixture, q }
}

describe('BlockUi (angular, 6 checks)', () => {
  it('1: unblocked: no overlay, content interactive; host is relative inline-block', () => {
    const { q } = render()
    const a = q('a')
    expect(a.hasAttribute('data-blocked')).toBe(false)
    expect(a.querySelector('[role=status]')).toBeNull()
    const content = a.firstElementChild as HTMLElement
    expect(content.hasAttribute('inert')).toBe(false)
    expect(content.className).toBe('block-ui-content')
    for (const c of ['relative', 'inline-block']) expect(a.classList.contains(c), c).toBe(true)
    expect(blockUiVariants()).toBe(reactVariants())
  })

  it('2: blocking makes content inert + aria-hidden + non-interactive (+ blur)', () => {
    const { fixture, q } = render()
    fixture.componentInstance.blocked.set(true)
    fixture.detectChanges()
    const a = q('a')
    expect(a.getAttribute('data-blocked')).toBe('')
    const content = a.firstElementChild as HTMLElement
    expect(content.hasAttribute('inert')).toBe(true)
    expect(content.getAttribute('aria-hidden')).toBe('true')
    for (const c of ['pointer-events-none', 'blur-[2px]', 'transition-[filter]'])
      expect(content.classList.contains(c), c).toBe(true)
  })

  it('3: overlay is a polite busy status with the lg Spinner and the message', () => {
    const { fixture, q } = render()
    fixture.componentInstance.blocked.set(true)
    fixture.detectChanges()
    const overlay = q('a').querySelector<HTMLElement>('[role=status][aria-busy=true]')!
    expect(overlay.getAttribute('aria-live')).toBe('polite')
    expect(overlay.querySelector('svg[data-slot=spinner]')).not.toBeNull()
    expect(overlay.querySelector('p')!.textContent).toBe('Saving…')
  })

  it('4: opacity applies to the backdrop layer only (default bg-background)', () => {
    const { fixture, q } = render()
    fixture.componentInstance.blocked.set(true)
    fixture.detectChanges()
    const backdrop = q('a').querySelector<HTMLElement>('[role=status] > div')!
    expect(backdrop.style.opacity).toBe('0.6')
    expect(backdrop.classList.contains('bg-background')).toBe(true)
    const dark = q('c').querySelector<HTMLElement>('[role=status] > div')!
    expect(dark.style.opacity).toBe('0.7')
    expect(dark.style.backgroundColor).toBe('rgb(10, 10, 10)')
    expect(dark.classList.contains('bg-background')).toBe(false)
  })

  it('5: icon template replaces the spinner; messageSlot replaces the message in a wrapper div', () => {
    const { q } = render()
    const overlay = q('b').querySelector<HTMLElement>('[role=status]')!
    expect(overlay.querySelector('#ico')).not.toBeNull()
    expect(overlay.querySelector('[data-slot=spinner]')).toBeNull()
    const wrap = overlay.querySelector('#rich')!.parentElement!
    expect(wrap.className).toBe('text-foreground text-sm font-medium')
    expect(overlay.textContent).not.toContain('Loading...')
  })

  it('6: className merges onto the host', () => {
    expect(render().q('b').classList.contains('max-w-md')).toBe(true)
  })
})
