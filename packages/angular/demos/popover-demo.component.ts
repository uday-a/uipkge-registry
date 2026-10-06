import { Component, Input, signal } from '@angular/core'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import { UiCalendarComponent } from '../../../../../packages/registry-angular/components/calendar/calendar.component'
import { UiInputComponent } from '../../../../../packages/registry-angular/components/input/input.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'
import {
  UiPopoverComponent,
  UiPopoverContentComponent,
  UiPopoverTriggerComponent,
} from '../../../../../packages/registry-angular/components/popover/popover.component'
import {
  UiRadioGroupComponent,
  UiRadioGroupItemComponent,
} from '../../../../../packages/registry-angular/components/radio-group/radio-group.component'

/** Angular demo for the popover page. Mirrors demos/react/popover.tsx story by story. */
@Component({
  selector: 'angular-popover-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiButtonComponent,
    UiCalendarComponent,
    UiInputComponent,
    UiLabelComponent,
    UiPopoverComponent,
    UiPopoverTriggerComponent,
    UiPopoverContentComponent,
    UiRadioGroupComponent,
    UiRadioGroupItemComponent,
  ],
  template: `
    @switch (story) {
      @case ('With form fields') {
        <ui-popover>
          <button ui-button variant="outline" ui-popover-trigger>Open popover</button>
          <ui-popover-content class="w-80">
            <div class="space-y-2">
              <h4 class="leading-none font-medium">Dimensions</h4>
              <p class="text-muted-foreground text-sm">Set the dimensions for the layer.</p>
            </div>
            <div class="mt-4 grid gap-2">
              <div class="grid grid-cols-3 items-center gap-3">
                <label ui-label for="width">Width</label>
                <ui-input id="width" defaultValue="100%" class="col-span-2 h-8" />
              </div>
              <div class="grid grid-cols-3 items-center gap-3">
                <label ui-label for="height">Height</label>
                <ui-input id="height" defaultValue="25px" class="col-span-2 h-8" />
              </div>
            </div>
          </ui-popover-content>
        </ui-popover>
      }
      @case ('Compact info') {
        <ui-popover>
          <button ui-button variant="ghost" size="sm" ui-popover-trigger>Show details</button>
          <ui-popover-content class="w-56 space-y-1 text-sm">
            <p class="font-medium">Active session</p>
            <p class="text-muted-foreground text-xs">Started 2h ago · IP 192.0.2.1</p>
          </ui-popover-content>
        </ui-popover>
      }
      @case ('Sides + alignment') {
        <div class="flex flex-wrap items-center gap-3">
          <ui-popover>
            <button ui-button variant="outline" size="sm" ui-popover-trigger>Top · start</button>
            <ui-popover-content side="top" align="start" class="w-44">
              Aligned to the start of the trigger's top edge.
            </ui-popover-content>
          </ui-popover>
          <ui-popover>
            <button ui-button variant="outline" size="sm" ui-popover-trigger>Right · center</button>
            <ui-popover-content side="right" align="center" class="w-44"
              >Centered on the right side.</ui-popover-content
            >
          </ui-popover>
          <ui-popover>
            <button ui-button variant="outline" size="sm" ui-popover-trigger>Bottom · end</button>
            <ui-popover-content side="bottom" align="end" class="w-44"
              >Aligned to the end of the bottom edge.</ui-popover-content
            >
          </ui-popover>
        </div>
      }
      @case ('Filter chips') {
        <ui-popover>
          <button ui-button variant="outline" size="sm" ui-popover-trigger>
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
              class="lucide lucide-funnel size-3.5"
              aria-hidden="true"
            >
              <path
                d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"
              />
            </svg>
            Filters
          </button>
          <ui-popover-content class="w-72">
            <div class="space-y-3">
              <div class="space-y-1.5">
                <label ui-label class="text-muted-foreground text-xs tracking-wider uppercase">Status</label>
                <ui-radio-group [value]="status()" (valueChange)="status.set($event)" class="flex gap-3">
                  <label class="flex items-center gap-1.5 text-sm"> <ui-radio-group-item value="all" /> All </label>
                  <label class="flex items-center gap-1.5 text-sm">
                    <ui-radio-group-item value="active" /> Active
                  </label>
                  <label class="flex items-center gap-1.5 text-sm">
                    <ui-radio-group-item value="archived" /> Archived
                  </label>
                </ui-radio-group>
              </div>
              <div class="space-y-1.5">
                <label ui-label class="text-muted-foreground text-xs tracking-wider uppercase">Tier</label>
                <ui-radio-group [value]="tier()" (valueChange)="tier.set($event)" class="flex gap-3">
                  <label class="flex items-center gap-1.5 text-sm"> <ui-radio-group-item value="free" /> Free </label>
                  <label class="flex items-center gap-1.5 text-sm"> <ui-radio-group-item value="pro" /> Pro </label>
                  <label class="flex items-center gap-1.5 text-sm">
                    <ui-radio-group-item value="ent" /> Enterprise
                  </label>
                </ui-radio-group>
              </div>
            </div>
          </ui-popover-content>
        </ui-popover>
      }
      @case ('Icon-only quick actions') {
        <div class="flex items-center gap-2">
          <ui-popover>
            <button ui-button variant="ghost" size="icon" aria-label="Settings" ui-popover-trigger>
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
            <ui-popover-content class="w-48 text-sm">
              <p class="mb-2 font-medium">Quick settings</p>
              <p class="text-muted-foreground text-xs">Choose a default view for new tabs.</p>
            </ui-popover-content>
          </ui-popover>

          <ui-popover>
            <button ui-button variant="ghost" size="icon" aria-label="Share" ui-popover-trigger>
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
                class="lucide lucide-share-2"
                aria-hidden="true"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
              </svg>
            </button>
            <ui-popover-content class="w-48 space-y-1.5">
              <button ui-button variant="ghost" size="sm" class="w-full justify-start">Copy link</button>
              <button ui-button variant="ghost" size="sm" class="w-full justify-start">Email</button>
              <button ui-button variant="ghost" size="sm" class="w-full justify-start">Slack</button>
            </ui-popover-content>
          </ui-popover>

          <ui-popover>
            <button ui-button variant="ghost" size="icon" aria-label="Schedule" ui-popover-trigger>
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
                class="lucide lucide-calendar-days"
                aria-hidden="true"
              >
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
            </button>
            <ui-popover-content class="w-auto p-0">
              <ui-calendar mode="single" />
            </ui-popover-content>
          </ui-popover>

          <ui-popover>
            <button ui-button variant="ghost" size="icon" aria-label="More" ui-popover-trigger>
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
                class="lucide lucide-ellipsis"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="1" />
                <circle cx="19" cy="12" r="1" />
                <circle cx="5" cy="12" r="1" />
              </svg>
            </button>
            <ui-popover-content align="end" class="w-44 space-y-0.5">
              <button ui-button variant="ghost" size="sm" class="w-full justify-start">Duplicate</button>
              <button ui-button variant="ghost" size="sm" class="w-full justify-start">Archive</button>
              <button
                ui-button
                variant="ghost"
                size="sm"
                class="text-destructive hover:text-destructive w-full justify-start"
              >
                Delete
              </button>
            </ui-popover-content>
          </ui-popover>
        </div>
      }
      @case ('Controlled with v-model:open') {
        <div class="flex items-center gap-3">
          <ui-popover [open]="open()" (openChange)="open.set($event)">
            <button ui-button variant="outline" ui-popover-trigger>Toggle externally</button>
            <ui-popover-content class="w-64 text-sm">
              <p>Controlled via v-model:open.</p>
              <p class="text-muted-foreground mt-1 text-xs">Click 'Close' to dismiss.</p>
              <button ui-button size="sm" variant="outline" class="mt-3" (click)="open.set(false)">Close</button>
            </ui-popover-content>
          </ui-popover>
          <span class="text-muted-foreground text-xs">open = {{ open() }}</span>
        </div>
      }
      @case ('Persistent (localStorage)') {
        <ui-popover persist="demo-persist-1">
          <button ui-button variant="outline" ui-popover-trigger>Toggle, then reload</button>
          <ui-popover-content>I remember my state across reloads.</ui-popover-content>
        </ui-popover>
      }
      @case ('Close behavior - manual') {
        <ui-popover closeBehavior="manual">
          <button ui-button variant="outline" ui-popover-trigger>Open manual</button>
          <ui-popover-content>
            <div class="space-y-2">
              <p class="text-sm">I won't close on outside click or Escape.</p>
              <button ui-button size="sm" variant="outline" ui-popover-trigger>Close</button>
            </div>
          </ui-popover-content>
        </ui-popover>
      }
      @case ('Close behavior - click-outside only') {
        <ui-popover closeBehavior="click-outside">
          <button ui-button variant="outline" ui-popover-trigger>Open click-outside-only</button>
          <ui-popover-content>Press Escape - nothing happens. Click outside - I close.</ui-popover-content>
        </ui-popover>
      }
    }
  `,
})
export class AngularPopoverDemoComponent {
  @Input() story = 'With form fields'
  readonly status = signal('active')
  readonly tier = signal('pro')
  readonly open = signal(false)
}
