import { Component, Input } from '@angular/core'
import { UiGradientTextComponent } from '../../../../../packages/registry-angular/components/gradient-text/gradient-text.component'

/** Angular demo for the gradient-text page. Mirrors demos/react/gradient-text.tsx story by story. */
@Component({
  selector: 'angular-gradient-text-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiGradientTextComponent],
  template: `
    @switch (story) {
      @case ('Sunset preset') {
        <p class="text-3xl font-bold">
          <ui-gradient-text preset="sunset">Beautiful Gradient</ui-gradient-text>
        </p>
      }
      @case ('Ocean preset') {
        <p class="text-3xl font-bold">
          <ui-gradient-text preset="ocean">Ocean Breeze</ui-gradient-text>
        </p>
      }
      @case ('Forest preset') {
        <p class="text-3xl font-bold">
          <ui-gradient-text preset="forest">Forest Canopy</ui-gradient-text>
        </p>
      }
      @case ('Rainbow preset') {
        <p class="text-3xl font-bold">
          <ui-gradient-text preset="rainbow">Rainbow Text</ui-gradient-text>
        </p>
      }
      @case ('All presets') {
        <div class="flex flex-wrap gap-x-6 gap-y-2 text-xl font-bold">
          <ui-gradient-text preset="sunset">sunset</ui-gradient-text>
          <ui-gradient-text preset="ocean">ocean</ui-gradient-text>
          <ui-gradient-text preset="forest">forest</ui-gradient-text>
          <ui-gradient-text preset="fire">fire</ui-gradient-text>
          <ui-gradient-text preset="candy">candy</ui-gradient-text>
          <ui-gradient-text preset="aurora">aurora</ui-gradient-text>
          <ui-gradient-text preset="gold">gold</ui-gradient-text>
          <ui-gradient-text preset="neon">neon</ui-gradient-text>
          <ui-gradient-text preset="grape">grape</ui-gradient-text>
        </div>
      }
      @case ('Custom from/to') {
        <p class="text-3xl font-bold">
          <ui-gradient-text from="#7c3aed" to="#ec4899">Custom Colors</ui-gradient-text>
        </p>
      }
      @case ('Direction') {
        <div class="space-y-2 text-2xl font-bold">
          <ui-gradient-text from="#7c3aed" to="#ec4899" direction="to bottom">to bottom</ui-gradient-text>
          <ui-gradient-text from="#7c3aed" to="#ec4899" direction="to top right">to top right</ui-gradient-text>
          <ui-gradient-text from="#7c3aed" to="#ec4899" direction="to bottom left">to bottom left</ui-gradient-text>
        </div>
      }
      @case ('Custom gradient') {
        <p class="text-3xl font-bold">
          <ui-gradient-text gradient="linear-gradient(45deg, #f12711, #f5af19, #2193b0, #6dd5ed)"
            >Four-Stop Angled</ui-gradient-text
          >
        </p>
      }
      @case ('Animated') {
        <p class="text-3xl font-bold">
          <ui-gradient-text preset="aurora" animated>Animated Gradient</ui-gradient-text>
        </p>
      }
      @case ('Animated presets') {
        <div class="space-y-3">
          <p class="text-2xl font-bold"><ui-gradient-text preset="aurora" animated>Aurora Flow</ui-gradient-text></p>
          <p class="text-2xl font-bold"><ui-gradient-text preset="rainbow" animated>Rainbow Flow</ui-gradient-text></p>
          <p class="text-2xl font-bold"><ui-gradient-text preset="sunset" animated>Sunset Flow</ui-gradient-text></p>
          <p class="text-2xl font-bold"><ui-gradient-text preset="ocean" animated>Ocean Flow</ui-gradient-text></p>
          <p class="text-2xl font-bold"><ui-gradient-text preset="fire" animated>Fire Flow</ui-gradient-text></p>
          <p class="text-2xl font-bold"><ui-gradient-text preset="neon" animated>Neon Flow</ui-gradient-text></p>
        </div>
      }
      @case ('Animation speed') {
        <div class="space-y-3">
          <p class="text-2xl font-bold">
            <ui-gradient-text preset="aurora" animated [animationDuration]="2">2s — Fast</ui-gradient-text>
          </p>
          <p class="text-2xl font-bold">
            <ui-gradient-text preset="aurora" animated [animationDuration]="4">4s — Default</ui-gradient-text>
          </p>
          <p class="text-2xl font-bold">
            <ui-gradient-text preset="aurora" animated [animationDuration]="8">8s — Slow</ui-gradient-text>
          </p>
        </div>
      }
      @case ('Animated custom gradient') {
        <p class="text-3xl font-bold">
          <ui-gradient-text
            gradient="linear-gradient(45deg, #f12711, #f5af19, #2193b0, #6dd5ed, #f12711)"
            animated
            [animationDuration]="3"
            >Four-Stop Flowing</ui-gradient-text
          >
        </p>
      }
      @case ('Animated inline') {
        <!-- JSX drops the line breaks around the GradientText children, so there is no space on either side. -->
        <p class="text-base">
          This sentence has an<ui-gradient-text preset="fire" animated class="font-semibold"
            >animated highlight</ui-gradient-text
          >that flows continuously, plus a<ui-gradient-text
            preset="ocean"
            animated
            [animationDuration]="6"
            class="font-semibold"
            >slower one</ui-gradient-text
          >for contrast.
        </p>
      }
      @case ('Inline in a sentence') {
        <p class="text-base">
          You can highlight
          <ui-gradient-text preset="fire" class="font-semibold">specific words</ui-gradient-text> inside a normal
          sentence using
          <ui-gradient-text from="#10b981" to="#3b82f6" class="font-semibold">custom colors</ui-gradient-text>.
        </p>
      }
      @case ('As heading') {
        <h1 ui-gradient-text preset="grape" class="text-4xl font-bold">Heading Gradient</h1>
      }
    }
  `,
})
export class AngularGradientTextDemoComponent {
  @Input() story = 'Sunset preset'
}
