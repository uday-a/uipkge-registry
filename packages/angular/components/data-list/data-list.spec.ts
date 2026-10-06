// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiDataListComponent, UiDataListItemComponent } from './data-list.component'

// React DataList parity. If these break, users see: rows stop stacking, the separators
// between rows disappear (or a stray border/padding shows on the first/last row), or a
// consumer `class` (e.g. `border-0 py-1` in a grid layout) no longer overrides the defaults.

@Component({
  standalone: true,
  imports: [UiDataListComponent, UiDataListItemComponent],
  template: `
    <div ui-data-list [class]="rootClass">
      <div ui-data-list-item><span>Plan</span><span>Pro</span></div>
      <div ui-data-list-item [class]="itemClass"><span>Seats</span><span>24</span></div>
    </div>
  `,
})
class Host {
  rootClass = 'p-6'
  itemClass = 'border-0 py-1'
}

function render() {
  const f = TestBed.createComponent(Host)
  f.detectChanges()
  const el = f.nativeElement as HTMLElement
  return {
    f,
    root: el.querySelector('[data-slot=data-list]') as HTMLElement,
    items: [...el.querySelectorAll('[data-slot=data-list-item]')] as HTMLElement[],
  }
}

describe('DataList (angular, 5 checks)', () => {
  it('1: root is a flex column with the data-uipkge marker', () => {
    const { root } = render()
    expect(root.className).toContain('flex flex-col')
    expect(root.hasAttribute('data-uipkge')).toBe(true)
  })
  it('2: consumer class merges onto the root', () => {
    expect(render().root.className).toContain('p-6')
  })
  it('3: items are row-separated with first/last edge trimming', () => {
    const [a] = render().items
    for (const t of ['flex-row', 'justify-between', 'border-b', 'py-4', 'first:pt-0', 'last:border-0', 'last:pb-0'])
      expect(a.className).toContain(t)
  })
  it('4: an item class overrides conflicting defaults via cn()', () => {
    const b = render().items[1]
    expect(b.className).toContain('border-0')
    expect(b.className).toContain('py-1')
    expect(b.className).not.toContain('py-4')
    expect(b.className.split(' ')).not.toContain('border-b')
  })
  it('5: projected content renders inside each item', () => {
    expect(render().items.map((i) => i.textContent)).toEqual(['PlanPro', 'Seats24'])
  })
})
