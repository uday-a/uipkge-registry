import { Component, Input, signal } from '@angular/core'
import { UiPasswordInputComponent } from '../../../../../packages/registry-angular/components/password-input/password-input.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

/** Angular demo for the password-input page. Mirrors demos/react/password-input.tsx story by story. */
@Component({
  selector: 'angular-password-input-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiPasswordInputComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
    UiButtonComponent,
  ],
  template: `
    @switch (story) {
      @case ('Sign-up with strength meter') {
        <div class="max-w-md space-y-2">
          <ui-password-input
            [(value)]="signupValue"
            showStrength
            [minLength]="8"
            placeholder="Create a password..."
            class="w-full"
          />
          <p class="text-muted-foreground text-xs">
            {{ signupValue() ? signupValue().length + ' characters entered' : 'Start typing to see strength feedback' }}
          </p>
        </div>
      }
      @case ('Size variants') {
        <div class="max-w-md space-y-3">
          <ui-password-input [(value)]="smValue" size="sm" placeholder="Small..." class="w-full" />
          <ui-password-input placeholder="Default..." class="w-full" />
          <ui-password-input [(value)]="lgValue" size="lg" placeholder="Large..." class="w-full" />
        </div>
      }
      @case ('Variant styles') {
        <div class="max-w-md space-y-3">
          <ui-password-input placeholder="Outlined" class="w-full" />
          <ui-password-input [(value)]="filledValue" variant="filled" placeholder="Filled" class="w-full" />
          <ui-password-input [(value)]="borderlessValue" variant="borderless" placeholder="Borderless" class="w-full" />
        </div>
      }
      @case ('States') {
        <div class="max-w-md space-y-3">
          <ui-password-input [(value)]="readonlyValue" readOnly placeholder="Read-only" class="w-full" />
          <ui-password-input disabled placeholder="Disabled" class="w-full" />
        </div>
      }
      @case ('Without toggle') {
        <div class="max-w-md">
          <ui-password-input [showToggle]="false" placeholder="Enter password..." class="w-full" />
        </div>
      }
      @case ('In context: Login card') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>Welcome back</h3>
            <p ui-card-description>Enter your credentials to access your account.</p>
          </div>
          <div ui-card-content class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                class="border-input focus-visible:ring-ring/50 flex h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Password</label>
              <ui-password-input [(value)]="loginValue" placeholder="Enter your password" class="w-full" />
            </div>
            <button ui-button class="w-full">Sign in</button>
            <p class="text-muted-foreground text-center text-xs">
              {{ loginValue() ? 'Password length: ' + loginValue().length : 'No password entered' }}
            </p>
          </div>
        </div>
      }
    }
  `,
})
export class AngularPasswordInputDemoComponent {
  @Input() story = 'Sign-up with strength meter'
  readonly signupValue = signal('')
  readonly loginValue = signal('')
  readonly smValue = signal('')
  readonly lgValue = signal('')
  readonly filledValue = signal('')
  readonly borderlessValue = signal('')
  readonly readonlyValue = signal('s3cr3t-k3y')
}
