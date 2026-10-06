// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import {
  UiSelectComponent,
  UiSelectContentComponent,
  UiSelectGroupComponent,
  UiSelectItemComponent,
  UiSelectLabelComponent,
  UiSelectSeparatorComponent,
  UiSelectTriggerComponent,
  UiSelectValueComponent,
} from './select.component'
import { UiNativeSelectComponent } from './native-select.component'

// Behaviour parity with the Radix Select the React component wraps. If this broke, users
// would see: the trigger not opening on press / Enter, the list not portalled over the
// page, the chosen item's text missing from the trigger, no check on the selected option,
// arrow keys / typeahead not moving through options (or wrapping when Radix does not),
// Escape / outside clicks leaving the list open or focus lost, disabled selects opening,
// Angular forms not reaching the value, and forms submitting without the field.

const PARTS = [
  UiSelectComponent,
  UiSelectTriggerComponent,
  UiSelectValueComponent,
  UiSelectContentComponent,
  UiSelectGroupComponent,
  UiSelectLabelComponent,
  UiSelectItemComponent,
  UiSelectSeparatorComponent,
]

@Component({
  standalone: true,
  imports: [...PARTS, ReactiveFormsModule],
  template: `
    <form>
      <div
        ui-select
        [disabled]="disabled"
        name="fruit"
        [value]="value"
        (valueChange)="value = $event; seen.push($event)"
      >
        <button ui-select-trigger class="w-48" [loading]="loading">
          <ui-select-value placeholder="Pick a fruit" />
        </button>
        <ui-select-content>
          <ui-select-group>
            <ui-select-label>Fruits</ui-select-label>
            <ui-select-item value="apple">Apple</ui-select-item>
            <ui-select-item value="banana" disabled>Banana</ui-select-item>
            <ui-select-item value="cherry">Cherry</ui-select-item>
          </ui-select-group>
          <ui-select-separator />
          <ui-select-item value="blueberry">Blueberry</ui-select-item>
        </ui-select-content>
      </div>
    </form>
    <button id="outside">outside</button>
  `,
})
class Host {
  value?: string
  disabled = false
  loading = false
  seen: string[] = []
}

@Component({
  standalone: true,
  imports: [...PARTS, ReactiveFormsModule],
  template: `
    <ui-select [formControl]="control">
      <button ui-select-trigger><ui-select-value placeholder="None" /></button>
      <ui-select-content>
        <ui-select-item value="a">Alpha</ui-select-item>
        <ui-select-item value="b">Beta</ui-select-item>
      </ui-select-content>
    </ui-select>
  `,
})
class FormHost {
  control = new FormControl<string | null>(null)
}

const tick = () => new Promise((r) => setTimeout(r, 0))

function pointerdown(el: Element) {
  const event = new MouseEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 })
  Object.defineProperty(event, 'pointerType', { value: 'mouse' })
  el.dispatchEvent(event)
}

function setup(patch: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, patch)
  fixture.detectChanges()
  const trigger = fixture.nativeElement.querySelector('[data-slot="select-trigger"]') as HTMLButtonElement
  const listbox = () => document.querySelector<HTMLElement>('[data-uipkge-portal] [role="listbox"]')
  const option = (text: string) =>
    [...document.querySelectorAll<HTMLElement>('[data-uipkge-portal] [role="option"]')].find(
      (o) => o.textContent?.trim() === text,
    )!
  const key = (el: Element, k: string) => {
    el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }))
    fixture.detectChanges()
  }
  const open = async () => {
    pointerdown(trigger)
    fixture.detectChanges()
    await tick()
  }
  return { fixture, host: fixture.componentInstance, trigger, listbox, option, key, open }
}

