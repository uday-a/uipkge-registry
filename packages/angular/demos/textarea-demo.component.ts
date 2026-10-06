import { Component, Input, signal } from '@angular/core'
import { UiTextareaComponent } from '../../../../../packages/registry-angular/components/textarea/textarea.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'

/** Angular demo for the textarea page. Mirrors demos/react/textarea.tsx story by story. */
@Component({
  selector: 'angular-textarea-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiTextareaComponent, UiLabelComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="grid max-w-md gap-2">
          <label ui-label for="msg">Message</label>
          <ui-textarea id="msg" [(value)]="text" placeholder="Type your message here…" />
          <p class="text-muted-foreground text-xs">{{ text().length }} chars</p>
        </div>
      }
      @case ('Auto size') {
        <div class="grid max-w-md gap-3">
          <ui-textarea [(value)]="autoSizeText" autoSize placeholder="Type multiple lines…" />
        </div>
      }
      @case ('Auto size with min & max rows') {
        <div class="grid max-w-md gap-3">
          <ui-textarea
            [(value)]="minMaxText"
            [autoSize]="{ minRows: 2, maxRows: 6 }"
            placeholder="Type to see height clamping…"
          />
        </div>
      }
      @case ('Show count') {
        <div class="grid max-w-md gap-3">
          <ui-textarea [(value)]="countText" showCount placeholder="Type to see count…" />
        </div>
      }
      @case ('Show count with formatter') {
        <div class="grid max-w-md gap-3">
          <ui-textarea
            [(value)]="formatterText"
            [showCount]="{ formatter: formatter }"
            [maxLength]="100"
            placeholder="Custom formatter…"
          />
        </div>
      }
      @case ('Allow clear') {
        <div class="grid max-w-md gap-3">
          <ui-textarea [(value)]="clearText" allowClear placeholder="Type something…" />
        </div>
      }
      @case ('Max length with show count') {
        <div class="grid max-w-md gap-3">
          <ui-textarea [(value)]="maxLengthText" showCount [maxLength]="100" placeholder="Limited to 100 characters…" />
        </div>
      }
      @case ('Disabled & Readonly') {
        <div class="grid max-w-md gap-3">
          <ui-textarea defaultValue="Disabled value" disabled />
          <ui-textarea defaultValue="Read-only value" readOnly />
        </div>
      }
      @case ('Variants with new features') {
        <div class="grid max-w-md gap-3">
          <ui-textarea variant="outlined" defaultValue="Outlined with clear" allowClear showCount [maxLength]="50" />
          <ui-textarea variant="filled" defaultValue="Filled with clear" allowClear showCount [maxLength]="50" />
          <ui-textarea variant="solo" defaultValue="Solo with clear" allowClear showCount [maxLength]="50" />
          <ui-textarea
            variant="underlined"
            defaultValue="Underlined with clear"
            allowClear
            showCount
            [maxLength]="50"
          />
          <ui-textarea variant="plain" defaultValue="Plain with clear" allowClear showCount [maxLength]="50" />
        </div>
      }
    }
  `,
})
export class AngularTextareaDemoComponent {
  @Input() story = 'Default'
  readonly text = signal('')
  readonly autoSizeText = signal('')
  readonly minMaxText = signal('')
  readonly countText = signal('')
  readonly formatterText = signal('')
  readonly clearText = signal('Type something…')
  readonly maxLengthText = signal('')
  readonly formatter = (count: number, max?: number) => `${count}${max ? ' / ' + max : ''} characters`
}
