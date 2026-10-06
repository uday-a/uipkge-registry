import { Component, Input, signal } from '@angular/core'
import { UiBlockUiComponent } from '../../../../../packages/registry-angular/components/block-ui/block-ui.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import { UiInputComponent } from '../../../../../packages/registry-angular/components/input/input.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Angular demo for the block-ui page. Mirrors demos/react/block-ui.tsx story by story. */
@Component({
  selector: 'angular-block-ui-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiBlockUiComponent,
    UiButtonComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
    UiInputComponent,
    UiLabelComponent,
  ],
  template: `
    <ng-template #cloudIcon
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
        class="lucide lucide-cloud-upload text-primary size-8 animate-pulse"
        aria-hidden="true"
      >
        <path d="M12 13v8" />
        <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
        <path d="m8 17 4-4 4 4" /></svg
    ></ng-template>
    <ng-template #shieldIcon
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
        class="lucide lucide-shield-check text-primary size-8"
        aria-hidden="true"
      >
        <path
          d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
        />
        <path d="m9 12 2 2 4-4" /></svg
    ></ng-template>
    <ng-template #richMessage>
      <div class="text-center">
        <p class="text-sm font-medium">Auditing schema</p>
        <p class="text-muted-foreground text-xs">This usually takes a few seconds</p>
      </div>
    </ng-template>
    @switch (story) {
      @case ('Settings form during save') {
        <div class="max-w-md">
          <ui-block-ui [blocking]="saving()" message="Saving your changes…">
            <div ui-card>
              <div ui-card-header>
                <h3 ui-card-title class="text-base">Project settings</h3>
                <p ui-card-description>Changes apply to all team members.</p>
              </div>
              <div ui-card-content class="space-y-4">
                <div class="space-y-1.5">
                  <label ui-label>Project name</label>
                  <ui-input defaultValue="Acme Website Redesign" />
                </div>
                <div class="space-y-1.5">
                  <label ui-label>Owner</label>
                  <ui-input defaultValue="sarah.johnson@acme.com" />
                </div>
                <button ui-button class="w-full" [disabled]="saving()" (click)="saveSettings()">
                  {{ saving() ? 'Saving…' : 'Save changes' }}
                </button>
              </div>
            </div>
          </ui-block-ui>
        </div>
      }
      @case ('Data fetch with blur') {
        <div class="flex max-w-md flex-col gap-3">
          <button ui-button variant="outline" class="w-fit" [disabled]="fetching()" (click)="fetchReport()">
            @if (fetching()) {
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
                class="lucide lucide-refresh-cw mr-2 size-4 animate-spin"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
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
                class="lucide lucide-refresh-cw mr-2 size-4"
                aria-hidden="true"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M8 16H3v5" />
              </svg>
            }
            Refresh report
          </button>
          <ui-block-ui [blocking]="fetching()" blur message="Loading report…">
            <div ui-card>
              <div ui-card-header>
                <h3 ui-card-title class="text-base">Q3 revenue summary</h3>
              </div>
              <div ui-card-content class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Total revenue</span>
                  <span class="font-medium tabular-nums">$1,284,500</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">New customers</span>
                  <span class="font-medium tabular-nums">342</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-muted-foreground">Churn rate</span>
                  <span class="font-medium tabular-nums">2.1%</span>
                </div>
              </div>
            </div>
          </ui-block-ui>
        </div>
      }
      @case ('Custom overlay icon') {
        <div class="flex max-w-md flex-col gap-3">
          <button ui-button variant="outline" class="w-fit" [disabled]="syncing()" (click)="syncData()">
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
              class="lucide lucide-cloud-upload mr-2 size-4"
              aria-hidden="true"
            >
              <path d="M12 13v8" />
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
              <path d="m8 17 4-4 4 4" />
            </svg>
            {{ syncing() ? 'Syncing…' : 'Sync to cloud' }}
          </button>
          <ui-block-ui [blocking]="syncing()" [showSpinner]="false" message="Uploading 14 files…" [icon]="cloudIcon">
            <div ui-card>
              <div ui-card-content class="p-5">
                <p class="text-sm font-medium">Cloud storage</p>
                <p class="text-muted-foreground mt-1 text-xs">3.2 GB of 10 GB used · 14 files pending</p>
              </div>
            </div>
          </ui-block-ui>
        </div>
      }
      @case ('Rich message slot') {
        <ui-block-ui blocking [showSpinner]="false" class="max-w-md" [icon]="shieldIcon" [messageSlot]="richMessage">
          <div ui-card>
            <div ui-card-content class="p-6">
              <p class="text-sm font-medium">Compliance check</p>
              <p class="text-muted-foreground mt-1 text-xs">Running 42 rules against the current schema…</p>
            </div>
          </div>
        </ui-block-ui>
      }
      @case ('Overlay appearance') {
        <div class="grid max-w-md gap-4 sm:grid-cols-2">
          <ui-block-ui blocking [opacity]="0.3" message="Light veil" [showSpinner]="false">
            <div ui-card>
              <div ui-card-content class="p-5">
                <p class="text-sm">30% opacity</p>
                <p class="text-muted-foreground text-xs">Subtle — content stays readable.</p>
              </div>
            </div>
          </ui-block-ui>
          <ui-block-ui blocking overlayColor="#0a0a0a" [opacity]="0.7" message="Hard block" [showSpinner]="false">
            <div ui-card>
              <div ui-card-content class="p-5">
                <p class="text-sm">Dark overlay</p>
                <p class="text-muted-foreground text-xs">Opaque — focus is forced to the message.</p>
              </div>
            </div>
          </ui-block-ui>
        </div>
      }
      @case ('Database migration panel') {
        <ui-block-ui blocking message="Running migration 0042…" class="max-w-md">
          <div ui-card>
            <div ui-card-header>
              <h3 ui-card-title class="flex items-center gap-2 text-base">
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
                  class="lucide lucide-database size-4"
                  aria-hidden="true"
                >
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                  <path d="M3 12A9 3 0 0 0 21 12" />
                </svg>
                Database migrations
              </h3>
              <p ui-card-description>Applied migrations are listed below.</p>
            </div>
            <div ui-card-content class="space-y-1.5">
              <p class="text-muted-foreground text-xs">0039 · add_users_table · ✓</p>
              <p class="text-muted-foreground text-xs">0040 · add_audit_log · ✓</p>
              <p class="text-muted-foreground text-xs">0041 · index_trails · ✓</p>
              <p class="text-xs">0042 · split_orgs · running…</p>
            </div>
          </div>
        </ui-block-ui>
      }
    }
  `,
})
export class AngularBlockUiDemoComponent {
  @Input() story = 'Settings form during save'
  readonly saving = signal(false)
  readonly fetching = signal(false)
  readonly syncing = signal(false)

  async saveSettings(): Promise<void> {
    this.saving.set(true)
    await wait(2200)
    this.saving.set(false)
  }

  async fetchReport(): Promise<void> {
    this.fetching.set(true)
    await wait(2500)
    this.fetching.set(false)
  }

  async syncData(): Promise<void> {
    this.syncing.set(true)
    await wait(3000)
    this.syncing.set(false)
  }
}
