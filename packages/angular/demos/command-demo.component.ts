import { Component, Input, signal } from '@angular/core'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import {
  UiCommandComponent,
  UiCommandDialogComponent,
  UiCommandEmptyComponent,
  UiCommandGroupComponent,
  UiCommandInputComponent,
  UiCommandItemComponent,
  UiCommandListComponent,
  UiCommandSeparatorComponent,
  UiCommandShortcutComponent,
} from '../../../../../packages/registry-angular/components/command/command.component'

/** Angular demo for the command page. Mirrors demos/react/command.tsx story by story. */
@Component({
  selector: 'angular-command-demo',
  standalone: true,
  host: { class: 'block', '(document:keydown)': 'onDocumentKeydown($event)' },
  imports: [
    UiButtonComponent,
    UiCommandComponent,
    UiCommandDialogComponent,
    UiCommandEmptyComponent,
    UiCommandGroupComponent,
    UiCommandInputComponent,
    UiCommandItemComponent,
    UiCommandListComponent,
    UiCommandSeparatorComponent,
    UiCommandShortcutComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-command class="max-w-md rounded-lg border shadow-sm">
          <ui-command-input placeholder="Type a command or search…" />
          <ui-command-list>
            <ui-command-empty>No results found.</ui-command-empty>
            <ui-command-group heading="Suggestions">
              <ui-command-item value="calendar">
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
                  class="lucide lucide-calendar"
                  aria-hidden="true"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                </svg>
                Calendar
              </ui-command-item>
              <ui-command-item value="emoji">
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
                  class="lucide lucide-smile"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" x2="9.01" y1="9" y2="9" />
                  <line x1="15" x2="15.01" y1="9" y2="9" />
                </svg>
                Search emoji
              </ui-command-item>
              <ui-command-item value="profile">
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
                  class="lucide lucide-user"
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile
              </ui-command-item>
            </ui-command-group>
          </ui-command-list>
        </ui-command>
      }
      @case ('With shortcuts') {
        <ui-command class="max-w-md rounded-lg border shadow-sm">
          <ui-command-input placeholder="Search actions…" />
          <ui-command-list>
            <ui-command-empty>No results found.</ui-command-empty>
            <ui-command-group heading="Actions">
              <ui-command-item value="profile">
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
                  class="lucide lucide-user"
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile<ui-command-shortcut>⌘P</ui-command-shortcut>
              </ui-command-item>
              <ui-command-item value="mail">
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
                Mail<ui-command-shortcut>⌘M</ui-command-shortcut>
              </ui-command-item>
              <ui-command-item value="settings">
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
                  class="lucide lucide-settings"
                  aria-hidden="true"
                >
                  <path
                    d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Settings<ui-command-shortcut>⌘,</ui-command-shortcut>
              </ui-command-item>
            </ui-command-group>
          </ui-command-list>
        </ui-command>
      }
      @case ('Multiple groups + separator') {
        <ui-command class="max-w-md rounded-lg border shadow-sm">
          <ui-command-input placeholder="Type a command or search…" />
          <ui-command-list>
            <ui-command-empty>No results found.</ui-command-empty>
            <ui-command-group heading="Suggestions">
              <ui-command-item value="calendar">
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
                  class="lucide lucide-calendar"
                  aria-hidden="true"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                </svg>
                Calendar
              </ui-command-item>
              <ui-command-item value="emoji">
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
                  class="lucide lucide-smile"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" x2="9.01" y1="9" y2="9" />
                  <line x1="15" x2="15.01" y1="9" y2="9" />
                </svg>
                Search emoji
              </ui-command-item>
              <ui-command-item value="calculator">
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
                  class="lucide lucide-calculator"
                  aria-hidden="true"
                >
                  <rect width="16" height="20" x="4" y="2" rx="2" />
                  <line x1="8" x2="16" y1="6" y2="6" />
                  <line x1="16" x2="16" y1="14" y2="18" />
                  <path d="M16 10h.01" />
                  <path d="M12 10h.01" />
                  <path d="M8 10h.01" />
                  <path d="M12 14h.01" />
                  <path d="M8 14h.01" />
                  <path d="M12 18h.01" />
                  <path d="M8 18h.01" />
                </svg>
                Calculator
              </ui-command-item>
            </ui-command-group>
            <ui-command-separator />
            <ui-command-group heading="Settings">
              <ui-command-item value="profile">
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
                  class="lucide lucide-user"
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile<ui-command-shortcut>⌘P</ui-command-shortcut>
              </ui-command-item>
              <ui-command-item value="billing">
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
                  class="lucide lucide-credit-card"
                  aria-hidden="true"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                Billing<ui-command-shortcut>⌘B</ui-command-shortcut>
              </ui-command-item>
              <ui-command-item value="settings">
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
                  class="lucide lucide-settings"
                  aria-hidden="true"
                >
                  <path
                    d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Settings<ui-command-shortcut>⌘S</ui-command-shortcut>
              </ui-command-item>
            </ui-command-group>
          </ui-command-list>
        </ui-command>
      }
      @case ('CommandDialog (modal)') {
        <div class="flex items-center gap-2">
          <button ui-button variant="outline" (click)="dialogOpen.set(true)">
            Open command menu
            <kbd class="bg-muted text-muted-foreground ml-2 rounded px-1.5 py-0.5 text-xs">⌘K</kbd>
          </button>
          <span class="text-muted-foreground text-sm">open = {{ dialogOpen() }}</span>
        </div>
        <ui-command-dialog [open]="dialogOpen()" (openChange)="dialogOpen.set($event)">
          <ui-command-input placeholder="Type a command or search…" />
          <ui-command-list>
            <ui-command-empty>No results found.</ui-command-empty>
            <ui-command-group heading="Suggestions">
              <ui-command-item value="calendar" (select)="dialogOpen.set(false)">
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
                  class="lucide lucide-calendar"
                  aria-hidden="true"
                >
                  <path d="M8 2v4" />
                  <path d="M16 2v4" />
                  <rect width="18" height="18" x="3" y="4" rx="2" />
                  <path d="M3 10h18" />
                </svg>
                Calendar
              </ui-command-item>
              <ui-command-item value="emoji" (select)="dialogOpen.set(false)">
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
                  class="lucide lucide-smile"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" x2="9.01" y1="9" y2="9" />
                  <line x1="15" x2="15.01" y1="9" y2="9" />
                </svg>
                Search emoji
              </ui-command-item>
              <ui-command-item value="calculator" (select)="dialogOpen.set(false)">
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
                  class="lucide lucide-calculator"
                  aria-hidden="true"
                >
                  <rect width="16" height="20" x="4" y="2" rx="2" />
                  <line x1="8" x2="16" y1="6" y2="6" />
                  <line x1="16" x2="16" y1="14" y2="18" />
                  <path d="M16 10h.01" />
                  <path d="M12 10h.01" />
                  <path d="M8 10h.01" />
                  <path d="M12 14h.01" />
                  <path d="M8 14h.01" />
                  <path d="M12 18h.01" />
                  <path d="M8 18h.01" />
                </svg>
                Calculator
              </ui-command-item>
            </ui-command-group>
            <ui-command-separator />
            <ui-command-group heading="Settings">
              <ui-command-item value="profile" (select)="dialogOpen.set(false)">
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
                  class="lucide lucide-user"
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile<ui-command-shortcut>⌘P</ui-command-shortcut>
              </ui-command-item>
              <ui-command-item value="settings" (select)="dialogOpen.set(false)">
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
                  class="lucide lucide-settings"
                  aria-hidden="true"
                >
                  <path
                    d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Settings<ui-command-shortcut>⌘S</ui-command-shortcut>
              </ui-command-item>
            </ui-command-group>
          </ui-command-list>
        </ui-command-dialog>
      }
      @case ('Loading & empty state') {
        <div class="max-w-md space-y-3">
          <button ui-button variant="outline" size="sm" (click)="loading.set(!loading())">
            Toggle: {{ loading() ? 'Loading' : 'Empty' }}
          </button>
          <ui-command class="rounded-lg border shadow-sm">
            <ui-command-input placeholder="Search…" />
            <ui-command-list>
              @if (loading()) {
                <div class="space-y-2 p-3">
                  <div class="bg-muted h-4 w-3/4 animate-pulse rounded"></div>
                  <div class="bg-muted h-4 w-1/2 animate-pulse rounded"></div>
                  <div class="bg-muted h-4 w-2/3 animate-pulse rounded"></div>
                </div>
              } @else {
                <ui-command-empty>No results found.</ui-command-empty>
              }
            </ui-command-list>
          </ui-command>
        </div>
      }
    }
  `,
})
export class AngularCommandDemoComponent {
  @Input() story = 'Default'
  readonly dialogOpen = signal(false)
  readonly loading = signal(true)

  /** Cmd-K binding for the dialog story. */
  onDocumentKeydown(event: KeyboardEvent): void {
    if (this.story !== 'CommandDialog (modal)') return
    if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      this.dialogOpen.update((v) => !v)
    }
  }
}
