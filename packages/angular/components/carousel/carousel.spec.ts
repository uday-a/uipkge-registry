import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  UiCarouselComponent,
  UiCarouselItemComponent,
  UiCarouselNextComponent,
  UiCarouselPreviousComponent,
} from './carousel.component'
import { carouselItemVariants as angularItem, carouselVariants as angularVariants } from './carousel.variants'

const here = dirname(fileURLToPath(import.meta.url))
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/carousel/carousel.variants.ts'), 'utf8')
const angularSrc = readFileSync(resolve(here, './carousel.variants.ts'), 'utf8')

function stripComments(s: string): string {
  return s.replace(/\/\/.*$/gm, '')
}

describe('Carousel (angular parity, 10 checks)', () => {
  it('1: variants file is byte-identical to Vue registry copy', () => {
    expect(stripComments(angularSrc)).toBe(stripComments(vueSrc))
  })
  it('2: components are standalone', () => {
    const src = readFileSync(resolve(here, './carousel.component.ts'), 'utf8')
    expect(src.match(/standalone: true/g)!.length).toBeGreaterThanOrEqual(7)
  })
  it('3: defaults mirror Vue (modelValue=0 horizontal loop=false)', () => {
    const c = new UiCarouselComponent()
    expect(c.modelValue).toBe(0)
    expect(c.orientation).toBe('horizontal')
    expect(c.loop).toBe(false)
  })
  it('4: host has relative overflow-hidden base', () => {
    const c = new UiCarouselComponent()
    expect(c.hostClass).toContain('relative')
    expect(c.hostClass).toContain('overflow-hidden')
  })
  it('5: orientations produce distinct output (root + item)', () => {
    expect(angularVariants({ orientation: 'horizontal' })).not.toBe(angularVariants({ orientation: 'vertical' }))
    expect(angularItem({ orientation: 'horizontal' })).not.toBe(angularItem({ orientation: 'vertical' }))
  })
  it('6: horizontal maps to w-full (matches Vue)', () => {
    expect(angularVariants({ orientation: 'horizontal' })).toContain('w-full')
  })
  it('7: item vertical maps to h-full', () => {
    expect(angularItem({ orientation: 'vertical' })).toContain('h-full')
  })
  it('8: custom class merges via cn()', () => {
    const c = new UiCarouselComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const item = new UiCarouselItemComponent()
    item.className = 'custom-class'
    expect(item.hostClass).toContain('custom-class')
  })
  it('9: data-slot root + sub-part contracts present', () => {
    const src = readFileSync(resolve(here, './carousel.component.ts'), 'utf8')
    for (const slot of [
      '"carousel"',
      '"carousel-content"',
      '"carousel-item"',
      '"carousel-header"',
      '"carousel-footer"',
      '"carousel-indicators"',
      '"carousel-previous"',
      '"carousel-next"',
    ]) {
      expect(src).toContain(slot)
    }
    expect(src).toContain('aria-orientation')
    expect(src).toContain(`buttonVariants({ variant: 'outline', size: 'icon' })`)
    // tailwind-merge resolves the icon size-9 down to the size-8 override, like React's cn().
    expect(new UiCarouselPreviousComponent().hostClass).toContain('size-8')
    expect(new UiCarouselPreviousComponent().hostClass).not.toContain('size-9')
    expect(new UiCarouselNextComponent().hostClass).toContain('focus-visible:ring')
  })
  it('10: scrollTo clamps; loop wraps around', () => {
    const c = new UiCarouselComponent()
    c.itemCount = 3
    const emitted: number[] = []
    c.modelValueChange.subscribe((v) => emitted.push(v))
    c.scrollTo(9)
    expect(c.activeIndex).toBe(2)
    c.scrollTo(-4)
    expect(c.activeIndex).toBe(0)
    c.loop = true
    c.scrollTo(3)
    expect(c.activeIndex).toBe(0)
    expect(emitted.length).toBe(3)
  })
})
