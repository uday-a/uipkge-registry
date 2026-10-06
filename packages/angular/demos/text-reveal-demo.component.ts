import { Component, Input } from '@angular/core'
import { UiTextRevealComponent } from '../../../../../packages/registry-angular/components/text-reveal/text-reveal.component'
import { UiGradientTextComponent } from '../../../../../packages/registry-angular/components/gradient-text/gradient-text.component'
import { UiSectionCardComponent } from '../../../../../packages/registry-angular/components/section-card/section-card.component'

/** Angular demo for the text-reveal page. Mirrors demos/react/text-reveal.tsx story by story. */
@Component({
  selector: 'angular-text-reveal-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiTextRevealComponent, UiGradientTextComponent, UiSectionCardComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <h2 ui-text-reveal text="Compose interfaces from source you own" class="text-3xl font-bold tracking-tight"></h2>
      }
      @case ('Character mode') {
        <ui-text-reveal text="Registry" mode="chars" [stagger]="35" class="text-3xl font-bold tracking-tight" />
      }
      @case ('No blur') {
        <ui-text-reveal text="Crisp entrance without the blur pass" [blur]="false" class="text-lg font-medium" />
      }
      @case ('Slow cinematic') {
        <ui-text-reveal
          text="Design engineering, distilled"
          [duration]="900"
          [stagger]="90"
          class="text-4xl font-bold tracking-tight"
        />
      }
      @case ('Snappy') {
        <ui-text-reveal
          text="Instant, tactile, precise"
          [duration]="300"
          [stagger]="20"
          class="text-base font-medium"
        />
      }
      @case ('Paragraph') {
        <ui-text-reveal
          text="Every component ships as source code you copy into your project. No runtime dependency, no version lock — edit anything after installing."
          class="text-muted-foreground max-w-prose text-sm leading-relaxed"
        />
      }
      @case ('With GradientText') {
        <h2 class="text-3xl font-bold tracking-tight">
          <ui-text-reveal text="Ship your ideas at" [stagger]="50" />&nbsp;<ui-gradient-text preset="sunset"
            >lightspeed.</ui-gradient-text
          >
        </h2>
      }
      @case ('Replayable') {
        <div class="bg-card max-h-48 overflow-y-auto rounded-lg border p-6">
          <div class="h-24"></div>
          <ui-text-reveal text="Scroll me out of view, then back in" [once]="false" class="text-xl font-semibold" />
          <div class="h-24"></div>
        </div>
      }
      @case ('Inside a card') {
        <ui-section-card title="Quarterly report" description="Revealed on scroll">
          <ui-text-reveal text="Revenue grew forty percent year over year" class="text-lg font-medium" />
        </ui-section-card>
      }
      @case ('Display size') {
        <h1
          ui-text-reveal
          text="The component registry for Vue and React"
          [stagger]="60"
          class="text-5xl font-bold tracking-tighter"
        ></h1>
      }
      @case ('Caption / meta') {
        <ui-text-reveal
          text="Trusted by design engineers everywhere"
          [stagger]="25"
          [duration]="400"
          class="text-muted-foreground text-xs font-medium tracking-widest uppercase"
        />
      }
    }
  `,
})
export class AngularTextRevealDemoComponent {
  @Input() story = 'Default'
}
