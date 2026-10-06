// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { UiNumberFieldComponent } from './number-field.component'

// The React NumberField as users meet it: a role=spinbutton input between Decrease /
// Increase buttons that step and clamp to min / max (and disable at the bounds), typed text
// committed on blur / Enter through the parser, a formatted display (formatter / precision),
// keyboard stepping (Arrow / Page / Home / End, off with keyboard=false), and formControl.
// If this broke, users could type past the bounds, lose their edit, or see raw numbers.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  document.body.appendChild(el)
  const input = (i = 0) => el.querySelectorAll<HTMLInputElement>('input[role="spinbutton"]')[i]!
  const inc = (i = 0) => el.querySelectorAll<HTMLButtonElement>('[data-slot="increment"]')[i]!
  const dec = (i = 0) => el.querySelectorAll<HTMLButtonElement>('[data-slot="decrement"]')[i]!
  const key = (k: string, target = input()) => {
    const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })
    target.dispatchEvent(e)
    fixture.detectChanges()
    return e
  }
  const typeAndBlur = (text: string, target = input()) => {
    target.dispatchEvent(new FocusEvent('focus'))
    target.value = text
    target.dispatchEvent(new Event('input', { bubbles: true }))
    target.dispatchEvent(new FocusEvent('blur'))
    fixture.detectChanges()
  }
  return { fixture, el, input, inc, dec, key, typeAndBlur, cleanup: () => el.remove() }
}

const has = (el: Element, classes: string) => classes.split(' ').every((c) => el.classList.contains(c))

