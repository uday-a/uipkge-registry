import { Component, Input } from '@angular/core'
import { UiBorderBeamComponent } from '../../../../../packages/registry-angular/components/border-beam/border-beam.component'
import { UiProgressComponent } from '../../../../../packages/registry-angular/components/progress/progress.component'

/** Angular demo for the border-beam page. Mirrors demos/react/border-beam.tsx story by story. */
@Component({
  selector: 'angular-border-beam-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiBorderBeamComponent, UiProgressComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="bg-card relative rounded-xl border p-6">
          <ui-border-beam />
          <h3 class="text-sm font-medium">Deploy complete</h3>
          <p class="text-muted-foreground mt-1 text-xs">uipkge.dev · production · 42s ago</p>
        </div>
      }
      @case ('Colors') {
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="bg-card relative rounded-xl border p-6">
            <ui-border-beam color="var(--primary)" />
            <p class="text-xs font-medium">Primary</p>
            <p class="text-muted-foreground mt-1 text-xs">Default emphasis</p>
          </div>
          <div class="bg-card relative rounded-xl border p-6">
            <ui-border-beam color="var(--destructive)" />
            <p class="text-xs font-medium">Destructive</p>
            <p class="text-muted-foreground mt-1 text-xs">Needs attention</p>
          </div>
          <div class="bg-card relative rounded-xl border p-6">
            <ui-border-beam color="var(--success)" />
            <p class="text-xs font-medium">Success</p>
            <p class="text-muted-foreground mt-1 text-xs">All clear</p>
          </div>
        </div>
      }
      @case ('Slow ambient') {
        <div class="bg-card relative rounded-xl border p-6">
          <ui-border-beam [duration]="12" />
          <h3 class="text-sm font-medium">System healthy</h3>
          <p class="text-muted-foreground mt-1 text-xs">All services operational · 99.98% uptime</p>
        </div>
      }
      @case ('Fast attention') {
        <div class="bg-card relative rounded-xl border p-6">
          <ui-border-beam [duration]="2" />
          <h3 class="text-sm font-medium">Live region</h3>
          <p class="text-muted-foreground mt-1 text-xs">Streaming events in real time</p>
        </div>
      }
      @case ('Thickness') {
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="bg-card relative rounded-xl border p-6">
            <ui-border-beam [size]="4" />
            <p class="text-xs font-medium">Thick — size 4</p>
            <p class="text-muted-foreground mt-1 text-xs">Bold frame</p>
          </div>
          <div class="bg-card relative rounded-xl border p-6">
            <ui-border-beam [size]="1" />
            <p class="text-xs font-medium">Hairline — size 1</p>
            <p class="text-muted-foreground mt-1 text-xs">Subtle shimmer</p>
          </div>
        </div>
      }
      @case ('Paused') {
        <div class="bg-card relative rounded-xl border p-6">
          <ui-border-beam paused [delay]="-3" />
          <h3 class="text-sm font-medium">Paused beam</h3>
          <p class="text-muted-foreground mt-1 text-xs">Static half-track highlight</p>
        </div>
      }
      @case ('Offset pair') {
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="bg-card relative rounded-xl border p-6">
            <ui-border-beam />
            <p class="text-xs font-medium">delay 0</p>
            <p class="text-muted-foreground mt-1 text-xs">Starts at the top edge</p>
          </div>
          <div class="bg-card relative rounded-xl border p-6">
            <ui-border-beam [delay]="-3" />
            <p class="text-xs font-medium">delay -3s</p>
            <p class="text-muted-foreground mt-1 text-xs">Starts halfway around</p>
          </div>
        </div>
      }
      @case ('AI processing') {
        <div class="bg-card relative rounded-xl border p-6">
          <ui-border-beam [size]="3" />
          <div class="flex items-center gap-3">
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
              class="lucide lucide-loader-circle text-muted-foreground size-4 animate-spin"
              aria-hidden="true"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <span class="text-sm">Generating response…</span>
          </div>
        </div>
      }
      @case ('Upload progress') {
        <div class="bg-card relative rounded-xl border p-6">
          <ui-border-beam color="var(--success)" />
          <div class="flex items-center gap-3">
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
              class="lucide lucide-file-up text-muted-foreground size-4"
              aria-hidden="true"
            >
              <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
              <path d="M14 2v4a2 2 0 0 0 2 2h4" />
              <path d="M12 12v6" />
              <path d="m15 15-3-3-3 3" />
            </svg>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm">quarterly-report.pdf</p>
              <ui-progress [value]="68" class="mt-2" />
              <p class="text-muted-foreground mt-2 text-xs">68% uploaded</p>
            </div>
          </div>
        </div>
      }
      @case ('Pill') {
        <div class="bg-card relative inline-flex items-center gap-2 rounded-full border px-5 py-2">
          <ui-border-beam [size]="2" />
          <span class="bg-success relative size-2 rounded-full" aria-hidden="true"></span>
          <span class="text-xs font-medium">All systems operational</span>
        </div>
      }
      @case ('Dashboard highlight') {
        <div class="grid gap-4 sm:grid-cols-3">
          <div class="bg-card rounded-xl border p-6">
            <p class="text-muted-foreground text-xs tracking-wide uppercase">Sessions</p>
            <p class="mt-2 text-2xl font-bold tabular-nums">18,204</p>
            <p class="text-muted-foreground mt-1 text-xs">+4.1% vs last week</p>
          </div>
          <div class="bg-card relative rounded-xl border p-6">
            <ui-border-beam />
            <p class="text-muted-foreground text-xs tracking-wide uppercase">Revenue</p>
            <p class="mt-2 text-2xl font-bold tabular-nums">$48,910</p>
            <p class="text-success mt-1 text-xs font-medium">+12.6% vs last week</p>
          </div>
          <div class="bg-card rounded-xl border p-6">
            <p class="text-muted-foreground text-xs tracking-wide uppercase">Churn</p>
            <p class="mt-2 text-2xl font-bold tabular-nums">1.8%</p>
            <p class="text-muted-foreground mt-1 text-xs">-0.3% vs last week</p>
          </div>
        </div>
      }
    }
  `,
})
export class AngularBorderBeamDemoComponent {
  @Input() story = 'Default'
}
