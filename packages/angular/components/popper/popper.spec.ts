// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'
import type { TemplateRef, ViewContainerRef } from '@angular/core'
import { BodyPortal, computePlacement, lockScroll, pushDismissableLayer, trapFocus, type PlaceOptions } from './popper'

// The floating-layer toolkit is what makes the Angular overlays behave like Radix:
// these checks pin the behaviours users feel (menus flip instead of clipping, only the
// top layer closes on Escape, focus can't escape a modal, scroll lock is ref-counted).

const anchor = { top: 100, left: 100, width: 200, height: 40, right: 300, bottom: 140 }
const size = { width: 160, height: 120 }
const viewport = { width: 1000, height: 800 }
const opts = (o: Partial<PlaceOptions> = {}): PlaceOptions => ({
  side: 'bottom',
  align: 'start',
  sideOffset: 4,
  alignOffset: 0,
  collisionPadding: 0,
  avoidCollisions: true,
  ...o,
})

describe('Popper (angular, 10 checks)', () => {
  it('1: bottom/start places below the anchor, left edges aligned, offset applied', () => {
    const p = computePlacement(anchor, size, opts(), viewport)
    expect(p).toMatchObject({ x: 100, y: 144, side: 'bottom' })
  })
  it('2: right/start sits beside the anchor, top edges aligned (team switcher layout)', () => {
    const p = computePlacement(anchor, size, opts({ side: 'right' }), viewport)
    expect(p).toMatchObject({ x: 304, y: 100, side: 'right' })
  })
  it('3: align end / center line up the opposite edge / midpoint', () => {
    expect(computePlacement(anchor, size, opts({ align: 'end' }), viewport).x).toBe(140)
    expect(computePlacement(anchor, size, opts({ align: 'center' }), viewport).x).toBe(120)
  })
  it('4: flips to the opposite side when the preferred side would overflow', () => {
    const low = { ...anchor, top: 740, bottom: 780 }
    expect(computePlacement(low, size, opts(), viewport).side).toBe('top')
  })
  it('5: shifts along the edge instead of spilling off-screen', () => {
    const nearRight = { ...anchor, left: 950, right: 1150 }
    expect(computePlacement(nearRight, size, opts(), viewport).x).toBe(viewport.width - size.width)
  })
  it('6: only the top-most layer handles Escape (submenu closes before its menu)', () => {
    const outer = vi.fn()
    const inner = vi.fn()
    const popOuter = pushDismissableLayer({ contains: () => false, onEscape: outer, onPointerDownOutside: () => {} })
    const popInner = pushDismissableLayer({ contains: () => false, onEscape: inner, onPointerDownOutside: () => {} })
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(inner).toHaveBeenCalledTimes(1)
    expect(outer).not.toHaveBeenCalled()
    popInner()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(outer).toHaveBeenCalledTimes(1)
    popOuter()
  })
  it('7: outside pointer-down dismisses, inside does not', () => {
    const inside = document.body.appendChild(document.createElement('div'))
    const outside = document.body.appendChild(document.createElement('div'))
    const onOutside = vi.fn()
    const pop = pushDismissableLayer({
      contains: (t) => inside.contains(t),
      onEscape: () => {},
      onPointerDownOutside: onOutside,
    })
    inside.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(onOutside).not.toHaveBeenCalled()
    outside.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    expect(onOutside).toHaveBeenCalledTimes(1)
    pop()
  })
  it('8: focus trap wraps Tab from the last focusable back to the first', () => {
    const box = document.body.appendChild(document.createElement('div'))
    box.innerHTML = '<button id="a">a</button><button id="b">b</button>'
    // jsdom has no layout; mark buttons as rendered for the visibility filter.
    for (const b of box.querySelectorAll('button')) Object.defineProperty(b, 'offsetParent', { get: () => box })
    const release = trapFocus(box)
    ;(box.querySelector('#b') as HTMLElement).focus()
    const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
    box.dispatchEvent(tab)
    expect(tab.defaultPrevented).toBe(true)
    expect(document.activeElement?.id).toBe('a')
    release()
  })
  it('9: scroll lock is ref-counted and restores the previous overflow', () => {
    document.body.style.overflow = 'scroll'
    const a = lockScroll()
    const b = lockScroll()
    expect(document.body.style.overflow).toBe('hidden')
    a()
    expect(document.body.style.overflow).toBe('hidden')
    b()
    expect(document.body.style.overflow).toBe('scroll')
  })
  it('10: body portal renders the view at the end of <body> and removes it on detach', () => {
    const node = document.createElement('div')
    node.id = 'portalled'
    const vcr = {
      createEmbeddedView: () => ({ rootNodes: [node], detectChanges: () => {}, destroy: () => node.remove() }),
    }
    const portal = new BodyPortal(vcr as unknown as ViewContainerRef)
    const host = portal.attach({} as TemplateRef<unknown>)
    expect(host.parentElement).toBe(document.body)
    expect(host.hasAttribute('data-uipkge-portal')).toBe(true)
    expect(document.getElementById('portalled')?.parentElement).toBe(host)
    portal.detach()
    expect(document.getElementById('portalled')).toBeNull()
    expect(document.querySelector('[data-uipkge-portal]')).toBeNull()
  })
})

describe('trapFocus pulls escaped focus back (Radix FocusScope trapped)', () => {
  // A dropdown item that opens a dialog returns focus to its trigger behind the modal when the
  // menu finishes closing. Without the pull-back, Tab walked the page behind the dialog.
  it('refocuses the last element inside the trap when focus lands outside it', () => {
    const outside = document.createElement('button')
    const box = document.createElement('div')
    box.innerHTML = '<button id="in1">1</button><button id="in2">2</button>'
    document.body.append(outside, box)
    const release = trapFocus(box)
    box.querySelector<HTMLElement>('#in2')!.focus()
    outside.focus()
    expect(document.activeElement?.id).toBe('in2')
    release()
    outside.focus()
    expect(document.activeElement).toBe(outside)
    outside.remove()
    box.remove()
  })
  it('lets focus move into a layer portalled after the trap opened (a Select inside a dialog)', () => {
    const box = document.createElement('div')
    box.innerHTML = '<button>in</button>'
    document.body.append(box)
    const release = trapFocus(box)
    const portal = document.createElement('div')
    portal.setAttribute('data-uipkge-portal', '')
    portal.innerHTML = '<button id="opt">option</button>'
    document.body.append(portal)
    portal.querySelector<HTMLElement>('#opt')!.focus()
    expect(document.activeElement?.id).toBe('opt')
    release()
    box.remove()
    portal.remove()
  })
})
