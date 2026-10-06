import { Component, Input } from '@angular/core'
import {
  UiCheckboxComponent,
  UiCheckboxGroupComponent,
} from '../../../../../packages/registry-angular/components/checkbox/checkbox.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'

const fruits = ['Apple', 'Pear', 'Orange']
const allFruits = fruits.map((f) => f.toLowerCase())

/** Angular demo for the checkbox page. Mirrors demos/react/checkbox.tsx story by story. */
@Component({
  selector: 'angular-checkbox-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiCheckboxComponent, UiCheckboxGroupComponent, UiLabelComponent],
  template: `
    @switch (story) {
      @case ('States') {
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <ui-checkbox id="c1" [checked]="checked" (checkedChange)="checked = $event === true" />
            <label ui-label for="c1"
              >Accept terms (live: <code>{{ checked }}</code
              >)</label
            >
          </div>
          <div class="flex items-center gap-2">
            <ui-checkbox id="c2" />
            <label ui-label for="c2">Unchecked</label>
          </div>
          <div class="flex items-center gap-2">
            <ui-checkbox id="c3" disabled />
            <label ui-label for="c3" class="text-muted-foreground">Disabled</label>
          </div>
          <div class="flex items-center gap-2">
            <ui-checkbox id="c4" defaultChecked disabled />
            <label ui-label for="c4" class="text-muted-foreground">Disabled checked</label>
          </div>
        </div>
      }
      @case ('In a list') {
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <ui-checkbox id="t1" defaultChecked />
            <label ui-label for="t1">Subscribe to newsletter</label>
          </div>
          <div class="flex items-center gap-2">
            <ui-checkbox id="t2" />
            <label ui-label for="t2">Allow analytics</label>
          </div>
          <div class="flex items-center gap-2">
            <ui-checkbox id="t3" />
            <label ui-label for="t3">Receive marketing emails</label>
          </div>
        </div>
      }
      @case ('Group with options') {
        <ui-checkbox-group [(value)]="selectedOptions" [options]="options" label="Select fruits" />
      }
      @case ('Check all / Uncheck all') {
        <div class="space-y-2">
          <ui-checkbox
            [checked]="allChecked"
            [indeterminate]="isIndeterminate"
            label="Check all"
            (checkedChange)="toggleAll()"
          />
          <div class="ml-6 space-y-2">
            <ui-checkbox-group [(value)]="selectedFruits">
              @for (fruit of fruits; track fruit) {
                <ui-checkbox [value]="fruit.toLowerCase()" [label]="fruit" />
              }
            </ui-checkbox-group>
          </div>
        </div>
      }
      @case ('Group disabled') {
        <ui-checkbox-group [defaultValue]="['b']" disabled [options]="abc" label="Disabled group" />
      }
      @case ('Group inline layout') {
        <ui-checkbox-group [defaultValue]="['a', 'c']" inline [options]="abc" />
      }
      @case ('Group with name') {
        <ui-checkbox-group [defaultValue]="['a']" name="my-checkbox-group" [options]="ab" label="Named group" />
      }
    }
  `,
})
export class AngularCheckboxDemoComponent {
  @Input() story = 'States'

  readonly fruits = fruits
  readonly options: { label: string; value: string; disabled?: boolean }[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Pear', value: 'pear' },
    { label: 'Orange', value: 'orange', disabled: true },
  ]
  readonly abc: { label: string; value: string; disabled?: boolean }[] = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
  ]
  readonly ab: { label: string; value: string; disabled?: boolean }[] = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
  ]

  checked = true
  selectedOptions = ['apple']
  selectedFruits = ['apple']

  get allChecked(): boolean {
    return this.selectedFruits.length === fruits.length
  }

  get isIndeterminate(): boolean {
    return this.selectedFruits.length > 0 && this.selectedFruits.length < fruits.length
  }

  toggleAll(): void {
    this.selectedFruits = this.allChecked ? [] : [...allFruits]
  }
}
