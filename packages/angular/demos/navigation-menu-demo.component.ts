import { Component, Input } from '@angular/core'
import {
  UiNavigationMenuComponent,
  UiNavigationMenuContentComponent,
  UiNavigationMenuIndicatorComponent,
  UiNavigationMenuItemComponent,
  UiNavigationMenuLinkComponent,
  UiNavigationMenuListComponent,
  UiNavigationMenuTriggerComponent,
  navigationMenuTriggerStyle,
} from '../../../../../packages/registry-angular/components/navigation-menu/navigation-menu.component'

/** Angular demo for the navigation-menu page. Mirrors demos/react/navigation-menu.tsx story by story. */
@Component({
  selector: 'angular-navigation-menu-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiNavigationMenuComponent,
    UiNavigationMenuListComponent,
    UiNavigationMenuItemComponent,
    UiNavigationMenuTriggerComponent,
    UiNavigationMenuContentComponent,
    UiNavigationMenuLinkComponent,
    UiNavigationMenuIndicatorComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <nav ui-navigation-menu>
          <ui-navigation-menu-list>
            <li ui-navigation-menu-item>
              <button ui-navigation-menu-trigger>Getting started</button>
              <ui-navigation-menu-content>
                <ul class="grid w-72 gap-2 p-4">
                  <li>
                    <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm">Introduction</a>
                  </li>
                  <li>
                    <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm">Installation</a>
                  </li>
                  <li>
                    <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm">Typography</a>
                  </li>
                </ul>
              </ui-navigation-menu-content>
            </li>
            <li ui-navigation-menu-item>
              <button ui-navigation-menu-trigger>Components</button>
              <ui-navigation-menu-content>
                <ul class="grid w-72 gap-2 p-4">
                  <li>
                    <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm">Button</a>
                  </li>
                  <li>
                    <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm">Card</a>
                  </li>
                  <li>
                    <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm">Dialog</a>
                  </li>
                </ul>
              </ui-navigation-menu-content>
            </li>
          </ui-navigation-menu-list>
        </nav>
      }
      @case ('Three-column mega menu') {
        <nav ui-navigation-menu>
          <ui-navigation-menu-list>
            <li ui-navigation-menu-item>
              <button ui-navigation-menu-trigger>Platform</button>
              <ui-navigation-menu-content>
                <div class="grid w-[640px] grid-cols-3 gap-3 p-4">
                  <a href="#" class="hover:bg-muted flex flex-col gap-1 rounded-md p-3">
                    <div class="flex items-center gap-2 text-sm font-medium">
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
                      Highlights
                    </div>
                    <p class="text-muted-foreground text-xs">What's new this month.</p>
                  </a>
                  <a href="#" class="hover:bg-muted flex flex-col gap-1 rounded-md p-3">
                    <div class="flex items-center gap-2 text-sm font-medium">
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
                        class="lucide lucide-boxes size-4"
                        aria-hidden="true"
                      >
                        <path
                          d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"
                        />
                        <path d="m7 16.5-4.74-2.85" />
                        <path d="m7 16.5 5-3" />
                        <path d="M7 16.5v5.17" />
                        <path
                          d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"
                        />
                        <path d="m17 16.5-5-3" />
                        <path d="m17 16.5 4.74-2.85" />
                        <path d="M17 16.5v5.17" />
                        <path
                          d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"
                        />
                        <path d="M12 8 7.26 5.15" />
                        <path d="m12 8 4.74-2.85" />
                        <path d="M12 13.5V8" />
                      </svg>
                      Components
                    </div>
                    <p class="text-muted-foreground text-xs">Browse the full registry.</p>
                  </a>
                  <a href="#" class="hover:bg-muted flex flex-col gap-1 rounded-md p-3">
                    <div class="flex items-center gap-2 text-sm font-medium">
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
                        class="lucide lucide-workflow size-4"
                        aria-hidden="true"
                      >
                        <rect width="8" height="8" x="3" y="3" rx="2" />
                        <path d="M7 11v4a2 2 0 0 0 2 2h4" />
                        <rect width="8" height="8" x="13" y="13" rx="2" />
                      </svg>
                      Blocks
                    </div>
                    <p class="text-muted-foreground text-xs">Composed sections.</p>
                  </a>
                  <a href="#" class="hover:bg-muted flex flex-col gap-1 rounded-md p-3">
                    <div class="flex items-center gap-2 text-sm font-medium">
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
                        class="lucide lucide-rocket size-4"
                        aria-hidden="true"
                      >
                        <path
                          d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
                        />
                        <path
                          d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
                        />
                        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                      </svg>
                      Quickstart
                    </div>
                    <p class="text-muted-foreground text-xs">Ship in 5 minutes.</p>
                  </a>
                  <a href="#" class="hover:bg-muted flex flex-col gap-1 rounded-md p-3">
                    <div class="flex items-center gap-2 text-sm font-medium">
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
                        class="lucide lucide-file-text size-4"
                        aria-hidden="true"
                      >
                        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                        <path d="M10 9H8" />
                        <path d="M16 13H8" />
                        <path d="M16 17H8" />
                      </svg>
                      Guides
                    </div>
                    <p class="text-muted-foreground text-xs">Long-form tutorials.</p>
                  </a>
                  <a href="#" class="hover:bg-muted flex flex-col gap-1 rounded-md p-3">
                    <div class="flex items-center gap-2 text-sm font-medium">
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
                        class="lucide lucide-life-buoy size-4"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m4.93 4.93 4.24 4.24" />
                        <path d="m14.83 9.17 4.24-4.24" />
                        <path d="m14.83 14.83 4.24 4.24" />
                        <path d="m9.17 14.83-4.24 4.24" />
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                      Support
                    </div>
                    <p class="text-muted-foreground text-xs">Open an issue.</p>
                  </a>
                </div>
              </ui-navigation-menu-content>
            </li>
          </ui-navigation-menu-list>
        </nav>
      }
      @case ('Standalone link') {
        <nav ui-navigation-menu>
          <ui-navigation-menu-list>
            <li ui-navigation-menu-item>
              <a ui-navigation-menu-link href="#" [class]="triggerStyle">Documentation</a>
            </li>
            <li ui-navigation-menu-item>
              <a ui-navigation-menu-link href="#" [class]="triggerStyle">Pricing</a>
            </li>
            <li ui-navigation-menu-item>
              <a ui-navigation-menu-link href="#" [class]="triggerStyle">Changelog</a>
            </li>
          </ui-navigation-menu-list>
        </nav>
      }
      @case ('With indicator') {
        <nav ui-navigation-menu>
          <ui-navigation-menu-list>
            <li ui-navigation-menu-item>
              <button ui-navigation-menu-trigger>Learn</button>
              <ui-navigation-menu-content>
                <ul class="grid w-72 gap-2 p-4">
                  <li>
                    <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm">Tutorials</a>
                  </li>
                  <li>
                    <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm">Examples</a>
                  </li>
                </ul>
              </ui-navigation-menu-content>
            </li>
            <li ui-navigation-menu-item>
              <button ui-navigation-menu-trigger>Community</button>
              <ui-navigation-menu-content>
                <ul class="grid w-72 gap-2 p-4">
                  <li>
                    <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm">Discord</a>
                  </li>
                  <li>
                    <a href="#" class="hover:bg-muted block rounded-md p-2 text-sm">GitHub</a>
                  </li>
                </ul>
              </ui-navigation-menu-content>
            </li>
            <ui-navigation-menu-indicator />
          </ui-navigation-menu-list>
        </nav>
      }
      @case ('Plain link nav') {
        <nav ui-navigation-menu>
          <ui-navigation-menu-list>
            <li ui-navigation-menu-item>
              <a ui-navigation-menu-link href="#" [class]="triggerStyle">Home</a>
            </li>
            <li ui-navigation-menu-item>
              <a ui-navigation-menu-link href="#" [class]="triggerStyle">Features</a>
            </li>
            <li ui-navigation-menu-item>
              <a ui-navigation-menu-link href="#" [class]="triggerStyle">Pricing</a>
            </li>
            <li ui-navigation-menu-item>
              <a ui-navigation-menu-link href="#" [class]="triggerStyle">About</a>
            </li>
            <li ui-navigation-menu-item>
              <a ui-navigation-menu-link href="#" [class]="triggerStyle">Contact</a>
            </li>
          </ui-navigation-menu-list>
        </nav>
      }
    }
  `,
})
export class AngularNavigationMenuDemoComponent {
  @Input() story = 'Default'
  readonly triggerStyle = navigationMenuTriggerStyle()
}
