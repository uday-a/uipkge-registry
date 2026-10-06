// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { UiCheckboxComponent, UiCheckboxGroupComponent } from './checkbox.component'

// Radix Checkbox, as the React Checkbox ships it: a real button role="checkbox" inside
// React's layout wrapper, so labels toggle it and it is keyboard-reachable; tri-state
// aria-checked / data-state (the colour classes and check / minus icon read them), the
// indicator only mounts when checked, Enter does nothing (WAI-ARIA), and CheckboxGroup
// keeps a string[] selection. If these broke, users would see boxes that never tick,
// labels that don't toggle, or a group whose value never updates.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  // ids live on the button (React passes id to the Radix root), so '#a' finds the button itself.
  const box = (id = '') => el.querySelector<HTMLButtonElement>(`button${id}[role="checkbox"]`)!
  const flush = () => fixture.detectChanges()
  return { fixture, el, box, flush }
}

describe('Checkbox (angular, 10 checks)', () => {
  it('1: renders React DOM: wrapper > flex row > button role=checkbox, no indicator while unchecked', () => {
    @Component({ standalone: true, imports: [UiCheckboxComponent], template: `<ui-checkbox />` })
    class Host {}
    const { el, box } = render(Host)
    const host = el.querySelector('ui-checkbox')!
    expect(['flex', 'items-start', 'gap-2', 'flex-col'].every((c) => host.classList.contains(c))).toBe(true)
    expect(box().parentElement!.className).toBe('flex items-center')
    expect(box().getAttribute('type')).toBe('button')
    expect(box().getAttribute('data-slot')).toBe('checkbox')
    expect(box().getAttribute('aria-checked')).toBe('false')
    expect(box().getAttribute('data-state')).toBe('unchecked')
    expect(box().getAttribute('value')).toBe('on')
    expect(box().querySelector('[data-slot="checkbox-indicator"]')).toBeNull()
  })

  it('2: click checks it, mounts the check icon (animated) and emits; Enter is ignored', () => {
    const seen: unknown[] = []
    @Component({
      standalone: true,
      imports: [UiCheckboxComponent],
      template: `<ui-checkbox (checkedChange)="seen.push($event)" />`,
    })
    class Host {
      seen = seen
    }
    const { box, flush } = render(Host)
    box().click()
    flush()
    expect(box().getAttribute('aria-checked')).toBe('true')
    const icon = box().querySelector('[data-slot="checkbox-indicator"] svg')!
    expect(icon.getAttribute('class')).toContain('lucide-check')
    expect(icon.getAttribute('class')).toContain('checkbox-indicator-icon')
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    box().dispatchEvent(enter)
    expect(enter.defaultPrevented).toBe(true)
    expect(seen).toEqual([true])
    expect(document.head.textContent).toContain('checkbox-check-in')
  })

  it('3: indeterminate shows mixed + minus icon; clicking it resolves to checked', () => {
    const seen: unknown[] = []
    @Component({
      standalone: true,
      imports: [UiCheckboxComponent],
      template: `<ui-checkbox id="a" checked="indeterminate" /><ui-checkbox
          id="b"
          indeterminate
          (checkedChange)="seen.push($event)"
        />`,
    })
    class Host {
      seen = seen
    }
    const { box } = render(Host)
    for (const b of [box('#a'), box('#b')]) {
      expect(b.getAttribute('aria-checked')).toBe('mixed')
      expect(b.getAttribute('data-state')).toBe('indeterminate')
      expect(b.querySelector('svg')!.getAttribute('class')).toContain('lucide-minus')
    }
    box('#b').click()
    expect(seen).toEqual([true])
  })

  it('4: a static id moves to the button, so an external <label for> toggles it', () => {
    @Component({
      standalone: true,
      imports: [UiCheckboxComponent],
      template: `<ui-checkbox id="terms" /><label for="terms">Terms</label>`,
    })
    class Host {}
    const { el, box, flush } = render(Host)
    expect(el.querySelector('ui-checkbox')!.hasAttribute('id')).toBe(false)
    expect(box().id).toBe('terms')
    el.querySelector('label')!.click()
    flush()
    expect(box().getAttribute('aria-checked')).toBe('true')
  })

  it('5: label prop renders an associated label (auto id) after, or before the box', () => {
    @Component({
      standalone: true,
      imports: [UiCheckboxComponent],
      template: `<ui-checkbox id="w1" label="After" /><ui-checkbox class="x" label="Before" labelPosition="before" />`,
    })
    class Host {}
    const { el, flush } = render(Host)
    const [after, before] = Array.from(el.querySelectorAll('ui-checkbox'))
    const afterLabel = after!.querySelector('label')!
    expect(afterLabel.previousElementSibling!.getAttribute('role')).toBe('checkbox')
    expect(afterLabel.classList.contains('ml-2')).toBe(true)
    const beforeLabel = before!.querySelector('label')!
    expect(beforeLabel.nextElementSibling!.className).toBe('flex items-center')
    const autoId = beforeLabel.getAttribute('for')!
    expect(autoId).toMatch(/^checkbox-/)
    expect(before!.querySelector('button')!.id).toBe(autoId)
    beforeLabel.click()
    flush()
    expect(before!.querySelector('button')!.getAttribute('aria-checked')).toBe('true')
  })

  it('6: disabled disables the button, dims the label and ignores clicks', () => {
    @Component({
      standalone: true,
      imports: [UiCheckboxComponent],
      template: `<ui-checkbox disabled defaultChecked label="Off" />`,
    })
    class Host {}
    const { el, box, flush } = render(Host)
    expect(box().disabled).toBe(true)
    expect(box().hasAttribute('data-disabled')).toBe(true)
    expect(el.querySelector('label')!.classList.contains('opacity-50')).toBe(true)
    box().click()
    flush()
    expect(box().getAttribute('aria-checked')).toBe('true')
  })

  it('7: hint shows until an error; errorMessages render and mark the box aria-invalid', () => {
    @Component({
      standalone: true,
      imports: [UiCheckboxComponent],
      template: `<ui-checkbox id="h" hint="Helpful" /><ui-checkbox
          id="e"
          hint="Hidden"
          [errorMessages]="['One', 'Two']"
        />`,
    })
    class Host {}
    const { el, box } = render(Host)
    expect(el.querySelector('ui-checkbox:first-child p')!.textContent).toBe('Helpful')
    const err = el.querySelectorAll('ui-checkbox')[1]!
    expect(Array.from(err.querySelectorAll('p.text-destructive')).map((p) => p.textContent)).toEqual(['One', 'Two'])
    expect(err.textContent).not.toContain('Hidden')
    expect(box('#e').getAttribute('aria-invalid')).toBe('true')
    expect(box('#e').classList.contains('border-destructive')).toBe(true)
    expect(box('#h').hasAttribute('aria-invalid')).toBe(false)
  })

  it('8: hideIcon force-mounts an empty indicator; loading shows the spinner', () => {
    @Component({
      standalone: true,
      imports: [UiCheckboxComponent],
      template: `<ui-checkbox id="n" hideIcon /><ui-checkbox id="l" loading defaultChecked />`,
    })
    class Host {}
    const { box } = render(Host)
    const empty = box('#n').querySelector('[data-slot="checkbox-indicator"]')!
    expect(empty).not.toBeNull()
    expect(empty.children.length).toBe(0)
    expect(box('#l').querySelector('svg')!.getAttribute('class')).toContain('animate-spin')
  })

  it('9: size / color / flat / class land on the button; inline + density on the wrapper', () => {
    @Component({
      standalone: true,
      imports: [UiCheckboxComponent],
      template: `<ui-checkbox size="lg" color="success" flat inline density="compact" class="custom-x" />`,
    })
    class Host {}
    const { el, box } = render(Host)
    const cls = box().classList
    expect(['size-5', 'data-[state=checked]:bg-success', 'shadow-none', 'custom-x'].every((c) => cls.contains(c))).toBe(
      true,
    )
    const host = el.querySelector('ui-checkbox')!.classList
    expect(host.contains('inline-flex') && host.contains('gap-1') && !host.contains('flex-col')).toBe(true)
  })

  it('10: formControl writes in, clicks write back, disable() disables', () => {
    @Component({
      standalone: true,
      imports: [UiCheckboxComponent, ReactiveFormsModule],
      template: `<ui-checkbox [formControl]="ctrl" />`,
    })
    class Host {
      ctrl = new FormControl<boolean | 'indeterminate'>(true)
    }
    const { fixture, box, flush } = render(Host)
    expect(box().getAttribute('aria-checked')).toBe('true')
    box().click()
    flush()
    expect(fixture.componentInstance.ctrl.value).toBe(false)
    fixture.componentInstance.ctrl.disable()
    flush()
    expect(box().disabled).toBe(true)
  })
})

