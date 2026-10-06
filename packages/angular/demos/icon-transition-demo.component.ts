import { Component, Input, signal } from '@angular/core'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import { UiIconTransitionComponent } from '../../../../../packages/registry-angular/components/icon-transition/icon-transition.component'

const sampleUrl = 'https://uipkge.dev/r/vue/button.json'

/** Angular demo for the icon-transition page. Mirrors demos/react/icon-transition.tsx story by story. */
@Component({
  selector: 'angular-icon-transition-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiButtonComponent, UiIconTransitionComponent],
  template: `
    <ng-template #copy
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
        class="lucide lucide-copy"
        aria-hidden="true"
      >
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg
    ></ng-template>
    <ng-template #check
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
        class="lucide lucide-check"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" /></svg
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
    <ng-template #bookmark
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
        class="lucide lucide-bookmark"
        aria-hidden="true"
      >
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg
    ></ng-template>
    <ng-template #bookmarkCheck
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
        class="lucide lucide-bookmark-check"
        aria-hidden="true"
      >
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
        <path d="m9 10 2 2 4-4" /></svg
    ></ng-template>
    <ng-template #share
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
        class="lucide lucide-share-2"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg
    ></ng-template>
    <ng-template #userPlus
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
        class="lucide lucide-user-plus"
        aria-hidden="true"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" x2="19" y1="8" y2="14" />
        <line x1="22" x2="16" y1="11" y2="11" /></svg
    ></ng-template>
    <ng-template #userCheck
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
        class="lucide lucide-user-check"
        aria-hidden="true"
      >
        <path d="m16 11 2 2 4-4" />
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" /></svg
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
    <ng-template #thumbsUp
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
        class="lucide lucide-thumbs-up"
        aria-hidden="true"
      >
        <path d="M7 10v12" />
        <path
          d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
        /></svg
    ></ng-template>
    <ng-template #plus
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
        class="lucide lucide-plus"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" /></svg
    ></ng-template>
    <ng-template #link
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
        class="lucide lucide-link-2"
        aria-hidden="true"
      >
        <path d="M9 17H7A5 5 0 0 1 7 7h2" />
        <path d="M15 7h2a5 5 0 1 1 0 10h-2" />
        <line x1="8" x2="16" y1="12" y2="12" /></svg
    ></ng-template>
    @switch (story) {
      @case ('Default — copy command') {
        <div class="bg-muted/30 border-border flex items-center gap-3 rounded-lg border px-4 py-3 font-mono text-sm">
          <code class="min-w-0 flex-1 truncate">{{ sampleUrl }}</code>
          <ui-icon-transition
            [defaultIcon]="copy"
            [activeIcon]="check"
            iconClass="size-4"
            label="Copy URL"
            activeLabel="Copied"
            class="text-muted-foreground hover:bg-muted hover:text-foreground size-8 rounded-md"
            [action]="copySample"
          />
        </div>
      }
      @case ('Externally controlled — like button') {
        <button ui-button variant="outline" [class]="liked() ? 'text-rose-500' : ''" (click)="liked.set(!liked())">
          <ui-icon-transition
            as="span"
            [defaultIcon]="heart"
            [activeIcon]="heart"
            [active]="liked()"
            activeClass="text-rose-500 fill-current"
            iconClass="size-4"
            class="size-4"
          />
          {{ liked() ? 'Liked' : 'Like' }}
        </button>
      }
      @case ('Stay active — bookmark with manual reset') {
        <div class="flex items-center gap-3">
          <ui-icon-transition
            #bookmarkRef="uiIconTransition"
            [defaultIcon]="bookmark"
            [activeIcon]="bookmarkCheck"
            [resetAfter]="0"
            iconClass="size-5"
            label="Save"
            activeLabel="Saved"
            class="border-border hover:bg-muted size-9 rounded-md border"
          />
          <button ui-button variant="ghost" size="sm" (click)="bookmarkRef.reset()">Reset</button>
        </div>
      }
      @case ('Different icons per role') {
        <div class="flex flex-wrap gap-2">
          <ui-icon-transition
            [defaultIcon]="share"
            [activeIcon]="check"
            iconClass="size-4"
            label="Share"
            activeLabel="Shared"
            class="border-border hover:bg-muted size-9 rounded-md border"
          />
          <ui-icon-transition
            [defaultIcon]="userPlus"
            [activeIcon]="userCheck"
            iconClass="size-4"
            label="Follow"
            activeLabel="Following"
            activeClass="text-info"
            class="border-border hover:bg-muted size-9 rounded-md border"
          />
          <ui-icon-transition
            [defaultIcon]="star"
            [activeIcon]="star"
            iconClass="size-4"
            label="Star"
            activeLabel="Starred"
            activeClass="text-amber-500 fill-current"
            class="border-border hover:bg-muted size-9 rounded-md border"
          />
          <ui-icon-transition
            [defaultIcon]="thumbsUp"
            [activeIcon]="thumbsUp"
            iconClass="size-4"
            label="Upvote"
            activeLabel="Upvoted"
            activeClass="text-emerald-500 fill-current"
            class="border-border hover:bg-muted size-9 rounded-md border"
          />
          <ui-icon-transition
            [defaultIcon]="plus"
            [activeIcon]="check"
            iconClass="size-4"
            label="Add"
            activeLabel="Added"
            class="border-border hover:bg-muted size-9 rounded-md border"
          />
        </div>
      }
      @case ('Inline inside a chip') {
        <div class="flex flex-wrap gap-1.5">
          @for (name of chips; track name) {
            <button
              type="button"
              class="group bg-muted/30 border-border hover:border-primary/40 focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
              (click)="copySample()"
            >
              <span class="text-muted-foreground font-sans tracking-wider uppercase">add</span>
              <span>{{ name }}</span>
              <ui-icon-transition
                as="span"
                [defaultIcon]="link"
                [activeIcon]="check"
                iconClass="size-3"
                class="text-muted-foreground size-3"
              />
            </button>
          }
        </div>
        <p class="text-muted-foreground mt-2 text-xs">
          Each chip is its own button; the IconTransition lives inside in \`as="span"\` mode and never receives clicks
          directly.
        </p>
      }
    }
  `,
})
export class AngularIconTransitionDemoComponent {
  @Input() story = 'Default — copy command'

  readonly sampleUrl = sampleUrl
  readonly chips = ['button', 'data-table', 'dialog', 'sonner']
  readonly liked = signal(false)

  readonly copySample = async (): Promise<boolean> => {
    try {
      await navigator.clipboard?.writeText(sampleUrl)
      return true
    } catch {
      return false
    }
  }
}
