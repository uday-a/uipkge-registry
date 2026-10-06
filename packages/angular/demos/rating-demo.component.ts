import { Component, Input } from '@angular/core'
import { UiRatingComponent } from '../../../../../packages/registry-angular/components/rating/rating.component'

/** Angular demo for the rating page. Mirrors demos/react/rating.tsx story by story. */
@Component({
  selector: 'angular-rating-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiRatingComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="space-y-3">
          <ui-rating [(value)]="value" [max]="5" halfIncrements />
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ value }}</code>
          </p>
        </div>
      }
      @case ('Sizes') {
        <div class="space-y-2">
          <ui-rating [(value)]="sized" size="x-small" />
          <ui-rating [(value)]="sized" size="small" />
          <ui-rating [(value)]="sized" size="medium" />
          <ui-rating [(value)]="sized" size="large" />
          <ui-rating [(value)]="sized" size="x-large" />
        </div>
      }
      @case ('Variants') {
        <div class="space-y-3">
          <ui-rating [(value)]="variantValue" variant="outlined" halfIncrements />
          <ui-rating [(value)]="variantValue" variant="filled" halfIncrements />
          <ui-rating [(value)]="variantValue" variant="soft" halfIncrements />
        </div>
      }
      @case ('Custom max') {
        <div class="space-y-3">
          <ui-rating [(value)]="tenScale" [max]="10" size="small" />
          <p class="text-muted-foreground text-xs">{{ tenScale }} / 10</p>
        </div>
      }
      @case ('Read-only') {
        <div class="flex items-center gap-2">
          <ui-rating [value]="4.5" [max]="5" halfIncrements readonly />
          <span class="text-muted-foreground text-xs">(4.5 from 1,284 reviews)</span>
        </div>
      }
      @case ('Disabled') {
        <ui-rating [(value)]="lockedRating" [max]="5" disabled />
      }
      @case ('Clearable') {
        <div class="space-y-2">
          <ui-rating [(value)]="clearableRating" [max]="5" clearable />
          <p class="text-muted-foreground text-xs">
            Click the active star to clear. Value: <code class="text-foreground">{{ clearableRating }}</code>
          </p>
        </div>
      }
      @case ('Show value') {
        <ui-rating [(value)]="valued" [max]="5" halfIncrements showValue />
      }
      @case ('With tooltips') {
        <ui-rating [(value)]="tooltipped" [max]="5" [tooltips]="tooltipLabels" />
      }
      @case ('Integer-only') {
        <ui-rating [(value)]="integerOnly" [max]="5" />
      }
      @case ('Hover effect') {
        <ui-rating [(value)]="reviewScore" [max]="5" hover />
      }
    }
  `,
})
export class AngularRatingDemoComponent {
  @Input() story = 'Default'
  value = 3.5
  sized = 4
  variantValue = 4.5
  tenScale = 7
  reviewScore = 4
  lockedRating = 3
  clearableRating = 2
  valued = 3.5
  tooltipped = 3
  integerOnly = 4
  readonly tooltipLabels = ['Terrible', 'Poor', 'Average', 'Good', 'Excellent']
}
