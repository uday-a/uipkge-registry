import { Component, Input } from '@angular/core'
import { UiSeparatorComponent } from '../../../../../packages/registry-angular/components/separator/separator.component'

/** Angular demo for the separator page. Mirrors demos/react/separator.tsx story by story. */
@Component({
  selector: 'angular-separator-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiSeparatorComponent],
  template: `
    @switch (story) {
      @case ('Horizontal') {
        <div>
          <h4 class="text-sm leading-none font-medium">Section header</h4>
          <p class="text-muted-foreground text-sm">Helper text above the divider.</p>
          <div ui-separator class="my-3"></div>
          <p class="text-sm">Content below the separator.</p>
        </div>
      }
      @case ('Vertical') {
        <div class="flex h-5 items-center gap-3 text-sm">
          <span>Blog</span>
          <div ui-separator orientation="vertical"></div>
          <span>Docs</span>
          <div ui-separator orientation="vertical"></div>
          <span>Source</span>
        </div>
      }
    }
  `,
})
export class AngularSeparatorDemoComponent {
  @Input() story = 'Horizontal'
}
