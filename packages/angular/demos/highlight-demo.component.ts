import { Component, Input, computed, signal } from '@angular/core'
import { UiHighlightComponent } from '../../../../../packages/registry-angular/components/highlight/highlight.component'
import { UiInputComponent } from '../../../../../packages/registry-angular/components/input/input.component'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'

const longText = 'The quick brown fox jumps over the lazy dog. Foxes are clever, and the dog was not amused by the fox.'

const items = [
  'Vue 3.5 Composition API',
  'React 19 Server Components',
  'Astro 5 Islands Architecture',
  'Tailwind CSS v4 Tokens',
  'Reka UI Headless Primitives',
  'TypeScript 5.7 Strict Mode',
  'Vite 6 Rolldown Bundler',
  'Nuxt 4 Nitro Engine',
]

/** Angular demo for the highlight page. Mirrors demos/react/highlight.tsx story by story. */
@Component({
  selector: 'angular-highlight-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiHighlightComponent, UiInputComponent, UiBadgeComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-highlight text="The quick brown fox jumps over the lazy dog" query="fox" />
      }
      @case ('Multiple matches') {
        <ui-highlight text="banana bandana cabana" query="na" />
      }
      @case ('Case-insensitive (default)') {
        <ui-highlight text="Vue vue VUE vUe" query="vue" />
      }
      @case ('Case-sensitive') {
        <ui-highlight text="Vue vue VUE vUe" query="vue" caseSensitive />
      }
      @case ('Whole-word matching') {
        <ui-highlight text="fox foxes foxy" query="fox" wholeWord />
      }
      @case ('Regex query') {
        <ui-highlight [text]="longText" [query]="foxPattern" />
      }
      @case ('Max highlights') {
        <ui-highlight text="a b a b a b a b" query="a" [maxHighlights]="3" />
      }
      @case ('Custom highlight class') {
        <ui-highlight
          text="Search results matter"
          query="results"
          highlightClass="bg-primary/20 text-primary font-semibold rounded px-1"
        />
      }
      @case ('Live search with match count') {
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <ui-input [(value)]="search" placeholder="Search..." class="max-w-xs" />
            @if (matchCount() > 0) {
              <span ui-badge variant="secondary"
                >{{ matchCount() }} {{ matchCount() === 1 ? 'match' : 'matches' }}</span
              >
            }
          </div>
          <p class="text-sm leading-relaxed">
            <ui-highlight [text]="longText" [query]="search()" (totalMatchCount)="matchCount.set($event)" />
          </p>
        </div>
      }
      @case ('List filtering') {
        <div class="space-y-3">
          <ui-input [(value)]="listSearch" placeholder="Filter items..." class="max-w-xs" />
          <div class="space-y-1">
            @for (item of filteredItems(); track item) {
              <div class="border-border bg-card rounded-md border px-3 py-2 text-sm">
                <ui-highlight [text]="item" [query]="listSearch()" />
              </div>
            }
            @if (filteredItems().length === 0) {
              <p class="text-muted-foreground py-2 text-center text-sm">
                No results for &ldquo;{{ listSearch() }}&rdquo;
              </p>
            }
          </div>
        </div>
      }
      @case ('No query') {
        <ui-highlight text="Nothing is highlighted here" query="" />
      }
      @case ('No matches') {
        <ui-highlight text="Nothing to see here" query="xyz" />
      }
      @case ('Multi-line text') {
        <ui-highlight [text]="multiLine" query="fox" />
      }
      @case ('Custom tag + class') {
        <ui-highlight
          text="Find the needle in the haystack"
          query="needle"
          highlightTag="span"
          highlightClass="bg-violet-200 text-violet-900 dark:bg-violet-500/30 dark:text-violet-100 rounded px-1 font-medium"
        />
      }
    }
  `,
})
export class AngularHighlightDemoComponent {
  @Input() story = 'Default'

  readonly longText = longText
  readonly foxPattern = /\bfox\w*/gi
  readonly multiLine = 'Line one has a fox.\nLine two has a dog.\nLine three has another fox.'

  readonly search = signal('fox')
  readonly matchCount = signal(0)
  readonly listSearch = signal('')
  readonly filteredItems = computed(() => {
    const q = this.listSearch().toLowerCase()
    return q ? items.filter((i) => i.toLowerCase().includes(q)) : items
  })
}
