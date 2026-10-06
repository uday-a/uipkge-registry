import { Component, Input, signal } from '@angular/core'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import { UiLazyImageComponent } from '../../../../../packages/registry-angular/components/lazy-image/lazy-image.component'

const galleryItems = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  src: `https://picsum.photos/seed/uipkge-${i}/600/400`,
  alt: `Stock photo ${i + 1}`,
}))

/** Angular demo for the lazy-image page. Mirrors demos/react/lazy-image.tsx story by story. */
@Component({
  selector: 'angular-lazy-image-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiButtonComponent, UiLazyImageComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          @for (item of gallery; track item.id) {
            <div ui-lazy-image [src]="item.src" [alt]="item.alt" aspectRatio="3/2" class="rounded-md"></div>
          }
        </div>
      }
      @case ('Aspect ratios') {
        <div class="flex flex-wrap gap-3">
          <div
            ui-lazy-image
            src="https://picsum.photos/seed/uipkge-square/400/400"
            alt="Square"
            aspectRatio="1/1"
            class="w-40 rounded-md"
          ></div>
          <div
            ui-lazy-image
            src="https://picsum.photos/seed/uipkge-wide/800/450"
            alt="Wide"
            aspectRatio="16/9"
            class="w-72 rounded-md"
          ></div>
          <div
            ui-lazy-image
            src="https://picsum.photos/seed/uipkge-portrait/400/600"
            alt="Portrait"
            aspectRatio="2/3"
            class="w-36 rounded-md"
          ></div>
        </div>
      }
      @case ('Cover vs contain') {
        <div class="grid grid-cols-2 gap-3">
          <div>
            <p class="text-muted-foreground mb-2 text-xs">cover (default)</p>
            <div
              ui-lazy-image
              src="https://picsum.photos/seed/uipkge-cover/400/600"
              alt="Cover example"
              aspectRatio="16/9"
              class="rounded-md"
            ></div>
          </div>
          <div>
            <p class="text-muted-foreground mb-2 text-xs">contain</p>
            <div
              ui-lazy-image
              src="https://picsum.photos/seed/uipkge-cover/400/600"
              alt="Contain example"
              aspectRatio="16/9"
              [cover]="false"
              class="rounded-md"
            ></div>
          </div>
        </div>
      }
      @case ('Error fallback (slot + URL)') {
        <div class="grid grid-cols-3 gap-3">
          <div>
            <p class="text-muted-foreground mb-2 text-xs">No fallback</p>
            <div
              ui-lazy-image
              src="https://example.invalid/missing.jpg"
              alt="Broken"
              aspectRatio="1/1"
              class="rounded-md"
            ></div>
          </div>
          <div>
            <p class="text-muted-foreground mb-2 text-xs">Fallback URL</p>
            <div
              ui-lazy-image
              src="https://example.invalid/missing.jpg"
              alt="Broken with URL fallback"
              aspectRatio="1/1"
              fallback="https://picsum.photos/seed/uipkge-fallback/400/400"
              class="rounded-md"
            ></div>
          </div>
          <div>
            <p class="text-muted-foreground mb-2 text-xs">Slot fallback</p>
            <ng-template #failed>
              <div
                class="bg-destructive/10 text-destructive flex h-full items-center justify-center text-xs font-medium"
              >
                Failed
              </div>
            </ng-template>
            <div
              ui-lazy-image
              src="https://example.invalid/missing.jpg"
              alt="Broken with slot"
              aspectRatio="1/1"
              class="rounded-md"
              [fallbackContent]="failed"
            ></div>
          </div>
        </div>
      }
      @case ('Eager') {
        <div
          ui-lazy-image
          src="https://picsum.photos/seed/uipkge-hero/1200/600"
          alt="Hero"
          aspectRatio="2/1"
          eager
          class="rounded-md"
        ></div>
      }
      @case ('Swap src') {
        <div class="space-y-3">
          <div class="flex gap-2">
            <button ui-button size="sm" (click)="swap()">Swap image</button>
            <span class="text-muted-foreground self-center text-xs">{{ swapLabel() }}</span>
          </div>
          <div ui-lazy-image [src]="swapSrc()" alt="Swappable" aspectRatio="16/9" class="rounded-md"></div>
        </div>
      }
    }
  `,
})
export class AngularLazyImageDemoComponent {
  @Input() story = 'Default'
  readonly gallery = galleryItems.slice(0, 6)
  readonly swapSrc = signal('https://picsum.photos/seed/uipkge-swap-a/800/450')
  swapLabel = () => this.swapSrc().split('/').slice(-3).join('/')

  swap(): void {
    this.swapSrc.update((prev) =>
      prev.includes('swap-a')
        ? 'https://picsum.photos/seed/uipkge-swap-b/800/450'
        : 'https://picsum.photos/seed/uipkge-swap-a/800/450',
    )
  }
}
