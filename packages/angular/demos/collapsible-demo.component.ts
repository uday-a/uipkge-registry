import { Component, Input } from '@angular/core'
import {
  UiCollapsibleComponent,
  UiCollapsibleContentComponent,
  UiCollapsibleTriggerComponent,
} from '../../../../../packages/registry-angular/components/collapsible/collapsible.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

/** Angular demo for the collapsible page. Mirrors demos/react/collapsible.tsx story by story. */
@Component({
  selector: 'angular-collapsible-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiCollapsibleComponent, UiCollapsibleTriggerComponent, UiCollapsibleContentComponent, UiButtonComponent],
  template: `
    @switch (story) {
      @case ('Controlled') {
        <div class="space-y-3">
          <div ui-collapsible [open]="open" (openChange)="open = $event" class="max-w-md">
            <div class="flex items-center justify-between gap-3 rounded-md border px-4 py-2">
              <h4 class="text-sm font-medium">&#64;uipkge starred 3 repositories</h4>
              <button ui-button ui-collapsible-trigger variant="ghost" size="icon-sm">
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
                  class="lucide lucide-chevrons-up-down size-4"
                  aria-hidden="true"
                >
                  <path d="m7 15 5 5 5-5" />
                  <path d="m7 9 5-5 5 5" />
                </svg>
                <span class="sr-only">Toggle</span>
              </button>
            </div>
            <div class="mt-1 rounded-md border px-4 py-2 font-mono text-sm">&#64;radix-ui/primitives</div>
            <div ui-collapsible-content class="mt-1 space-y-1">
              <div class="rounded-md border px-4 py-2 font-mono text-sm">&#64;stitches/react</div>
              <div class="rounded-md border px-4 py-2 font-mono text-sm">&#64;vueuse/core</div>
            </div>
          </div>
          <p class="text-muted-foreground text-xs">
            Open: <code class="text-foreground">{{ open }}</code>
          </p>
        </div>
      }
      @case ('Uncontrolled') {
        <div ui-collapsible defaultOpen class="max-w-md">
          <div class="flex items-center justify-between gap-3 rounded-md border px-4 py-2">
            <h4 class="text-sm font-medium">Today's reminders</h4>
            <button ui-button ui-collapsible-trigger variant="ghost" size="icon-sm">
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
                class="lucide lucide-chevrons-up-down size-4"
                aria-hidden="true"
              >
                <path d="m7 15 5 5 5-5" />
                <path d="m7 9 5-5 5 5" />
              </svg>
              <span class="sr-only">Toggle</span>
            </button>
          </div>
          <div ui-collapsible-content class="mt-1 space-y-1">
            <div class="rounded-md border px-4 py-2 text-sm">Stand-up at 10:00</div>
            <div class="rounded-md border px-4 py-2 text-sm">Design review at 14:30</div>
            <div class="rounded-md border px-4 py-2 text-sm">Submit timesheet</div>
          </div>
        </div>
      }
      @case ('Button trigger') {
        <div ui-collapsible [open]="buttonOpen" (openChange)="buttonOpen = $event" class="max-w-md">
          <button ui-button ui-collapsible-trigger variant="outline" size="sm">
            @if (buttonOpen) {
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
                class="lucide lucide-minus size-4"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
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
                class="lucide lucide-plus size-4"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            }
            {{ buttonOpen ? 'Hide details' : 'Show details' }}
          </button>
          <div ui-collapsible-content class="mt-2 rounded-md border px-4 py-3 text-sm">
            <p class="font-medium">Order #18412</p>
            <p class="text-muted-foreground mt-1">Shipped via UPS Ground · Estimated delivery May 12.</p>
          </div>
        </div>
      }
      @case ('Long content') {
        <div ui-collapsible defaultOpen class="max-w-md">
          <div class="flex items-center justify-between gap-3 rounded-md border px-4 py-2">
            <h4 class="text-sm font-medium">Recent commits (12)</h4>
            <button ui-button ui-collapsible-trigger variant="ghost" size="icon-sm">
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
                class="lucide lucide-chevrons-up-down size-4"
                aria-hidden="true"
              >
                <path d="m7 15 5 5 5-5" />
                <path d="m7 9 5-5 5 5" />
              </svg>
              <span class="sr-only">Toggle</span>
            </button>
          </div>
          <div ui-collapsible-content class="mt-1 space-y-1">
            @for (name of commits; track name; let i = $index) {
              <div class="rounded-md border px-4 py-2 font-mono text-xs">
                <span class="text-muted-foreground">0a1b2c{{ i + 1 }}</span>
                <span class="ml-2">refactor: extract use{{ name }} composable</span>
              </div>
            }
          </div>
        </div>
      }
      @case ('Animated chevron rotation') {
        <div ui-collapsible [open]="chevronOpen" (openChange)="chevronOpen = $event" class="max-w-md">
          <button ui-button ui-collapsible-trigger variant="ghost" class="w-full justify-between">
            <span class="font-medium">Advanced options</span>
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
              [attr.class]="
                'lucide lucide-chevrons-up-down size-4 transition-transform duration-200' +
                (chevronOpen ? ' rotate-180' : '')
              "
              aria-hidden="true"
            >
              <path d="m7 15 5 5 5-5" />
              <path d="m7 9 5-5 5 5" />
            </svg>
          </button>
          <div ui-collapsible-content class="mt-2 space-y-1.5">
            <div class="rounded-md border px-4 py-2 text-sm">
              <span class="text-muted-foreground">Webhook URL</span>
              <code class="text-foreground/90 ml-2 font-mono text-xs">https://api.example.com/hooks</code>
            </div>
            <div class="rounded-md border px-4 py-2 text-sm">
              <span class="text-muted-foreground">Retry policy</span>
              <span class="ml-2">Exponential backoff, max 5</span>
            </div>
            <div class="rounded-md border px-4 py-2 text-sm">
              <span class="text-muted-foreground">Timeout</span>
              <span class="ml-2">30s</span>
            </div>
          </div>
        </div>
      }
    }
  `,
})
export class AngularCollapsibleDemoComponent {
  @Input() story = 'Controlled'
  open = true
  buttonOpen = false
  chevronOpen = false
  readonly commits = ['Auth', 'Theme', 'Toast', 'Form', 'Query', 'Cache', 'Sidebar', 'Modal']
}
