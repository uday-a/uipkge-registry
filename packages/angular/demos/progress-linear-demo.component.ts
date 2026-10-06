import { Component, Input } from '@angular/core'
import { UiProgressLinearComponent } from '../../../../../packages/registry-angular/components/progress-linear/progress-linear.component'

/** Angular demo for the progress-linear page. Mirrors demos/react/progress-linear.tsx story by story. */
@Component({
  selector: 'angular-progress-linear-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiProgressLinearComponent],
  template: `
    @switch (story) {
      @case ('Determinate') {
        <div class="max-w-md">
          <ui-progress-linear [value]="60" />
        </div>
      }
      @case ('Indeterminate') {
        <div class="max-w-md">
          <ui-progress-linear indeterminate />
        </div>
      }
      @case ('Buffer') {
        <div class="max-w-md">
          <ui-progress-linear [value]="35" [buffer]="65" />
        </div>
      }
      @case ('Stream') {
        <div class="max-w-md">
          <ui-progress-linear [value]="40" stream [buffer]="70" />
        </div>
      }
      @case ('Striped') {
        <div class="max-w-md space-y-3">
          <ui-progress-linear [value]="70" striped />
          <ui-progress-linear [value]="45" striped color="var(--info)" />
        </div>
      }
      @case ('Color tokens') {
        <div class="max-w-md space-y-3">
          <ui-progress-linear [value]="60" color="var(--success)" />
          <ui-progress-linear [value]="40" color="var(--warning)" />
          <ui-progress-linear [value]="20" color="var(--destructive)" />
          <ui-progress-linear [value]="80" color="var(--info)" />
        </div>
      }
      @case ('Heights') {
        <div class="max-w-md space-y-3">
          <ui-progress-linear [value]="60" [height]="2" />
          <ui-progress-linear [value]="60" [height]="4" />
          <ui-progress-linear [value]="60" [height]="8" />
          <ui-progress-linear [value]="60" [height]="14" rounded="full" />
        </div>
      }
      @case ('Reverse') {
        <div class="max-w-md">
          <ui-progress-linear [value]="35" reverse />
        </div>
      }
    }
  `,
})
export class AngularProgressLinearDemoComponent {
  @Input() story = 'Determinate'
}
