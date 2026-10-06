import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiPhoneComponent } from './phone.component'

const here = dirname(fileURLToPath(import.meta.url))
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/phone/Phone.vue'), 'utf8')
const angularSrc = readFileSync(resolve(here, './phone.component.ts'), 'utf8')

describe('Phone (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (md / status bar / 9:41)', () => {
    const c = new UiPhoneComponent()
    expect(c.size).toBe('md')
    expect(c.showStatusBar).toBe(true)
    expect(c.time).toBe('9:41')
    expect(c.resolvedModel).toBe('iphone-17-pro')
  })
  it('3: shell class token matches Vue source', () => {
    expect(vueSrc).toContain("cn('relative inline-block max-w-full select-none'")
    expect(angularSrc).toContain('relative inline-block max-w-full select-none')
  })
  it('4: sizes map to Vue width tiers', () => {
    const tiers: Array<[string, string]> = [
      ['sm', 'w-[240px]'],
      ['md', 'w-[300px]'],
      ['lg', 'w-[340px]'],
    ]
    for (const [size, cls] of tiers) {
      const c = new UiPhoneComponent()
      c.size = size as never
      expect(c.sizeClass).toBe(cls)
      expect(c.hostClass).toContain(cls)
    }
  })
  it('5: model resolves models like Vue', () => {
    const c = new UiPhoneComponent()
    c.model = 'galaxy-s26-ultra'
    expect(c.resolvedModel).toBe('galaxy-s26-ultra')
    expect(c.isIPhone).toBe(false)
    c.model = 'iphone-17-pro'
    expect(c.resolvedModel).toBe('iphone-17-pro')
    expect(c.isIPhone).toBe(true)
  })
  it('6: chassis aspect ratios match Vue hardware specs', () => {
    const c = new UiPhoneComponent()
    expect(c.aspectRatio).toBe('71.9 / 150')
    expect(c.chassisStyle.aspectRatio).toBe('71.9 / 150')
    c.model = 'galaxy-s26-ultra'
    expect(c.aspectRatio).toBe('78.1 / 163.6')
  })
  it('7: status bar + indicators toggle', () => {
    const c = new UiPhoneComponent()
    expect(c.showStatusBar).toBe(true)
    c.showStatusBar = false
    expect(c.showStatusBar).toBe(false)
    expect(c.sizeScale).toBe(1)
  })
  it('8: custom class merges via cn()', () => {
    const c = new UiPhoneComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('9: data-slot phone contracts present', () => {
    for (const slot of ['"phone"', '"phone-chassis"', '"phone-screen"', '"phone-status-bar"']) {
      expect(angularSrc).toContain(slot)
    }
    expect(angularSrc).toContain('ui-phone')
  })
  it('10: imports type-only and no framework leaks', () => {
    const lines = angularSrc
      .split('\n')
      .filter((l) => l.includes('@angular/cdk') || l.includes('@angular/common') || l.includes('@angular/forms'))
    expect(lines.length === 0 || lines.every((l) => l.trim().startsWith('import type'))).toBe(true)
  })
})
