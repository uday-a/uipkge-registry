// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TestBed, type ComponentFixture } from '@angular/core/testing'
import { UiToasterComponent, toast } from './sonner.component'

// What users notice if the toaster breaks: toast() calls that never show up, toasts that
// never go away (or vanish while hovered), the wrong colour / icon per variant, action and
// close buttons that do nothing, promise toasts stuck on "loading", or swipe not dismissing.

let fixture: ComponentFixture<UiToasterComponent>

function mount(inputs: Record<string, unknown> = {}) {
  fixture = TestBed.createComponent(UiToasterComponent)
  for (const [k, v] of Object.entries(inputs)) fixture.componentRef.setInput(k, v)
  fixture.detectChanges()
  document.body.appendChild(fixture.nativeElement)
  return fixture
}
/** Flush sonner's setTimeout / rAF hops and re-render. */
function tick(ms = 0) {
  vi.advanceTimersByTime(ms)
  fixture.detectChanges()
  vi.advanceTimersByTime(16)
  fixture.detectChanges()
}
const items = () => [...document.querySelectorAll<HTMLElement>('[data-sonner-toast]')]
const list = () => document.querySelector<HTMLElement>('[data-sonner-toaster]')
const pointer = (el: Element, type: string, x: number, y: number) => {
  const e = new Event(type, { bubbles: true })
  Object.assign(e, { clientX: x, clientY: y, pointerId: 1, button: 0 })
  el.dispatchEvent(e)
}

