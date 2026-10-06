import { Component, Input, signal } from '@angular/core'
import {
  UiInputComponent,
  UiInputGroupAddonComponent,
  UiInputGroupButtonComponent,
  UiInputGroupComponent,
} from '../../../../../packages/registry-angular/components/input/input.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'

/** Angular demo for the input page. Mirrors demos/react/input.tsx story by story. */
@Component({
  selector: 'angular-input-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiInputComponent,
    UiInputGroupComponent,
    UiInputGroupAddonComponent,
    UiInputGroupButtonComponent,
    UiLabelComponent,
  ],
  template: `
    <ng-template #search
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
        class="lucide lucide-search size-4"
        aria-hidden="true"
      >
        <path d="m21 21-4.34-4.34" />
        <circle cx="11" cy="11" r="8" /></svg
    ></ng-template>
    <ng-template #mail
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
        class="lucide lucide-mail size-4"
        aria-hidden="true"
      >
        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
        <rect x="2" y="4" width="20" height="16" rx="2" /></svg
    ></ng-template>
    <ng-template #dollar
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
        class="lucide lucide-dollar-sign size-4"
        aria-hidden="true"
      >
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg
    ></ng-template>
    <ng-template #usd><span class="text-xs">USD</span></ng-template>
    @switch (story) {
      @case ('Default') {
        <div class="grid max-w-sm gap-2">
          <label ui-label for="email">Email</label>
          <ui-input id="email" type="email" placeholder="you@example.com" [(value)]="text" />
          <p class="text-muted-foreground text-xs">
            Live: <code class="text-foreground">{{ text() || '—' }}</code>
          </p>
        </div>
      }
      @case ('Sizes') {
        <div class="grid max-w-sm gap-3">
          <ui-input size="small" placeholder="Small input" />
          <ui-input size="middle" placeholder="Middle input" />
          <ui-input size="large" placeholder="Large input" />
        </div>
      }
      @case ('Variants') {
        <div class="grid max-w-sm gap-3">
          <ui-input placeholder="Outlined (default)" variant="outlined" />
          <ui-input placeholder="Filled" variant="filled" />
          <ui-input placeholder="Borderless" variant="borderless" />
        </div>
      }
      @case ('Status') {
        <div class="grid max-w-sm gap-3">
          <ui-input placeholder="Error state" status="error" />
          <ui-input placeholder="Warning state" status="warning" />
          <ui-input placeholder="Error with value" status="error" defaultValue="invalid" />
        </div>
      }
      @case ('Prefix & Suffix') {
        <div class="grid max-w-sm gap-3">
          <ui-input placeholder="Username" prefix="@" />
          <ui-input placeholder="0.00" suffix="USD" />
          <ui-input placeholder="Search..." [prefix]="search" />
          <ui-input placeholder="you@example.com" [suffix]="mail" />
        </div>
      }
      @case ('Addon before & after') {
        <div class="grid max-w-sm gap-3">
          <ui-input placeholder="website" addonBefore="https://" addonAfter=".com" />
          <ui-input placeholder="0.00" [addonBefore]="dollar" [addonAfter]="usd" />
        </div>
      }
      @case ('Allow clear') {
        <div class="grid max-w-sm gap-3">
          <ui-input placeholder="Type something..." defaultValue="Clear me" allowClear />
        </div>
      }
      @case ('Show count') {
        <div class="grid max-w-sm gap-3">
          <ui-input placeholder="Max 20 characters..." [maxLength]="20" showCount />
        </div>
      }
      @case ('Password toggle') {
        <div class="grid max-w-sm gap-3">
          <ui-input type="password" placeholder="Password" defaultValue="secret123" showPasswordToggle />
          <ui-input
            type="password"
            placeholder="Large password"
            size="large"
            defaultValue="secret123"
            showPasswordToggle
          />
        </div>
      }
      @case ('Disabled & Readonly') {
        <div class="grid max-w-sm gap-3">
          <ui-input placeholder="Disabled" disabled />
          <ui-input placeholder="Readonly" readOnly defaultValue="Cannot edit" />
          <ui-input placeholder="Disabled with prefix" prefix="@" disabled />
        </div>
      }
      @case ('Composite Input Groups') {
        <div class="grid max-w-sm gap-3">
          <ui-input-group>
            <ui-input-group-addon>https://</ui-input-group-addon>
            <ui-input placeholder="uipkge.dev" />
            <button ui-input-group-button variant="ghost">
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
                class="lucide lucide-copy size-3.5"
                aria-hidden="true"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </button>
          </ui-input-group>

          <ui-input-group>
            <ui-input-group-addon
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
                class="lucide lucide-search size-4"
                aria-hidden="true"
              >
                <path d="m21 21-4.34-4.34" />
                <circle cx="11" cy="11" r="8" /></svg
            ></ui-input-group-addon>
            <ui-input placeholder="Search packages..." />
            <button ui-input-group-button variant="default">Search</button>
          </ui-input-group>
        </div>
      }
    }
  `,
})
export class AngularInputDemoComponent {
  @Input() story = 'Default'
  readonly text = signal('')
}
