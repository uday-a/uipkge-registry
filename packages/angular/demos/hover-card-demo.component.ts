import { Component, Input } from '@angular/core'
import {
  UiHoverCardComponent,
  UiHoverCardContentComponent,
  UiHoverCardTriggerComponent,
} from '../../../../../packages/registry-angular/components/hover-card/hover-card.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import {
  UiAvatarComponent,
  UiAvatarFallbackComponent,
  UiAvatarImageComponent,
} from '../../../../../packages/registry-angular/components/avatar/avatar.component'

/** Angular demo for the hover-card page. Mirrors demos/react/hover-card.tsx story by story. */
@Component({
  selector: 'angular-hover-card-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiHoverCardComponent,
    UiHoverCardTriggerComponent,
    UiHoverCardContentComponent,
    UiButtonComponent,
    UiAvatarComponent,
    UiAvatarFallbackComponent,
    UiAvatarImageComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-hover-card>
          <button ui-button ui-hover-card-trigger variant="link">@uipkge</button>
          <ui-hover-card-content class="w-72">
            <div class="flex gap-3">
              <ui-avatar><ui-avatar-fallback>UI</ui-avatar-fallback></ui-avatar>
              <div class="space-y-1">
                <p class="text-sm font-semibold">@uipkge</p>
                <p class="text-muted-foreground text-xs">Open-source UI registry. shadcn-vue compatible.</p>
              </div>
            </div>
          </ui-hover-card-content>
        </ui-hover-card>
      }
      @case ('Custom delays') {
        <div class="flex flex-wrap items-center gap-4">
          <ui-hover-card [openDelay]="0" [closeDelay]="0">
            <button ui-button ui-hover-card-trigger variant="outline">Instant</button>
            <ui-hover-card-content class="w-56">
              <p class="text-sm">openDelay: 0 — appears immediately on hover.</p>
            </ui-hover-card-content>
          </ui-hover-card>
          <ui-hover-card [openDelay]="700" [closeDelay]="200">
            <button ui-button ui-hover-card-trigger variant="outline">Default-ish</button>
            <ui-hover-card-content class="w-56">
              <p class="text-sm">openDelay: 700 / closeDelay: 200 — feels intentional.</p>
            </ui-hover-card-content>
          </ui-hover-card>
          <ui-hover-card [openDelay]="1500" [closeDelay]="500">
            <button ui-button ui-hover-card-trigger variant="outline">Lazy</button>
            <ui-hover-card-content class="w-56">
              <p class="text-sm">openDelay: 1500 / closeDelay: 500 — slow to surface.</p>
            </ui-hover-card-content>
          </ui-hover-card>
        </div>
      }
      @case ('With image content') {
        <ui-hover-card>
          <button ui-button ui-hover-card-trigger variant="link">@vuejs</button>
          <ui-hover-card-content class="w-80">
            <div class="flex gap-4">
              <ui-avatar>
                <ui-avatar-image src="https://github.com/vuejs.png" alt="@vuejs" />
                <ui-avatar-fallback>VJ</ui-avatar-fallback>
              </ui-avatar>
              <div class="space-y-1">
                <h4 class="text-sm font-semibold">@vuejs</h4>
                <p class="text-sm">The Progressive JavaScript Framework.</p>
                <div class="text-muted-foreground flex items-center gap-1 pt-2 text-xs">
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
                    class="lucide lucide-calendar-days size-3.5"
                    aria-hidden="true"
                  >
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                    <path d="M8 14h.01" />
                    <path d="M12 14h.01" />
                    <path d="M16 14h.01" />
                    <path d="M8 18h.01" />
                    <path d="M12 18h.01" />
                    <path d="M16 18h.01" />
                  </svg>
                  <span>Joined December 2013</span>
                </div>
              </div>
            </div>
          </ui-hover-card-content>
        </ui-hover-card>
      }
      @case ('Inline mentions in a paragraph') {
        <p class="max-w-prose text-sm leading-7">
          Big thanks to
          <ui-hover-card
            ><button ui-button ui-hover-card-trigger variant="link" class="h-auto px-0 py-0 align-baseline">
              @nuxt
            </button>
            <ui-hover-card-content class="w-64">
              <div class="flex gap-3">
                <ui-avatar><ui-avatar-fallback>NX</ui-avatar-fallback></ui-avatar>
                <div>
                  <p class="text-sm font-semibold">@nuxt</p>
                  <p class="text-muted-foreground text-xs">The Intuitive Vue Framework.</p>
                </div>
              </div>
            </ui-hover-card-content></ui-hover-card
          >
          and
          <ui-hover-card
            ><button ui-button ui-hover-card-trigger variant="link" class="h-auto px-0 py-0 align-baseline">
              @reka-ui
            </button>
            <ui-hover-card-content class="w-64">
              <div class="flex gap-3">
                <ui-avatar><ui-avatar-fallback>RK</ui-avatar-fallback></ui-avatar>
                <div>
                  <p class="text-sm font-semibold">@reka-ui</p>
                  <p class="text-muted-foreground text-xs">Unstyled, accessible primitives.</p>
                </div>
              </div>
            </ui-hover-card-content></ui-hover-card
          >
          for the foundations this builds on.
        </p>
      }
      @case ('Placement variants') {
        <div class="grid grid-cols-2 place-items-center gap-x-12 gap-y-6 py-12 sm:grid-cols-4">
          @for (side of sides; track side) {
            <ui-hover-card>
              <button ui-button ui-hover-card-trigger variant="outline" class="capitalize">{{ side }}</button>
              <ui-hover-card-content [side]="side" class="w-48">
                <p class="text-sm font-medium capitalize">{{ side }} placement</p>
                <p class="text-muted-foreground mt-1 text-xs">side='{{ side }}' on HoverCardContent.</p>
              </ui-hover-card-content>
            </ui-hover-card>
          }
        </div>
      }
    }
  `,
})
export class AngularHoverCardDemoComponent {
  @Input() story = 'Default'
  readonly sides = ['top', 'right', 'bottom', 'left'] as const
}
