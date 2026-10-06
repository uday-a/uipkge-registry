import { Component, Input, signal } from '@angular/core'
import {
  UiToggleGroupComponent,
  UiToggleGroupItemComponent,
} from '../../../../../packages/registry-angular/components/toggle-group/toggle-group.component'

/** Angular demo for the toggle-group page. Mirrors demos/react/toggle-group.tsx story by story. */
@Component({
  selector: 'angular-toggle-group-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiToggleGroupComponent, UiToggleGroupItemComponent],
  template: `
    @switch (story) {
      @case ('Single select') {
        <div ui-toggle-group type="single" [value]="align()" (valueChange)="$event && align.set($event)">
          <button ui-toggle-group-item value="left" aria-label="Align left">
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
              class="lucide lucide-text-align-start size-4"
              aria-hidden="true"
            >
              <path d="M21 5H3" />
              <path d="M15 12H3" />
              <path d="M17 19H3" />
            </svg>
          </button>
          <button ui-toggle-group-item value="center" aria-label="Align center">
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
              class="lucide lucide-text-align-center size-4"
              aria-hidden="true"
            >
              <path d="M21 5H3" />
              <path d="M17 12H7" />
              <path d="M19 19H5" />
            </svg>
          </button>
          <button ui-toggle-group-item value="right" aria-label="Align right">
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
              class="lucide lucide-text-align-end size-4"
              aria-hidden="true"
            >
              <path d="M21 5H3" />
              <path d="M21 12H9" />
              <path d="M21 19H7" />
            </svg>
          </button>
        </div>
      }
      @case ('Multiple select') {
        <div class="space-y-2">
          <div ui-toggle-group type="multiple" [value]="formats()" (valueChange)="formats.set($event)">
            <button ui-toggle-group-item value="bold" aria-label="Bold">
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
                class="lucide lucide-bold size-4"
                aria-hidden="true"
              >
                <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
              </svg>
            </button>
            <button ui-toggle-group-item value="italic" aria-label="Italic">
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
                class="lucide lucide-italic size-4"
                aria-hidden="true"
              >
                <line x1="19" x2="10" y1="4" y2="4" />
                <line x1="14" x2="5" y1="20" y2="20" />
                <line x1="15" x2="9" y1="4" y2="20" />
              </svg>
            </button>
            <button ui-toggle-group-item value="underline" aria-label="Underline">
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
                class="lucide lucide-underline size-4"
                aria-hidden="true"
              >
                <path d="M6 4v6a6 6 0 0 0 12 0V4" />
                <line x1="4" x2="20" y1="20" y2="20" />
              </svg>
            </button>
          </div>
          <p class="text-muted-foreground text-xs">
            Active: <code class="text-foreground">{{ formats().join(', ') || '—' }}</code>
          </p>
        </div>
      }
      @case ('Variants') {
        <div class="space-y-3">
          <div
            ui-toggle-group
            type="single"
            variant="default"
            [value]="variantValue()"
            (valueChange)="$event && variantValue.set($event)"
          >
            <button ui-toggle-group-item value="left">
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
                class="lucide lucide-text-align-start size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M15 12H3" />
                <path d="M17 19H3" />
              </svg>
            </button>
            <button ui-toggle-group-item value="center">
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
                class="lucide lucide-text-align-center size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M17 12H7" />
                <path d="M19 19H5" />
              </svg>
            </button>
            <button ui-toggle-group-item value="right">
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
                class="lucide lucide-text-align-end size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M21 12H9" />
                <path d="M21 19H7" />
              </svg>
            </button>
          </div>
          <div
            ui-toggle-group
            type="single"
            variant="outline"
            [value]="variantValue()"
            (valueChange)="$event && variantValue.set($event)"
          >
            <button ui-toggle-group-item value="left">
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
                class="lucide lucide-text-align-start size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M15 12H3" />
                <path d="M17 19H3" />
              </svg>
            </button>
            <button ui-toggle-group-item value="center">
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
                class="lucide lucide-text-align-center size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M17 12H7" />
                <path d="M19 19H5" />
              </svg>
            </button>
            <button ui-toggle-group-item value="right">
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
                class="lucide lucide-text-align-end size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M21 12H9" />
                <path d="M21 19H7" />
              </svg>
            </button>
          </div>
        </div>
      }
      @case ('Sizes') {
        <div class="space-y-3">
          <div
            ui-toggle-group
            type="single"
            variant="outline"
            size="sm"
            [value]="sizeValue()"
            (valueChange)="$event && sizeValue.set($event)"
          >
            <button ui-toggle-group-item value="left">
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
                class="lucide lucide-text-align-start size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M15 12H3" />
                <path d="M17 19H3" />
              </svg>
            </button>
            <button ui-toggle-group-item value="center">
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
                class="lucide lucide-text-align-center size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M17 12H7" />
                <path d="M19 19H5" />
              </svg>
            </button>
            <button ui-toggle-group-item value="right">
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
                class="lucide lucide-text-align-end size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M21 12H9" />
                <path d="M21 19H7" />
              </svg>
            </button>
          </div>
          <div
            ui-toggle-group
            type="single"
            variant="outline"
            size="default"
            [value]="sizeValue()"
            (valueChange)="$event && sizeValue.set($event)"
          >
            <button ui-toggle-group-item value="left">
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
                class="lucide lucide-text-align-start size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M15 12H3" />
                <path d="M17 19H3" />
              </svg>
            </button>
            <button ui-toggle-group-item value="center">
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
                class="lucide lucide-text-align-center size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M17 12H7" />
                <path d="M19 19H5" />
              </svg>
            </button>
            <button ui-toggle-group-item value="right">
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
                class="lucide lucide-text-align-end size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M21 12H9" />
                <path d="M21 19H7" />
              </svg>
            </button>
          </div>
          <div
            ui-toggle-group
            type="single"
            variant="outline"
            size="lg"
            [value]="sizeValue()"
            (valueChange)="$event && sizeValue.set($event)"
          >
            <button ui-toggle-group-item value="left">
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
                class="lucide lucide-text-align-start size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M15 12H3" />
                <path d="M17 19H3" />
              </svg>
            </button>
            <button ui-toggle-group-item value="center">
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
                class="lucide lucide-text-align-center size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M17 12H7" />
                <path d="M19 19H5" />
              </svg>
            </button>
            <button ui-toggle-group-item value="right">
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
                class="lucide lucide-text-align-end size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M21 12H9" />
                <path d="M21 19H7" />
              </svg>
            </button>
          </div>
        </div>
      }
      @case ('With spacing') {
        <div
          ui-toggle-group
          type="multiple"
          variant="outline"
          [spacing]="2"
          [value]="spacedValue()"
          (valueChange)="spacedValue.set($event)"
        >
          <button ui-toggle-group-item value="bold">
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
              class="lucide lucide-bold size-4"
              aria-hidden="true"
            >
              <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />
            </svg>
          </button>
          <button ui-toggle-group-item value="italic">
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
              class="lucide lucide-italic size-4"
              aria-hidden="true"
            >
              <line x1="19" x2="10" y1="4" y2="4" />
              <line x1="14" x2="5" y1="20" y2="20" />
              <line x1="15" x2="9" y1="4" y2="20" />
            </svg>
          </button>
          <button ui-toggle-group-item value="underline">
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
              class="lucide lucide-underline size-4"
              aria-hidden="true"
            >
              <path d="M6 4v6a6 6 0 0 0 12 0V4" />
              <line x1="4" x2="20" y1="20" y2="20" />
            </svg>
          </button>
        </div>
      }
      @case ('Disabled') {
        <div class="space-y-3">
          <div
            ui-toggle-group
            type="single"
            variant="outline"
            disabled
            [value]="lockedValue()"
            (valueChange)="$event && lockedValue.set($event)"
          >
            <button ui-toggle-group-item value="left">
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
                class="lucide lucide-text-align-start size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M15 12H3" />
                <path d="M17 19H3" />
              </svg>
            </button>
            <button ui-toggle-group-item value="center">
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
                class="lucide lucide-text-align-center size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M17 12H7" />
                <path d="M19 19H5" />
              </svg>
            </button>
            <button ui-toggle-group-item value="right">
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
                class="lucide lucide-text-align-end size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M21 12H9" />
                <path d="M21 19H7" />
              </svg>
            </button>
          </div>
          <div
            ui-toggle-group
            type="single"
            variant="outline"
            [value]="lockedValue()"
            (valueChange)="$event && lockedValue.set($event)"
          >
            <button ui-toggle-group-item value="left">
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
                class="lucide lucide-text-align-start size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M15 12H3" />
                <path d="M17 19H3" />
              </svg>
            </button>
            <button ui-toggle-group-item value="center" disabled>
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
                class="lucide lucide-text-align-center size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M17 12H7" />
                <path d="M19 19H5" />
              </svg>
            </button>
            <button ui-toggle-group-item value="right">
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
                class="lucide lucide-text-align-end size-4"
                aria-hidden="true"
              >
                <path d="M21 5H3" />
                <path d="M21 12H9" />
                <path d="M21 19H7" />
              </svg>
            </button>
          </div>
        </div>
      }
      @case ('Static (no indicator)') {
        <div
          ui-toggle-group
          type="single"
          variant="outline"
          [animated]="false"
          [value]="staticValue()"
          (valueChange)="$event && staticValue.set($event)"
        >
          <button ui-toggle-group-item value="left" aria-label="Align left">
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
              class="lucide lucide-text-align-start size-4"
              aria-hidden="true"
            >
              <path d="M21 5H3" />
              <path d="M15 12H3" />
              <path d="M17 19H3" />
            </svg>
          </button>
          <button ui-toggle-group-item value="center" aria-label="Align center">
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
              class="lucide lucide-text-align-center size-4"
              aria-hidden="true"
            >
              <path d="M21 5H3" />
              <path d="M17 12H7" />
              <path d="M19 19H5" />
            </svg>
          </button>
          <button ui-toggle-group-item value="right" aria-label="Align right">
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
              class="lucide lucide-text-align-end size-4"
              aria-hidden="true"
            >
              <path d="M21 5H3" />
              <path d="M21 12H9" />
              <path d="M21 19H7" />
            </svg>
          </button>
        </div>
      }
    }
  `,
})
export class AngularToggleGroupDemoComponent {
  @Input() story = 'Single select'
  readonly align = signal('center')
  readonly formats = signal<string[]>(['bold'])
  readonly variantValue = signal('left')
  readonly sizeValue = signal('center')
  readonly spacedValue = signal<string[]>(['bold', 'italic'])
  readonly lockedValue = signal('center')
  readonly staticValue = signal('center')
}
