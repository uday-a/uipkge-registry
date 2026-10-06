// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { UiSwitchComponent } from './switch.component'

// Radix Switch, as the React Switch ships it: a real button role="switch" whose
// aria-checked / data-state flip on click (the thumb reads data-state to slide -- if it
// lost it, the thumb would never move), controlled + uncontrolled state, disabled and
// loading block interaction, and a <ui-switch> custom element is still keyboard-operable.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  const sw = () => el.querySelector<HTMLElement>('[data-slot="switch"]')!
  const thumb = () => sw().querySelector<HTMLElement>('[data-slot="switch-thumb"]')!
  const click = () => {
    sw().click()
    fixture.detectChanges()
  }
  return { fixture, el, sw, thumb, click }
}

const key = (el: HTMLElement, k: string) => {
  const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })
  el.dispatchEvent(e)
  return e
}

describe('Switch (angular, 11 checks)', () => {
  it('1: on a native button it is a type=button role=switch, unchecked by default', () => {
    @Component({ standalone: true, imports: [UiSwitchComponent], template: `<button ui-switch id="a"></button>` })
    class Host {}
    const { sw, thumb } = render(Host)
    expect(sw().tagName).toBe('BUTTON')
    expect(sw().getAttribute('type')).toBe('button')
    expect(sw().getAttribute('role')).toBe('switch')
    expect(sw().getAttribute('aria-checked')).toBe('false')
    expect(sw().getAttribute('data-state')).toBe('unchecked')
    expect(sw().getAttribute('value')).toBe('on')
    expect(sw().hasAttribute('tabindex')).toBe(false)
    expect(thumb().getAttribute('data-state')).toBe('unchecked')
  })

  it('2: click toggles aria-checked, the thumb data-state (slide) and emits checkedChange', () => {
    const seen: boolean[] = []
    @Component({
      standalone: true,
      imports: [UiSwitchComponent],
      template: `<button ui-switch (checkedChange)="seen.push($event)"></button>`,
    })
    class Host {
      seen = seen
    }
    const { sw, thumb, click } = render(Host)
    click()
    expect(sw().getAttribute('aria-checked')).toBe('true')
    expect(thumb().getAttribute('data-state')).toBe('checked')
    expect(thumb().className).toContain('data-[state=checked]:translate-x-[calc(100%-2px)]')
    click()
    expect(seen).toEqual([true, false])
  })

  it('3: defaultChecked starts on and stays uncontrolled', () => {
    @Component({
      standalone: true,
      imports: [UiSwitchComponent],
      template: `<button ui-switch defaultChecked></button>`,
    })
    class Host {}
    const { sw, click } = render(Host)
    expect(sw().getAttribute('data-state')).toBe('checked')
    click()
    expect(sw().getAttribute('data-state')).toBe('unchecked')
  })

  it('4: controlled [checked] only changes when the parent updates it; [(checked)] does', () => {
    @Component({
      standalone: true,
      imports: [UiSwitchComponent],
      template: `<button ui-switch id="c" [checked]="locked"></button
        ><button ui-switch id="t" [(checked)]="on"></button>`,
    })
    class Host {
      locked = false
      on = false
    }
    const { fixture, el } = render(Host)
    const c = el.querySelector<HTMLElement>('#c')!
    const t = el.querySelector<HTMLElement>('#t')!
    c.click()
    t.click()
    fixture.detectChanges()
    expect(c.getAttribute('aria-checked')).toBe('false')
    expect(t.getAttribute('aria-checked')).toBe('true')
    expect(fixture.componentInstance.on).toBe(true)
  })

  it('5: disabled and loading disable the button, ignore clicks; loading shows the spinner', () => {
    @Component({
      standalone: true,
      imports: [UiSwitchComponent],
      template: `<button ui-switch id="d" disabled></button><button ui-switch id="l" loading></button>`,
    })
    class Host {}
    const { fixture, el } = render(Host)
    for (const id of ['#d', '#l']) {
      const b = el.querySelector<HTMLButtonElement>(id)!
      expect(b.disabled).toBe(true)
      expect(b.hasAttribute('data-disabled')).toBe(true)
      b.click()
      fixture.detectChanges()
      expect(b.getAttribute('aria-checked')).toBe('false')
    }
    const spinner = el.querySelector('#l [data-slot="switch-thumb"] svg')!
    expect(spinner.getAttribute('class')).toContain('lucide-loader-circle')
    expect(spinner.getAttribute('class')).toContain('motion-safe:animate-spin')
    expect(el.querySelector('#d svg')).toBeNull()
  })

  it('6: a <ui-switch> host is focusable and toggles with Enter / Space', () => {
    @Component({ standalone: true, imports: [UiSwitchComponent], template: `<ui-switch />` })
    class Host {}
    const { fixture, sw } = render(Host)
    expect(sw().getAttribute('role')).toBe('switch')
    expect(sw().getAttribute('tabindex')).toBe('0')
    expect(key(sw(), ' ').defaultPrevented).toBe(true)
    fixture.detectChanges()
    expect(sw().getAttribute('aria-checked')).toBe('true')
    key(sw(), 'Enter')
    fixture.detectChanges()
    expect(sw().getAttribute('aria-checked')).toBe('false')
  })

  it('7: a disabled <ui-switch> leaves the Tab order and is aria-disabled', () => {
    @Component({ standalone: true, imports: [UiSwitchComponent], template: `<ui-switch disabled />` })
    class Host {}
    const { fixture, sw } = render(Host)
    expect(sw().hasAttribute('tabindex')).toBe(false)
    expect(sw().getAttribute('aria-disabled')).toBe('true')
    expect(sw().className).toContain('data-[disabled]:opacity-50')
    key(sw(), ' ')
    fixture.detectChanges()
    expect(sw().getAttribute('aria-checked')).toBe('false')
  })

  it('8: sizes change track + thumb, lg thumb travels calc(100%-5px), inner text widens the track', () => {
    @Component({
      standalone: true,
      imports: [UiSwitchComponent],
      template: `<button ui-switch id="sm" size="sm"></button><button ui-switch id="lg" size="lg"></button>
        <button ui-switch id="txt" checkedChildren="ON" unCheckedChildren="OFF"></button>`,
    })
    class Host {}
    const { el } = render(Host)
    const has = (sel: string, ...c: string[]) => c.every((x) => el.querySelector(sel)!.classList.contains(x))
    expect(has('#sm', 'h-4', 'w-6')).toBe(true)
    expect(has('#lg', 'h-6', 'w-11')).toBe(true)
    expect(has('#sm [data-slot="switch-thumb"]', 'size-3')).toBe(true)
    expect(has('#lg [data-slot="switch-thumb"]', 'data-[state=checked]:translate-x-[calc(100%-5px)]')).toBe(true)
    expect(has('#txt', 'min-w-10', 'w-fit')).toBe(true)
  })

  it('9: checked / unchecked children (text or template) swap visibility with the state', () => {
    @Component({
      standalone: true,
      imports: [UiSwitchComponent],
      template: `<button ui-switch checkedChildren="ON" [unCheckedChildren]="off"></button>
        <ng-template #off><i class="off-icon"></i></ng-template>`,
    })
    class Host {}
    const { sw, click } = render(Host)
    const [on, offSide] = Array.from(sw().querySelectorAll(':scope > div')) as HTMLElement[]
    expect(on!.textContent).toContain('ON')
    expect(offSide!.querySelector('.off-icon')).not.toBeNull()
    expect(on!.className).toContain('opacity-0')
    expect(offSide!.className).toContain('opacity-100')
    click()
    expect(on!.className).toContain('opacity-100')
    expect(offSide!.className).toContain('opacity-0')
  })

  it('10: color maps to the --switch-checked-bg the checked track reads', () => {
    @Component({
      standalone: true,
      imports: [UiSwitchComponent],
      template: `<button ui-switch id="e" color="error"></button><button ui-switch id="h" color="#8b5cf6"></button
        ><button ui-switch id="p"></button>`,
    })
    class Host {}
    const { el } = render(Host)
    const bg = (id: string) => el.querySelector<HTMLElement>(id)!.style.getPropertyValue('--switch-checked-bg')
    expect(bg('#e')).toBe('var(--destructive)')
    expect(bg('#h')).toBe('#8b5cf6')
    expect(bg('#p')).toBe('var(--primary)')
    expect(el.querySelector('#p')!.className).toContain('data-[state=checked]:bg-[var(--switch-checked-bg)]')
  })

  it('11: formControl writes in, clicks write back, disable() disables', () => {
    @Component({
      standalone: true,
      imports: [UiSwitchComponent, ReactiveFormsModule],
      template: `<button ui-switch [formControl]="ctrl"></button>`,
    })
    class Host {
      ctrl = new FormControl(true)
    }
    const { fixture, sw, click } = render(Host)
    expect(sw().getAttribute('aria-checked')).toBe('true')
    click()
    expect(fixture.componentInstance.ctrl.value).toBe(false)
    fixture.componentInstance.ctrl.disable()
    fixture.detectChanges()
    expect((sw() as HTMLButtonElement).disabled).toBe(true)
  })
})