describe('NumberField (angular, 10 checks)', () => {
  it('1: React DOM: inline-flex root > relative content > [decrement, input block, increment]', () => {
    @Component({
      standalone: true,
      imports: [UiNumberFieldComponent],
      template: `<ui-number-field id="qty" [defaultValue]="5" />`,
    })
    class Host {}
    const { el, input, cleanup } = render(Host)
    const root = el.querySelector('ui-number-field')!
    expect(root.getAttribute('data-slot')).toBe('number-field')
    expect(root.classList.contains('inline-flex')).toBe(true)
    expect(root.hasAttribute('id')).toBe(false)
    const content = root.firstElementChild!
    expect(content.className).toBe('relative')
    expect(Array.from(content.children).map((c) => c.getAttribute('data-slot'))).toEqual([
      'decrement',
      'input',
      'increment',
    ])
    expect(input().id).toBe('qty')
    expect(input().value).toBe('5')
    expect(input().getAttribute('aria-valuenow')).toBe('5')
    expect(input().getAttribute('aria-roledescription')).toBe('Number field')
    expect(input().getAttribute('inputmode')).toBe('numeric')
    expect(has(input(), 'h-9 text-sm px-3 py-1 text-center rounded-md border')).toBe(true)
    expect(content.querySelector('svg.lucide-minus.h-4.w-4')).not.toBeNull()
    cleanup()
  })

  it('2: steppers add / subtract step, clamp to bounds and disable at min / max', () => {
    const seen: (number | undefined)[] = []
    @Component({
      standalone: true,
      imports: [UiNumberFieldComponent],
      template: `<ui-number-field [defaultValue]="9" [min]="0" [max]="10" (valueChange)="seen.push($event)" />`,
    })
    class Host {
      seen = seen
    }
    const { fixture, input, inc, dec, cleanup } = render(Host)
    expect(inc().tabIndex).toBe(-1)
    inc().click()
    fixture.detectChanges()
    expect(input().value).toBe('10')
    expect(inc().disabled).toBe(true)
    expect(input().getAttribute('aria-valuemax')).toBe('10')
    dec().click()
    fixture.detectChanges()
    expect(input().value).toBe('9')
    expect(inc().disabled).toBe(false)
    expect(seen).toEqual([10, 9])
    cleanup()
  })

  it('3: typed text commits on blur (clamped); junk restores; empty emits undefined', () => {
    const seen: (number | undefined)[] = []
    @Component({
      standalone: true,
      imports: [UiNumberFieldComponent],
      template: `<ui-number-field [defaultValue]="5" [max]="20" (valueChange)="seen.push($event)" />`,
    })
    class Host {
      seen = seen
    }
    const { input, typeAndBlur, cleanup } = render(Host)
    typeAndBlur('50')
    expect(input().value).toBe('20')
    typeAndBlur('abc')
    expect(input().value).toBe('20')
    typeAndBlur('')
    expect(input().value).toBe('')
    expect(seen).toEqual([20, undefined])
    cleanup()
  })

  it('4: keyboard: ArrowUp / ArrowDown step, PageUp x10, Home / End jump to min / max, Enter commits', () => {
    @Component({
      standalone: true,
      imports: [UiNumberFieldComponent],
      template: `<ui-number-field [defaultValue]="5" [min]="0" [max]="100" />`,
    })
    class Host {}
    const { fixture, input, key, cleanup } = render(Host)
    expect(key('ArrowUp').defaultPrevented).toBe(true)
    expect(input().value).toBe('6')
    key('ArrowDown')
    key('PageUp')
    expect(input().value).toBe('15')
    key('End')
    expect(input().value).toBe('100')
    key('Home')
    expect(input().value).toBe('0')
    input().dispatchEvent(new FocusEvent('focus'))
    input().value = '42'
    input().dispatchEvent(new Event('input'))
    key('Enter')
    fixture.detectChanges()
    expect(input().value).toBe('42')
    cleanup()
  })

  it('5: keyboard=false leaves the arrow keys alone', () => {
    @Component({
      standalone: true,
      imports: [UiNumberFieldComponent],
      template: `<ui-number-field [defaultValue]="25" [keyboard]="false" />`,
    })
    class Host {}
    const { input, key, cleanup } = render(Host)
    expect(key('ArrowUp').defaultPrevented).toBe(false)
    expect(input().value).toBe('25')
    cleanup()
  })

  it('6: formatter / parser round-trip and precision uses Intl with fixed decimals', () => {
    @Component({
      standalone: true,
      imports: [UiNumberFieldComponent],
      template: `
        <ui-number-field [defaultValue]="1000" [formatter]="fmt" [parser]="parse" prefix="$" />
        <ui-number-field [defaultValue]="3.14159" [precision]="3" [step]="0.001" />
      `,
    })
    class Host {
      fmt = (v: number | undefined) => (v === undefined ? '' : `#${v}`)
      parse = (v: string) => Number(v.replace(/[^0-9.-]/g, ''))
    }
    const { el, input, typeAndBlur, cleanup } = render(Host)
    expect(input(0).value).toBe('#1000')
    expect(el.querySelector('[data-slot="input"] span')!.textContent).toBe('$')
    typeAndBlur('#2,500', input(0))
    expect(input(0).value).toBe('#2500')
    expect(input(1).value).toBe(
      new Intl.NumberFormat(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(3.14159),
    )
    expect(input(1).getAttribute('inputmode')).toBe('decimal')
    cleanup()
  })

  it('7: controlsPosition=right stacks the steppers in a bordered grid', () => {
    @Component({
      standalone: true,
      imports: [UiNumberFieldComponent],
      template: `<ui-number-field [defaultValue]="50" controlsPosition="right" />`,
    })
    class Host {}
    const { el, input, inc, dec, cleanup } = render(Host)
    const content = el.querySelector('ui-number-field')!.firstElementChild!
    expect(has(content, 'inline-grid grid-cols-[1fr_auto] grid-rows-[1fr_1fr] rounded-md border')).toBe(true)
    expect(has(inc(), 'col-start-2 row-start-1 border-l px-2')).toBe(true)
    expect(has(dec(), 'col-start-2 row-start-2 border-t border-l')).toBe(true)
    expect(has(input(), 'rounded-none border-0')).toBe(true)
    cleanup()
  })

  it('8: disabled / readOnly block stepping and disable both buttons; status=error is announced', () => {
    @Component({
      standalone: true,
      imports: [UiNumberFieldComponent],
      template: `
        <ui-number-field [defaultValue]="42" disabled />
        <ui-number-field [defaultValue]="42" readOnly />
        <ui-number-field [defaultValue]="1" status="error" />
      `,
    })
    class Host {}
    const { input, inc, dec, key, cleanup } = render(Host)
    expect(inc(0).disabled && dec(0).disabled && inc(1).disabled && dec(1).disabled).toBe(true)
    expect(input(0).disabled).toBe(true)
    expect(input(1).readOnly).toBe(true)
    key('ArrowUp', input(1))
    expect(input(1).value).toBe('42')
    expect(input(2).getAttribute('aria-invalid')).toBe('true')
    expect(input(2).classList.contains('border-destructive')).toBe(true)
    cleanup()
  })

  it('9: controlled [(value)] stays in sync; a bound value re-renders the display', () => {
    @Component({
      standalone: true,
      imports: [UiNumberFieldComponent],
      template: `<ui-number-field [(value)]="n" />`,
    })
    class Host {
      n = signal<number | undefined>(5)
    }
    const { fixture, input, inc, cleanup } = render(Host)
    inc().click()
    fixture.detectChanges()
    expect(fixture.componentInstance.n()).toBe(6)
    fixture.componentInstance.n.set(99)
    fixture.detectChanges()
    expect(input().value).toBe('99')
    cleanup()
  })

  it('10: formControl writes in, steps write out, blur marks touched, disable() disables', () => {
    @Component({
      standalone: true,
      imports: [UiNumberFieldComponent, ReactiveFormsModule],
      template: `<ui-number-field [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl<number | undefined>(7)
    }
    const { fixture, input, inc, cleanup } = render(Host)
    expect(input().value).toBe('7')
    inc().click()
    fixture.detectChanges()
    expect(fixture.componentInstance.ctrl.value).toBe(8)
    input().dispatchEvent(new FocusEvent('blur'))
    expect(fixture.componentInstance.ctrl.touched).toBe(true)
    fixture.componentInstance.ctrl.disable()
    fixture.detectChanges()
    expect(input().disabled).toBe(true)
    cleanup()
  })
})
