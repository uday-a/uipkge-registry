import { Component, Input } from '@angular/core'
import { UiImageCompareComponent } from '../../../../../packages/registry-angular/components/image-compare/image-compare.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

/** Angular demo for the image-compare page. Mirrors demos/react/image-compare.tsx story by story. */
@Component({
  selector: 'angular-image-compare-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiImageCompareComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Photo edit before / after') {
        <ui-image-compare
          [beforeSrc]="photoBefore"
          [afterSrc]="photoAfter"
          beforeLabel="Original"
          afterLabel="Edited"
          class="h-72 w-full max-w-2xl"
        />
      }
      @case ('UI redesign') {
        <ui-image-compare
          [beforeSrc]="uiBefore"
          [afterSrc]="uiAfter"
          beforeLabel="v1.0"
          afterLabel="v2.0"
          class="h-72 w-full max-w-2xl"
        />
      }
      @case ('Controlled slider') {
        <div class="flex max-w-2xl flex-col gap-3">
          <ui-image-compare [(value)]="pos" [beforeSrc]="photoBefore" [afterSrc]="photoAfter" class="h-72 w-full" />
          <div class="flex items-center gap-3 text-sm">
            <span class="text-muted-foreground w-16 tabular-nums">{{ pos.toFixed(0) }}%</span>
            <input
              type="range"
              min="0"
              max="100"
              [value]="pos"
              (input)="pos = +$any($event.target).value"
              class="flex-1"
            />
          </div>
        </div>
      }
      @case ('Orientation & labels') {
        <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
          <ui-image-compare
            [beforeSrc]="photoBefore"
            [afterSrc]="photoAfter"
            orientation="vertical"
            class="h-80 w-full"
          />
          <ui-image-compare [beforeSrc]="uiBefore" [afterSrc]="uiAfter" [showLabels]="false" class="h-80 w-full" />
        </div>
      }
      @case ('Custom handle') {
        <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
          <ui-image-compare [beforeSrc]="photoBefore" [afterSrc]="photoAfter" class="h-72 w-full" [handle]="grip" />
          <ui-image-compare [beforeSrc]="uiBefore" [afterSrc]="uiAfter" [showHandle]="false" class="h-72 w-full" />
        </div>
      }
      @case ('Disabled & initial position') {
        <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
          <ui-image-compare
            [beforeSrc]="photoBefore"
            [afterSrc]="photoAfter"
            [defaultValue]="30"
            disabled
            class="h-72 w-full"
          />
          <ui-image-compare [beforeSrc]="uiBefore" [afterSrc]="uiAfter" [defaultValue]="25" class="h-72 w-full" />
        </div>
      }
      @case ('In a product card') {
        <div ui-card class="max-w-2xl">
          <div ui-card-header>
            <h3 ui-card-title>Beach retouch</h3>
            <p ui-card-description>Color grade applied in Lightroom — drag to compare.</p>
          </div>
          <div ui-card-content>
            <ui-image-compare
              [beforeSrc]="photoBefore"
              [afterSrc]="photoAfter"
              beforeLabel="SOOC"
              afterLabel="Graded"
              class="h-72 w-full"
            />
          </div>
        </div>
      }
    }
    <ng-template #grip>
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
        class="lucide lucide-grip-horizontal text-primary size-5"
        aria-hidden="true"
      >
        <circle cx="12" cy="9" r="1" />
        <circle cx="19" cy="9" r="1" />
        <circle cx="5" cy="9" r="1" />
        <circle cx="12" cy="15" r="1" />
        <circle cx="19" cy="15" r="1" />
        <circle cx="5" cy="15" r="1" />
      </svg>
    </ng-template>
  `,
})
export class AngularImageCompareDemoComponent {
  @Input() story = 'Photo edit before / after'
  pos = 50
  // Photo editing: original vs color-graded (warm graded retouch)
  readonly photoBefore =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80&sat=-60&con=-20'
  readonly photoAfter =
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80&sat=40&con=20'
  // Architecture / Cityscape: raw blueprint/monochrome vs full color
  readonly uiBefore = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop&q=80&sat=-80'
  readonly uiAfter = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop&q=80'
}
