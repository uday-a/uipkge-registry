import { Component, DestroyRef, Input, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, type AbstractControl, type ValidatorFn } from '@angular/forms'
import {
  UiFormActionsComponent,
  UiFormControlDirective,
  UiFormDescriptionComponent,
  UiFormDirective,
  UiFormFieldDirective,
  UiFormItemComponent,
  UiFormLabelComponent,
  UiFormMessageComponent,
  UiFormSectionComponent,
  UiFormStatusComponent,
  type FormStatusValue,
} from '../../../../../packages/registry-angular/components/form/form.component'
import { UiInputComponent } from '../../../../../packages/registry-angular/components/input/input.component'
import { UiTextareaComponent } from '../../../../../packages/registry-angular/components/textarea/textarea.component'
import { UiCheckboxComponent } from '../../../../../packages/registry-angular/components/checkbox/checkbox.component'
import { UiSwitchComponent } from '../../../../../packages/registry-angular/components/switch/switch.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import {
  UiSelectComponent,
  UiSelectContentComponent,
  UiSelectItemComponent,
  UiSelectTriggerComponent,
  UiSelectValueComponent,
} from '../../../../../packages/registry-angular/components/select/select.component'
import {
  UiPinInputComponent,
  UiPinInputGroupComponent,
  UiPinInputSlotComponent,
} from '../../../../../packages/registry-angular/components/pin-input/pin-input.component'

// The React demo validates with zod through react-hook-form; here the same rules are
// reactive-forms validators whose error carries the zod message.
const rule =
  (test: (v: string, c: AbstractControl) => boolean, message: string): ValidatorFn =>
  (c) =>
    test(String(c.value ?? ''), c) ? null : { rule: { message } }
