// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { UiTextareaComponent } from './textarea.component'

// The React Textarea as users meet it: the label is linked to an auto-generated id (click
// the label -> focus the field), typing is controlled / uncontrolled like React, showCount
// and the formatter track the length, allowClear empties and refocuses, rules validate on
// blur / input with role=alert messages wired through aria-describedby, the hint hides
// while focused, and formControl binds. If any of this broke, screen readers would lose the
// error, counters would drift, or the model would stop updating.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  document.body.appendChild(el)
  const ta = (sel = 'textarea') => el.querySelector<HTMLTextAreaElement>(sel)!
  const type = (text: string, target = ta()) => {
    target.value = text
    target.dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()
  }
  return { fixture, el, ta, type, cleanup: () => el.remove() }
}

const has = (el: Element, classes: string) => classes.split(' ').every((c) => el.classList.contains(c))
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r(null)))

describe('Textarea (angular, 11 checks)', () => {
  it('1: React DOM: block relative space-y-2 host > outlined control > textarea (3 rows) > description block', () => {
    @Component({ standalone: true, imports: [UiTextareaComponent], template: `<ui-textarea placeholder="Type" />` })
    class Host {}
    const { el, ta, cleanup } = render(Host)
    const host = el.querySelector('ui-textarea')!
    expect(has(host, 'block relative space-y-2')).toBe(true)
    const control = ta().parentElement!
    expect(
      has(control, 'relative flex items-center w-full border-2 rounded-lg border-input text-base min-h-[48px]'),
    ).toBe(true)
    expect(ta().rows).toBe(3)
    expect(has(ta(), 'w-full flex-1 bg-transparent outline-none resize-y pl-3 pr-3 py-2')).toBe(true)
    expect(ta().id).toMatch(/^textarea-\d+$/)
    const desc = control.nextElementSibling!
    expect(desc.id).toBe(`${ta().id}-description`)
    expect(desc.className).toBe('mt-1.5')
    // Nothing to describe -> no aria-describedby.
    expect(ta().hasAttribute('aria-describedby')).toBe(false)
    cleanup()
  })

  it('2: label is linked to the textarea id, shows the required marker and turns primary while focused', () => {
    @Component({
      standalone: true,
      imports: [UiTextareaComponent],
      template: `<ui-textarea id="bio" label="Bio" required />`,
    })
    class Host {}
    const { fixture, el, ta, cleanup } = render(Host)
    const label = el.querySelector('label')!
    expect(label.getAttribute('for')).toBe('bio')
    expect(ta().id).toBe('bio')
    expect(el.querySelector('ui-textarea')!.hasAttribute('id')).toBe(false)
    expect(label.querySelector('span.text-destructive')!.textContent).toBe('*')
    ta().dispatchEvent(new FocusEvent('focus'))
    fixture.detectChanges()
    expect(label.classList.contains('text-primary')).toBe(true)
    expect(has(ta().parentElement!, 'border-primary ring-2 ring-primary/20')).toBe(true)
    cleanup()
  })

  it('3: uncontrolled defaultValue; [(value)] two-way; a rejected controlled edit reverts', () => {
    @Component({
      standalone: true,
      imports: [UiTextareaComponent],
      template: `<ui-textarea id="u" defaultValue="hi" /><ui-textarea id="b" [(value)]="text" /><ui-textarea
          id="l"
          value="fixed"
        />`,
    })
    class Host {
      text = signal('')
    }
    const { fixture, ta, type, cleanup } = render(Host)
    expect(ta('#u').value).toBe('hi')
    type('hello', ta('#u'))
    expect(ta('#u').value).toBe('hello')
    type('abc', ta('#b'))
    expect(fixture.componentInstance.text()).toBe('abc')
    type('fixed!', ta('#l'))
    expect(ta('#l').value).toBe('fixed')
    cleanup()
  })

  it('4: showCount renders "n / max" (or just n) and a formatter overrides the text', () => {
    @Component({
      standalone: true,
      imports: [UiTextareaComponent],
      template: `
        <ui-textarea id="a" showCount [maxLength]="5" defaultValue="abc" />
        <ui-textarea id="b" [showCount]="{ formatter: fmt }" [maxLength]="100" defaultValue="ab" />
        <ui-textarea id="c" showCount defaultValue="abcd" />
      `,
    })
    class Host {
      fmt = (count: number, max?: number) => `${count}${max ? ' / ' + max : ''} characters`
    }
    const { ta, cleanup } = render(Host)
    const count = (id: string) => ta(id).parentElement!.querySelector('.bottom-1\\.5')!
    expect(count('#a').textContent).toBe('3 / 5')
    // Same cn() as React: the later py-2 wins over pb-6.
    expect(ta('#a').classList.contains('py-2')).toBe(true)
    expect(count('#b').textContent).toBe('2 / 100 characters')
    expect(count('#c').textContent).toBe('4')
    cleanup()
  })

  it('5: allowClear shows the X with a value, clears, emits valueChange("") + clear, and refocuses', async () => {
    const events: string[] = []
    @Component({
      standalone: true,
      imports: [UiTextareaComponent],
      template: `<ui-textarea
        defaultValue="Type something"
        allowClear
        (valueChange)="events.push('v:' + $event)"
        (clear)="events.push('clear')"
      />`,
    })
    class Host {
      events = events
    }
    const { fixture, el, ta, cleanup } = render(Host)
    const btn = el.querySelector<HTMLButtonElement>('button[aria-label="Clear"]')!
    expect(btn.tabIndex).toBe(-1)
    expect(has(btn, 'absolute top-3 right-3')).toBe(true)
    expect(ta().classList.contains('pr-10')).toBe(true)
    btn.click()
    fixture.detectChanges()
    expect(ta().value).toBe('')
    expect(events).toEqual(['v:', 'clear'])
    expect(el.querySelector('button[aria-label="Clear"]')).toBeNull()
    await nextFrame()
    expect(document.activeElement).toBe(ta())
    cleanup()
  })

  it('6: rules validate on blur: role=alert message, aria-invalid, aria-describedby and a destructive label', () => {
    @Component({
      standalone: true,
      imports: [UiTextareaComponent],
      template: `<ui-textarea label="Notes" hint="Say something" [rules]="rules" validateOn="blur" />`,
    })
    class Host {
      rules = [(v: string) => (String(v).length > 2 ? true : 'Too short')]
    }
    const { fixture, el, ta, cleanup } = render(Host)
    expect(el.textContent).toContain('Say something')
    ta().dispatchEvent(new FocusEvent('focus'))
    fixture.detectChanges()
    // The hint hides while the field is focused.
    expect(el.textContent).not.toContain('Say something')
    ta().dispatchEvent(new FocusEvent('blur'))
    fixture.detectChanges()
    const alert = el.querySelector('[role="alert"]')!
    expect(alert.textContent!.trim()).toBe('Too short')
    expect(alert.querySelector('svg.lucide-circle-alert')).not.toBeNull()
    expect(ta().getAttribute('aria-invalid')).toBe('true')
    expect(ta().getAttribute('aria-describedby')).toBe(`${ta().id}-description`)
    expect(el.querySelector('label')!.classList.contains('text-destructive')).toBe(true)
    // With an error the hint stays hidden (no persistentHint).
    expect(el.textContent).not.toContain('Say something')
    cleanup()
  })

  it('7: validateOn=input re-runs rules against the value just typed', () => {
    @Component({
      standalone: true,
      imports: [UiTextareaComponent],
      template: `<ui-textarea [rules]="rules" validateOn="input" />`,
    })
    class Host {
      rules = [(v: string) => (String(v).includes('@') ? true : 'Need @')]
    }
    const { el, type, cleanup } = render(Host)
    type('abc')
    expect(el.querySelector('[role="alert"]')!.textContent!.trim()).toBe('Need @')
    type('a@c')
    expect(el.querySelector('[role="alert"]')).toBeNull()
    cleanup()
  })

  it('8: error / success props render trailing icons and messages; loading swaps in the spinner', () => {
    @Component({
      standalone: true,
      imports: [UiTextareaComponent],
      template: `
        <ui-textarea id="e" error="Bad" />
        <ui-textarea id="s" success="Good" />
        <ui-textarea id="l" error="Bad" loading />
      `,
    })
    class Host {}
    const { ta, cleanup } = render(Host)
    const ctl = (id: string) => ta(id).parentElement!
    expect(ctl('#e').querySelector('.text-destructive svg.lucide-circle-alert')).not.toBeNull()
    expect(ctl('#s').querySelector('.text-success svg.lucide-check')).not.toBeNull()
    expect(ctl('#s').nextElementSibling!.textContent).toContain('Good')
    expect(ctl('#l').querySelector('svg.lucide-loader.animate-spin')).not.toBeNull()
    expect(ctl('#l').querySelector('.text-destructive svg')).toBeNull()
    cleanup()
  })

  it('9: variants, disabled and readOnly map to the React wrapper classes', () => {
    @Component({
      standalone: true,
      imports: [UiTextareaComponent],
      template: `
        <ui-textarea id="f" variant="filled" />
        <ui-textarea id="u" variant="underlined" />
        <ui-textarea id="d" disabled />
        <ui-textarea id="r" readOnly />
      `,
    })
    class Host {}
    const { ta, cleanup } = render(Host)
    expect(has(ta('#f').parentElement!, 'border-b-2 bg-muted/50 rounded-t-lg border-transparent')).toBe(true)
    expect(has(ta('#u').parentElement!, 'border-b-2 rounded-none border-muted-foreground/30')).toBe(true)
    expect(has(ta('#d').parentElement!, 'pointer-events-none opacity-50')).toBe(true)
    expect(ta('#d').disabled).toBe(true)
    expect(ta('#r').readOnly).toBe(true)
    expect(ta('#r').parentElement!.classList.contains('cursor-default')).toBe(true)
    cleanup()
  })

  it('10: autoSize disables manual resize and writes an explicit height', async () => {
    @Component({
      standalone: true,
      imports: [UiTextareaComponent],
      template: `<ui-textarea [autoSize]="{ minRows: 2, maxRows: 6 }" defaultValue="a" />`,
    })
    class Host {}
    const { ta, cleanup } = render(Host)
    expect(ta().classList.contains('resize-none')).toBe(true)
    await nextFrame()
    await nextFrame()
    expect(ta().style.height).toMatch(/px$/)
    cleanup()
  })

  it('11: formControl writes in, typing writes out, blur marks touched, disable() disables', () => {
    @Component({
      standalone: true,
      imports: [UiTextareaComponent, ReactiveFormsModule],
      template: `<ui-textarea [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl('notes')
    }
    const { fixture, ta, type, cleanup } = render(Host)
    expect(ta().value).toBe('notes')
    type('more')
    expect(fixture.componentInstance.ctrl.value).toBe('more')
    ta().dispatchEvent(new FocusEvent('blur'))
    expect(fixture.componentInstance.ctrl.touched).toBe(true)
    fixture.componentInstance.ctrl.disable()
    fixture.detectChanges()
    expect(ta().disabled).toBe(true)
    cleanup()
  })
})
