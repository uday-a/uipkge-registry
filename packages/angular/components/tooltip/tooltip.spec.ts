// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ElementRef } from '@angular/core'
import { create, fakeViewContainer, providing } from '../../test-utils/inject'
import {
  TOOLTIP_CONTENT_CLASS,
  UI_TOOLTIP_CONFIG,
  UiTooltipComponent,
  UiTooltipContentComponent,
  UiTooltipDirective,
  UiTooltipTriggerComponent,
} from './tooltip.component'

// Radix tooltip timing is what users notice: ambient hover waits the provider delay,
// neighbours within the skip window open instantly, focus opens at once, and
// `hidden` (the sidebar's expanded state) suppresses it entirely.

const el = (tag = 'button') => ({
  provide: ElementRef,
  useValue: new ElementRef(document.body.appendChild(document.createElement(tag))),
})
// jsdom has no PointerEvent; the handlers only read pointerType.
const hover = () => ({ pointerType: 'mouse' }) as PointerEvent
const panel = () => document.querySelector<HTMLElement>('[data-slot="tooltip-content"]')

function compound(config?: { delayDuration: number; skipDelayDuration: number }) {
  const providers = config
    ? [{ provide: UI_TOOLTIP_CONFIG, useValue: { ...config, disableHoverableContent: false } }]
    : []
  const tooltip = create(UiTooltipComponent, providers)
  const inj = providing(tooltip)
  const trigger = create(UiTooltipTriggerComponent, [el()], inj)
  const content = create(
    UiTooltipContentComponent,
    [
      fakeViewContainer(() => {
        const div = document.createElement('div')
        div.setAttribute('data-slot', 'tooltip-content')
        div.textContent = 'Save'
        return [div]
      }),
    ],
    inj,
  )
  return { tooltip, trigger, content }
}

describe('Tooltip (angular, 11 checks)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document.body.innerHTML = ''
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('1: content keeps the Vue / React surface classes', () => {
    for (const token of ['bg-foreground', 'text-background', 'rounded-md', 'px-3', 'py-1.5', 'text-xs']) {
      expect(TOOLTIP_CONTENT_CLASS).toContain(token)
    }
  })
  it('2: hover waits the Radix default 700ms before opening', () => {
    const { tooltip, trigger } = compound()
    trigger.onPointerEnter(hover())
    vi.advanceTimersByTime(699)
    expect(tooltip.isOpen).toBe(false)
    vi.advanceTimersByTime(1)
    expect(tooltip.isOpen).toBe(true)
  })
  it('3: a provider delay overrides the default (sidebar uses 0 = instant)', () => {
    const { tooltip, trigger } = compound({ delayDuration: 0, skipDelayDuration: 300 })
    trigger.onPointerEnter(hover())
    expect(tooltip.isOpen).toBe(true)
  })
  it('4: within the skip window a neighbour opens instantly', () => {
    const a = compound()
    const b = compound()
    a.trigger.onPointerEnter(hover())
    vi.advanceTimersByTime(700)
    a.tooltip.timing.leave()
    b.trigger.onPointerEnter(hover())
    expect(b.tooltip.isOpen).toBe(true)
    expect(b.tooltip.openHow).toBe('instant')
  })
  it('5: focus opens immediately; blur / pointer-leave close', () => {
    const { tooltip } = compound()
    tooltip.timing.focus()
    expect(tooltip.isOpen).toBe(true)
    tooltip.timing.leave()
    expect(tooltip.isOpen).toBe(false)
  })
  it('6: touch pointers never open a hover tooltip', () => {
    const { tooltip, trigger } = compound()
    trigger.onPointerEnter({ pointerType: 'touch' } as PointerEvent)
    vi.advanceTimersByTime(1000)
    expect(tooltip.isOpen).toBe(false)
  })
  it('7: opening portals the content to <body>; closing removes it', async () => {
    const { tooltip } = compound()
    tooltip.timing.focus()
    expect(panel()?.closest('[data-uipkge-portal]')?.parentElement).toBe(document.body)
    tooltip.timing.leave()
    await vi.runAllTimersAsync()
    expect(panel()).toBeNull()
  })
  it('8: hidden content never renders (React `hidden`)', () => {
    const { tooltip, content } = compound()
    content.hidden = true
    tooltip.timing.focus()
    expect(panel()).toBeNull()
  })
  it('9: Escape closes an open tooltip', () => {
    const { tooltip } = compound()
    tooltip.timing.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(tooltip.isOpen).toBe(false)
  })
  it('10: [uiTooltip] directive renders the text tooltip and respects disabledWhen', async () => {
    const dir = create(UiTooltipDirective, [
      el(),
      {
        provide: UI_TOOLTIP_CONFIG,
        useValue: { delayDuration: 0, skipDelayDuration: 300, disableHoverableContent: false },
      },
    ])
    dir.text = 'Models'
    dir.disabledWhen = () => true
    dir.timing.focus()
    expect(dir.panel).toBeNull()
    dir.disabledWhen = () => false
    dir.timing.focus()
    expect(dir.panel?.textContent).toContain('Models')
    expect(dir.panel?.getAttribute('role')).toBe('tooltip')
    dir.ngOnDestroy()
    expect(document.querySelector('[role=tooltip]')).toBeNull()
  })
  it('11: the arrow height is added to sideOffset, like Radix Popper (tip sits 4px off the trigger)', () => {
    // Without it the bubble sat 10px closer to the trigger than the React tooltip.
    const trigger = el()
    const node = trigger.useValue.nativeElement as HTMLElement
    node.getBoundingClientRect = () =>
      ({ top: 200, bottom: 230, left: 100, right: 200, width: 100, height: 30, x: 100, y: 200 }) as DOMRect
    const spy = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
      return this.className.includes('size-2.5') ? 10 : 0
    })
    const dir = create(UiTooltipDirective, [
      trigger,
      {
        provide: UI_TOOLTIP_CONFIG,
        useValue: { delayDuration: 0, skipDelayDuration: 300, disableHoverableContent: false },
      },
    ])
    dir.text = 'Models'
    dir.timing.focus()
    // side top: y = anchor.top - (sideOffset 4 + arrow 10) - panel height (0 in jsdom)
    expect(dir.panel?.style.top).toBe('186px')
    spy.mockRestore()
    dir.ngOnDestroy()
  })
})
