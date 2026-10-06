// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, type Type } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms'
import { UiCheckboxComponent } from './checkbox/checkbox.component'
import { UiColorPickerComponent } from './color-picker/color-picker.component'
import { UiInputComponent } from './input/input.component'
import { UiKnobComponent } from './knob/knob.component'
import { UiMaskedInputComponent } from './masked-input/masked-input.component'
import { UiNumberFieldComponent } from './number-field/number-field.component'
import { UiPasswordInputComponent } from './password-input/password-input.component'
import { UiPinInputComponent } from './pin-input/pin-input.component'
import { UiRadioGroupComponent } from './radio-group/radio-group.component'
import { UiRangeSliderComponent } from './range-slider/range-slider.component'
import { UiSelectComponent } from './select/select.component'
import { UiSignaturePadComponent } from './signature-pad/signature-pad.component'
import { UiSliderComponent } from './slider/slider.component'
import { UiSwitchComponent } from './switch/switch.component'
import { UiTextareaComponent } from './textarea/textarea.component'
import { UiToggleComponent } from './toggle/toggle.component'

// Angular users bind form inputs with [formControl] / formControlName / ngModel. That only
// works when the component registers itself as NG_VALUE_ACCESSOR -- declaring the interface
// is not enough (the registry shipped 16 inputs that way). Each case binds a real
// FormControl and checks values flow in and the disabled state reaches the component.

// Fields use React's model names: switch / checkbox `checked` (their `value` is the submitted string,
// default 'on'), toggle `pressed`, the rest `value`; signature-pad keeps React's `modelValue`.
interface Case {
  tag: string
  cmp: Type<unknown>
  field: string
  sample: unknown
}

const cases: Case[] = [
  { tag: 'ui-checkbox', cmp: UiCheckboxComponent, field: 'checked', sample: true },
  { tag: 'ui-color-picker', cmp: UiColorPickerComponent, field: 'value', sample: '#ff0000' },
  { tag: 'ui-input', cmp: UiInputComponent, field: 'value', sample: 'hello' },
  { tag: 'ui-knob', cmp: UiKnobComponent, field: 'value', sample: 42 },
  { tag: 'ui-masked-input', cmp: UiMaskedInputComponent, field: 'value', sample: '123' },
  { tag: 'ui-number-field', cmp: UiNumberFieldComponent, field: 'value', sample: 7 },
  { tag: 'ui-password-input', cmp: UiPasswordInputComponent, field: 'value', sample: 's3cret' },
  { tag: 'ui-pin-input', cmp: UiPinInputComponent, field: 'value', sample: '1234' },
  { tag: 'ui-radio-group', cmp: UiRadioGroupComponent, field: 'value', sample: 'b' },
  { tag: 'ui-range-slider', cmp: UiRangeSliderComponent, field: 'value', sample: [10, 60] },
  { tag: 'ui-select', cmp: UiSelectComponent, field: 'value', sample: 'b' },
  { tag: 'ui-signature-pad', cmp: UiSignaturePadComponent, field: 'modelValue', sample: 'data:image/png;base64,AA' },
  { tag: 'ui-slider', cmp: UiSliderComponent, field: 'value', sample: 30 },
  { tag: 'ui-switch', cmp: UiSwitchComponent, field: 'checked', sample: true },
  { tag: 'ui-textarea', cmp: UiTextareaComponent, field: 'value', sample: 'notes' },
  { tag: 'ui-toggle', cmp: UiToggleComponent, field: 'pressed', sample: true },
]

function mount({ tag, cmp }: Case) {
  @Component({
    standalone: true,
    imports: [cmp, ReactiveFormsModule],
    template: `<${tag} [formControl]="control" />`,
  })
  class Host {
    control = new FormControl<unknown>(null)
  }
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  const debug = fixture.debugElement.children[0]!
  return {
    fixture,
    host: fixture.componentInstance,
    instance: debug.componentInstance as Record<string, unknown>,
    debug,
  }
}

describe('Form binding (angular, 3 checks)', () => {
  it('1: every form input is the NG_VALUE_ACCESSOR for its own element', () => {
    for (const c of cases) {
      const { debug, instance } = mount(c)
      const accessors = debug.injector.get(NG_VALUE_ACCESSOR)
      expect(accessors, c.tag).toContain(instance)
    }
  })
  it('2: control.setValue writes through to the component', () => {
    for (const c of cases) {
      const { host, instance, fixture } = mount(c)
      host.control.setValue(c.sample)
      fixture.detectChanges()
      expect(instance[c.field], c.tag).toEqual(c.sample)
    }
  })
  it('3: control.disable() disables the component', () => {
    for (const c of cases) {
      const { host, instance, fixture } = mount(c)
      host.control.disable()
      fixture.detectChanges()
      expect(instance['disabled'], c.tag).toBe(true)
    }
  })
})
