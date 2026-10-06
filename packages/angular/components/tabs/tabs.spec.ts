// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiTabsComponent,
  UiTabsContentComponent,
  UiTabsListComponent,
  UiTabsTriggerComponent,
  type TabsActivationMode,
  type TabsListVariant,
  type TabsOrientation,
} from './tabs.component'

// Radix Tabs parity, as the React demo uses it. If these break, users see: clicking a tab
// does not switch the panel, every panel renders at once, arrow keys no longer move between
// tabs (or move in the wrong axis for a vertical rail), a disabled tab can still be picked,
// manual activation switches panels on mere focus, or the sliding indicator vanishes /
// sits on the wrong tab.

@Component({
  standalone: true,
  imports: [UiTabsComponent, UiTabsListComponent, UiTabsTriggerComponent, UiTabsContentComponent],
  template: `
    <ui-tabs
      [defaultValue]="defaultValue"
      [orientation]="orientation"
      [activationMode]="activationMode"
      (valueChange)="changes.push($event)"
    >
      <ui-tabs-list [variant]="variant" [animated]="animated">
        <button ui-tabs-trigger value="a">A</button>
        <button ui-tabs-trigger value="b" [disabled]="bDisabled">B</button>
        <button ui-tabs-trigger value="c">C</button>
      </ui-tabs-list>
      <ui-tabs-content value="a"><p>Panel A</p></ui-tabs-content>
      <ui-tabs-content value="b"><p>Panel B</p></ui-tabs-content>
      <ui-tabs-content value="c"><p>Panel C</p></ui-tabs-content>
    </ui-tabs>
  `,
})
class Host {
  defaultValue = 'a'
  orientation: TabsOrientation = 'horizontal'
  activationMode: TabsActivationMode = 'automatic'
  variant: TabsListVariant = 'segmented'
  animated = true
  bDisabled = false
  changes: string[] = []
}

async function render(init: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, init)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const root = fixture.nativeElement as HTMLElement
  const list = root.querySelector<HTMLElement>('[data-slot="tabs-list"]')!
  const triggers = [...root.querySelectorAll<HTMLButtonElement>('[data-slot="tabs-trigger"]')]
  const panels = [...root.querySelectorAll<HTMLElement>('[data-slot="tabs-content"]')]
  const settle = async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  }
  const press = async (i: number) => {
    triggers[i]!.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0 }))
    await settle()
  }
  const key = async (i: number, k: string) => {
    const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })
    triggers[i]!.dispatchEvent(e)
    await settle()
    return e
  }
  const activePanel = () => panels.find((p) => !p.hasAttribute('hidden'))?.textContent?.trim()
  return { fixture, root, list, triggers, panels, press, key, settle, activePanel }
}

