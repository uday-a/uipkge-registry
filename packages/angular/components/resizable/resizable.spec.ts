// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiResizableHandleComponent,
  UiResizablePanelComponent,
  UiResizablePanelGroupComponent,
  adjustLayoutByDelta,
} from './resizable.component'

// react-resizable-panels parity. If these break, users see: panels ignore defaultSize (the
// split renders 50/50 or collapses), dragging the divider does nothing or lets a panel shrink
// past its min size, arrow / Home / End keys stop resizing from the separator, screen readers
// lose the separator's value, a collapsible sidebar will not collapse on Enter, or a saved
// layout (autoSaveId) is forgotten on reload.

@Component({
  standalone: true,
  imports: [UiResizablePanelGroupComponent, UiResizablePanelComponent, UiResizableHandleComponent],
  template: `
    <div
      ui-resizable-panel-group
      [direction]="direction"
      [autoSaveId]="autoSaveId"
      [storage]="storage"
      (layout)="layouts.push($event)"
    >
      <div
        ui-resizable-panel
        id="a"
        [defaultSize]="30"
        [minSize]="20"
        [collapsible]="collapsible"
        (collapse)="events.push('collapse')"
        (expand)="events.push('expand')"
      ></div>
      <div
        ui-resizable-handle
        [withHandle]="withHandle"
        [disabled]="disabled"
        (dragging)="events.push('drag:' + $event)"
      ></div>
      <div ui-resizable-panel id="b" [defaultSize]="70" [minSize]="40"></div>
    </div>
  `,
})
class Host {
  direction: 'horizontal' | 'vertical' = 'horizontal'
  autoSaveId: string | null = null
  storage: Pick<Storage, 'getItem' | 'setItem'> | null = null
  collapsible = false
  withHandle = false
  disabled = false
  layouts: number[][] = []
  events: string[] = []
}

@Component({
  standalone: true,
  imports: [UiResizablePanelGroupComponent, UiResizablePanelComponent, UiResizableHandleComponent],
  template: `
    <div ui-resizable-panel-group>
      <div ui-resizable-panel [defaultSize]="20"></div>
      <div ui-resizable-handle></div>
      <div ui-resizable-panel></div>
      <div ui-resizable-handle></div>
      <div ui-resizable-panel></div>
    </div>
  `,
})
class Unsized {}

async function render(init: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, init)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const root = fixture.nativeElement as HTMLElement
  const group = root.querySelector<HTMLElement>('[data-slot="resizable-panel-group"]')!
  const panels = [...root.querySelectorAll<HTMLElement>('[data-slot="resizable-panel"]')]
  const handle = root.querySelector<HTMLElement>('[data-slot="resizable-handle"]')!
  const settle = async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  }
  const sizes = () => panels.map((p) => p.getAttribute('data-panel-size'))
  const key = async (k: string) => {
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
    await settle()
  }
  const pointer = (type: string, clientX: number, target: EventTarget = document) => {
    const e = new MouseEvent(type, { bubbles: true, cancelable: true, clientX, clientY: 0, button: 0 })
    target.dispatchEvent(e)
  }
  return { fixture, host: fixture.componentInstance, group, panels, handle, sizes, key, pointer, settle }
}

