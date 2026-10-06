import { Component, Input, signal } from '@angular/core'
import { UiCountdownComponent } from '../../../../../packages/registry-angular/components/countdown/countdown.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

/** Angular demo for the countdown page. Mirrors demos/react/countdown.tsx story by story. */
@Component({
  selector: 'angular-countdown-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiCountdownComponent,
    UiButtonComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  template: `
    <ng-template #daysTile let-v>
      <div class="flex flex-col items-center">
        <span
          class="bg-muted text-foreground inline-flex size-14 items-center justify-center rounded-lg text-xl font-bold tabular-nums"
          >{{ pad2(v) }}</span
        >
        <span class="text-muted-foreground text-xs tracking-wide uppercase">days</span>
      </div>
    </ng-template>
    <ng-template #hoursTile let-v>
      <div class="flex flex-col items-center">
        <span
          class="bg-muted text-foreground inline-flex size-14 items-center justify-center rounded-lg text-xl font-bold tabular-nums"
          >{{ pad2(v) }}</span
        >
        <span class="text-muted-foreground text-xs tracking-wide uppercase">hrs</span>
      </div>
    </ng-template>
    <ng-template #minutesTile let-v>
      <div class="flex flex-col items-center">
        <span
          class="bg-muted text-foreground inline-flex size-14 items-center justify-center rounded-lg text-xl font-bold tabular-nums"
          >{{ pad2(v) }}</span
        >
        <span class="text-muted-foreground text-xs tracking-wide uppercase">min</span>
      </div>
    </ng-template>
    <ng-template #secondsTile let-v>
      <div class="flex flex-col items-center">
        <span
          class="bg-muted text-foreground inline-flex size-14 items-center justify-center rounded-lg text-xl font-bold tabular-nums"
          >{{ pad2(v) }}</span
        >
        <span class="text-muted-foreground text-xs tracking-wide uppercase">sec</span>
      </div>
    </ng-template>
    @switch (story) {
      @case ('Flash sale') {
        <div class="bg-primary text-primary-foreground max-w-md rounded-lg px-5 py-4">
          <p class="text-sm font-medium opacity-90">Flash sale — 40% off all plans</p>
          <ui-countdown
            [target]="flashSaleEnd"
            label="Ends in"
            class="[&_.text-foreground]:text-primary-foreground [&_.text-muted-foreground]:text-primary-foreground/70 mt-2"
          />
        </div>
      }
      @case ('Auction ending') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>Vintage camera lot</h3>
            <p ui-card-description>Highest bid: $1,240 · 3 bidders active</p>
          </div>
          <div ui-card-content class="space-y-3">
            <ui-countdown
              [target]="auctionEnd()"
              format="SS"
              label="Bidding closes in"
              (finish)="auctionFinished.set(true)"
              (tick)="auctionTick.set($event)"
            />
            <div class="flex items-center gap-3">
              <button ui-button size="sm" variant="outline" (click)="resetAuction()">Reset timer</button>
              <span class="text-muted-foreground text-xs">
                {{ auctionFinished() ? 'Auction ended!' : 'Ticking… ' + ceilSeconds(auctionTick()) + 's left' }}
              </span>
            </div>
          </div>
        </div>
      }
      @case ('Event countdown') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>UIPKGE Summit 2025</h3>
            <p ui-card-description>Doors open in 2 days, 4 hours, 30 minutes.</p>
          </div>
          <div ui-card-content>
            <ui-countdown [target]="eventStart" label="Starts in" />
          </div>
        </div>
      }
      @case ('Format variants') {
        <div class="grid max-w-lg gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <p class="text-muted-foreground text-xs">DD:HH:MM:SS</p>
            <ui-countdown [target]="eventStart" />
          </div>
          <div class="space-y-1.5">
            <p class="text-muted-foreground text-xs">HH:MM:SS</p>
            <ui-countdown [target]="eventStart" format="HH:MM:SS" />
          </div>
          <div class="space-y-1.5">
            <p class="text-muted-foreground text-xs">MM:SS</p>
            <ui-countdown [target]="flashSaleEnd" format="MM:SS" />
          </div>
          <div class="space-y-1.5">
            <p class="text-muted-foreground text-xs">SS</p>
            <ui-countdown [target]="auctionEnd()" format="SS" />
          </div>
        </div>
      }
      @case ('Custom unit cards') {
        <ui-countdown
          [target]="eventStart"
          separator=""
          [renderDays]="daysTile"
          [renderHours]="hoursTile"
          [renderMinutes]="minutesTile"
          [renderSeconds]="secondsTile"
        />
      }
      @case ('Paused & styling') {
        <div class="max-w-md space-y-3">
          <ui-countdown [target]="pausedTarget" [paused]="isPaused()" label="Paused demo" separator="—" />
          <div class="flex items-center gap-3">
            <button ui-button size="sm" variant="outline" (click)="isPaused.set(!isPaused())">
              {{ isPaused() ? 'Resume' : 'Pause' }}
            </button>
            <ui-countdown [target]="eventStart" [pad]="false" label="No leading zeros" />
          </div>
        </div>
      }
      @case ('New year') {
        <ui-countdown [target]="newYear" label="New Year" />
      }
    }
  `,
})
export class AngularCountdownDemoComponent {
  @Input() story = 'Flash sale'
  readonly flashSaleEnd = Date.now() + 3_600_000 * 5 + 42_000
  readonly auctionEnd = signal(Date.now() + 10_000)
  readonly eventStart = Date.now() + 86_400_000 * 2 + 3_600_000 * 4 + 60_000 * 30
  readonly newYear = new Date(new Date().getFullYear() + 1, 0, 1).getTime()
  readonly pausedTarget = Date.now() + 120_000
  readonly isPaused = signal(false)
  readonly auctionFinished = signal(false)
  readonly auctionTick = signal(0)

  resetAuction(): void {
    this.auctionEnd.set(Date.now() + 10_000)
    this.auctionFinished.set(false)
  }

  pad2(n: number): string {
    return String(n).padStart(2, '0')
  }

  ceilSeconds(ms: number): number {
    return Math.ceil(ms / 1000)
  }
}
