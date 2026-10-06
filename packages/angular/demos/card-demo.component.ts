import { Component, Input } from '@angular/core'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardFooterComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

/** Angular demo for the card page. Mirrors demos/react/card.tsx story by story. */
@Component({
  selector: 'angular-card-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
    UiCardFooterComponent,
    UiBadgeComponent,
    UiButtonComponent,
  ],
  template: `
    @switch (story) {
      @case ('Simple') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>Simple card</h3>
            <p ui-card-description>A basic Card with header and content.</p>
          </div>
          <div ui-card-content>
            <p class="text-sm">
              Cards group related content. They include headers, content, and footers — each as separate slots.
            </p>
          </div>
        </div>
      }
      @case ('With footer actions') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>Edit profile</h3>
            <p ui-card-description>Update your account details.</p>
          </div>
          <div ui-card-content>
            <p class="text-muted-foreground text-sm">Form fields go here.</p>
          </div>
          <div ui-card-footer class="gap-2 border-t pt-4">
            <button ui-button size="sm">Save</button>
            <button ui-button variant="ghost" size="sm">Cancel</button>
          </div>
        </div>
      }
      @case ('With header action') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <div class="flex items-start justify-between">
              <div>
                <h3 ui-card-title>Recent activity</h3>
                <p ui-card-description>Last 7 days.</p>
              </div>
              <button ui-button variant="ghost" size="icon-sm" class="-mt-1 -mr-2">
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
                  class="lucide lucide-arrow-up-right size-4"
                  aria-hidden="true"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </button>
            </div>
          </div>
          <div ui-card-content>
            <p class="text-muted-foreground text-sm">No new activity.</p>
          </div>
        </div>
      }
      @case ('Pricing card') {
        <div ui-card class="border-primary max-w-sm">
          <div ui-card-header>
            <span ui-badge class="w-fit">Recommended</span>
            <h3 ui-card-title class="mt-2">Pro plan</h3>
            <p ui-card-description>$24 / month, billed annually.</p>
          </div>
          <div ui-card-content class="space-y-2 text-sm">
            <p class="flex gap-2">
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
                class="lucide lucide-check size-4 text-emerald-500"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Unlimited projects
            </p>
            <p class="flex gap-2">
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
                class="lucide lucide-check size-4 text-emerald-500"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Priority support
            </p>
            <p class="flex gap-2">
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
                class="lucide lucide-check size-4 text-emerald-500"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Custom themes
            </p>
          </div>
          <div ui-card-footer>
            <button ui-button class="w-full">Choose Pro</button>
          </div>
        </div>
      }
    }
  `,
})
export class AngularCardDemoComponent {
  @Input() story = 'Simple'
}
