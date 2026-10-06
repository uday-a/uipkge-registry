import { Component, Input } from '@angular/core'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import { UiButtonGroupComponent } from '../../../../../packages/registry-angular/components/button/button-group.component'
import {
  UiDropdownMenuComponent,
  UiDropdownMenuContentComponent,
  UiDropdownMenuItemComponent,
  UiDropdownMenuSeparatorComponent,
  UiDropdownMenuTriggerComponent,
} from '../../../../../packages/registry-angular/components/dropdown-menu/dropdown-menu.component'

/** Angular demo for the button page. Mirrors demos/react/button.tsx story by story. */
@Component({
  selector: 'angular-button-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiButtonComponent,
    UiButtonGroupComponent,
    UiDropdownMenuComponent,
    UiDropdownMenuTriggerComponent,
    UiDropdownMenuContentComponent,
    UiDropdownMenuItemComponent,
    UiDropdownMenuSeparatorComponent,
  ],
  template: `
    @switch (story) {
      @case ('Variants') {
        <div class="flex flex-wrap gap-2">
          <button ui-button>Default</button>
          <button ui-button variant="destructive">Destructive</button>
          <button ui-button variant="outline">Outline</button>
          <button ui-button variant="secondary">Secondary</button>
          <button ui-button variant="ghost">Ghost</button>
          <button ui-button variant="link">Link</button>
        </div>
      }
      @case ('Sizes') {
        <div class="flex flex-wrap items-center gap-2">
          <button ui-button size="xs">Extra small</button>
          <button ui-button size="sm">Small</button>
          <button ui-button>Default</button>
          <button ui-button size="lg">Large</button>
        </div>
      }
      @case ('Icon-only') {
        <div class="flex flex-wrap items-center gap-2">
          <button ui-button size="icon-sm" aria-label="icon">
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
          <button ui-button size="icon" aria-label="icon">
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
          <button ui-button size="icon-lg" aria-label="icon">
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
        </div>
      }
      @case ('With icon') {
        <div class="flex flex-wrap gap-2">
          <button ui-button>
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
            Email me
          </button>
          <button ui-button>
            Continue
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
              class="lucide lucide-chevron-right"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <button ui-button variant="outline">
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
              class="lucide lucide-plus"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New item
          </button>
          <button ui-button variant="destructive">
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
              class="lucide lucide-trash-2"
              aria-hidden="true"
            >
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </button>
        </div>
      }
      @case ('States') {
        <div class="flex flex-wrap gap-2">
          <button ui-button disabled>Disabled</button>
          <button ui-button variant="outline" disabled>Outline disabled</button>
          <button ui-button disabled>
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
              class="lucide lucide-loader-circle animate-spin"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Loading…
          </button>
        </div>
      }
      @case ('Button Group & Split Buttons') {
        <div class="flex flex-wrap items-center gap-4">
          <div ui-button-group>
            <button ui-button variant="outline" size="sm">Years</button>
            <button ui-button variant="outline" size="sm">Months</button>
            <button ui-button variant="outline" size="sm">Days</button>
          </div>

          <div ui-button-group>
            <button ui-button variant="default" size="sm">Save changes</button>
            <ui-dropdown-menu>
              <button ui-button ui-dropdown-menu-trigger variant="default" size="icon-sm" aria-label="More options">
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
                  class="lucide lucide-chevron-down size-3.5"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <ui-dropdown-menu-content align="end" class="w-48">
                <div ui-dropdown-menu-item>Save as draft</div>
                <div ui-dropdown-menu-item>Save and publish</div>
                <div ui-dropdown-menu-item>Schedule…</div>
                <div ui-dropdown-menu-separator></div>
                <div ui-dropdown-menu-item variant="destructive">Discard changes</div>
              </ui-dropdown-menu-content>
            </ui-dropdown-menu>
          </div>

          <div ui-button-group>
            <button ui-button variant="secondary" size="xs">
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
                class="lucide lucide-copy size-3"
                aria-hidden="true"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              Copy
            </button>
            <button ui-button variant="secondary" size="xs">
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
                class="lucide lucide-share-2 size-3"
                aria-hidden="true"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
              </svg>
              Share
            </button>
            <button ui-button variant="secondary" size="xs">
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
                class="lucide lucide-download size-3"
                aria-hidden="true"
              >
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
              Export
            </button>
          </div>
        </div>
      }
    }
  `,
})
export class AngularButtonDemoComponent {
  @Input() story = 'Variants'
}
