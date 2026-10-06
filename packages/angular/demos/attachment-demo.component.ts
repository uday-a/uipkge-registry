import { Component, Input } from '@angular/core'
import { UiAttachmentComponent } from '@/ui/attachment'

@Component({
  selector: 'angular-attachment-demo',
  standalone: true,
  imports: [UiAttachmentComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-attachment title="sales-dashboard.pdf" description="PDF · 2.4 MB" />
      }

      @case ('State') {
        <div class="flex flex-col gap-3">
          <ui-attachment title="Add a file" description="PNG or JPG" state="idle" media="image" />
          <ui-attachment title="sales-dashboard.pdf" description="Uploading · 64%" state="uploading" />
          <ui-attachment title="invoice.png" description="Processing" state="processing" media="image" />
          <ui-attachment title="corrupt.bin" description="Upload failed" state="error" [removable]="true" />
          <ui-attachment title="notes.pdf" description="PDF · 2.4 MB" state="done" />
        </div>
      }

      @case ('Size') {
        <div class="flex flex-col gap-3">
          <ui-attachment title="schema.ts" description="TypeScript · default" media="code" size="default" />
          <ui-attachment title="schema.ts" description="TypeScript · sm" media="code" size="sm" />
          <ui-attachment title="schema.ts" description="TypeScript · xs" media="code" size="xs" />
        </div>
      }

      @case ('Orientation') {
        <ui-attachment title="cover.jpg" description="JPG · 1.1 MB" media="image" orientation="vertical" />
      }

      @case ('Media') {
        <div class="flex flex-col gap-3">
          <ui-attachment title="brief.pdf" description="PDF · 820 KB" media="file" />
          <ui-attachment title="schema.ts" description="TS · 12 KB" media="code" />
          <ui-attachment
            title="hero.webp"
            description="WEBP · 940 KB"
            media="image"
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop&q=80"
            alt="Coast"
          />
        </div>
      }

      @case ('Removable') {
        <ui-attachment title="notes.pdf" description="PDF · 2.4 MB" [removable]="true" />
      }

      @case ('Title only') {
        <ui-attachment title="untitled.bin" />
      }

      @case ('Long title') {
        <ui-attachment
          class="max-w-xs"
          title="very-long-quarterly-sales-dashboard-export-final-v3.pdf"
          description="PDF · 18.2 MB"
        />
      }

      @case ('Small removable image') {
        <ui-attachment
          title="avatar.png"
          description="PNG · 210 KB"
          size="sm"
          media="image"
          src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200&h=200&fit=crop&q=80"
          alt="City"
          [removable]="true"
        />
      }

      @case ('Idle image drop') {
        <ui-attachment title="Add an image" description="PNG or JPG" state="idle" media="image" />
      }
    }
  `,
})
export class AttachmentDemoComponent {
  @Input() story?: string
}
