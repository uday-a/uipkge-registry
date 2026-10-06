import { Component, Input } from '@angular/core'
import {
  UiSkeletonComponent,
  UiSkeletonLoaderComponent,
  UiSkeletonTextComponent,
} from '../../../../../packages/registry-angular/components/skeleton/skeleton.component'

/** Angular demo for the skeleton page. Mirrors demos/react/skeleton.tsx story by story. */
@Component({
  selector: 'angular-skeleton-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiSkeletonComponent, UiSkeletonTextComponent, UiSkeletonLoaderComponent],
  template: `
    @switch (story) {
      @case ('Profile placeholder') {
        <div class="max-w-md space-y-4">
          <div class="flex items-center gap-3">
            <ui-skeleton class="size-10 rounded-full" />
            <div class="flex-1 space-y-2">
              <ui-skeleton class="h-3 w-1/2" />
              <ui-skeleton class="h-3 w-3/4" />
            </div>
          </div>
          <ui-skeleton class="h-32 w-full" />
        </div>
      }
      @case ('Card placeholder') {
        <div class="grid max-w-sm gap-3">
          <ui-skeleton class="h-3 w-1/3" />
          <ui-skeleton class="h-7 w-full" />
          <ui-skeleton class="h-7 w-full" />
          <ui-skeleton class="h-3 w-1/2" />
        </div>
      }
      @case ('SkeletonText paragraph') {
        <ui-skeleton-text [lines]="4" firstLineWidth="100%" lastLineWidth="60%" class="max-w-md" />
      }
      @case ('SkeletonLoader presets') {
        <div class="grid max-w-3xl gap-6 md:grid-cols-2">
          <div class="space-y-2">
            <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">article</p>
            <div class="rounded-lg border p-4">
              <ui-skeleton-loader variant="article" [rows]="3" />
            </div>
          </div>
          <div class="space-y-2">
            <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">card-avatar</p>
            <div class="rounded-lg border p-4">
              <ui-skeleton-loader variant="card-avatar" [rows]="2" />
            </div>
          </div>
          <div class="space-y-2">
            <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">list-item-three-line</p>
            <div class="rounded-lg border p-4">
              <ui-skeleton-loader variant="list-item-three-line" [rows]="3" />
            </div>
          </div>
          <div class="space-y-2">
            <p class="text-muted-foreground text-xs font-medium tracking-wide uppercase">table</p>
            <div class="rounded-lg border p-4">
              <ui-skeleton-loader variant="table" [rows]="4" />
            </div>
          </div>
        </div>
      }
      @case ('SkeletonLoader atoms') {
        <div class="flex flex-wrap items-center gap-4">
          <ui-skeleton-loader variant="avatar-small" />
          <ui-skeleton-loader variant="avatar" />
          <ui-skeleton-loader variant="avatar-large" />
          <ui-skeleton-loader variant="button" />
          <ui-skeleton-loader variant="badge" />
          <ui-skeleton-loader variant="chip" />
          <ui-skeleton-loader variant="chip-icon" />
        </div>
      }
      @case ('Image placeholders') {
        <div class="grid max-w-3xl gap-4 md:grid-cols-3">
          <ui-skeleton-loader variant="image-small" />
          <ui-skeleton-loader variant="image" />
          <ui-skeleton-loader variant="image-large" />
        </div>
      }
    }
  `,
})
export class AngularSkeletonDemoComponent {
  @Input() story = 'Profile placeholder'
}
