import { Component, Input } from '@angular/core'
import { UiThemeSwitchComponent, type Theme } from '@/ui/theme-switch'

@Component({
  selector: 'angular-theme-switch-demo',
  standalone: true,
  imports: [UiThemeSwitchComponent],
  template: `
    @switch (story) {
      @case ('Cards') {
        <ui-theme-switch [value]="cards" (valueChange)="cards = $event" variant="cards" class="max-w-md" />
      }

      @case ('Icons') {
        <ui-theme-switch [value]="icons" (valueChange)="icons = $event" variant="icons" />
      }

      @case ('Icon only') {
        <ui-theme-switch [value]="iconOnly" (valueChange)="iconOnly = $event" variant="icon-only" />
      }

      @case ('Dropdown') {
        <ui-theme-switch [value]="dropdown" (valueChange)="dropdown = $event" variant="dropdown" />
      }

      @case ('Pill') {
        <ui-theme-switch [value]="pill" (valueChange)="pill = $event" variant="pill" class="max-w-sm" />
      }

      @case ('Pill — 4 states') {
        <ui-theme-switch [value]="pill4" (valueChange)="pill4 = $event" variant="pill-4" class="max-w-md" />
      }

      @case ('Switch') {
        <ui-theme-switch [value]="sw" (valueChange)="sw = $event" variant="switch" />
      }
    }
  `,
})
export class ThemeSwitchDemoComponent {
  @Input() story?: string

  cards: Theme = 'system'
  icons: Theme = 'system'
  iconOnly: Theme = 'light'
  dropdown: Theme = 'system'
  pill: Theme = 'system'
  pill4: Theme = 'system'
  sw: Theme = 'light'
}
