import { Component, Input } from '@angular/core'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
  UiCardDescriptionComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'
import {
  UiDataListComponent,
  UiDataListItemComponent,
} from '../../../../../packages/registry-angular/components/data-list/data-list.component'

/** Angular demo for the data-list page. Mirrors demos/react/data-list.tsx story by story. */
@Component({
  selector: 'angular-data-list-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiCardComponent,
    UiCardContentComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiBadgeComponent,
    UiDataListComponent,
    UiDataListItemComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <div ui-card class="max-w-md">
          <div ui-data-list class="p-6">
            <div ui-data-list-item>
              <span class="text-sm font-medium">Plan</span>
              <span ui-badge>Pro</span>
            </div>
            <div ui-data-list-item>
              <span class="text-sm font-medium">Renewal</span>
              <span class="text-muted-foreground text-sm">Sep 12, 2026</span>
            </div>
            <div ui-data-list-item>
              <span class="text-sm font-medium">Status</span>
              <span ui-badge variant="secondary">Active</span>
            </div>
          </div>
        </div>
      }
      @case ('Multi-column grid') {
        <div ui-card class="max-w-3xl">
          <div class="grid gap-x-8 gap-y-3 p-6 sm:grid-cols-3">
            <div ui-data-list-item class="border-0 py-1">
              <span class="text-muted-foreground text-xs tracking-wide uppercase">MRR</span>
              <span class="text-sm font-semibold">$48,392</span>
            </div>
            <div ui-data-list-item class="border-0 py-1">
              <span class="text-muted-foreground text-xs tracking-wide uppercase">Customers</span>
              <span class="text-sm font-semibold">1,284</span>
            </div>
            <div ui-data-list-item class="border-0 py-1">
              <span class="text-muted-foreground text-xs tracking-wide uppercase">Churn</span>
              <span class="text-sm font-semibold">2.1%</span>
            </div>
            <div ui-data-list-item class="border-0 py-1">
              <span class="text-muted-foreground text-xs tracking-wide uppercase">NPS</span>
              <span class="text-sm font-semibold">62</span>
            </div>
            <div ui-data-list-item class="border-0 py-1">
              <span class="text-muted-foreground text-xs tracking-wide uppercase">Trials</span>
              <span class="text-sm font-semibold">38</span>
            </div>
            <div ui-data-list-item class="border-0 py-1">
              <span class="text-muted-foreground text-xs tracking-wide uppercase">Active seats</span>
              <span class="text-sm font-semibold">2,940</span>
            </div>
          </div>
        </div>
      }
      @case ('With chips and badges') {
        <div ui-card class="max-w-md">
          <div ui-data-list class="p-6">
            <div ui-data-list-item>
              <span class="text-sm font-medium">Environment</span>
              <span ui-badge variant="secondary">Production</span>
            </div>
            <div ui-data-list-item>
              <span class="text-sm font-medium">Region</span>
              <div class="flex gap-1.5">
                <span ui-badge variant="outline">us-east</span>
                <span ui-badge variant="outline">eu-west</span>
              </div>
            </div>
            <div ui-data-list-item>
              <span class="text-sm font-medium">Tier</span>
              <span ui-badge class="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">Enterprise</span>
            </div>
            <div ui-data-list-item>
              <span class="text-sm font-medium">SSO</span>
              <span ui-badge class="bg-sky-500/10 text-sky-700 dark:text-sky-400">SAML</span>
            </div>
          </div>
        </div>
      }
      @case ('In a card with header') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title class="text-base">Subscription</h3>
            <p ui-card-description>Billing and plan details for this workspace.</p>
          </div>
          <div ui-card-content>
            <div ui-data-list>
              <div ui-data-list-item>
                <span class="text-muted-foreground text-sm">Plan</span>
                <span class="text-sm font-medium">Pro · Annual</span>
              </div>
              <div ui-data-list-item>
                <span class="text-muted-foreground text-sm">Seats</span>
                <span class="text-sm font-medium">24 of 50</span>
              </div>
              <div ui-data-list-item>
                <span class="text-muted-foreground text-sm">Next invoice</span>
                <span class="text-sm font-medium">$2,400 on Sep 12</span>
              </div>
              <div ui-data-list-item>
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
                    class="lucide lucide-shield text-muted-foreground size-3.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                    />
                  </svg>
                  <span class="text-sm font-medium">SOC 2</span>
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
                  class="lucide lucide-check text-success size-4"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div ui-data-list-item>
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
                    class="lucide lucide-zap text-muted-foreground size-3.5"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
                    />
                  </svg>
                  <span class="text-sm font-medium">Priority support</span>
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
                  class="lucide lucide-check text-success size-4"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      }
    }
  `,
})
export class AngularDataListDemoComponent {
  @Input() story = 'Default'
}
