// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiNavigationMenuComponent,
  UiNavigationMenuContentComponent,
  UiNavigationMenuIndicatorComponent,
  UiNavigationMenuItemComponent,
  UiNavigationMenuLinkComponent,
  UiNavigationMenuListComponent,
  UiNavigationMenuTriggerComponent,
} from './navigation-menu.component'

// Radix NavigationMenu parity, as the React demo uses it. If these break, users see: a
// click or hover on "Getting started" opens nothing, a mega-menu opens instantly on a
// passing mouse (or never closes after the pointer leaves), panels render outside the
// shared viewport so the popover frame does not size to them, switching triggers does
// not slide the panel in the direction of travel, Escape leaves the menu open, or
// arrow keys stop moving between top-level items.

@Component({
  standalone: true,
  imports: [
    UiNavigationMenuComponent,
    UiNavigationMenuListComponent,
    UiNavigationMenuItemComponent,
    UiNavigationMenuTriggerComponent,
    UiNavigationMenuContentComponent,
    UiNavigationMenuLinkComponent,
    UiNavigationMenuIndicatorComponent,
  ],
  template: `
    <nav ui-navigation-menu [viewport]="viewport" (valueChange)="changes.push($event)">
      <ui-navigation-menu-list>
        <li ui-navigation-menu-item value="start">
          <button ui-navigation-menu-trigger>Getting started</button>
          <ui-navigation-menu-content>
            <a ui-navigation-menu-link href="#intro">Introduction</a>
            <a ui-navigation-menu-link href="#install">Installation</a>
          </ui-navigation-menu-content>
        </li>
        <li ui-navigation-menu-item value="components">
          <button ui-navigation-menu-trigger>Components</button>
          <ui-navigation-menu-content><a href="#button">Button</a></ui-navigation-menu-content>
        </li>
        <li ui-navigation-menu-item>
          <a ui-navigation-menu-link href="#docs" [active]="true">Docs</a>
        </li>
        <ui-navigation-menu-indicator />
      </ui-navigation-menu-list>
    </nav>
    <button id="outside">outside</button>
  `,
})
class Host {
  viewport = true
  changes: string[] = []
}

const pointer = (type: string) => Object.assign(new Event(type, { bubbles: false }), { pointerType: 'mouse' })

async function render(init: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, init)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const root = fixture.nativeElement as HTMLElement
  const nav = root.querySelector<HTMLElement>('nav')!
  const triggers = [...root.querySelectorAll<HTMLButtonElement>('[data-slot="navigation-menu-trigger"]')]
  const settle = async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  }
  const click = async (i: number) => {
    triggers[i]!.click()
    await settle()
  }
  const key = async (el: HTMLElement, k: string) => {
    const e = new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true })
    el.dispatchEvent(e)
    await settle()
    return e
  }
  const viewport = () => root.querySelector<HTMLElement>('[data-slot="navigation-menu-viewport"]')
  const panels = () => [...root.querySelectorAll<HTMLElement>('[data-slot="navigation-menu-content"]')]
  return { fixture, root, nav, triggers, settle, click, key, viewport, panels }
}

