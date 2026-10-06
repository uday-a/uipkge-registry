import { Component, Input } from '@angular/core'
import { UiSectionCardComponent } from '../../../../../packages/registry-angular/components/section-card/section-card.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'
import { UiInputComponent } from '../../../../../packages/registry-angular/components/input/input.component'
import { UiTextareaComponent } from '../../../../../packages/registry-angular/components/textarea/textarea.component'

/** Angular demo for the section-card page. Mirrors demos/react/section-card.tsx story by story. */
@Component({
  selector: 'angular-section-card-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiSectionCardComponent, UiButtonComponent, UiLabelComponent, UiInputComponent, UiTextareaComponent],
  template: `
    @switch (story) {
      @case ('With icon action') {
        <div ui-section-card title="Account settings" description="Manage your profile and preferences.">
          <ng-container ngProjectAs="[slot=header-action]"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-settings text-muted-foreground size-4"
              aria-hidden="true"
            >
              <path
                d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
              />
              <circle cx="12" cy="12" r="3" /></svg
          ></ng-container>
          <p class="text-muted-foreground text-sm">
            Use SectionCard to wrap a labeled section with optional header description and a corner action.
          </p>
        </div>
      }
      @case ('Without action') {
        <div ui-section-card title="About" description="A short summary of this account.">
          <p class="text-muted-foreground text-sm">
            No action slot is rendered here, so the title aligns flush with no trailing affordance.
          </p>
        </div>
      }
      @case ('Multiple actions') {
        <div ui-section-card title="Team members" description="People with access to this workspace.">
          <ng-container ngProjectAs="[slot=header-action]"
            ><div class="flex items-center gap-2">
              <button ui-button variant="outline" size="sm">
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
                  class="lucide lucide-refresh-cw size-3.5"
                  aria-hidden="true"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
                Sync
              </button>
              <button ui-button size="sm">
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
                Invite
              </button>
              <button ui-button variant="ghost" size="icon-sm">
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
              </button></div
          ></ng-container>
          <ul class="space-y-2 text-sm">
            <li class="flex justify-between">
              <span>Alice Anderson</span>
              <span class="text-muted-foreground">Owner</span>
            </li>
            <li class="flex justify-between">
              <span>Bob Bailey</span>
              <span class="text-muted-foreground">Admin</span>
            </li>
            <li class="flex justify-between">
              <span>Carol Chen</span>
              <span class="text-muted-foreground">Member</span>
            </li>
          </ul>
        </div>
      }
      @case ('Stacked sections') {
        <div class="space-y-4">
          <div ui-section-card title="Profile" description="Your public-facing identity.">
            <p class="text-muted-foreground text-sm">Name, avatar, and bio.</p>
          </div>
          <div ui-section-card title="Notifications" description="Email and in-app preferences.">
            <p class="text-muted-foreground text-sm">Choose which events alert you and how.</p>
          </div>
          <div ui-section-card title="Danger zone" description="Irreversible actions for this account.">
            <ng-container ngProjectAs="[slot=header-action]"
              ><button ui-button variant="destructive" size="sm">Delete account</button></ng-container
            >
            <p class="text-muted-foreground text-sm">Once deleted, your account cannot be recovered.</p>
          </div>
        </div>
      }
      @case ('With form content') {
        <div ui-section-card title="Personal info" description="Used on invoices and team emails.">
          <ng-container ngProjectAs="[slot=header-action]"><button ui-button size="sm">Save</button></ng-container>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label ui-label for="sc-name">Full name</label>
              <ui-input id="sc-name" placeholder="Jane Doe" />
            </div>
            <div class="space-y-1.5">
              <label ui-label for="sc-email">Email</label>
              <ui-input id="sc-email" type="email" placeholder="jane@acme.com" />
            </div>
            <div class="space-y-1.5 sm:col-span-2">
              <label ui-label for="sc-bio">Bio</label>
              <ui-textarea id="sc-bio" placeholder="A short bio…" [rows]="3" />
            </div>
          </div>
        </div>
      }
    }
  `,
})
export class AngularSectionCardDemoComponent {
  @Input() story = 'With icon action'
}
