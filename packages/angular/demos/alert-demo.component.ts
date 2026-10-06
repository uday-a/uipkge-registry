import { Component, Input, signal } from '@angular/core'
import {
  UiAlertComponent,
  UiAlertDescriptionComponent,
  UiAlertTitleComponent,
} from '../../../../../packages/registry-angular/components/alert/alert.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

/** Angular demo for the alert page. Mirrors demos/react/alert.tsx story by story. */
@Component({
  selector: 'angular-alert-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiAlertComponent, UiAlertTitleComponent, UiAlertDescriptionComponent, UiButtonComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div ui-alert>
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
            class="lucide lucide-terminal size-4"
            aria-hidden="true"
          >
            <path d="M12 19h8" />
            <path d="m4 17 6-6-6-6" />
          </svg>
          <h5 ui-alert-title>Heads up!</h5>
          <div ui-alert-description>You can add components to your app using the CLI.</div>
        </div>
      }
      @case ('Destructive') {
        <div ui-alert variant="destructive">
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
            class="lucide lucide-circle-alert size-4"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <h5 ui-alert-title>Error</h5>
          <div ui-alert-description>Your session has expired. Please log in again.</div>
        </div>
      }
      @case ('Tinted icons') {
        <div class="space-y-3">
          <div ui-alert>
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
              class="lucide lucide-info text-info size-4"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <h5 ui-alert-title>Information</h5>
            <div ui-alert-description>Read this carefully — it explains a non-obvious behavior.</div>
          </div>
          <div ui-alert>
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
              class="lucide lucide-circle-check text-success size-4"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <h5 ui-alert-title>Success</h5>
            <div ui-alert-description>Your changes have been saved.</div>
          </div>
          <div ui-alert>
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
              class="lucide lucide-triangle-alert text-warning size-4"
              aria-hidden="true"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            <h5 ui-alert-title>Warning</h5>
            <div ui-alert-description>This action requires manual review.</div>
          </div>
        </div>
      }
      @case ('With action button') {
        <div ui-alert variant="destructive">
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
            class="lucide lucide-circle-alert size-4"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" x2="12" y1="8" y2="12" />
            <line x1="12" x2="12.01" y1="16" y2="16" />
          </svg>
          <h5 ui-alert-title>Payment failed</h5>
          <div ui-alert-description class="flex items-center justify-between gap-3">
            <span>The card on file was declined. Try again or use a different method.</span>
            <button ui-button size="sm" variant="outline" class="shrink-0 gap-1.5">
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
                class="lucide lucide-refresh-cw size-3.5"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
              Retry
            </button>
          </div>
        </div>
      }
      @case ('Dismissible') {
        <div class="space-y-2">
          @if (!dismissed()) {
            <div ui-alert class="relative pr-12">
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
                class="lucide lucide-info text-info size-4"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <h5 ui-alert-title>New release available</h5>
              <div ui-alert-description>v2.1.0 ships with the new theming engine. See the changelog.</div>
              <button
                ui-button
                variant="ghost"
                size="icon-sm"
                class="text-muted-foreground hover:text-foreground absolute top-2 right-2"
                aria-label="Dismiss"
                (click)="dismissed.set(true)"
              >
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
                  class="lucide lucide-x size-3.5"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          }
          @if (dismissed()) {
            <button ui-button size="sm" variant="outline" (click)="dismissed.set(false)">Restore alert</button>
          }
        </div>
      }
    }
  `,
})
export class AngularAlertDemoComponent {
  @Input() story = 'Default'
  readonly dismissed = signal(false)
}