describe('Sonner (angular, 12 checks)', () => {
  it("puts sonner's stylesheet in <head> once (not component styles, which default Angular budgets cap at 8 kB)", () => {
    mount()
    mount()
    const styles = document.head.querySelectorAll('style[data-uipkge-sonner]')
    expect(styles).toHaveLength(1)
    expect(styles[0]!.textContent).toContain('[data-sonner-toaster]')
  })

  beforeEach(() => {
    vi.useFakeTimers({
      toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'Date'],
    })
    document.body.innerHTML = ''
  })
  afterEach(() => {
    toast.dismiss()
    vi.useRealTimers()
  })

  it('1: toast() renders sonner DOM: section > ol[data-sonner-toaster] > li[data-sonner-toast] with React defaults', () => {
    mount({ theme: 'light' })
    toast('Event has been created.')
    tick()
    const section = document.querySelector('section')!
    expect(section.getAttribute('aria-label')).toBe('Notifications alt+T')
    expect(section.getAttribute('aria-live')).toBe('polite')
    const ol = list()!
    expect([...ol.classList].sort()).toEqual(['group', 'toaster'])
    expect(ol.getAttribute('data-y-position')).toBe('bottom')
    expect(ol.getAttribute('data-x-position')).toBe('right')
    expect(ol.getAttribute('data-sonner-theme')).toBe('light')
    expect(ol.style.getPropertyValue('--normal-bg')).toBe('var(--popover)')
    expect(ol.style.getPropertyValue('--width')).toBe('356px')
    const [li] = items()
    expect(li!.querySelector('[data-title]')!.textContent).toBe('Event has been created.')
    expect(li!.getAttribute('data-rich-colors')).toBe('true')
    expect(li!.getAttribute('data-mounted')).toBe('true')
    expect(li!.hasAttribute('data-type')).toBe(false)
    expect(li!.querySelector('[data-icon]')).toBeNull()
  })

  it('2: variants set data-type and the Lucide icon React passes', () => {
    mount()
    toast.success('ok')
    toast.error('bad')
    toast.warning('hm')
    toast.info('fyi')
    tick()
    const byType = Object.fromEntries(items().map((li) => [li.getAttribute('data-type'), li]))
    expect(byType['success']!.querySelector('[data-icon] svg')!.getAttribute('class')).toContain(
      'lucide-circle-check size-4',
    )
    expect(byType['error']!.querySelector('[data-icon] svg')!.getAttribute('class')).toContain('lucide-octagon-x')
    expect(byType['warning']!.querySelector('[data-icon] svg')!.getAttribute('class')).toContain(
      'lucide-triangle-alert',
    )
    expect(byType['info']!.querySelector('[data-icon] svg')!.getAttribute('class')).toContain('lucide-info')
  })

  it('3: newest toast is in front; toasts past visibleToasts are hidden', () => {
    mount()
    for (const n of [1, 2, 3, 4]) toast(`t${n}`)
    tick()
    const li = items()
    expect(li.map((x) => x.querySelector('[data-title]')!.textContent)).toEqual(['t4', 't3', 't2', 't1'])
    expect(li[0]!.getAttribute('data-front')).toBe('true')
    expect(li.map((x) => x.getAttribute('data-visible'))).toEqual(['true', 'true', 'true', 'false'])
    expect(li.map((x) => x.style.getPropertyValue('--z-index'))).toEqual(['4', '3', '2', '1'])
  })

  it('4: auto-dismisses after `duration` (4000ms default), animating out first', () => {
    mount()
    toast('bye')
    tick()
    tick(3990)
    expect(items()).toHaveLength(1)
    tick(20)
    expect(items()[0]!.getAttribute('data-removed')).toBe('true')
    tick(250)
    expect(items()).toHaveLength(0)
  })

  it('5: hovering the stack expands it and pauses the timer; leaving resumes it', () => {
    mount()
    toast('a')
    toast('b')
    tick()
    list()!.dispatchEvent(new Event('mouseenter'))
    tick(10_000)
    expect(items()).toHaveLength(2)
    expect(items()[0]!.getAttribute('data-expanded')).toBe('true')
    list()!.dispatchEvent(new Event('mouseleave'))
    tick()
    expect(items()[0]!.getAttribute('data-expanded')).toBe('false')
    tick(4500)
    expect(items()).toHaveLength(0)
  })

  it('6: description renders; action button runs onClick and dismisses', () => {
    mount()
    const onClick = vi.fn()
    toast('Event has been created', { description: 'Sunday at 9:00 AM', action: { label: 'Undo', onClick } })
    tick()
    const li = items()[0]!
    expect(li.querySelector('[data-description]')!.textContent).toBe('Sunday at 9:00 AM')
    const btn = li.querySelector<HTMLButtonElement>('[data-action]')!
    expect(btn.textContent!.trim()).toBe('Undo')
    btn.click()
    tick(250)
    expect(onClick).toHaveBeenCalledOnce()
    expect(items()).toHaveLength(0)
  })

  it('7: closeButton renders an X (aria-label "Close toast") that dismisses', () => {
    mount()
    toast('x', { closeButton: true })
    tick()
    const close = items()[0]!.querySelector<HTMLButtonElement>('[data-close-button]')!
    expect(close.getAttribute('aria-label')).toBe('Close toast')
    expect(close.querySelector('svg')!.getAttribute('class')).toContain('lucide-x size-4')
    close.click()
    tick(250)
    expect(items()).toHaveLength(0)
  })

  it('8: loading toasts never auto-dismiss and can be updated in place by id', () => {
    mount()
    const id = toast.loading('Processing…')
    tick()
    expect(items()[0]!.querySelector('.sonner-loader svg')!.getAttribute('class')).toContain('motion-safe:animate-spin')
    tick(10_000)
    expect(items()).toHaveLength(1)
    toast.success('Done!', { id })
    tick()
    expect(items()).toHaveLength(1)
    expect(items()[0]!.getAttribute('data-type')).toBe('success')
    expect(items()[0]!.querySelector('[data-title]')!.textContent).toBe('Done!')
  })

  it('9: toast.promise shows loading, then success / error (formatter gets the error)', async () => {
    mount()
    let resolve!: (v: string) => void
    toast.promise(new Promise<string>((r) => (resolve = r)), { loading: 'Saving…', success: 'Saved', error: 'Nope' })
    toast.promise(Promise.reject(new Error('Network error')), {
      loading: 'Uploading…',
      error: (err) => `Upload failed: ${(err as Error).message}`,
    })
    tick()
    expect(items().map((li) => li.getAttribute('data-type'))).toEqual(['loading', 'loading'])
    resolve('ok')
    await vi.advanceTimersByTimeAsync(0)
    tick()
    const titles = items().map((li) => [li.getAttribute('data-type'), li.querySelector('[data-title]')!.textContent])
    expect(titles).toContainEqual(['success', 'Saved'])
    expect(titles).toContainEqual(['error', 'Upload failed: Network error'])
    expect(items()[0]!.getAttribute('data-promise')).toBe('true')
  })

  it('10: toast.dismiss(id) removes that toast only', () => {
    mount()
    const a = toast('a', { duration: Infinity })
    toast('b', { duration: Infinity })
    tick()
    toast.dismiss(a)
    tick()
    tick(250)
    expect(items().map((li) => li.querySelector('[data-title]')!.textContent)).toEqual(['b'])
  })

  it('11: swiping a toast past the threshold dismisses it (bottom-right swipes right)', () => {
    mount()
    toast('swipe me', { duration: Infinity })
    tick()
    const li = items()[0]!
    pointer(li, 'pointerdown', 100, 100)
    pointer(li, 'pointermove', 102, 100) // locks the x axis
    pointer(li, 'pointermove', 160, 100)
    expect(li.style.getPropertyValue('--swipe-amount-x')).toBe('60px')
    pointer(li, 'pointerup', 160, 100)
    fixture.detectChanges()
    expect(li.getAttribute('data-swipe-out')).toBe('true')
    expect(li.getAttribute('data-swipe-direction')).toBe('right')
    tick(250)
    expect(items()).toHaveLength(0)
  })

  it('12: position input moves the stack; per-toast position opens a second list', () => {
    mount({ position: 'top-center' })
    toast('a')
    toast('b', { position: 'bottom-left' })
    tick()
    const lists = [...document.querySelectorAll('[data-sonner-toaster]')]
    expect(lists.map((l) => `${l.getAttribute('data-y-position')}-${l.getAttribute('data-x-position')}`)).toEqual([
      'top-center',
      'bottom-left',
    ])
    expect(items()[0]!.getAttribute('data-y-position')).toBe('top')
  })
})
