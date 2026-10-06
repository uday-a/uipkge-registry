import { Component, Input } from '@angular/core'
import { UiColorPickerComponent } from '../../../../../packages/registry-angular/components/color-picker/color-picker.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'

/** Angular demo for the color-picker page. Mirrors demos/react/color-picker.tsx story by story. */
@Component({
  selector: 'angular-color-picker-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiColorPickerComponent, UiLabelComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="space-y-3">
          <ui-color-picker [(value)]="color" />
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ color }}</code>
          </p>
        </div>
      }
      @case ('Side by side') {
        <div class="grid gap-6 sm:grid-cols-3">
          <div class="space-y-2">
            <p class="text-sm font-medium">Primary</p>
            <ui-color-picker [(value)]="primary" />
            <div class="h-8 rounded-md border" [style.background-color]="primary"></div>
          </div>
          <div class="space-y-2">
            <p class="text-sm font-medium">Accent</p>
            <ui-color-picker [(value)]="accent" />
            <div class="h-8 rounded-md border" [style.background-color]="accent"></div>
          </div>
          <div class="space-y-2">
            <p class="text-sm font-medium">Surface</p>
            <ui-color-picker [(value)]="surface" />
            <div class="h-8 rounded-md border" [style.background-color]="surface"></div>
          </div>
        </div>
      }
      @case ('Disabled') {
        <ui-color-picker [(value)]="locked" disabled />
      }
      @case ('Custom presets') {
        <div class="space-y-3">
          <ui-color-picker [(value)]="color" [presets]="customPresets" hideHexInput />
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ color }}</code>
          </p>
        </div>
      }
      @case ('In a form') {
        <div class="bg-card text-card-foreground max-w-sm space-y-3 rounded-lg border p-4">
          <div class="space-y-1">
            <label ui-label for="brand-color">Brand color</label>
            <p class="text-muted-foreground text-xs">Used on primary buttons, links, and active tabs.</p>
          </div>
          <ui-color-picker [(value)]="brand" />
          <div class="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <span class="size-4 rounded" [style.background-color]="brand"></span>
            <span>
              Preview: this button uses <code>{{ brand }}</code>
            </span>
          </div>
        </div>
      }
    }
  `,
})
export class AngularColorPickerDemoComponent {
  @Input() story = 'Default'
  color = '#3b82f6'
  primary = '#22c55e'
  accent = '#ec4899'
  surface = '#171717'
  locked = '#8b5cf6'
  brand = '#f97316'
  readonly customPresets = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
}
