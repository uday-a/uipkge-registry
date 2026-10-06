import { Component, Input } from '@angular/core'
import {
  UiSheetCloseComponent,
  UiSheetComponent,
  UiSheetContentComponent,
  UiSheetDescriptionComponent,
  UiSheetFooterComponent,
  UiSheetHeaderComponent,
  UiSheetTitleComponent,
  UiSheetTriggerComponent,
} from '../../../../../packages/registry-angular/components/sheet/sheet.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import { UiInputComponent } from '../../../../../packages/registry-angular/components/input/input.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'

/** Angular demo for the sheet page. Mirrors demos/react/sheet.tsx story by story. */
@Component({
  selector: 'angular-sheet-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiSheetComponent,
    UiSheetTriggerComponent,
    UiSheetCloseComponent,
    UiSheetContentComponent,
    UiSheetHeaderComponent,
    UiSheetFooterComponent,
    UiSheetTitleComponent,
    UiSheetDescriptionComponent,
    UiButtonComponent,
    UiInputComponent,
    UiLabelComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default (left)') {
        <ui-sheet>
          <button ui-button ui-sheet-trigger variant="outline">Open left sheet</button>
          <ui-sheet-content side="left">
            <div ui-sheet-header>
              <h2 ui-sheet-title>Edit profile</h2>
              <p ui-sheet-description>Make changes to your profile here. Click save when you're done.</p>
            </div>
            <div class="grid gap-4 px-4 py-2">
              <div class="grid gap-2">
                <label ui-label for="sheet-name-l">Name</label>
                <ui-input id="sheet-name-l" defaultValue="Pedro Duarte" />
              </div>
              <div class="grid gap-2">
                <label ui-label for="sheet-username-l">Username</label>
                <ui-input id="sheet-username-l" defaultValue="&#64;peduarte" />
              </div>
            </div>
            <div ui-sheet-footer>
              <button ui-button>Save changes</button>
            </div>
          </ui-sheet-content>
        </ui-sheet>
      }
      @case ('Right (default drawer)') {
        <ui-sheet>
          <button ui-button ui-sheet-trigger variant="outline">Open right sheet</button>
          <ui-sheet-content>
            <div ui-sheet-header>
              <h2 ui-sheet-title>Cart</h2>
              <p ui-sheet-description>3 items · estimated total $182.50</p>
            </div>
            <div class="space-y-3 px-4 py-2 text-sm">
              <div class="flex justify-between">
                <span>Mechanical keyboard</span>
                <span class="tabular-nums">$129.00</span>
              </div>
              <div class="flex justify-between">
                <span>USB-C cable (2m)</span>
                <span class="tabular-nums">$14.50</span>
              </div>
              <div class="flex justify-between">
                <span>Desk mat</span>
                <span class="tabular-nums">$39.00</span>
              </div>
            </div>
            <div ui-sheet-footer>
              <button ui-button>Checkout</button>
              <button ui-button ui-sheet-close variant="outline">Continue shopping</button>
            </div>
          </ui-sheet-content>
        </ui-sheet>
      }
      @case ('Top') {
        <ui-sheet>
          <button ui-button ui-sheet-trigger variant="outline">Open top sheet</button>
          <ui-sheet-content side="top">
            <div ui-sheet-header>
              <h2 ui-sheet-title>System maintenance scheduled</h2>
              <p ui-sheet-description>
                We'll be performing routine maintenance on Sunday at 02:00 UTC. Expect brief intermittent downtime over
                a 30 minute window.
              </p>
            </div>
            <div ui-sheet-footer>
              <button ui-button ui-sheet-close>Got it</button>
            </div>
          </ui-sheet-content>
        </ui-sheet>
      }
      @case ('Bottom (mobile pattern)') {
        <ui-sheet>
          <button ui-button ui-sheet-trigger variant="outline">Open bottom sheet</button>
          <ui-sheet-content side="bottom">
            <div ui-sheet-header>
              <h2 ui-sheet-title>Filters</h2>
              <p ui-sheet-description>Refine the list with the controls below.</p>
            </div>
            <div class="grid gap-3 px-4 py-2 sm:grid-cols-3">
              <div class="grid gap-2">
                <label ui-label for="filter-cat">Category</label>
                <ui-input id="filter-cat" defaultValue="All" />
              </div>
              <div class="grid gap-2">
                <label ui-label for="filter-min">Min price</label>
                <ui-input id="filter-min" defaultValue="0" />
              </div>
              <div class="grid gap-2">
                <label ui-label for="filter-max">Max price</label>
                <ui-input id="filter-max" defaultValue="500" />
              </div>
            </div>
            <div ui-sheet-footer>
              <button ui-button>Apply</button>
              <button ui-button ui-sheet-close variant="outline">Cancel</button>
            </div>
          </ui-sheet-content>
        </ui-sheet>
      }
      @case ('Long scrollable content') {
        <ui-sheet>
          <button ui-button ui-sheet-trigger variant="outline">Open scrollable sheet</button>
          <ui-sheet-content>
            <div ui-sheet-header>
              <h2 ui-sheet-title>Release notes</h2>
              <p ui-sheet-description>Highlights from the last several versions.</p>
            </div>
            <div class="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-2 text-sm">
              @for (v of releases; track v) {
                <section class="space-y-1">
                  <h4 class="font-medium">v1.{{ v }}.0</h4>
                  <p class="text-muted-foreground">
                    Notes for release v1.{{ v }}.0 — fixes, features, and assorted improvements across the registry.
                    Multiple paragraphs of placeholder copy keep the body tall enough that scrolling becomes necessary
                    on most viewport heights.
                  </p>
                  <p class="text-muted-foreground">
                    Additional context for v1.{{ v }}.0 with deprecation notes and migration steps where relevant.
                  </p>
                </section>
              }
            </div>
            <div ui-sheet-footer>
              <button ui-button ui-sheet-close>Close</button>
            </div>
          </ui-sheet-content>
        </ui-sheet>
      }
    }
  `,
})
export class AngularSheetDemoComponent {
  @Input() story = 'Default (left)'
  /** v1.12.0 down to v1.1.0, like the React demo's 12 - i + 1. */
  readonly releases = Array.from({ length: 12 }, (_, i) => 12 - i)
}
