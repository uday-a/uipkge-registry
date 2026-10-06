import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { UiPaymentCardComponent } from '../../../../../packages/registry-angular/components/payment-card/payment-card.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import { UiInputComponent } from '../../../../../packages/registry-angular/components/input/input.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'

const brands = ['4111 1111 1111 1111', '5454 5454 5454 5454', '3782 822463 10005', '6011 1111 1111 1117']

function formatCardNumber(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 16)
  if (/^3[47]/.test(digits)) {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean).join(' ')
  }
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

function formatExpiry(raw: string) {
  const d = raw.replace(/\D/g, '').slice(0, 4)
  if (d.length <= 2) return d
  return `${d.slice(0, 2)}/${d.slice(2)}`
}

@Component({
  selector: 'payment-card-demo',
  standalone: true,
  imports: [UiPaymentCardComponent, UiButtonComponent, UiInputComponent, UiLabelComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="flex justify-center py-4">
          <ui-payment-card number="4242 4242 4242 4242" name="Jane Doe" expiry="12/29" />
        </div>
      }
      @case ('Flipped') {
        <div class="flex justify-center py-4">
          <ui-payment-card number="4242 4242 4242 4242" name="Jane Doe" expiry="12/29" cvc="123" [flipped]="true" />
        </div>
      }
      @case ('Brand auto-detect') {
        <div class="flex flex-col items-center gap-3 py-4">
          <ui-payment-card [number]="typedNumber" name="Jane Doe" expiry="12/29" />
          <code class="text-muted-foreground text-xs">{{ typedNumber || '(typing…)' }}</code>
        </div>
      }
      @case ('Live typing') {
        <div class="mx-auto flex w-full max-w-sm flex-col gap-4 py-4">
          <div class="flex justify-center">
            <ui-payment-card
              [number]="liveNumber"
              [name]="liveName"
              [expiry]="liveExpiry"
              [cvc]="liveCvc"
              [flipped]="liveCvcFocused"
            />
          </div>
          <div class="grid gap-1.5">
            <ui-label htmlFor="demo-cc-number">Card number</ui-label>
            <ui-input
              id="demo-cc-number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              [value]="liveNumber"
              (valueChange)="onNumberInput($event)"
            />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="grid gap-1.5">
              <ui-label htmlFor="demo-cc-name">Name</ui-label>
              <ui-input
                id="demo-cc-name"
                autoComplete="cc-name"
                placeholder="Jane Doe"
                [value]="liveName"
                (valueChange)="onNameInput($event)"
              />
            </div>
            <div class="grid gap-1.5">
              <ui-label htmlFor="demo-cc-expiry">Expiry</ui-label>
              <ui-input
                id="demo-cc-expiry"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                [value]="liveExpiry"
                (valueChange)="onExpiryInput($event)"
              />
            </div>
          </div>
          <div class="grid gap-1.5">
            <ui-label htmlFor="demo-cc-cvc">CVC</ui-label>
            <ui-input
              id="demo-cc-cvc"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="123"
              [value]="liveCvc"
              (valueChange)="onCvcInput($event)"
              (focus)="liveCvcFocused = true"
              (blur)="liveCvcFocused = false"
            />
          </div>
        </div>
      }
      @case ('Click to flip') {
        <div class="flex flex-col items-center gap-4 py-4">
          <ui-payment-card number="5454 5454 5454 5454" name="Jane Doe" expiry="08/27" cvc="917" [flipped]="flipOpen" />
          <button ui-button variant="outline" size="sm" (click)="flipOpen = !flipOpen">
            {{ flipOpen ? 'Show front' : 'Show back' }}
          </button>
        </div>
      }
      @case ('Tilt + shimmer') {
        <div class="flex justify-center py-6">
          <ui-payment-card number="5454 5454 5454 5454" name="Jane Doe" expiry="08/27" [tilt]="true" [shimmer]="true" />
        </div>
      }
      @case ('Empty / placeholder') {
        <div class="flex justify-center py-4">
          <ui-payment-card name="" expiry="" />
        </div>
      }
      @case ('Compact variant') {
        <div class="flex flex-wrap items-center justify-center gap-3 py-4">
          <ui-payment-card number="4242 4242 4242 4242" expiry="12/29" variant="compact" [flip]="false" />
          <ui-payment-card number="5454 5454 5454 5454" expiry="08/27" variant="compact" [flip]="false" />
          <ui-payment-card number="3782 822463 10005" expiry="03/30" variant="compact" [flip]="false" />
          <ui-payment-card number="6011 1111 1111 1117" expiry="11/28" variant="compact" [flip]="false" />
        </div>
      }
      @case ('All brands') {
        <div class="grid grid-cols-1 gap-3 py-4 sm:grid-cols-2">
          <ui-payment-card number="4111 1111 1111 1111" name="Jane Doe" expiry="12/29" brand="visa" />
          <ui-payment-card number="5555 5555 5555 4444" name="Jane Doe" expiry="08/27" brand="mastercard" />
          <ui-payment-card number="3782 822463 10005" name="Jane Doe" expiry="03/30" brand="amex" />
          <ui-payment-card number="6011 1111 1111 1117" name="Jane Doe" expiry="11/28" brand="discover" />
        </div>
      }
      @case ('Sizes') {
        <div class="flex flex-wrap items-end justify-center gap-4 py-4">
          <ui-payment-card number="4242 4242 4242 4242" expiry="12/29" size="sm" />
          <ui-payment-card number="4242 4242 4242 4242" expiry="12/29" size="md" />
          <ui-payment-card number="4242 4242 4242 4242" expiry="12/29" size="lg" />
        </div>
      }
    }
  `,
})
export class PaymentCardDemoComponent implements OnInit, OnDestroy {
  @Input() story = 'Default'

  typedNumber = ''
  private brandIdx = 0
  private charIdx = 0
  private timer: any

  liveNumber = ''
  liveName = 'Jane Doe'
  liveExpiry = '12/29'
  liveCvc = ''
  liveCvcFocused = false
  flipOpen = false

  ngOnInit(): void {
    this.timer = setInterval(() => {
      const target = brands[this.brandIdx]
      if (this.charIdx <= target.length) {
        this.typedNumber = target.slice(0, this.charIdx)
        this.charIdx++
      } else {
        this.brandIdx = (this.brandIdx + 1) % brands.length
        this.charIdx = 0
        this.typedNumber = ''
      }
    }, 180)
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer)
  }

  onNumberInput(val: string): void {
    this.liveNumber = formatCardNumber(val)
  }

  onNameInput(val: string): void {
    this.liveName = val
  }

  onExpiryInput(val: string): void {
    this.liveExpiry = formatExpiry(val)
  }

  onCvcInput(val: string): void {
    const isAmex = /^3[47]/.test(this.liveNumber.replace(/\D/g, ''))
    this.liveCvc = val.replace(/\D/g, '').slice(0, isAmex ? 4 : 3)
  }
}
