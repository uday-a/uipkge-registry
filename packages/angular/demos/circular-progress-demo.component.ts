import { Component, DestroyRef, Input, inject, signal } from '@angular/core'
import { UiCircularProgressComponent } from '../../../../../packages/registry-angular/components/circular-progress/circular-progress.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

/** Angular demo for the circular-progress page. Mirrors demos/react/circular-progress.tsx story by story. */
@Component({
  selector: 'angular-circular-progress-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiCircularProgressComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Dashboard stat card') {
        <div class="grid max-w-md grid-cols-2 gap-4">
          <div ui-card>
            <div ui-card-content class="flex items-center gap-4 p-5">
              <ui-circular-progress [value]="78" size="lg" showValue />
              <div>
                <p class="text-2xl font-semibold tabular-nums">78%</p>
                <p class="text-muted-foreground text-xs">Monthly target</p>
              </div>
            </div>
          </div>
          <div ui-card>
            <div ui-card-content class="flex items-center gap-4 p-5">
              <ui-circular-progress [value]="42" size="lg" color="#3b82f6" trackColor="#dbeafe" showValue />
              <div>
                <p class="text-2xl font-semibold tabular-nums">42%</p>
                <p class="text-muted-foreground text-xs">Quarterly goal</p>
              </div>
            </div>
          </div>
        </div>
      }
      @case ('File upload progress') {
        <div ui-card class="max-w-md">
          <div ui-card-content class="flex items-center gap-4 p-5">
            <ui-circular-progress
              [value]="uploadProgress()"
              size="lg"
              [color]="uploadProgress() >= 100 ? '#22c55e' : undefined"
            >
              @if (uploadProgress() >= 100) {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-check size-7 text-emerald-500"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              } @else {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-loader-circle text-muted-foreground size-6 animate-spin"
                  aria-hidden="true"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              }
            </ui-circular-progress>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-upload text-muted-foreground size-4"
                  aria-hidden="true"
                >
                  <path d="M12 3v12" />
                  <path d="m17 8-5-5-5 5" />
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                </svg>
                <p class="truncate text-sm font-medium">quarterly-report.xlsx</p>
              </div>
              <p class="text-muted-foreground mt-1 text-xs">
                {{ uploadProgress() >= 100 ? 'Upload complete' : 'Uploading… ' + uploadProgress() + '%' }}
              </p>
            </div>
          </div>
        </div>
      }
      @case ('Size variants') {
        <div class="flex items-end gap-8">
          <div class="flex flex-col items-center gap-2">
            <ui-circular-progress [value]="60" size="sm" showValue />
            <span class="text-muted-foreground text-xs">sm</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ui-circular-progress [value]="60" size="default" showValue />
            <span class="text-muted-foreground text-xs">default</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ui-circular-progress [value]="60" size="lg" showValue />
            <span class="text-muted-foreground text-xs">lg</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ui-circular-progress [value]="60" [size]="120" [thickness]="12" showValue />
            <span class="text-muted-foreground text-xs">custom 120px</span>
          </div>
        </div>
      }
      @case ('Status colors') {
        <div class="flex items-center gap-8">
          <div class="flex flex-col items-center gap-2">
            <ui-circular-progress [value]="100" color="#22c55e" trackColor="#dcfce7" showValue />
            <span class="text-muted-foreground text-xs">Complete</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ui-circular-progress [value]="35" color="#ef4444" trackColor="#fee2e2" showValue />
            <span class="text-muted-foreground text-xs">At risk</span>
          </div>
          <div class="flex flex-col items-center gap-2">
            <ui-circular-progress [value]="65" color="#3b82f6" trackColor="#dbeafe" showValue />
            <span class="text-muted-foreground text-xs">In progress</span>
          </div>
        </div>
      }
      @case ('Indeterminate spinner') {
        <div class="flex items-center gap-8">
          <ui-circular-progress indeterminate size="sm" />
          <ui-circular-progress indeterminate size="default" />
          <ui-circular-progress indeterminate size="lg" />
        </div>
      }
      @case ('Task checklist') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title class="text-base">Onboarding progress</h3>
          </div>
          <div ui-card-content class="flex items-center gap-5">
            <ui-circular-progress [value]="67" size="lg">
              <span class="text-foreground text-sm font-semibold tabular-nums">4/6</span>
            </ui-circular-progress>
            <ul class="text-muted-foreground flex-1 space-y-1.5 text-sm">
              <li class="text-foreground flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-check size-4 text-emerald-500"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Create account
              </li>
              <li class="text-foreground flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-check size-4 text-emerald-500"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Verify email
              </li>
              <li class="text-foreground flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-check size-4 text-emerald-500"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Set up workspace
              </li>
              <li class="text-foreground flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-check size-4 text-emerald-500"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                Invite teammates
              </li>
              <li>Connect calendar</li>
              <li>Complete profile</li>
            </ul>
          </div>
        </div>
      }
    }
  `,
})
export class AngularCircularProgressDemoComponent {
  @Input() story = 'Dashboard stat card'
  readonly uploadProgress = signal(0)

  constructor() {
    const id = window.setInterval(() => this.uploadProgress.update((v) => (v >= 100 ? 0 : v + 4)), 400)
    inject(DestroyRef).onDestroy(() => window.clearInterval(id))
  }
}
