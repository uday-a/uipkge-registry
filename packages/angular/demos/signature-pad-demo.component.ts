import { Component, Input } from '@angular/core'
import { UiSignaturePadComponent } from '../../../../../packages/registry-angular/components/signature-pad/signature-pad.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

/** Angular demo for the signature-pad page. Mirrors demos/react/signature-pad.tsx story by story. */
@Component({
  selector: 'angular-signature-pad-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiSignaturePadComponent,
    UiButtonComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default pad') {
        <div class="max-w-md space-y-2">
          <ui-signature-pad [(modelValue)]="signature" class="w-full" />
          <p class="text-muted-foreground text-xs">{{ signature ? 'Signature captured' : 'No signature yet' }}</p>
        </div>
      }
      @case ('Styled ink') {
        <div class="max-w-md space-y-2">
          <ui-signature-pad
            [(modelValue)]="signature"
            penColor="#1d4ed8"
            [penThickness]="3"
            backgroundColor="#f8fafc"
            class="w-full"
          />
          <p class="text-muted-foreground text-xs">Blue ink, thickness 3, light slate background.</p>
        </div>
      }
      @case ('Live config') {
        <div class="max-w-md space-y-4">
          <div class="flex flex-wrap items-center gap-4 text-sm">
            <label class="flex items-center gap-2">
              Pen
              <input
                [value]="penColor"
                (input)="penColor = $any($event.target).value"
                type="color"
                class="size-7 cursor-pointer rounded border"
              />
            </label>
            <label class="flex items-center gap-2">
              BG
              <input
                [value]="bgColor"
                (input)="bgColor = $any($event.target).value"
                type="color"
                class="size-7 cursor-pointer rounded border"
              />
            </label>
            <label class="flex items-center gap-2">
              Thickness
              <input
                [value]="penThickness"
                (input)="penThickness = +$any($event.target).value"
                type="range"
                min="1"
                max="6"
                class="w-28"
              />
              <span class="text-muted-foreground tabular-nums">{{ penThickness }}</span>
            </label>
          </div>
          <ui-signature-pad
            [(modelValue)]="signature"
            [penColor]="penColor"
            [penThickness]="penThickness"
            [backgroundColor]="bgColor"
            class="w-full"
          />
          @if (signature) {
            <p class="flex items-center gap-1 text-xs text-emerald-600">
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
                class="lucide lucide-check size-3.5"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              Captured
            </p>
          }
        </div>
      }
      @case ('Programmatic control') {
        <div class="max-w-md space-y-3">
          <ui-signature-pad #pad="uiSignaturePad" [(modelValue)]="signature" [showClearButton]="false" class="w-full" />
          <div class="flex flex-wrap gap-2">
            <button ui-button size="sm" variant="outline" (click)="pad.clear()">
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
                class="lucide lucide-eraser size-4"
                aria-hidden="true"
              >
                <path
                  d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"
                />
                <path d="m5.082 11.09 8.828 8.828" />
              </svg>
              Clear
            </button>
            <button ui-button size="sm" (click)="pad.exportSignature()">
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
                class="lucide lucide-download size-4"
                aria-hidden="true"
              >
                <path d="M12 15V3" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="m7 10 5 5 5-5" />
              </svg>
              Export
            </button>
          </div>
          <p class="text-muted-foreground text-xs">
            Empty: {{ pad.isEmpty ? 'yes' : 'no' }} · Points: {{ pad.pointCount }}
          </p>
        </div>
      }
      @case ('States') {
        <div class="max-w-md space-y-3">
          <ui-signature-pad [(modelValue)]="signature" disabled class="w-full" />
          <ui-signature-pad [(modelValue)]="signature" readonly class="w-full" />
        </div>
      }
      @case ('In context: Contract signing') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>Sign your agreement</h3>
            <p ui-card-description>By signing below, you accept the terms of service and privacy policy.</p>
          </div>
          <div ui-card-content class="space-y-4">
            <p class="text-muted-foreground text-sm leading-relaxed">
              This agreement is effective upon signing. Your signature below confirms that you have read and understood
              all terms outlined in the contract.
            </p>
            <ui-signature-pad
              [(modelValue)]="signature"
              [showClearButton]="false"
              class="w-full"
              [actions]="contractActions"
            />
          </div>
        </div>
      }
    }
    <ng-template #contractActions let-clear="clear" let-empty="empty">
      <div class="flex items-center justify-between pt-2">
        <button ui-button size="sm" variant="ghost" [disabled]="empty" (click)="clear()">
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
            class="lucide lucide-pen-line size-4"
            aria-hidden="true"
          >
            <path d="M13 21h8" />
            <path
              d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
            />
          </svg>
          Reset
        </button>
        <button ui-button size="sm" [disabled]="empty">
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
            class="lucide lucide-check size-4"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Submit signature
        </button>
      </div>
    </ng-template>
  `,
})
export class AngularSignaturePadDemoComponent {
  @Input() story = 'Default pad'
  signature: string | null = null
  penColor = '#1d4ed8'
  penThickness = 3
  bgColor = '#ffffff'
}
