import { Component, Input } from '@angular/core'
import {
  UiCarouselComponent,
  UiCarouselContentComponent,
  UiCarouselFooterComponent,
  UiCarouselHeaderComponent,
  UiCarouselIndicatorsComponent,
  UiCarouselItemComponent,
  UiCarouselNextComponent,
  UiCarouselPreviousComponent,
} from '@/ui/carousel'
import { UiCardComponent, UiCardContentComponent } from '@/ui/card'

interface Slide {
  id: number
  color: string
  label: string
}

interface Testimonial {
  quote: string
  author: string
}

@Component({
  selector: 'angular-carousel-demo',
  standalone: true,
  imports: [
    UiCarouselComponent,
    UiCarouselContentComponent,
    UiCarouselFooterComponent,
    UiCarouselHeaderComponent,
    UiCarouselIndicatorsComponent,
    UiCarouselItemComponent,
    UiCarouselNextComponent,
    UiCarouselPreviousComponent,
    UiCardComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-carousel class="max-w-md">
          <ui-carousel-content>
            @for (_ of [0, 1, 2, 3, 4]; track $index) {
              <ui-carousel-item>
                <ui-card>
                  <ui-card-content class="flex aspect-square items-center justify-center p-6">
                    <span class="text-4xl font-bold">{{ $index + 1 }}</span>
                  </ui-card-content>
                </ui-card>
              </ui-carousel-item>
            }
          </ui-carousel-content>
          <ui-carousel-previous />
          <ui-carousel-next />
        </ui-carousel>
      }

      @case ('Vertical orientation') {
        <ui-carousel orientation="vertical" class="h-[280px] max-w-xs">
          <ui-carousel-content class="h-[280px]">
            @for (_ of [0, 1, 2, 3]; track $index) {
              <ui-carousel-item>
                <ui-card class="h-[260px]">
                  <ui-card-content class="flex h-full items-center justify-center p-6">
                    <span class="text-3xl font-bold">Slide {{ $index + 1 }}</span>
                  </ui-card-content>
                </ui-card>
              </ui-carousel-item>
            }
          </ui-carousel-content>
          <ui-carousel-previous />
          <ui-carousel-next />
        </ui-carousel>
      }

      @case ('With loop') {
        <ui-carousel [loop]="true" class="max-w-md">
          <ui-carousel-content>
            @for (_ of [0, 1, 2, 3]; track $index) {
              <ui-carousel-item>
                <ui-card>
                  <ui-card-content class="flex aspect-[16/9] items-center justify-center p-6">
                    <span class="text-2xl font-semibold">Loop · Slide {{ $index + 1 }}</span>
                  </ui-card-content>
                </ui-card>
              </ui-carousel-item>
            }
          </ui-carousel-content>
          <ui-carousel-previous />
          <ui-carousel-next />
        </ui-carousel>
      }

      @case ('With indicators') {
        <ui-carousel class="max-w-md">
          <ui-carousel-content>
            @for (s of slides; track s.id) {
              <ui-carousel-item>
                <div [class]="'flex aspect-[16/9] items-center justify-center rounded-lg ' + s.color">
                  <span class="text-2xl font-semibold tracking-tight">{{ s.label }}</span>
                </div>
              </ui-carousel-item>
            }
          </ui-carousel-content>
          <ui-carousel-footer class="justify-center">
            <ui-carousel-indicators [count]="5" [activeIndex]="0" />
          </ui-carousel-footer>
        </ui-carousel>
      }

      @case ('Header and footer') {
        <ui-carousel class="max-w-lg">
          <ui-carousel-header>
            <div>
              <p class="text-sm font-semibold">What people say</p>
              <p class="text-muted-foreground text-xs">Recent testimonials</p>
            </div>
            <div class="flex items-center gap-0.5">
              @for (_ of [0, 1, 2, 3, 4]; track $index) {
                <svg
                  class="size-3.5 fill-amber-500 text-amber-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
              }
            </div>
          </ui-carousel-header>
          <ui-carousel-content>
            @for (t of testimonials; track $index) {
              <ui-carousel-item>
                <ui-card>
                  <ui-card-content class="space-y-3 p-6">
                    <svg
                      class="text-primary/60 size-5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path
                        d="M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"
                      />
                      <path
                        d="M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"
                      />
                    </svg>
                    <p class="text-sm leading-relaxed">{{ t.quote }}</p>
                    <p class="text-muted-foreground text-xs">{{ t.author }}</p>
                  </ui-card-content>
                </ui-card>
              </ui-carousel-item>
            }
          </ui-carousel-content>
          <ui-carousel-footer>
            <ui-carousel-indicators [count]="3" [activeIndex]="0" />
            <div class="flex gap-2">
              <ui-carousel-previous class="static translate-y-0" />
              <ui-carousel-next class="static translate-y-0" />
            </div>
          </ui-carousel-footer>
        </ui-carousel>
      }

      @case ('Image cards') {
        <ui-carousel [loop]="true" class="max-w-md">
          <ui-carousel-content>
            @for (s of slides; track s.id) {
              <ui-carousel-item>
                <div class="relative overflow-hidden rounded-lg">
                  <div [class]="'flex aspect-[4/3] items-end p-4 ' + s.color">
                    <div>
                      <p class="text-xs font-medium tracking-wider uppercase opacity-70">Landscape</p>
                      <p class="text-lg font-semibold">{{ s.label }}</p>
                    </div>
                  </div>
                </div>
              </ui-carousel-item>
            }
          </ui-carousel-content>
          <ui-carousel-previous />
          <ui-carousel-next />
          <ui-carousel-footer class="justify-center">
            <ui-carousel-indicators [count]="5" [activeIndex]="0" />
          </ui-carousel-footer>
        </ui-carousel>
      }
    }
  `,
})
export class CarouselDemoComponent {
  @Input() story?: string

  readonly slides: Slide[] = [
    { id: 1, color: 'bg-rose-100 dark:bg-rose-950/40', label: 'Mountains' },
    { id: 2, color: 'bg-sky-100 dark:bg-sky-950/40', label: 'Ocean' },
    { id: 3, color: 'bg-emerald-100 dark:bg-emerald-950/40', label: 'Forest' },
    { id: 4, color: 'bg-amber-100 dark:bg-amber-950/40', label: 'Desert' },
    { id: 5, color: 'bg-violet-100 dark:bg-violet-950/40', label: 'Aurora' },
  ]

  readonly testimonials: Testimonial[] = [
    { quote: 'Shipped our dashboard in two days flat.', author: 'Lena · Acme' },
    { quote: 'Cleanest registry I have used. Period.', author: 'Marcus · Northwind' },
    { quote: 'Tokens, blocks, components — all sane defaults.', author: 'Priya · Globex' },
  ]
}
