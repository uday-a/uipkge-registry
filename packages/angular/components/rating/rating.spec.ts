// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiRatingComponent } from './rating.component'

// React Rating parity: a radiogroup of role="radio" star buttons with a roving tab stop,
// full / half / empty star icons, click-position half resolution, Arrow / Home / End /
// Enter keys, clearable reset, tooltips, and inert read-only / disabled states. If these
// broke, stars would not fill, keyboard users could not rate, or read-only scores could change.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  const stars = () => [...el.querySelectorAll<HTMLButtonElement>('button[role="radio"]')]
  const key = (target: Element, k: string) => {
    const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })
    target.dispatchEvent(e)
    fixture.detectChanges()
    return e
  }
  return { fixture, el, stars, key, flush: () => fixture.detectChanges() }
}

describe('Rating (angular, 8 checks)', () => {
  it('1: renders React DOM: radiogroup host with aria value + label, N radio buttons, roving tabindex', () => {
    @Component({ standalone: true, imports: [UiRatingComponent], template: `<ui-rating [value]="3" />` })
    class Host {}
    const { el, stars } = render(Host)
    const host = el.querySelector('ui-rating')!
    expect(host.getAttribute('role')).toBe('radiogroup')
    expect(host.getAttribute('data-slot')).toBe('rating')
    expect(host.getAttribute('aria-label')).toBe('Rating: 3 of 5')
    expect(host.getAttribute('aria-valuenow')).toBe('3')
    expect(['inline-flex', 'items-center', 'gap-0.5'].every((c) => host.classList.contains(c))).toBe(true)
    expect(stars().length).toBe(5)
    expect(stars().map((s) => s.getAttribute('tabindex'))).toEqual(['-1', '-1', '0', '-1', '-1'])
    expect(stars().map((s) => s.getAttribute('aria-checked'))).toEqual(['false', 'false', 'true', 'false', 'false'])
    expect(stars()[0]!.getAttribute('aria-label')).toBe('rating 1 of 5')
    expect(stars()[0]!.style.padding).toBe('0.0625rem')
  })

  it('2: filled stars use the pop-in icon with staggered delay; half star gets a gradient; rest are outlines', () => {
    @Component({
      standalone: true,
      imports: [UiRatingComponent],
      template: `<ui-rating [value]="2.5" halfIncrements />`,
    })
    class Host {}
    const { stars } = render(Host)
    const [a, b, c, d] = stars()
    expect(a!.querySelector('svg')!.getAttribute('class')).toBe('rating-star-full-icon')
    expect(b!.style.getPropertyValue('--star-delay')).toBe('45ms')
    const grad = c!.querySelector('linearGradient')!
    expect(c!.querySelector('path')!.getAttribute('fill')).toBe(`url(#${grad.id})`)
    expect(d!.querySelector('svg')!.getAttribute('stroke-width')).toBe('1.5')
    expect(document.head.textContent).toContain('rating-star-pop')
  })

  it('3: clicking sets the value; with halfIncrements the left half picks n - 0.5', () => {
    @Component({
      standalone: true,
      imports: [UiRatingComponent],
      template: `<ui-rating [(value)]="v" halfIncrements />`,
    })
    class Host {
      v = 0
    }
    const { fixture, stars, flush } = render(Host)
    const star = stars()[3]!
    star.getBoundingClientRect = () => ({ left: 100, width: 20 }) as DOMRect
    star.dispatchEvent(new MouseEvent('click', { clientX: 105, bubbles: true }))
    flush()
    expect(fixture.componentInstance.v).toBe(3.5)
    star.dispatchEvent(new MouseEvent('click', { clientX: 115, bubbles: true }))
    flush()
    expect(fixture.componentInstance.v).toBe(4)
  })

  it('4: keyboard: Arrow steps (0.5 with halves), Home / End jump, Enter picks the focused star', () => {
    @Component({
      standalone: true,
      imports: [UiRatingComponent],
      template: `<ui-rating [(value)]="v" halfIncrements />`,
    })
    class Host {
      v = 2
    }
    const { fixture, stars, key } = render(Host)
    expect(key(stars()[1]!, 'ArrowRight').defaultPrevented).toBe(true)
    expect(fixture.componentInstance.v).toBe(2.5)
    key(stars()[2]!, 'ArrowLeft')
    expect(fixture.componentInstance.v).toBe(2)
    key(stars()[1]!, 'End')
    expect(fixture.componentInstance.v).toBe(5)
    key(stars()[4]!, 'Home')
    expect(fixture.componentInstance.v).toBe(0.5)
    key(stars()[3]!, 'Enter')
    expect(fixture.componentInstance.v).toBe(4)
  })

  it('5: clearable: clicking the selected star resets to zero', () => {
    @Component({ standalone: true, imports: [UiRatingComponent], template: `<ui-rating [(value)]="v" clearable />` })
    class Host {
      v = 2
    }
    const { fixture, stars, flush } = render(Host)
    expect(stars()[0]!.classList.contains('cursor-pointer')).toBe(true)
    stars()[1]!.click()
    flush()
    expect(fixture.componentInstance.v).toBe(0)
  })

  it('6: read-only and disabled: buttons disabled, out of the tab order, clicks ignored', () => {
    const seen: number[] = []
    @Component({
      standalone: true,
      imports: [UiRatingComponent],
      template: `<ui-rating id="r" [value]="4" readonly (valueChange)="seen.push($event)" /><ui-rating
          id="d"
          [value]="3"
          disabled
          (valueChange)="seen.push($event)"
        />`,
    })
    class Host {
      seen = seen
    }
    const { el } = render(Host)
    for (const id of ['#r', '#d']) {
      const btns = [...el.querySelectorAll<HTMLButtonElement>(`${id} button`)]
      expect(btns.every((b) => b.disabled && b.getAttribute('tabindex') === '-1')).toBe(true)
      btns[0]!.click()
    }
    expect(el.querySelector('#d')!.classList.contains('opacity-50')).toBe(true)
    expect(el.querySelector('#r')!.classList.contains('cursor-default')).toBe(true)
    expect(seen).toEqual([])
  })

  it('7: uncontrolled defaultValue, tooltips and showValue', () => {
    @Component({
      standalone: true,
      imports: [UiRatingComponent],
      template: `<ui-rating [defaultValue]="1" showValue [tooltips]="['Bad', 'Ok', 'Good']" [max]="3" />`,
    })
    class Host {}
    const { el, stars, flush } = render(Host)
    expect(stars()[2]!.getAttribute('title')).toBe('Good')
    expect(stars()[2]!.getAttribute('aria-label')).toBe('Good')
    stars()[2]!.click()
    flush()
    expect(el.querySelector('span.font-semibold')!.textContent).toBe('3')
    expect(el.querySelector('ui-rating')!.classList.contains('flex')).toBe(true)
  })

  it('8: variants and sizes map to React classes / icon sizes', () => {
    @Component({
      standalone: true,
      imports: [UiRatingComponent],
      template: `<ui-rating id="f" variant="filled" size="x-large" /><ui-rating
          id="s"
          variant="soft"
          density="compact"
        />`,
    })
    class Host {}
    const { el } = render(Host)
    expect(['bg-muted', 'p-1', 'rounded-lg'].every((c) => el.querySelector('#f')!.classList.contains(c))).toBe(true)
    expect(el.querySelector<SVGElement>('#f svg')!.style.width).toBe('2rem')
    expect(el.querySelector('#s')!.className).toContain('bg-accent')
    expect(el.querySelector<HTMLElement>('#s button')!.style.padding).toBe('0px')
  })
})
