// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import {
  UiRadioButtonComponent,
  UiRadioGroupComponent,
  UiRadioGroupItemComponent,
  normalizeRadioOption,
} from './radio-group.component'

// Radix RadioGroup, as the React RadioGroup ships it: items read one shared value (only
// one dot at a time), the checked radio is the single Tab stop, arrow keys move focus AND
// select (respecting orientation / rtl / loop, skipping disabled), Home / End only move
// focus, Enter does nothing, and a disabled group disables every radio. RadioButton takes
// size / variant / orientation from the group. If these broke, users would see several
// radios selected, radios they cannot reach by keyboard, or selections that never land.

const IMPORTS = [UiRadioGroupComponent, UiRadioGroupItemComponent, UiRadioButtonComponent]

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  document.body.appendChild(el) // focus() needs a connected element
  const radios = () => Array.from(el.querySelectorAll<HTMLElement>('[role="radio"]'))
  const flush = () => fixture.detectChanges()
  const press = (target: HTMLElement, key: string) => {
    const e = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })
    target.dispatchEvent(e)
    flush()
    return e
  }
  const checked = () => radios().map((r) => r.getAttribute('aria-checked'))
  return { fixture, el, radios, flush, press, checked }
}

const items = (attrs = '') => `
  <ui-radio-group ${attrs}>
    <div class="flex items-center gap-2"><ui-radio-group-item id="r1" value="a" /></div>
    <div class="flex items-center gap-2"><ui-radio-group-item id="r2" value="b" /></div>
    <div class="flex items-center gap-2"><ui-radio-group-item id="r3" value="c" [disabled]="true" /></div>
    <div class="flex items-center gap-2"><ui-radio-group-item id="r4" value="d" /></div>
  </ui-radio-group>`

