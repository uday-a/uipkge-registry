// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { UiSignaturePadComponent } from './signature-pad.component'

// React SignaturePad parity: the canvas is sized for the device pixel ratio and filled with
// the background, pointer strokes actually draw lines, the value is a real data URL (null
// when cleared), the footer counts points and only enables Clear once there is ink, and
// disabled / readonly pads cannot be drawn on. If these broke, users would sign and nothing
// would be captured, or a read-only contract could be scribbled on.

// jsdom has no canvas: record the 2D calls instead.
let calls: string[] = []
const realGetContext = HTMLCanvasElement.prototype.getContext
const realToDataURL = HTMLCanvasElement.prototype.toDataURL
beforeEach(() => {
  calls = []
  const ctx = new Proxy(
    {},
    {
      get:
        (_t, prop: string) =>
        (...args: unknown[]) =>
          calls.push(`${prop}(${args.join(',')})`),
      set: (_t, prop: string, value: unknown) => (calls.push(`${prop}=${value}`), true),
    },
  )
  HTMLCanvasElement.prototype.getContext = (() => ctx) as never
  HTMLCanvasElement.prototype.toDataURL = function (type?: string) {
    return `data:${type};base64,INK`
  }
})
afterEach(() => {
  HTMLCanvasElement.prototype.getContext = realGetContext
  HTMLCanvasElement.prototype.toDataURL = realToDataURL
})

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  const canvas = (sel = 'ui-signature-pad') => el.querySelector<HTMLCanvasElement>(`${sel} canvas`)!
  const stroke = (c: HTMLCanvasElement, points: [number, number][]) => {
    c.getBoundingClientRect = () => ({ left: 0, top: 0, width: 400, height: 200 }) as DOMRect
    const ev = (type: string, [x, y]: [number, number]) =>
      Object.assign(new Event(type, { bubbles: true, cancelable: true }), { clientX: x, clientY: y, pointerId: 1 })
    c.dispatchEvent(ev('pointerdown', points[0]!))
    for (const p of points.slice(1)) c.dispatchEvent(ev('pointermove', p))
    c.dispatchEvent(ev('pointerup', points[points.length - 1]!))
    fixture.detectChanges()
  }
  return { fixture, el, canvas, stroke, flush: () => fixture.detectChanges() }
}

