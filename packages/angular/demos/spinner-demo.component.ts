import { Component, Input } from '@angular/core'
import { UiSpinnerComponent } from '../../../../../packages/registry-angular/components/spinner/spinner.component'

/** Angular demo for the spinner page. Mirrors demos/react/spinner.tsx story by story. */
@Component({
  selector: 'angular-spinner-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiSpinnerComponent],
  template: `
    @switch (story) {
      @case ('Sizes') {
        <div class="flex items-center gap-6">
          <ui-spinner />
          <ui-spinner class="size-6" />
          <ui-spinner class="text-primary size-8" />
          <ui-spinner class="size-10 text-emerald-500" />
        </div>
      }
      @case ('Inline') {
        <div class="flex items-center gap-2 text-sm"><ui-spinner class="size-4" /> Loading…</div>
      }
    }
  `,
})
export class AngularSpinnerDemoComponent {
  @Input() story = 'Sizes'
}
