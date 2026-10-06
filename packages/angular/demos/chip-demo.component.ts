import { Component, Input, signal } from '@angular/core'
import {
  UiChipComponent,
  UiChipGroupComponent,
} from '../../../../../packages/registry-angular/components/chip/chip.component'

const TAGS = ['design', 'engineering', 'product', 'marketing']

/** Angular demo for the chip page. Mirrors demos/react/chip.tsx story by story. */
@Component({
  selector: 'angular-chip-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiChipComponent, UiChipGroupComponent],
  template: `
    @switch (story) {
      @case ('Variants') {
        <div class="flex flex-wrap gap-2">
          <span ui-chip>Default</span>
          <span ui-chip variant="filled">Filled</span>
          <span ui-chip variant="outlined">Outlined</span>
          <span ui-chip variant="elevated">Elevated</span>
          <span ui-chip variant="success">Success</span>
          <span ui-chip variant="warning">Warning</span>
          <span ui-chip variant="destructive">Destructive</span>
        </div>
      }
      @case ('Sizes') {
        <div class="flex flex-wrap items-center gap-2">
          <span ui-chip size="sm">Small</span>
          <span ui-chip>Default</span>
          <span ui-chip size="lg">Large</span>
        </div>
      }
      @case ('With leading icon') {
        <div class="flex flex-wrap gap-2">
          <span ui-chip
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
              class="lucide lucide-hash size-3"
              aria-hidden="true"
            >
              <line x1="4" x2="20" y1="9" y2="9" />
              <line x1="4" x2="20" y1="15" y2="15" />
              <line x1="10" x2="8" y1="3" y2="21" />
              <line x1="16" x2="14" y1="3" y2="21" />
            </svg>
            design</span
          >
          <span ui-chip
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
              class="lucide lucide-hash size-3"
              aria-hidden="true"
            >
              <line x1="4" x2="20" y1="9" y2="9" />
              <line x1="4" x2="20" y1="15" y2="15" />
              <line x1="10" x2="8" y1="3" y2="21" />
              <line x1="16" x2="14" y1="3" y2="21" />
            </svg>
            engineering</span
          >
          <span ui-chip
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
              class="lucide lucide-hash size-3"
              aria-hidden="true"
            >
              <line x1="4" x2="20" y1="9" y2="9" />
              <line x1="4" x2="20" y1="15" y2="15" />
              <line x1="10" x2="8" y1="3" y2="21" />
              <line x1="16" x2="14" y1="3" y2="21" />
            </svg>
            product</span
          >
        </div>
      }
      @case ('Closable') {
        <div class="flex flex-wrap gap-2">
          <span ui-chip closable>tag-one</span>
          <span ui-chip closable variant="elevated">tag-two</span>
          <span ui-chip closable variant="outlined">tag-three</span>
        </div>
      }
      @case ('ChipGroup with reactive removal') {
        <div class="space-y-3">
          <div ui-chip-group>
            @for (tag of tags(); track tag) {
              <span ui-chip variant="elevated" closable (close)="removeTag(tag)">#{{ tag }}</span>
            }
          </div>
          @if (tags().length === 0) {
            <button class="text-muted-foreground text-xs underline" (click)="reset()">Reset chips</button>
          }
        </div>
      }
      @case ('Status filters') {
        <div ui-chip-group>
          <span ui-chip variant="success">2 passing</span>
          <span ui-chip variant="warning">3 pending</span>
          <span ui-chip variant="destructive">1 failed</span>
        </div>
      }
    }
  `,
})
export class AngularChipDemoComponent {
  @Input() story = 'Variants'
  readonly tags = signal([...TAGS])

  reset(): void {
    this.tags.set([...TAGS])
  }

  removeTag(tag: string): void {
    this.tags.update((prev) => prev.filter((t) => t !== tag))
  }
}