const email = (message = 'Enter a valid email') => rule((v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message)
const min = (n: number, message: string) => rule((v) => v.length >= n, message)
const matches = (other: string) =>
  rule((v, c) => v === String(c.parent?.get(other)?.value ?? ''), 'Passwords do not match')
const text = () => new FormControl('', { nonNullable: true })
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Angular demo for the form page. Mirrors demos/react/form.tsx story by story. */
@Component({
  selector: 'angular-form-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    ReactiveFormsModule,
    UiFormDirective,
    UiFormFieldDirective,
    UiFormItemComponent,
    UiFormLabelComponent,
    UiFormControlDirective,
    UiFormDescriptionComponent,
    UiFormMessageComponent,
    UiFormSectionComponent,
    UiFormActionsComponent,
    UiFormStatusComponent,
    UiInputComponent,
    UiTextareaComponent,
    UiCheckboxComponent,
    UiSwitchComponent,
    UiButtonComponent,
    UiSelectComponent,
    UiSelectTriggerComponent,
    UiSelectValueComponent,
    UiSelectContentComponent,
    UiSelectItemComponent,
    UiPinInputComponent,
    UiPinInputGroupComponent,
    UiPinInputSlotComponent,
  ],
  template: `
    @switch (story) {
      @case ('Form Helpers') {
        <form uiForm [formGroup]="helpers" class="max-w-lg space-y-6">
          <ui-form-section title="Account Details" description="Enter your account information below." divider>
            <ng-container uiFormField="helperEmail">
              <ui-form-item label="Email" required description="We'll never share your email with anyone.">
                <ui-input
                  uiFormControl
                  formControlName="helperEmail"
                  name="helperEmail"
                  type="email"
                  placeholder="you@example.com"
                />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="helperUsername">
              <ui-form-item label="Username" required [status]="validationStatus()" [help]="validationMessage()">
                <ui-input uiFormControl formControlName="helperUsername" name="helperUsername" placeholder="johndoe" />
              </ui-form-item>
            </ng-container>
            <div class="flex flex-wrap gap-2">
              <button ui-button type="button" size="sm" variant="outline" (click)="setValidationDemo('error')">
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
                  class="lucide lucide-circle-alert mr-1 size-3.5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                Error
              </button>
              <button ui-button type="button" size="sm" variant="outline" (click)="setValidationDemo('warning')">
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
                  class="lucide lucide-circle-alert mr-1 size-3.5 text-amber-500"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                Warning
              </button>
              <button ui-button type="button" size="sm" variant="outline" (click)="setValidationDemo('success')">
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
                  class="lucide lucide-circle-check mr-1 size-3.5 text-emerald-500"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                Success
              </button>
            </div>
          </ui-form-section>

          <ui-form-status status="error" message="Please fix the errors above before submitting." />
          <ui-form-status status="warning" message="Your password is weak. Consider using a stronger one." />
          <ui-form-status status="success" message="Your changes have been saved successfully." />

          <ui-form-section
            title="Button Alignment"
            description="FormActions supports left, center, and right alignment."
          >
            <div class="space-y-3">
              <ui-form-actions align="left">
                <button ui-button type="button" size="sm" variant="outline">Cancel</button>
                <button ui-button type="button" size="sm">Save</button>
              </ui-form-actions>
              <ui-form-actions align="center">
                <button ui-button type="button" size="sm" variant="outline">Cancel</button>
                <button ui-button type="button" size="sm">Save</button>
              </ui-form-actions>
              <ui-form-actions align="right">
                <button ui-button type="button" size="sm" variant="outline">Cancel</button>
                <button ui-button type="button" size="sm">Save</button>
              </ui-form-actions>
            </div>
          </ui-form-section>
        </form>
      }
      @case ('Horizontal Layout') {
        <form uiForm [formGroup]="horizontal" (ngSubmit)="noop()" class="max-w-lg space-y-4">
          <ng-container uiFormField="hName">
            <ui-form-item label="Full Name" layout="horizontal" required>
              <ui-input uiFormControl formControlName="hName" name="hName" placeholder="Jane Doe" />
            </ui-form-item>
          </ng-container>
          <ng-container uiFormField="hEmail">
            <ui-form-item label="Email" layout="horizontal" required>
              <ui-input
                uiFormControl
                formControlName="hEmail"
                name="hEmail"
                type="email"
                placeholder="jane@example.com"
              />
            </ui-form-item>
          </ng-container>
          <ng-container uiFormField="hRole">
            <ui-form-item label="Role" layout="horizontal" labelWidth="180px">
              <ui-select uiFormControl formControlName="hRole"
                ><button ui-select-trigger><ui-select-value placeholder="Select role" /></button
                ><ui-select-content
                  ><ui-select-item value="dev">Developer</ui-select-item
                  ><ui-select-item value="design">Designer</ui-select-item
                  ><ui-select-item value="pm">Product Manager</ui-select-item></ui-select-content
                ></ui-select
              >
            </ui-form-item>
          </ng-container>
          <ui-form-actions align="right">
            <button ui-button type="button" variant="outline">Cancel</button>
            <button ui-button type="submit">Submit</button>
          </ui-form-actions>
        </form>
      }
      @case ('Login — 1 Column') {
        <form uiForm [formGroup]="login" (ngSubmit)="onLogin()" class="max-w-sm space-y-4">
          <ng-container uiFormField="email">
            <ui-form-item>
              <label ui-form-label>Email</label>
              <ui-input uiFormControl formControlName="email" name="email" type="email" placeholder="you@example.com" />
              <ui-form-message />
            </ui-form-item>
          </ng-container>
          <ng-container uiFormField="password">
            <ui-form-item>
              <label ui-form-label>Password</label>
              <ui-input
                uiFormControl
                formControlName="password"
                name="password"
                type="password"
                placeholder="••••••••"
                showPasswordToggle
              />
              <ui-form-message />
            </ui-form-item>
          </ng-container>
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm">
              <ui-checkbox />
              Remember me
            </label>
            <a href="#" class="text-primary text-sm hover:underline">Forgot password?</a>
          </div>
          @if (loginError()) {
            <p class="text-destructive text-sm">{{ loginError() }}</p>
          }
          @if (loginSuccess()) {
            <p class="text-sm text-emerald-600">Login successful! Redirecting...</p>
          }
          <button ui-button type="submit" class="w-full" [disabled]="loginSubmitting()">
            @if (loginSubmitting()) {
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
                class="lucide lucide-loader-circle mr-2 size-4 animate-spin"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            }
            {{ loginSubmitting() ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      }
      @case ('Login — 2 Column') {
        <form uiForm [formGroup]="login2" (ngSubmit)="noop()" class="max-w-xl">
          <div class="grid grid-cols-2 gap-4">
            <ng-container uiFormField="email">
              <ui-form-item>
                <label ui-form-label>Email</label>
                <ui-input
                  uiFormControl
                  formControlName="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="password">
              <ui-form-item>
                <label ui-form-label>Password</label>
                <ui-input
                  uiFormControl
                  formControlName="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  showPasswordToggle
                />
              </ui-form-item>
            </ng-container>
          </div>
          <div class="mt-4 flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm"><ui-checkbox /> Remember me</label>
            <button ui-button type="submit" size="sm">Sign in</button>
          </div>
        </form>
      }
      @case ('Sign Up — 1 Column') {
        @if (signupSuccess()) {
          <div class="flex max-w-sm flex-col items-center gap-3 rounded-lg border p-6 text-center">
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
              class="lucide lucide-circle-check size-10 text-emerald-500"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <h3 class="text-lg font-semibold">Account created</h3>
            <p class="text-muted-foreground text-sm">Check your email to verify your account.</p>
            <button ui-button variant="outline" size="sm" (click)="signupSuccess.set(false)">Back to form</button>
          </div>
        } @else {
          <form uiForm [formGroup]="signup" (ngSubmit)="onSignup()" class="max-w-sm space-y-4">
            <ng-container uiFormField="fullName">
              <ui-form-item>
                <label ui-form-label>Full Name</label>
                <ui-input uiFormControl formControlName="fullName" name="fullName" placeholder="Jane Doe" />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="email">
              <ui-form-item>
                <label ui-form-label>Email</label>
                <ui-input
                  uiFormControl
                  formControlName="email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="password">
              <ui-form-item>
                <label ui-form-label>Password</label>
                <ui-input
                  uiFormControl
                  formControlName="password"
                  name="password"
                  type="password"
                  placeholder="Min 8 characters"
                  showPasswordToggle
                />
                <p ui-form-description>Must contain at least 8 characters, one number and one symbol.</p>
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="confirmPassword">
              <ui-form-item>
                <label ui-form-label>Confirm Password</label>
                <ui-input
                  uiFormControl
                  formControlName="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  showPasswordToggle
                />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <label class="flex items-start gap-2 text-sm">
              <ui-checkbox class="mt-0.5" />
              <span
                >I agree to the <a href="#" class="text-primary hover:underline">Terms of Service</a> and
                <a href="#" class="text-primary hover:underline">Privacy Policy</a></span
              >
            </label>
            <button ui-button type="submit" class="w-full" [disabled]="signupSubmitting()">
              @if (signupSubmitting()) {
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
                  class="lucide lucide-loader-circle mr-2 size-4 animate-spin"
                  aria-hidden="true"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              }
              {{ signupSubmitting() ? 'Creating account...' : 'Create account' }}
            </button>
          </form>
        }
      }
      @case ('Sign Up — 2 Column') {
        <form uiForm [formGroup]="signup2" (ngSubmit)="noop()" class="max-w-2xl space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <ng-container uiFormField="firstName">
              <ui-form-item>
                <label ui-form-label>First Name</label>
                <ui-input uiFormControl formControlName="firstName" name="firstName" placeholder="Jane" />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="lastName">
              <ui-form-item>
                <label ui-form-label>Last Name</label>
                <ui-input uiFormControl formControlName="lastName" name="lastName" placeholder="Doe" />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="email">
              <ui-form-item>
                <label ui-form-label>Email</label>
                <ui-input
                  uiFormControl
                  formControlName="email"
                  name="email"
                  type="email"
                  placeholder="jane@example.com"
                />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="phone">
              <ui-form-item>
                <label ui-form-label>Phone</label>
                <ui-input
                  uiFormControl
                  formControlName="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="password">
              <ui-form-item>
                <label ui-form-label>Password</label>
                <ui-input uiFormControl formControlName="password" name="password" type="password" showPasswordToggle />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="confirm">
              <ui-form-item>
                <label ui-form-label>Confirm</label>
                <ui-input uiFormControl formControlName="confirm" name="confirm" type="password" showPasswordToggle />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
          </div>
          <label class="flex items-start gap-2 text-sm"
            ><ui-checkbox class="mt-0.5" />I agree to the Terms and Privacy Policy</label
          >
          <div class="flex justify-end">
            <button ui-button type="submit">Create account</button>
          </div>
        </form>
      }
      @case ('Sign Up — 3 Column') {
        <form uiForm [formGroup]="signup3" (ngSubmit)="noop()" class="max-w-3xl space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <ng-container uiFormField="fn">
              <ui-form-item>
                <label ui-form-label>First</label>
                <ui-input uiFormControl formControlName="fn" name="fn" placeholder="Jane" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="ln">
              <ui-form-item>
                <label ui-form-label>Last</label>
                <ui-input uiFormControl formControlName="ln" name="ln" placeholder="Doe" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="role">
              <ui-form-item>
                <label ui-form-label>Role</label>
                <ui-select uiFormControl formControlName="role"
                  ><button ui-select-trigger><ui-select-value placeholder="Select" /></button
                  ><ui-select-content
                    ><ui-select-item value="dev">Developer</ui-select-item
                    ><ui-select-item value="design">Designer</ui-select-item
                    ><ui-select-item value="pm">Product Manager</ui-select-item></ui-select-content
                  ></ui-select
                >
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="email">
              <ui-form-item>
                <label ui-form-label>Email</label>
                <ui-input uiFormControl formControlName="email" name="email" type="email" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="phone">
              <ui-form-item>
                <label ui-form-label>Phone</label>
                <ui-input uiFormControl formControlName="phone" name="phone" type="tel" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="dept">
              <ui-form-item>
                <label ui-form-label>Department</label>
                <ui-select uiFormControl formControlName="dept"
                  ><button ui-select-trigger><ui-select-value placeholder="Select" /></button
                  ><ui-select-content
                    ><ui-select-item value="eng">Engineering</ui-select-item
                    ><ui-select-item value="design">Design</ui-select-item
                    ><ui-select-item value="marketing">Marketing</ui-select-item></ui-select-content
                  ></ui-select
                >
              </ui-form-item>
            </ng-container>
          </div>
          <div class="flex justify-end">
            <button ui-button type="submit">Create account</button>
          </div>
        </form>
      }
      @case ('OTP Verification') {
        <div class="max-w-sm space-y-4">
          <div class="text-center">
            <h3 class="text-lg font-semibold">Verify your email</h3>
            <p class="text-muted-foreground mt-1 text-sm">Enter the 6-digit code sent to you&#64;example.com</p>
          </div>
          <div class="flex justify-center">
            <ui-pin-input
              [(value)]="otp"
              [maxLength]="6"
              [status]="otpError() ? 'error' : otpSuccess() ? 'success' : 'default'"
              (complete)="onOtpComplete($event)"
              ><ui-pin-input-group
                ><ui-pin-input-slot [index]="0" /><ui-pin-input-slot [index]="1" /><ui-pin-input-slot
                  [index]="2" /><ui-pin-input-slot [index]="3" /><ui-pin-input-slot [index]="4" /><ui-pin-input-slot
                  [index]="5" /></ui-pin-input-group
            ></ui-pin-input>
          </div>
          @if (otpError()) {
            <p class="text-destructive text-sm">Invalid code. Try again.</p>
          }
          @if (otpSuccess()) {
            <p class="text-sm text-emerald-600">Verified successfully!</p>
          }
          <div class="text-center">
            <button
              type="button"
              class="text-primary disabled:text-muted-foreground text-sm hover:underline disabled:no-underline"
              [disabled]="resendTimer() > 0"
              (click)="startResendTimer()"
            >
              {{ resendTimer() > 0 ? 'Resend in ' + resendTimer() + 's' : 'Resend code' }}
            </button>
          </div>
          @if (otpSubmitting()) {
            <p class="text-muted-foreground text-center text-xs">Verifying…</p>
          }
        </div>
      }
      @case ('MFA Setup') {
        <div class="max-w-sm space-y-4">
          <div class="flex gap-2">
            <button
              ui-button
              size="sm"
              [variant]="method() === 'app' ? 'default' : 'outline'"
              (click)="method.set('app'); mfaSuccess.set(false)"
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
                class="lucide lucide-key-round mr-1 size-3.5"
                aria-hidden="true"
              >
                <path
                  d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
                />
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
              </svg>
              Authenticator
            </button>
            <button
              ui-button
              size="sm"
              [variant]="method() === 'sms' ? 'default' : 'outline'"
              (click)="method.set('sms'); mfaSuccess.set(false)"
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
                class="lucide lucide-smartphone mr-1 size-3.5"
                aria-hidden="true"
              >
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                <path d="M12 18h.01" />
              </svg>
              SMS
            </button>
            <button
              ui-button
              size="sm"
              [variant]="method() === 'email' ? 'default' : 'outline'"
              (click)="method.set('email'); mfaSuccess.set(false)"
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
                class="lucide lucide-mail mr-1 size-3.5"
                aria-hidden="true"
              >
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>
              Email
            </button>
          </div>
          <p class="text-muted-foreground text-sm">
            {{
              method() === 'app'
                ? 'Scan the QR code with your authenticator app and enter the code below.'
                : method() === 'sms'
                  ? 'A code has been sent to +1 (555) 000-0000.'
                  : 'A code has been sent to you@example.com.'
            }}
          </p>
          @if (!mfaSuccess()) {
            <div class="flex items-center gap-3">
              <ui-pin-input [(value)]="mfaCode" [maxLength]="6" (complete)="onMfaSubmit()"
                ><ui-pin-input-group
                  ><ui-pin-input-slot [index]="0" /><ui-pin-input-slot [index]="1" /><ui-pin-input-slot
                    [index]="2" /><ui-pin-input-slot [index]="3" /><ui-pin-input-slot [index]="4" /><ui-pin-input-slot
                    [index]="5" /></ui-pin-input-group
              ></ui-pin-input>
              <button ui-button size="sm" [disabled]="mfaSubmitting() || mfaCode().length < 6" (click)="onMfaSubmit()">
                @if (mfaSubmitting()) {
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
                    class="lucide lucide-loader-circle mr-1 size-3.5 animate-spin"
                    aria-hidden="true"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                }
                Verify
              </button>
            </div>
          } @else {
            <p class="text-sm text-emerald-600">MFA enabled successfully</p>
          }
        </div>
      }
      @case ('Password Reset') {
        @if (resetSuccess()) {
          <div class="flex max-w-sm flex-col items-center gap-3 rounded-lg border p-6 text-center">
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
              class="lucide lucide-circle-check size-10 text-emerald-500"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <h3 class="text-lg font-semibold">Password updated</h3>
            <p class="text-muted-foreground text-sm">You can now sign in with your new password.</p>
            <button ui-button variant="outline" size="sm" (click)="resetStep.set('request'); resetSuccess.set(false)">
              Back
            </button>
          </div>
        } @else if (resetStep() === 'request') {
          <div class="max-w-sm space-y-4">
            <div>
              <h3 class="text-lg font-semibold">Reset password</h3>
              <p class="text-muted-foreground mt-1 mb-4 text-sm">Enter your email and we'll send you a reset link.</p>
            </div>
            <form uiForm [formGroup]="resetRequest" (ngSubmit)="onResetRequest()" class="space-y-3">
              <ng-container uiFormField="email">
                <ui-form-item>
                  <label ui-form-label>Email</label>
                  <ui-input
                    uiFormControl
                    formControlName="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                  <ui-form-message />
                </ui-form-item>
              </ng-container>
              <button ui-button type="submit" class="w-full" [disabled]="resetSubmitting()">
                @if (resetSubmitting()) {
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
                    class="lucide lucide-loader-circle mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                }
                {{ resetSubmitting() ? 'Sending...' : 'Send reset link' }}
              </button>
            </form>
          </div>
        } @else {
          <div class="max-w-sm space-y-4">
            <div>
              <h3 class="text-lg font-semibold">Set new password</h3>
              <p class="text-muted-foreground mt-1 mb-4 text-sm">Enter your new password below.</p>
            </div>
            <form uiForm [formGroup]="resetConfirm" (ngSubmit)="onResetConfirm()" class="space-y-3">
              <ng-container uiFormField="newPassword">
                <ui-form-item>
                  <label ui-form-label>New Password</label>
                  <ui-input
                    uiFormControl
                    formControlName="newPassword"
                    name="newPassword"
                    type="password"
                    showPasswordToggle
                  />
                  <ui-form-message />
                </ui-form-item>
              </ng-container>
              <ng-container uiFormField="confirmNew">
                <ui-form-item>
                  <label ui-form-label>Confirm Password</label>
                  <ui-input
                    uiFormControl
                    formControlName="confirmNew"
                    name="confirmNew"
                    type="password"
                    showPasswordToggle
                  />
                  <ui-form-message />
                </ui-form-item>
              </ng-container>
              <button ui-button type="submit" class="w-full" [disabled]="resetSubmitting()">
                @if (resetSubmitting()) {
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
                    class="lucide lucide-loader-circle mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                }
                {{ resetSubmitting() ? 'Updating...' : 'Update password' }}
              </button>
            </form>
          </div>
        }
      }
      @case ('Profile Edit — 1 Column') {
        @if (profileSuccess()) {
          <div class="flex max-w-md flex-col items-center gap-3 rounded-lg border p-6 text-center">
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
              class="lucide lucide-circle-check size-10 text-emerald-500"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <h3 class="text-lg font-semibold">Profile updated</h3>
            <button ui-button variant="outline" size="sm" (click)="profileSuccess.set(false)">Edit again</button>
          </div>
        } @else {
          <form uiForm [formGroup]="profile" (ngSubmit)="onProfile()" class="max-w-md space-y-4">
            <ng-container uiFormField="displayName">
              <ui-form-item>
                <label ui-form-label>Display Name</label>
                <ui-input uiFormControl formControlName="displayName" name="displayName" placeholder="Jane Doe" />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="email">
              <ui-form-item>
                <label ui-form-label>Email</label>
                <ui-input uiFormControl formControlName="email" name="email" type="email" />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="phone">
              <ui-form-item>
                <label ui-form-label>Phone</label>
                <ui-input uiFormControl formControlName="phone" name="phone" type="tel" />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="bio">
              <ui-form-item>
                <label ui-form-label>Bio</label>
                <ui-textarea
                  uiFormControl
                  formControlName="bio"
                  name="bio"
                  [rows]="3"
                  placeholder="Tell us about yourself"
                />
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="country">
              <ui-form-item>
                <label ui-form-label>Country</label>
                <ui-select uiFormControl formControlName="country"
                  ><button ui-select-trigger><ui-select-value placeholder="Select country" /></button
                  ><ui-select-content
                    ><ui-select-item value="us">United States</ui-select-item
                    ><ui-select-item value="ca">Canada</ui-select-item
                    ><ui-select-item value="uk">United Kingdom</ui-select-item
                    ><ui-select-item value="de">Germany</ui-select-item
                    ><ui-select-item value="jp">Japan</ui-select-item></ui-select-content
                  ></ui-select
                >
                <ui-form-message />
              </ui-form-item>
            </ng-container>
            <div class="space-y-2">
              <label class="flex items-center gap-2 text-sm">
                <button ui-switch defaultChecked></button>
                Email notifications
              </label>
              <label class="flex items-center gap-2 text-sm">
                <button ui-switch></button>
                Marketing emails
              </label>
            </div>
            <div class="flex justify-end gap-2">
              <button ui-button type="button" variant="outline">Cancel</button>
              <button ui-button type="submit" [disabled]="profileSubmitting()">
                @if (profileSubmitting()) {
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
                    class="lucide lucide-loader-circle mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                }
                {{ profileSubmitting() ? 'Saving...' : 'Save changes' }}
              </button>
            </div>
          </form>
        }
      }
      @case ('Profile Edit — 2 Column') {
        <form uiForm [formGroup]="profile2" (ngSubmit)="noop()" class="max-w-2xl space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <ng-container uiFormField="firstName">
              <ui-form-item>
                <label ui-form-label>First Name</label>
                <ui-input uiFormControl formControlName="firstName" name="firstName" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="lastName">
              <ui-form-item>
                <label ui-form-label>Last Name</label>
                <ui-input uiFormControl formControlName="lastName" name="lastName" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="email">
              <ui-form-item>
                <label ui-form-label>Email</label>
                <ui-input uiFormControl formControlName="email" name="email" type="email" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="phone">
              <ui-form-item>
                <label ui-form-label>Phone</label>
                <ui-input uiFormControl formControlName="phone" name="phone" type="tel" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="jobTitle">
              <ui-form-item>
                <label ui-form-label>Job Title</label>
                <ui-input uiFormControl formControlName="jobTitle" name="jobTitle" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="dept">
              <ui-form-item>
                <label ui-form-label>Department</label>
                <ui-select uiFormControl formControlName="dept"
                  ><button ui-select-trigger><ui-select-value placeholder="Select" /></button
                  ><ui-select-content
                    ><ui-select-item value="eng">Engineering</ui-select-item
                    ><ui-select-item value="design">Design</ui-select-item
                    ><ui-select-item value="product">Product</ui-select-item></ui-select-content
                  ></ui-select
                >
              </ui-form-item>
            </ng-container>
          </div>
          <ng-container uiFormField="bio">
            <ui-form-item>
              <label ui-form-label>Bio</label>
              <ui-textarea uiFormControl formControlName="bio" name="bio" [rows]="3" />
            </ui-form-item>
          </ng-container>
          <div class="flex justify-end gap-2">
            <button ui-button type="button" variant="outline">Cancel</button>
            <button ui-button type="submit">Save changes</button>
          </div>
        </form>
      }
      @case ('Profile Edit — 3 Column') {
        <form uiForm [formGroup]="profile3" (ngSubmit)="noop()" class="max-w-3xl space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <ng-container uiFormField="fn">
              <ui-form-item>
                <label ui-form-label>First</label>
                <ui-input uiFormControl formControlName="fn" name="fn" type="text" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="ln">
              <ui-form-item>
                <label ui-form-label>Last</label>
                <ui-input uiFormControl formControlName="ln" name="ln" type="text" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="username">
              <ui-form-item>
                <label ui-form-label>Username</label>
                <ui-input uiFormControl formControlName="username" name="username" type="text" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="email">
              <ui-form-item>
                <label ui-form-label>Email</label>
                <ui-input uiFormControl formControlName="email" name="email" type="email" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="phone">
              <ui-form-item>
                <label ui-form-label>Phone</label>
                <ui-input uiFormControl formControlName="phone" name="phone" type="tel" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="website">
              <ui-form-item>
                <label ui-form-label>Website</label>
                <ui-input uiFormControl formControlName="website" name="website" type="url" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="city">
              <ui-form-item>
                <label ui-form-label>City</label>
                <ui-input uiFormControl formControlName="city" name="city" type="text" />
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="country">
              <ui-form-item>
                <label ui-form-label>Country</label>
                <ui-select uiFormControl formControlName="country"
                  ><button ui-select-trigger><ui-select-value placeholder="Select" /></button
                  ><ui-select-content
                    ><ui-select-item value="us">US</ui-select-item><ui-select-item value="ca">CA</ui-select-item
                    ><ui-select-item value="uk">UK</ui-select-item></ui-select-content
                  ></ui-select
                >
              </ui-form-item>
            </ng-container>
            <ng-container uiFormField="zip">
              <ui-form-item>
                <label ui-form-label>Zip</label>
                <ui-input uiFormControl formControlName="zip" name="zip" type="text" />
              </ui-form-item>
            </ng-container>
          </div>
          <div class="flex justify-end gap-2">
            <button ui-button type="button" variant="outline">Cancel</button>
            <button ui-button type="submit">Save changes</button>
          </div>
        </form>
      }
    }
  `,
})
export class AngularFormDemoComponent {
  @Input() story = 'Form Helpers'
  private readonly destroyRef = inject(DestroyRef)

