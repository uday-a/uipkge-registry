import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiThemeSwitchComponent } from './theme-switch.component'

const here = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(resolve(here, './theme-switch.component.ts'), 'utf8')

describe('ThemeSwitch (angular parity, 12 checks)', () => {
  it('1: component is standalone', () => {
    expect(src).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (cards, viewTransition)', () => {
    const c = new UiThemeSwitchComponent()
    expect(c.variant).toBe('cards')
    expect(c.viewTransition).toBe(true)
  })
  it('3: cards variant offers three themes', () => {
    expect(new UiThemeSwitchComponent().options()).toEqual(['light', 'dark', 'system'])
  })
  it('4: icon-only offers two themes', () => {
    const c = new UiThemeSwitchComponent()
    c.variant = 'icon-only'
    expect(c.options()).toEqual(['light', 'dark'])
  })
  it('5: activeIndex tracks modelValue', () => {
    const c = new UiThemeSwitchComponent()
    c.modelValue = 'dark'
    expect(c.activeIndex()).toBe(1)
  })
  it('6: indicator style spans one slot', () => {
    const c = new UiThemeSwitchComponent()
    expect(c.indicatorStyle().width).toContain('/ 3)')
  })
  it('7: thumb parks right for dark', () => {
    const c = new UiThemeSwitchComponent()
    c.modelValue = 'dark'
    expect(c.switchThumbStyle().transform).toContain('36px')
  })
  it('8: select emits the theme', () => {
    const c = new UiThemeSwitchComponent()
    let got: string | null = null
    c.modelValueChange.subscribe((v: string) => (got = v))
    c.select('light')
    expect(got).toBe('light')
  })
  it('9: cycle advances and wraps', () => {
    const c = new UiThemeSwitchComponent()
    c.variant = 'icon-only'
    c.modelValue = 'dark'
    let got: string | null = null
    c.modelValueChange.subscribe((v: string) => (got = v))
    c.cycle()
    expect(got).toBe('light')
  })
  it('10: system resolves via media + data-slot contract', () => {
    const c = new UiThemeSwitchComponent()
    expect(c.resolve(true)).toBe('dark')
    expect(c.resolve(false)).toBe('light')
    expect(src).toContain('"theme-switch"')
  })
  it('11: dropdown has menu semantics and Escape closes it', () => {
    expect(src).toContain('aria-haspopup="menu"')
    expect(src).toContain('[attr.aria-expanded]="dropdownOpen"')
    expect(src).toContain('role="menu"')
    expect(src).toContain('role="menuitem"')
    expect(src).toContain('(keydown.escape)="dropdownOpen = false"')
  })
  it('12: outside click closes the open dropdown', () => {
    const c = new UiThemeSwitchComponent()
    c.dropdownOpen = true
    c.onDocumentClick(new Event('click'))
    expect(c.dropdownOpen).toBe(false)
  })
})
