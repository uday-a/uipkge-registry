// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import {
  UiInputComponent,
  UiInputGroupAddonComponent,
  UiInputGroupButtonComponent,
  UiInputGroupComponent,
} from './input.component'

// The React Input, as users meet it: the id lands on the native <input> (so a label's
// `for` reaches it), typing is controlled / uncontrolled like React (a parent that rejects
// an edit wins), the clear button and password toggle work and keep focus in the field,
// status=error is announced (aria-invalid) and paints the wrapper, prefix / suffix /
// addons reshape padding and corners, and formControl binds. If any of these broke,
// users would see a mislabeled field, a value that drifts from the model, or dead icons.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  document.body.appendChild(el)
  const input = (sel = 'input') => el.querySelector<HTMLInputElement>(sel)!
  const wrapper = () => el.querySelector<HTMLElement>('[data-slot="input"]')!
  const type = (text: string, target = input()) => {
    target.value = text
    target.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()
  }
  return { fixture, el, input, wrapper, type, cleanup: () => el.remove() }
}

const has = (el: Element, classes: string) => classes.split(' ').every((c) => el.classList.contains(c))

describe('Input (angular, 12 checks)', () => {
  it('1: renders React DOM: flex w-full host > bordered wrapper[data-slot=input] > native input with the id', () => {
    @Component({
      standalone: true,
      imports: [UiInputComponent],
      template: `<ui-input id="email" type="email" placeholder="you@example.com" class="h-11" />`,
    })
    class Host {}
    const { el, input, wrapper, cleanup } = render(Host)
    const host = el.querySelector('ui-input')!
    expect(has(host, 'flex w-full')).toBe(true)
    expect(host.hasAttribute('id')).toBe(false)
    expect(host.hasAttribute('placeholder')).toBe(false)
    // class is the wrapper's (React className), never duplicated on the host.
    expect(host.classList.contains('h-11')).toBe(false)
    expect(wrapper().classList.contains('h-11')).toBe(true)
    expect(wrapper().getAttribute('data-uipkge')).toBe('')
    expect(has(wrapper(), 'flex w-full items-center gap-1.5 overflow-hidden border rounded-md border-input')).toBe(true)
    expect(input().id).toBe('email')
    expect(input().type).toBe('email')
    expect(input().placeholder).toBe('you@example.com')
    // No prefix / suffix: symmetric side padding, no right rail.
    expect(has(input(), 'pl-2.5 pr-2.5')).toBe(true)
    expect(wrapper().children.length).toBe(1)
    cleanup()
  })

  it('2: uncontrolled defaultValue seeds the field; typing updates the char count and emits valueChange', () => {
    const seen: string[] = []
    @Component({
      standalone: true,
      imports: [UiInputComponent],
      template: `<ui-input defaultValue="ab" [maxLength]="20" showCount (valueChange)="seen.push($event)" />`,
    })
    class Host {
      seen = seen
    }
    const { el, input, type, cleanup } = render(Host)
    expect(input().value).toBe('ab')
    expect(el.textContent).toContain('2/20')
    expect(input().getAttribute('maxlength')).toBe('20')
    type('abcd')
    expect(el.textContent).toContain('4/20')
    expect(seen).toEqual(['abcd'])
    cleanup()
  })

  it('3: controlled [value]: an edit the parent does not accept is reverted; [(value)] accepts it', () => {
    @Component({
      standalone: true,
      imports: [UiInputComponent],
      template: `<ui-input id="locked" value="fixed" /><ui-input id="bound" [(value)]="text" />`,
    })
    class Host {
      text = signal('a')
    }
    const { fixture, input, type, cleanup } = render(Host)
    type('fixedX', input('#locked'))
    expect(input('#locked').value).toBe('fixed')
    type('ab', input('#bound'))
    expect(fixture.componentInstance.text()).toBe('ab')
    expect(input('#bound').value).toBe('ab')
    fixture.componentInstance.text.set('reset')
    fixture.detectChanges()
    expect(input('#bound').value).toBe('reset')
    cleanup()
  })

  it('4: allowClear shows the X only with a value and on hover / focus; clicking clears, emits and keeps focus', () => {
    const seen: string[] = []
    @Component({
      standalone: true,
      imports: [UiInputComponent],
      template: `<ui-input defaultValue="Clear me" allowClear (valueChange)="seen.push($event)" />`,
    })
    class Host {
      seen = seen
    }
    const { fixture, el, input, wrapper, cleanup } = render(Host)
    const clearBtn = () => el.querySelector<HTMLButtonElement>('button[aria-label="Clear input"]')
    expect(clearBtn()).toBeNull()
    // The right rail is mounted (allowClear) so the input drops its right padding.
    expect(has(input(), 'pl-2.5 pr-0')).toBe(true)
    wrapper().dispatchEvent(new Event('mouseenter'))
    fixture.detectChanges()
    expect(clearBtn()).not.toBeNull()
    expect(clearBtn()!.querySelector('svg.lucide-x')).not.toBeNull()
    const md = new MouseEvent('mousedown', { bubbles: true, cancelable: true })
    clearBtn()!.dispatchEvent(md)
    expect(md.defaultPrevented).toBe(true)
    clearBtn()!.click()
    fixture.detectChanges()
    expect(input().value).toBe('')
    expect(seen).toEqual([''])
    expect(document.activeElement).toBe(input())
    expect(clearBtn()).toBeNull()
    cleanup()
  })

  it('5: password toggle flips type and aria-pressed and refocuses the input', () => {
    @Component({
      standalone: true,
      imports: [UiInputComponent],
      template: `<ui-input type="password" defaultValue="secret123" showPasswordToggle />`,
    })
    class Host {}
    const { fixture, el, input, cleanup } = render(Host)
    const btn = () => el.querySelector<HTMLButtonElement>('button[aria-pressed]')!
    expect(input().type).toBe('password')
    expect(btn().getAttribute('aria-label')).toBe('Show password')
    expect(btn().querySelector('svg.lucide-eye')).not.toBeNull()
    btn().click()
    fixture.detectChanges()
    expect(input().type).toBe('text')
    expect(btn().getAttribute('aria-pressed')).toBe('true')
    expect(btn().getAttribute('aria-label')).toBe('Hide password')
    expect(btn().querySelector('svg.lucide-eye-off')).not.toBeNull()
    expect(document.activeElement).toBe(input())
    cleanup()
  })

  it('6: the password toggle is hidden when disabled or readOnly, and on non-password types', () => {
    @Component({
      standalone: true,
      imports: [UiInputComponent],
      template: `
        <ui-input id="a" type="password" showPasswordToggle disabled />
        <ui-input id="b" type="password" showPasswordToggle readOnly />
        <ui-input id="c" showPasswordToggle />
      `,
    })
    class Host {}
    const { el, cleanup } = render(Host)
    expect(el.querySelectorAll('button').length).toBe(0)
    cleanup()
  })

  it('7: status=error sets aria-invalid on wrapper and input and paints the destructive border', () => {
    @Component({
      standalone: true,
      imports: [UiInputComponent],
      template: `<ui-input status="error" /><ui-input id="x" aria-invalid="true" />`,
    })
    class Host {}
    const { el, cleanup } = render(Host)
    const [a, b] = Array.from(el.querySelectorAll<HTMLElement>('[data-slot="input"]'))
    expect(a.getAttribute('aria-invalid')).toBe('true')
    expect(a.querySelector('input')!.getAttribute('aria-invalid')).toBe('true')
    expect(has(a, 'border-destructive')).toBe(true)
    expect(a.classList.contains('focus-within:border-ring')).toBe(false)
    expect(b.getAttribute('aria-invalid')).toBe('true')
    expect(b.querySelector('input')!.getAttribute('aria-invalid')).toBe('true')
    expect(el.querySelectorAll('ui-input')[1].hasAttribute('aria-invalid')).toBe(false)
    cleanup()
  })

  it('8: prefix / suffix text and templates render inside the wrapper and reshape the input padding', () => {
    @Component({
      standalone: true,
      imports: [UiInputComponent],
      template: `
        <ng-template #icon><svg class="probe"></svg></ng-template>
        <ui-input id="p" prefix="@" />
        <ui-input id="s" [suffix]="icon" />
        <ui-input id="ps" prefix="@" suffix="USD" size="small" />
      `,
    })
    class Host {}
    const { input, el, cleanup } = render(Host)
    const p = input('#p')
    expect(p.previousElementSibling!.textContent!.trim()).toBe('@')
    expect(
      has(p.previousElementSibling!, 'text-muted-foreground pointer-events-none shrink-0 select-none pl-2.5'),
    ).toBe(true)
    expect(has(p, 'pl-0 pr-2.5')).toBe(true)
    expect(input('#s').nextElementSibling!.querySelector('svg.probe')).not.toBeNull()
    expect(has(input('#s'), 'pl-2.5 pr-0')).toBe(true)
    expect(has(input('#ps'), 'px-0')).toBe(true)
    expect(has(input('#ps').nextElementSibling!, 'flex shrink-0 items-center gap-1 pr-2')).toBe(true)
    expect(el.textContent).toContain('USD')
    cleanup()
  })

  it('9: addonBefore / addonAfter render outside the wrapper and square the touching corners', () => {
    @Component({
      standalone: true,
      imports: [UiInputComponent],
      template: `<ui-input addonBefore="https://" addonAfter=".com" /><ui-input id="b" addonBefore="$" />`,
    })
    class Host {}
    const { el, cleanup } = render(Host)
    const [first, second] = Array.from(el.querySelectorAll('ui-input'))
    const kids = Array.from(first.children)
    expect(kids.map((k) => k.getAttribute('data-slot') ?? k.textContent!.trim())).toEqual(['https://', 'input', '.com'])
    expect(has(kids[0], 'rounded-l-md rounded-r-none border-r-0 bg-muted h-9')).toBe(true)
    expect(has(kids[2], 'rounded-r-md rounded-l-none border-l-0')).toBe(true)
    expect(has(kids[1], 'rounded-none')).toBe(true)
    expect(has(second.querySelector('[data-slot="input"]')!, 'rounded-l-none rounded-r-md')).toBe(true)
    cleanup()
  })

  it('10: clicking the wrapper (e.g. on the prefix) focuses the input; disabled dims the wrapper', () => {
    @Component({
      standalone: true,
      imports: [UiInputComponent],
      template: `<ui-input prefix="@" /><ui-input id="d" disabled />`,
    })
    class Host {}
    const { el, input, cleanup } = render(Host)
    el.querySelector<HTMLElement>('[data-slot="input"] span')!.click()
    expect(document.activeElement).toBe(input())
    const d = input('#d')
    expect(d.disabled).toBe(true)
    expect(has(d.parentElement!, 'pointer-events-none opacity-50 cursor-not-allowed bg-muted/30')).toBe(true)
    cleanup()
  })

  it('11: formControl writes in, typing writes out, blur marks touched, disable() disables', () => {
    @Component({
      standalone: true,
      imports: [UiInputComponent, ReactiveFormsModule],
      template: `<ui-input [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl('hello')
    }
    const { fixture, input, type, cleanup } = render(Host)
    expect(input().value).toBe('hello')
    type('world')
    expect(fixture.componentInstance.ctrl.value).toBe('world')
    input().dispatchEvent(new FocusEvent('blur'))
    expect(fixture.componentInstance.ctrl.touched).toBe(true)
    fixture.componentInstance.ctrl.disable()
    fixture.detectChanges()
    expect(input().disabled).toBe(true)
    cleanup()
  })

  it('12: InputGroup / Addon / Button render the React slots, classes and a type=button', () => {
    @Component({
      standalone: true,
      imports: [UiInputComponent, UiInputGroupComponent, UiInputGroupAddonComponent, UiInputGroupButtonComponent],
      template: `
        <ui-input-group>
          <ui-input-group-addon>https://</ui-input-group-addon>
          <ui-input placeholder="uipkge.dev" />
          <button ui-input-group-button variant="default">Go</button>
        </ui-input-group>
      `,
    })
    class Host {}
    const { el, cleanup } = render(Host)
    const group = el.querySelector<HTMLElement>('[data-slot="input-group"]')!
    expect(group.getAttribute('data-size')).toBe('middle')
    expect(has(group, 'group/input-group relative flex w-full items-stretch rounded-md border h-9 text-sm')).toBe(true)
    const addon = el.querySelector('[data-slot="input-group-addon"]')!
    expect(has(addon, 'flex shrink-0 items-center justify-center px-3 border-r first:border-l-0')).toBe(true)
    const btn = el.querySelector<HTMLButtonElement>('[data-slot="input-group-button"]')!
    expect(btn.tagName).toBe('BUTTON')
    expect(btn.type).toBe('button')
    expect(has(btn, 'bg-primary text-primary-foreground')).toBe(true)
    cleanup()
  })
})
