// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiSpinnerComponent } from './spinner.component'
import { spinnerVariants } from './spinner.variants'
import { spinnerVariants as reactSpinnerVariants } from '../../../registry-react/components/spinner/spinner.variants'

// React Spinner parity (it renders the Lucide Loader2 svg itself). If these break, users see
// an empty <ui-spinner> (nothing spins), a spinner that ignores size-* / text-* overrides, or
// assistive tech that no longer announces the loading status.

@Component({
  standalone: true,
  imports: [UiSpinnerComponent],
  template: `<ui-spinner id="a" /><ui-spinner id="b" size="sm" class="text-primary size-8" />`,
})
class Host {}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  return (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
}

describe('Spinner (angular, 4 checks)', () => {
  it('1: a bare <ui-spinner> renders the Loader2 svg with role="status" + aria-label', () => {
    const svg = render()('a').querySelector('svg')!
    expect(svg).not.toBeNull()
    expect(svg.getAttribute('data-slot')).toBe('spinner')
    expect(svg.getAttribute('role')).toBe('status')
    expect(svg.getAttribute('aria-label')).toBe('Loading')
    expect(svg.querySelector('path')!.getAttribute('d')).toBe('M21 12a9 9 0 1 1-6.219-8.56')
  })

  it('2: the host is display:contents so the svg is what parents lay out and style', () => {
    expect(render()('a').classList.contains('contents')).toBe(true)
  })

  it('3: size + consumer classes land on the svg, consumer size-* wins', () => {
    const cls = render()('b').querySelector('svg')!.classList
    for (const c of ['motion-safe:animate-spin', 'text-primary', 'size-8']) expect(cls.contains(c), c).toBe(true)
    expect(cls.contains('size-4')).toBe(false)
    expect(cls.contains('text-muted-foreground')).toBe(false)
  })

  it('4: every size produces the same classes as React spinnerVariants', () => {
    for (const size of ['default', 'sm', 'lg', 'icon'] as const)
      expect(spinnerVariants({ size })).toBe(reactSpinnerVariants({ size }))
  })
})