describe('NavigationMenu (angular, 10 checks)', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('1: root is a Radix nav (aria-label Main, data-viewport) and the list is a relative track around the <ul>', async () => {
    const { nav, root } = await render()
    expect(nav.getAttribute('aria-label')).toBe('Main')
    expect(nav.getAttribute('data-viewport')).toBe('true')
    const ul = root.querySelector('ul[data-slot="navigation-menu-list"]')!
    expect(ul.parentElement!.classList).toContain('relative')
    expect(ul.classList).toContain('list-none')
    expect(root.querySelector('li[data-slot="navigation-menu-item"]')!.classList).toContain('relative')
  })
  it('2: closed by default -- no viewport, no panels, triggers aria-expanded=false', async () => {
    const { triggers, viewport, panels } = await render()
    expect(viewport()).toBeNull()
    expect(panels()).toHaveLength(0)
    expect(triggers[0]!.getAttribute('aria-expanded')).toBe('false')
    expect(triggers[0]!.querySelector('svg.lucide-chevron-down')).not.toBeNull()
  })
  it('3: clicking a trigger opens its panel inside the viewport, wired by id; clicking again closes', async () => {
    const { click, triggers, viewport, panels, fixture } = await render()
    await click(0)
    expect(triggers[0]!.getAttribute('data-state')).toBe('open')
    expect(viewport()!.getAttribute('data-state')).toBe('open')
    const panel = panels()[0]!
    expect(viewport()!.contains(panel)).toBe(true)
    expect(panel.textContent).toContain('Introduction')
    expect(triggers[0]!.getAttribute('aria-controls')).toBe(panel.id)
    expect(panel.getAttribute('aria-labelledby')).toBe(triggers[0]!.id)
    await click(0)
    expect(viewport()).toBeNull()
    expect(fixture.componentInstance.changes).toEqual(['start', ''])
  })
  it('4: hover opens after delayDuration (200ms) and closes 150ms after the pointer leaves', async () => {
    vi.useFakeTimers()
    const { triggers, settle, fixture } = await render()
    triggers[0]!.dispatchEvent(pointer('pointerenter'))
    triggers[0]!.dispatchEvent(pointer('pointermove'))
    vi.advanceTimersByTime(150)
    expect(fixture.componentInstance.changes).toEqual([])
    vi.advanceTimersByTime(60)
    expect(fixture.componentInstance.changes).toEqual(['start'])
    triggers[0]!.dispatchEvent(pointer('pointerleave'))
    vi.advanceTimersByTime(149)
    expect(fixture.componentInstance.changes).toEqual(['start'])
    vi.advanceTimersByTime(2)
    expect(fixture.componentInstance.changes).toEqual(['start', ''])
    vi.useRealTimers()
    await settle()
  })
  it('5: switching items while open skips the delay and slides with data-motion (from-end / to-start)', async () => {
    vi.useFakeTimers()
    const { click, triggers, panels, fixture } = await render()
    await click(0)
    triggers[1]!.dispatchEvent(pointer('pointerenter'))
    triggers[1]!.dispatchEvent(pointer('pointermove'))
    expect(fixture.componentInstance.changes).toEqual(['start', 'components'])
    vi.useRealTimers()
    fixture.detectChanges()
    const [first, second] = panels()
    expect(second!.getAttribute('data-motion')).toBe('from-end')
    expect(first!.getAttribute('data-motion')).toBe('to-start')
    await fixture.whenStable()
    fixture.detectChanges()
    expect(panels()).toHaveLength(1)
    expect(panels()[0]!.textContent).toContain('Button')
  })
  it('6: Escape closes the menu and returns focus to the trigger', async () => {
    const { click, triggers, viewport, settle } = await render()
    await click(0)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }))
    await settle()
    expect(viewport()).toBeNull()
    expect(document.activeElement).toBe(triggers[0])
  })
  it('7: pointer-down outside closes; pointer-down on a trigger or inside the panel does not', async () => {
    const { click, triggers, panels, viewport, settle } = await render()
    await click(0)
    panels()[0]!.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    triggers[1]!.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await settle()
    expect(viewport()).not.toBeNull()
    document.getElementById('outside')!.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await settle()
    expect(viewport()).toBeNull()
  })
  it('8: ArrowRight / ArrowLeft move between top-level triggers and links; ArrowDown enters an open panel', async () => {
    const { key, triggers, root, click, panels } = await render()
    const docs = root.querySelector<HTMLElement>('a[href="#docs"]')!
    triggers[0]!.focus()
    await key(triggers[0]!, 'ArrowRight')
    await new Promise((r) => setTimeout(r))
    expect(document.activeElement).toBe(triggers[1])
    await key(triggers[1]!, 'ArrowRight')
    await new Promise((r) => setTimeout(r))
    expect(document.activeElement).toBe(docs)
    await key(docs, 'ArrowLeft')
    await new Promise((r) => setTimeout(r))
    expect(document.activeElement).toBe(triggers[1])
    await click(0)
    triggers[0]!.focus()
    await key(triggers[0]!, 'ArrowDown')
    expect(document.activeElement).toBe(panels()[0]!.querySelector('a'))
  })
  it('9: links carry data-active / aria-current and the React link classes; selecting one in a panel closes', async () => {
    const { root, click, panels, viewport, settle } = await render()
    const docs = root.querySelector<HTMLElement>('a[href="#docs"]')!
    expect(docs.hasAttribute('data-active')).toBe(true)
    expect(docs.getAttribute('aria-current')).toBe('page')
    expect(docs.classList).toContain('data-active:bg-accent/50')
    await click(0)
    panels()[0]!.querySelector<HTMLElement>('a')!.click()
    await settle()
    expect(viewport()).toBeNull()
  })
  it('10: viewport=false renders the panel inline in its item as a popover; indicator appears in the track when open', async () => {
    const { click, root, panels, viewport } = await render({ viewport: false })
    expect(root.querySelector('nav')!.getAttribute('data-viewport')).toBe('false')
    await click(0)
    expect(viewport()).toBeNull()
    const panel = panels()[0]!
    expect(panel.closest('li')).toBe(root.querySelector('li'))
    expect(panel.classList).toContain('group-data-[viewport=false]/navigation-menu:bg-popover')
    const indicator = root.querySelector<HTMLElement>('[data-slot="navigation-menu-indicator"]')!
    expect(indicator.getAttribute('data-state')).toBe('visible')
    expect(indicator.parentElement).toBe(root.querySelector('ul')!.parentElement)
  })
})
