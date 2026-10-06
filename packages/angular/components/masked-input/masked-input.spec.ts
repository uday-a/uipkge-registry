// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { UiMaskedInputComponent, type MaskedInputValidatePayload } from './masked-input.component'

// The React MaskedInput as users meet it: typing is formatted into the mask with literal
// separators, keystrokes that do not fit the slot (a letter in a # slot) are blocked,
// Backspace skips over literals, paste is filtered, the mask only appears on focus when a
// placeholder is set, `complete` fires once every slot is filled, and invalid / error /
// validate show a role=alert message. If this broke, users would see garbage in phone /
// card fields or never learn the field is incomplete.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  document.body.appendChild(el)
  const input = (i = 0) => el.querySelectorAll<HTMLInputElement>('input[data-slot="masked-input"]')[i]!
  const type = (text: string, target = input()) => {
    target.value = text
    target.setSelectionRange(text.length, text.length)
    target.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()
  }
  const key = (k: string, target = input(), caret?: number) => {
    if (caret !== undefined) target.setSelectionRange(caret, caret)
    const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })
    target.dispatchEvent(e)
    fixture.detectChanges()
    return e
  }
  return { fixture, el, input, type, key, cleanup: () => el.remove() }
}

describe('MaskedInput (angular, 10 checks)', () => {
  it('1: React DOM: relative w-full wrapper > fully styled input (focus ring, md:text-sm)', () => {
    @Component({
      standalone: true,
      imports: [UiMaskedInputComponent],
      template: `<ui-masked-input id="p" mask="(###) ###-####" class="mt-1.5" />`,
    })
    class Host {}
    const { el, input, cleanup } = render(Host)
    const host = el.querySelector('ui-masked-input')!
    expect(host.getAttribute('data-slot')).toBe('masked-input-wrapper')
    expect(['block', 'relative', 'w-full'].every((c) => host.classList.contains(c))).toBe(true)
    expect(host.hasAttribute('id')).toBe(false)
    // React className goes to the input only (a duplicate on the wrapper would double the margin).
    expect(host.classList.contains('mt-1.5')).toBe(false)
    expect(input().classList.contains('mt-1.5')).toBe(true)
    expect(input().id).toBe('p')
    expect(input().getAttribute('data-uipkge')).toBe('true')
    for (const c of ['h-9', 'rounded-md', 'border-input', 'md:text-sm', 'focus-visible:ring-[3px]', 'dark:bg-input/30'])
      expect(input().classList.contains(c), c).toBe(true)
    // No maxlength: the mask engine clamps instead.
    expect(input().hasAttribute('maxlength')).toBe(false)
    cleanup()
  })

  it('2: typing digits formats into the mask and emits the masked string', () => {
    const seen: string[] = []
    @Component({
      standalone: true,
      imports: [UiMaskedInputComponent],
      template: `<ui-masked-input mask="(###) ###-####" (valueChange)="seen.push($event)" />`,
    })
    class Host {
      seen = seen
    }
    const { input, type, cleanup } = render(Host)
    input().dispatchEvent(new FocusEvent('focus'))
    type('212555')
    expect(input().value).toBe('(212) 555-____')
    expect(seen.at(-1)).toBe('(212) 555-____')
    cleanup()
  })

  it('3: keystrokes that do not fit the slot token are blocked (letters in #, digits in A)', () => {
    @Component({
      standalone: true,
      imports: [UiMaskedInputComponent],
      template: `<ui-masked-input mask="###-###" /><ui-masked-input mask="AAA-AAA" replacement="A" />`,
    })
    class Host {}
    const { input, key, cleanup } = render(Host)
    expect(key('x', input(0), 0).defaultPrevented).toBe(true)
    expect(key('7', input(0), 0).defaultPrevented).toBe(false)
    expect(key('7', input(1), 0).defaultPrevented).toBe(true)
    expect(key('Q', input(1), 0).defaultPrevented).toBe(false)
    // Ctrl / Cmd shortcuts pass through.
    const e = new KeyboardEvent('keydown', { key: 'a', ctrlKey: true, cancelable: true })
    input(0).dispatchEvent(e)
    expect(e.defaultPrevented).toBe(false)
    cleanup()
  })

  it('4: Backspace removes the slot before the caret, skipping literals', () => {
    @Component({
      standalone: true,
      imports: [UiMaskedInputComponent],
      template: `<ui-masked-input mask="##/##/####" defaultValue="12/34/5678" />`,
    })
    class Host {}
    const { input, key, cleanup } = render(Host)
    // Caret after "12/3" (index 4): removes the "3".
    expect(key('Backspace', input(), 4).defaultPrevented).toBe(true)
    expect(input().value).toBe('12/45/678_')
    cleanup()
  })

  it('5: paste keeps only chars that fit the slots from the caret on', () => {
    @Component({
      standalone: true,
      imports: [UiMaskedInputComponent],
      template: `<ui-masked-input mask="####-####" />`,
    })
    class Host {}
    const { fixture, input, cleanup } = render(Host)
    const e = new Event('paste', { bubbles: true, cancelable: true }) as ClipboardEvent
    Object.defineProperty(e, 'clipboardData', { value: { getData: () => '12ab34 5678 9' } })
    input().setSelectionRange(0, 0)
    input().dispatchEvent(e)
    fixture.detectChanges()
    expect(e.defaultPrevented).toBe(true)
    expect(input().value).toBe('1234-5678')
    cleanup()
  })

  it('6: with a placeholder the field is empty until focused, then shows the mask', () => {
    @Component({
      standalone: true,
      imports: [UiMaskedInputComponent],
      template: `<ui-masked-input mask="(###) ###-####" placeholder="(555) 000-0000" />`,
    })
    class Host {}
    const { fixture, input, cleanup } = render(Host)
    expect(input().value).toBe('')
    expect(input().placeholder).toBe('(555) 000-0000')
    input().dispatchEvent(new FocusEvent('focus'))
    fixture.detectChanges()
    expect(input().value).toBe('(___) ___-____')
    cleanup()
  })

  it('7: showMask=false renders only what was typed', () => {
    @Component({
      standalone: true,
      imports: [UiMaskedInputComponent],
      template: `<ui-masked-input mask="(###) ###-####" [showMask]="false" />`,
    })
    class Host {}
    const { input, type, cleanup } = render(Host)
    input().dispatchEvent(new FocusEvent('focus'))
    expect(input().value).toBe('')
    type('21')
    expect(input().value).toBe('(21')
    cleanup()
  })

  it('8: complete fires when every slot is filled; validation reports isComplete / rawValue', () => {
    const done: string[] = []
    const payloads: MaskedInputValidatePayload[] = []
    @Component({
      standalone: true,
      imports: [UiMaskedInputComponent],
      template: `<ui-masked-input
        mask="######"
        [showMask]="false"
        placeholderChar=""
        [(value)]="otp"
        (complete)="done.push($event)"
        (validation)="payloads.push($event)"
      />`,
    })
    class Host {
      otp = signal('')
      done = done
      payloads = payloads
    }
    const { type, cleanup } = render(Host)
    type('12345')
    expect(done).toEqual([])
    type('123456')
    expect(done).toEqual(['123456'])
    expect(payloads.at(-1)).toEqual({ isValid: true, isComplete: true, rawValue: '123456', maskedValue: '123456' })
    cleanup()
  })

  it('9: invalid + errorMessage, error string and validate() all show a role=alert line and aria-invalid', () => {
    @Component({
      standalone: true,
      imports: [UiMaskedInputComponent],
      template: `
        <ui-masked-input mask="(###) ###-####" defaultValue="(555) 12" invalid errorMessage="Enter 10 digits." />
        <ui-masked-input mask="###" error="Bad" />
        <ui-masked-input mask="###" defaultValue="12_" [validate]="rule" />
      `,
    })
    class Host {
      rule = (_m: string, raw: string) => raw.length === 3 || 'Need 3'
    }
    const { el, input, cleanup } = render(Host)
    const alerts = Array.from(el.querySelectorAll('[role="alert"]')).map((a) => a.textContent?.trim())
    expect(alerts).toEqual(['Enter 10 digits.', 'Bad', 'Need 3'])
    expect(el.querySelector('[role="alert"]')!.className).toBe('text-destructive mt-1.5 text-xs font-medium')
    for (const i of [0, 1, 2]) {
      expect(input(i).getAttribute('aria-invalid')).toBe('true')
      expect(input(i).classList.contains('border-destructive')).toBe(true)
    }
    cleanup()
  })

  it('10: formControl writes in, typing writes out, blur marks touched, disable() disables', () => {
    @Component({
      standalone: true,
      imports: [UiMaskedInputComponent, ReactiveFormsModule],
      template: `<ui-masked-input mask="###-###" [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl('123-___')
    }
    const { fixture, input, type, cleanup } = render(Host)
    expect(input().value).toBe('123-___')
    type('1234')
    expect(fixture.componentInstance.ctrl.value).toBe('123-4__')
    input().dispatchEvent(new FocusEvent('blur'))
    expect(fixture.componentInstance.ctrl.touched).toBe(true)
    fixture.componentInstance.ctrl.disable()
    fixture.detectChanges()
    expect(input().disabled).toBe(true)
    cleanup()
  })
})
