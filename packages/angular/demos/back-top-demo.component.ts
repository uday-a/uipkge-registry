import { Component, Input, signal } from '@angular/core'
import { UiBackTopComponent } from '../../../../../packages/registry-angular/components/back-top/back-top.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
  UiCardDescriptionComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

const feed = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  title: `Release notes v0.${i + 12}.0`,
  excerpt: 'Bug fixes, performance improvements, and a few new primitives shipped this week.',
}))

// Shared across story mounts: React renders every story in one tree, so the page-level
// instance's onVisible log shows up in the 'Visibility events' card.
const visibleLog = signal<string[]>([])

/** Angular demo for the back-top page. Mirrors demos/react/back-top.tsx story by story. */
@Component({
  selector: 'angular-back-top-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiBackTopComponent,
    UiCardComponent,
    UiCardContentComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
  ],
  template: `
    <ng-template #chevronUp
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
        class="lucide lucide-chevron-up"
        aria-hidden="true"
      >
        <path d="m18 15-6-6-6 6" /></svg
    ></ng-template>
    <ng-template #arrowUp
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
        class="lucide lucide-arrow-up size-5"
        aria-hidden="true"
      >
        <path d="m5 12 7-7 7 7" />
        <path d="M12 19V5" /></svg
    ></ng-template>
    @switch (story) {
      @case ('In a long article') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>Changelog</h3>
            <p ui-card-description>Scroll the list below to reveal the back-to-top button.</p>
          </div>
          <div ui-card-content>
            <div class="back-top-feed border-border relative max-h-64 space-y-2 overflow-y-auto rounded-md border p-3">
              @for (item of feed; track $index) {
                <div class="bg-muted/40 rounded-md p-3">
                  <p class="text-sm font-medium">{{ item.title }}</p>
                  <p class="text-muted-foreground mt-1 text-xs">{{ item.excerpt }}</p>
                </div>
              }
              <ui-back-top target=".back-top-feed" [offset]="8" [threshold]="40" position="bottom-right" absolute />
            </div>
          </div>
        </div>
      }
      @case ('Page-level (live)') {
        <p class="text-muted-foreground max-w-md text-sm">
          Scroll the page itself to reveal the floating button. It smooth-scrolls back to the top on click.
        </p>
        <ui-back-top [threshold]="200" [offset]="24" position="bottom-right" (visible)="onVisible($event)" />
      }
      @case ('Visibility events') {
        <div class="max-w-md space-y-1 text-xs">
          @for (log of visibleLog(); track log) {
            <p class="text-muted-foreground tabular-nums">
              {{ log }}
            </p>
          }
          @if (visibleLog().length === 0) {
            <p class="text-muted-foreground">Scroll the page to fire onVisible events.</p>
          }
        </div>
      }
      @case ('Size variants') {
        <div class="flex items-end gap-4">
          <div class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
            <ui-back-top size="sm" [threshold]="0" absolute [offset]="4" />
            <span class="text-muted-foreground mb-1 text-xs">sm</span>
          </div>
          <div class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
            <ui-back-top size="default" [threshold]="0" absolute [offset]="4" />
            <span class="text-muted-foreground mb-1 text-xs">default</span>
          </div>
          <div class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
            <ui-back-top size="lg" [threshold]="0" absolute [offset]="4" />
            <span class="text-muted-foreground mb-1 text-xs">lg</span>
          </div>
        </div>
      }
      @case ('Custom icon') {
        <div class="flex items-end gap-4">
          <div class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
            <ui-back-top [threshold]="0" absolute [offset]="4" [icon]="chevronUp" />
            <span class="text-muted-foreground mb-1 text-xs">ChevronUp</span>
          </div>
          <div class="border-border relative flex h-24 w-24 items-end justify-center rounded-md border">
            <ui-back-top [threshold]="0" absolute [offset]="4" [icon]="arrowUp" />
            <span class="text-muted-foreground mb-1 text-xs">ArrowUp</span>
          </div>
        </div>
      }
      @case ('Edge anchors') {
        <div class="grid max-w-md grid-cols-2 gap-4">
          <div class="border-border relative h-28 rounded-md border p-3">
            <span class="text-muted-foreground text-xs">bottom-right</span>
            <ui-back-top [threshold]="0" position="bottom-right" [offset]="8" absolute />
          </div>
          <div class="border-border relative h-28 rounded-md border p-3">
            <span class="text-muted-foreground text-xs">bottom-left</span>
            <ui-back-top [threshold]="0" position="bottom-left" [offset]="8" absolute />
          </div>
          <div class="border-border relative h-28 rounded-md border p-3">
            <span class="text-muted-foreground text-xs">top-right</span>
            <ui-back-top [threshold]="0" position="top-right" [offset]="8" absolute />
          </div>
          <div class="border-border relative h-28 rounded-md border p-3">
            <span class="text-muted-foreground text-xs">top-left</span>
            <ui-back-top [threshold]="0" position="top-left" [offset]="8" absolute />
          </div>
        </div>
      }
      @case ('Threshold & behavior') {
        <p class="text-muted-foreground max-w-md text-sm">
          Use a higher <code class="text-foreground">threshold</code> like 600px to delay visibility until the user has
          scrolled significantly. Set <code class="text-foreground">behavior="auto"</code> for an instant jump instead
          of the default animated scroll.
        </p>
      }
    }
  `,
})
export class AngularBackTopDemoComponent {
  @Input() story = 'In a long article'
  readonly feed = feed
  readonly visibleLog = visibleLog

  onVisible(v: boolean): void {
    visibleLog.update((prev) =>
      [`${v ? 'shown' : 'hidden'} at ${new Date().toLocaleTimeString()}`, ...prev].slice(0, 3),
    )
  }
}
