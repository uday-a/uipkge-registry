import { Component, Input, signal } from '@angular/core'
import { UiMaskedInputComponent } from '../../../../../packages/registry-angular/components/masked-input/masked-input.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'

/** Angular demo for the masked-input page. Mirrors demos/react/masked-input.tsx story by story. */
@Component({
  selector: 'angular-masked-input-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiMaskedInputComponent, UiLabelComponent],
  template: `
    @switch (story) {
      @case ('Phone') {
        <div class="max-w-sm">
          <label ui-label>Phone Number</label>
          <ui-masked-input [(value)]="phone" mask="(###) ###-####" class="mt-1.5" />
          <p class="text-muted-foreground mt-1 text-xs">
            Value: <code class="text-foreground">{{ phone() || '—' }}</code>
          </p>
        </div>
      }
      @case ('Date') {
        <div class="max-w-sm">
          <label ui-label>Date of Birth</label>
          <ui-masked-input [(value)]="date" mask="##/##/####" placeholderChar="0" class="mt-1.5" />
          <p class="text-muted-foreground mt-1 text-xs">
            Value: <code class="text-foreground">{{ date() || '—' }}</code>
          </p>
        </div>
      }
      @case ('SSN') {
        <div class="max-w-sm">
          <label ui-label>SSN</label>
          <ui-masked-input [(value)]="ssn" mask="###-##-####" class="mt-1.5" />
          <p class="text-muted-foreground mt-1 text-xs">
            Value: <code class="text-foreground">{{ ssn() || '—' }}</code>
          </p>
        </div>
      }
      @case ('Credit Card') {
        <div class="max-w-sm">
          <label ui-label>Credit Card</label>
          <ui-masked-input [(value)]="card" mask="#### #### #### ####" class="mt-1.5" />
          <p class="text-muted-foreground mt-1 text-xs">
            Value: <code class="text-foreground">{{ card() || '—' }}</code>
          </p>
        </div>
      }
      @case ('Custom Pattern') {
        <div class="max-w-sm">
          <label ui-label>License Plate</label>
          <ui-masked-input [(value)]="custom" mask="AAA-####" replacement="A" class="mt-1.5" />
          <p class="text-muted-foreground mt-1 text-xs">
            Value: <code class="text-foreground">{{ custom() || '—' }}</code>
          </p>
        </div>
      }
      @case ('Without Mask Display') {
        <div class="max-w-sm">
          <label ui-label>Phone (no mask display)</label>
          <ui-masked-input [(value)]="rawOnly" mask="(###) ###-####" [showMask]="false" class="mt-1.5" />
          <p class="text-muted-foreground mt-1 text-xs">
            Value: <code class="text-foreground">{{ rawOnly() || '—' }}</code>
          </p>
        </div>
      }
      @case ('Completed Event') {
        <div class="max-w-sm">
          <label ui-label>OTP Code</label>
          <ui-masked-input
            [(value)]="otp"
            mask="######"
            [showMask]="false"
            placeholderChar=""
            (complete)="onComplete($event)"
            class="mt-1.5"
          />
          <p class="text-muted-foreground mt-1 text-xs">Type 6 digits to trigger complete event</p>
        </div>
      }
      @case ('Native Placeholder') {
        <div class="max-w-sm">
          <label ui-label>Phone with Placeholder</label>
          <ui-masked-input mask="(###) ###-####" placeholder="(555) 000-0000" class="mt-1.5" />
        </div>
      }
      @case ('Validation & Error State') {
        <div class="max-w-sm">
          <label ui-label>Required Phone Number</label>
          <ui-masked-input
            mask="(###) ###-####"
            defaultValue="(555) 12"
            invalid
            errorMessage="Please enter a complete 10-digit phone number."
            class="mt-1.5"
          />
        </div>
      }
      @case ('Strict Character Blocking') {
        <div class="max-w-sm space-y-3">
          <div>
            <label ui-label>Numeric Only (tries typing letters are blocked)</label>
            <ui-masked-input mask="###-###" placeholder="123-456" class="mt-1.5" />
          </div>
          <div>
            <label ui-label>Letters Only (tries typing numbers are blocked)</label>
            <ui-masked-input mask="AAA-AAA" replacement="A" placeholder="ABC-DEF" class="mt-1.5" />
          </div>
        </div>
      }
      @case ('Disabled & Readonly') {
        <div class="max-w-sm space-y-2">
          <ui-masked-input mask="(###) ###-####" defaultValue="(555) 123-4567" disabled />
          <ui-masked-input mask="(###) ###-####" defaultValue="(555) 999-8888" readOnly />
        </div>
      }
    }
  `,
})
export class AngularMaskedInputDemoComponent {
  @Input() story = 'Phone'
  readonly phone = signal('')
  readonly date = signal('')
  readonly ssn = signal('')
  readonly card = signal('')
  readonly custom = signal('')
  readonly rawOnly = signal('')
  readonly otp = signal('')

  onComplete(v: string): void {
    alert('Completed: ' + v)
  }
}