  // Form Helpers
  readonly helpers = new FormGroup({ helperEmail: text(), helperUsername: text() })
  readonly validationStatus = signal<FormStatusValue>(undefined)
  readonly validationMessage = signal('')
  setValidationDemo(status: 'error' | 'warning' | 'success'): void {
    const messages = {
      error: 'Username is already taken',
      warning: 'Username is available but similar to an existing user',
      success: 'Username is available',
    }
    this.validationStatus.set(status)
    this.validationMessage.set(messages[status])
  }

  // Horizontal Layout
  readonly horizontal = new FormGroup({ hName: text(), hEmail: text(), hRole: text() })

  // Login - 1 Column
  readonly login = new FormGroup({
    email: new FormControl('', { nonNullable: true, validators: [email()] }),
    password: new FormControl('', { nonNullable: true, validators: [min(8, 'Min 8 characters')] }),
  })
  readonly loginError = signal('')
  readonly loginSuccess = signal(false)
  readonly loginSubmitting = signal(false)
  async onLogin(): Promise<void> {
    if (this.login.invalid) return
    this.loginError.set('')
    this.loginSuccess.set(false)
    this.loginSubmitting.set(true)
    await wait(1500)
    this.loginSubmitting.set(false)
    if (this.login.value.email === 'error@demo.com') this.loginError.set('Invalid email or password')
    else this.loginSuccess.set(true)
  }

