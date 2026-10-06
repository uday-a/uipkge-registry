import { Component, Input, signal } from '@angular/core'
import { UiLabeledValueComponent } from '../../../../../packages/registry-angular/components/labeled-value/labeled-value.component'
import {
  UiCardComponent,
  UiCardContentComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import {
  UiAvatarComponent,
  UiAvatarFallbackComponent,
} from '../../../../../packages/registry-angular/components/avatar/avatar.component'

const apiKey = 'mock_key_8f3a92c1d4e5b6a7f8e9d0c1b2a3'

/** Angular demo for the labeled-value page. Mirrors demos/react/labeled-value.tsx story by story. */
@Component({
  selector: 'angular-labeled-value-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiLabeledValueComponent,
    UiCardComponent,
    UiCardContentComponent,
    UiBadgeComponent,
    UiButtonComponent,
    UiAvatarComponent,
    UiAvatarFallbackComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default grid') {
        <div class="grid max-w-2xl gap-3 sm:grid-cols-3">
          <div ui-labeled-value label="Status" value="Active"></div>
          <div ui-labeled-value label="Plan" value="Pro · Annual"></div>
          <div ui-labeled-value label="Renewal" value="Sep 12, 2026"></div>
          <div ui-labeled-value label="Owner" value="Admin User"></div>
          <div ui-labeled-value label="Members" value="24"></div>
          <div ui-labeled-value label="Created" value="Mar 4, 2025"></div>
        </div>
      }
      @case ('Vertical stack') {
        <div ui-card class="max-w-xs">
          <div ui-card-content class="space-y-3 p-6">
            <div ui-labeled-value label="Account ID" value="acc_92f8a1b4"></div>
            <div ui-labeled-value label="Plan" value="Enterprise"></div>
            <div ui-labeled-value label="Seats" value="120 / 200"></div>
            <div ui-labeled-value label="Region" value="us-east-1"></div>
          </div>
        </div>
      }
      @case ('Custom value via slot') {
        <div class="grid max-w-2xl gap-3 sm:grid-cols-2">
          <div ui-labeled-value label="Status">
            <span ui-badge>Active</span>
          </div>
          <div ui-labeled-value label="Health">
            <span ui-badge class="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Healthy</span>
          </div>
          <div ui-labeled-value label="Owner">
            <div class="flex items-center gap-2">
              <span ui-avatar class="size-5">
                <span ui-avatar-fallback class="text-xs">UA</span>
              </span>
              <span class="text-sm font-medium">Uday A.</span>
            </div>
          </div>
          <div ui-labeled-value label="Contact">
            <div class="flex items-center gap-1.5">
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
                class="lucide lucide-mail text-muted-foreground size-3.5"
                aria-hidden="true"
              >
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>
              <span class="text-sm font-medium">team@acme.dev</span>
            </div>
          </div>
        </div>
      }
      @case ('Truncated long values') {
        <div ui-card class="max-w-md">
          <div ui-card-content class="space-y-3 p-6">
            <div ui-labeled-value label="Webhook URL">
              <span class="max-w-[60%] truncate text-sm font-medium">
                https://hooks.example.com/v1/incoming/very-long-id-9f8a2b1c4d5e6f7
              </span>
            </div>
            <div ui-labeled-value label="User agent">
              <span class="max-w-[60%] truncate text-sm font-medium">
                Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) AppleWebKit/605.1.15
              </span>
            </div>
          </div>
        </div>
      }
      @case ('With copy-button trailing') {
        <div ui-card class="max-w-md">
          <div ui-card-content class="space-y-3 p-6">
            <div ui-labeled-value label="API key">
              <div class="flex items-center gap-2">
                <code class="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{{ apiKey.slice(0, 12) }}…</code>
                <button ui-button variant="ghost" size="icon" class="size-7" (click)="copy()">
                  @if (copied()) {
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
                      class="lucide lucide-check size-3.5 text-emerald-600"
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
                      class="lucide lucide-copy size-3.5"
                      aria-hidden="true"
                    >
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                  }
                </button>
              </div>
            </div>
            <div ui-labeled-value label="Project ID">
              <div class="flex items-center gap-2">
                <code class="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">prj_4a2b9c8d</code>
                <button ui-button variant="ghost" size="icon" class="size-7">
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
                    class="lucide lucide-copy size-3.5"
                    aria-hidden="true"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    }
  `,
})
export class AngularLabeledValueDemoComponent {
  @Input() story = 'Default grid'
  readonly apiKey = apiKey
  readonly copied = signal(false)

  copy(): void {
    void navigator.clipboard?.writeText(apiKey)
    this.copied.set(true)
    setTimeout(() => this.copied.set(false), 1500)
  }
}
