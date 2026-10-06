import { Component, Input } from '@angular/core'
import {
  UiVerticalTabsComponent,
  UiVerticalTabsContentComponent,
  UiVerticalTabsListComponent,
  UiVerticalTabsSectionComponent,
  UiVerticalTabsTriggerComponent,
} from '../../../../../packages/registry-angular/components/vertical-tabs/vertical-tabs.component'
import { UiInputComponent } from '../../../../../packages/registry-angular/components/input/input.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'
import { UiTextareaComponent } from '../../../../../packages/registry-angular/components/textarea/textarea.component'
import { UiSwitchComponent } from '../../../../../packages/registry-angular/components/switch/switch.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import { UiSeparatorComponent } from '../../../../../packages/registry-angular/components/separator/separator.component'

/** Angular demo for the vertical-tabs page. Mirrors demos/react/vertical-tabs.tsx story by story. */
@Component({
  selector: 'angular-vertical-tabs-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiVerticalTabsComponent,
    UiVerticalTabsListComponent,
    UiVerticalTabsSectionComponent,
    UiVerticalTabsTriggerComponent,
    UiVerticalTabsContentComponent,
    UiInputComponent,
    UiLabelComponent,
    UiTextareaComponent,
    UiSwitchComponent,
    UiButtonComponent,
    UiSeparatorComponent,
  ],
  template: `
    <ng-template #mailIcon
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
        class="lucide lucide-mail"
        aria-hidden="true"
      >
        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
        <rect x="2" y="4" width="20" height="16" rx="2" /></svg
    ></ng-template>
    @switch (story) {
      @case ('With forms (settings page)') {
        <div class="bg-card rounded-lg border p-6">
          <div ui-vertical-tabs defaultValue="profile">
            <div ui-vertical-tabs-list>
              <button ui-vertical-tabs-trigger value="profile">
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
                  <circle cx="12" cy="7" r="4" /></svg
                >Profile
              </button>
              <button ui-vertical-tabs-trigger value="security">
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
                  class="lucide lucide-shield"
                  aria-hidden="true"
                >
                  <path
                    d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                  /></svg
                >Security
              </button>
              <button ui-vertical-tabs-trigger value="notifications">
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
                  /></svg
                >Notifications
              </button>
            </div>

            <div ui-vertical-tabs-content value="profile">
              <form class="space-y-5" (submit)="$event.preventDefault(); onSave('profile')">
                <div>
                  <h3 class="text-lg font-semibold">Profile</h3>
                  <p class="text-muted-foreground mt-0.5 text-sm">How your account appears to teammates.</p>
                </div>
                <div ui-separator></div>
                <div class="grid gap-4 sm:grid-cols-2">
                  <div class="grid gap-1.5">
                    <label ui-label for="settings-name">Full name</label>
                    <ui-input id="settings-name" [value]="profile.name" (valueChange)="profile.name = $event" />
                  </div>
                  <div class="grid gap-1.5">
                    <label ui-label for="settings-email">Email</label>
                    <ui-input
                      id="settings-email"
                      type="email"
                      [prefixIcon]="mailIcon"
                      [value]="profile.email"
                      (valueChange)="profile.email = $event"
                    />
                  </div>
                </div>
                <div class="grid gap-1.5">
                  <label ui-label for="settings-bio">Bio</label>
                  <ui-textarea
                    id="settings-bio"
                    [rows]="3"
                    [value]="profile.bio"
                    (valueChange)="profile.bio = $event"
                  />
                  <p class="text-muted-foreground text-xs">Markdown supported. Shows on your public profile.</p>
                </div>
                <div class="flex justify-end gap-2">
                  <button ui-button type="button" variant="ghost">Cancel</button>
                  <button ui-button type="submit">Save changes</button>
                </div>
              </form>
            </div>

            <div ui-vertical-tabs-content value="security">
              <form class="space-y-5" (submit)="$event.preventDefault(); onSave('security')">
                <div>
                  <h3 class="text-lg font-semibold">Security</h3>
                  <p class="text-muted-foreground mt-0.5 text-sm">Sign-in protection and session lifetime.</p>
                </div>
                <div ui-separator></div>
                <div class="flex items-center justify-between gap-4">
                  <div class="space-y-0.5">
                    <label ui-label class="font-medium">Two-factor authentication</label>
                    <p class="text-muted-foreground text-xs">Require a one-time code on every new device.</p>
                  </div>
                  <button
                    ui-switch
                    [checked]="security.twoFactor"
                    (checkedChange)="security.twoFactor = $event"
                  ></button>
                </div>
                <div class="grid gap-1.5">
                  <label ui-label for="settings-timeout">Session timeout (minutes)</label>
                  <ui-input
                    id="settings-timeout"
                    type="number"
                    [value]="security.sessionTimeout"
                    (valueChange)="security.sessionTimeout = $event"
                  />
                </div>
                <div class="flex justify-end gap-2">
                  <button ui-button type="button" variant="ghost">Cancel</button>
                  <button ui-button type="submit">Save changes</button>
                </div>
              </form>
            </div>

            <div ui-vertical-tabs-content value="notifications">
              <form class="space-y-5" (submit)="$event.preventDefault(); onSave('notifications')">
                <div>
                  <h3 class="text-lg font-semibold">Notifications</h3>
                  <p class="text-muted-foreground mt-0.5 text-sm">
                    Which emails we send to <span class="text-foreground font-medium">{{ profile.email }}</span
                    >.
                  </p>
                </div>
                <div ui-separator></div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between gap-4">
                    <div class="space-y-0.5">
                      <label ui-label class="font-medium">Product updates</label>
                      <p class="text-muted-foreground text-xs">Feature releases, breaking changes, deprecations.</p>
                    </div>
                    <button
                      ui-switch
                      [checked]="notifications.productUpdates"
                      (checkedChange)="notifications.productUpdates = $event"
                    ></button>
                  </div>
                  <div class="flex items-center justify-between gap-4">
                    <div class="space-y-0.5">
                      <label ui-label class="font-medium">Weekly digest</label>
                      <p class="text-muted-foreground text-xs">Activity summary every Monday morning.</p>
                    </div>
                    <button
                      ui-switch
                      [checked]="notifications.weeklyDigest"
                      (checkedChange)="notifications.weeklyDigest = $event"
                    ></button>
                  </div>
                  <div class="flex items-center justify-between gap-4">
                    <div class="space-y-0.5">
                      <label ui-label class="font-medium">Security alerts</label>
                      <p class="text-muted-foreground text-xs">
                        New sign-ins, password changes. We recommend keeping these on.
                      </p>
                    </div>
                    <button
                      ui-switch
                      [checked]="notifications.securityAlerts"
                      (checkedChange)="notifications.securityAlerts = $event"
                    ></button>
                  </div>
                </div>
                <div class="flex justify-end gap-2">
                  <button ui-button type="button" variant="ghost">Cancel</button>
                  <button ui-button type="submit">Save changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      }
      @case ('Default') {
        <div class="bg-card rounded-lg border p-6">
          <div ui-vertical-tabs defaultValue="general">
            <div ui-vertical-tabs-list>
              <div ui-vertical-tabs-section label="Project"></div>
              <button ui-vertical-tabs-trigger value="general">
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
                  <circle cx="12" cy="12" r="3" /></svg
                >General
              </button>
              <button ui-vertical-tabs-trigger value="sync">
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
                  class="lucide lucide-refresh-cw"
                  aria-hidden="true"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" /></svg
                >Sync
              </button>
              <div ui-vertical-tabs-section label="Integrations"></div>
              <button ui-vertical-tabs-trigger value="git-sync">
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
                  <circle cx="6" cy="18" r="3" /></svg
                >Git Sync
              </button>
              <button ui-vertical-tabs-trigger value="api-key">
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
                  class="lucide lucide-key"
                  aria-hidden="true"
                >
                  <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
                  <path d="m21 2-9.6 9.6" />
                  <circle cx="7.5" cy="15.5" r="5.5" /></svg
                >API Key
              </button>
              <div ui-vertical-tabs-section label="Danger"></div>
              <button ui-vertical-tabs-trigger value="danger" class="text-destructive hover:text-destructive">
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
                  class="lucide lucide-triangle-alert"
                  aria-hidden="true"
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" /></svg
                >Danger Zone
              </button>
            </div>

            <div ui-vertical-tabs-content value="general">
              <h3 class="text-lg font-semibold">General</h3>
              <p class="text-muted-foreground mt-1 text-sm">Basic project information and settings.</p>
            </div>
            <div ui-vertical-tabs-content value="sync">
              <h3 class="text-lg font-semibold">Sync</h3>
              <p class="text-muted-foreground mt-1 text-sm">Configure scheduled translation sync.</p>
            </div>
            <div ui-vertical-tabs-content value="git-sync">
              <h3 class="text-lg font-semibold">Git Sync</h3>
              <p class="text-muted-foreground mt-1 text-sm">Connect your repository for two-way sync.</p>
            </div>
            <div ui-vertical-tabs-content value="api-key">
              <h3 class="text-lg font-semibold">API Key</h3>
              <p class="text-muted-foreground mt-1 text-sm">Manage credentials used by your app.</p>
            </div>
            <div ui-vertical-tabs-content value="danger">
              <h3 class="text-destructive text-lg font-semibold">Danger Zone</h3>
              <p class="text-muted-foreground mt-1 text-sm">Permanently delete this project.</p>
            </div>
          </div>
        </div>
      }
      @case ('Without sections') {
        <div class="bg-card rounded-lg border p-6">
          <div ui-vertical-tabs defaultValue="profile">
            <div ui-vertical-tabs-list>
              <button ui-vertical-tabs-trigger value="profile">
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
                  <circle cx="12" cy="7" r="4" /></svg
                >Profile
              </button>
              <button ui-vertical-tabs-trigger value="security">
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
                  class="lucide lucide-shield"
                  aria-hidden="true"
                >
                  <path
                    d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                  /></svg
                >Security
              </button>
              <button ui-vertical-tabs-trigger value="notifications">
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
                  <circle cx="12" cy="12" r="3" /></svg
                >Notifications
              </button>
            </div>
            <div ui-vertical-tabs-content value="profile">
              <p class="text-muted-foreground text-sm">Profile preferences.</p>
            </div>
            <div ui-vertical-tabs-content value="security">
              <p class="text-muted-foreground text-sm">Two-factor and password options.</p>
            </div>
            <div ui-vertical-tabs-content value="notifications">
              <p class="text-muted-foreground text-sm">Email + in-app notification controls.</p>
            </div>
          </div>
        </div>
      }
      @case ('Disabled item') {
        <div class="bg-card rounded-lg border p-6">
          <div ui-vertical-tabs defaultValue="active">
            <div ui-vertical-tabs-list>
              <button ui-vertical-tabs-trigger value="active">
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
                  <circle cx="12" cy="12" r="3" /></svg
                >Active option
              </button>
              <button ui-vertical-tabs-trigger value="locked" disabled>
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
                  class="lucide lucide-shield"
                  aria-hidden="true"
                >
                  <path
                    d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                  /></svg
                >Locked option
              </button>
              <button ui-vertical-tabs-trigger value="other">
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
                  <circle cx="12" cy="7" r="4" /></svg
                >Other
              </button>
            </div>
            <div ui-vertical-tabs-content value="active">
              <p class="text-muted-foreground text-sm">Selectable.</p>
            </div>
            <div ui-vertical-tabs-content value="other">
              <p class="text-muted-foreground text-sm">Also selectable.</p>
            </div>
          </div>
        </div>
      }
      @case ('Compact (no icons)') {
        <div class="bg-card rounded-lg border p-6">
          <div ui-vertical-tabs defaultValue="overview">
            <div ui-vertical-tabs-list class="w-44">
              <button ui-vertical-tabs-trigger value="overview">Overview</button>
              <button ui-vertical-tabs-trigger value="usage">Usage</button>
              <button ui-vertical-tabs-trigger value="billing">Billing</button>
              <button ui-vertical-tabs-trigger value="invoices">Invoices</button>
            </div>
            <div ui-vertical-tabs-content value="overview">
              <p class="text-muted-foreground text-sm">Account summary.</p>
            </div>
            <div ui-vertical-tabs-content value="usage">
              <p class="text-muted-foreground text-sm">Resource usage breakdown.</p>
            </div>
            <div ui-vertical-tabs-content value="billing">
              <p class="text-muted-foreground text-sm">Plan and payment method.</p>
            </div>
            <div ui-vertical-tabs-content value="invoices">
              <p class="text-muted-foreground text-sm">Past invoices.</p>
            </div>
          </div>
        </div>
      }
      @case ('Static indicator') {
        <div class="bg-card rounded-lg border p-6">
          <div ui-vertical-tabs defaultValue="profile">
            <div ui-vertical-tabs-list [animated]="false">
              <button ui-vertical-tabs-trigger value="profile">
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
                  <circle cx="12" cy="7" r="4" /></svg
                >Profile
              </button>
              <button ui-vertical-tabs-trigger value="security">
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
                  class="lucide lucide-shield"
                  aria-hidden="true"
                >
                  <path
                    d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
                  /></svg
                >Security
              </button>
              <button ui-vertical-tabs-trigger value="notifications">
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
                  /></svg
                >Notifications
              </button>
            </div>
            <div ui-vertical-tabs-content value="profile">
              <p class="text-muted-foreground text-sm">Static chrome — no slide between items.</p>
            </div>
            <div ui-vertical-tabs-content value="security">
              <p class="text-muted-foreground text-sm">Active styles snap instantly.</p>
            </div>
            <div ui-vertical-tabs-content value="notifications">
              <p class="text-muted-foreground text-sm">Useful when motion is undesired.</p>
            </div>
          </div>
        </div>
      }
    }
  `,
})
export class AngularVerticalTabsDemoComponent {
  @Input() story = 'With forms (settings page)'
  // Settings-with-forms demo state; the mock save handler logs instead of hitting a backend.
  profile = {
    name: 'Alex Morgan',
    email: 'alex@example.com',
    bio: 'Frontend engineer working on dashboards and design systems.',
  }
  security = { twoFactor: true, sessionTimeout: '30' }
  notifications = { productUpdates: true, weeklyDigest: false, securityAlerts: true }

  onSave(section: string): void {
    // eslint-disable-next-line no-console
    console.log(`saved ${section}`, {
      profile: this.profile,
      security: this.security,
      notifications: this.notifications,
    })
  }
}
