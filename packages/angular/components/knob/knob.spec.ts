// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { UiKnobComponent } from './knob.component'

// React Knob parity: the svg itself is the role="slider" (focus ring, cursor and size sit
// on it), keys step / page / jump, the wheel steps and cannot scroll the page, readonly and
// disabled block input, and the centred <text> can be templated. If these broke, the dial
// would look right but ignore keyboard users, scroll the page, or accept edits when locked.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  const svg = (sel = '') => el.querySelector<SVGSVGElement>(`${sel} svg[role="slider"]`.trim())!
  const key = (target: Element, k: string) => {
    const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })
    target.dispatchEvent(e)
    fixture.detectChanges()
    return e
  }
  return { fixture, el, svg, key, flush: () => fixture.detectChanges() }
}

describe('Knob (angular, 8 checks)', () => {
  it('1: renders React DOM: contents host > svg[role=slider] with classes, size, arcs and centred text', () => {
    @Component({ standalone: true, imports: [UiKnobComponent], template: `<ui-knob [value]="40" class="m-1" />` })
    class Host {}
    const { el, svg } = render(Host)
    expect(el.querySelector('ui-knob')!.className).toBe('contents')
    const s = svg()
    expect(s.getAttribute('data-slot')).toBe('knob')
    for (const c of ['inline-block', 'rounded-full', 'focus-visible:ring-2', 'cursor-pointer', 'm-1'])
      expect(s.classList.contains(c), c).toBe(true)
    expect(s.getAttribute('width')).toBe('100')
    expect(s.getAttribute('aria-label')).toBe('Value')
    expect(s.getAttribute('aria-valuenow')).toBe('40')
    expect(s.getAttribute('tabindex')).toBe('0')
    expect(s.querySelectorAll('path').length).toBe(2)
    const text = s.querySelector('text')!
    expect(text.textContent!.trim()).toBe('40')
    expect(text.getAttribute('class')).toBe('fill-foreground font-medium')
  })

  it('2: Arrow / PageUp / PageDown / Home / End step and prevent default', () => {
    @Component({ standalone: true, imports: [UiKnobComponent], template: `<ui-knob [(value)]="v" />` })
    class Host {
      v = 50
    }
    const { fixture, svg, key } = render(Host)
    expect(key(svg(), 'ArrowUp').defaultPrevented).toBe(true)
    expect(fixture.componentInstance.v).toBe(51)
    key(svg(), 'ArrowLeft')
    expect(fixture.componentInstance.v).toBe(50)
    key(svg(), 'PageUp')
    expect(fixture.componentInstance.v).toBe(60)
    key(svg(), 'PageDown')
    expect(fixture.componentInstance.v).toBe(50)
    key(svg(), 'End')
    expect(fixture.componentInstance.v).toBe(100)
    key(svg(), 'Home')
    expect(fixture.componentInstance.v).toBe(0)
    expect(svg().getAttribute('aria-valuenow')).toBe('0')
  })

  it('3: uncontrolled defaultValue moves internally and emits valueChange + change', () => {
    const seen: string[] = []
    @Component({
      standalone: true,
      imports: [UiKnobComponent],
      template: `<ui-knob
        [defaultValue]="7"
        [max]="10"
        (valueChange)="seen.push('v' + $event)"
        (change)="seen.push('c' + $event)"
      />`,
    })
    class Host {
      seen = seen
    }
    const { svg, key } = render(Host)
    key(svg(), 'ArrowRight')
    expect(svg().getAttribute('aria-valuenow')).toBe('8')
    key(svg(), 'End')
    key(svg(), 'End') // already at max: no emit
    expect(seen).toEqual(['v8', 'c8', 'v10', 'c10'])
  })

  it('4: wheel steps and is cancelled (non-passive) so the page does not scroll', () => {
    @Component({ standalone: true, imports: [UiKnobComponent], template: `<ui-knob [(value)]="v" />` })
    class Host {
      v = 20
    }
    const { fixture, svg, flush } = render(Host)
    const up = new WheelEvent('wheel', { deltaY: -100, cancelable: true })
    svg().dispatchEvent(up)
    flush()
    expect(up.defaultPrevented).toBe(true)
    expect(fixture.componentInstance.v).toBe(21)
    svg().dispatchEvent(new WheelEvent('wheel', { deltaY: 100, cancelable: true }))
    expect(fixture.componentInstance.v).toBe(20)
  })

  it('5: readonly keeps focus but blocks input; disabled also leaves the tab order', () => {
    @Component({
      standalone: true,
      imports: [UiKnobComponent],
      template: `<ui-knob id="r" [(value)]="v" readonly /><ui-knob id="d" [(value)]="v" disabled />`,
    })
    class Host {
      v = 75
    }
    const { fixture, el, key } = render(Host)
    const [r, d] = [...el.querySelectorAll('svg')]
    expect(r!.getAttribute('aria-readonly')).toBe('true')
    expect(r!.getAttribute('tabindex')).toBe('0')
    expect(r!.classList.contains('cursor-pointer')).toBe(false)
    expect(d!.getAttribute('aria-disabled')).toBe('true')
    expect(d!.getAttribute('tabindex')).toBe('-1')
    expect(d!.classList.contains('cursor-not-allowed')).toBe(true)
    key(r!, 'ArrowUp')
    key(d!, 'ArrowUp')
    const wheel = new WheelEvent('wheel', { deltaY: -1, cancelable: true })
    d!.dispatchEvent(wheel)
    expect(wheel.defaultPrevented).toBe(false)
    expect(fixture.componentInstance.v).toBe(75)
  })

  it('6: pointer drag maps the angle to a value (pointer capture on press)', () => {
    @Component({ standalone: true, imports: [UiKnobComponent], template: `<ui-knob [(value)]="v" />` })
    class Host {
      v = 0
    }
    const { fixture, svg, flush } = render(Host)
    const s = svg()
    s.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100 }) as DOMRect
    const ev = (type: string, x: number, y: number) =>
      Object.assign(new Event(type, { bubbles: true }), { clientX: x, clientY: y, pointerId: 1 })
    // The 270deg sweep runs clockwise from up-left (-0.75pi) through right (0) to down-left.
    s.dispatchEvent(ev('pointerdown', 50, 0)) // straight up = 1/6 of the sweep
    flush()
    expect(fixture.componentInstance.v).toBe(17)
    s.dispatchEvent(ev('pointermove', 100, 50)) // right = middle
    flush()
    expect(fixture.componentInstance.v).toBe(50)
    s.dispatchEvent(ev('pointerup', 100, 50))
    s.dispatchEvent(ev('pointermove', 50, 0)) // released: ignored
    expect(fixture.componentInstance.v).toBe(50)
  })

  it('7: renderValue template replaces the centred text', () => {
    @Component({
      standalone: true,
      imports: [UiKnobComponent],
      template: `<ui-knob [(value)]="v" [renderValue]="pct" /><ng-template #pct let-value
          ><svg:tspan>{{ value }}%</svg:tspan></ng-template
        >`,
    })
    class Host {
      v = 50
    }
    const { svg, key } = render(Host)
    expect(svg().querySelector('text tspan')!.textContent).toBe('50%')
    key(svg(), 'ArrowUp')
    expect(svg().querySelector('text tspan')!.textContent).toBe('51%')
  })

  it('8: form control writes in, key steps flow out, disable reaches the dial', () => {
    @Component({
      standalone: true,
      imports: [UiKnobComponent, ReactiveFormsModule],
      template: `<ui-knob [formControl]="control" />`,
    })
    class Host {
      control = new FormControl<number | null>(42)
    }
    const { fixture, svg, key, flush } = render(Host)
    expect(svg().getAttribute('aria-valuenow')).toBe('42')
    key(svg(), 'ArrowUp')
    expect(fixture.componentInstance.control.value).toBe(43)
    expect(svg().getAttribute('aria-valuenow')).toBe('43')
    fixture.componentInstance.control.disable()
    flush()
    expect(svg().getAttribute('aria-disabled')).toBe('true')
  })
})