  // Login - 2 Column
  readonly login2 = new FormGroup({ email: text(), password: text() })

  // Sign Up - 1 Column
  readonly signup = new FormGroup({
    fullName: new FormControl('', { nonNullable: true, validators: [min(1, 'Required')] }),
    email: new FormControl('', { nonNullable: true, validators: [email()] }),
    password: new FormControl('', { nonNullable: true, validators: [min(8, 'Must contain at least 8 characters')] }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: [matches('password')] }),
  })
  readonly signupSuccess = signal(false)
  readonly signupSubmitting = signal(false)
  async onSignup(): Promise<void> {
    if (this.signup.invalid) return
    this.signupSubmitting.set(true)
    await wait(1500)
    this.signupSubmitting.set(false)
    this.signupSuccess.set(true)
  }

  // Sign Up - 2 / 3 Column
  readonly signup2 = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [min(1, 'Required')] }),
    lastName: new FormControl('', { nonNullable: true, validators: [min(1, 'Required')] }),
    email: new FormControl('', { nonNullable: true, validators: [email()] }),
    phone: text(),
    password: new FormControl('', { nonNullable: true, validators: [min(8, 'Min 8 characters')] }),
    confirm: text(),
  })
  readonly signup3 = new FormGroup({ fn: text(), ln: text(), role: text(), email: text(), phone: text(), dept: text() })

  // OTP Verification
  readonly otp = signal('')
  readonly otpSubmitting = signal(false)
  readonly otpError = signal(false)
  readonly otpSuccess = signal(false)
  readonly resendTimer = signal(30)
  startResendTimer(): void {
    this.resendTimer.set(30)
    const interval = setInterval(() => {
      this.resendTimer.update((t) => {
        if (t <= 1) {
          clearInterval(interval)
          return 0
        }
        return t - 1
      })
    }, 1000)
    this.destroyRef.onDestroy(() => clearInterval(interval))
  }
  onOtpComplete(value: string): void {
    this.otpSubmitting.set(true)
    setTimeout(() => {
      this.otpSubmitting.set(false)
      if (value === '000000') {
        this.otpError.set(true)
        this.otpSuccess.set(false)
      } else {
        this.otpSuccess.set(true)
        this.otpError.set(false)
      }
    }, 1000)
  }

  // MFA Setup
  readonly method = signal<'app' | 'sms' | 'email'>('app')
  readonly mfaCode = signal('')
  readonly mfaSubmitting = signal(false)
  readonly mfaSuccess = signal(false)
  onMfaSubmit(): void {
    this.mfaSubmitting.set(true)
    setTimeout(() => {
      this.mfaSubmitting.set(false)
      this.mfaSuccess.set(true)
    }, 1200)
  }

  // Password Reset
  readonly resetRequest = new FormGroup({ email: new FormControl('', { nonNullable: true, validators: [email()] }) })
  readonly resetConfirm = new FormGroup({
    newPassword: new FormControl('', { nonNullable: true, validators: [min(8, 'Min 8 characters')] }),
    confirmNew: new FormControl('', { nonNullable: true, validators: [matches('newPassword')] }),
  })
  readonly resetStep = signal<'request' | 'confirm'>('request')
  readonly resetSuccess = signal(false)
  readonly resetSubmitting = signal(false)
  async onResetRequest(): Promise<void> {
    if (this.resetRequest.invalid) return
    this.resetSubmitting.set(true)
    await wait(1200)
    this.resetSubmitting.set(false)
    this.resetStep.set('confirm')
  }
  async onResetConfirm(): Promise<void> {
    if (this.resetConfirm.invalid) return
    this.resetSubmitting.set(true)
    await wait(1200)
    this.resetSubmitting.set(false)
    this.resetSuccess.set(true)
  }

  // Profile Edit - 1 / 2 / 3 Column
  readonly profile = new FormGroup({
    displayName: text(),
    email: new FormControl('', {
      nonNullable: true,
      validators: [rule((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email')],
    }),
    phone: text(),
    bio: text(),
    country: text(),
  })
  readonly profileSuccess = signal(false)
  readonly profileSubmitting = signal(false)
  async onProfile(): Promise<void> {
    if (this.profile.invalid) return
    this.profileSubmitting.set(true)
    await wait(1200)
    this.profileSubmitting.set(false)
    this.profileSuccess.set(true)
  }
  readonly profile2 = new FormGroup({
    firstName: text(),
    lastName: text(),
    email: text(),
    phone: text(),
    jobTitle: text(),
    dept: text(),
    bio: text(),
  })
  readonly profile3 = new FormGroup({
    fn: text(),
    ln: text(),
    username: text(),
    email: text(),
    phone: text(),
    website: text(),
    city: text(),
    country: text(),
    zip: text(),
  })

  constructor() {
    // zod's refine runs over the whole object: re-check the confirmation when the password changes.
    const recheck = (group: FormGroup, from: string, to: string) => {
      const sub = group
        .get(from)!
        .valueChanges.subscribe(() => group.get(to)!.updateValueAndValidity({ emitEvent: false }))
      this.destroyRef.onDestroy(() => sub.unsubscribe())
    }
    recheck(this.signup, 'password', 'confirmPassword')
    recheck(this.resetConfirm, 'newPassword', 'confirmNew')
  }

  noop(): void {}
}