describe('Tabs (angular, 10 checks)', () => {
  it('1: only the active panel is shown; inactive panels are hidden and empty', async () => {
    const { panels, activePanel } = await render()
    expect(activePanel()).toBe('Panel A')
    expect(panels[1]!.hasAttribute('hidden')).toBe(true)
    expect(panels[1]!.textContent?.trim()).toBe('')
    expect(panels[0]!.getAttribute('data-state')).toBe('active')
  })
  it('2: tab / panel aria wiring matches Radix (role, aria-selected, controls, labelledby)', async () => {
    const { list, triggers, panels } = await render()
    expect(list.getAttribute('role')).toBe('tablist')
    expect(list.getAttribute('aria-orientation')).toBe('horizontal')
    expect(triggers[0]!.getAttribute('role')).toBe('tab')
    expect(triggers[0]!.getAttribute('aria-selected')).toBe('true')
    expect(triggers[0]!.getAttribute('aria-controls')).toBe(panels[0]!.id)
    expect(panels[0]!.getAttribute('aria-labelledby')).toBe(triggers[0]!.id)
    expect(panels[0]!.getAttribute('role')).toBe('tabpanel')
  })
  it('3: pressing a tab selects it, swaps the panel and emits valueChange', async () => {
    const { press, triggers, activePanel, fixture } = await render()
    await press(2)
    expect(triggers[2]!.getAttribute('data-state')).toBe('active')
    expect(triggers[0]!.getAttribute('data-state')).toBe('inactive')
    expect(activePanel()).toBe('Panel C')
    expect(fixture.componentInstance.changes).toEqual(['c'])
  })
  it('4: a disabled tab cannot be selected and is a disabled button', async () => {
    const { press, triggers, activePanel } = await render({ bDisabled: true })
    await press(1)
    expect(activePanel()).toBe('Panel A')
    expect(triggers[1]!.disabled).toBe(true)
    expect(triggers[1]!.hasAttribute('data-disabled')).toBe(true)
  })
  it('5: ArrowRight / ArrowLeft rove with looping, skip disabled tabs and select on focus (automatic)', async () => {
    const { key, triggers, activePanel } = await render({ bDisabled: true })
    triggers[0]!.focus()
    const e = await key(0, 'ArrowRight')
    expect(e.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(triggers[2])
    expect(activePanel()).toBe('Panel C')
    await key(2, 'ArrowRight')
    expect(document.activeElement).toBe(triggers[0])
    await key(0, 'ArrowLeft')
    expect(document.activeElement).toBe(triggers[2])
  })
  it('6: Home / End jump to the first / last enabled tab', async () => {
    const { key, triggers } = await render()
    triggers[1]!.focus()
    await key(1, 'End')
    expect(document.activeElement).toBe(triggers[2])
    await key(2, 'Home')
    expect(document.activeElement).toBe(triggers[0])
  })
  it('7: vertical orientation uses ArrowDown / ArrowUp and ignores ArrowRight', async () => {
    const { key, triggers, list } = await render({ orientation: 'vertical' })
    expect(list.getAttribute('aria-orientation')).toBe('vertical')
    expect(triggers[0]!.classList).toContain('justify-start')
    triggers[0]!.focus()
    await key(0, 'ArrowRight')
    expect(document.activeElement).toBe(triggers[0])
    await key(0, 'ArrowDown')
    expect(document.activeElement).toBe(triggers[1])
  })
  it('8: manual activation moves focus without switching panels until Enter', async () => {
    const { key, triggers, activePanel } = await render({ activationMode: 'manual' })
    triggers[0]!.focus()
    await key(0, 'ArrowRight')
    expect(document.activeElement).toBe(triggers[1])
    expect(activePanel()).toBe('Panel A')
    await key(1, 'Enter')
    expect(activePanel()).toBe('Panel B')
  })
  it('9: the roving tab stop follows focus (focused tab 0, others -1) and the list forwards focus', async () => {
    const { triggers, list, settle } = await render()
    expect(list.getAttribute('tabindex')).toBe('0')
    list.focus()
    await settle()
    expect(document.activeElement).toBe(triggers[0])
    expect(triggers[0]!.getAttribute('tabindex')).toBe('0')
    expect(triggers[2]!.getAttribute('tabindex')).toBe('-1')
  })
  it('10: the sliding indicator renders first in the list with variant classes, and not when animated=false', async () => {
    const a = await render({ variant: 'pill' })
    const indicator = a.list.firstElementChild as HTMLElement
    expect(indicator.getAttribute('data-slot')).toBe('tabs-indicator')
    expect(indicator.classList).toContain('rounded-full')
    expect(indicator.classList).toContain('bg-primary')
    expect(indicator.style.opacity).toBe('1')
    expect(a.list.getAttribute('data-animated')).toBe('true')
    a.fixture.destroy()
    const b = await render({ animated: false })
    expect(b.list.querySelector('[data-slot="tabs-indicator"]')).toBeNull()
    expect(b.list.getAttribute('data-animated')).toBe('false')
  })
})

describe('Tabs, controlled, on Angular 22 (OnPush by default)', () => {
  // A fresh Angular 22 app makes components OnPush unless they say otherwise. The panel reads
  // the parent's plain @Input value, so without an explicit Eager strategy the new panel was
  // un-hidden but empty after a switch - users saw a blank tab.
  it('switching a controlled value renders the new panel content', () => {
    @Component({
      standalone: true,
      imports: [UiTabsComponent, UiTabsListComponent, UiTabsTriggerComponent, UiTabsContentComponent],
      template: `
        <ui-tabs [value]="tab" (valueChange)="tab = $event">
          <ui-tabs-list>
            <ui-tabs-trigger value="a">A</ui-tabs-trigger>
            <ui-tabs-trigger value="b">B</ui-tabs-trigger>
          </ui-tabs-list>
          <ui-tabs-content value="a">Panel A</ui-tabs-content>
          <ui-tabs-content value="b">Panel B</ui-tabs-content>
        </ui-tabs>
      `,
    })
    class Controlled {
      tab = 'a'
    }
    const fixture = TestBed.createComponent(Controlled)
    fixture.detectChanges()
    const el = fixture.nativeElement as HTMLElement
    const triggerB = [...el.querySelectorAll<HTMLElement>('[role="tab"]')].find((t) => t.textContent?.trim() === 'B')!
    triggerB.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0 }))
    triggerB.click()
    fixture.detectChanges()
    expect(fixture.componentInstance.tab).toBe('b')
    expect(el.textContent).toContain('Panel B')
    expect(el.textContent).not.toContain('Panel A')
  })
})
