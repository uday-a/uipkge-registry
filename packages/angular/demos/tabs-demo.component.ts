import { Component, Input } from '@angular/core'
import {
  UiTabsComponent,
  UiTabsContentComponent,
  UiTabsListComponent,
  UiTabsTriggerComponent,
} from '../../../../../packages/registry-angular/components/tabs/tabs.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

/** Angular demo for the tabs page. Mirrors demos/react/tabs.tsx story by story. */
@Component({
  selector: 'angular-tabs-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiTabsComponent,
    UiTabsListComponent,
    UiTabsTriggerComponent,
    UiTabsContentComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <div ui-tabs defaultValue="account" class="max-w-md">
          <div ui-tabs-list>
            <button ui-tabs-trigger value="account">Account</button>
            <button ui-tabs-trigger value="password">Password</button>
            <button ui-tabs-trigger value="team">Team</button>
          </div>
          <div ui-tabs-content value="account">
            <p class="p-3 text-sm">Tabs let users switch between related sections without navigation.</p>
          </div>
          <div ui-tabs-content value="password">
            <p class="text-muted-foreground p-3 text-sm">Password fields go here.</p>
          </div>
          <div ui-tabs-content value="team">
            <p class="text-muted-foreground p-3 text-sm">Team management UI goes here.</p>
          </div>
        </div>
      }
      @case ('Overflow scroll') {
        <div ui-tabs defaultValue="overview" class="max-w-sm">
          <div ui-tabs-list>
            <button ui-tabs-trigger value="overview">Overview</button>
            <button ui-tabs-trigger value="deployments">Deployments</button>
            <button ui-tabs-trigger value="observability">Observability</button>
            <button ui-tabs-trigger value="access-control">Access control</button>
            <button ui-tabs-trigger value="billing">Billing</button>
          </div>
          <div ui-tabs-content value="overview">
            <p class="p-3 text-sm">Scroll the tab row — every trigger stays reachable.</p>
          </div>
          <div ui-tabs-content value="billing">
            <p class="text-muted-foreground p-3 text-sm">Billing settings go here.</p>
          </div>
        </div>
      }
      @case ('Vertical orientation') {
        <div ui-tabs defaultValue="profile" orientation="vertical" class="max-w-xl">
          <div ui-tabs-list class="w-48 shrink-0">
            <button ui-tabs-trigger value="profile">
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
                class="lucide lucide-user size-4"
                aria-hidden="true"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile
            </button>
            <button ui-tabs-trigger value="notifications">
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
                class="lucide lucide-bell size-4"
                aria-hidden="true"
              >
                <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                <path
                  d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
                />
              </svg>
              Notifications
            </button>
            <button ui-tabs-trigger value="security">
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
                class="lucide lucide-shield size-4"
                aria-hidden="true"
              >
                <path
                  d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                />
              </svg>
              Security
            </button>
            <button ui-tabs-trigger value="billing">
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
                class="lucide lucide-credit-card size-4"
                aria-hidden="true"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              Billing
            </button>
          </div>
          <div ui-tabs-content value="profile">
            <p class="text-sm">Update your profile information and avatar.</p>
          </div>
          <div ui-tabs-content value="notifications">
            <p class="text-sm">Manage email and push notification preferences.</p>
          </div>
          <div ui-tabs-content value="security">
            <p class="text-sm">Configure two-factor authentication and active sessions.</p>
          </div>
          <div ui-tabs-content value="billing">
            <p class="text-sm">View invoices and update your payment method.</p>
          </div>
        </div>
      }
      @case ('Underline variant') {
        <div ui-tabs defaultValue="overview" class="max-w-xl">
          <div ui-tabs-list variant="underline">
            <button ui-tabs-trigger value="overview" variant="underline">Overview</button>
            <button ui-tabs-trigger value="analytics" variant="underline">Analytics</button>
            <button ui-tabs-trigger value="reports" variant="underline">Reports</button>
            <button ui-tabs-trigger value="settings" variant="underline">Settings</button>
          </div>
          <div ui-tabs-content value="overview">
            <p class="text-muted-foreground p-3 text-sm">Overview content.</p>
          </div>
          <div ui-tabs-content value="analytics">
            <p class="text-muted-foreground p-3 text-sm">Analytics content.</p>
          </div>
          <div ui-tabs-content value="reports">
            <p class="text-muted-foreground p-3 text-sm">Reports content.</p>
          </div>
          <div ui-tabs-content value="settings">
            <p class="text-muted-foreground p-3 text-sm">Settings content.</p>
          </div>
        </div>
      }
      @case ('Pill variant') {
        <div ui-tabs defaultValue="day" class="max-w-md">
          <div ui-tabs-list variant="pill">
            <button ui-tabs-trigger value="day" variant="pill">Day</button>
            <button ui-tabs-trigger value="week" variant="pill">Week</button>
            <button ui-tabs-trigger value="month" variant="pill">Month</button>
            <button ui-tabs-trigger value="year" variant="pill">Year</button>
          </div>
          <div ui-tabs-content value="day">
            <p class="text-muted-foreground p-3 text-sm">Daily breakdown.</p>
          </div>
          <div ui-tabs-content value="week">
            <p class="text-muted-foreground p-3 text-sm">Weekly trends.</p>
          </div>
          <div ui-tabs-content value="month">
            <p class="text-muted-foreground p-3 text-sm">Monthly summary.</p>
          </div>
          <div ui-tabs-content value="year">
            <p class="text-muted-foreground p-3 text-sm">Yearly review.</p>
          </div>
        </div>
      }
      @case ('With disabled tab') {
        <div ui-tabs defaultValue="overview" class="max-w-md">
          <div ui-tabs-list>
            <button ui-tabs-trigger value="overview">Overview</button>
            <button ui-tabs-trigger value="analytics">Analytics</button>
            <button ui-tabs-trigger value="reports" disabled>Reports (pro)</button>
            <button ui-tabs-trigger value="settings">Settings</button>
          </div>
          <div ui-tabs-content value="overview">
            <p class="text-muted-foreground p-3 text-sm">Overview content.</p>
          </div>
          <div ui-tabs-content value="analytics">
            <p class="text-muted-foreground p-3 text-sm">Analytics content.</p>
          </div>
          <div ui-tabs-content value="settings">
            <p class="text-muted-foreground p-3 text-sm">Settings content.</p>
          </div>
        </div>
      }
      @case ('Many tabs (overflow)') {
        <div ui-tabs defaultValue="general" class="w-full max-w-2xl">
          <div class="overflow-x-auto">
            <div ui-tabs-list class="w-max">
              <button ui-tabs-trigger value="general">
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
                  class="lucide lucide-settings size-4"
                  aria-hidden="true"
                >
                  <path
                    d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                General
              </button>
              <button ui-tabs-trigger value="users">
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
                  class="lucide lucide-users size-4"
                  aria-hidden="true"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                Users
              </button>
              <button ui-tabs-trigger value="security">
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
                Security
              </button>
              <button ui-tabs-trigger value="email">
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
                  class="lucide lucide-mail size-4"
                  aria-hidden="true"
                >
                  <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                </svg>
                Email
              </button>
              <button ui-tabs-trigger value="billing">
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
                  class="lucide lucide-credit-card size-4"
                  aria-hidden="true"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                Billing
              </button>
              <button ui-tabs-trigger value="locale">
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
                  class="lucide lucide-globe size-4"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                Locale
              </button>
              <button ui-tabs-trigger value="metrics">
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
                  class="lucide lucide-chart-column size-4"
                  aria-hidden="true"
                >
                  <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                  <path d="M18 17V9" />
                  <path d="M13 17V5" />
                  <path d="M8 17v-3" />
                </svg>
                Metrics
              </button>
              <button ui-tabs-trigger value="audit">
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
                  class="lucide lucide-activity size-4"
                  aria-hidden="true"
                >
                  <path
                    d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
                  />
                </svg>
                Audit
              </button>
            </div>
          </div>
          <div ui-tabs-content value="general">
            <p class="text-muted-foreground p-3 text-sm">General settings.</p>
          </div>
          <div ui-tabs-content value="users">
            <p class="text-muted-foreground p-3 text-sm">User management.</p>
          </div>
          <div ui-tabs-content value="security">
            <p class="text-muted-foreground p-3 text-sm">Security policies.</p>
          </div>
          <div ui-tabs-content value="email">
            <p class="text-muted-foreground p-3 text-sm">Email configuration.</p>
          </div>
          <div ui-tabs-content value="billing">
            <p class="text-muted-foreground p-3 text-sm">Billing details.</p>
          </div>
          <div ui-tabs-content value="locale">
            <p class="text-muted-foreground p-3 text-sm">Locale and timezone.</p>
          </div>
          <div ui-tabs-content value="metrics">
            <p class="text-muted-foreground p-3 text-sm">Metrics dashboard.</p>
          </div>
          <div ui-tabs-content value="audit">
            <p class="text-muted-foreground p-3 text-sm">Audit log.</p>
          </div>
        </div>
      }
      @case ('Card-wrapped content') {
        <div ui-tabs defaultValue="account" class="max-w-md">
          <div ui-tabs-list>
            <button ui-tabs-trigger value="account">Account</button>
            <button ui-tabs-trigger value="password">Password</button>
            <button ui-tabs-trigger value="team">Team</button>
          </div>
          <div ui-tabs-content value="account">
            <div ui-card>
              <div ui-card-header>
                <h3 ui-card-title>Account</h3>
                <p ui-card-description>Make changes to your account here.</p>
              </div>
              <div ui-card-content>
                <p class="text-sm">Tabs let users switch between related sections without navigation.</p>
              </div>
            </div>
          </div>
          <div ui-tabs-content value="password">
            <div ui-card>
              <div ui-card-header>
                <h3 ui-card-title>Password</h3>
                <p ui-card-description>Change your password.</p>
              </div>
              <div ui-card-content>
                <p class="text-muted-foreground text-sm">Password fields go here.</p>
              </div>
            </div>
          </div>
          <div ui-tabs-content value="team">
            <div ui-card>
              <div ui-card-header>
                <h3 ui-card-title>Team</h3>
                <p ui-card-description>Manage your team.</p>
              </div>
              <div ui-card-content>
                <p class="text-muted-foreground text-sm">Team management UI goes here.</p>
              </div>
            </div>
          </div>
        </div>
      }
    }
  `,
})
export class AngularTabsDemoComponent {
  @Input() story = 'Default'
}
