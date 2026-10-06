// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiAccordionComponent,
  UiAccordionContentComponent,
  UiAccordionHeaderComponent,
  UiAccordionItemComponent,
  UiAccordionTriggerComponent,
  type AccordionType,
  type AccordionVariant,
} from './accordion.component'

// Radix Accordion parity, as the React demo uses it. If these break, users see: clicking a
// question does nothing, several FAQ panels stay open in single mode, a "non-collapsible"
// panel closes to nothing, arrow keys stop moving between questions, the separated / ghost
// look silently falls back to default borders, or panels snap instead of animating because
// --radix-accordion-content-height is never set.

@Component({
  standalone: true,
  imports: [
    UiAccordionComponent,
    UiAccordionItemComponent,
    UiAccordionHeaderComponent,
    UiAccordionTriggerComponent,
    UiAccordionContentComponent,
  ],
  template: `
    <ui-accordion
      [type]="type"
      [collapsible]="collapsible"
      [variant]="variant"
      [defaultValue]="defaultValue"
      (valueChange)="changes.push($event)"
    >
      <ui-accordion-item value="a">
        <h3 ui-accordion-header><button ui-accordion-trigger>A</button></h3>
        <ui-accordion-content>Panel A</ui-accordion-content>
      </ui-accordion-item>
      <ui-accordion-item value="b" [disabled]="bDisabled">
        <button ui-accordion-trigger>B</button>
        <ui-accordion-content>Panel B</ui-accordion-content>
      </ui-accordion-item>
      <ui-accordion-item value="c">
        <button ui-accordion-trigger>C</button>
        <ui-accordion-content>Panel C</ui-accordion-content>
      </ui-accordion-item>
    </ui-accordion>
  `,
})
class Host {
  type: AccordionType = 'single'
  collapsible = false
  variant: AccordionVariant = 'default'
  defaultValue?: string | string[]
  bDisabled = false
  changes: (string | string[])[] = []
}

async function render(init: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, init)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const root = fixture.nativeElement as HTMLElement
  const triggers = [...root.querySelectorAll<HTMLButtonElement>('[data-slot="accordion-trigger"]')]
  const contents = [...root.querySelectorAll<HTMLElement>('[data-slot="accordion-content"]')]
  const items = [...root.querySelectorAll<HTMLElement>('[data-slot="accordion-item"]')]
  const click = async (i: number) => {
    triggers[i]!.click()
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  }
  const key = (i: number, k: string) => {
    const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })
    triggers[i]!.dispatchEvent(e)
    return e
  }
  const open = () => items.filter((el) => el.getAttribute('data-state') === 'open').length
  return { fixture, root, triggers, contents, items, click, key, open }
}

describe('Accordion (angular, 10 checks)', () => {
  it('1: closed by default -- content hidden with no children, trigger aria wired to its region', async () => {
    const { triggers, contents } = await render()
    expect(contents[0]!.hasAttribute('hidden')).toBe(true)
    expect(contents[0]!.textContent?.trim()).toBe('')
    expect(triggers[0]!.getAttribute('aria-expanded')).toBe('false')
    expect(triggers[0]!.getAttribute('aria-controls')).toBe(contents[0]!.id)
    expect(contents[0]!.getAttribute('aria-labelledby')).toBe(triggers[0]!.id)
    expect(contents[0]!.getAttribute('role')).toBe('region')
    expect(triggers[0]!.getAttribute('type')).toBe('button')
  })
  it('2: clicking a trigger opens its panel inside the pt-0 pb-4 wrapper and emits the value', async () => {
    const { triggers, contents, click, fixture } = await render()
    await click(0)
    expect(triggers[0]!.getAttribute('data-state')).toBe('open')
    expect(contents[0]!.hasAttribute('hidden')).toBe(false)
    expect(contents[0]!.querySelector(':scope > div.pt-0.pb-4')?.textContent).toBe('Panel A')
    expect(fixture.componentInstance.changes).toEqual(['a'])
  })
  it('3: single mode keeps one panel open at a time', async () => {
    const { click, open, items } = await render({ collapsible: true })
    await click(0)
    await click(2)
    expect(open()).toBe(1)
    expect(items[2]!.getAttribute('data-state')).toBe('open')
  })
  it('4: single non-collapsible cannot close the open panel and marks it aria-disabled', async () => {
    const { click, open, triggers, fixture } = await render({ defaultValue: 'a' })
    expect(triggers[0]!.getAttribute('aria-disabled')).toBe('true')
    await click(0)
    expect(open()).toBe(1)
    expect(fixture.componentInstance.changes).toEqual([])
  })
  it('5: single collapsible closes the open panel and emits an empty string', async () => {
    const { click, open, fixture, contents } = await render({ collapsible: true, defaultValue: 'a' })
    await click(0)
    expect(open()).toBe(0)
    expect(fixture.componentInstance.changes).toEqual([''])
    expect(contents[0]!.hasAttribute('hidden')).toBe(true)
  })
  it('6: multiple mode keeps several panels open and emits arrays', async () => {
    const { click, open, fixture } = await render({ type: 'multiple', defaultValue: ['a'] })
    await click(2)
    expect(open()).toBe(2)
    await click(0)
    expect(fixture.componentInstance.changes).toEqual([['a', 'c'], ['c']])
  })
  it('7: ArrowDown / ArrowUp / Home / End rove across enabled triggers, looping and skipping disabled', async () => {
    const { triggers, key } = await render({ bDisabled: true })
    triggers[0]!.focus()
    const e = key(0, 'ArrowDown')
    expect(e.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(triggers[2])
    key(2, 'ArrowDown')
    expect(document.activeElement).toBe(triggers[0])
    key(0, 'ArrowUp')
    expect(document.activeElement).toBe(triggers[2])
    key(2, 'Home')
    expect(document.activeElement).toBe(triggers[0])
    key(0, 'End')
    expect(document.activeElement).toBe(triggers[2])
  })
  it('8: a disabled item ignores clicks and its trigger is a disabled button', async () => {
    const { click, triggers, items } = await render({ bDisabled: true })
    await click(1)
    expect(items[1]!.getAttribute('data-state')).toBe('closed')
    expect(triggers[1]!.disabled).toBe(true)
    expect(items[1]!.hasAttribute('data-disabled')).toBe(true)
  })
  it('9: the root variant reaches items and triggers (React AccordionVariantContext)', async () => {
    const { items, triggers, root } = await render({ variant: 'separated' })
    expect(root.querySelector('[data-slot="accordion"]')!.classList).toContain('space-y-2')
    for (const c of ['rounded-md', 'border', 'border-border', 'bg-card']) expect(items[0]!.classList).toContain(c)
    expect(triggers[0]!.classList).toContain('px-4')
    expect(triggers[0]!.classList).toContain('hover:bg-muted/50')
    expect(triggers[0]!.querySelector('svg.lucide-chevron-down')?.getAttribute('class')).toContain(
      'group-data-[state=open]/accordion-trigger:rotate-180',
    )
  })
  it('10: opening writes --radix-accordion-content-height for the animate-accordion-down keyframes', async () => {
    const { click, contents, root } = await render()
    await click(0)
    expect(contents[0]!.style.getPropertyValue('--radix-accordion-content-height')).toMatch(/px$/)
    expect(contents[0]!.classList).toContain('data-[state=open]:animate-accordion-down')
    const header = root.querySelector('[data-slot="accordion-header"]')!
    expect(header.tagName).toBe('H3')
    expect(header.getAttribute('data-state')).toBe('open')
  })
})
