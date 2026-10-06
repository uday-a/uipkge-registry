import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiIconTransitionComponent } from './icon-transition.component'

const here = dirname(fileURLToPath(import.meta.url))
const vueSrc = readFileSync(
  resolve(here, '../../../registry-vue/components/icon-transition/IconTransition.vue'),
  'utf8',
)
const angularSrc = readFileSync(resolve(here, './icon-transition.component.ts'), 'utf8')

describe('IconTransition (angular parity, 10 checks)', () => {
  it('1: host class strings match Vue source tokens', () => {
    for (const token of [
      'icon-transition',
      'inline-grid place-items-center transition-colors',
      'focus-visible:ring-2',
    ]) {
      expect(vueSrc).toContain(token)
      expect(angularSrc).toContain(token)
    }
  })
  it('2: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('3: defaults mirror Vue (size-4 / 1500ms / 240ms / success / button)', () => {
    const c = new UiIconTransitionComponent()
    expect(c.iconClass).toBe('size-4')
    expect(c.resetAfter).toBe(1500)
    expect(c.duration).toBe(240)
    expect(c.activeClass).toBe('text-success')
    expect(c.tag).toBe('button')
  })
  it('4: root has inline-grid place-items-center base', () => {
    const c = new UiIconTransitionComponent()
    expect(c.rootClass).toContain('inline-grid')
    expect(c.rootClass).toContain('place-items-center')
  })
  it('5: active vs default produce distinct host classes', () => {
    const c = new UiIconTransitionComponent()
    const idle = c.rootClass
    c.active = true
    c.ngOnChanges()
    expect(c.rootClass).not.toBe(idle)
    expect(c.rootClass).toContain('text-success')
  })
  it('6: active class defaults to text-success (matches Vue)', () => {
    const c = new UiIconTransitionComponent()
    expect(c.activeClass).toBe('text-success')
  })
  it('7: externally controlled active wins over internal', () => {
    const c = new UiIconTransitionComponent()
    c.active = true
    c.ngOnChanges()
    expect(c.isActive).toBe(true)
    c.active = false
    c.ngOnChanges()
    expect(c.isActive).toBe(false)
  })
  it('8: custom class merges via cn()', () => {
    const c = new UiIconTransitionComponent()
    c.className = 'custom-class'
    expect(c.rootClass).toContain('custom-class')
  })
  it('9: data-slot icon-transition contract present', () => {
    expect(angularSrc).toContain('"icon-transition"')
  })
  it('10: trigger flips active; action=false skips flip; reset reverts', async () => {
    const c = new UiIconTransitionComponent()
    c.resetAfter = 0
    let activated = 0
    c.activate.subscribe(() => activated++)
    await c.trigger()
    expect(c.isActive).toBe(true)
    expect(activated).toBe(1)
    c.reset()
    expect(c.isActive).toBe(false)
    const veto = new UiIconTransitionComponent()
    veto.action = () => false
    await veto.trigger()
    expect(veto.isActive).toBe(false)
  })
})
