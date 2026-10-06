import { Component, Input } from '@angular/core'
import {
  UiDropdownMenuCheckboxItemComponent,
  UiDropdownMenuComponent,
  UiDropdownMenuContentComponent,
  UiDropdownMenuGroupComponent,
  UiDropdownMenuItemComponent,
  UiDropdownMenuLabelComponent,
  UiDropdownMenuRadioGroupComponent,
  UiDropdownMenuRadioItemComponent,
  UiDropdownMenuSeparatorComponent,
  UiDropdownMenuShortcutComponent,
  UiDropdownMenuSubComponent,
  UiDropdownMenuSubContentComponent,
  UiDropdownMenuSubTriggerComponent,
  UiDropdownMenuTriggerComponent,
} from '../../../../../packages/registry-angular/components/dropdown-menu/dropdown-menu.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

/** Angular demo for the dropdown-menu page. Mirrors demos/react/dropdown-menu.tsx story by story. */
@Component({
  selector: 'angular-dropdown-menu-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiDropdownMenuComponent,
    UiDropdownMenuTriggerComponent,
    UiDropdownMenuContentComponent,
    UiDropdownMenuGroupComponent,
    UiDropdownMenuItemComponent,
    UiDropdownMenuCheckboxItemComponent,
    UiDropdownMenuRadioGroupComponent,
    UiDropdownMenuRadioItemComponent,
    UiDropdownMenuLabelComponent,
    UiDropdownMenuSeparatorComponent,
    UiDropdownMenuShortcutComponent,
    UiDropdownMenuSubComponent,
    UiDropdownMenuSubTriggerComponent,
    UiDropdownMenuSubContentComponent,
    UiButtonComponent,
  ],
  template: `
    @switch (story) {
      @case ('Account menu') {
        <ui-dropdown-menu>
          <button ui-button ui-dropdown-menu-trigger variant="outline">Open menu</button>
          <ui-dropdown-menu-content class="w-56">
            <div ui-dropdown-menu-label>My account</div>
            <div ui-dropdown-menu-separator></div>
            <div ui-dropdown-menu-group>
              <div ui-dropdown-menu-item>
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
              </div>
              <div ui-dropdown-menu-item>
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
              </div>
              <div ui-dropdown-menu-item>
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
                Settings
              </div>
              <div ui-dropdown-menu-item>
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
                  class="lucide lucide-keyboard size-4"
                  aria-hidden="true"
                >
                  <path d="M10 8h.01" />
                  <path d="M12 12h.01" />
                  <path d="M14 8h.01" />
                  <path d="M16 12h.01" />
                  <path d="M18 8h.01" />
                  <path d="M6 8h.01" />
                  <path d="M7 16h10" />
                  <path d="M8 12h.01" />
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                </svg>
                Shortcuts
              </div>
            </div>
            <div ui-dropdown-menu-separator></div>
            <div ui-dropdown-menu-item class="text-destructive focus:text-destructive">
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
                class="lucide lucide-log-out size-4"
                aria-hidden="true"
              >
                <path d="m16 17 5-5-5-5" />
                <path d="M21 12H9" />
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              </svg>
              Log out
            </div>
          </ui-dropdown-menu-content>
        </ui-dropdown-menu>
      }
      @case ('With shortcuts') {
        <ui-dropdown-menu>
          <button ui-button ui-dropdown-menu-trigger variant="outline">Edit</button>
          <ui-dropdown-menu-content class="w-56">
            <div ui-dropdown-menu-item>New tab<span ui-dropdown-menu-shortcut>⌘T</span></div>
            <div ui-dropdown-menu-item>New window<span ui-dropdown-menu-shortcut>⌘N</span></div>
            <div ui-dropdown-menu-item disabled>New private window<span ui-dropdown-menu-shortcut>⇧⌘N</span></div>
            <div ui-dropdown-menu-separator></div>
            <div ui-dropdown-menu-item>Print<span ui-dropdown-menu-shortcut>⌘P</span></div>
          </ui-dropdown-menu-content>
        </ui-dropdown-menu>
      }
      @case ('With checkbox items') {
        <ui-dropdown-menu>
          <button ui-button ui-dropdown-menu-trigger variant="outline">View options</button>
          <ui-dropdown-menu-content class="w-56">
            <div ui-dropdown-menu-label>Appearance</div>
            <div ui-dropdown-menu-separator></div>
            <div ui-dropdown-menu-checkbox-item [checked]="showStatus" (checkedChange)="showStatus = $event">
              Status bar
            </div>
            <div ui-dropdown-menu-checkbox-item [checked]="showActivity" (checkedChange)="showActivity = $event">
              Activity bar
            </div>
            <div ui-dropdown-menu-checkbox-item [checked]="showPanel" (checkedChange)="showPanel = $event">Panel</div>
          </ui-dropdown-menu-content>
        </ui-dropdown-menu>
      }
      @case ('With radio group') {
        <ui-dropdown-menu>
          <button ui-button ui-dropdown-menu-trigger variant="outline">Panel position</button>
          <ui-dropdown-menu-content class="w-56">
            <div ui-dropdown-menu-label>Panel position</div>
            <div ui-dropdown-menu-separator></div>
            <div ui-dropdown-menu-radio-group [value]="position" (valueChange)="position = $event">
              <div ui-dropdown-menu-radio-item value="top">Top</div>
              <div ui-dropdown-menu-radio-item value="center">Center</div>
              <div ui-dropdown-menu-radio-item value="bottom">Bottom</div>
            </div>
          </ui-dropdown-menu-content>
        </ui-dropdown-menu>
      }
      @case ('With submenus') {
        <ui-dropdown-menu>
          <button ui-button ui-dropdown-menu-trigger variant="outline">Help</button>
          <ui-dropdown-menu-content class="w-56">
            <div ui-dropdown-menu-item>
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
            <div ui-dropdown-menu-item>
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
                class="lucide lucide-git-branch size-4"
                aria-hidden="true"
              >
                <path d="M15 6a9 9 0 0 0-9 9V3" />
                <circle cx="18" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
              </svg>
              GitHub
            </div>
            <ui-dropdown-menu-sub>
              <div ui-dropdown-menu-sub-trigger>
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
                  class="lucide lucide-user-plus size-4"
                  aria-hidden="true"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" x2="19" y1="8" y2="14" />
                  <line x1="22" x2="16" y1="11" y2="11" />
                </svg>
                Invite teammates
              </div>
              <ui-dropdown-menu-sub-content>
                <div ui-dropdown-menu-item>
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
                </div>
                <div ui-dropdown-menu-item>
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
                    class="lucide lucide-message-square size-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"
                    />
                  </svg>
                  Message
                </div>
                <div ui-dropdown-menu-separator></div>
                <div ui-dropdown-menu-item>
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
                    class="lucide lucide-circle-plus size-4"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                    <path d="M12 8v8" />
                  </svg>
                  Send invite link
                </div>
              </ui-dropdown-menu-sub-content>
            </ui-dropdown-menu-sub>
            <div ui-dropdown-menu-item>
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
                class="lucide lucide-circle-help size-4"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              Keyboard shortcuts
            </div>
            <div ui-dropdown-menu-separator></div>
            <div ui-dropdown-menu-item disabled>
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
                class="lucide lucide-cloud size-4"
                aria-hidden="true"
              >
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
              API (coming soon)
            </div>
          </ui-dropdown-menu-content>
        </ui-dropdown-menu>
      }
      @case ('Icon trigger (row action)') {
        <ui-dropdown-menu>
          <button ui-button ui-dropdown-menu-trigger variant="ghost" size="icon" aria-label="Row actions">
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
          <ui-dropdown-menu-content align="end" class="w-44">
            <div ui-dropdown-menu-item>Duplicate</div>
            <div ui-dropdown-menu-item>Rename…</div>
            <div ui-dropdown-menu-item>Move to folder…</div>
            <div ui-dropdown-menu-separator></div>
            <div ui-dropdown-menu-item class="text-destructive focus:text-destructive">Delete</div>
          </ui-dropdown-menu-content>
        </ui-dropdown-menu>
      }
      @case ('Action menu') {
        <ui-dropdown-menu>
          <button ui-button ui-dropdown-menu-trigger>
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
              class="lucide lucide-plus size-3.5"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New<svg
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
          <ui-dropdown-menu-content align="start" class="w-44">
            <div ui-dropdown-menu-item>
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
              Project
            </div>
            <div ui-dropdown-menu-item>
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
              Team
            </div>
            <div ui-dropdown-menu-item>
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
                class="lucide lucide-cloud size-4"
                aria-hidden="true"
              >
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
              Workspace
            </div>
          </ui-dropdown-menu-content>
        </ui-dropdown-menu>
      }
    }
  `,
})
export class AngularDropdownMenuDemoComponent {
  @Input() story = 'Account menu'
  showStatus = true
  showActivity = false
  showPanel = true
  position = 'center'
}
