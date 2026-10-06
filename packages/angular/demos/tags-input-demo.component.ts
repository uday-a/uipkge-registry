import { Component, Input, signal } from '@angular/core'
import { UiTagsInputComponent } from '../../../../../packages/registry-angular/components/tags-input/tags-input.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'

/** Angular demo for the tags-input page. Mirrors demos/react/tags-input.tsx story by story. */
@Component({
  selector: 'angular-tags-input-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiTagsInputComponent, UiLabelComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <div class="max-w-md space-y-2">
          <label ui-label>Tags</label>
          <ui-tags-input [value]="tags()" (valueChange)="tags.set($event)" placeholder="Add a tag..." />
          <p class="text-muted-foreground text-xs">
            Value: <code class="text-foreground">{{ tags().join(', ') || '—' }}</code>
          </p>
        </div>
      }
      @case ('Add on paste') {
        <div class="max-w-md space-y-2">
          <label ui-label>Paste a list</label>
          <ui-tags-input
            [value]="pasteTags()"
            (valueChange)="pasteTags.set($event)"
            addOnPaste
            placeholder="Try pasting: red green blue"
          />
        </div>
      }
      @case ('Custom delimiter') {
        <div class="max-w-md space-y-2">
          <label ui-label>Comma-separated tags</label>
          <ui-tags-input
            [value]="csvTags()"
            (valueChange)="csvTags.set($event)"
            delimiter=","
            placeholder="Type and press comma..."
          />
        </div>
      }
      @case ('Max length') {
        <div class="max-w-md space-y-2">
          <label ui-label>Up to 3 tags</label>
          <ui-tags-input
            [value]="maxTags()"
            (valueChange)="maxTags.set($event)"
            [max]="3"
            placeholder="Add another..."
          />
          <p class="text-muted-foreground text-xs">{{ maxTags().length }} / 3 tags</p>
        </div>
      }
      @case ('Disabled') {
        <div class="max-w-md space-y-2">
          <label ui-label>Locked tags</label>
          <ui-tags-input [value]="lockedTags" disabled placeholder="Cannot edit" />
        </div>
      }
    }
  `,
})
export class AngularTagsInputDemoComponent {
  @Input() story = 'Default'
  readonly tags = signal(['react', 'next', 'tailwind'])
  readonly pasteTags = signal<string[]>([])
  readonly csvTags = signal<string[]>(['design', 'systems'])
  readonly maxTags = signal<string[]>(['alpha', 'beta'])
  readonly lockedTags = ['read-only', 'locked']
}