describe('CheckboxGroup (angular, 3 checks)', () => {
  it('1: options render labelled checkboxes bound to the selected array', () => {
    @Component({
      standalone: true,
      imports: [UiCheckboxGroupComponent],
      template: `<ui-checkbox-group label="Fruits" [(value)]="picked" [options]="opts" />`,
    })
    class Host {
      picked = ['apple']
      opts = [
        { label: 'Apple', value: 'apple' },
        { label: 'Pear', value: 'pear' },
        { label: 'Orange', value: 'orange', disabled: true },
      ]
    }
    const { fixture, el, flush } = render(Host)
    const group = el.querySelector('[data-slot="checkbox-group"]')!
    expect(group.getAttribute('role')).toBe('group')
    expect(group.querySelector(':scope > label')!.textContent).toBe('Fruits')
    const boxes = Array.from(el.querySelectorAll<HTMLButtonElement>('button[role="checkbox"]'))
    expect(boxes.map((b) => b.getAttribute('aria-checked'))).toEqual(['true', 'false', 'false'])
    expect(boxes[2]!.disabled).toBe(true)
    boxes[1]!.click()
    flush()
    expect(fixture.componentInstance.picked).toEqual(['apple', 'pear'])
    boxes[0]!.click()
    flush()
    expect(fixture.componentInstance.picked).toEqual(['pear'])
    expect(boxes.map((b) => b.getAttribute('aria-checked'))).toEqual(['false', 'true', 'false'])
  })

  it('2: disabled group disables every option; inline lays them out horizontally', () => {
    @Component({
      standalone: true,
      imports: [UiCheckboxGroupComponent],
      template: `<ui-checkbox-group disabled inline [defaultValue]="['a']" [options]="['a', 'b']" />`,
    })
    class Host {}
    const { el } = render(Host)
    const group = el.querySelector('[data-slot="checkbox-group"]')!
    expect(group.getAttribute('data-orientation')).toBe('horizontal')
    expect(group.classList.contains('flex-row')).toBe(true)
    const boxes = Array.from(el.querySelectorAll<HTMLButtonElement>('button[role="checkbox"]'))
    expect(boxes.every((b) => b.disabled)).toBe(true)
    expect(boxes[0]!.getAttribute('aria-checked')).toBe('true')
  })

  it('3: formControl drives the selection and receives changes', () => {
    @Component({
      standalone: true,
      imports: [UiCheckboxGroupComponent, ReactiveFormsModule],
      template: `<ui-checkbox-group name="g" [formControl]="ctrl" [options]="['a', 'b']" />`,
    })
    class Host {
      ctrl = new FormControl<string[]>(['b'])
    }
    const { fixture, el, flush } = render(Host)
    const boxes = Array.from(el.querySelectorAll<HTMLButtonElement>('button[role="checkbox"]'))
    expect(boxes.map((b) => b.getAttribute('aria-checked'))).toEqual(['false', 'true'])
    expect(boxes[0]!.getAttribute('name')).toBe('g')
    boxes[0]!.click()
    flush()
    expect(fixture.componentInstance.ctrl.value).toEqual(['b', 'a'])
  })
})

describe('Checkbox class and tabindex forwarding', () => {
  // React passes className and tabIndex to the Radix button only. If the class also stayed
  // on the wrapper, spacing like mt-1 would apply twice; if tabindex stayed on the host, a
  // checkbox inside a clickable row would still be a Tab stop.
  it('a static class goes to the button only, not the wrapper', () => {
    @Component({ standalone: true, imports: [UiCheckboxComponent], template: `<ui-checkbox class="mt-1" />` })
    class Host {}
    const { el, box } = render(Host)
    expect(box().classList.contains('mt-1')).toBe(true)
    expect(el.querySelector('ui-checkbox')!.classList.contains('mt-1')).toBe(false)
  })
  it('tabindex goes to the button', () => {
    @Component({ standalone: true, imports: [UiCheckboxComponent], template: `<ui-checkbox tabindex="-1" />` })
    class Host {}
    const { el, box } = render(Host)
    expect(box().getAttribute('tabindex')).toBe('-1')
    expect(el.querySelector('ui-checkbox')!.hasAttribute('tabindex')).toBe(false)
  })
})
