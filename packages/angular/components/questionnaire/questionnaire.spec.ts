import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiQuestionnaireComponent } from './questionnaire.component'

const here = dirname(fileURLToPath(import.meta.url))
const angularSrc = readFileSync(resolve(here, './questionnaire.component.ts'), 'utf8')
const variantsNg = readFileSync(resolve(here, './questionnaire.variants.ts'), 'utf8')
const variantsVue = readFileSync(
  resolve(here, '../../../registry-vue/components/questionnaire/questionnaire.variants.ts'),
  'utf8',
)
const typesNg = readFileSync(resolve(here, './types.ts'), 'utf8')
const typesVue = readFileSync(resolve(here, '../../../registry-vue/components/questionnaire/types.ts'), 'utf8')

describe('Questionnaire (angular parity, 10 checks)', () => {
  it('1: variants file is byte-identical to Vue', () => {
    expect(variantsNg).toBe(variantsVue)
  })
  it('2: types file is byte-identical to Vue', () => {
    expect(typesNg).toBe(typesVue)
  })
  it('3: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('4: defaults mirror Vue (no items / no shortcuts / progress on)', () => {
    const c = new UiQuestionnaireComponent()
    expect(c.items).toEqual([])
    expect(c.shortcuts).toBe(false)
    expect(c.showProgress).toBe(true)
    expect(c.requiredMessage).toBe('Choose an answer to continue.')
  })
  it('5: host carries the Vue layout classes', () => {
    const c = new UiQuestionnaireComponent()
    expect(c.hostClass).toContain('flex w-full max-w-lg flex-col gap-4')
    expect(c.choiceClass()).toContain('rounded-lg border')
    expect(c.inputClass().length).toBeGreaterThan(0)
  })
  it('6: answer + toggle_choice flow mirrors Vue', () => {
    const c = new UiQuestionnaireComponent()
    c.items = [{ name: 'q1', prompt: 'Pick one' }]
    expect(c.isAnswered('q1')).toBe(false)
    c.toggleChoice('q1', 'a')
    expect(c.choiceChecked('q1', 'a')).toBe(true)
    c.toggleChoice('q1', 'a', true)
    expect(c.choiceChecked('q1', 'a')).toBe(true)
    c.toggleChoice('q1', 'a', true)
    expect(c.choiceChecked('q1', 'a')).toBe(false)
  })
  it('7: navigation enforces required + submits on last', () => {
    const c = new UiQuestionnaireComponent()
    c.items = [
      { name: 'q1', prompt: 'One', required: true },
      { name: 'q2', prompt: 'Two' },
    ]
    c.goNext()
    expect(c.showError).toBe(true)
    expect(c.activeIndex).toBe(0)
    c.setAnswer('q1', 'x')
    c.goNext()
    expect(c.activeIndex).toBe(1)
    let submitted: unknown
    c.submit.subscribe((a) => (submitted = a))
    c.goNext()
    expect(submitted).toEqual({ q1: 'x' })
    c.goPrev()
    expect(c.activeIndex).toBe(0)
  })
  it('8: shortcuts map letters + numbers like Vue', () => {
    const c = new UiQuestionnaireComponent()
    expect(c.shortcutFor(0)).toBe(undefined)
    c.shortcuts = 'letters'
    expect(c.shortcutFor(0)).toBe('A')
    c.shortcuts = 'numbers'
    expect(c.shortcutFor(2)).toBe('3')
    expect(c.progress).toEqual({ current: 0, total: 1 })
  })
  it('9: data-slot questionnaire contracts present', () => {
    for (const slot of [
      '"questionnaire"',
      '"questionnaire-progress"',
      '"questionnaire-item"',
      '"questionnaire-title"',
      '"questionnaire-choices"',
    ]) {
      expect(angularSrc).toContain(slot)
    }
    expect(angularSrc).toContain('ui-questionnaire')
  })
  it('10: custom class merges + imports type-only', () => {
    const c = new UiQuestionnaireComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const lines = angularSrc
      .split('\n')
      .filter((l) => l.includes('@angular/cdk') || l.includes('@angular/common') || l.includes('@angular/forms'))
    expect(lines.length === 0 || lines.every((l) => l.trim().startsWith('import type'))).toBe(true)
  })
})
