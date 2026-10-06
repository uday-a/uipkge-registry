import { Component, Input } from '@angular/core'
import { UiTypewriterComponent } from '../../../../../packages/registry-angular/components/typewriter/typewriter.component'

/** Angular demo for the typewriter page. Mirrors demos/react/typewriter.tsx story by story. */
@Component({
  selector: 'angular-typewriter-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiTypewriterComponent],
  template: `
    @switch (story) {
      @case ('Single phrase') {
        <p class="text-lg">
          <ui-typewriter phrases="Components you own, not dependencies you rent." />
        </p>
      }
      @case ('Three-phrase loop') {
        <p class="text-lg font-medium">
          <ui-typewriter [phrases]="['Ship faster.', 'Own your code.', 'Compose freely.']" />
        </p>
      }
      @case ('No loop') {
        <p class="text-lg">
          <ui-typewriter
            [phrases]="['First, pull the source.', 'Then edit it freely.', 'Finally, ship it your way.']"
            [loop]="false"
          />
        </p>
      }
      @case ('Slow typing') {
        <p class="text-lg">
          <ui-typewriter phrases="Patience is a feature." [typingSpeed]="120" />
        </p>
      }
      @case ('Fast typing') {
        <p class="text-lg">
          <ui-typewriter phrases="Streaming updates at roughly 55 characters per second." [typingSpeed]="18" />
        </p>
      }
      @case ('Long pause') {
        <p class="text-lg">
          <ui-typewriter [phrases]="['Read this twice.', 'It is worth your while.']" [pause]="3500" />
        </p>
      }
      @case ('Delayed start') {
        <div class="flex items-center gap-3">
          <p class="text-lg">
            <ui-typewriter phrases="Loading your workspace…" [startDelay]="1200" />
          </p>
          <span class="text-muted-foreground text-xs">starts in 1.2s</span>
        </div>
      }
      @case ('Terminal style') {
        <div
          class="max-w-md rounded-lg bg-zinc-950 p-4 font-mono text-sm text-emerald-400 shadow-inner dark:bg-black/60"
        >
          <span class="select-none">$ </span
          ><ui-typewriter phrases="npx shadcn add https://uipkge.dev/r/react/button.json" [typingSpeed]="28" />
        </div>
      }
      @case ('Hero heading') {
        <h2 class="text-4xl font-bold tracking-tight">
          Build interfaces that
          <span class="text-primary"><ui-typewriter [phrases]="['ship.', 'scale.', 'delight.']" /></span>
        </h2>
      }
      @case ('AI response') {
        <div class="bg-muted/40 max-w-xl rounded-lg border p-4">
          <p class="text-muted-foreground text-sm leading-relaxed">
            <ui-typewriter
              phrases="Sure — scaffold the page with a dashboard block, wire the KPI grid to your metrics endpoint, then swap the demo copy for real labels. Everything ships as source, so every edit stays yours."
              [typingSpeed]="14"
            />
          </p>
        </div>
      }
      @case ('No caret') {
        <p class="text-lg">
          <ui-typewriter phrases="Quietly, without a cursor." [showCaret]="false" />
        </p>
      }
    }
  `,
})
export class AngularTypewriterDemoComponent {
  @Input() story = 'Single phrase'
}
