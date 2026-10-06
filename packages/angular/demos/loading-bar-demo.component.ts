import { Component, Input, ViewChild, signal } from '@angular/core'
import {
  UiLoadingBarComponent,
  useLoadingBar,
} from '../../../../../packages/registry-angular/components/loading-bar/loading-bar.component'
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

/** Angular demo for the loading-bar page. Mirrors demos/react/loading-bar.tsx story by story. */
@Component({
  selector: 'angular-loading-bar-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiLoadingBarComponent,
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
    <div class="space-y-8">
      <ui-loading-bar #pageBarRef />
      <ui-loading-bar #formBarRef color="#22c55e" />
      <ui-loading-bar #bottomBarRef position="bottom" color="#6366f1" />

      @switch (story) {
        @case ('Page navigation') {
          <div>
            <div class="flex flex-wrap gap-2">
              <button ui-button (click)="simulatePageLoad()">
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
                  class="lucide lucide-loader-circle mr-2 size-4 animate-spin"
                  aria-hidden="true"
                  [style.opacity]="pageBar.loading() ? 1 : 0"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Load dashboard
              </button>
              <button ui-button variant="destructive" (click)="simulateApiError()">
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
                  class="lucide lucide-circle-alert mr-2 size-4"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                Failing request
              </button>
              <button ui-button variant="outline" (click)="pageBar.inc(15)">Nudge +15%</button>
            </div>
            <p class="text-muted-foreground mt-3 text-xs">
              The bar auto-hides when finished. The error variant tints the bar destructive so users know something went
              wrong.
            </p>
          </div>
        }
        @case ('Form submission') {
          <div ui-card class="max-w-md">
            <div ui-card-header>
              <h3 ui-card-title class="text-base">Billing details</h3>
              <p ui-card-description>Updates are saved to your account instantly.</p>
            </div>
            <div ui-card-content class="space-y-4">
              <div class="space-y-1.5">
                <label ui-label>Company name</label>
                <ui-input defaultValue="Acme Inc." />
              </div>
              <div class="space-y-1.5">
                <label ui-label>Billing email</label>
                <ui-input defaultValue="billing@acme.com" />
              </div>
              <button ui-button class="w-full" [disabled]="formStatus() === 'saving'" (click)="submitForm()">
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
                  class="lucide lucide-save mr-2 size-4"
                  aria-hidden="true"
                >
                  <path
                    d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
                  />
                  <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
                  <path d="M7 3v4a1 1 0 0 0 1 1h7" />
                </svg>
                {{ formStatus() === 'saving' ? 'Saving…' : formStatus() === 'done' ? 'Saved!' : 'Save changes' }}
              </button>
              @if (formStatus() === 'done') {
                <p class="text-xs text-emerald-600">Your billing details were updated.</p>
              }
            </div>
          </div>
        }
        @case ('Manual control') {
          <div class="max-w-md space-y-3">
            <ui-loading-bar [value]="manualValue()" [height]="4" (valueChange)="manualValue.set($event)" />
            <input
              [value]="manualValue()"
              (input)="manualValue.set(+$any($event.target).value)"
              type="range"
              min="0"
              max="100"
              class="w-full"
            />
            <div class="text-muted-foreground flex justify-between text-xs">
              <span>Transferred</span>
              <span class="tabular-nums">{{ manualValue() }}%</span>
            </div>
          </div>
        }
        @case ('Indeterminate fetching') {
          <div class="flex items-center gap-3">
            <ui-loading-bar indeterminate spinner [height]="3" />
            <span class="text-muted-foreground text-xs whitespace-nowrap">Fetching results…</span>
          </div>
        }
        @case ('Bottom-anchored bar') {
          <div>
            <button ui-button variant="outline" (click)="runBottomBar()">
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
                class="lucide lucide-loader-circle mr-2 size-4 animate-spin"
                aria-hidden="true"
                [style.opacity]="bottomBar.loading() ? 1 : 0"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Sync in background
            </button>
            <p class="text-muted-foreground mt-3 text-xs">Watch the bottom of the viewport after clicking.</p>
          </div>
        }
        @case ('Appearance options') {
          <div class="grid max-w-md gap-4">
            <div class="space-y-1.5">
              <span class="text-muted-foreground text-xs">Custom color + height</span>
              <ui-loading-bar [value]="70" color="#10b981" [height]="6" />
            </div>
            <div class="space-y-1.5">
              <span class="text-muted-foreground text-xs">Error state</span>
              <ui-loading-bar [value]="85" error [height]="6" />
            </div>
            <div class="space-y-1.5">
              <span class="text-muted-foreground text-xs">Indeterminate + spinner</span>
              <ui-loading-bar indeterminate spinner color="#f59e0b" [height]="4" />
            </div>
          </div>
        }
      }
    </div>
  `,
})
export class AngularLoadingBarDemoComponent {
  @Input() story = 'Page navigation'
  readonly pageBar = useLoadingBar()
  readonly formBar = useLoadingBar()
  readonly bottomBar = useLoadingBar()
  readonly manualValue = signal(40)
  readonly formStatus = signal<'idle' | 'saving' | 'done' | 'error'>('idle')

  @ViewChild('pageBarRef', { static: true }) set pageBarRef(bar: UiLoadingBarComponent) {
    this.pageBar.setRef(bar)
  }
  @ViewChild('formBarRef', { static: true }) set formBarRef(bar: UiLoadingBarComponent) {
    this.formBar.setRef(bar)
  }
  @ViewChild('bottomBarRef', { static: true }) set bottomBarRef(bar: UiLoadingBarComponent) {
    this.bottomBar.setRef(bar)
  }

  async simulatePageLoad(): Promise<void> {
    this.pageBar.start()
    await wait(1800)
    this.pageBar.finish()
  }

  async simulateApiError(): Promise<void> {
    this.pageBar.start()
    await wait(1400)
    this.pageBar.error()
  }

  async submitForm(): Promise<void> {
    this.formStatus.set('saving')
    this.formBar.start()
    await wait(2000)
    this.formBar.finish()
    this.formStatus.set('done')
    setTimeout(() => this.formStatus.set('idle'), 1500)
  }

  async runBottomBar(): Promise<void> {
    this.bottomBar.start()
    await wait(1800)
    this.bottomBar.finish()
  }
}
