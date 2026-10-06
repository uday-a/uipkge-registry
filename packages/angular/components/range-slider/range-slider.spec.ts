// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { UiRangeSliderComponent, type RangeSliderValue } from './range-slider.component'

// React RangeSlider parity (Radix Slider with two thumbs): thumbs sit ON the track at their
// percentages, the range fills between them, keys step the focused thumb, pressing the
// track moves the closest thumb, inverted flips the axis, and label / hint / error wire up
// aria. If these broke, users would see handles below the track, a range that never fills,
// or a slider keyboard users cannot move.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  const thumbs = () => [...el.querySelectorAll<HTMLElement>('[role="slider"]')]
  const root = () => el.querySelector<HTMLElement>('[data-slot="range-slider"]')!
  const key = (target: Element, k: string, shiftKey = false) => {
    const e = new KeyboardEvent('keydown', { key: k, shiftKey, bubbles: true, cancelable: true })
    target.dispatchEvent(e)
    fixture.detectChanges()
    return e
  }
  return { fixture, el, thumbs, root, key, flush: () => fixture.detectChanges() }
}

describe('RangeSlider (angular, 8 checks)', () => {
  it('1: renders React DOM: readouts around the Radix root, track > range, two positioned thumbs', () => {
    @Component({
      standalone: true,
      imports: [UiRangeSliderComponent],
      template: `<ui-range-slider [value]="[20, 80]" />`,
    })
    class Host {}
    const { el, thumbs, root } = render(Host)
    expect(el.querySelector('ui-range-slider')!.getAttribute('class')).toBe('flex flex-col gap-2')
    const row = root().parentElement!
    expect(row.className).toBe('flex items-center gap-4')
    expect(row.firstElementChild!.textContent!.trim()).toBe('20')
    expect(row.lastElementChild!.textContent!.trim()).toBe('80')
    expect(root().getAttribute('data-orientation')).toBe('horizontal')
    const range = root().querySelector<HTMLElement>('[data-slot="slider-range"]')!
    expect(range.style.left).toBe('20%')
    expect(range.style.right).toBe('20%')
    expect(thumbs().length).toBe(2)
    expect(thumbs()[0]!.parentElement!.style.left).toContain('20%')
    expect(thumbs().map((t) => t.getAttribute('aria-label'))).toEqual(['Minimum value', 'Maximum value'])
    expect(thumbs()[1]!.getAttribute('aria-valuenow')).toBe('80')
  })

  it('2: Arrow / Shift+Arrow / Home / End move the focused thumb and commit', () => {
    const commits: RangeSliderValue[] = []
    @Component({
      standalone: true,
      imports: [UiRangeSliderComponent],
      template: `<ui-range-slider [(value)]="v" (valueCommit)="commits.push($event)" />`,
    })
    class Host {
      v: RangeSliderValue = [20, 80]
      commits = commits
    }
    const { fixture, thumbs, key } = render(Host)
    thumbs()[1]!.dispatchEvent(new FocusEvent('focus'))
    expect(key(thumbs()[1]!, 'ArrowRight').defaultPrevented).toBe(true)
    expect(fixture.componentInstance.v).toEqual([20, 81])
    key(thumbs()[1]!, 'ArrowLeft', true)
    expect(fixture.componentInstance.v).toEqual([20, 71])
    key(thumbs()[0]!, 'Home')
    expect(fixture.componentInstance.v).toEqual([0, 71])
    key(thumbs()[0]!, 'End')
    expect(fixture.componentInstance.v).toEqual([0, 100])
    expect(commits.length).toBe(4)
  })

  it('3: pressing the track moves the closest thumb (snapped to step); inverted flips the axis', () => {
    @Component({
      standalone: true,
      imports: [UiRangeSliderComponent],
      template: `<ui-range-slider id="a" [(value)]="a" [step]="5" /><ui-range-slider id="b" [(value)]="b" inverted />`,
    })
    class Host {
      a: RangeSliderValue = [20, 80]
      b: RangeSliderValue = [20, 80]
    }
    const { fixture, el, flush } = render(Host)
    const press = (id: string, x: number) => {
      const r = el.querySelector<HTMLElement>(`#${id}`)!
      r.getBoundingClientRect = () => ({ left: 0, width: 200, top: 0, height: 10 }) as DOMRect
      r.dispatchEvent(
        Object.assign(new Event('pointerdown', { bubbles: true, cancelable: true }), { clientX: x, pointerId: 1 }),
      )
      flush()
    }
    press('a', 142) // 71% -> snaps to 70, closest to 80
    expect(fixture.componentInstance.a).toEqual([20, 70])
    press('b', 20) // inverted: 10% from the left = 90
    expect(fixture.componentInstance.b).toEqual([20, 90])
    expect(el.querySelector<HTMLElement>('#b [data-slot="slider-range"]')!.style.right).toBe('20%')
  })

  it('4: ticks + min/max labels, thumb value bubbles with a formatter', () => {
    @Component({
      standalone: true,
      imports: [UiRangeSliderComponent],
      template: `<ui-range-slider
        [value]="[100, 750]"
        [max]="1000"
        showTicks
        [tickInterval]="250"
        thumbLabel
        [thumbLabelFormat]="fmt"
      />`,
    })
    class Host {
      fmt = (n: number) => `$${n}`
    }
    const { el, thumbs } = render(Host)
    expect(el.querySelectorAll('.bg-muted-foreground\\/30').length).toBe(5)
    expect([...el.querySelectorAll('.justify-between.px-1 span')].map((s) => s.textContent)).toEqual(['0', '1000'])
    expect(thumbs().map((t) => t.textContent!.trim())).toEqual(['$100', '$750'])
  })

  it('5: label, hint and error wire ids / aria like React', () => {
    @Component({
      standalone: true,
      imports: [UiRangeSliderComponent],
      template: `<ui-range-slider id="r" label="Volume" hint="Drag" /><ui-range-slider
          id="e"
          label="Range"
          error
          errorMessages="Bad"
        />`,
    })
    class Host {}
    const { el } = render(Host)
    const r = el.querySelector('#r')!
    expect(el.querySelector('label[for="r"]')!.textContent).toBe('Volume')
    expect(r.getAttribute('aria-describedby')).toBe('r-hint')
    expect(el.querySelector('#r-hint')!.textContent).toBe('Drag')
    const e = el.querySelector('#e')!
    expect(e.getAttribute('aria-invalid')).toBe('true')
    expect(e.getAttribute('aria-describedby')).toBe('e-error')
    expect(el.querySelector('#e-error')!.getAttribute('role')).toBe('alert')
    expect(e.querySelector('[role=slider]')!.classList.contains('border-destructive')).toBe(true)
    expect(e.querySelector('[role=slider]')!.getAttribute('aria-label')).toBe('Range minimum')
  })

  it('6: color and size map to React classes (error -> bg-destructive)', () => {
    @Component({
      standalone: true,
      imports: [UiRangeSliderComponent],
      template: `<ui-range-slider color="error" thumbSize="sm" trackHeight="lg" />`,
    })
    class Host {}
    const { el, thumbs } = render(Host)
    expect(el.querySelector('[data-slot="slider-range"]')!.classList.contains('bg-destructive')).toBe(true)
    expect(el.querySelector('[data-slot="slider-track"]')!.classList.contains('h-2')).toBe(true)
    expect(thumbs()[0]!.classList.contains('size-3')).toBe(true)
  })

  it('7: disabled: data-disabled, thumbs leave the tab order, keys and presses ignored', () => {
    @Component({
      standalone: true,
      imports: [UiRangeSliderComponent],
      template: `<ui-range-slider [(value)]="v" disabled />`,
    })
    class Host {
      v: RangeSliderValue = [25, 75]
    }
    const { fixture, thumbs, root, key } = render(Host)
    expect(root().hasAttribute('data-disabled')).toBe(true)
    expect(thumbs()[0]!.hasAttribute('tabindex')).toBe(false)
    key(thumbs()[0]!, 'End')
    expect(fixture.componentInstance.v).toEqual([25, 75])
  })

  it('8: uncontrolled defaultValue, and form control round-trip', () => {
    @Component({
      standalone: true,
      imports: [UiRangeSliderComponent, ReactiveFormsModule],
      template: `<ui-range-slider id="u" [defaultValue]="[10, 20]" /><ui-range-slider
          id="f"
          [formControl]="control"
        />`,
    })
    class Host {
      control = new FormControl<RangeSliderValue | null>([10, 60])
    }
    const { fixture, el, key, flush } = render(Host)
    const u = () => [...el.querySelectorAll<HTMLElement>('#u [role=slider]')]
    key(u()[0]!, 'Home')
    expect(u()[0]!.getAttribute('aria-valuenow')).toBe('0')
    const f = () => [...el.querySelectorAll<HTMLElement>('#f [role=slider]')]
    expect(f()[1]!.getAttribute('aria-valuenow')).toBe('60')
    key(f()[0]!, 'End') // Radix: End moves the last thumb
    expect(fixture.componentInstance.control.value).toEqual([10, 100])
    expect(f()[1]!.getAttribute('aria-valuenow')).toBe('100')
    fixture.componentInstance.control.disable()
    flush()
    expect(el.querySelector('#f')!.hasAttribute('data-disabled')).toBe(true)
  })
})
