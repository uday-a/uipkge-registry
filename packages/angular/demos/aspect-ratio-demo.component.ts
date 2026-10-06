import { Component, Input } from '@angular/core'
import { UiAspectRatioComponent } from '../../../../../packages/registry-angular/components/aspect-ratio/aspect-ratio.component'

/** Angular demo for the aspect-ratio page. Mirrors demos/react/aspect-ratio.tsx story by story. */
@Component({
  selector: 'angular-aspect-ratio-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiAspectRatioComponent],
  template: `
    @switch (story) {
      @case ('Common ratios') {
        <div class="grid gap-3 sm:grid-cols-3">
          <div>
            <div ui-aspect-ratio [ratio]="16 / 9" class="bg-muted grid place-items-center rounded-md">
              <span class="text-muted-foreground font-mono text-xs">16 : 9</span>
            </div>
          </div>
          <div>
            <div ui-aspect-ratio [ratio]="4 / 3" class="bg-muted grid place-items-center rounded-md">
              <span class="text-muted-foreground font-mono text-xs">4 : 3</span>
            </div>
          </div>
          <div>
            <div ui-aspect-ratio [ratio]="1" class="bg-muted grid place-items-center rounded-md">
              <span class="text-muted-foreground font-mono text-xs">1 : 1</span>
            </div>
          </div>
        </div>
      }
      @case ('Portrait') {
        <div class="grid max-w-md gap-3 sm:grid-cols-2">
          <div ui-aspect-ratio [ratio]="3 / 4" class="bg-muted grid place-items-center rounded-md">
            <span class="text-muted-foreground font-mono text-xs">3 : 4</span>
          </div>
          <div ui-aspect-ratio [ratio]="9 / 16" class="bg-muted grid place-items-center rounded-md">
            <span class="text-muted-foreground font-mono text-xs">9 : 16</span>
          </div>
        </div>
      }
      @case ('Ultrawide') {
        <div class="space-y-3">
          <div ui-aspect-ratio [ratio]="21 / 9" class="bg-muted grid place-items-center rounded-md">
            <span class="text-muted-foreground font-mono text-xs">21 : 9</span>
          </div>
          <div ui-aspect-ratio [ratio]="32 / 9" class="bg-muted grid place-items-center rounded-md">
            <span class="text-muted-foreground font-mono text-xs">32 : 9</span>
          </div>
        </div>
      }
      @case ('With image fill') {
        <div class="max-w-md">
          <div ui-aspect-ratio [ratio]="16 / 9" class="bg-muted overflow-hidden rounded-md">
            <img
              src="https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=800&dpr=2&q=80"
              alt="Drew beach at sunset"
              class="size-full object-cover"
            />
          </div>
        </div>
      }
      @case ('Video placeholder') {
        <div class="max-w-md">
          <div
            ui-aspect-ratio
            [ratio]="16 / 9"
            class="bg-muted/50 grid place-items-center rounded-md border border-dashed"
          >
            <div class="text-muted-foreground flex flex-col items-center gap-2">
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
                class="lucide lucide-play size-8"
                aria-hidden="true"
              >
                <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
              </svg>
              <span class="text-xs">Video player (16:9)</span>
            </div>
          </div>
        </div>
      }
    }
  `,
})
export class AngularAspectRatioDemoComponent {
  @Input() story = 'Common ratios'
}