describe('Resizable (angular, 10 checks)', () => {
  it('1: initial layout comes from defaultSize: inline flex, data-panel-size, group styles', async () => {
    const { group, panels, sizes } = await render()
    expect(sizes()).toEqual(['30.0', '70.0'])
    expect(panels[0]!.style.flex).toBe('30 1 0px')
    expect(panels[0]!.style.overflow).toBe('hidden')
    expect(group.style.display).toBe('flex')
    expect(group.style.flexDirection).toBe('row')
    expect(group.getAttribute('data-panel-group-direction')).toBe('horizontal')
  })

  it('2: panels without defaultSize share the remainder', async () => {
    const fixture = TestBed.createComponent(Unsized)
    fixture.detectChanges()
    const sizes = [...(fixture.nativeElement as HTMLElement).querySelectorAll('[data-slot="resizable-panel"]')].map(
      (p) => p.getAttribute('data-panel-size'),
    )
    expect(sizes).toEqual(['20.0', '40.0', '40.0'])
  })

  it('3: handle is a focusable separator with library aria values and data attributes', async () => {
    const { handle } = await render()
    expect(handle.getAttribute('role')).toBe('separator')
    expect(handle.getAttribute('tabindex')).toBe('0')
    expect(handle.getAttribute('aria-controls')).toBe('a')
    expect(handle.getAttribute('aria-valuenow')).toBe('30')
    expect(handle.getAttribute('aria-valuemin')).toBe('20')
    expect(handle.getAttribute('aria-valuemax')).toBe('60')
    expect(handle.getAttribute('data-resize-handle-state')).toBe('inactive')
    expect(handle.getAttribute('data-panel-resize-handle-enabled')).toBe('true')
  })

  it('4: arrow keys resize by 10% along the group axis only', async () => {
    const h = await render()
    await h.key('ArrowRight')
    expect(h.sizes()).toEqual(['40.0', '60.0'])
    await h.key('ArrowDown')
    expect(h.sizes()).toEqual(['40.0', '60.0'])
    expect(h.host.layouts.at(-1)).toEqual([40, 60])
    h.fixture.destroy()
    const v = await render({ direction: 'vertical' })
    expect(v.group.style.flexDirection).toBe('column')
    await v.key('ArrowLeft')
    expect(v.sizes()).toEqual(['30.0', '70.0'])
    await v.key('ArrowDown')
    expect(v.sizes()).toEqual(['40.0', '60.0'])
  })

  it('5: Home / End stop at the min sizes of both panels', async () => {
    const { key, sizes } = await render()
    await key('Home')
    expect(sizes()).toEqual(['20.0', '80.0'])
    await key('End')
    expect(sizes()).toEqual(['60.0', '40.0'])
  })

  it('6: pointer drag moves the divider, reports drag state and dragging output', async () => {
    const { group, handle, pointer, sizes, settle, host } = await render()
    Object.defineProperty(group, 'offsetWidth', { value: 1000 })
    pointer('pointerdown', 300, handle)
    await settle()
    expect(handle.getAttribute('data-resize-handle-state')).toBe('drag')
    expect(handle.getAttribute('data-resize-handle-active')).toBe('pointer')
    pointer('pointermove', 400)
    await settle()
    expect(sizes()).toEqual(['40.0', '60.0'])
    pointer('pointermove', 900) // clamps at b's min 40%
    await settle()
    expect(sizes()).toEqual(['60.0', '40.0'])
    pointer('pointerup', 900)
    await settle()
    expect(handle.getAttribute('data-resize-handle-state')).not.toBe('drag')
    expect(host.events).toEqual(['drag:true', 'drag:false'])
  })

  it('7: Enter collapses a collapsible panel and restores it, firing collapse / expand', async () => {
    const { key, sizes, host } = await render({ collapsible: true })
    await Promise.resolve()
    host.events.length = 0
    await key('Enter')
    expect(sizes()).toEqual(['0.0', '100.0'])
    await key('Enter')
    expect(sizes()).toEqual(['30.0', '70.0'])
    expect(host.events).toEqual(['collapse', 'expand'])
  })

  it('8: a disabled handle ignores keys and pointer', async () => {
    const { key, sizes, handle, pointer } = await render({ disabled: true })
    expect(handle.getAttribute('data-panel-resize-handle-enabled')).toBe('false')
    await key('ArrowRight')
    pointer('pointerdown', 0, handle)
    expect(sizes()).toEqual(['30.0', '70.0'])
  })

  it('9: autoSaveId persists the layout and restores it on the next mount', async () => {
    vi.useFakeTimers()
    const data: Record<string, string> = {}
    const storage = { getItem: (k: string) => data[k] ?? null, setItem: (k: string, v: string) => void (data[k] = v) }
    const first = await render({ autoSaveId: 'split', storage })
    await first.key('ArrowRight')
    vi.advanceTimersByTime(200)
    vi.useRealTimers()
    expect(Object.keys(data)).toEqual(['react-resizable-panels:split'])
    first.fixture.destroy()
    const second = await render({ autoSaveId: 'split', storage })
    expect(second.sizes()).toEqual(['40.0', '60.0'])
  })

  it('10: drag deltas cascade past a panel at its limit (library adjustLayoutByDelta)', () => {
    const c = { collapsedSize: 0, collapsible: false, maxSize: 100, minSize: 0 }
    const layout = [20, 55, 25]
    expect(adjustLayoutByDelta(70, layout, [c, c, c], [0, 1], layout, 'pointer')).toEqual([90, 0, 10])
    const min = [
      { ...c, minSize: 20 },
      { ...c, minSize: 40 },
    ]
    expect(adjustLayoutByDelta(-30, [30, 70], min, [0, 1], [30, 70], 'pointer')).toEqual([20, 80])
  })
})
