import { Component, Input, signal } from '@angular/core'
import {
  UiPinInputComponent,
  UiPinInputGroupComponent,
  UiPinInputSeparatorComponent,
  UiPinInputSlotComponent,
  type PinInputStatus,
} from '../../../../../packages/registry-angular/components/pin-input/pin-input.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'

/** Angular demo for the pin-input page. Mirrors demos/react/pin-input.tsx story by story. */
@Component({
  selector: 'angular-pin-input-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiPinInputComponent,
    UiPinInputGroupComponent,
    UiPinInputSlotComponent,
    UiPinInputSeparatorComponent,
    UiLabelComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="space-y-2">
          <label ui-label>One-time code</label>
          <ui-pin-input [(value)]="value" [maxLength]="6">
            <ui-pin-input-group>
              @for (i of range(6, 0); track i) {
                <ui-pin-input-slot [index]="i" />
              }
            </ui-pin-input-group>
          </ui-pin-input>
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ value() || '—' }}</code>
          </p>
        </div>
      }
      @case ('Masked (Password)') {
        <div class="space-y-2">
          <label ui-label>Secure PIN</label>
          <ui-pin-input [(value)]="password" [maxLength]="4" mask>
            <ui-pin-input-group>
              @for (i of range(4, 0); track i) {
                <ui-pin-input-slot [index]="i" />
              }
            </ui-pin-input-group>
          </ui-pin-input>
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ password() || '—' }}</code>
          </p>
        </div>
      }
      @case ('Sizes') {
        <div class="space-y-4">
          <div class="space-y-2">
            <label ui-label class="text-xs">Small</label>
            <ui-pin-input [(value)]="small" [maxLength]="4" size="sm">
              <ui-pin-input-group>
                @for (i of range(4, 0); track i) {
                  <ui-pin-input-slot [index]="i" />
                }
              </ui-pin-input-group>
            </ui-pin-input>
          </div>
          <div class="space-y-2">
            <label ui-label>Medium (default)</label>
            <ui-pin-input [(value)]="medium" [maxLength]="4">
              <ui-pin-input-group>
                @for (i of range(4, 0); track i) {
                  <ui-pin-input-slot [index]="i" />
                }
              </ui-pin-input-group>
            </ui-pin-input>
          </div>
          <div class="space-y-2">
            <label ui-label class="text-lg">Large</label>
            <ui-pin-input [(value)]="large" [maxLength]="4" size="lg">
              <ui-pin-input-group>
                @for (i of range(4, 0); track i) {
                  <ui-pin-input-slot [index]="i" />
                }
              </ui-pin-input-group>
            </ui-pin-input>
          </div>
        </div>
      }
      @case ('Status') {
        <div class="space-y-4">
          <div class="space-y-2">
            <label ui-label>Error</label>
            <ui-pin-input [maxLength]="4" status="error">
              <ui-pin-input-group>
                @for (i of range(4, 0); track i) {
                  <ui-pin-input-slot [index]="i" />
                }
              </ui-pin-input-group>
            </ui-pin-input>
          </div>
          <div class="space-y-2">
            <label ui-label>Success</label>
            <ui-pin-input [(value)]="statusSuccess" [maxLength]="4" status="success">
              <ui-pin-input-group>
                @for (i of range(4, 0); track i) {
                  <ui-pin-input-slot [index]="i" />
                }
              </ui-pin-input-group>
            </ui-pin-input>
          </div>
        </div>
      }
      @case ('Error shake') {
        <div class="space-y-2">
          <label ui-label>Try a code (correct: 1234)</label>
          <ui-pin-input
            [value]="shakeCode()"
            [maxLength]="4"
            [status]="shakeStatus()"
            (valueChange)="onShakeChange($event)"
            (complete)="onShakeComplete($event)"
          >
            <ui-pin-input-group>
              @for (i of range(4, 0); track i) {
                <ui-pin-input-slot [index]="i" />
              }
            </ui-pin-input-group>
          </ui-pin-input>
          <p class="text-muted-foreground text-xs">
            Status: <code class="text-foreground">{{ shakeStatus() }}</code>
          </p>
        </div>
      }
      @case ('With Separator') {
        <div class="space-y-2">
          <label ui-label>Grouped code</label>
          <ui-pin-input [(value)]="grouped" [maxLength]="6">
            <ui-pin-input-group>
              @for (i of range(3, 0); track i) {
                <ui-pin-input-slot [index]="i" />
              }
            </ui-pin-input-group>
            <ui-pin-input-separator />
            <ui-pin-input-group>
              @for (i of range(3, 3); track i) {
                <ui-pin-input-slot [index]="i" />
              }
            </ui-pin-input-group>
          </ui-pin-input>
        </div>
      }
      @case ('Auto Submit') {
        <div class="space-y-2">
          <label ui-label>Auto-submit PIN</label>
          <ui-pin-input [maxLength]="4" (complete)="onAutoSubmit($event)">
            <ui-pin-input-group>
              @for (i of range(4, 0); track i) {
                <ui-pin-input-slot [index]="i" />
              }
            </ui-pin-input-group>
          </ui-pin-input>
          <p class="text-muted-foreground text-xs">Fill all 4 digits to trigger the complete event</p>
        </div>
      }
      @case ('Disabled') {
        <div class="space-y-2">
          <label ui-label>Disabled</label>
          <ui-pin-input value="1234" [maxLength]="4" disabled>
            <ui-pin-input-group>
              @for (i of range(4, 0); track i) {
                <ui-pin-input-slot [index]="i" />
              }
            </ui-pin-input-group>
          </ui-pin-input>
        </div>
      }
    }
  `,
})
export class AngularPinInputDemoComponent {
  @Input() story = 'Default'
  readonly value = signal('')
  readonly password = signal('')
  readonly small = signal('')
  readonly large = signal('')
  readonly medium = signal('')
  readonly grouped = signal('')
  readonly statusSuccess = signal('1234')
  readonly shakeCode = signal('')
  readonly shakeStatus = signal<PinInputStatus>('default')

  range(n: number, start = 0): number[] {
    return Array.from({ length: n }, (_, i) => i + start)
  }

  onShakeChange(v: string): void {
    this.shakeCode.set(v)
    if (this.shakeStatus() === 'error' && v.length > 0) this.shakeStatus.set('default')
  }

  onShakeComplete(v: string): void {
    if (v === '1234') {
      this.shakeStatus.set('default')
      return
    }
    this.shakeStatus.set('error')
    window.setTimeout(() => this.shakeCode.set(''), 450)
  }

  onAutoSubmit(v: string): void {
    alert('PIN complete: ' + v)
  }
}
