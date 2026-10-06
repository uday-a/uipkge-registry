import { Component, Input } from '@angular/core'
import { UiPhoneComponent } from '../../../../../packages/registry-angular/components/phone/phone.component'
import hrmsScreenshot from '../../assets/templates/hrms.jpeg?url'
import trackingScreenshot from '../../assets/templates/tracking.jpeg?url'

@Component({
  selector: 'angular-phone-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiPhoneComponent],
  template: `
    @switch (story) {
      @case ('Marketing screenshots') {
        <div class="grid place-items-center gap-12 py-10 lg:grid-cols-2">
          <ui-phone model="iphone-17-pro" color="deep-blue" [showStatusBar]="false" [showHomeIndicator]="false">
            <img
              [src]="hrmsScreenshot"
              alt="HR management dashboard"
              class="absolute inset-0 size-full object-cover object-left"
            />
            <div
              class="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-5 pt-24 text-white"
            >
              <p class="text-xs font-medium tracking-[0.18em] text-white/65 uppercase">Workforce</p>
              <p class="mt-1 text-xl font-semibold tracking-tight">Your team, in focus.</p>
            </div>
          </ui-phone>

          <ui-phone model="galaxy-s26-ultra" color="cobalt-violet" [showStatusBar]="false" [showNavBar]="false">
            <img
              [src]="trackingScreenshot"
              alt="Shipment tracking dashboard"
              class="absolute inset-0 size-full object-cover object-center"
            />
            <div
              class="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-5 pt-24 text-white"
            >
              <p class="text-xs font-medium tracking-[0.18em] text-white/65 uppercase">Live tracking</p>
              <p class="mt-1 text-xl font-semibold tracking-tight">Every shipment. One view.</p>
            </div>
          </ui-phone>
        </div>
      }

      @case ('Device chrome') {
        <div class="flex flex-wrap items-end justify-center gap-12 py-10">
          <ui-phone model="iphone-17-pro" color="cosmic-orange">
            <div class="bg-background flex h-full flex-col px-4 pt-14 pb-7">
              <p class="text-muted-foreground text-xs">Good morning</p>
              <h3 class="text-xl font-semibold tracking-tight">Alex Morgan</h3>
              <div class="bg-primary text-primary-foreground mt-5 rounded-[1.4rem] p-4">
                <p class="text-primary-foreground/70 text-xs">Available balance</p>
                <p class="mt-1 text-2xl font-semibold tracking-tight">$4,280.00</p>
              </div>
              <div class="mt-4 flex flex-col gap-2">
                @for (item of sampleTransactions; track item) {
                  <div class="bg-card flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs">
                    <span>{{ item }}</span>
                    <span class="text-muted-foreground tabular-nums">$12.40</span>
                  </div>
                }
              </div>
            </div>
          </ui-phone>

          <ui-phone model="galaxy-s26-ultra" color="titanium-black">
            <div class="bg-muted/40 flex h-full flex-col px-4 pt-12 pb-7">
              <p class="text-muted-foreground text-xs">Tuesday, 11 July</p>
              <h3 class="text-xl font-semibold tracking-tight">Schedule</h3>
              <div class="mt-5 flex flex-col gap-2">
                @for (entry of sampleSchedule; track entry[1]) {
                  <div class="bg-card rounded-[1.2rem] border p-3">
                    <span class="text-muted-foreground text-xs tabular-nums">{{ entry[0] }}</span>
                    <p class="mt-1 text-sm font-medium">{{ entry[1] }}</p>
                  </div>
                }
              </div>
            </div>
          </ui-phone>
        </div>
      }

      @case ('Finishes') {
        <div class="flex flex-wrap items-end justify-center gap-7 py-8">
          <ui-phone model="iphone-17-pro" color="cosmic-orange" size="sm" />
          <ui-phone model="iphone-17-pro" color="deep-blue" size="sm" />
          <ui-phone model="iphone-17-pro" color="silver" size="sm" />
          <ui-phone model="galaxy-s26-ultra" color="titanium-black" size="sm" />
          <ui-phone model="galaxy-s26-ultra" color="cobalt-violet" size="sm" />
        </div>
      }
    }
  `,
})
export class AngularPhoneDemoComponent {
  @Input() story = 'Marketing screenshots'

  readonly hrmsScreenshot = hrmsScreenshot
  readonly trackingScreenshot = trackingScreenshot

  readonly sampleTransactions = ['Coffee shop', 'Metro card', 'Payroll']
  readonly sampleSchedule = [
    ['09:00', 'Standup'],
    ['11:30', 'Design review'],
    ['15:00', 'Ship checklist'],
  ]
}
