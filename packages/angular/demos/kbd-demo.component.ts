import { Component, Input } from '@angular/core'
import { UiKbdComponent } from '../../../../../packages/registry-angular/components/kbd/kbd.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

/** Angular demo for the kbd page. Mirrors demos/react/kbd.tsx story by story. */
@Component({
  selector: 'angular-kbd-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiKbdComponent, UiButtonComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <p class="text-sm">Press <kbd ui-kbd>⌘</kbd>&ngsp;<kbd ui-kbd>K</kbd> to open the command palette.</p>
      }
      @case ('Single key') {
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <kbd ui-kbd>↑</kbd>
          <kbd ui-kbd>↓</kbd>
          <kbd ui-kbd>←</kbd>
          <kbd ui-kbd>→</kbd>
          <kbd ui-kbd>Esc</kbd>
          <kbd ui-kbd>Enter</kbd>
        </div>
      }
      @case ('Modifier combos') {
        <p class="text-sm">
          Save with <kbd ui-kbd>⌘</kbd>&ngsp;<kbd ui-kbd>S</kbd> or <kbd ui-kbd>Ctrl</kbd>&ngsp;<kbd ui-kbd>S</kbd> on
          Windows.
        </p>
      }
      @case ('In a button row') {
        <div class="flex items-center gap-2">
          <button ui-button variant="outline" size="sm">Search<kbd ui-kbd class="ml-2">⌘K</kbd></button>
          <button ui-button variant="ghost" size="sm">New<kbd ui-kbd class="ml-2">N</kbd></button>
        </div>
      }
      @case ('Long label') {
        <kbd ui-kbd>Shift</kbd>
      }
    }
  `,
})
export class AngularKbdDemoComponent {
  @Input() story = 'Default'
}
