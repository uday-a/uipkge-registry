import { Component, Input, signal } from '@angular/core'
import { UiFabComponent } from '../../../../../packages/registry-angular/components/fab/fab.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
  UiCardDescriptionComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

/** Angular demo for the fab page. Mirrors demos/react/fab.tsx story by story. */
@Component({
  selector: 'angular-fab-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiFabComponent,
    UiCardComponent,
    UiCardContentComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
  ],
  template: `
    @switch (story) {
      @case ('In a settings panel') {
        <div ui-card class="relative max-w-md overflow-hidden">
          <div ui-card-header>
            <h3 ui-card-title>Team members</h3>
            <p ui-card-description>5 of 10 seats used.</p>
          </div>
          <div ui-card-content>
            <div class="space-y-2">
              <div class="bg-muted/40 flex items-center justify-between rounded-md px-3 py-2 text-sm">
                <span>Alex Morgan</span>
                <span class="text-muted-foreground text-xs">Owner</span>
              </div>
              <div class="bg-muted/40 flex items-center justify-between rounded-md px-3 py-2 text-sm">
                <span>Priya Sharma</span>
                <span class="text-muted-foreground text-xs">Admin</span>
              </div>
              <div class="bg-muted/40 flex items-center justify-between rounded-md px-3 py-2 text-sm">
                <span>Diego Reyes</span>
                <span class="text-muted-foreground text-xs">Editor</span>
              </div>
            </div>
          </div>
          <button
            ui-fab
            absolute
            position="bottom-right"
            aria-label="Invite member"
            (click)="handleFabClick('Invite member')"
          >
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
              class="lucide lucide-plus"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
        </div>
        <p class="text-muted-foreground mt-3 text-xs">
          Invites triggered: {{ clicks() }} {{ lastAction() ? '(Clicked ' + lastAction() + ')' : '' }}
        </p>
      }
      @case ('Variants & sizes') {
        <div class="flex flex-wrap items-center gap-8">
          <div class="flex items-center gap-4">
            <button ui-fab position="inline" aria-label="Add" (click)="handleFabClick('Add')">
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
                class="lucide lucide-plus"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
            <button ui-fab variant="secondary" position="inline" aria-label="Edit" (click)="handleFabClick('Edit')">
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
                class="lucide lucide-square-pen"
                aria-hidden="true"
              >
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path
                  d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
                />
              </svg>
            </button>
            <button
              ui-fab
              variant="destructive"
              position="inline"
              aria-label="Delete"
              (click)="handleFabClick('Delete')"
            >
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
                class="lucide lucide-trash-2"
                aria-hidden="true"
              >
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
            <button ui-fab variant="outline" position="inline" aria-label="Send" (click)="handleFabClick('Send')">
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
                class="lucide lucide-send"
                aria-hidden="true"
              >
                <path
                  d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
                />
                <path d="m21.854 2.147-10.94 10.939" />
              </svg>
            </button>
          </div>
          <div class="flex items-center gap-4">
            <button ui-fab size="mini" position="inline" aria-label="Mini" (click)="handleFabClick('Mini')">
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
                class="lucide lucide-plus"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
            <button ui-fab size="default" position="inline" aria-label="Default" (click)="handleFabClick('Default')">
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
                class="lucide lucide-plus"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
            <button ui-fab size="large" position="inline" aria-label="Large" (click)="handleFabClick('Large')">
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
                class="lucide lucide-plus"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
          </div>
        </div>
      }
      @case ('Extended FAB') {
        <div class="flex flex-wrap items-center gap-4">
          <button ui-fab label="Compose" position="inline" (click)="handleFabClick('Compose')">
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
              class="lucide lucide-mail"
              aria-hidden="true"
            >
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
          </button>
          <button
            ui-fab
            label="New message"
            variant="secondary"
            position="inline"
            (click)="handleFabClick('New message')"
          >
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
              class="lucide lucide-message-square"
              aria-hidden="true"
            >
              <path
                d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"
              />
            </svg>
          </button>
        </div>
      }
      @case ('Positioning') {
        <div class="border-border relative h-56 w-full overflow-hidden rounded-md border">
          <button ui-fab position="top-left" aria-label="Top left">
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
              class="lucide lucide-plus"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
          <button ui-fab position="top-right" aria-label="Top right">
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
              class="lucide lucide-plus"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
          <button ui-fab position="bottom-left" aria-label="Bottom left">
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
              class="lucide lucide-plus"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
          <button ui-fab position="bottom-right" aria-label="Bottom right">
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
              class="lucide lucide-plus"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
          <button ui-fab position="bottom-center" label="Center" aria-label="Bottom center">
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
              class="lucide lucide-plus"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
        </div>
      }
      @case ('With badge') {
        <div class="relative w-fit">
          <button ui-fab position="inline" aria-label="Messages">
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
              class="lucide lucide-mail"
              aria-hidden="true"
            >
              <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
          </button>
          <span
            class="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold"
          >
            3
          </span>
        </div>
      }
      @case ('Disabled') {
        <div class="flex items-center gap-4">
          <button ui-fab disabled position="inline" aria-label="Disabled">
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
              class="lucide lucide-plus"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
          <button ui-fab disabled label="Disabled" position="inline">
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
              class="lucide lucide-plus"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </button>
        </div>
      }
      @case ('Fixed to viewport') {
        <p class="text-muted-foreground max-w-md text-sm">
          The button in the corner is live. It remains anchored to the viewport as you scroll.
        </p>
        <button ui-fab label="Action" aria-label="Fixed action">
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
            class="lucide lucide-plus"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      }
    }
  `,
})
export class AngularFabDemoComponent {
  @Input() story = 'In a settings panel'
  readonly clicks = signal(0)
  readonly lastAction = signal('')

  handleFabClick(label: string): void {
    this.clicks.update((c) => c + 1)
    this.lastAction.set(label)
    setTimeout(() => this.lastAction.set(''), 1500)
  }
}
