// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import {
  UiPinInputComponent,
  UiPinInputGroupComponent,
  UiPinInputSeparatorComponent,
  UiPinInputSlotComponent,
} from './pin-input.component'

// The React PinInput (input-otp) as users meet it: one transparent native input spans the
// row (so typing, paste, Backspace, autofill "one-time-code" all work natively), each slot
// shows value[index] or a dot when masked, the slot under the caret is data-active,
// `complete` fires once when the last slot fills, a pattern rejects bad characters, status
// paints the slots, and formControl binds. If the input stopped covering the row or the
// slots stopped following the value, the code field would look filled but submit nothing.

const Parts = [UiPinInputComponent, UiPinInputGroupComponent, UiPinInputSlotComponent, UiPinInputSeparatorComponent]

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  document.body.appendChild(el)
  const input = (i = 0) => el.querySelectorAll<HTMLInputElement>('input[data-input-otp]')[i]!
  const slots = () => Array.from(el.querySelectorAll<HTMLElement>('[data-slot="pin-input-slot"]'))
  const type = (text: string, target = input()) => {
    target.value = text
    target.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()
  }
  return { fixture, el, input, slots, type, cleanup: () => el.remove() }
}

describe('PinInput (angular, 9 checks)', () => {
  it('1: input-otp DOM: container host > groups / slots, then an overlay with the one-time-code input', () => {
    @Component({
      standalone: true,
      imports: Parts,
      template: `
        <ui-pin-input id="otp">
          <ui-pin-input-group>
            @for (i of [0, 1, 2, 3, 4, 5]; track i) {
              <ui-pin-input-slot [index]="i" />
            }
          </ui-pin-input-group>
        </ui-pin-input>
      `,
    })
    class Host {}
    const { el, input, slots, cleanup } = render(Host)
    const root = el.querySelector('ui-pin-input')!
    expect(root.getAttribute('data-input-otp-container')).toBe('true')
    expect(
      ['flex', 'items-center', 'gap-2', 'has-disabled:opacity-50', 'relative'].every((c) => root.classList.contains(c)),
    ).toBe(true)
    expect(root.hasAttribute('id')).toBe(false)
    expect(slots().length).toBe(6)
    expect(el.querySelector('[data-slot="pin-input-group"]')!.className).toBe('flex items-center')
    expect(input().id).toBe('otp')
    expect(input().getAttribute('data-slot')).toBe('pin-input')
    expect(input().getAttribute('maxlength')).toBe('6')
    expect(input().getAttribute('autocomplete')).toBe('one-time-code')
    expect(input().getAttribute('inputmode')).toBe('numeric')
    expect(input().getAttribute('data-input-otp-placeholder-shown')).toBe('true')
    expect(input().parentElement!.className).toBe('pointer-events-none absolute inset-0')
    expect(
      ['absolute', 'inset-0', 'text-transparent', 'caret-transparent'].every((c) => input().classList.contains(c)),
    ).toBe(true)
    cleanup()
  })

  it('2: typing fills the slots in order and emits valueChange', () => {
    const seen: string[] = []
    @Component({
      standalone: true,
      imports: Parts,
      template: `
        <ui-pin-input [maxLength]="4" (valueChange)="seen.push($event)">
          <ui-pin-input-group>
            @for (i of [0, 1, 2, 3]; track i) {
              <ui-pin-input-slot [index]="i" />
            }
          </ui-pin-input-group>
        </ui-pin-input>
      `,
    })
    class Host {
      seen = seen
    }
    const { input, slots, type, cleanup } = render(Host)
    type('12')
    expect(slots().map((s) => s.textContent!.trim())).toEqual(['1', '2', '', ''])
    expect(seen).toEqual(['12'])
    expect(input().hasAttribute('data-input-otp-placeholder-shown')).toBe(false)
    // More than maxLength is cut.
    type('123456')
    expect(slots().map((s) => s.textContent!.trim())).toEqual(['1', '2', '3', '4'])
    cleanup()
  })

  it('3: complete fires once, on the edit that fills the last slot', () => {
    const done: string[] = []
    @Component({
      standalone: true,
      imports: Parts,
      template: `
        <ui-pin-input [maxLength]="4" (complete)="done.push($event)">
          <ui-pin-input-group>
            @for (i of [0, 1, 2, 3]; track i) {
              <ui-pin-input-slot [index]="i" />
            }
          </ui-pin-input-group>
        </ui-pin-input>
      `,
    })
    class Host {
      done = done
    }
    const { type, cleanup } = render(Host)
    type('123')
    expect(done).toEqual([])
    type('1234')
    expect(done).toEqual(['1234'])
    type('1234')
    expect(done).toEqual(['1234'])
    cleanup()
  })

  it('4: mask renders dots instead of characters; a per-slot mask override wins', () => {
    @Component({
      standalone: true,
      imports: Parts,
      template: `
        <ui-pin-input [maxLength]="2" mask defaultValue="12">
          <ui-pin-input-group>
            <ui-pin-input-slot [index]="0" />
            <ui-pin-input-slot [index]="1" [mask]="false" />
          </ui-pin-input-group>
        </ui-pin-input>
      `,
    })
    class Host {}
    const { slots, cleanup } = render(Host)
    const dot = slots()[0]!.querySelector('span')!
    expect(dot.textContent).toBe('')
    expect(['bg-foreground', 'size-2', 'rounded-full'].every((c) => dot.classList.contains(c))).toBe(true)
    expect(slots()[1]!.textContent!.trim()).toBe('2')
    cleanup()
  })

  it('5: the slot under the caret is data-active with the ring while focused', () => {
    @Component({
      standalone: true,
      imports: Parts,
      template: `
        <ui-pin-input [maxLength]="4">
          <ui-pin-input-group>
            @for (i of [0, 1, 2, 3]; track i) {
              <ui-pin-input-slot [index]="i" />
            }
          </ui-pin-input-group>
        </ui-pin-input>
      `,
    })
    class Host {}
    const { fixture, input, slots, type, cleanup } = render(Host)
    input().focus()
    fixture.detectChanges()
    expect(slots()[0]!.hasAttribute('data-active')).toBe(true)
    type('12')
    input().setSelectionRange(2, 2)
    document.dispatchEvent(new Event('selectionchange'))
    fixture.detectChanges()
    expect(slots().map((s) => s.hasAttribute('data-active'))).toEqual([false, false, true, false])
    expect(slots()[2]!.classList.contains('ring-2')).toBe(true)
    input().blur()
    fixture.detectChanges()
    expect(slots().some((s) => s.hasAttribute('data-active'))).toBe(false)
    cleanup()
  })

  it('6: a pattern rejects edits that do not match (the input keeps the old value)', () => {
    @Component({
      standalone: true,
      imports: Parts,
      template: `<ui-pin-input [maxLength]="4" pattern="^\\d+$" [(value)]="code"
        ><ui-pin-input-slot [index]="0"
      /></ui-pin-input>`,
    })
    class Host {
      code = signal('1')
    }
    const { fixture, input, type, cleanup } = render(Host)
    expect(input().getAttribute('pattern')).toBe('^\\d+$')
    type('1a')
    expect(fixture.componentInstance.code()).toBe('1')
    expect(input().value).toBe('1')
    type('12')
    expect(fixture.componentInstance.code()).toBe('12')
    cleanup()
  })

  it('7: status paints the slots and is exposed as data-status; disabled disables the input', () => {
    @Component({
      standalone: true,
      imports: Parts,
      template: `
        <ui-pin-input [maxLength]="1" status="error"><ui-pin-input-slot [index]="0" /></ui-pin-input>
        <ui-pin-input [maxLength]="1" size="lg" disabled><ui-pin-input-slot [index]="0" /></ui-pin-input>
      `,
    })
    class Host {}
    const { el, input, slots, cleanup } = render(Host)
    expect(input(0).getAttribute('data-status')).toBe('error')
    expect(
      ['border-destructive', 'text-destructive', 'h-10', 'w-10'].every((c) => slots()[0]!.classList.contains(c)),
    ).toBe(true)
    expect(input(1).disabled).toBe(true)
    expect(input(1).hasAttribute('data-status')).toBe(false)
    expect(slots()[1]!.classList.contains('h-12')).toBe(true)
    expect(el.querySelectorAll('ui-pin-input')[1]!.classList.contains('cursor-default')).toBe(true)
    cleanup()
  })

  it('8: the separator is role=separator with a Minus icon unless content is projected', () => {
    @Component({
      standalone: true,
      imports: Parts,
      template: `<ui-pin-input-separator id="a" /><ui-pin-input-separator id="b">·</ui-pin-input-separator>`,
    })
    class Host {}
    const { el, cleanup } = render(Host)
    const a = el.querySelector('#a')!
    expect(a.getAttribute('role')).toBe('separator')
    expect(a.getAttribute('data-slot')).toBe('pin-input-separator')
    expect(a.querySelector('svg.lucide-minus')).not.toBeNull()
    const b = el.querySelector('#b')!
    expect(b.querySelector('svg')).toBeNull()
    expect(b.textContent).toBe('·')
    cleanup()
  })

  it('9: formControl writes in, typing writes out, blur marks touched, disable() disables', () => {
    @Component({
      standalone: true,
      imports: [...Parts, ReactiveFormsModule],
      template: `<ui-pin-input [maxLength]="4" [formControl]="ctrl"><ui-pin-input-slot [index]="0" /></ui-pin-input>`,
    })
    class Host {
      ctrl = new FormControl('12')
    }
    const { fixture, input, slots, type, cleanup } = render(Host)
    expect(input().value).toBe('12')
    expect(slots()[0]!.textContent!.trim()).toBe('1')
    type('987')
    expect(fixture.componentInstance.ctrl.value).toBe('987')
    input().dispatchEvent(new FocusEvent('blur'))
    expect(fixture.componentInstance.ctrl.touched).toBe(true)
    fixture.componentInstance.ctrl.disable()
    fixture.detectChanges()
    expect(input().disabled).toBe(true)
    cleanup()
  })
})
