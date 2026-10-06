import { Component, Input } from '@angular/core'
import {
  UiBreadcrumbComponent,
  UiBreadcrumbEllipsisComponent,
  UiBreadcrumbItemComponent,
  UiBreadcrumbLinkComponent,
  UiBreadcrumbListComponent,
  UiBreadcrumbPageComponent,
  UiBreadcrumbSeparatorComponent,
} from '../../../../../packages/registry-angular/components/breadcrumb/breadcrumb.component'
import {
  UiDropdownMenuComponent,
  UiDropdownMenuContentComponent,
  UiDropdownMenuItemComponent,
  UiDropdownMenuTriggerComponent,
} from '../../../../../packages/registry-angular/components/dropdown-menu/dropdown-menu.component'

/** Angular demo for the breadcrumb page. Mirrors demos/react/breadcrumb.tsx story by story. */
@Component({
  selector: 'angular-breadcrumb-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiBreadcrumbComponent,
    UiBreadcrumbListComponent,
    UiBreadcrumbItemComponent,
    UiBreadcrumbLinkComponent,
    UiBreadcrumbPageComponent,
    UiBreadcrumbSeparatorComponent,
    UiBreadcrumbEllipsisComponent,
    UiDropdownMenuComponent,
    UiDropdownMenuTriggerComponent,
    UiDropdownMenuContentComponent,
    UiDropdownMenuItemComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <nav ui-breadcrumb>
          <ol ui-breadcrumb-list>
            <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">Home</a></li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">Components</a></li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item><span ui-breadcrumb-page>Breadcrumb</span></li>
          </ol>
        </nav>
      }
      @case ('With leading icon') {
        <nav ui-breadcrumb>
          <ol ui-breadcrumb-list>
            <li ui-breadcrumb-item>
              <a ui-breadcrumb-link href="#" class="flex items-center gap-1">
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
                  class="lucide lucide-house size-3.5"
                  aria-hidden="true"
                >
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                  <path
                    d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                  />
                </svg>
                <span class="sr-only">Home</span>
              </a>
            </li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">Settings</a></li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item><span ui-breadcrumb-page>Account</span></li>
          </ol>
        </nav>
      }
      @case ('Custom separator') {
        <div class="space-y-3">
          <nav ui-breadcrumb>
            <ol ui-breadcrumb-list>
              <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">Docs</a></li>
              <li ui-breadcrumb-separator>
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
                  class="lucide lucide-slash text-muted-foreground/60 size-3.5 -rotate-12"
                  aria-hidden="true"
                >
                  <path d="M22 2 2 22" />
                </svg>
              </li>
              <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">Guides</a></li>
              <li ui-breadcrumb-separator>
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
                  class="lucide lucide-slash text-muted-foreground/60 size-3.5 -rotate-12"
                  aria-hidden="true"
                >
                  <path d="M22 2 2 22" />
                </svg>
              </li>
              <li ui-breadcrumb-item><span ui-breadcrumb-page>Routing</span></li>
            </ol>
          </nav>
          <nav ui-breadcrumb>
            <ol ui-breadcrumb-list>
              <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">Library</a></li>
              <li ui-breadcrumb-separator>·</li>
              <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">UI</a></li>
              <li ui-breadcrumb-separator>·</li>
              <li ui-breadcrumb-item><span ui-breadcrumb-page>Toggle</span></li>
            </ol>
          </nav>
        </div>
      }
      @case ('Long path with ellipsis') {
        <nav ui-breadcrumb>
          <ol ui-breadcrumb-list>
            <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">Workspace</a></li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item><span ui-breadcrumb-ellipsis></span></li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">2026</a></li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item><span ui-breadcrumb-page>May</span></li>
          </ol>
        </nav>
      }
      @case ('Ellipsis with dropdown') {
        <nav ui-breadcrumb>
          <ol ui-breadcrumb-list>
            <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">Org</a></li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item>
              <ui-dropdown-menu>
                <button
                  type="button"
                  ui-dropdown-menu-trigger
                  class="hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <span ui-breadcrumb-ellipsis></span>
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
                    class="lucide lucide-chevron-down size-3"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                <ui-dropdown-menu-content align="start">
                  <div ui-dropdown-menu-item>Acme Inc</div>
                  <div ui-dropdown-menu-item>Customers</div>
                  <div ui-dropdown-menu-item>Engineering</div>
                </ui-dropdown-menu-content>
              </ui-dropdown-menu>
            </li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">Tickets</a></li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item><span ui-breadcrumb-page>#4218</span></li>
          </ol>
        </nav>
      }
      @case ('Responsive truncation') {
        <nav ui-breadcrumb>
          <ol ui-breadcrumb-list>
            <li ui-breadcrumb-item><a ui-breadcrumb-link href="#">Home</a></li>
            <li ui-breadcrumb-separator></li>
            <li ui-breadcrumb-item class="hidden md:inline-flex"><a ui-breadcrumb-link href="#">Reports</a></li>
            <li ui-breadcrumb-separator class="hidden md:inline-flex"></li>
            <li ui-breadcrumb-item class="hidden md:inline-flex"><a ui-breadcrumb-link href="#">Q1 2026</a></li>
            <li ui-breadcrumb-separator class="hidden md:inline-flex"></li>
            <li ui-breadcrumb-item class="md:hidden"><span ui-breadcrumb-ellipsis></span></li>
            <li ui-breadcrumb-separator class="md:hidden"></li>
            <li ui-breadcrumb-item><span ui-breadcrumb-page>Sales by region</span></li>
          </ol>
        </nav>
      }
    }
  `,
})
export class AngularBreadcrumbDemoComponent {
  @Input() story = 'Default'
}
