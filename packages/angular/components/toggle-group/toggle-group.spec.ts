// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiToggleGroupComponent, UiToggleGroupItemComponent } from './toggle-group.component'
import { toggleVariants } from '../toggle/toggle.variants'

// Behaviour parity with the Radix ToggleGroup the React component wraps. If this broke,
// users would see: clicks not pressing items (or single-select not clearing), screen
// readers announcing the wrong role (radio vs pressed button), Tab landing on every item
// instead of one roving stop, arrow keys not moving focus, group variant/size/disabled
// not reaching items, and the sliding pill showing for multi-select.

@Component({
  standalone: true,
  imports: [UiToggleGroupComponent, UiToggleGroupItemComponent],
  template: `
    <div
      ui-toggle-group
      [type]="type"
      [variant]="variant"
      size="sm"
      [disabled]="disabled"
      [animated]="animated"
      [value]="value"
      (valueChange)="value = $event; seen.push($event)"
    >
      <button ui-toggle-group-item value="left">L</button>
      <button ui-toggle-group-item value="center" [disabled]="centerDisabled">C</button>
      <button ui-toggle-group-item value="right">R</button>
    </div>
  `,
})
class Host {
  type: 'single' | 'multiple' = 'single'
  variant: 'default' | 'outline' = 'outline'
  disabled = false
  centerDisabled = false
  animated = true
  value: any = 'center'
  seen: unknown[] = []
}

function setup(patch: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, patch)
  fixture.detectChanges()
  const root = fixture.nativeElement.querySelector('[data-slot="toggle-group"]') as HTMLElement
  const items = [...root.querySelectorAll<HTMLButtonElement>('[data-slot="toggle-group-item"]')]
  const click = (i: number) => {
    items[i]!.click()
    fixture.detectChanges()
  }
  const key = (i: number, k: string) => {
    items[i]!.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
    fixture.detectChanges()
  }
  return { fixture, host: fixture.componentInstance, root, items, click, key }
}

describe('ToggleGroup (angular, 10 checks)', () => {
  it('1: single select presses the clicked item and emits its value', () => {
    const { host, items, click } = setup()
    click(0)
    expect(host.seen).toEqual(['left'])
    expect(items.map((b) => b.getAttribute('data-state'))).toEqual(['on', 'off', 'off'])
  })
  it('2: clicking the pressed item in single mode clears the value to "" (Radix deactivate)', () => {
    const { host, items, click } = setup()
    click(1)
    expect(host.seen).toEqual([''])
    expect(items[1]!.getAttribute('data-state')).toBe('off')
  })
  it('3: multiple mode toggles membership of a string[]', () => {
    const { host, click } = setup({ type: 'multiple', value: ['left'] })
    click(2)
    expect(host.value).toEqual(['left', 'right'])
    click(0)
    expect(host.value).toEqual(['right'])
  })
  it('4: single = radiogroup of radios (aria-checked), multiple = toolbar of pressed buttons (aria-pressed)', () => {
    const single = setup()
    expect(single.items[1]!.getAttribute('role')).toBe('radio')
    expect(single.items[1]!.getAttribute('aria-checked')).toBe('true')
    expect(single.items[1]!.hasAttribute('aria-pressed')).toBe(false)
    TestBed.resetTestingModule()
    const multi = setup({ type: 'multiple', value: ['left'] })
    expect(multi.items[0]!.hasAttribute('role')).toBe(false)
    expect(multi.items[0]!.getAttribute('aria-pressed')).toBe('true')
    expect(multi.items[0]!.getAttribute('type')).toBe('button')
    expect(multi.root.getAttribute('role')).toBe('toolbar')
  })
  it('5: roving focus: Tab lands on the group, which forwards to the pressed item; the stop follows focus', () => {
    const { root, items, fixture } = setup()
    expect(root.tabIndex).toBe(0)
    expect(items.map((b) => b.tabIndex)).toEqual([-1, -1, -1])
    root.focus()
    fixture.detectChanges()
    expect(document.activeElement).toBe(items[1])
    items[2]!.focus()
    fixture.detectChanges()
    expect(items.map((b) => b.tabIndex)).toEqual([-1, -1, 0])
  })
  it('6: arrow keys move focus (looping), Home / End jump, selection does not change', () => {
    const { host, items, key } = setup()
    items[2]!.focus()
    key(2, 'ArrowRight')
    expect(document.activeElement).toBe(items[0])
    key(0, 'ArrowLeft')
    expect(document.activeElement).toBe(items[2])
    key(2, 'Home')
    expect(document.activeElement).toBe(items[0])
    key(0, 'End')
    expect(document.activeElement).toBe(items[2])
    expect(host.seen).toEqual([])
  })
  it('7: disabled items are skipped by arrows and cannot be pressed', () => {
    const { host, items, key, click } = setup({ centerDisabled: true, value: 'left' })
    expect(items[1]!.disabled).toBe(true)
    expect(items[1]!.hasAttribute('data-disabled')).toBe(true)
    items[0]!.focus()
    key(0, 'ArrowRight')
    expect(document.activeElement).toBe(items[2])
    click(1)
    expect(host.seen).toEqual([])
  })
  it('8: a disabled group disables every item', () => {
    const { items } = setup({ disabled: true })
    expect(items.every((b) => b.disabled && b.hasAttribute('data-disabled'))).toBe(true)
  })
  it('9: items inherit variant / size / spacing and use toggleVariants classes', () => {
    const { items, root } = setup()
    expect(items[0]!.getAttribute('data-variant')).toBe('outline')
    expect(items[0]!.getAttribute('data-size')).toBe('sm')
    expect(items[0]!.getAttribute('data-spacing')).toBe('0')
    for (const token of toggleVariants({ variant: 'outline', size: 'sm' }).split(' ').slice(0, 5)) {
      expect(items[0]!.classList.contains(token), token).toBe(true)
    }
    expect(root.getAttribute('role')).toBe('radiogroup')
    expect(root.style.getPropertyValue('--gap')).toBe('0')
  })
  it('10: sliding indicator renders only for animated single-select', () => {
    const single = setup()
    expect(single.root.getAttribute('data-animated')).toBe('true')
    expect(single.root.querySelector('[data-slot="toggle-group-indicator"]')).not.toBeNull()
    TestBed.resetTestingModule()
    const multi = setup({ type: 'multiple', value: [] })
    expect(multi.root.getAttribute('data-animated')).toBe('false')
    expect(multi.root.querySelector('[data-slot="toggle-group-indicator"]')).toBeNull()
    TestBed.resetTestingModule()
    const flat = setup({ animated: false })
    expect(flat.root.querySelector('[data-slot="toggle-group-indicator"]')).toBeNull()
  })
})
