// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiVerticalTabsComponent,
  UiVerticalTabsContentComponent,
  UiVerticalTabsListComponent,
  UiVerticalTabsSectionComponent,
  UiVerticalTabsTriggerComponent,
  type VerticalTabsActivationMode,
} from './vertical-tabs.component'

// Radix Tabs (vertical) parity, as the React demo uses it on settings pages. If these break,
// users see: clicking a rail item does not switch the pane, every pane renders at once,
// ArrowUp / ArrowDown stop moving between items (or ArrowLeft/Right hijack them), a locked item
// can still be picked, section headings become focusable, or the sliding muted surface +
// primary rail vanishes (or paints twice when animation is off).

@Component({
  standalone: true,
  imports: [
    UiVerticalTabsComponent,
    UiVerticalTabsListComponent,
    UiVerticalTabsSectionComponent,
    UiVerticalTabsTriggerComponent,
    UiVerticalTabsContentComponent,
  ],
  template: `
    <div
      ui-vertical-tabs
      [defaultValue]="defaultValue"
      [activationMode]="activationMode"
      (valueChange)="changes.push($event)"
    >
      <div ui-vertical-tabs-list [animated]="animated">
        <div ui-vertical-tabs-section label="Project"></div>
        <button ui-vertical-tabs-trigger value="a">A</button>
        <button ui-vertical-tabs-trigger value="b" [disabled]="bDisabled">B</button>
        <button ui-vertical-tabs-trigger value="c">C</button>
      </div>
      <div ui-vertical-tabs-content value="a"><p>Panel A</p></div>
      <div ui-vertical-tabs-content value="b"><p>Panel B</p></div>
      <div ui-vertical-tabs-content value="c"><p>Panel C</p></div>
    </div>
  `,
})
class Host {
  defaultValue = 'a'
  activationMode: VerticalTabsActivationMode = 'automatic'
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
  const tabs = root.querySelector<HTMLElement>('[data-slot="vertical-tabs"]')!
  const list = root.querySelector<HTMLElement>('[data-slot="vertical-tabs-list"]')!
  const triggers = [...root.querySelectorAll<HTMLButtonElement>('[data-slot="vertical-tabs-trigger"]')]
  const panels = [...root.querySelectorAll<HTMLElement>('[data-slot="vertical-tabs-content"]')]
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
  return { fixture, root, tabs, list, triggers, panels, press, key, settle, activePanel }
}

describe('VerticalTabs (angular, 10 checks)', () => {
  it('1: root is locked vertical with the React layout class', async () => {
    const { tabs, list } = await render()
    expect(tabs.getAttribute('data-orientation')).toBe('vertical')
    expect(tabs.classList).toContain('gap-6')
    expect(list.getAttribute('aria-orientation')).toBe('vertical')
    expect(list.classList).toContain('w-56')
    expect(list.classList).toContain('border-r')
  })
  it('2: only the active panel is shown; inactive panels are hidden and empty', async () => {
    const { panels, activePanel } = await render()
    expect(activePanel()).toBe('Panel A')
    expect(panels[1]!.hasAttribute('hidden')).toBe(true)
    expect(panels[1]!.textContent?.trim()).toBe('')
  })
  it('3: tab / panel aria wiring matches Radix', async () => {
    const { list, triggers, panels } = await render()
    expect(list.getAttribute('role')).toBe('tablist')
    expect(triggers[0]!.getAttribute('role')).toBe('tab')
    expect(triggers[0]!.getAttribute('type')).toBe('button')
    expect(triggers[0]!.getAttribute('aria-selected')).toBe('true')
    expect(triggers[0]!.getAttribute('aria-controls')).toBe(panels[0]!.id)
    expect(panels[0]!.getAttribute('aria-labelledby')).toBe(triggers[0]!.id)
  })
  it('4: pressing an item selects it, swaps the panel and emits valueChange', async () => {
    const { press, triggers, activePanel, fixture } = await render()
    await press(2)
    expect(triggers[2]!.getAttribute('data-state')).toBe('active')
    expect(activePanel()).toBe('Panel C')
    expect(fixture.componentInstance.changes).toEqual(['c'])
  })
  it('5: a disabled item cannot be selected and is a disabled button', async () => {
    const { press, triggers, activePanel } = await render({ bDisabled: true })
    await press(1)
    expect(activePanel()).toBe('Panel A')
    expect(triggers[1]!.disabled).toBe(true)
  })
  it('6: ArrowDown / ArrowUp rove with looping, skip disabled items; ArrowRight is ignored', async () => {
    const { key, triggers, activePanel } = await render({ bDisabled: true })
    triggers[0]!.focus()
    await key(0, 'ArrowRight')
    expect(document.activeElement).toBe(triggers[0])
    const e = await key(0, 'ArrowDown')
    expect(e.defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(triggers[2])
    expect(activePanel()).toBe('Panel C')
    await key(2, 'ArrowDown')
    expect(document.activeElement).toBe(triggers[0])
    await key(0, 'ArrowUp')
    expect(document.activeElement).toBe(triggers[2])
  })
  it('7: Home / End jump to the first / last item', async () => {
    const { key, triggers } = await render()
    triggers[1]!.focus()
    await key(1, 'End')
    expect(document.activeElement).toBe(triggers[2])
    await key(2, 'Home')
    expect(document.activeElement).toBe(triggers[0])
  })
  it('8: manual activation moves focus without switching panels until Enter', async () => {
    const { key, triggers, activePanel } = await render({ activationMode: 'manual' })
    triggers[0]!.focus()
    await key(0, 'ArrowDown')
    expect(document.activeElement).toBe(triggers[1])
    expect(activePanel()).toBe('Panel A')
    await key(1, 'Enter')
    expect(activePanel()).toBe('Panel B')
  })
  it('9: section renders its label as a non-focusable uppercase heading', async () => {
    const { root } = await render()
    const section = root.querySelector<HTMLElement>('[data-slot="vertical-tabs-section"]')!
    expect(section.textContent?.trim()).toBe('Project')
    expect(section.classList).toContain('uppercase')
    expect(section.hasAttribute('tabindex')).toBe(false)
    expect(section.getAttribute('role')).toBeNull()
  })
  it('10: the sliding indicator (surface + primary rail) renders first; animated=false drops it', async () => {
    const a = await render()
    const indicator = a.list.firstElementChild as HTMLElement
    expect(indicator.getAttribute('data-slot')).toBe('vertical-tabs-indicator')
    expect(indicator.classList).toContain('bg-muted')
    expect(indicator.querySelector('.bg-primary')).not.toBeNull()
    expect(indicator.style.opacity).toBe('1')
    expect(a.list.getAttribute('data-animated')).toBe('true')
    a.fixture.destroy()
    const b = await render({ animated: false })
    expect(b.list.querySelector('[data-slot="vertical-tabs-indicator"]')).toBeNull()
    expect(b.list.getAttribute('data-animated')).toBe('false')
  })
})
