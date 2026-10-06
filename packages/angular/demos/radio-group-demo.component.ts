import { Component, Input } from '@angular/core'
import {
  UiRadioButtonComponent,
  UiRadioGroupComponent,
  UiRadioGroupItemComponent,
} from '../../../../../packages/registry-angular/components/radio-group/radio-group.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'

/** Angular demo for the radio-group page. Mirrors demos/react/radio-group.tsx story by story. */
@Component({
  selector: 'angular-radio-group-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiRadioGroupComponent, UiRadioGroupItemComponent, UiRadioButtonComponent, UiLabelComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-radio-group [(value)]="value">
          <div class="flex items-center gap-2">
            <ui-radio-group-item id="r1" value="default" />
            <label ui-label for="r1">Default</label>
          </div>
          <div class="flex items-center gap-2">
            <ui-radio-group-item id="r2" value="comfortable" />
            <label ui-label for="r2">Comfortable</label>
          </div>
          <div class="flex items-center gap-2">
            <ui-radio-group-item id="r3" value="compact" />
            <label ui-label for="r3">Compact</label>
          </div>
        </ui-radio-group>
      }
      @case ('Options prop') {
        <ui-radio-group [(value)]="optionsValue" [options]="fruitOptions" />
      }
      @case ('Button style — outline') {
        <ui-radio-group [(value)]="buttonValue" optionType="button" buttonVariant="outline" orientation="horizontal">
          <button ui-radio-button value="a" label="Hangzhou"></button>
          <button ui-radio-button value="b" label="Shanghai"></button>
          <button ui-radio-button value="c" label="Beijing"></button>
          <button ui-radio-button value="d" label="Chengdu"></button>
        </ui-radio-group>
      }
      @case ('Button style — solid') {
        <ui-radio-group [(value)]="solidValue" optionType="button" buttonVariant="solid" orientation="horizontal">
          <button ui-radio-button value="daily" label="Daily"></button>
          <button ui-radio-button value="weekly" label="Weekly"></button>
          <button ui-radio-button value="monthly" label="Monthly"></button>
        </ui-radio-group>
      }
      @case ('Button sizes') {
        <div class="space-y-3">
          <ui-radio-group [(value)]="buttonValue" optionType="button" size="small" orientation="horizontal">
            <button ui-radio-button value="a" label="Small"></button>
            <button ui-radio-button value="b" label="Button"></button>
          </ui-radio-group>
          <ui-radio-group [(value)]="buttonValue" optionType="button" size="middle" orientation="horizontal">
            <button ui-radio-button value="a" label="Middle"></button>
            <button ui-radio-button value="b" label="Button"></button>
          </ui-radio-group>
          <ui-radio-group [(value)]="buttonValue" optionType="button" size="large" orientation="horizontal">
            <button ui-radio-button value="a" label="Large"></button>
            <button ui-radio-button value="b" label="Button"></button>
          </ui-radio-group>
        </div>
      }
      @case ('Button group vertical') {
        <ui-radio-group [(value)]="solidValue" optionType="button" buttonVariant="solid" orientation="vertical">
          <button ui-radio-button value="daily" label="Daily digest"></button>
          <button ui-radio-button value="weekly" label="Weekly summary"></button>
          <button ui-radio-button value="monthly" label="Monthly report"></button>
        </ui-radio-group>
      }
      @case ('Button group with options') {
        <ui-radio-group
          [(value)]="solidValue"
          optionType="button"
          buttonVariant="solid"
          orientation="horizontal"
          [options]="planOptions"
        />
      }
      @case ('Group disabled') {
        <ui-radio-group [(value)]="disabledValue" disabled>
          <div class="flex items-center gap-2">
            <ui-radio-group-item id="d1" value="option1" />
            <label ui-label for="d1">Option 1</label>
          </div>
          <div class="flex items-center gap-2">
            <ui-radio-group-item id="d2" value="option2" />
            <label ui-label for="d2">Option 2</label>
          </div>
        </ui-radio-group>
      }
      @case ('Disabled button group') {
        <ui-radio-group [(value)]="buttonValue" optionType="button" disabled orientation="horizontal">
          <button ui-radio-button value="a" label="Enabled look"></button>
          <button ui-radio-button value="b" label="But disabled"></button>
        </ui-radio-group>
      }
    }
  `,
})
export class AngularRadioGroupDemoComponent {
  @Input() story = 'Default'

  readonly fruitOptions: { label: string; value: string; disabled?: boolean }[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry', disabled: true },
    { label: 'Date', value: 'date' },
  ]
  readonly planOptions: { label: string; value: string; disabled?: boolean }[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ]

  value = 'comfortable'
  buttonValue = 'b'
  solidValue = 'weekly'
  optionsValue = 'apple'
  disabledValue = 'option1'
}
