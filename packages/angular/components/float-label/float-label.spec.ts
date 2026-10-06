// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiFloatLabelComponent } from './float-label.component'
import { UiInputComponent } from '../input/input.component'

// The React FloatLabel as users meet it: the label sits inside the empty field and floats
// up (scale-75, ring colour) while focused or filled -- including a value that was already
// there on first render, which would otherwise be overlapped by the label -- and it is
// linked to the nested control so clicking it focuses the field. Required adds the
// destructive asterisk; disabled dims the wrapper.

async function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  await fixture.whenStable()
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  document.body.appendChild(el)
  const root = (i = 0) => el.querySelectorAll<HTMLElement>('ui-float-label')[i]!
  const label = (i = 0) => root(i).querySelector('label')!
  const field = (i = 0) => root(i).querySelector<HTMLInputElement>('input, textarea, select')!
  return { fixture, el, root, label, field, cleanup: () => el.remove() }
}

const floated = (l: Element) => ['top-0', 'scale-75', 'bg-background'].every((c) => l.classList.contains(c))

describe('FloatLabel (angular, 7 checks)', () => {
  it('1: React DOM: relative flex-col wrapper > label first, then the field; resting label is centred', async () => {
    @Component({
      standalone: true,
      imports: [UiFloatLabelComponent],
      template: `<ui-float-label label="Full Name" class="w-full"><input placeholder=" " /></ui-float-label>`,
    })
    class Host {}
    const { root, label, cleanup } = await render(Host)
    expect(root().getAttribute('data-slot')).toBe('float-label')
    expect(['relative', 'flex', 'flex-col', 'w-full'].every((c) => root().classList.contains(c))).toBe(true)
    expect(root().firstElementChild!.tagName).toBe('LABEL')
    expect(label().textContent).toBe('Full Name')
    expect(root().getAttribute('data-floating')).toBe('false')
    expect(label().classList.contains('top-1/2')).toBe(true)
    expect(floated(label())).toBe(false)
    cleanup()
  })

  it('2: the label is linked to the nested input (a generated id when it has none, its own id otherwise)', async () => {
    @Component({
      standalone: true,
      imports: [UiFloatLabelComponent],
      template: `
        <ui-float-label label="A"><input /></ui-float-label>
        <ui-float-label label="B"><input id="mine" /></ui-float-label>
      `,
    })
    class Host {}
    const { label, field, cleanup } = await render(Host)
    expect(field(0).id).toMatch(/^float-label-\d+$/)
    expect(label(0).getAttribute('for')).toBe(field(0).id)
    expect(label(1).getAttribute('for')).toBe('mine')
    cleanup()
  })

  it('3: focus floats the label and tints it with the ring colour; blur on an empty field drops it', async () => {
    @Component({
      standalone: true,
      imports: [UiFloatLabelComponent],
      template: `<ui-float-label label="Name"><input /></ui-float-label>`,
    })
    class Host {}
    const { fixture, root, label, field, cleanup } = await render(Host)
    field().dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    fixture.detectChanges()
    expect(root().getAttribute('data-floating')).toBe('true')
    expect(floated(label())).toBe(true)
    expect(label().classList.contains('text-ring')).toBe(true)
    field().dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    fixture.detectChanges()
    expect(floated(label())).toBe(false)
    cleanup()
  })

  it('4: typing keeps it floated after blur; clearing lets it fall back', async () => {
    @Component({
      standalone: true,
      imports: [UiFloatLabelComponent],
      template: `<ui-float-label label="Name"><input /></ui-float-label>`,
    })
    class Host {}
    const { fixture, label, field, cleanup } = await render(Host)
    field().value = 'Jo'
    field().dispatchEvent(new Event('input', { bubbles: true }))
    field().dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    fixture.detectChanges()
    expect(floated(label())).toBe(true)
    field().value = ''
    field().dispatchEvent(new Event('input', { bubbles: true }))
    fixture.detectChanges()
    expect(floated(label())).toBe(false)
    cleanup()
  })

  it('5: a value bound before first render (ui-input [value]) is detected, so the label starts floated', async () => {
    @Component({
      standalone: true,
      imports: [UiFloatLabelComponent, UiInputComponent],
      template: `<ui-float-label label="Full Name"><ui-input [(value)]="name" placeholder=" " /></ui-float-label>`,
    })
    class Host {
      name = signal('John Doe')
    }
    const { label, cleanup } = await render(Host)
    expect(floated(label())).toBe(true)
    cleanup()
  })

  it('6: a <select> change is detected too', async () => {
    @Component({
      standalone: true,
      imports: [UiFloatLabelComponent],
      template: `<ui-float-label label="Pick"
        ><select>
          <option value=""></option>
          <option value="a">A</option>
        </select></ui-float-label
      >`,
    })
    class Host {}
    const { fixture, label, field, cleanup } = await render(Host)
    expect(floated(label())).toBe(false)
    field().value = 'a'
    field().dispatchEvent(new Event('change', { bubbles: true }))
    fixture.detectChanges()
    expect(floated(label())).toBe(true)
    cleanup()
  })

  it('7: required adds the asterisk via after:content; disabled dims the wrapper', async () => {
    @Component({
      standalone: true,
      imports: [UiFloatLabelComponent],
      template: `<ui-float-label label="Email" required disabled><input disabled /></ui-float-label>`,
    })
    class Host {}
    const { root, label, cleanup } = await render(Host)
    expect(label().classList.contains("after:content-['*']")).toBe(true)
    expect(label().classList.contains('after:text-destructive')).toBe(true)
    expect(['opacity-50', 'cursor-not-allowed'].every((c) => root().classList.contains(c))).toBe(true)
    cleanup()
  })
})
