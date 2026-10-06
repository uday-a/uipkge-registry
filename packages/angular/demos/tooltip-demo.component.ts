import { Component, Input } from '@angular/core'
import {
  UiTooltipComponent,
  UiTooltipContentComponent,
  UiTooltipProviderComponent,
  UiTooltipTriggerComponent,
} from '../../../../../packages/registry-angular/components/tooltip/tooltip.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

/**
 * Angular demo for the tooltip page. Mirrors demos/react/tooltip.tsx story by story; the
 * React demo wraps every story in one TooltipProvider (delayDuration 200), each Angular story
 * is its own app so each carries that provider.
 */
@Component({
  selector: 'angular-tooltip-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiTooltipProviderComponent,
    UiTooltipComponent,
    UiTooltipTriggerComponent,
    UiTooltipContentComponent,
    UiButtonComponent,
  ],
  template: `
    @switch (story) {
      @case ('Basic') {
        <ui-tooltip-provider [delayDuration]="200">
          <ui-tooltip>
            <button ui-button ui-tooltip-trigger variant="outline">Hover me</button>
            <ui-tooltip-content>Tooltip content</ui-tooltip-content>
          </ui-tooltip>
        </ui-tooltip-provider>
      }
      @case ('Sides') {
        <ui-tooltip-provider [delayDuration]="200">
          <div class="flex flex-wrap gap-3">
            <ui-tooltip>
              <button ui-button ui-tooltip-trigger variant="outline" size="sm">Top</button>
              <ui-tooltip-content side="top">Top placement</ui-tooltip-content>
            </ui-tooltip>
            <ui-tooltip>
              <button ui-button ui-tooltip-trigger variant="outline" size="sm">Right</button>
              <ui-tooltip-content side="right">Right placement</ui-tooltip-content>
            </ui-tooltip>
            <ui-tooltip>
              <button ui-button ui-tooltip-trigger variant="outline" size="sm">Bottom</button>
              <ui-tooltip-content side="bottom">Bottom placement</ui-tooltip-content>
            </ui-tooltip>
            <ui-tooltip>
              <button ui-button ui-tooltip-trigger variant="outline" size="sm">Left</button>
              <ui-tooltip-content side="left">Left placement</ui-tooltip-content>
            </ui-tooltip>
          </div>
        </ui-tooltip-provider>
      }
      @case ('Icon-only buttons') {
        <ui-tooltip-provider [delayDuration]="200">
          <div class="flex items-center gap-2">
            <ui-tooltip>
              <button ui-button ui-tooltip-trigger variant="ghost" size="icon" aria-label="Settings">
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
              </button>
              <ui-tooltip-content>Settings</ui-tooltip-content>
            </ui-tooltip>
            <ui-tooltip>
              <button ui-button ui-tooltip-trigger variant="ghost" size="icon" aria-label="Notifications">
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
                  class="lucide lucide-bell"
                  aria-hidden="true"
                >
                  <path d="M10.268 21a2 2 0 0 0 3.464 0" />
                  <path
                    d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
                  />
                </svg>
              </button>
              <ui-tooltip-content>Notifications</ui-tooltip-content>
            </ui-tooltip>
            <ui-tooltip>
              <button ui-button ui-tooltip-trigger variant="ghost" size="icon" aria-label="Copy link">
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
                  class="lucide lucide-copy"
                  aria-hidden="true"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              </button>
              <ui-tooltip-content>Copy link</ui-tooltip-content>
            </ui-tooltip>
            <ui-tooltip>
              <button ui-button ui-tooltip-trigger variant="ghost" size="icon" aria-label="Open on GitHub">
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
                  class="lucide lucide-git-branch"
                  aria-hidden="true"
                >
                  <path d="M15 6a9 9 0 0 0-9 9V3" />
                  <circle cx="18" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                </svg>
              </button>
              <ui-tooltip-content>Open on GitHub</ui-tooltip-content>
            </ui-tooltip>
            <ui-tooltip>
              <button
                ui-button
                ui-tooltip-trigger
                variant="ghost"
                size="icon"
                aria-label="Delete"
                class="text-destructive hover:text-destructive"
              >
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
              </button>
              <ui-tooltip-content>Delete</ui-tooltip-content>
            </ui-tooltip>
          </div>
        </ui-tooltip-provider>
      }
      @case ('With shortcut hint') {
        <ui-tooltip-provider [delayDuration]="200">
          <ui-tooltip>
            <button ui-button ui-tooltip-trigger variant="outline">
              @if (visible) {
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
                  class="lucide lucide-eye size-4"
                  aria-hidden="true"
                >
                  <path
                    d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
                  />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              } @else {
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
                  class="lucide lucide-eye-off size-4"
                  aria-hidden="true"
                >
                  <path
                    d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
                  />
                  <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                  <path
                    d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
                  />
                  <path d="m2 2 20 20" />
                </svg>
              }
              <span>{{ visible ? 'Visible' : 'Hidden' }}</span>
            </button>
            <ui-tooltip-content class="flex items-center gap-2">
              <span>Toggle visibility</span>
              <kbd class="bg-background/20 rounded px-1.5 py-0.5 font-mono text-xs">⌘ ⇧ V</kbd>
            </ui-tooltip-content>
          </ui-tooltip>
        </ui-tooltip-provider>
      }
      @case ('Disabled trigger') {
        <ui-tooltip-provider [delayDuration]="200">
          <ui-tooltip>
            <span ui-tooltip-trigger tabindex="0">
              <button ui-button disabled>Publish</button>
            </span>
            <ui-tooltip-content>Add a title and at least one section before publishing.</ui-tooltip-content>
          </ui-tooltip>
        </ui-tooltip-provider>
      }
      @case ('Custom delay') {
        <ui-tooltip-provider [delayDuration]="200">
          <div class="flex flex-wrap gap-3">
            <ui-tooltip-provider [delayDuration]="0">
              <ui-tooltip>
                <button ui-button ui-tooltip-trigger variant="outline" size="sm">Instant</button>
                <ui-tooltip-content>Opens immediately</ui-tooltip-content>
              </ui-tooltip>
            </ui-tooltip-provider>

            <ui-tooltip-provider [delayDuration]="700">
              <ui-tooltip>
                <button ui-button ui-tooltip-trigger variant="outline" size="sm">Slow</button>
                <ui-tooltip-content>Opens after 700ms</ui-tooltip-content>
              </ui-tooltip>
            </ui-tooltip-provider>
          </div>
        </ui-tooltip-provider>
      }
    }
  `,
})
export class AngularTooltipDemoComponent {
  @Input() story = 'Basic'
  readonly visible = false
}
