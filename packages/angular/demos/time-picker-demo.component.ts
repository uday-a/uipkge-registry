import { Component, Input } from '@angular/core'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'
import {
  UiTimePickerComponent,
  UiTimeRangePickerComponent,
  type TimeRangePreset,
} from '../../../../../packages/registry-angular/components/time-picker/time-picker.component'

const timePresets = [
  { label: 'Morning', value: '08:00' },
  { label: 'Noon', value: '12:00' },
  { label: 'Afternoon', value: '14:00' },
  { label: 'Evening', value: '18:00' },
  { label: 'Night', value: '21:00' },
]

const disabledHours = () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 20, 21, 22, 23]
const disabledMinutes = (h: number) => {
  if (h === 12) return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59]
  return []
}
const disabledSeconds = (h: number, m: number) => {
  if (h === 12 && m === 30) return [0, 1, 2, 3, 4, 5]
  return []
}

/** Angular demo for the time-picker page. Mirrors demos/react/time-picker.tsx story by story. */
@Component({
  selector: 'angular-time-picker-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiLabelComponent, UiTimePickerComponent, UiTimeRangePickerComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Pick a time</label>
          <button ui-time-picker [value]="basicValue" (valueChange)="basicValue = $event"></button>
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ basicValue }}</code>
          </p>
        </div>
      }
      @case ('With Seconds') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Pick a time</label>
          <button
            ui-time-picker
            [value]="hmsValue"
            (valueChange)="hmsValue = $event"
            format="HH:mm:ss"
            [secondStep]="5"
          ></button>
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ hmsValue }}</code>
          </p>
        </div>
      }
      @case ('12-Hour Format') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Pick a time</label>
          <button ui-time-picker [value]="h12Value" (valueChange)="h12Value = $event" format="hh:mm A"></button>
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ h12Value }}</code>
          </p>
        </div>
      }
      @case ('use12Hours') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Pick a time</label>
          <button ui-time-picker [value]="amPmValue" (valueChange)="amPmValue = $event" use12Hours></button>
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ amPmValue }}</code>
          </p>
        </div>
      }
      @case ('Disabled Time') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Business hours only</label>
          <button
            ui-time-picker
            [value]="disabledValue"
            (valueChange)="disabledValue = $event"
            [disabledHours]="disabledHours"
            [disabledMinutes]="disabledMinutes"
            [disabledSeconds]="disabledSeconds"
            format="HH:mm:ss"
            [secondStep]="5"
          ></button>
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ disabledValue }}</code>
          </p>
        </div>
      }
      @case ('Hide Disabled Options') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Business hours (hidden)</label>
          <button
            ui-time-picker
            [value]="hideDisabledValue"
            (valueChange)="hideDisabledValue = $event"
            [disabledHours]="disabledHours"
            [disabledMinutes]="disabledMinutes"
            hideDisabledOptions
          ></button>
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ hideDisabledValue }}</code>
          </p>
        </div>
      }
      @case ('Steps') {
        <div class="max-w-xs space-y-2">
          <label ui-label>15-min intervals</label>
          <button
            ui-time-picker
            [value]="stepValue"
            (valueChange)="stepValue = $event"
            [hourStep]="2"
            [minuteStep]="15"
            [secondStep]="10"
            format="HH:mm:ss"
          ></button>
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ stepValue }}</code>
          </p>
        </div>
      }
      @case ('Presets') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Quick select</label>
          <button
            ui-time-picker
            [value]="presetValue"
            (valueChange)="presetValue = $event"
            [presets]="timePresets"
          ></button>
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ presetValue }}</code>
          </p>
        </div>
      }
      @case ('Range Picker') {
        <div class="max-w-sm space-y-2">
          <label ui-label>Working hours</label>
          <button
            ui-time-range-picker
            [value]="rangeValue"
            (valueChange)="rangeValue = $event"
            [presets]="rangePresets"
          ></button>
          <p class="text-muted-foreground text-xs">
            Value:
            <code class="text-foreground">{{ rangeValue ? rangeValue[0] + ' ~ ' + rangeValue[1] : 'none' }}</code>
          </p>
        </div>
      }
      @case ('Sizes') {
        <div class="flex max-w-xs flex-col gap-3">
          <button
            ui-time-picker
            [value]="smValue"
            (valueChange)="smValue = $event"
            size="small"
            placeholder="Small"
          ></button>
          <button
            ui-time-picker
            [value]="mdValue"
            (valueChange)="mdValue = $event"
            size="middle"
            placeholder="Middle"
          ></button>
          <button
            ui-time-picker
            [value]="lgValue"
            (valueChange)="lgValue = $event"
            size="large"
            placeholder="Large"
          ></button>
        </div>
      }
      @case ('Status') {
        <div class="flex max-w-xs flex-col gap-3">
          <button
            ui-time-picker
            [value]="errorValue"
            (valueChange)="errorValue = $event"
            status="error"
            placeholder="Error state"
          ></button>
          <button
            ui-time-picker
            [value]="warningValue"
            (valueChange)="warningValue = $event"
            status="warning"
            placeholder="Warning state"
          ></button>
        </div>
      }
      @case ('Allow Clear') {
        <div class="flex max-w-xs flex-col gap-3">
          <button
            ui-time-picker
            [value]="clearableValue"
            (valueChange)="clearableValue = $event"
            [allowClear]="true"
            placeholder="Clearable"
          ></button>
          <button
            ui-time-picker
            [value]="nonClearableValue"
            (valueChange)="nonClearableValue = $event"
            [allowClear]="false"
            placeholder="Not clearable"
          ></button>
        </div>
      }
      @case ('Suffix Icon') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Default clock icon</label>
          <button ui-time-picker [value]="basicValue" (valueChange)="basicValue = $event"></button>
          <p class="text-muted-foreground text-xs">The Clock icon from Lucide is always rendered.</p>
        </div>
      }
      @case ('Full Featured') {
        <div class="max-w-xs space-y-2">
          <label ui-label>Full featured</label>
          <button
            ui-time-picker
            [value]="fullValue"
            (valueChange)="fullValue = $event"
            format="HH:mm:ss"
            use12Hours
            [hourStep]="1"
            [minuteStep]="5"
            [secondStep]="5"
            [disabledHours]="disabledHours"
            [disabledMinutes]="disabledMinutes"
            [presets]="timePresets"
            [allowClear]="true"
          ></button>
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ fullValue }}</code>
          </p>
        </div>
      }
    }
  `,
})
export class AngularTimePickerDemoComponent {
  @Input() story = 'Default'

  readonly timePresets = timePresets
  readonly disabledHours = disabledHours
  readonly disabledMinutes = disabledMinutes
  readonly disabledSeconds = disabledSeconds
  readonly rangePresets: TimeRangePreset[] = [
    { label: 'Work Day', value: ['09:00', '17:00'] },
    { label: 'Morning Shift', value: ['06:00', '14:00'] },
    { label: 'Night Shift', value: ['22:00', '06:00'] },
  ]

  basicValue = '09:30'
  hmsValue = '14:30:45'
  h12Value = '14:30'
  amPmValue = '09:30'
  disabledValue = '12:00'
  hideDisabledValue = '12:00'
  stepValue = '09:00'
  presetValue = '09:00'
  rangeValue: [string, string] | null = ['09:00', '17:00']
  smValue = '08:00'
  mdValue = '12:00'
  lgValue = '18:00'
  errorValue = ''
  warningValue = ''
  clearableValue = '10:00'
  nonClearableValue = '10:00'
  fullValue = '14:30:45'
}
