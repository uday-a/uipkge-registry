import { Component, Input } from '@angular/core'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'
import { UiInputComponent } from '../../../../../packages/registry-angular/components/input/input.component'

/** Angular demo for the label page. Mirrors demos/react/label.tsx story by story. */
@Component({
  selector: 'angular-label-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiLabelComponent, UiInputComponent],
  template: `
    @switch (story) {
      @case ('With input') {
        <div class="grid max-w-sm gap-2">
          <label ui-label for="name">Name</label>
          <ui-input id="name" placeholder="Jane Doe" />
        </div>
      }
      @case ('Required and invalid') {
        <div class="grid max-w-sm gap-2">
          <label ui-label for="email" class="text-destructive">Email <span aria-hidden="true">*</span></label>
          <ui-input id="email" type="email" aria-invalid="true" />
          <p class="text-destructive text-xs">Required field</p>
        </div>
      }
      @case ('Inline with checkbox') {
        <div class="flex max-w-sm items-center gap-2">
          <input id="agree" type="checkbox" class="accent-primary size-4" />
          <label ui-label for="agree" class="text-muted-foreground">Inline label next to checkbox</label>
        </div>
      }
    }
  `,
})
export class AngularLabelDemoComponent {
  @Input() story = 'With input'
}
