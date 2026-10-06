import { Component, Input } from '@angular/core'
import { UiLinkComponent } from '../../../../../packages/registry-angular/components/link/link.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

/** Angular demo for the link page. Mirrors demos/react/link.tsx story by story. */
@Component({
  selector: 'angular-link-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiLinkComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Inline in body copy') {
        <p class="text-foreground max-w-md text-sm leading-relaxed">
          By signing up you agree to our <a ui-link href="#" underline="always">Terms of Service</a> and acknowledge
          our<a ui-link href="#" underline="always">Privacy Policy</a>. Need help? Visit our<a ui-link href="#"
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
              slot="left"
              aria-hidden="true"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M10 9H8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" /></svg
            >support center</a
          >.
        </p>
      }
      @case ('Color & underline') {
        <div class="max-w-md space-y-4">
          <div class="flex flex-wrap items-center gap-4 text-sm">
            <a ui-link href="#" color="default">Default</a>
            <a ui-link href="#" color="primary">Primary</a>
            <a ui-link href="#" color="muted">Muted</a>
          </div>
          <div class="flex flex-wrap items-center gap-4 text-sm">
            <a ui-link href="#" underline="always">Always</a>
            <a ui-link href="#" underline="hover">Hover</a>
            <a ui-link href="#" underline="none">None</a>
          </div>
        </div>
      }
      @case ('Sizes') {
        <div class="flex max-w-md flex-wrap items-baseline gap-4">
          <a ui-link href="#" size="sm">Small link</a>
          <a ui-link href="#" size="default">Default link</a>
          <a ui-link href="#" size="lg">Large link</a>
        </div>
      }
      @case ('With icons') {
        <div class="flex max-w-md flex-wrap items-center gap-4 text-sm">
          <a ui-link href="#"
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
              class="lucide lucide-house"
              slot="left"
              aria-hidden="true"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path
                d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
              /></svg
            >Home</a
          >
          <a ui-link href="#"
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
              slot="left"
              aria-hidden="true"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M10 9H8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" /></svg
            >Article</a
          >
          <a ui-link href="https://uipkge.dev"
            >Visit site<svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-external-link"
              slot="right"
              aria-hidden="true"
            >
              <path d="M15 3h6v6" />
              <path d="M10 14 21 3" />
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg
          ></a>
          <a ui-link href="#"
            >Continue<svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-arrow-right"
              slot="right"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" /></svg
          ></a>
        </div>
      }
      @case ('External vs internal') {
        <p class="text-sm">
          External: <a ui-link href="https://uipkge.dev">uipkge.dev</a> opens in a new tab. Internal:<a
            ui-link
            href="/about"
            [external]="false"
            >About page</a
          >
          stays in-tab.
        </p>
      }
      @case ('Disabled') {
        <div class="flex max-w-md flex-wrap items-center gap-4 text-sm">
          <a ui-link href="#" disabled>Disabled link</a>
          <a ui-link href="#" color="muted" disabled>Disabled muted</a>
        </div>
      }
      @case ('In a card footer') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>Need a hand?</h3>
            <p ui-card-description>We're here Monday through Friday, 9–5 GMT.</p>
          </div>
          <div ui-card-content class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <a ui-link href="#"
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
                class="lucide lucide-life-buoy"
                slot="left"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="4" /></svg
              >Support center</a
            >
            <a ui-link href="#">Documentation</a>
            <a ui-link href="https://status.uipkge.dev"
              >Status<svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-external-link"
                slot="right"
                aria-hidden="true"
              >
                <path d="M15 3h6v6" />
                <path d="M10 14 21 3" />
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg
            ></a>
          </div>
        </div>
      }
      @case ('AsChild') {
        <button ui-link href="#" class="px-2 py-1">Button styled as link</button>
      }
    }
  `,
})
export class AngularLinkDemoComponent {
  @Input() story = 'Inline in body copy'
}
