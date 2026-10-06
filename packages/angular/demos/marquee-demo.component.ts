import { Component, Input } from '@angular/core'
import {
  UiMarqueeComponent,
  UiMarqueeItemDirective,
} from '../../../../../packages/registry-angular/components/marquee/marquee.component'
import {
  UiAvatarComponent,
  UiAvatarFallbackComponent,
} from '../../../../../packages/registry-angular/components/avatar/avatar.component'
import { UiBadgeComponent } from '../../../../../packages/registry-angular/components/badge/badge.component'

/** Angular demo for the marquee page. Mirrors demos/react/marquee.tsx story by story. */
@Component({
  selector: 'angular-marquee-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiMarqueeComponent, UiMarqueeItemDirective, UiAvatarComponent, UiAvatarFallbackComponent, UiBadgeComponent],
  template: `
    @switch (story) {
      @case ('Horizontal (default)') {
        <ui-marquee class="bg-muted/40 rounded-md py-3">
          <ng-template uiMarqueeItem>
            @for (t of ['Vue', 'React', 'Astro', 'Tailwind', 'Reka UI', 'Vite']; track $index) {
              <span class="px-2 text-sm font-medium">{{ t }}</span>
            }
          </ng-template>
        </ui-marquee>
      }
      @case ('Direction right') {
        <ui-marquee direction="right" class="bg-muted/40 rounded-md py-3">
          <ng-template uiMarqueeItem>
            @for (t of ['Vue', 'React', 'Astro', 'Tailwind', 'Reka UI', 'Vite']; track $index) {
              <span class="px-2 text-sm font-medium">{{ t }}</span>
            }
          </ng-template>
        </ui-marquee>
      }
      @case ('Speed') {
        <ui-marquee [speed]="8" class="bg-muted/40 rounded-md py-3">
          <ng-template uiMarqueeItem>
            @for (t of ['Fast', 'Fast', 'Fast', 'Fast', 'Fast', 'Fast']; track $index) {
              <span class="px-2 text-sm font-medium">{{ t }}</span>
            }
          </ng-template>
        </ui-marquee>
      }
      @case ('Slow') {
        <ui-marquee [speed]="40" class="bg-muted/40 rounded-md py-3">
          <ng-template uiMarqueeItem>
            @for (t of ['Slow', 'Slow', 'Slow', 'Slow', 'Slow', 'Slow']; track $index) {
              <span class="px-2 text-sm font-medium">{{ t }}</span>
            }
          </ng-template>
        </ui-marquee>
      }
      @case ('Pause on hover') {
        <ui-marquee pauseOnHover class="bg-muted/40 rounded-md py-3">
          <ng-template uiMarqueeItem>
            @for (t of ['Hover', 'me', 'to', 'pause', 'the', 'scroll']; track $index) {
              <span class="px-2 text-sm font-medium">{{ t }}</span>
            }
          </ng-template>
        </ui-marquee>
      }
      @case ('Paused') {
        <ui-marquee paused class="bg-muted/40 rounded-md py-3">
          <ng-template uiMarqueeItem>
            @for (t of ['Frozen', 'Frozen', 'Frozen', 'Frozen']; track $index) {
              <span class="px-2 text-sm font-medium">{{ t }}</span>
            }
          </ng-template>
        </ui-marquee>
      }
      @case ('Gap') {
        <ui-marquee [gap]="48" class="bg-muted/40 rounded-md py-3">
          <ng-template uiMarqueeItem>
            @for (t of ['A', 'B', 'C', 'D']; track t) {
              <span ui-badge variant="secondary">{{ t }}</span>
            }
          </ng-template>
        </ui-marquee>
      }
      @case ('Repeat') {
        <ui-marquee [repeat]="3" class="bg-muted/40 rounded-md py-3">
          <ng-template uiMarqueeItem>
            @for (t of ['x3', 'x3', 'x3']; track $index) {
              <span class="px-2 text-sm font-medium">{{ t }}</span>
            }
          </ng-template>
        </ui-marquee>
      }
      @case ('Vertical') {
        <ui-marquee orientation="vertical" direction="up" [speed]="12" class="bg-muted/40 h-48 w-48 rounded-md">
          <ng-template uiMarqueeItem>
            @for (n of eight; track n) {
              <div class="flex items-center gap-2 py-2">
                <ui-avatar class="size-6"
                  ><ui-avatar-fallback class="text-xs">{{ n + 1 }}</ui-avatar-fallback></ui-avatar
                >
                <span class="text-sm">User {{ n + 1 }}</span>
              </div>
            }
          </ng-template>
        </ui-marquee>
      }
      @case ('Vertical down') {
        <ui-marquee orientation="vertical" direction="down" [speed]="12" class="bg-muted/40 h-48 w-48 rounded-md">
          <ng-template uiMarqueeItem>
            @for (n of eight; track n) {
              <div class="flex items-center gap-2 py-2">
                <ui-avatar class="size-6"
                  ><ui-avatar-fallback class="text-xs">{{ n + 1 }}</ui-avatar-fallback></ui-avatar
                >
                <span class="text-sm">User {{ n + 1 }}</span>
              </div>
            }
          </ng-template>
        </ui-marquee>
      }
      @case ('Avatars row') {
        <ui-marquee [speed]="15" [gap]="24" class="py-2">
          <ng-template uiMarqueeItem>
            @for (n of ten; track n) {
              <ui-avatar class="ring-background size-10 ring-2"
                ><ui-avatar-fallback>U{{ n + 1 }}</ui-avatar-fallback></ui-avatar
              >
            }
          </ng-template>
        </ui-marquee>
      }
    }
  `,
})
export class AngularMarqueeDemoComponent {
  @Input() story = 'Horizontal (default)'
  readonly eight = Array.from({ length: 8 }, (_, n) => n)
  readonly ten = Array.from({ length: 10 }, (_, n) => n)
}
