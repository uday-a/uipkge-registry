import { Component, Input } from '@angular/core'
import { UiScrollProgressComponent } from '../../../../../packages/registry-angular/components/scroll-progress/scroll-progress.component'
import { UiBackTopComponent } from '../../../../../packages/registry-angular/components/back-top/back-top.component'

const passages = [
  'The bar above is bound to this box, not to the page. position="absolute" pins it to the top edge of the nearest positioned ancestor, while container tells it which element to measure.',
  'Scroll inside the box and the bar fills relative to the box depth only — the page behind it keeps its own independent progress state.',
  'Because measurement reads scrollTop against scrollHeight minus clientHeight, the math works for any scrollable element: modals, side panels, chat transcripts, or code panes.',
  'Divide-by-zero is guarded: when content is shorter than the viewport of the box, progress simply stays at zero instead of producing NaN.',
  'Swap container at runtime and the listeners re-attach to the new element, so dynamic layouts do not leak scroll handlers.',
  'Everything tears down on unmount — scroll and resize listeners plus any in-flight animation frame.',
]

const filler = [
  'Reading progress is one of those quiet affordances: nobody notices it until it is missing. A slim bar gives long pages a sense of place without spending vertical space.',
  'Keep it out of the way. Three pixels in --primary is usually enough; anything thicker starts competing with real content for attention.',
  'Color is applied straight to the background property, so brand gradients work with no extra plumbing — try a linear-gradient across your chart tokens.',
  'Smoothing eases the bar toward its target each frame with a lerp factor of 0.18, settling within a thousandth. Set smooth={false} for raw one-to-one tracking.',
  'Under prefers-reduced-motion the component drops smoothing automatically and tracks raw scroll, respecting the reader regardless of the prop.',
  'Contained mode swaps fixed positioning for absolute, letting the same primitive serve dashboards, drawers, and split panes.',
  'Layering matters: at z-50 the bar rides above sticky headers at z-40, so the two can coexist without visual collision.',
  'Pair it with a back-to-top action once readers are deep into the page — progress shows how far they have come, the button offers the way back.',
]

/** Angular demo for the scroll-progress page. Mirrors demos/react/scroll-progress.tsx story by story. */
@Component({
  selector: 'angular-scroll-progress-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiScrollProgressComponent, UiBackTopComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="space-y-3">
          <ui-scroll-progress />
          <p class="text-muted-foreground text-sm leading-relaxed">
            The bar sits at the very top edge of the viewport. Multiple fixed instances on one demo page stack into
            lanes, so each story below offsets itself a little to stay visible.
          </p>
        </div>
      }
      @case ('Thick editorial') {
        <ui-scroll-progress [height]="6" class="top-2" />
      }
      @case ('Hairline') {
        <ui-scroll-progress [height]="2" color="var(--muted-foreground)" class="top-4" />
      }
      @case ('Brand gradient') {
        <ui-scroll-progress color="linear-gradient(90deg, var(--chart-1), var(--chart-3))" class="top-6" />
      }
      @case ('Destructive accent') {
        <ui-scroll-progress color="var(--destructive)" class="top-8" />
      }
      @case ('Smooth off') {
        <div class="space-y-3">
          <ui-scroll-progress [smooth]="false" color="var(--chart-2)" class="top-10" />
          <p class="text-muted-foreground text-sm leading-relaxed">
            Raw tracking updates state directly in the scroll handler — no animation frame loop is ever started.
          </p>
        </div>
      }
      @case ('Contained mode') {
        <div #box class="border-border bg-background relative h-56 rounded-md border">
          <ui-scroll-progress position="absolute" [container]="box" />
          <div class="h-full space-y-3 overflow-y-auto p-4">
            @for (para of passages; track $index) {
              <p class="text-muted-foreground text-sm leading-relaxed">{{ para }}</p>
            }
          </div>
        </div>
      }
      @case ('Article composition') {
        <article class="space-y-3">
          <ui-scroll-progress class="top-12" />
          <header class="space-y-1">
            <h3 class="text-lg font-semibold">Designing motion that respects attention</h3>
            <div class="text-muted-foreground flex items-center gap-2 text-xs">
              <span>Engineering</span>
              <span aria-hidden="true">·</span>
              <span>6 min read</span>
              <span aria-hidden="true">·</span>
              <span>Aug 2026</span>
            </div>
          </header>
          <p class="text-muted-foreground text-sm leading-relaxed">
            Progress indicators earn their place by being glanceable and forgettable at once. This composition keeps the
            chrome minimal: a title, a meta row, and three pixels of state.
          </p>
          <p class="text-muted-foreground text-sm leading-relaxed">{{ filler[4] }}</p>
        </article>
      }
      @case ('With BackTop') {
        <div class="space-y-3">
          <ui-scroll-progress color="linear-gradient(90deg, var(--chart-1), var(--chart-3))" class="top-14" />
          <p class="text-muted-foreground text-sm leading-relaxed">
            Scroll past the threshold and the back-top button fades in at the bottom-right corner.
          </p>
          <ui-back-top />
        </div>
      }
      @case ('Above a sticky header') {
        <div class="relative">
          <div
            class="bg-background/80 text-muted-foreground sticky top-0 z-40 flex h-10 items-center gap-2 border-b px-4 text-xs backdrop-blur"
          >
            <span class="text-foreground font-medium">Sticky header (z-40)</span>
            <span aria-hidden="true">—</span>
            <span>the default bar overlays it at z-50</span>
          </div>
          <div class="space-y-3 p-4">
            <p class="text-muted-foreground text-sm leading-relaxed">
              Keep scrolling — the header sticks to the viewport top while the progress bar paints over its top edge.
            </p>
            <p class="text-muted-foreground text-sm leading-relaxed">{{ filler[6] }}</p>
          </div>
        </div>
      }
    }
  `,
})
export class AngularScrollProgressDemoComponent {
  @Input() story = 'Default'
  readonly passages = passages
  readonly filler = filler
}
