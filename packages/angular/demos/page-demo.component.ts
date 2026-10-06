import { Component, Input } from '@angular/core'
import {
  UiBreadcrumbComponent,
  UiBreadcrumbItemComponent,
  UiBreadcrumbLinkComponent,
  UiBreadcrumbListComponent,
  UiBreadcrumbPageComponent,
  UiBreadcrumbSeparatorComponent,
} from '../../../../../packages/registry-angular/components/breadcrumb/breadcrumb.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import {
  UiPageBodyComponent,
  UiPageComponent,
  UiPageHeaderComponent,
  UiPageHeaderHeadingComponent,
} from '../../../../../packages/registry-angular/components/page/page.component'

/** Angular demo for the page page. Mirrors demos/react/page.tsx story by story. */
@Component({
  selector: 'angular-page-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiBreadcrumbComponent,
    UiBreadcrumbItemComponent,
    UiBreadcrumbLinkComponent,
    UiBreadcrumbListComponent,
    UiBreadcrumbPageComponent,
    UiBreadcrumbSeparatorComponent,
    UiButtonComponent,
    UiCardComponent,
    UiCardContentComponent,
    UiCardDescriptionComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiPageBodyComponent,
    UiPageComponent,
    UiPageHeaderComponent,
    UiPageHeaderHeadingComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <div ui-page>
          <div ui-page-header>
            <div
              ui-page-header-heading
              title="Page header"
              description="Page is the root layout for app screens. PageHeader stacks title + actions."
            ></div>
            <ng-container ngProjectAs="[slot=actions]">
              <button ui-button variant="outline" size="sm">Cancel</button>
              <button ui-button size="sm">Save</button>
            </ng-container>
          </div>
          <div ui-page-body>
            <div ui-card>
              <div ui-card-content class="text-muted-foreground py-8 text-center text-sm">
                Page body content goes here. Use SectionCard, blocks, or your own grid layout below the header.
              </div>
            </div>
          </div>
        </div>
      }
      @case ('Multiple actions') {
        <div ui-page>
          <div ui-page-header>
            <div ui-page-header-heading title="Reports" description="Sales performance across all channels."></div>
            <ng-container ngProjectAs="[slot=actions]">
              <button ui-button variant="outline" size="sm">
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
                  class="lucide lucide-funnel size-4"
                  aria-hidden="true"
                >
                  <path
                    d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"
                  />
                </svg>
                Filter
              </button>
              <button ui-button variant="outline" size="sm">
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
                  class="lucide lucide-download size-4"
                  aria-hidden="true"
                >
                  <path d="M12 15V3" />
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="m7 10 5 5 5-5" />
                </svg>
                Export
              </button>
              <button ui-button size="sm">
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
                  class="lucide lucide-plus size-4"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                New report
              </button>
            </ng-container>
          </div>
          <div ui-page-body>
            <div ui-card>
              <div ui-card-content class="text-muted-foreground py-8 text-center text-sm">Reports table goes here.</div>
            </div>
          </div>
        </div>
      }
      @case ('Body with grid') {
        <div ui-page>
          <div ui-page-header>
            <div ui-page-header-heading title="Dashboard" description="Key metrics and recent activity."></div>
          </div>
          <div ui-page-body>
            <div class="grid gap-4 sm:grid-cols-3">
              @for (kpi of kpis; track kpi.label) {
                <div ui-card>
                  <div ui-card-header class="pb-2">
                    <p ui-card-description>{{ kpi.label }}</p>
                    <h3 ui-card-title class="text-2xl">{{ kpi.value }}</h3>
                  </div>
                  <div ui-card-content>
                    <p class="text-muted-foreground text-xs">vs. previous period</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      }
      @case ('Title only') {
        <div ui-page>
          <div ui-page-header>
            <div ui-page-header-heading title="Settings"></div>
            <button ui-button slot="actions" size="sm">Save changes</button>
          </div>
          <div ui-page-body>
            <div ui-card>
              <div ui-card-content class="text-muted-foreground py-8 text-center text-sm">Settings form goes here.</div>
            </div>
          </div>
        </div>
      }
      @case ('With breadcrumb') {
        <div ui-page>
          <div ui-page-header>
            <div class="space-y-2">
              <nav ui-breadcrumb>
                <ol ui-breadcrumb-list>
                  <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">Workspace</a></li>
                  <li ui-breadcrumb-separator></li>
                  <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">Projects</a></li>
                  <li ui-breadcrumb-separator></li>
                  <li ui-breadcrumb-item><span ui-breadcrumb-page>Acme website</span></li>
                </ol>
              </nav>
              <div ui-page-header-heading title="Acme website" description="Customer-facing marketing site."></div>
            </div>
            <ng-container ngProjectAs="[slot=actions]">
              <button ui-button variant="outline" size="sm">Archive</button>
              <button ui-button size="sm">Edit</button>
            </ng-container>
          </div>
          <div ui-page-body>
            <div ui-card>
              <div ui-card-content class="text-muted-foreground py-8 text-center text-sm">Project details go here.</div>
            </div>
          </div>
        </div>
      }
    }
  `,
})
export class AngularPageDemoComponent {
  @Input() story = 'Default'
  readonly kpis = [
    { label: 'Revenue', value: '$48.2k' },
    { label: 'Active users', value: '12,310' },
    { label: 'Conversion', value: '3.4%' },
  ]
}
