import { Component, Input, signal } from '@angular/core'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import {
  UiDialogCloseComponent,
  UiDialogComponent,
  UiDialogContentComponent,
  UiDialogDescriptionComponent,
  UiDialogFooterComponent,
  UiDialogHeaderComponent,
  UiDialogScrollContentComponent,
  UiDialogTitleComponent,
  UiDialogTriggerComponent,
} from '../../../../../packages/registry-angular/components/dialog/dialog.component'
import { UiInputComponent } from '../../../../../packages/registry-angular/components/input/input.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'
import { UiSwitchComponent } from '../../../../../packages/registry-angular/components/switch/switch.component'
import { UiTextareaComponent } from '../../../../../packages/registry-angular/components/textarea/textarea.component'

/** Angular demo for the dialog page. Mirrors demos/react/dialog.tsx story by story. */
@Component({
  selector: 'angular-dialog-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiBadgeComponent,
    UiButtonComponent,
    UiDialogComponent,
    UiDialogTriggerComponent,
    UiDialogContentComponent,
    UiDialogScrollContentComponent,
    UiDialogHeaderComponent,
    UiDialogFooterComponent,
    UiDialogTitleComponent,
    UiDialogDescriptionComponent,
    UiDialogCloseComponent,
    UiInputComponent,
    UiLabelComponent,
    UiSwitchComponent,
    UiTextareaComponent,
  ],
  template: `
    @switch (story) {
      @case ('Form dialog') {
        <ui-dialog>
          <button ui-button variant="outline" ui-dialog-trigger>Edit profile</button>
          <ui-dialog-content class="sm:max-w-md">
            <ui-dialog-header>
              <h2 ui-dialog-title>Edit profile</h2>
              <p ui-dialog-description>Make changes to your profile and save.</p>
            </ui-dialog-header>
            <div class="grid gap-4 py-2">
              <div class="grid gap-2">
                <label ui-label for="dlg-name">Name</label>
                <ui-input id="dlg-name" defaultValue="Pedro Duarte" />
              </div>
              <div class="grid gap-2">
                <label ui-label for="dlg-username">Username</label>
                <ui-input id="dlg-username" defaultValue="&#64;peduarte" />
              </div>
              <div class="grid gap-2">
                <label ui-label for="dlg-bio">Bio</label>
                <ui-textarea id="dlg-bio" defaultValue="Open-source UI for Vue &amp; Nuxt." [rows]="3" />
              </div>
            </div>
            <ui-dialog-footer>
              <button ui-button variant="outline" ui-dialog-close>Cancel</button>
              <button ui-button>Save changes</button>
            </ui-dialog-footer>
          </ui-dialog-content>
        </ui-dialog>
      }
      @case ('Share link') {
        <ui-dialog>
          <button ui-button variant="outline" ui-dialog-trigger>
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
              class="lucide lucide-link-2 size-4"
              aria-hidden="true"
            >
              <path d="M9 17H7A5 5 0 0 1 7 7h2" />
              <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
              <line x1="8" x2="16" y1="12" y2="12" />
            </svg>
            Share link
          </button>
          <ui-dialog-content class="sm:max-w-md">
            <ui-dialog-header>
              <h2 ui-dialog-title>Share registry item</h2>
              <p ui-dialog-description>Anyone with this link can install the component.</p>
            </ui-dialog-header>
            <div class="flex items-center gap-2">
              <ui-input [value]="shareUrl()" [readonly]="true" (valueChange)="shareUrl.set('' + $event)" />
              <button ui-button size="sm" (click)="copyShare()">{{ copied() ? 'Copied' : 'Copy' }}</button>
            </div>
            <ui-dialog-footer class="sm:justify-start">
              <button ui-button variant="ghost" ui-dialog-close>Done</button>
            </ui-dialog-footer>
          </ui-dialog-content>
        </ui-dialog>
      }
      @case ('New project — multi-section form') {
        <ui-dialog [open]="newProjectOpen()" (openChange)="newProjectOpen.set($event)">
          <button ui-button ui-dialog-trigger>Create project</button>
          <ui-dialog-content class="sm:max-w-lg">
            <ui-dialog-header>
              <h2 ui-dialog-title>New project</h2>
              <p ui-dialog-description>
                Spin up a fresh project with sensible defaults. You can change everything later.
              </p>
            </ui-dialog-header>
            <div class="grid gap-4">
              <div class="grid gap-2">
                <label ui-label for="proj-name">Project name</label>
                <ui-input id="proj-name" placeholder="acme-dashboard" />
              </div>
              <div class="grid gap-2">
                <label ui-label for="proj-org">Organization</label>
                <ui-input id="proj-org" defaultValue="Acme Inc" [disabled]="true" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div class="grid gap-2">
                  <label ui-label for="proj-region">Region</label>
                  <ui-input id="proj-region" defaultValue="us-east-1" />
                </div>
                <div class="grid gap-2">
                  <label ui-label for="proj-tier">Tier</label>
                  <ui-input id="proj-tier" defaultValue="Starter" />
                </div>
              </div>
              <div class="bg-muted/30 flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                <div class="flex items-center gap-2">
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
                    class="lucide lucide-lock text-muted-foreground size-4"
                    aria-hidden="true"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Private repository
                </div>
                <ui-switch [defaultChecked]="true" />
              </div>
            </div>
            <ui-dialog-footer>
              <button ui-button variant="outline" ui-dialog-close>Cancel</button>
              <button ui-button (click)="newProjectOpen.set(false)">Create project</button>
            </ui-dialog-footer>
          </ui-dialog-content>
        </ui-dialog>
      }
      @case ('Onboarding card') {
        <ui-dialog>
          <button ui-button variant="outline" ui-dialog-trigger>
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
            Show what's new
          </button>
          <ui-dialog-content class="sm:max-w-md">
            <ui-dialog-header class="items-center text-center">
              <div class="bg-primary/10 text-primary mb-2 flex size-12 items-center justify-center rounded-full">
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
                  class="lucide lucide-sparkles size-6"
                  aria-hidden="true"
                >
                  <path
                    d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
                  />
                  <path d="M20 2v4" />
                  <path d="M22 4h-4" />
                  <circle cx="4" cy="20" r="2" />
                </svg>
              </div>
              <h2 ui-dialog-title>v2 is live</h2>
              <p ui-dialog-description>
                Theme tokens, vertical tabs, and a brand-new timeline. Check the changelog for the full list.
              </p>
            </ui-dialog-header>
            <ui-dialog-footer class="sm:justify-center">
              <button ui-button ui-dialog-close>Got it</button>
            </ui-dialog-footer>
          </ui-dialog-content>
        </ui-dialog>
      }
      @case ('Pricing comparison') {
        <ui-dialog>
          <button ui-button variant="outline" ui-dialog-trigger>
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
            Upgrade plan
          </button>
          <ui-dialog-content class="sm:max-w-2xl">
            <ui-dialog-header>
              <h2 ui-dialog-title>Choose a plan</h2>
              <p ui-dialog-description>Cancel anytime. All plans include unlimited components.</p>
            </ui-dialog-header>
            <div class="grid gap-3 sm:grid-cols-3">
              <div class="space-y-1 rounded-lg border p-4">
                <p class="font-medium">Free</p>
                <p class="text-2xl font-semibold">$0</p>
                <p class="text-muted-foreground text-xs">Solo · 1 project</p>
              </div>
              <div class="border-primary relative space-y-1 rounded-lg border-2 p-4">
                <ui-badge variant="info" class="absolute top-3 right-3">Recommended</ui-badge>
                <p class="font-medium">Pro</p>
                <p class="text-2xl font-semibold">$12</p>
                <p class="text-muted-foreground text-xs">Per editor · unlimited projects</p>
              </div>
              <div class="space-y-1 rounded-lg border p-4">
                <p class="font-medium">Team</p>
                <p class="text-2xl font-semibold">$24</p>
                <p class="text-muted-foreground text-xs">SSO · audit logs · priority support</p>
              </div>
            </div>
            <ui-dialog-footer>
              <button ui-button variant="outline" ui-dialog-close>Maybe later</button>
              <button ui-button>Continue with Pro</button>
            </ui-dialog-footer>
          </ui-dialog-content>
        </ui-dialog>
      }
      @case ('Connect integrations') {
        <ui-dialog>
          <button ui-button variant="outline" ui-dialog-trigger>
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
              class="lucide lucide-globe size-4"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
            Connect service
          </button>
          <ui-dialog-content class="sm:max-w-md">
            <ui-dialog-header>
              <h2 ui-dialog-title>Connect a service</h2>
              <p ui-dialog-description>Pick where to mirror your registry events.</p>
            </ui-dialog-header>
            <div class="space-y-1">
              <button
                ui-dialog-close
                class="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors"
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
                  class="lucide lucide-git-branch text-muted-foreground size-5"
                  aria-hidden="true"
                >
                  <line x1="6" x2="6" y1="3" y2="15" />
                  <circle cx="18" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <path d="M18 9a9 9 0 0 1-9 9" />
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-medium">GitHub</p>
                  <p class="text-muted-foreground text-xs">Push registry updates as commits.</p>
                </div>
              </button>
              <button
                ui-dialog-close
                class="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors"
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
                  class="lucide lucide-image text-muted-foreground size-5"
                  aria-hidden="true"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-medium">Figma</p>
                  <p class="text-muted-foreground text-xs">Mirror tokens to a Figma library.</p>
                </div>
              </button>
              <button
                ui-dialog-close
                class="hover:bg-accent hover:text-accent-foreground flex w-full items-center gap-3 rounded-md p-2.5 text-left transition-colors"
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
                  class="lucide lucide-users text-muted-foreground size-5"
                  aria-hidden="true"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                <div class="flex-1">
                  <p class="text-sm font-medium">Slack</p>
                  <p class="text-muted-foreground text-xs">Post component changes to a channel.</p>
                </div>
              </button>
            </div>
          </ui-dialog-content>
        </ui-dialog>
      }
      @case ('Long content with scroll') {
        <ui-dialog>
          <button ui-button variant="outline" ui-dialog-trigger>View terms</button>
          <ui-dialog-scroll-content class="sm:max-w-lg">
            <ui-dialog-header>
              <h2 ui-dialog-title>Terms of service</h2>
              <p ui-dialog-description>Last updated May 2026.</p>
            </ui-dialog-header>
            <div class="text-muted-foreground space-y-3 text-sm leading-relaxed">
              @for (i of sections; track i) {
                <p>
                  §{{ i }} — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat.
                </p>
              }
            </div>
            <ui-dialog-footer>
              <button ui-button ui-dialog-close>Accept &amp; close</button>
            </ui-dialog-footer>
          </ui-dialog-scroll-content>
        </ui-dialog>
      }
    }
  `,
})
export class AngularDialogDemoComponent {
  @Input() story = 'Form dialog'
  readonly shareUrl = signal('https://uipkge.dev/r/vue/button.json')
  readonly copied = signal(false)
  readonly newProjectOpen = signal(false)
  readonly sections = [1, 2, 3, 4, 5, 6, 7, 8]

  async copyShare(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.shareUrl())
      this.copied.set(true)
      setTimeout(() => this.copied.set(false), 1400)
    } catch {
      /* clipboard blocked */
    }
  }
}
