// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { UiColorPickerComponent } from './color-picker.component'

// React ColorPicker parity: the swatch behind the native colour input paints the current
// value, the hex field mirrors it, preset swatches pick a colour and ring the active one,
// and everything goes inert when disabled. If these broke, users would pick a colour and
// see nothing change, or a disabled picker would still write values.

function render<T>(cmp: new () => T) {
  const fixture = TestBed.createComponent(cmp)
  fixture.detectChanges()
  const el = fixture.nativeElement as HTMLElement
  return { fixture, el, flush: () => fixture.detectChanges() }
}

describe('ColorPicker (angular, 8 checks)', () => {
  it('1: renders React DOM: block space-y-3 host, swatch trigger, hex field, 12 presets', () => {
    @Component({ standalone: true, imports: [UiColorPickerComponent], template: `<ui-color-picker value="#3b82f6" />` })
    class Host {}
    const { el } = render(Host)
    const host = el.querySelector('ui-color-picker')!
    expect(host.className).toBe('block space-y-3')
    expect(host.getAttribute('data-slot')).toBe('color-picker')
    const swatch = host.querySelector<HTMLElement>('.relative.h-10.w-10')!
    expect(swatch.style.backgroundColor).toBe('rgb(59, 130, 246)')
    expect(host.querySelector<HTMLInputElement>('input[type=color]')!.value).toBe('#3b82f6')
    expect(host.querySelector<HTMLInputElement>('input[aria-label="Hex color"]')!.value).toBe('#3b82f6')
    expect(host.querySelectorAll('button[aria-label^="Select"]').length).toBe(12)
  })

  it('2: free-form hex keeps the native input on a safe #rrggbb value', () => {
    @Component({ standalone: true, imports: [UiColorPickerComponent], template: `<ui-color-picker value="#12" />` })
    class Host {}
    const { el } = render(Host)
    expect(el.querySelector<HTMLInputElement>('input[type=color]')!.value).toBe('#ffffff')
  })

  it('3: [(value)] — clicking a preset updates the bound value and rings the active swatch', () => {
    @Component({
      standalone: true,
      imports: [UiColorPickerComponent],
      template: `<ui-color-picker [(value)]="color" />`,
    })
    class Host {
      color = '#3b82f6'
    }
    const { el, fixture, flush } = render(Host)
    const red = el.querySelector<HTMLButtonElement>('button[aria-label="Select #ef4444"]')!
    expect(red.className).toContain('ring-border/50')
    red.click()
    flush()
    expect(fixture.componentInstance.color).toBe('#ef4444')
    expect(['ring-foreground', 'ring-2', 'ring-offset-2'].every((c) => red.classList.contains(c))).toBe(true)
  })

  it('4: typing in the hex field emits valueChange with the raw text', () => {
    const seen: string[] = []
    @Component({
      standalone: true,
      imports: [UiColorPickerComponent],
      template: `<ui-color-picker (valueChange)="seen.push($event)" />`,
    })
    class Host {
      seen = seen
    }
    const { el } = render(Host)
    const hex = el.querySelector<HTMLInputElement>('input[aria-label="Hex color"]')!
    hex.value = '#abc'
    hex.dispatchEvent(new Event('input'))
    expect(seen).toEqual(['#abc'])
  })

  it('5: presets override and [] hides the swatch row; hideHexInput drops the text field', () => {
    @Component({
      standalone: true,
      imports: [UiColorPickerComponent],
      template: `<ui-color-picker id="a" [presets]="['#000000', '#ffffff']" hideHexInput /><ui-color-picker
          id="b"
          [presets]="[]"
        />`,
    })
    class Host {}
    const { el } = render(Host)
    const a = el.querySelector('#a')!
    expect(a.querySelectorAll('button').length).toBe(2)
    expect(a.querySelector('input[type=text]')).toBeNull()
    // white swatch keeps a visible border ring
    expect(a.querySelector('button[aria-label="Select #ffffff"]')!.className).toContain('ring-border')
    expect(el.querySelector('#b .flex.flex-wrap')).toBeNull()
  })

  it('6: disabled disables every control and ignores clicks', () => {
    const seen: string[] = []
    @Component({
      standalone: true,
      imports: [UiColorPickerComponent],
      template: `<ui-color-picker disabled (valueChange)="seen.push($event)" />`,
    })
    class Host {
      seen = seen
    }
    const { el } = render(Host)
    const controls = [...el.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, button')]
    expect(controls.every((c) => c.disabled)).toBe(true)
    el.querySelector<HTMLButtonElement>('button')!.click()
    expect(seen).toEqual([])
  })

  it('7: form control writes in, picks flow out, disable reaches the inputs', () => {
    @Component({
      standalone: true,
      imports: [UiColorPickerComponent, ReactiveFormsModule],
      template: `<ui-color-picker [formControl]="control" />`,
    })
    class Host {
      control = new FormControl<string | null>('#22c55e')
    }
    const { el, fixture, flush } = render(Host)
    expect(el.querySelector<HTMLInputElement>('input[type=text]')!.value).toBe('#22c55e')
    el.querySelector<HTMLButtonElement>('button[aria-label="Select #171717"]')!.click()
    flush()
    expect(fixture.componentInstance.control.value).toBe('#171717')
    expect(el.querySelector<HTMLInputElement>('input[type=text]')!.value).toBe('#171717')
    fixture.componentInstance.control.disable()
    flush()
    expect(el.querySelector<HTMLInputElement>('input[type=color]')!.disabled).toBe(true)
  })

  it('8: value / valueChange bind like React (value / onValueChange)', () => {
    const seen: string[] = []
    @Component({
      standalone: true,
      imports: [UiColorPickerComponent],
      template: `<ui-color-picker value="#ec4899" (valueChange)="seen.push($event)" />`,
    })
    class Host {
      seen = seen
    }
    const { el } = render(Host)
    expect(el.querySelector<HTMLInputElement>('input[type=text]')!.value).toBe('#ec4899')
    el.querySelector<HTMLButtonElement>('button')!.click()
    expect(seen).toEqual(['#ef4444'])
  })
})
