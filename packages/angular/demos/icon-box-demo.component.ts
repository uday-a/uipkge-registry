import { Component, Input } from '@angular/core'
import {
  UiCardComponent,
  UiCardContentComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import {
  UiIconBoxComponent,
  UiIconStackComponent,
} from '../../../../../packages/registry-angular/components/icon-box/icon-box.component'

const tiles = [
  { icon: 'folder', label: 'Documents', count: '128', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { icon: 'image', label: 'Photos', count: '2,431', color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { icon: 'music', label: 'Music', count: '512', color: 'text-violet-500', bg: 'bg-violet-500/10' },
  { icon: 'video', label: 'Videos', count: '64', color: 'text-sky-500', bg: 'bg-sky-500/10' },
  { icon: 'fileText', label: 'Notes', count: '349', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { icon: 'calendar', label: 'Events', count: '24', color: 'text-orange-500', bg: 'bg-orange-500/10' },
] as const

/** Angular demo for the icon-box page. Mirrors demos/react/icon-box.tsx story by story. */
@Component({
  selector: 'angular-icon-box-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiCardComponent, UiCardContentComponent, UiIconBoxComponent, UiIconStackComponent],
  template: `
    <ng-template #alertTriangle
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
        class="lucide lucide-triangle-alert"
        aria-hidden="true"
      >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" /></svg
    ></ng-template>
    <ng-template #bell
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
        class="lucide lucide-bell"
        aria-hidden="true"
      >
        <path d="M10.268 21a2 2 0 0 0 3.464 0" />
        <path
          d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
        /></svg
    ></ng-template>
    <ng-template #calendar
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
        class="lucide lucide-calendar"
        aria-hidden="true"
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" /></svg
    ></ng-template>
    <ng-template #fileText
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
        class="lucide lucide-file-text"
        aria-hidden="true"
      >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" /></svg
    ></ng-template>
    <ng-template #folder
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
        class="lucide lucide-folder"
        aria-hidden="true"
      >
        <path
          d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
        /></svg
    ></ng-template>
    <ng-template #heart
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
        class="lucide lucide-heart"
        aria-hidden="true"
      >
        <path
          d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"
        /></svg
    ></ng-template>
    <ng-template #image
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
        class="lucide lucide-image"
        aria-hidden="true"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg
    ></ng-template>
    <ng-template #inbox
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
        class="lucide lucide-inbox"
        aria-hidden="true"
      >
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path
          d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
        /></svg
    ></ng-template>
    <ng-template #music
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
        class="lucide lucide-music"
        aria-hidden="true"
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" /></svg
    ></ng-template>
    <ng-template #settings
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
        class="lucide lucide-settings"
        aria-hidden="true"
      >
        <path
          d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
        />
        <circle cx="12" cy="12" r="3" /></svg
    ></ng-template>
    <ng-template #shieldCheck
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
        class="lucide lucide-shield-check"
        aria-hidden="true"
      >
        <path
          d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
        />
        <path d="m9 12 2 2 4-4" /></svg
    ></ng-template>
    <ng-template #sparkles
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
        class="lucide lucide-sparkles"
        aria-hidden="true"
      >
        <path
          d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
        />
        <path d="M20 2v4" />
        <path d="M22 4h-4" />
        <circle cx="4" cy="20" r="2" /></svg
    ></ng-template>
    <ng-template #star
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
        class="lucide lucide-star"
        aria-hidden="true"
      >
        <path
          d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
        /></svg
    ></ng-template>
    <ng-template #users
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
        class="lucide lucide-users"
        aria-hidden="true"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <path d="M16 3.128a4 4 0 0 1 0 7.744" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <circle cx="9" cy="7" r="4" /></svg
    ></ng-template>
    <ng-template #video
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
        class="lucide lucide-video"
        aria-hidden="true"
      >
        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
        <rect x="2" y="6" width="14" height="12" rx="2" /></svg
    ></ng-template>
    <ng-template #zap
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
        class="lucide lucide-zap"
        aria-hidden="true"
      >
        <path
          d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
        /></svg
    ></ng-template>
    @switch (story) {
      @case ('Variants') {
        <div class="flex flex-wrap items-center gap-3">
          <ui-icon-box [icon]="bell" variant="primary" />
          <ui-icon-box [icon]="heart" variant="muted" />
          <ui-icon-box [icon]="star" variant="custom" class="bg-amber-500/15" iconClass="text-amber-500" />
        </div>
      }
      @case ('Shapes') {
        <div class="flex flex-wrap items-center gap-3">
          <ui-icon-box [icon]="settings" shape="rounded" />
          <ui-icon-box [icon]="settings" shape="circle" />
          <ui-icon-box [icon]="zap" variant="muted" shape="rounded" />
          <ui-icon-box [icon]="zap" variant="muted" shape="circle" />
        </div>
      }
      @case ('Sizes') {
        <div class="flex flex-wrap items-center gap-3">
          <ui-icon-box [icon]="bell" size="sm" />
          <ui-icon-box [icon]="bell" size="md" />
          <ui-icon-box [icon]="bell" size="lg" />
        </div>
      }
      @case ('Custom colors') {
        <div class="flex flex-wrap items-center gap-3">
          <ui-icon-box [icon]="heart" variant="custom" class="bg-rose-500/15" iconClass="text-rose-500" />
          <ui-icon-box [icon]="star" variant="custom" class="bg-amber-500/15" iconClass="text-amber-500" />
          <ui-icon-box [icon]="zap" variant="custom" class="bg-emerald-500/15" iconClass="text-emerald-500" />
          <ui-icon-box [icon]="bell" variant="custom" class="bg-sky-500/15" iconClass="text-sky-500" />
          <ui-icon-box [icon]="users" variant="custom" class="bg-violet-500/15" iconClass="text-violet-500" />
          <ui-icon-box [icon]="settings" variant="custom" class="bg-orange-500/15" iconClass="text-orange-500" />
        </div>
      }
      @case ('Category tiles') {
        <div class="grid max-w-3xl gap-3 sm:grid-cols-2 md:grid-cols-3">
          @for (t of tiles; track t.label) {
            <div
              ui-card
              class="cursor-pointer transition-[box-shadow,translate] hover:-translate-y-0.5 hover:shadow-md"
            >
              <div ui-card-content class="flex items-center gap-3 p-4">
                <ui-icon-box
                  [icon]="
                    {
                      folder: folder,
                      image: image,
                      music: music,
                      video: video,
                      fileText: fileText,
                      calendar: calendar,
                    }[t.icon]
                  "
                  variant="custom"
                  size="lg"
                  [class]="t.bg"
                  [iconClass]="t.color"
                />
                <div>
                  <p class="text-sm font-semibold">{{ t.label }}</p>
                  <p class="text-muted-foreground text-xs">{{ t.count }} items</p>
                </div>
              </div>
            </div>
          }
        </div>
      }
      @case ('Surface Tiles & Tokens') {
        <div class="flex flex-wrap items-center gap-3">
          <ui-icon-box [icon]="shieldCheck" variant="solid" size="md" />
          <ui-icon-box [icon]="star" variant="outline" size="md" />
          <ui-icon-box [icon]="sparkles" variant="subtle" size="md" />
          <ui-icon-box [icon]="alertTriangle" variant="destructive" size="md" />
          <ui-icon-box [icon]="shieldCheck" variant="success" size="md" />
          <ui-icon-box [icon]="bell" variant="warning" size="md" />
        </div>
      }
      @case ('Isometric Icon Stack') {
        <div class="flex flex-wrap items-center gap-8 py-4">
          <ui-icon-stack [icon]="inbox" variant="primary" size="md" />
          <ui-icon-stack [icon]="sparkles" variant="muted" size="md" />
          <ui-icon-stack [icon]="shieldCheck" variant="success" size="lg" />
          <ui-icon-stack [icon]="alertTriangle" variant="destructive" size="md" />
        </div>
      }
    }
  `,
})
export class AngularIconBoxDemoComponent {
  @Input() story = 'Variants'
  readonly tiles = tiles
}
