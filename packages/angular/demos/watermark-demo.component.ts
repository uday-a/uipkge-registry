import { Component, Input } from '@angular/core'
import { UiWatermarkComponent } from '../../../../../packages/registry-angular/components/watermark/watermark.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

/** Angular demo for the watermark page. Mirrors demos/react/watermark.tsx story by story. */
@Component({
  selector: 'angular-watermark-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiWatermarkComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
    UiButtonComponent,
  ],
  template: `
    @switch (story) {
      @case ('Confidential document') {
        <div ui-watermark content="CONFIDENTIAL" [opacity]="0.12" class="rounded-lg border p-6">
          <p class="text-sm leading-relaxed">{{ reportText }}</p>
        </div>
      }
      @case ('Draft card') {
        <div ui-watermark content="DRAFT" [rotate]="-30" [opacity]="0.15" [fontSize]="20" [fontWeight]="700">
          <div ui-card class="max-w-md">
            <div ui-card-header>
              <h3 ui-card-title>Onboarding flow v2</h3>
              <p ui-card-description>Subject to review — do not share externally.</p>
            </div>
            <div ui-card-content class="space-y-2 text-sm">
              <p>1. Welcome screen with product tour</p>
              <p>2. Workspace setup (3 steps)</p>
              <p>3. Invite teammates</p>
            </div>
          </div>
        </div>
      }
      @case ('Internal report') {
        <div ui-watermark content="INTERNAL" [opacity]="0.08" [rotate]="-22" [gap]="140">
          <div ui-card class="max-w-md">
            <div ui-card-header>
              <h3 ui-card-title>Quarterly Report</h3>
              <p ui-card-description>FY2024 Q3 — Leadership review</p>
            </div>
            <div ui-card-content class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>Revenue</span>
                <span class="tabular-nums">$1,240,000</span>
              </div>
              <div class="flex justify-between">
                <span>Expenses</span>
                <span class="tabular-nums">$890,000</span>
              </div>
              <div class="flex justify-between font-medium">
                <span>Net profit</span>
                <span class="tabular-nums">$350,000</span>
              </div>
            </div>
          </div>
        </div>
      }
      @case ('Angle & density variants') {
        <div class="grid max-w-2xl gap-4 sm:grid-cols-3">
          <div ui-watermark content="UIPKGE" [rotate]="0" [gap]="80" class="rounded-lg border p-4">
            <p class="text-muted-foreground text-xs">0° · gap 80</p>
          </div>
          <div ui-watermark content="UIPKGE" [rotate]="-22" [gap]="100" class="rounded-lg border p-4">
            <p class="text-muted-foreground text-xs">-22° · gap 100</p>
          </div>
          <div ui-watermark content="UIPKGE" [rotate]="-45" [gap]="120" class="rounded-lg border p-4">
            <p class="text-muted-foreground text-xs">-45° · gap 120</p>
          </div>
        </div>
      }
      @case ('Opacity & color') {
        <div class="grid max-w-2xl gap-4 sm:grid-cols-3">
          <div ui-watermark content="SAMPLE" [opacity]="0.04" class="rounded-lg border p-4">
            <p class="text-muted-foreground text-xs">opacity 0.04</p>
          </div>
          <div ui-watermark content="SAMPLE" [opacity]="0.12" class="rounded-lg border p-4">
            <p class="text-muted-foreground text-xs">opacity 0.12</p>
          </div>
          <div ui-watermark content="SAMPLE" [opacity]="0.2" color="#3b82f6" class="rounded-lg border p-4">
            <p class="text-muted-foreground text-xs">blue · 0.2</p>
          </div>
        </div>
      }
      @case ('Interactive overlay') {
        <div
          ui-watermark
          content="PREVIEW ONLY"
          [interactive]="true"
          [opacity]="0.15"
          [rotate]="-20"
          [fontSize]="18"
          class="rounded-lg border p-6"
        >
          <button ui-button variant="outline" size="sm">Try clicking — blocked</button>
        </div>
      }
      @case ('Image watermark') {
        <div
          ui-watermark
          image="https://unavatar.io/twitter/shadcn"
          [gap]="120"
          [opacity]="0.3"
          [rotate]="-15"
          class="rounded-lg border p-8"
        >
          <p class="text-sm">Branded content with a repeating avatar watermark.</p>
        </div>
      }
    }
  `,
})
export class AngularWatermarkDemoComponent {
  @Input() story = 'Confidential document'
  readonly reportText =
    'Q3 revenue grew 18% YoY, driven by enterprise expansion and a 32% increase in self-serve signups. Net retention reached 118%, with three of the top five accounts expanding their seat count beyond the 500-user threshold.'
}