describe('Select (angular, 12 checks)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('1: trigger is a closed combobox showing the placeholder', () => {
    const { trigger } = setup()
    expect(trigger.getAttribute('role')).toBe('combobox')
    expect(trigger.getAttribute('type')).toBe('button')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(trigger.getAttribute('data-state')).toBe('closed')
    expect(trigger.hasAttribute('data-placeholder')).toBe(true)
    expect(trigger.textContent?.trim()).toBe('Pick a fruit')
    expect(trigger.classList.contains('w-48')).toBe(true)
  })
  it('2: mouse pointerdown opens a body-portalled listbox wired to the trigger', async () => {
    const { trigger, listbox, open } = setup()
    await open()
    const list = listbox()!
    expect(list.closest('[data-uipkge-portal]')?.parentElement).toBe(document.body)
    expect(list.getAttribute('data-state')).toBe('open')
    expect(trigger.getAttribute('aria-controls')).toBe(list.id)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(list.querySelectorAll('[role="option"]').length).toBe(4)
  })
  it('3: clicking an option selects it, closes, shows its text in the trigger and refocuses the trigger', async () => {
    const { fixture, host, trigger, listbox, option, open } = setup()
    await open()
    option('Cherry').click()
    fixture.detectChanges()
    expect(host.seen).toEqual(['cherry'])
    expect(listbox()).toBeNull()
    expect(trigger.textContent?.trim()).toBe('Cherry')
    expect(trigger.hasAttribute('data-placeholder')).toBe(false)
    expect(document.activeElement).toBe(trigger)
  })
  it('4: the selected option is checked, shows the indicator, and receives focus on open', async () => {
    const { option, open } = setup({ value: 'cherry' })
    await open()
    const cherry = option('Cherry')
    expect(cherry.getAttribute('data-state')).toBe('checked')
    expect(cherry.querySelector('svg.lucide-check')).not.toBeNull()
    expect(option('Apple').querySelector('svg.lucide-check')).toBeNull()
    expect(document.activeElement).toBe(cherry)
  })
  it('5: Enter opens from the keyboard; arrows skip disabled options and do not wrap', async () => {
    const { fixture, trigger, option, key } = setup()
    key(trigger, 'Enter')
    await tick()
    fixture.detectChanges()
    expect(document.activeElement).toBe(option('Apple'))
    key(option('Apple'), 'ArrowDown')
    expect(document.activeElement).toBe(option('Cherry'))
    key(option('Cherry'), 'End')
    expect(document.activeElement).toBe(option('Blueberry'))
    key(option('Blueberry'), 'ArrowDown')
    expect(document.activeElement).toBe(option('Blueberry'))
    key(option('Blueberry'), 'Home')
    expect(document.activeElement).toBe(option('Apple'))
    key(option('Apple'), 'Enter')
    expect(fixture.componentInstance.seen).toEqual(['apple'])
  })
  it('6: typeahead focuses matches in the open list and selects on a closed trigger', async () => {
    const { host, trigger, listbox, option, key, open } = setup()
    key(trigger, 'c')
    expect(host.seen).toEqual(['cherry'])
    expect(listbox()).toBeNull()
    await open()
    key(listbox()!, 'b')
    // Banana is disabled, so typeahead lands on Blueberry.
    expect(document.activeElement).toBe(option('Blueberry'))
  })
  it('7: Escape and outside pointerdown dismiss and hand focus back to the trigger', async () => {
    const { fixture, trigger, listbox, open } = setup()
    await open()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    fixture.detectChanges()
    expect(listbox()).toBeNull()
    expect(document.activeElement).toBe(trigger)
    await open()
    pointerdown(document.getElementById('outside')!)
    fixture.detectChanges()
    expect(listbox()).toBeNull()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })
  it('8: a disabled (or loading) select cannot open', async () => {
    const { trigger, listbox, open } = setup({ disabled: true })
    expect(trigger.disabled).toBe(true)
    expect(trigger.hasAttribute('data-disabled')).toBe(true)
    await open()
    expect(listbox()).toBeNull()
    TestBed.resetTestingModule()
    const loading = setup({ loading: true })
    expect(loading.trigger.getAttribute('aria-busy')).toBe('true')
    expect(loading.trigger.querySelector('svg.lucide-loader')).not.toBeNull()
    await loading.open()
    expect(loading.listbox()).toBeNull()
  })
  it('9: groups are labelled by their label; separators are decorative', async () => {
    const { listbox, open } = setup()
    await open()
    const group = listbox()!.querySelector('[role="group"]')!
    const label = listbox()!.querySelector('[data-slot="select-label"]')!
    expect(group.getAttribute('aria-labelledby')).toBe(label.id)
    expect(listbox()!.querySelector('[data-slot="select-separator"]')!.getAttribute('aria-hidden')).toBe('true')
  })
  it('10: inside a <form> a hidden native select carries name + value for submission', () => {
    const { fixture } = setup({ value: 'apple' })
    const native = fixture.nativeElement.querySelector('select[name="fruit"]') as HTMLSelectElement
    expect(native).not.toBeNull()
    expect(native.getAttribute('aria-hidden')).toBe('true')
    expect(new FormData(fixture.nativeElement.querySelector('form')).get('fruit')).toBe('apple')
  })
  it('11: [formControl] writes through to the trigger text and picks up user selection', async () => {
    const fixture = TestBed.createComponent(FormHost)
    fixture.detectChanges()
    const trigger = fixture.nativeElement.querySelector('[data-slot="select-trigger"]') as HTMLElement
    fixture.componentInstance.control.setValue('b')
    fixture.detectChanges()
    expect(trigger.textContent?.trim()).toBe('Beta')
    pointerdown(trigger)
    fixture.detectChanges()
    await tick()
    ;[...document.querySelectorAll<HTMLElement>('[role="option"]')]
      .find((o) => o.textContent?.trim() === 'Alpha')!
      .click()
    fixture.detectChanges()
    expect(fixture.componentInstance.control.value).toBe('a')
  })
  it('12: NativeSelect renders options, emits changes and sizes its chevron', () => {
    @Component({
      standalone: true,
      imports: [UiNativeSelectComponent],
      template: `<ui-native-select
        sizeVariant="lg"
        defaultValue="banana"
        [options]="opts"
        (valueChange)="seen.push($event)"
      />`,
    })
    class NativeHost {
      opts = [{ label: 'Apple', value: 'apple' }, { label: 'Banana', value: 'banana' }, 'Cherry']
      seen: string[] = []
    }
    const fixture = TestBed.createComponent(NativeHost)
    fixture.detectChanges()
    const wrapper = fixture.nativeElement.querySelector('[data-slot="native-select-wrapper"]') as HTMLElement
    const select = wrapper.querySelector('select')!
    expect(select.options.length).toBe(3)
    expect(select.value).toBe('banana')
    expect(select.className).toContain('h-11')
    expect(wrapper.querySelector('[data-slot="native-select-icon"]')!.getAttribute('class')).toContain(
      'size-5 right-3.5',
    )
    select.value = 'Cherry'
    select.dispatchEvent(new Event('change'))
    expect(fixture.componentInstance.seen).toEqual(['Cherry'])
  })
})
