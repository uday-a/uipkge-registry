import { Component, Input } from '@angular/core'
import {
  UiScrollAreaComponent,
  UiScrollBarComponent,
} from '../../../../../packages/registry-angular/components/scroll-area/scroll-area.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

/** Angular demo for the scroll-area page. Mirrors demos/react/scroll-area.tsx story by story. */
@Component({
  selector: 'angular-scroll-area-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiScrollAreaComponent,
    UiScrollBarComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-scroll-area class="border-border h-48 max-w-xs rounded-md border p-4">
          <h4 class="mb-3 text-sm font-medium">Tags</h4>
          <div class="space-y-1 font-mono text-sm">
            @for (t of tags; track t) {
              <div>{{ t }}</div>
            }
          </div>
        </ui-scroll-area>
      }
      @case ('Horizontal scroll') {
        <ui-scroll-area class="border-border max-w-2xl rounded-md border whitespace-nowrap">
          <div class="flex w-max gap-4 p-4">
            @for (f of figures; track f.id) {
              <figure class="shrink-0">
                <div class="bg-muted text-muted-foreground grid size-32 place-items-center rounded-md text-xs">
                  {{ f.title }}
                </div>
                <figcaption class="text-muted-foreground pt-2 text-xs">{{ f.caption }}</figcaption>
              </figure>
            }
          </div>
          <ui-scroll-bar orientation="horizontal" />
        </ui-scroll-area>
      }
      @case ('Both axes') {
        <ui-scroll-area class="border-border h-64 max-w-md rounded-md border">
          <div class="grid w-[640px] grid-cols-8 gap-2 p-4 font-mono text-xs">
            @for (n of grid; track n) {
              <div class="bg-muted grid aspect-square place-items-center rounded">{{ n }}</div>
            }
          </div>
          <ui-scroll-bar orientation="horizontal" />
        </ui-scroll-area>
      }
      @case ('Inside a card') {
        <div ui-card class="max-w-sm">
          <div ui-card-header>
            <div ui-card-title class="text-base">Activity feed</div>
            <div ui-card-description>Recent events, scrollable.</div>
          </div>
          <div ui-card-content class="px-0">
            <ui-scroll-area class="h-56 px-6">
              <ul class="space-y-3 text-sm">
                @for (i of events; track i) {
                  <li class="flex items-start gap-3">
                    <div class="bg-muted mt-0.5 size-2 shrink-0 rounded-full"></div>
                    <div>
                      <p>Event #{{ i }} — something happened.</p>
                      <p class="text-muted-foreground text-xs">{{ i * 2 }} minutes ago</p>
                    </div>
                  </li>
                }
              </ul>
            </ui-scroll-area>
          </div>
        </div>
      }
    }
  `,
})
export class AngularScrollAreaDemoComponent {
  @Input() story = 'Default'

  readonly tags = Array.from({ length: 30 }, (_, i) => `tag-${i + 1}`)
  readonly figures = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Figure ${i + 1}`,
    caption: `Photo by Photographer ${i + 1}`,
  }))
  readonly grid = Array.from({ length: 80 }, (_, i) => i + 1)
  readonly events = Array.from({ length: 25 }, (_, i) => i + 1)
}
