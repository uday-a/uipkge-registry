import { Component, Input } from '@angular/core'
import {
  UiSidebarComponent,
  UiSidebarContentComponent,
  UiSidebarGroupComponent,
  UiSidebarGroupLabelComponent,
  UiSidebarHeaderComponent,
  UiSidebarInsetComponent,
  UiSidebarMenuActionComponent,
  UiSidebarMenuBadgeComponent,
  UiSidebarMenuButtonComponent,
  UiSidebarMenuComponent,
  UiSidebarMenuItemComponent,
  UiSidebarMenuSubButtonComponent,
  UiSidebarMenuSubComponent,
  UiSidebarMenuSubItemComponent,
  UiSidebarProviderComponent,
  UiSidebarRailComponent,
  UiSidebarTriggerComponent,
} from '../../../../../packages/registry-angular/components/sidebar/sidebar.component'

// Each story wraps its provider in [transform:translate(0)] so the sidebar's internal
// position: fixed anchors to the demo container rather than the page viewport (same as React).
const containBlock = 'min-h-0 h-[400px] [transform:translate(0)] rounded-lg border overflow-hidden'

/** Angular demo for the sidebar page. Mirrors demos/react/sidebar.tsx story by story. */
@Component({
  selector: 'angular-sidebar-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiSidebarProviderComponent,
    UiSidebarComponent,
    UiSidebarHeaderComponent,
    UiSidebarContentComponent,
    UiSidebarGroupComponent,
    UiSidebarGroupLabelComponent,
    UiSidebarMenuComponent,
    UiSidebarMenuItemComponent,
    UiSidebarMenuButtonComponent,
    UiSidebarMenuActionComponent,
    UiSidebarMenuBadgeComponent,
    UiSidebarMenuSubComponent,
    UiSidebarMenuSubItemComponent,
    UiSidebarMenuSubButtonComponent,
    UiSidebarInsetComponent,
    UiSidebarRailComponent,
    UiSidebarTriggerComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-sidebar-provider [class]="containBlock">
          <div ui-sidebar collapsible="none" class="border-r">
            <div ui-sidebar-header>
              <div class="flex items-center gap-2 px-4 py-3">
                <span class="text-sm font-semibold">My App</span>
              </div>
            </div>
            <div ui-sidebar-content>
              <div ui-sidebar-group>
                <div ui-sidebar-group-label>Platform</div>
                <ul ui-sidebar-menu>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                        class="lucide lucide-house size-4"
                        aria-hidden="true"
                      >
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                        <path
                          d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                        />
                      </svg>
                      <span>Home</span>
                    </button>
                  </li>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                        class="lucide lucide-compass size-4"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path
                          d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"
                        />
                      </svg>
                      <span>Explore</span>
                    </button>
                  </li>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                      <span>Settings</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <main class="flex-1 p-4">
            <button ui-sidebar-trigger></button>
            <p class="text-muted-foreground mt-4 text-sm">Main content area.</p>
          </main>
        </ui-sidebar-provider>
      }
      @case ('Collapsible icon') {
        <ui-sidebar-provider [class]="containBlock">
          <div ui-sidebar collapsible="icon" class="border-r">
            <div ui-sidebar-header>
              <div class="flex items-center gap-2 px-4 py-3">
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
                  class="lucide lucide-star size-4"
                  aria-hidden="true"
                >
                  <path
                    d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                  />
                </svg>
                <span class="text-sm font-semibold group-data-[collapsible=icon]:hidden">Workspace</span>
              </div>
            </div>
            <div ui-sidebar-content>
              <div ui-sidebar-group>
                <div ui-sidebar-group-label>Navigate</div>
                <ul ui-sidebar-menu>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button tooltip="Inbox">
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
                        class="lucide lucide-inbox size-4"
                        aria-hidden="true"
                      >
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                        <path
                          d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
                        />
                      </svg>
                      <span>Inbox</span>
                    </button>
                  </li>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button tooltip="Calendar">
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
                        class="lucide lucide-calendar size-4"
                        aria-hidden="true"
                      >
                        <path d="M8 2v4" />
                        <path d="M16 2v4" />
                        <rect width="18" height="18" x="3" y="4" rx="2" />
                        <path d="M3 10h18" />
                      </svg>
                      <span>Calendar</span>
                    </button>
                  </li>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button tooltip="Search">
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
                        class="lucide lucide-search size-4"
                        aria-hidden="true"
                      >
                        <path d="m21 21-4.34-4.34" />
                        <circle cx="11" cy="11" r="8" />
                      </svg>
                      <span>Search</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <button ui-sidebar-rail></button>
          </div>
          <main class="flex-1 p-4">
            <button ui-sidebar-trigger></button>
            <p class="text-muted-foreground mt-4 text-sm">Toggle the trigger to collapse the sidebar to icons.</p>
          </main>
        </ui-sidebar-provider>
      }
      @case ('Floating variant') {
        <ui-sidebar-provider [class]="containBlock + ' bg-muted/30'">
          <div ui-sidebar variant="floating" collapsible="none">
            <div ui-sidebar-header>
              <div class="flex items-center gap-2 px-2 py-2">
                <span class="text-sm font-semibold">Floating</span>
              </div>
            </div>
            <div ui-sidebar-content>
              <div ui-sidebar-group>
                <ul ui-sidebar-menu>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                        class="lucide lucide-house size-4"
                        aria-hidden="true"
                      >
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                        <path
                          d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                        />
                      </svg>
                      <span>Home</span>
                    </button>
                  </li>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                      <span>Team</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <main class="flex-1 p-4">
            <p class="text-muted-foreground text-sm">Floating sidebar with rounded corners.</p>
          </main>
        </ui-sidebar-provider>
      }
      @case ('Inset variant') {
        <ui-sidebar-provider [class]="containBlock + ' bg-muted/40'">
          <div ui-sidebar variant="inset" collapsible="none">
            <div ui-sidebar-header>
              <div class="flex items-center gap-2 px-2 py-2">
                <span class="text-sm font-semibold">Inset</span>
              </div>
            </div>
            <div ui-sidebar-content>
              <div ui-sidebar-group>
                <ul ui-sidebar-menu>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                        class="lucide lucide-house size-4"
                        aria-hidden="true"
                      >
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                        <path
                          d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                        />
                      </svg>
                      <span>Dashboard</span>
                    </button>
                  </li>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                      <span>Notifications</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <main ui-sidebar-inset>
            <p class="text-muted-foreground p-4 text-sm">Main content sits inside a rounded inset card.</p>
          </main>
        </ui-sidebar-provider>
      }
      @case ('Nested submenus') {
        <ui-sidebar-provider [class]="containBlock">
          <div ui-sidebar collapsible="none" class="border-r">
            <div ui-sidebar-header>
              <div class="px-4 py-3 text-sm font-semibold">Docs</div>
            </div>
            <div ui-sidebar-content>
              <div ui-sidebar-group>
                <div ui-sidebar-group-label>Library</div>
                <ul ui-sidebar-menu>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                        class="lucide lucide-house size-4"
                        aria-hidden="true"
                      >
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                        <path
                          d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                        />
                      </svg>
                      <span>Getting started</span>
                    </button>
                  </li>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                        class="lucide lucide-chevron-down size-4"
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                      <span>Components</span>
                    </button>
                    <ul ui-sidebar-menu-sub>
                      <li ui-sidebar-menu-sub-item><a ui-sidebar-menu-sub-button href="#">Button</a></li>
                      <li ui-sidebar-menu-sub-item><a ui-sidebar-menu-sub-button href="#" isActive>Card</a></li>
                      <li ui-sidebar-menu-sub-item><a ui-sidebar-menu-sub-button href="#">Dialog</a></li>
                    </ul>
                  </li>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                      <span>Settings</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <main class="flex-1 p-4">
            <button ui-sidebar-trigger></button>
          </main>
        </ui-sidebar-provider>
      }
      @case ('Badges and actions') {
        <ui-sidebar-provider [class]="containBlock">
          <div ui-sidebar collapsible="none" class="border-r">
            <div ui-sidebar-header>
              <div class="px-4 py-3 text-sm font-semibold">Mail</div>
            </div>
            <div ui-sidebar-content>
              <div ui-sidebar-group>
                <div ui-sidebar-group-label>Folders</div>
                <ul ui-sidebar-menu>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                        class="lucide lucide-inbox size-4"
                        aria-hidden="true"
                      >
                        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                        <path
                          d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
                        />
                      </svg>
                      <span>Inbox</span>
                    </button>
                    <div ui-sidebar-menu-badge>24</div>
                  </li>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                        class="lucide lucide-star size-4"
                        aria-hidden="true"
                      >
                        <path
                          d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
                        />
                      </svg>
                      <span>Starred</span>
                    </button>
                    <div ui-sidebar-menu-badge>3</div>
                  </li>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                      <span>Updates</span>
                    </button>
                    <button ui-sidebar-menu-action showOnHover>
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
                        class="lucide lucide-ellipsis size-4"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </button>
                  </li>
                  <li ui-sidebar-menu-item>
                    <button ui-sidebar-menu-button>
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
                      <span>New folder</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <main class="flex-1 p-4">
            <button ui-sidebar-trigger></button>
            <p class="text-muted-foreground mt-4 text-sm">Hover the Updates row to reveal its action.</p>
          </main>
        </ui-sidebar-provider>
      }
    }
  `,
})
export class AngularSidebarDemoComponent {
  @Input() story = 'Default'
  readonly containBlock = containBlock
}
