import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiPaymentCardComponent } from './payment-card.component'

const here = dirname(fileURLToPath(import.meta.url))
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/payment-card/PaymentCard.vue'), 'utf8')
const angularSrc = readFileSync(resolve(here, './payment-card.component.ts'), 'utf8')

describe('PaymentCard (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (auto brand / default variant / flip on / md)', () => {
    const c = new UiPaymentCardComponent()
    expect(c.brand).toBe('auto')
    expect(c.variant).toBe('default')
    expect(c.flip).toBe(true)
    expect(c.size).toBe('md')
    expect(c.flipped).toBe(false)
    expect(c.tilt).toBe(false)
    expect(c.shimmer).toBe(false)
  })
  it('3: shell class tokens match Vue source', () => {
    for (const token of [
      'group relative inline-block select-none [perspective:1200px]',
      'aspect-[85.6/53.98]',
      '[transform-style:preserve-3d]',
    ]) {
      expect(vueSrc).toContain(token)
      expect(angularSrc).toContain(token)
    }
  })
  it('4: host carries perspective + size tier', () => {
    const c = new UiPaymentCardComponent()
    expect(c.hostClass).toContain('[perspective:1200px]')
    expect(c.hostClass).toContain('max-w-sm')
    c.size = 'lg'
    expect(c.hostClass).toContain('max-w-md')
  })
  it('5: brand auto-detection mirrors Vue', () => {
    expect(UiPaymentCardComponent.detectBrand('4111111111111111')).toBe('visa')
    expect(UiPaymentCardComponent.detectBrand('5500000000000004')).toBe('mastercard')
    expect(UiPaymentCardComponent.detectBrand('378282246310005')).toBe('amex')
    expect(UiPaymentCardComponent.detectBrand('6011111111111117')).toBe('discover')
    expect(UiPaymentCardComponent.detectBrand('')).toBe('unknown')
    const c = new UiPaymentCardComponent()
    c.number = '4111111111111111'
    expect(c.detectedBrand).toBe('visa')
    c.brand = 'amex'
    expect(c.detectedBrand).toBe('amex')
  })
  it('6: number masking pads with bullets', () => {
    const c = new UiPaymentCardComponent()
    c.number = '4111'
    expect(c.displayNumber).toBe('4111 •••• •••• ••••')
    expect(c.displayName).toBe('CARDHOLDER NAME')
    c.name = 'Ada Lovelace'
    expect(c.displayName).toBe('ADA LOVELACE')
  })
  it('7: expiry + cvc formatting mirror Vue', () => {
    const c = new UiPaymentCardComponent()
    expect(c.displayExpiry).toBe('MM/YY')
    c.expiry = '1228'
    expect(c.displayExpiry).toBe('12/28')
    c.cvc = '12345'
    expect(c.displayCvc).toBe('123')
  })
  it('8: custom class merges via cn()', () => {
    const c = new UiPaymentCardComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('9: data-slot payment-card contract present', () => {
    for (const slot of [
      '"payment-card"',
      '"payment-card-number"',
      '"payment-card-name"',
      '"payment-card-expiry"',
      '"payment-card-cvc"',
    ]) {
      expect(angularSrc).toContain(slot)
    }
    expect(angularSrc).toContain('ui-payment-card')
  })
  it('10: flip state toggles + imports type-only', () => {
    const c = new UiPaymentCardComponent()
    expect(c.isFlipped).toBe(false)
    expect(c.innerClass).not.toContain('[transform:rotateY(180deg)]')
    c.flipped = true
    expect(c.isFlipped).toBe(true)
    expect(c.innerClass).toContain('[transform:rotateY(180deg)]')
    const lines = angularSrc
      .split('\n')
      .filter((l) => l.includes('@angular/cdk') || l.includes('@angular/common') || l.includes('@angular/forms'))
    expect(lines.length === 0 || lines.every((l) => l.trim().startsWith('import type'))).toBe(true)
  })

  it('placeholder dots are drawn smaller and faded, as in Vue/React', () => {
    // Was [class.text-[0.85em]]: Angular can't parse brackets in a class-binding name and emitted
    // the class "text-[0", so empty-card dots rendered full size and overflowed at mobile width.
    expect(angularSrc).not.toContain('[class.text-[0.85em]]=')
    expect(angularSrc).toContain(`[class]="ch === '•' ? 'text-[0.85em] opacity-50' : ''"`)
  })
})
