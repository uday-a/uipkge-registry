import { Component, Input } from '@angular/core'
import {
  UiResizableHandleComponent,
  UiResizablePanelComponent,
  UiResizablePanelGroupComponent,
} from '../../../../../packages/registry-angular/components/resizable/resizable.component'

/** Angular demo for the resizable page. Mirrors demos/react/resizable.tsx story by story. */
@Component({
  selector: 'angular-resizable-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiResizablePanelGroupComponent, UiResizablePanelComponent, UiResizableHandleComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div ui-resizable-panel-group direction="horizontal" class="border-border max-w-2xl rounded-md border">
          <div ui-resizable-panel [defaultSize]="33">
            <div class="flex h-32 items-center justify-center text-sm">Left</div>
          </div>
          <div ui-resizable-handle></div>
          <div ui-resizable-panel [defaultSize]="67">
            <div ui-resizable-panel-group direction="vertical">
              <div ui-resizable-panel [defaultSize]="50">
                <div class="flex h-16 items-center justify-center text-sm">Top right</div>
              </div>
              <div ui-resizable-handle></div>
              <div ui-resizable-panel [defaultSize]="50">
                <div class="flex h-16 items-center justify-center text-sm">Bottom right</div>
              </div>
            </div>
          </div>
        </div>
      }
      @case ('Horizontal only') {
        <div ui-resizable-panel-group direction="horizontal" class="border-border max-w-2xl rounded-md border">
          <div ui-resizable-panel [defaultSize]="40">
            <div class="flex h-32 items-center justify-center text-sm">Sidebar</div>
          </div>
          <div ui-resizable-handle></div>
          <div ui-resizable-panel [defaultSize]="60">
            <div class="flex h-32 items-center justify-center text-sm">Content</div>
          </div>
        </div>
      }
      @case ('Vertical only') {
        <div ui-resizable-panel-group direction="vertical" class="border-border h-48 max-w-2xl rounded-md border">
          <div ui-resizable-panel [defaultSize]="50">
            <div class="flex h-full items-center justify-center text-sm">Top</div>
          </div>
          <div ui-resizable-handle></div>
          <div ui-resizable-panel [defaultSize]="50">
            <div class="flex h-full items-center justify-center text-sm">Bottom</div>
          </div>
        </div>
      }
      @case ('Three panels') {
        <div ui-resizable-panel-group direction="horizontal" class="border-border max-w-2xl rounded-md border">
          <div ui-resizable-panel [defaultSize]="20">
            <div class="flex h-32 items-center justify-center text-sm">Files</div>
          </div>
          <div ui-resizable-handle></div>
          <div ui-resizable-panel [defaultSize]="55">
            <div class="flex h-32 items-center justify-center text-sm">Editor</div>
          </div>
          <div ui-resizable-handle></div>
          <div ui-resizable-panel [defaultSize]="25">
            <div class="flex h-32 items-center justify-center text-sm">Inspector</div>
          </div>
        </div>
      }
      @case ('Min-size constraints') {
        <div ui-resizable-panel-group direction="horizontal" class="border-border max-w-2xl rounded-md border">
          <div ui-resizable-panel [defaultSize]="30" [minSize]="20">
            <div class="flex h-32 items-center justify-center text-sm">min 20%</div>
          </div>
          <div ui-resizable-handle></div>
          <div ui-resizable-panel [defaultSize]="70" [minSize]="40">
            <div class="flex h-32 items-center justify-center text-sm">min 40%</div>
          </div>
        </div>
      }
      @case ('Visible handle') {
        <div ui-resizable-panel-group direction="horizontal" class="border-border max-w-2xl rounded-md border">
          <div ui-resizable-panel [defaultSize]="50">
            <div class="flex h-32 items-center justify-center text-sm">One</div>
          </div>
          <div ui-resizable-handle withHandle></div>
          <div ui-resizable-panel [defaultSize]="50">
            <div class="flex h-32 items-center justify-center text-sm">Two</div>
          </div>
        </div>
      }
    }
  `,
})
export class AngularResizableDemoComponent {
  @Input() story = 'Default'
}
