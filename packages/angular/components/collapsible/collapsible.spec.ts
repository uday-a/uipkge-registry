// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiCollapsibleComponent,
  UiCollapsibleContentComponent,
  UiCollapsibleTriggerComponent,
} from './collapsible.component'

// Radix Collapsible, as the demos and NavMain use it. If these break, users see: the toggle
// button does nothing (or submits a form), a closed section still shows / keeps its children
// alive, a controlled parent loses control of open, disabled sections still toggle, screen
// readers lose aria-expanded / aria-controls, or height animations have no
// --radix-collapsible-content-height to animate to.

@Component({
  standalone: true,
  imports: [UiCollapsibleComponent, UiCollapsibleTriggerComponent, UiCollapsibleContentComponent],
  template: `
    <form (submit)="submitted = true; $event.preventDefault()">
      <div
        ui-collapsible
        [defaultOpen]="defaultOpen"
        [disabled]="disabled"
        (openChange)="changes.push($event)"
        class="max-w-md"
      >
        <button ui-collapsible-trigger>Toggle</button>
        <div ui-collapsible-content class="mt-1" [forceMount]="forceMount"><p id="child">Child</p></div>
      </div>
    </form>
  `,
})
class Host {
  defaultOpen = false
  disabled = false
  forceMount = false
  submitted = false
  changes: boolean[] = []
}

@Component({
  standalone: true,
  imports: [UiCollapsibleComponent, UiCollapsibleTriggerComponent, UiCollapsibleContentComponent],
  template: `
    <div ui-collapsible [open]="open" (openChange)="requested.push($event)">
      <button ui-collapsible-trigger>Toggle</button>
      <div ui-collapsible-content><p>Child</p></div>
    </div>
  `,
})
class Controlled {
  open = false
  requested: boolean[] = []
}

async function render(init: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, init)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const root = fixture.nativeElement as HTMLElement
  const trigger = root.querySelector<HTMLButtonElement>('[data-slot="collapsible-trigger"]')!
  const content = root.querySelector<HTMLElement>('[data-slot="collapsible-content"]')!
  const click = async () => {
    trigger.click()
    fixture.detectChanges()
    await fixture.whenStable()
    await new Promise((r) => setTimeout(r, 0))
    fixture.detectChanges()
  }
  return { fixture, host: fixture.componentInstance, root, trigger, content, click }
}

describe('Collapsible (angular, 9 checks)', () => {
  it('1: closed by default: content hidden with its children unmounted', async () => {
    const { content, root } = await render()
    expect(content.hasAttribute('hidden')).toBe(true)
    expect(content.getAttribute('data-state')).toBe('closed')
    expect(root.querySelector('#child')).toBeNull()
    expect(root.querySelector('[data-slot="collapsible"]')!.className).toContain('max-w-md')
  })

  it('2: defaultOpen starts open and renders the children', async () => {
    const { content, root } = await render({ defaultOpen: true })
    expect(content.hasAttribute('hidden')).toBe(false)
    expect(root.querySelector('#child')).not.toBeNull()
  })

  it('3: clicking the trigger toggles both ways and emits openChange', async () => {
    const { click, content, host } = await render()
    await click()
    expect(content.getAttribute('data-state')).toBe('open')
    expect(content.hasAttribute('hidden')).toBe(false)
    await click()
    expect(content.hasAttribute('hidden')).toBe(true)
    expect(host.changes).toEqual([true, false])
  })

  it('4: trigger carries Radix aria + data-state and type="button" (never submits)', async () => {
    const { trigger, content, click, host } = await render()
    expect(trigger.getAttribute('type')).toBe('button')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('aria-controls')).toBe(content.id)
    await click()
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('data-state')).toBe('open')
    expect(host.submitted).toBe(false)
  })

  it('5: disabled root ignores toggles and marks parts data-disabled', async () => {
    const { click, content, trigger, host } = await render({ disabled: true })
    await click()
    expect(content.hasAttribute('hidden')).toBe(true)
    expect(trigger.hasAttribute('data-disabled')).toBe(true)
    expect(host.changes).toEqual([])
  })

  it('6: forceMount keeps the content (and children) rendered while closed', async () => {
    const { content, root } = await render({ forceMount: true })
    expect(content.hasAttribute('hidden')).toBe(false)
    expect(content.getAttribute('data-state')).toBe('closed')
    expect(root.querySelector('#child')).not.toBeNull()
  })

  it('7: controlled open defers to the parent (requests a change, waits for the prop)', async () => {
    const fixture = TestBed.createComponent(Controlled)
    fixture.detectChanges()
    const root = fixture.nativeElement as HTMLElement
    root.querySelector<HTMLElement>('[data-slot="collapsible-trigger"]')!.click()
    fixture.detectChanges()
    expect(fixture.componentInstance.requested).toEqual([true])
    expect(root.querySelector('[data-slot="collapsible-content"]')!.hasAttribute('hidden')).toBe(true)
  })

  it('8: opening exposes the Radix / reka content size CSS variables', async () => {
    const { click, content } = await render()
    await click()
    expect(content.style.getPropertyValue('--radix-collapsible-content-height')).toMatch(/px$/)
    expect(content.style.getPropertyValue('--reka-collapsible-content-width')).toMatch(/px$/)
  })

  it('9: content merges consumer classes after its block display', async () => {
    const { content } = await render()
    expect(content.className.split(' ')).toEqual(expect.arrayContaining(['block', 'mt-1']))
  })
})
