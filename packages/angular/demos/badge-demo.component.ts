import { Component, Input } from '@angular/core'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

/** Angular demo for the badge page. Mirrors demos/react/badge.tsx story by story. */
@Component({
  selector: 'angular-badge-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiBadgeComponent, UiButtonComponent],
  template: `
    @switch (story) {
      @case ('Variants') {
        <div class="flex flex-wrap gap-2">
          <span ui-badge>Default</span>
          <span ui-badge variant="secondary">Secondary</span>
          <span ui-badge variant="outline">Outline</span>
          <span ui-badge variant="destructive">Destructive</span>
          <span ui-badge variant="success">Success</span>
          <span ui-badge variant="warning">Warning</span>
          <span ui-badge variant="info">Info</span>
        </div>
      }
      @case ('With icon') {
        <div class="flex flex-wrap gap-2">
          <span ui-badge variant="success"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-check size-3"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Verified</span
          >
          <span ui-badge variant="warning"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-clock size-3"
              aria-hidden="true"
            >
              <path d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Pending</span
          >
          <span ui-badge variant="info"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-zap size-3"
              aria-hidden="true"
            >
              <path
                d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
              />
            </svg>
            Pro</span
          >
          <span ui-badge variant="destructive"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-x size-3"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
            Failed</span
          >
        </div>
      }
      @case ('In context') {
        <div class="flex flex-wrap items-center gap-3 text-sm">
          <span>Notifications</span>
          <span ui-badge>3 new</span>
          <span>·</span>
          <span>Status</span>
          <span ui-badge variant="success">Active</span>
          <span>·</span>
          <span>Plan</span>
          <span ui-badge variant="info">Pro</span>
        </div>
      }
      @case ('Notification dots on icons') {
        <div class="flex items-center gap-4">
          <div class="relative">
            <button ui-button variant="ghost" size="icon" aria-label="Notifications">
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
                class="lucide lucide-bell"
                aria-hidden="true"
              >
                <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                <path
                  d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
                />
              </svg>
            </button>
            <span ui-badge variant="destructive" class="absolute -top-1 -right-1 size-4 rounded-full p-0 text-xs"
              >5</span
            >
          </div>

          <div class="relative">
            <button ui-button variant="ghost" size="icon" aria-label="Inbox">
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
                class="lucide lucide-inbox"
                aria-hidden="true"
              >
                <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                <path
                  d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
                />
              </svg>
            </button>
            <span
              ui-badge
              variant="success"
              class="absolute -top-1 -right-1 size-2.5 rounded-full p-0"
              aria-hidden="true"
            ></span>
          </div>

          <div class="relative">
            <button ui-button variant="ghost" size="icon" aria-label="Mail">
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
                class="lucide lucide-mail"
                aria-hidden="true"
              >
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>
            </button>
            <span ui-badge class="absolute -top-1 -right-1 h-4 min-w-4 rounded-full px-1 text-xs">99+</span>
          </div>
        </div>
      }
      @case ('Truncation') {
        <div class="flex flex-wrap items-center gap-2">
          <span ui-badge variant="outline"><span class="max-w-40 truncate">production-eu-west-1-cluster</span></span>
          <span ui-badge variant="secondary"><span class="max-w-32 truncate">kubernetes-deployment-status</span></span>
        </div>
      }
      @case ('Wrapped labels') {
        <div class="max-w-xs space-y-2">
          <span ui-badge variant="warning" wrap>Deployment paused — pending approval from the platform team</span>
          <span ui-badge variant="success" wrap>All 14 checks passed across build, test, and security gates</span>
        </div>
      }
      @case ('Sizes via class override') {
        <div class="flex flex-wrap items-center gap-2">
          <span ui-badge class="px-1.5 py-0 text-xs">XS</span>
          <span ui-badge>Default</span>
          <span ui-badge class="px-3 py-1 text-sm">Large</span>
          <span ui-badge class="px-4 py-1.5 text-base">Extra-large</span>
        </div>
      }
    }
  `,
})
export class AngularBadgeDemoComponent {
  @Input() story = 'Variants'
}