describe('SignaturePad (angular, 7 checks)', () => {
  it('1: renders React DOM: bordered host, role=img canvas sized to width x height and filled, footer', () => {
    @Component({
      standalone: true,
      imports: [UiSignaturePadComponent],
      template: `<ui-signature-pad class="w-full" />`,
    })
    class Host {}
    const { el, canvas } = render(Host)
    const host = el.querySelector('ui-signature-pad')!
    for (const c of ['border-input', 'inline-flex', 'flex-col', 'rounded-lg', 'p-2', 'w-full'])
      expect(host.classList.contains(c), c).toBe(true)
    expect(canvas().getAttribute('role')).toBe('img')
    expect(canvas().getAttribute('aria-label')).toBe('Signature pad')
    expect(canvas().style.width).toBe('400px')
    expect(canvas().style.height).toBe('200px')
    expect(calls).toContain('lineCap=round')
    expect(calls).toContain('fillRect(0,0,400,200)')
    expect(el.querySelector('.tabular-nums')!.textContent).toBe('0 points')
    const clear = el.querySelector<HTMLButtonElement>('button')!
    expect(clear.disabled).toBe(true)
    expect(clear.querySelector('svg')!.getAttribute('class')).toContain('lucide-eraser')
  })

  it('2: a stroke draws lines, counts points and emits the data URL + begin / end', () => {
    const seen: string[] = []
    @Component({
      standalone: true,
      imports: [UiSignaturePadComponent],
      template: `<ui-signature-pad
        [(modelValue)]="sig"
        (begin)="seen.push('begin')"
        (end)="seen.push('end')"
        (change)="seen.push('change')"
      />`,
    })
    class Host {
      sig: string | null = null
      seen = seen
    }
    const { fixture, el, canvas, stroke } = render(Host)
    stroke(canvas(), [
      [10, 10],
      [20, 20],
      [30, 25],
    ])
    expect(calls).toContain('moveTo(10,10)')
    expect(calls).toContain('lineTo(30,25)')
    expect(calls.filter((c) => c === 'stroke()').length).toBe(2)
    expect(fixture.componentInstance.sig).toBe('data:image/png;base64,INK')
    expect(seen).toEqual(['begin', 'change', 'end'])
    expect(el.querySelector('.tabular-nums')!.textContent).toBe('3 points')
    expect(el.querySelector<HTMLButtonElement>('button')!.disabled).toBe(false)
  })

  it('3: Clear repaints the background, resets the count and emits null', () => {
    @Component({
      standalone: true,
      imports: [UiSignaturePadComponent],
      template: `<ui-signature-pad [(modelValue)]="sig" />`,
    })
    class Host {
      sig: string | null = null
    }
    const { fixture, el, canvas, stroke, flush } = render(Host)
    stroke(canvas(), [
      [1, 1],
      [2, 2],
    ])
    calls = []
    el.querySelector<HTMLButtonElement>('button')!.click()
    flush()
    expect(calls).toContain('fillRect(0,0,400,200)')
    expect(fixture.componentInstance.sig).toBeNull()
    expect(el.querySelector('.tabular-nums')!.textContent).toBe('0 points')
  })

  it('4: disabled / readonly: no footer, pointer-events-none canvas, strokes ignored, data attrs', () => {
    @Component({
      standalone: true,
      imports: [UiSignaturePadComponent],
      template: `<ui-signature-pad id="d" disabled (begin)="n = n + 1" /><ui-signature-pad
          id="r"
          readonly
          (begin)="n = n + 1"
        />`,
    })
    class Host {
      n = 0
    }
    const { fixture, el, canvas, stroke } = render(Host)
    expect(el.querySelector('#d')!.hasAttribute('data-disabled')).toBe(true)
    expect(el.querySelector('#r')!.hasAttribute('data-readonly')).toBe(true)
    expect(canvas('#d').getAttribute('aria-label')).toBe('Signature pad (disabled)')
    expect(canvas('#d').getAttribute('aria-disabled')).toBe('true')
    expect(canvas('#r').getAttribute('aria-label')).toBe('Signature pad (readonly)')
    expect(canvas('#r').classList.contains('pointer-events-none')).toBe(true)
    expect(el.querySelector('button')).toBeNull()
    stroke(canvas('#d'), [
      [1, 1],
      [5, 5],
    ])
    stroke(canvas('#r'), [
      [1, 1],
      [5, 5],
    ])
    expect(fixture.componentInstance.n).toBe(0)
  })

  it('5: public API: clear / exportSignature / isEmpty / pointCount via exportAs', () => {
    @Component({
      standalone: true,
      imports: [UiSignaturePadComponent],
      template: `<ui-signature-pad #pad="uiSignaturePad" [showClearButton]="false" (modelChange)="out.push($event)" />
        <p>{{ pad.isEmpty }}|{{ pad.pointCount }}</p>
        <button id="x" (click)="pad.exportSignature()">x</button>`,
    })
    class Host {
      out: (string | null)[] = []
    }
    const { fixture, el, canvas, stroke, flush } = render(Host)
    expect(el.querySelector('p')!.textContent).toBe('true|0')
    el.querySelector<HTMLButtonElement>('#x')!.click()
    stroke(canvas(), [
      [1, 1],
      [2, 2],
    ])
    expect(el.querySelector('p')!.textContent).toBe('false|2')
    el.querySelector<HTMLButtonElement>('#x')!.click()
    flush()
    expect(fixture.componentInstance.out).toEqual([null, 'data:image/png;base64,INK', 'data:image/png;base64,INK'])
    expect(el.querySelector('.tabular-nums')).toBeNull()
  })

  it('6: actions template gets clear + empty and updates as ink appears', () => {
    @Component({
      standalone: true,
      imports: [UiSignaturePadComponent],
      template: `<ui-signature-pad [showClearButton]="false" [actions]="acts" />
        <ng-template #acts let-clear="clear" let-empty="empty"
          ><button id="reset" [disabled]="empty" (click)="clear()">Reset</button></ng-template
        >`,
    })
    class Host {}
    const { el, canvas, stroke, flush } = render(Host)
    const reset = () => el.querySelector<HTMLButtonElement>('#reset')!
    expect(reset().disabled).toBe(true)
    stroke(canvas(), [
      [1, 1],
      [2, 2],
    ])
    expect(reset().disabled).toBe(false)
    reset().click()
    flush()
    expect(reset().disabled).toBe(true)
  })

  it('7: penColor reaches the canvas; form control receives the data URL and disables the pad', () => {
    @Component({
      standalone: true,
      imports: [UiSignaturePadComponent, ReactiveFormsModule],
      template: `<ui-signature-pad [formControl]="control" [penColor]="pen" />`,
    })
    class Host {
      control = new FormControl<string | null>(null)
      pen = '#1d4ed8'
    }
    const { fixture, canvas, stroke } = render(Host)
    expect(calls).toContain('strokeStyle=#1d4ed8')
    stroke(canvas(), [
      [1, 1],
      [2, 2],
    ])
    expect(fixture.componentInstance.control.value).toBe('data:image/png;base64,INK')
    fixture.componentInstance.control.disable()
    fixture.detectChanges()
    expect(canvas().getAttribute('aria-disabled')).toBe('true')
  })
})