describe('RadioGroup (angular, 11 checks)', () => {
  it('1: renders React DOM: wrapper > role=radiogroup root > item wrappers > button role=radio', () => {
    @Component({ standalone: true, imports: IMPORTS, template: items('defaultValue="b"') })
    class Host {}
    const { el, radios, checked } = render(Host)
    const root = el.querySelector('[data-slot="radio-group"]')!
    expect(el.querySelector('ui-radio-group')!.className).toBe('flex flex-col gap-2')
    expect(root.getAttribute('role')).toBe('radiogroup')
    expect(root.getAttribute('aria-orientation')).toBe('vertical')
    expect(root.getAttribute('dir')).toBe('ltr')
    expect(root.classList.contains('grid') && root.classList.contains('gap-3')).toBe(true)
    expect(radios()[0]!.tagName).toBe('BUTTON')
    expect(radios()[0]!.id).toBe('r1')
    expect(el.querySelector('ui-radio-group-item')!.hasAttribute('id')).toBe(false)
    expect(checked()).toEqual(['false', 'true', 'false', 'false'])
    expect(radios()[1]!.querySelector('[data-slot="radio-group-indicator"] svg.lucide-circle')).not.toBeNull()
    expect(radios()[0]!.querySelector('[data-slot="radio-group-indicator"]')).toBeNull()
  })

  it('2: clicking selects one value; re-clicking the checked radio does not re-emit', () => {
    const seen: string[] = []
    @Component({
      standalone: true,
      imports: IMPORTS,
      template: items('[(value)]="v" (valueChange)="seen.push($event)"'),
    })
    class Host {
      v = 'a'
      seen = seen
    }
    const { fixture, radios, flush, checked } = render(Host)
    radios()[3]!.click()
    flush()
    expect(checked()).toEqual(['false', 'false', 'false', 'true'])
    expect(fixture.componentInstance.v).toBe('d')
    radios()[3]!.click()
    radios()[2]!.click() // disabled
    flush()
    expect(seen).toEqual(['d'])
  })

  it('3: only one radio is tabbable: the checked one, else the first enabled', () => {
    @Component({ standalone: true, imports: IMPORTS, template: items('defaultValue="d"') + items() })
    class Host {}
    const { radios } = render(Host)
    const tabs = radios().map((r) => r.getAttribute('tabindex'))
    expect(tabs.slice(0, 4)).toEqual(['-1', '-1', '-1', '0'])
    expect(tabs.slice(4)).toEqual(['0', '-1', '-1', '-1'])
  })

  it('4: ArrowDown / ArrowUp move focus and select, skip disabled, and loop', () => {
    @Component({ standalone: true, imports: IMPORTS, template: items('defaultValue="b"') })
    class Host {}
    const { radios, press, checked } = render(Host)
    radios()[1]!.focus()
    expect(press(radios()[1]!, 'ArrowDown').defaultPrevented).toBe(true)
    expect(document.activeElement).toBe(radios()[3])
    expect(checked()).toEqual(['false', 'false', 'false', 'true'])
    press(radios()[3]!, 'ArrowDown')
    expect(document.activeElement).toBe(radios()[0])
    expect(checked()[0]).toBe('true')
    press(radios()[0]!, 'ArrowUp')
    expect(checked()[3]).toBe('true')
  })

  it('5: loop=false stops at the ends', () => {
    @Component({ standalone: true, imports: IMPORTS, template: items('defaultValue="d" [loop]="false"') })
    class Host {}
    const { radios, press, checked } = render(Host)
    radios()[3]!.focus()
    press(radios()[3]!, 'ArrowDown')
    expect(document.activeElement).toBe(radios()[3])
    expect(checked()[3]).toBe('true')
  })

  it('6: orientation picks the arrow axis; rtl flips Left / Right', () => {
    @Component({
      standalone: true,
      imports: IMPORTS,
      template:
        items('defaultValue="a"') +
        items('defaultValue="a" orientation="horizontal"') +
        items('defaultValue="a" orientation="horizontal" dir="rtl"'),
    })
    class Host {}
    const { radios, press, checked } = render(Host)
    press(radios()[0]!, 'ArrowRight') // vertical: ignored
    expect(checked().slice(0, 4)).toEqual(['true', 'false', 'false', 'false'])
    press(radios()[4]!, 'ArrowDown') // horizontal: ignored
    expect(checked()[4]).toBe('true')
    press(radios()[4]!, 'ArrowRight')
    expect(checked()[5]).toBe('true')
    press(radios()[8]!, 'ArrowLeft') // rtl: Left means next
    expect(checked()[9]).toBe('true')
  })

  it('7: Home / End move focus without selecting; Enter is swallowed', () => {
    @Component({ standalone: true, imports: IMPORTS, template: items('defaultValue="b"') })
    class Host {}
    const { radios, press, checked } = render(Host)
    press(radios()[1]!, 'End')
    expect(document.activeElement).toBe(radios()[3])
    press(radios()[3]!, 'Home')
    expect(document.activeElement).toBe(radios()[0])
    expect(press(radios()[0]!, 'Enter').defaultPrevented).toBe(true)
    expect(checked()).toEqual(['false', 'true', 'false', 'false'])
    expect(radios()[0]!.getAttribute('tabindex')).toBe('0') // last focused becomes the tab stop
  })

  it('8: a disabled group disables every radio and takes them out of the Tab order', () => {
    @Component({ standalone: true, imports: IMPORTS, template: items('defaultValue="a" disabled') })
    class Host {}
    const { el, radios, flush, checked } = render(Host)
    expect(radios().every((r) => (r as HTMLButtonElement).disabled && r.getAttribute('tabindex') === '-1')).toBe(true)
    expect(el.querySelector('[data-slot="radio-group"]')!.hasAttribute('data-disabled')).toBe(true)
    radios()[1]!.click()
    flush()
    expect(checked()[0]).toBe('true')
  })

  it('9: options render items + labels (for = value), or RadioButtons for optionType=button', () => {
    @Component({
      standalone: true,
      imports: IMPORTS,
      template: `<ui-radio-group id="a" [options]="opts" /><ui-radio-group
          optionType="button"
          orientation="horizontal"
          buttonVariant="solid"
          size="large"
          [options]="opts"
          defaultValue="y"
        />`,
    })
    class Host {
      opts = ['x', { label: 'Why', value: 'y', disabled: true }]
    }
    const { el } = render(Host)
    const [plain, buttons] = Array.from(el.querySelectorAll('ui-radio-group'))
    const labels = Array.from(plain!.querySelectorAll('label'))
    expect(labels.map((l) => [l.getAttribute('for'), l.textContent])).toEqual([
      ['x', 'x'],
      ['y', 'Why'],
    ])
    expect(labels[1]!.classList.contains('opacity-50')).toBe(true)
    const btns = Array.from(buttons!.querySelectorAll<HTMLButtonElement>('button[data-slot="radio-button"]'))
    expect(btns.map((b) => b.textContent!.trim())).toEqual(['x', 'Why'])
    expect(btns[1]!.getAttribute('aria-checked')).toBe('true')
    expect(btns[1]!.disabled).toBe(true)
    const cls = btns[0]!.classList
    expect(['h-10', 'first:rounded-l-md', 'data-[state=checked]:bg-primary'].every((c) => cls.contains(c))).toBe(true)
    expect(normalizeRadioOption('z')).toEqual({ label: 'z', value: 'z' })
  })

  it('10: RadioButton children win over label; vertical groups stack full-width buttons', () => {
    @Component({
      standalone: true,
      imports: IMPORTS,
      template: `<ui-radio-group optionType="button" defaultValue="a">
        <button ui-radio-button value="a" label="Label A"><b>Child</b></button>
        <button ui-radio-button value="b" label="Label B"></button>
        <ui-radio-button value="c" />
      </ui-radio-group>`,
    })
    class Host {}
    const { radios, press, checked } = render(Host)
    expect(radios().map((r) => r.textContent!.trim())).toEqual(['Child', 'Label B', 'c'])
    expect(radios()[0]!.classList.contains('w-full') && radios()[0]!.classList.contains('rounded-md')).toBe(true)
    expect(radios()[0]!.classList.contains('data-[state=checked]:text-primary')).toBe(true) // outline variant default
    const custom = radios()[2]!
    expect(custom.tagName).toBe('UI-RADIO-BUTTON')
    expect(custom.getAttribute('tabindex')).toBe('-1')
    press(custom, ' ')
    expect(checked()).toEqual(['false', 'false', 'true'])
  })

  it('11: formControl writes in, clicks write back, disable() disables; item label / hint / error render', () => {
    @Component({
      standalone: true,
      imports: [...IMPORTS, ReactiveFormsModule],
      template: `<ui-radio-group [formControl]="ctrl">
        <ui-radio-group-item id="p" value="a" label="Alpha" hint="First" />
        <ui-radio-group-item id="q" value="b" label="Beta" errorMessages="Nope" />
      </ui-radio-group>`,
    })
    class Host {
      ctrl = new FormControl('b')
    }
    const { fixture, el, radios, flush, checked } = render(Host)
    expect(checked()).toEqual(['false', 'true'])
    const [alpha, beta] = Array.from(el.querySelectorAll('ui-radio-group-item'))
    expect(alpha!.querySelector('label')!.getAttribute('for')).toBe('p')
    expect(alpha!.querySelector('p')!.textContent).toBe('First')
    expect(beta!.querySelector('p.text-destructive')!.textContent).toBe('Nope')
    expect(radios()[1]!.getAttribute('aria-invalid')).toBe('true')
    alpha!.querySelector('label')!.click()
    flush()
    expect(fixture.componentInstance.ctrl.value).toBe('a')
    fixture.componentInstance.ctrl.disable()
    flush()
    expect(radios().every((r) => (r as HTMLButtonElement).disabled)).toBe(true)
  })
})

describe('RadioGroup class forwarding', () => {
  // React forwards className to the Radix root only. If it also stayed on the host, layout
  // classes such as a grid or a gap would apply to the label/hint wrapper too.
  it('a static class goes to the radiogroup root, not the host', () => {
    @Component({ standalone: true, imports: IMPORTS, template: `<ui-radio-group class="grid-cols-2 gap-6" />` })
    class Host {}
    const fixture = TestBed.createComponent(Host)
    fixture.detectChanges()
    const el = fixture.nativeElement as HTMLElement
    expect(el.querySelector('[role="radiogroup"]')!.classList.contains('gap-6')).toBe(true)
    expect(el.querySelector('ui-radio-group')!.className).toBe('flex flex-col gap-2')
  })
})
