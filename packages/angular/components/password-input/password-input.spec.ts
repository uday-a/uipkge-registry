// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { UiPasswordInputComponent, computeStrength } from './password-input.component'

// The React PasswordInput as users meet it: the value stays masked until the Eye toggle
// reveals it (focus stays in the field, the toggle never steals it), the strength bar
// grows and recolours as rules are met and is announced (role=status), the min-length
// counter / hint appear once typing starts, disabled / readOnly lock the toggle, and
// formControl binds. If the toggle or meter broke, users could not check what they typed
// or would get no feedback on weak passwords.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  document.body.appendChild(el)
  const input = (i = 0) => el.querySelectorAll<HTMLInputElement>('input')[i]!
  const toggle = (i = 0) => el.querySelectorAll<HTMLButtonElement>('button[aria-pressed]')[i]!
  const type = (text: string, target = input()) => {
    target.value = text
    target.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()
  }
  return { fixture, el, input, toggle, type, cleanup: () => el.remove() }
}

const has = (el: Element, classes: string) => classes.split(' ').every((c) => el.classList.contains(c))

describe('PasswordInput (angular, 8 checks)', () => {
  it('1: React DOM: flex-col host > bordered control[data-slot] > password input + toggle; class lands on the control', () => {
    @Component({
      standalone: true,
      imports: [UiPasswordInputComponent],
      template: `<ui-password-input id="pw" class="w-full max-w-xs" />`,
    })
    class Host {}
    const { el, input, cleanup } = render(Host)
    const host = el.querySelector('ui-password-input')!
    expect(has(host, 'flex w-full flex-col gap-2')).toBe(true)
    expect(host.classList.contains('max-w-xs')).toBe(false)
    expect(host.hasAttribute('id')).toBe(false)
    const control = host.querySelector('[data-slot="password-input"]')!
    expect(control.getAttribute('data-size')).toBe('default')
    expect(control.getAttribute('data-variant')).toBe('outlined')
    expect(has(control, 'flex w-full items-center rounded-md border-input h-9 focus-within:ring-[3px]')).toBe(true)
    expect(input().id).toBe('pw')
    expect(input().type).toBe('password')
    expect(input().placeholder).toBe('Enter password')
    expect(input().getAttribute('autocomplete')).toBe('current-password')
    expect(has(input(), 'px-3 flex-1 bg-transparent')).toBe(true)
    cleanup()
  })

  it('2: the toggle reveals / hides, swaps Eye / EyeOff, keeps focus in the input and never takes it', () => {
    @Component({
      standalone: true,
      imports: [UiPasswordInputComponent],
      template: `<ui-password-input defaultValue="secret" />`,
    })
    class Host {}
    const { fixture, input, toggle, cleanup } = render(Host)
    expect(toggle().getAttribute('aria-label')).toBe('Show password')
    expect(toggle().querySelector('svg.lucide-eye')).not.toBeNull()
    const md = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    toggle().dispatchEvent(md)
    expect(md.defaultPrevented).toBe(true)
    toggle().click()
    fixture.detectChanges()
    expect(input().type).toBe('text')
    expect(toggle().getAttribute('aria-pressed')).toBe('true')
    expect(toggle().querySelector('svg.lucide-eye-off')).not.toBeNull()
    expect(document.activeElement).toBe(input())
    cleanup()
  })

  it('3: the strength score follows the React rules', () => {
    expect(computeStrength('').percent).toBe(0)
    expect(computeStrength('abc').label).toBe('weak')
    expect(computeStrength('abcdef1').label).toBe('fair')
    expect(computeStrength('Abcdef1').label).toBe('good')
    expect(computeStrength('Abcdefghij1!').label).toBe('strong')
  })

  it('4: showStrength renders an announced bar that widens and recolours, plus the min-length counter', () => {
    @Component({
      standalone: true,
      imports: [UiPasswordInputComponent],
      template: `<ui-password-input showStrength [minLength]="8" [(value)]="pw" />`,
    })
    class Host {
      pw = signal('')
    }
    const { el, type, cleanup } = render(Host)
    expect(el.querySelector('[role="status"]')).toBeNull()
    type('abc')
    const status = el.querySelector('[role="status"]')!
    expect(status.getAttribute('aria-live')).toBe('polite')
    expect(status.getAttribute('aria-label')).toBe('Password strength: weak')
    const bar = status.querySelector<HTMLElement>('.bg-muted > div')!
    expect(bar.style.width).toBe('25%')
    expect(bar.classList.contains('bg-destructive')).toBe(true)
    expect(status.textContent).toContain('3 / 8 chars')
    type('Abcdefghij1!')
    expect(bar.style.width).toBe('100%')
    expect(bar.classList.contains('bg-success')).toBe(true)
    expect(status.querySelector('span:last-child')!.className).toBe('text-success')
    expect(status.textContent).toContain('12 / 8 chars')
    cleanup()
  })

  it('5: minLength without showStrength shows the "Minimum N characters" hint once typing starts', () => {
    @Component({
      standalone: true,
      imports: [UiPasswordInputComponent],
      template: `<ui-password-input [minLength]="8" />`,
    })
    class Host {}
    const { el, type, cleanup } = render(Host)
    expect(el.textContent).not.toContain('Minimum')
    type('a')
    expect(el.querySelector('p')!.textContent).toBe('Minimum 8 characters')
    cleanup()
  })

  it('6: disabled / readOnly disable the toggle; disabled dims the control; showToggle=false drops it', () => {
    @Component({
      standalone: true,
      imports: [UiPasswordInputComponent],
      template: `
        <ui-password-input disabled />
        <ui-password-input readOnly defaultValue="k3y" />
        <ui-password-input [showToggle]="false" />
      `,
    })
    class Host {}
    const { el, input, toggle, cleanup } = render(Host)
    expect(toggle(0).disabled).toBe(true)
    expect(toggle(1).disabled).toBe(true)
    expect(input(1).readOnly).toBe(true)
    expect(el.querySelectorAll('button').length).toBe(2)
    expect(has(el.querySelector('[data-slot="password-input"]')!, 'pointer-events-none opacity-50')).toBe(true)
    cleanup()
  })

  it('7: size sm / lg change the height and the input / toggle padding', () => {
    @Component({
      standalone: true,
      imports: [UiPasswordInputComponent],
      template: `<ui-password-input size="sm" /><ui-password-input size="lg" variant="filled" />`,
    })
    class Host {}
    const { el, input, cleanup } = render(Host)
    const [sm, lg] = Array.from(el.querySelectorAll('[data-slot="password-input"]'))
    expect(sm.classList.contains('h-8')).toBe(true)
    expect(input(0).classList.contains('px-2.5')).toBe(true)
    expect(sm.lastElementChild!.classList.contains('pr-2')).toBe(true)
    expect(has(lg, 'h-11 bg-muted/50 border-transparent')).toBe(true)
    expect(input(1).classList.contains('px-4')).toBe(true)
    cleanup()
  })

  it('8: formControl writes in, typing writes out, blur marks touched, disable() disables', () => {
    @Component({
      standalone: true,
      imports: [UiPasswordInputComponent, ReactiveFormsModule],
      template: `<ui-password-input [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl('s3cret')
    }
    const { fixture, input, type, cleanup } = render(Host)
    expect(input().value).toBe('s3cret')
    type('n3w')
    expect(fixture.componentInstance.ctrl.value).toBe('n3w')
    input().dispatchEvent(new FocusEvent('blur'))
    expect(fixture.componentInstance.ctrl.touched).toBe(true)
    fixture.componentInstance.ctrl.disable()
    fixture.detectChanges()
    expect(input().disabled).toBe(true)
    cleanup()
  })
})
