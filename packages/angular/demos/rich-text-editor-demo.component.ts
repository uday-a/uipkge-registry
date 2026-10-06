import { Component, Input } from '@angular/core'
import { UiRichTextEditorComponent } from '@/ui/rich-text-editor'

@Component({
  selector: 'angular-rich-text-editor-demo',
  standalone: true,
  imports: [UiRichTextEditorComponent],
  template: `
    @switch (story) {
      @case ('Empty with placeholder') {
        <div class="space-y-2">
          <ui-rich-text-editor
            [value]="empty"
            (valueChange)="empty = $event"
            placeholder="Write a description..."
            minHeight="120px"
          />
          <p class="text-muted-foreground text-xs">
            Length: <code class="text-foreground">{{ empty.length }}</code> chars
          </p>
        </div>
      }

      @case ('Pre-filled content') {
        <ui-rich-text-editor [value]="filled" (valueChange)="filled = $event" minHeight="150px" />
      }

      @case ('Custom min-height') {
        <ui-rich-text-editor
          [value]="tall"
          (valueChange)="tall = $event"
          placeholder="Draft your post..."
          minHeight="280px"
        />
      }

      @case ('Side-by-side editing') {
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-1">
            <p class="text-sm font-medium">English</p>
            <ui-rich-text-editor
              [value]="left"
              (valueChange)="left = $event"
              placeholder="Source..."
              minHeight="160px"
            />
          </div>
          <div class="space-y-1">
            <p class="text-sm font-medium">Japanese</p>
            <ui-rich-text-editor
              [value]="right"
              (valueChange)="right = $event"
              placeholder="Translation..."
              minHeight="160px"
            />
          </div>
        </div>
      }
    }
  `,
})
export class RichTextEditorDemoComponent {
  @Input() story?: string

  empty = ''
  filled = '<p>Hello <strong>world</strong></p><p>This is a <em>rich text editor</em> demo.</p>'
  tall = '<p>This editor has a taller minimum height for longer-form writing.</p>'
  left = '<p>Left pane content.</p>'
  right = '<p>Right pane content.</p>'
}
