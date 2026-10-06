import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiBottomNavigationComponent } from './bottom-navigation.component'

const here = dirname(fileURLToPath(import.meta.url))
const vueSrc = readFileSync(
  resolve(here, '../../../registry-vue/components/bottom-navigation/BottomNavigation.vue'),
  'utf8',
)
const angularSrc = readFileSync(resolve(here, './bottom-navigation.component.ts'), 'utf8')

describe('BottomNavigation (angular parity, 10 checks)', () => {
  it('1: class strings match Vue tokens', () => {
    for (const token of [
      'justify-around border-t backdrop-blur-sm',
      'bottom-navigation-item',
      'bottom-navigation-icon',
    ]) {
      expect(vueSrc).toContain(token)
      expect(angularSrc).toContain(token)
    }
  })
  it('2: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('3: defaults mirror Vue (empty / text-primary / fixed / indicator / safeArea)', () => {
    const c = new UiBottomNavigationComponent()
    expect(c.modelValue).toBe('')
    expect(c.activeColor).toBe('text-primary')
    expect(c.fixed).toBe(true)
    expect(c.showIndicator).toBe(true)
    expect(c.safeArea).toBe(true)
  })
  it('4: fixed positioning at viewport bottom', () => {
    expect(new UiBottomNavigationComponent().hostClass).toContain('fixed inset-x-0 bottom-0')
  })
  it('5: relative when not fixed', () => {
    const c = new UiBottomNavigationComponent()
    c.fixed = false
    expect(c.hostClass).toContain('relative')
  })
  it('6: safe area padding present', () => {
    expect(new UiBottomNavigationComponent().hostClass).toContain('pb-[env(safe-area-inset-bottom)]')
  })
  it('7: isActive detects modelValue match', () => {
    const c = new UiBottomNavigationComponent()
    c.modelValue = 'home'
    expect(c.isActive({ value: 'home', label: 'Home' })).toBe(true)
    expect(c.isActive({ value: 'away', label: 'Away' })).toBe(false)
    // [class] replaces static classes in Angular, so item/label classes must be fully merged.
    const activeCls = c.itemClass({ value: 'home', label: 'Home' })
    expect(activeCls).toContain('focus-visible:ring-[3px]')
    expect(activeCls).toContain('text-primary')
    expect(activeCls).not.toContain('text-muted-foreground')
    const idleCls = c.itemClass({ value: 'away', label: 'Away' })
    expect(idleCls).toContain('focus-visible:ring-[3px]')
    expect(idleCls).toContain('text-muted-foreground')
    const labelCls = c.labelClass({ value: 'home', label: 'Home' })
    expect(labelCls).toContain('truncate')
    expect(labelCls).toContain('font-medium')
  })
  it('8: onSelect emits modelValueChange + select', () => {
    const c = new UiBottomNavigationComponent()
    let emitted: string | undefined
    c.modelValueChange.subscribe((v) => (emitted = v))
    c.onSelect({ value: 'x', label: 'X' })
    expect(c.modelValue).toBe('x')
    expect(emitted).toBe('x')
  })
  it('9: custom class merges', () => {
    const c = new UiBottomNavigationComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('10: data-slot bottom-navigation contract present', () => {
    expect(angularSrc).toContain('"bottom-navigation"')
    expect(angularSrc).toContain('data-uipkge')
  })
})
