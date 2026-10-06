import { Component, Input, signal } from '@angular/core'
import {
  UiSelectComponent,
  UiSelectContentComponent,
  UiSelectGroupComponent,
  UiSelectItemComponent,
  UiSelectLabelComponent,
  UiSelectSeparatorComponent,
  UiSelectTriggerComponent,
  UiSelectValueComponent,
} from '../../../../../packages/registry-angular/components/select/select.component'
import { UiNativeSelectComponent } from '../../../../../packages/registry-angular/components/select/native-select.component'
import { UiAdvanceSelectComponent } from '../../../../../packages/registry-angular/components/advance-select/advance-select.component'

/** Angular demo for the select page. Mirrors demos/react/select.tsx story by story. */
@Component({
  selector: 'angular-select-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiSelectComponent,
    UiSelectContentComponent,
    UiSelectGroupComponent,
    UiSelectItemComponent,
    UiSelectLabelComponent,
    UiSelectSeparatorComponent,
    UiSelectTriggerComponent,
    UiSelectValueComponent,
    UiNativeSelectComponent,
    UiAdvanceSelectComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-select [value]="fruit()" (valueChange)="fruit.set($event)">
          <button ui-select-trigger class="w-48">
            <ui-select-value placeholder="Pick a fruit" />
          </button>
          <ui-select-content>
            <ui-select-item value="apple">Apple</ui-select-item>
            <ui-select-item value="banana">Banana</ui-select-item>
            <ui-select-item value="cherry">Cherry</ui-select-item>
          </ui-select-content>
        </ui-select>
      }
      @case ('Grouped with labels') {
        <ui-select [value]="country()" (valueChange)="country.set($event)">
          <button ui-select-trigger class="w-56">
            <ui-select-value placeholder="Choose a country" />
          </button>
          <ui-select-content>
            <ui-select-group>
              <ui-select-label>Europe</ui-select-label>
              <ui-select-item value="france">France</ui-select-item>
              <ui-select-item value="germany">Germany</ui-select-item>
              <ui-select-item value="spain">Spain</ui-select-item>
            </ui-select-group>
            <ui-select-group>
              <ui-select-label>Asia</ui-select-label>
              <ui-select-item value="japan">Japan</ui-select-item>
              <ui-select-item value="india">India</ui-select-item>
              <ui-select-item value="korea">South Korea</ui-select-item>
            </ui-select-group>
          </ui-select-content>
        </ui-select>
      }
      @case ('Disabled item') {
        <ui-select [value]="role()" (valueChange)="role.set($event)">
          <button ui-select-trigger class="w-48">
            <ui-select-value placeholder="Pick a role" />
          </button>
          <ui-select-content>
            <ui-select-item value="viewer">Viewer</ui-select-item>
            <ui-select-item value="editor">Editor</ui-select-item>
            <ui-select-item value="admin" disabled>Admin (locked)</ui-select-item>
            <ui-select-item value="owner">Owner</ui-select-item>
          </ui-select-content>
        </ui-select>
      }
      @case ('With separator') {
        <ui-select [value]="skill()" (valueChange)="skill.set($event)">
          <button ui-select-trigger class="w-56">
            <ui-select-value placeholder="Pick a skill level" />
          </button>
          <ui-select-content>
            <ui-select-item value="beginner">Beginner</ui-select-item>
            <ui-select-item value="intermediate">Intermediate</ui-select-item>
            <ui-select-separator />
            <ui-select-item value="advanced">Advanced</ui-select-item>
            <ui-select-item value="expert">Expert</ui-select-item>
          </ui-select-content>
        </ui-select>
      }
      @case ('Long list with scroll buttons') {
        <ui-select [value]="tz()" (valueChange)="tz.set($event)">
          <button ui-select-trigger class="w-64">
            <ui-select-value placeholder="Pick a timezone" />
          </button>
          <ui-select-content class="max-h-56">
            <ui-select-group>
              <ui-select-label>Americas</ui-select-label>
              <ui-select-item value="utc-08">(UTC-08) Pacific Time</ui-select-item>
              <ui-select-item value="utc-07">(UTC-07) Mountain Time</ui-select-item>
              <ui-select-item value="utc-06">(UTC-06) Central Time</ui-select-item>
              <ui-select-item value="utc-05">(UTC-05) Eastern Time</ui-select-item>
              <ui-select-item value="utc-04">(UTC-04) Atlantic Time</ui-select-item>
              <ui-select-item value="utc-03">(UTC-03) Buenos Aires</ui-select-item>
            </ui-select-group>
            <ui-select-group>
              <ui-select-label>Europe</ui-select-label>
              <ui-select-item value="utc+00">(UTC+00) London</ui-select-item>
              <ui-select-item value="utc+01">(UTC+01) Paris</ui-select-item>
              <ui-select-item value="utc+02">(UTC+02) Athens</ui-select-item>
              <ui-select-item value="utc+03">(UTC+03) Moscow</ui-select-item>
            </ui-select-group>
            <ui-select-group>
              <ui-select-label>Asia</ui-select-label>
              <ui-select-item value="utc+05:30">(UTC+05:30) Mumbai</ui-select-item>
              <ui-select-item value="utc+07">(UTC+07) Bangkok</ui-select-item>
              <ui-select-item value="utc+08">(UTC+08) Singapore</ui-select-item>
              <ui-select-item value="utc+09">(UTC+09) Tokyo</ui-select-item>
            </ui-select-group>
          </ui-select-content>
        </ui-select>
      }
      @case ('Disabled trigger') {
        <ui-select [value]="disabledTrigger()" (valueChange)="disabledTrigger.set($event)" disabled>
          <button ui-select-trigger class="w-48">
            <ui-select-value placeholder="Locked" />
          </button>
          <ui-select-content>
            <ui-select-item value="a">A</ui-select-item>
            <ui-select-item value="b">B</ui-select-item>
          </ui-select-content>
        </ui-select>
      }
      @case ('Multi-select') {
        <div class="space-y-2">
          <ui-advance-select
            [value]="fruits()"
            (valueChange)="fruits.set($any($event))"
            mode="multiple"
            [options]="fruitOptions"
            placeholder="Pick fruits"
            class="w-56"
          />
          <p class="text-muted-foreground text-xs">
            Selected: <code class="text-foreground">{{ fruits().length ? fruits().join(', ') : '—' }}</code>
          </p>
        </div>
      }
      @case ('Native Select') {
        <div class="grid max-w-xs gap-3">
          <ui-native-select defaultValue="banana" [options]="nativeOptions" />
        </div>
      }
    }
  `,
})
export class AngularSelectDemoComponent {
  @Input() story = 'Default'
  readonly fruit = signal<string | undefined>(undefined)
  readonly country = signal<string | undefined>(undefined)
  readonly role = signal<string | undefined>(undefined)
  readonly skill = signal<string | undefined>(undefined)
  readonly tz = signal<string | undefined>(undefined)
  readonly disabledTrigger = signal<string | undefined>(undefined)
  readonly fruits = signal<string[]>([])
  readonly fruitOptions = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Durian', value: 'durian' },
    { label: 'Elderberry', value: 'elderberry' },
  ]
  readonly nativeOptions = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Dragonfruit (Sold out)', value: 'dragonfruit', disabled: true },
  ]
}
