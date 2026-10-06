// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiLabelComponent } from './label.component'

// Radix Label as React ships it: a real <label> whose `for` points at the control (clicking
// the text focuses / toggles the field -- if `for` were lost, users could not click the
// label), the shared label classes (peer-disabled dimming), and the Radix double-click
// guard that stops the label text from being selected.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  return { fixture, el, label: () => el.querySelector<HTMLElement>('[data-slot="label"]')! }
}

const mousedown = (el: Element, detail: number) => {
  const e = new MouseEvent('mousedown', { bubbles: true, cancelable: true, detail })
  el.dispatchEvent(e)
  return e
}

describe('Label (angular, 6 checks)', () => {
  it('1: renders a native label with data-slot and the React class string', () => {
    @Component({ standalone: true, imports: [UiLabelComponent], template: `<label ui-label>Name</label>` })
    class Host {}
    const { label } = render(Host)
    expect(label().tagName).toBe('LABEL')
    expect(label().getAttribute('data-uipkge')).toBe('')
    for (const c of 'flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:opacity-50'.split(
      ' ',
    ))
      expect(label().classList.contains(c), c).toBe(true)
    expect(label().textContent).toBe('Name')
  })

  it('2: `for` associates the label with its control, so clicking the label activates it', () => {
    @Component({
      standalone: true,
      imports: [UiLabelComponent],
      template: `<label ui-label for="n">Agree</label><input id="n" type="checkbox" />`,
    })
    class Host {}
    const { el, label } = render(Host)
    expect(label().getAttribute('for')).toBe('n')
    label().click()
    expect(el.querySelector<HTMLInputElement>('#n')!.checked).toBe(true)
  })

  it('3: React `htmlFor` works as an alias', () => {
    @Component({ standalone: true, imports: [UiLabelComponent], template: `<label ui-label htmlFor="x">X</label>` })
    class Host {}
    expect(render(Host).label().getAttribute('for')).toBe('x')
  })

  it('4: no `for` attribute when none is given', () => {
    @Component({ standalone: true, imports: [UiLabelComponent], template: `<label ui-label>X</label>` })
    class Host {}
    expect(render(Host).label().hasAttribute('for')).toBe(false)
  })

  it('5: double-click on the text is prevented (no selection); single click and nested inputs are not', () => {
    @Component({
      standalone: true,
      imports: [UiLabelComponent],
      template: `<label ui-label>Text <input id="i" /></label>`,
    })
    class Host {}
    const { el, label } = render(Host)
    expect(mousedown(label(), 1).defaultPrevented).toBe(false)
    expect(mousedown(label(), 2).defaultPrevented).toBe(true)
    expect(mousedown(el.querySelector('#i')!, 2).defaultPrevented).toBe(false)
  })

  it('6: class input merges through cn (tailwind-merge resolves conflicts)', () => {
    @Component({
      standalone: true,
      imports: [UiLabelComponent],
      template: `<label ui-label class="text-destructive text-xs">E</label>`,
    })
    class Host {}
    const cls = render(Host).label().classList
    expect(cls.contains('text-destructive')).toBe(true)
    expect(cls.contains('text-xs')).toBe(true)
    expect(cls.contains('text-sm')).toBe(false)
  })
})
