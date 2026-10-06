// @vitest-environment jsdom
import '@angular/compiler'
import { describe, it, expect, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { ElementRef } from '@angular/core'
import { create, noopDestroyRef, providing } from '../../test-utils/inject'
import { UiTooltipDirective } from '../tooltip/tooltip.component'
import {
  UiSidebarComponent,
  UiSidebarMenuButtonComponent,
  UiSidebarProviderComponent,
  UiSidebarRailComponent,
  UiSidebarTriggerComponent,
} from './sidebar.component'
import { SIDEBAR_COOKIE_NAME } from './sidebar-context'

// Angular icons are <lucide-icon><svg/></lucide-icon>, so the Angular variants also target
// `lucide-icon > svg` wherever React targets a direct `> svg` child. Fold that back before
// comparing; every other class must match React byte for byte.
const foldIcons = (s: string) =>
  s.replaceAll('[&>svg,&>lucide-icon>svg]:', '[&>svg]:').replaceAll('has-[>svg,>lucide-icon]:', 'has-[>svg]:')

// The provider is the single source of truth, shared through DI like React's
// SidebarContext: anything inside it (trigger, rail, Cmd/Ctrl+B, menu tooltips)
// reads and flips the same state. These checks encode the behaviours the blocks rely on.

const here = dirname(fileURLToPath(import.meta.url))
const variantsNg = foldIcons(readFileSync(resolve(here, './sidebar.variants.ts'), 'utf8'))
const variantsVue = readFileSync(resolve(here, '../../../registry-vue/components/sidebar/sidebar.variants.ts'), 'utf8')
const realMatchMedia = window.matchMedia

function provider(opts: { defaultOpen?: boolean; mobile?: boolean } = {}) {
  window.matchMedia = ((q: string) => ({
    matches: !!opts.mobile && q.includes('max-width'),
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia
  const p = create(UiSidebarProviderComponent, [noopDestroyRef])
  if (opts.defaultOpen !== undefined) p.defaultOpen = opts.defaultOpen
  p.ngOnInit()
  return p
}
const el = (tag = 'button') => ({ provide: ElementRef, useValue: new ElementRef(document.createElement(tag)) })

describe('Sidebar (angular, 11 checks)', () => {
  afterEach(() => {
    window.matchMedia = realMatchMedia
  })

  it('1: menu-button variants stay byte-identical to Vue', () => {
    expect(variantsNg).toBe(variantsVue)
  })
  it('2: defaultOpen drives the initial expanded / collapsed state', () => {
    expect(provider().state).toBe('expanded')
    expect(provider({ defaultOpen: false }).state).toBe('collapsed')
  })
  it('3: toggleSidebar flips state, emits openChange and persists the cookie', () => {
    const p = provider()
    const seen: boolean[] = []
    p.openChange.subscribe((v) => seen.push(v))
    p.toggleSidebar()
    expect(p.state).toBe('collapsed')
    expect(seen).toEqual([false])
    expect(document.cookie).toContain(`${SIDEBAR_COOKIE_NAME}=false`)
  })
  it('4: controlled [open] only changes when the parent feeds the new value back', () => {
    const p = provider()
    p.controlledOpen = true
    const seen: boolean[] = []
    p.openChange.subscribe((v) => seen.push(v))
    p.toggleSidebar()
    expect(seen).toEqual([false])
    expect(p.state).toBe('expanded')
    p.controlledOpen = false
    expect(p.state).toBe('collapsed')
  })
  it('5: Cmd/Ctrl+B toggles; a plain "b" keystroke does not', () => {
    const p = provider()
    p.onKeydown(new KeyboardEvent('keydown', { key: 'b', metaKey: true, cancelable: true }))
    expect(p.state).toBe('collapsed')
    p.onKeydown(new KeyboardEvent('keydown', { key: 'b', ctrlKey: true, cancelable: true }))
    expect(p.state).toBe('expanded')
    p.onKeydown(new KeyboardEvent('keydown', { key: 'b' }))
    expect(p.state).toBe('expanded')
  })
  it('6: below 768px the sidebar is a sheet: toggle opens it instead of collapsing', () => {
    const p = provider({ mobile: true })
    const s = create(UiSidebarComponent, [el('div')], providing(p))
    expect(p.isMobile).toBe(true)
    expect(s.mode).toBe('mobile')
    expect(s.hostClass).toBe('contents')
    p.toggleSidebar()
    expect(p.openMobile).toBe(true)
    expect(p.state).toBe('expanded')
  })
  it('7: desktop renders the gap + fixed container; class goes to the container; none is static', () => {
    const p = provider()
    const s = create(UiSidebarComponent, [el('div')], providing(p))
    s.collapsible = 'icon'
    s.className = 'custom-rail'
    expect(s.mode).toBe('desktop')
    expect(s.hostClass).toContain('md:block')
    expect(s.gapClass).toContain('group-data-[collapsible=icon]:w-(--sidebar-width-icon)')
    expect(s.containerClass).toContain('custom-rail')
    s.collapsible = 'none'
    expect(s.mode).toBe('none')
    expect(s.hostClass).toContain('custom-rail')
  })
  it('8: trigger and rail toggle the shared provider', () => {
    const p = provider()
    const trigger = create(UiSidebarTriggerComponent, [el()], providing(p))
    const rail = create(UiSidebarRailComponent, [el()], providing(p))
    let emitted = 0
    trigger.toggle.subscribe(() => emitted++)
    trigger.onToggle()
    expect(p.state).toBe('collapsed')
    expect(emitted).toBe(1)
    rail.onToggle()
    expect(p.state).toBe('expanded')
    expect(trigger.hostClass).toContain('h-7 w-7')
  })
  it('9: menu-button tooltips show only on the collapsed desktop icon rail', () => {
    const run = (mobile: boolean) => {
      const p = provider({ mobile })
      const tip = create(UiTooltipDirective, [el()])
      create(UiSidebarMenuButtonComponent, [el(), { provide: UiTooltipDirective, useValue: tip }], providing(p))
      return { p, tip }
    }
    const { p, tip } = run(false)
    expect(tip.tooltipSide).toBe('right')
    expect(tip.disabledWhen?.()).toBe(true)
    p.setOpen(false)
    expect(tip.disabledWhen?.()).toBe(false)
    const mobile = run(true)
    mobile.p.setOpen(false)
    expect(mobile.tip.disabledWhen?.()).toBe(true)
  })
  it('10: sidebar parts outside a provider fail loudly', () => {
    expect(() => create(UiSidebarComponent)).toThrow(/ui-sidebar-provider/)
  })
  it('11: a static class on a desktop sidebar lands on the fixed container only (React className)', async () => {
    // Otherwise `class="border-r"` draws a second border on the outer host and shifts the inset 1px.
    provider()
    const { Component } = await import('@angular/core')
    const { TestBed } = await import('@angular/core/testing')
    @Component({
      standalone: true,
      imports: [UiSidebarProviderComponent, UiSidebarComponent],
      template: `<ui-sidebar-provider><div ui-sidebar collapsible="icon" class="border-r"></div></ui-sidebar-provider>`,
    })
    class Host {}
    const fixture = TestBed.createComponent(Host)
    fixture.detectChanges()
    const host = (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('[ui-sidebar]')!
    expect(host.classList).not.toContain('border-r')
    expect(host.classList).toContain('md:block')
    expect(host.querySelector('.fixed')!.classList).toContain('border-r')
  })
})
