import { Component, Input } from '@angular/core'
import { UiSparklineComponent } from '../../../../../packages/registry-angular/components/charts/sparkline/sparkline.component'
import { UiKpiGridComponent } from '../../../../../packages/registry-angular/components/kpi-grid/kpi-grid.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

const headcount = [108, 112, 115, 119, 121, 122, 124]
const revenue = [820, 880, 905, 940, 980, 1050, 1180]

/** Angular demo for the kpi-grid page. Mirrors demos/react/kpi-grid.tsx story by story. */
@Component({
  selector: 'angular-kpi-grid-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiSparklineComponent,
    UiKpiGridComponent,
    UiCardComponent,
    UiCardContentComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default — four explicit tiles') {
        <div ui-kpi-grid>
          <div ui-card class="flex flex-col justify-between">
            <div ui-card-header class="flex flex-row items-center justify-between pb-2">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                TOTAL EMPLOYEES
              </h3>
              <div class="bg-primary/10 text-primary/70 rounded-lg p-2">
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
              </div>
            </div>
            <div ui-card-content>
              <div class="text-2xl font-bold tracking-tight">124</div>
            </div>
            <div class="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
              <span class="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium">
                +12
              </span>
              <span class="text-muted-foreground">this month</span>
            </div>
          </div>

          <div ui-card class="flex flex-col justify-between">
            <div ui-card-header class="flex flex-row items-center justify-between pb-2">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">ACTIVE</h3>
              <div class="bg-primary/10 text-primary/70 rounded-lg p-2">
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
                  class="lucide lucide-user-check size-4"
                  aria-hidden="true"
                >
                  <path d="m16 11 2 2 4-4" />
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </div>
            </div>
            <div ui-card-content>
              <div class="text-2xl font-bold tracking-tight">116</div>
            </div>
            <div class="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
              <span class="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium">
                +2%
              </span>
              <span class="text-muted-foreground">QoQ</span>
            </div>
          </div>

          <div ui-card>
            <div ui-card-header class="flex flex-row items-center justify-between pb-2">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                ON LEAVE
              </h3>
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
                class="lucide lucide-calendar-clock text-muted-foreground size-4"
                aria-hidden="true"
              >
                <path d="M16 14v2.2l1.6 1" />
                <path d="M16 2v4" />
                <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
                <path d="M3 10h5" />
                <path d="M8 2v4" />
                <circle cx="16" cy="16" r="6" />
              </svg>
            </div>
            <div ui-card-content>
              <div class="text-2xl font-bold tracking-tight">5</div>
            </div>
          </div>

          <div ui-card>
            <div ui-card-header class="flex flex-row items-center justify-between pb-2">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                TERMINATED
              </h3>
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
                class="lucide lucide-briefcase text-muted-foreground size-4"
                aria-hidden="true"
              >
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
            </div>
            <div ui-card-content>
              <div class="text-2xl font-bold tracking-tight">3</div>
            </div>
          </div>
        </div>
      }
      @case ('Three columns') {
        <div ui-kpi-grid [columns]="3">
          <div ui-card class="flex flex-col justify-between">
            <div ui-card-header class="flex flex-row items-center justify-between pb-2">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">REVENUE</h3>
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
                class="lucide lucide-dollar-sign text-muted-foreground size-4"
                aria-hidden="true"
              >
                <line x1="12" x2="12" y1="2" y2="22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div ui-card-content>
              <div class="text-2xl font-bold tracking-tight">$1.2M</div>
            </div>
            <div class="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
              <span class="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium">
                +8.4%
              </span>
              <span class="text-muted-foreground">YoY</span>
            </div>
          </div>

          <div ui-card class="flex flex-col justify-between">
            <div ui-card-header class="flex flex-row items-center justify-between pb-2">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                CONVERSION
              </h3>
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
                class="lucide lucide-trending-up text-muted-foreground size-4"
                aria-hidden="true"
              >
                <path d="M16 7h6v6" />
                <path d="m22 7-8.5 8.5-5-5L2 17" />
              </svg>
            </div>
            <div ui-card-content>
              <div class="text-2xl font-bold tracking-tight">3.7%</div>
            </div>
            <div class="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
              <span class="bg-success/10 text-success inline-flex items-center rounded-full px-1.5 py-0.5 font-medium">
                +0.6pp
              </span>
              <span class="text-muted-foreground">WoW</span>
            </div>
          </div>

          <div ui-card class="flex flex-col justify-between">
            <div ui-card-header class="flex flex-row items-center justify-between pb-2">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                ACTIVE USERS
              </h3>
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
                class="lucide lucide-activity text-muted-foreground size-4"
                aria-hidden="true"
              >
                <path
                  d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
                />
              </svg>
            </div>
            <div ui-card-content>
              <div class="text-2xl font-bold tracking-tight">8,412</div>
            </div>
            <div class="flex items-center justify-end gap-1.5 px-6 pb-4 text-xs">
              <span
                class="bg-destructive/10 text-destructive inline-flex items-center rounded-full px-1.5 py-0.5 font-medium"
              >
                -1.2%
              </span>
              <span class="text-muted-foreground">WoW</span>
            </div>
          </div>
        </div>
      }
      @case ('Mixed tile shapes') {
        <div ui-kpi-grid>
          <div ui-card>
            <div ui-card-header class="flex flex-row items-center justify-between pb-2">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                HEADCOUNT
              </h3>
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
                class="lucide lucide-users text-muted-foreground size-4"
                aria-hidden="true"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <div ui-card-content>
              <div class="text-2xl font-bold tracking-tight">124</div>
              <div ui-sparkline [data]="headcount" [height]="36" class="mt-2"></div>
            </div>
          </div>

          <div ui-card class="flex flex-col">
            <div ui-card-header class="pb-2">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                REVENUE TREND
              </h3>
            </div>
            <div ui-card-content class="pt-0">
              <div ui-sparkline [data]="revenue" [height]="64"></div>
            </div>
          </div>

          <div class="bg-muted/50 flex flex-col justify-center rounded-lg border border-dashed p-6">
            <div class="text-muted-foreground text-xs font-medium tracking-widest uppercase">PIPELINE</div>
            <div class="mt-2 text-3xl font-bold tabular-nums">42</div>
          </div>

          <div ui-card>
            <div ui-card-header class="flex flex-row items-center justify-between pb-2">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">ACTIVE</h3>
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
                class="lucide lucide-user-check text-muted-foreground size-4"
                aria-hidden="true"
              >
                <path d="m16 11 2 2 4-4" />
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
            </div>
            <div ui-card-content>
              <div class="text-2xl font-bold tracking-tight">116</div>
            </div>
          </div>
        </div>
      }
      @case ('Two tiles') {
        <div ui-kpi-grid [columns]="2">
          <div ui-card>
            <div ui-card-header class="flex flex-row items-center justify-between pb-2">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">REVENUE</h3>
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
                class="lucide lucide-dollar-sign text-muted-foreground size-4"
                aria-hidden="true"
              >
                <line x1="12" x2="12" y1="2" y2="22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <div ui-card-content>
              <div class="text-2xl font-bold tracking-tight">$1.2M</div>
            </div>
          </div>
          <div ui-card>
            <div ui-card-header class="flex flex-row items-center justify-between pb-2">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                ACTIVE USERS
              </h3>
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
                class="lucide lucide-activity text-muted-foreground size-4"
                aria-hidden="true"
              >
                <path
                  d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
                />
              </svg>
            </div>
            <div ui-card-content>
              <div class="text-2xl font-bold tracking-tight">8,412</div>
            </div>
          </div>
        </div>
      }
      @case ('Sparkline-led tiles') {
        <div ui-kpi-grid>
          <div ui-card>
            <div ui-card-header class="pb-1">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                HEADCOUNT
              </h3>
              <div class="text-xl font-bold tabular-nums">124</div>
            </div>
            <div ui-card-content class="pt-0">
              <div ui-sparkline [data]="headcount" [height]="48"></div>
            </div>
          </div>
          <div ui-card>
            <div ui-card-header class="pb-1">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">REVENUE</h3>
              <div class="text-xl font-bold tabular-nums">$1.18M</div>
            </div>
            <div ui-card-content class="pt-0">
              <div ui-sparkline [data]="revenue" [height]="48"></div>
            </div>
          </div>
          <div ui-card>
            <div ui-card-header class="pb-1">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                CONVERSIONS
              </h3>
              <div class="text-xl font-bold tabular-nums">3.7%</div>
            </div>
            <div ui-card-content class="pt-0">
              <div ui-sparkline [data]="conversions" [height]="48"></div>
            </div>
          </div>
          <div ui-card>
            <div ui-card-header class="pb-1">
              <h3 ui-card-title class="text-muted-foreground text-xs font-medium tracking-widest uppercase">CHURN</h3>
              <div class="text-xl font-bold tabular-nums">0.9%</div>
            </div>
            <div ui-card-content class="pt-0">
              <div ui-sparkline [data]="churn" [height]="48"></div>
            </div>
          </div>
        </div>
      }
    }
  `,
})
export class AngularKpiGridDemoComponent {
  readonly headcount = headcount
  readonly revenue = revenue
  readonly conversions = [18, 22, 25, 31, 28, 33, 37]
  readonly churn = [2.1, 1.8, 1.5, 1.4, 1.2, 1.0, 0.9]
  @Input() story = 'Default — four explicit tiles'
}
