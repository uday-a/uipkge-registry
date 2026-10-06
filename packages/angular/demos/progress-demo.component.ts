import { Component, DestroyRef, Input, inject, signal } from '@angular/core'
import { UiProgressComponent } from '../../../../../packages/registry-angular/components/progress/progress.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

/** Angular demo for the progress page. Mirrors demos/react/progress.tsx story by story. */
@Component({
  selector: 'angular-progress-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiProgressComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('With label') {
        <div class="max-w-md space-y-3">
          <div>
            <div class="text-muted-foreground mb-1.5 flex justify-between text-xs">
              <span>Loading…</span>
              <span>33%</span>
            </div>
            <ui-progress [value]="33" />
          </div>
          <div>
            <div class="text-muted-foreground mb-1.5 flex justify-between text-xs">
              <span>Almost done</span>
              <span>83%</span>
            </div>
            <ui-progress [value]="83" />
          </div>
        </div>
      }
      @case ('Discrete states') {
        <div class="max-w-md space-y-4">
          <div>
            <div class="text-muted-foreground mb-1.5 text-xs">0%</div>
            <ui-progress [value]="0" />
          </div>
          <div>
            <div class="text-muted-foreground mb-1.5 text-xs">50%</div>
            <ui-progress [value]="50" />
          </div>
          <div>
            <div class="text-muted-foreground mb-1.5 text-xs">100%</div>
            <ui-progress [value]="100" />
          </div>
        </div>
      }
      @case ('Multi-percentage row') {
        <div class="grid max-w-md gap-3">
          <ui-progress [value]="10" />
          <ui-progress [value]="30" />
          <ui-progress [value]="55" />
          <ui-progress [value]="78" />
          <ui-progress [value]="95" />
        </div>
      }
      @case ('Animated value') {
        <div class="max-w-md space-y-3">
          <div class="text-muted-foreground flex justify-between text-xs">
            <span>Uploading file…</span>
            <span class="tabular-nums">{{ animated() }}%</span>
          </div>
          <ui-progress [value]="animated()" />
        </div>
      }
      @case ('In a card') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>Storage</h3>
            <p ui-card-description>You're using 6.4 GB of 10 GB.</p>
          </div>
          <div ui-card-content>
            <ui-progress [value]="64" />
            <p class="text-muted-foreground mt-2 text-xs">3.6 GB remaining on your current plan.</p>
          </div>
        </div>
      }
    }
  `,
})
export class AngularProgressDemoComponent {
  @Input() story = 'With label'
  readonly animated = signal(0)

  constructor() {
    const id = window.setInterval(() => this.animated.update((v) => (v >= 100 ? 0 : v + 5)), 600)
    inject(DestroyRef).onDestroy(() => window.clearInterval(id))
  }
}
