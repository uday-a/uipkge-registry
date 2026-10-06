import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core'
import { UiAnimatedNumberComponent } from '../../../../../packages/registry-angular/components/animated-number/animated-number.component'

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const percent = new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 })
const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
const deDe = new Intl.NumberFormat('de-DE')

/** Angular demo for the animated-number page. Mirrors demos/react/animated-number.tsx story by story. */
@Component({
  selector: 'angular-animated-number-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiAnimatedNumberComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <p class="text-4xl font-bold">
          <ui-animated-number [value]="2481" />
        </p>
      }
      @case ('Currency') {
        <p class="text-4xl font-bold">
          <ui-animated-number [value]="98750" [format]="usd" />
        </p>
      }
      @case ('Percentage') {
        <p class="text-4xl font-bold">
          <ui-animated-number [value]="0.842" [format]="percent" />
        </p>
      }
      @case ('Compact notation') {
        <p class="text-4xl font-bold">
          <ui-animated-number [value]="3420000" [format]="compact" />
        </p>
      }
      @case ('Fast vs slow') {
        <div class="flex items-end gap-10">
          <div>
            <p class="text-muted-foreground text-xs tracking-widest uppercase">fast · 300ms</p>
            <p class="text-3xl font-bold">
              <ui-animated-number [value]="512" [duration]="300" />
            </p>
          </div>
          <div>
            <p class="text-muted-foreground text-xs tracking-widest uppercase">slow · 2400ms</p>
            <p class="text-3xl font-bold">
              <ui-animated-number [value]="512" [duration]="2400" />
            </p>
          </div>
        </div>
      }
      @case ('Live ticker') {
        <div class="bg-card inline-flex items-baseline gap-2 rounded-lg border px-5 py-3">
          <span class="text-muted-foreground text-xs tracking-widest uppercase">requests/min</span>
          <span class="text-3xl font-bold">
            <ui-animated-number [value]="live()" />
          </span>
        </div>
      }
      @case ('KPI delta') {
        <div class="flex gap-8">
          <div class="text-success flex items-center gap-1.5">
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
              class="lucide lucide-trending-up size-4"
              aria-hidden="true"
            >
              <path d="M16 7h6v6" />
              <path d="m22 7-8.5 8.5-5-5L2 17" />
            </svg>
            <span class="text-lg font-semibold">+<ui-animated-number [value]="12.4" [format]="fixed1" />%</span>
          </div>
          <div class="text-destructive flex items-center gap-1.5">
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
              class="lucide lucide-trending-down size-4"
              aria-hidden="true"
            >
              <path d="M16 17h6v-6" />
              <path d="m22 17-8.5-8.5-5 5L2 7" />
            </svg>
            <span class="text-lg font-semibold">−<ui-animated-number [value]="3.8" [format]="fixed1" />%</span>
          </div>
        </div>
      }
      @case ('Tabular column') {
        <div class="w-64 space-y-2">
          @for (n of regions; track n) {
            <div class="flex justify-between border-b pb-2 text-sm">
              <span class="text-muted-foreground">Region {{ n }}</span>
              <span class="font-medium">
                <ui-animated-number [value]="n * 137" [duration]="1400" />
              </span>
            </div>
          }
        </div>
      }
      @case ('Staggered trio') {
        <div class="grid grid-cols-3 gap-6 text-center">
          <div>
            <p class="text-3xl font-bold">
              <ui-animated-number [value]="99" [delay]="0" />
            </p>
            <p class="text-muted-foreground text-xs tracking-widest uppercase">uptime %</p>
          </div>
          <div>
            <p class="text-3xl font-bold">
              <ui-animated-number [value]="54" [delay]="150" />
            </p>
            <p class="text-muted-foreground text-xs tracking-widest uppercase">components</p>
          </div>
          <div>
            <p class="text-3xl font-bold">
              <ui-animated-number [value]="12" [delay]="300" />
            </p>
            <p class="text-muted-foreground text-xs tracking-widest uppercase">blocks</p>
          </div>
        </div>
      }
      @case ('Disabled') {
        <p class="text-4xl font-bold">
          <ui-animated-number [value]="7777" disabled />
        </p>
      }
      @case ('Retargeting') {
        <div class="space-y-3">
          <p class="text-4xl font-bold">
            <ui-animated-number [value]="target()" />
          </p>
          <div class="flex gap-2">
            <button
              type="button"
              class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm font-medium"
              (click)="target.set(target() + 1000)"
            >
              +1000
            </button>
            <button
              type="button"
              class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm font-medium"
              (click)="target.set(target() * 2)"
            >
              ×2
            </button>
            <button
              type="button"
              class="hover:bg-accent rounded-md border px-3 py-1.5 text-sm font-medium"
              (click)="target.set(1200)"
            >
              Reset
            </button>
          </div>
        </div>
      }
      @case ('Locale') {
        <p class="text-4xl font-bold">
          <ui-animated-number [value]="1234567" [format]="de" />
        </p>
      }
    }
  `,
})
export class AngularAnimatedNumberDemoComponent implements OnInit, OnDestroy {
  @Input() story = 'Default'

  readonly usd = (v: number) => usd.format(v)
  readonly percent = (v: number) => percent.format(v)
  readonly compact = (v: number) => compact.format(v)
  readonly de = (v: number) => deDe.format(v)
  readonly fixed1 = (v: number) => v.toFixed(1)
  readonly regions = [3, 17, 128]

  readonly live = signal(4200)
  readonly target = signal(1200)
  private timer?: ReturnType<typeof setInterval>

  ngOnInit(): void {
    if (this.story !== 'Live ticker') return
    this.timer = setInterval(() => {
      this.live.update((v) => Math.max(0, v + Math.round((Math.random() - 0.4) * 300)))
    }, 2000)
  }

  ngOnDestroy(): void {
    clearInterval(this.timer)
  }
}
