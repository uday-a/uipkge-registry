import { Component, Input } from '@angular/core'
import {
  UiListComponent,
  UiListItemComponent,
  UiListItemMediaComponent,
  UiListItemContentComponent,
  UiListItemTitleComponent,
  UiListItemDescriptionComponent,
  UiListItemActionsComponent,
  UiListSubheaderComponent,
} from '../../../../../packages/registry-angular/components/list/list.component'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

const settings = [
  { id: 1, label: 'Profile', desc: 'Public profile and settings', icon: 'user' },
  { id: 2, label: 'Notifications', desc: 'Email and push preferences', icon: 'bell' },
  { id: 3, label: 'Billing', desc: 'Plan, payment, invoices', icon: 'credit-card' },
  { id: 4, label: 'Security', desc: '2FA, sessions, audit log', icon: 'lock' },
]

const docs = [
  { label: 'Getting started', href: '#' },
  { label: 'Components', href: '#' },
  { label: 'Theming', href: '#' },
  { label: 'CLI reference', href: '#' },
]

/** Angular demo for the list page. Mirrors demos/react/list.tsx story by story. */
@Component({
  selector: 'angular-list-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiListComponent,
    UiListItemComponent,
    UiListItemMediaComponent,
    UiListItemContentComponent,
    UiListItemTitleComponent,
    UiListItemDescriptionComponent,
    UiListItemActionsComponent,
    UiListSubheaderComponent,
    UiBadgeComponent,
    UiButtonComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <ul ui-list class="max-w-md">
          @for (i of settings; track i.id) {
            <li ui-list-item class="flex items-center gap-3">
              @switch (i.icon) {
                @case ('user') {
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
                    class="lucide lucide-user text-muted-foreground size-4"
                    aria-hidden="true"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
                @case ('bell') {
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
                    class="lucide lucide-bell text-muted-foreground size-4"
                    aria-hidden="true"
                  >
                    <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                    <path
                      d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
                    />
                  </svg>
                }
                @case ('credit-card') {
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
                    class="lucide lucide-credit-card text-muted-foreground size-4"
                    aria-hidden="true"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                  </svg>
                }
                @case ('lock') {
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
                    class="lucide lucide-lock text-muted-foreground size-4"
                    aria-hidden="true"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                }
              }
              <div class="flex-1">
                <p class="text-sm font-medium">{{ i.label }}</p>
                <p class="text-muted-foreground text-xs">{{ i.desc }}</p>
              </div>
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
                class="lucide lucide-chevron-right text-muted-foreground size-4"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </li>
          }
        </ul>
      }
      @case ('With subheaders') {
        <ul ui-list class="max-w-md">
          <div ui-list-subheader>Account</div>
          <li ui-list-item class="flex items-center gap-2">
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
              class="lucide lucide-user text-muted-foreground size-4"
              aria-hidden="true"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Profile
          </li>
          <li ui-list-item class="flex items-center gap-2">
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
              class="lucide lucide-lock text-muted-foreground size-4"
              aria-hidden="true"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Security
          </li>
          <div ui-list-subheader>Workspace</div>
          <li ui-list-item class="flex items-center gap-2">
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
              class="lucide lucide-bell text-muted-foreground size-4"
              aria-hidden="true"
            >
              <path d="M10.268 21a2 2 0 0 0 3.464 0" />
              <path
                d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
              />
            </svg>
            Notifications
          </li>
          <li ui-list-item class="flex items-center gap-2">
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
              class="lucide lucide-credit-card text-muted-foreground size-4"
              aria-hidden="true"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
            </svg>
            Billing
          </li>
        </ul>
      }
      @case ('Active state') {
        <ul ui-list class="max-w-md">
          <li ui-list-item>Inbox</li>
          <li ui-list-item active>Drafts</li>
          <li ui-list-item>Sent</li>
          <li ui-list-item>Archive</li>
          <li ui-list-item>Trash</li>
        </ul>
      }
      @case ('Disabled state') {
        <ul ui-list class="max-w-md">
          <li ui-list-item>Available</li>
          <li ui-list-item disabled>Unavailable (disabled)</li>
          <li ui-list-item>Available</li>
          <li ui-list-item disabled>Coming soon</li>
        </ul>
      }
      @case ('Anchor links') {
        <ul ui-list class="max-w-md">
          @for (d of docs; track d.label) {
            <a ui-list-item [href]="d.href" class="flex items-center justify-between">
              <span class="text-sm">{{ d.label }}</span>
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
                class="lucide lucide-external-link text-muted-foreground size-3.5"
                aria-hidden="true"
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
            </a>
          }
        </ul>
      }
      @case ('Structured Item Rows') {
        <ul ui-list class="max-w-md space-y-1">
          <li ui-list-item class="border-border hover:bg-muted/40 rounded-lg border p-2.5">
            <div ui-list-item-media>
              <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
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
                  class="lucide lucide-sparkles size-4"
                  aria-hidden="true"
                >
                  <path
                    d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
                  />
                  <path d="M20 2v4" />
                  <path d="M22 4h-4" />
                  <circle cx="4" cy="20" r="2" />
                </svg>
              </div>
            </div>
            <div ui-list-item-content>
              <div ui-list-item-title>AI Copilot Assistant</div>
              <div ui-list-item-description>Automatic smart recommendations &amp; summaries</div>
            </div>
            <div ui-list-item-actions>
              <span ui-badge variant="secondary">Pro</span>
              <button ui-button size="xs" variant="outline">Configure</button>
            </div>
          </li>

          <li ui-list-item class="border-border hover:bg-muted/40 rounded-lg border p-2.5">
            <div ui-list-item-media>
              <div class="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-full">
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
                  class="lucide lucide-lock size-4"
                  aria-hidden="true"
                >
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>
            <div ui-list-item-content>
              <div ui-list-item-title>Two-Factor Authentication</div>
              <div ui-list-item-description>Enabled via authenticator app</div>
            </div>
            <div ui-list-item-actions>
              <span ui-badge variant="outline" class="text-success border-success/30"> Active </span>
            </div>
          </li>
        </ul>
      }
    }
  `,
})
export class AngularListDemoComponent {
  @Input() story = 'Default'
  readonly settings = settings
  readonly docs = docs
}
