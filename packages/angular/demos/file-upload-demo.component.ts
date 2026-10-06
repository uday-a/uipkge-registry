import { Component, Input } from '@angular/core'
import {
  UiFileUploadComponent,
  UiFileUploadContentComponent,
  UiFileUploadItemComponent,
  UiFileUploadItemNameComponent,
  UiFileUploadItemSizeComponent,
} from '../../../../../packages/registry-angular/components/file-upload/file-upload.component'

/** Angular demo for the file-upload page. Mirrors demos/react/file-upload.tsx story by story. */
@Component({
  selector: 'angular-file-upload-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiFileUploadComponent,
    UiFileUploadContentComponent,
    UiFileUploadItemComponent,
    UiFileUploadItemNameComponent,
    UiFileUploadItemSizeComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-file-upload [(value)]="images" class="max-w-md" accept="image/*">
          <p class="text-sm font-medium">Drag &amp; drop files here</p>
          <p class="text-muted-foreground mt-1 text-xs">Or click to browse</p>
        </ui-file-upload>
      }
      @case ('Multiple files') {
        <ui-file-upload [(value)]="docs" class="max-w-md" multiple>
          <p class="text-sm font-medium">Upload documents</p>
          <p class="text-muted-foreground mt-1 text-xs">PDF, DOC, or images — multiple allowed</p>
          @if (docs.length) {
            <ui-file-upload-content>
              @for (file of docs; track file.name + $index) {
                <ui-file-upload-item [file]="file" (remove)="docs = removeAt(docs, $index)" />
              }
            </ui-file-upload-content>
          }
        </ui-file-upload>
      }
      @case ('Accept restriction') {
        <ui-file-upload [(value)]="pdfs" class="max-w-md" accept=".pdf,.doc,.docx" multiple>
          <p class="text-sm font-medium">Upload contracts</p>
          <p class="text-muted-foreground mt-1 text-xs">Only PDF and Word files accepted</p>
          @if (pdfs.length) {
            <ui-file-upload-content>
              @for (file of pdfs; track file.name + $index) {
                <div class="bg-muted/50 flex items-center gap-3 rounded-md border p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-file-text text-muted-foreground size-8 shrink-0"
                    aria-hidden="true"
                  >
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M10 9H8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                  </svg>
                  <div class="min-w-0 flex-1">
                    <p ui-file-upload-item-name>{{ file.name }}</p>
                    <span ui-file-upload-item-size>{{ (file.size / 1024).toFixed(1) }} KB</span>
                  </div>
                </div>
              }
            </ui-file-upload-content>
          }
        </ui-file-upload>
      }
      @case ('Disabled') {
        <ui-file-upload class="max-w-md" disabled>
          <p class="text-sm font-medium">Uploads are paused</p>
          <p class="text-muted-foreground mt-1 text-xs">Re-enable in your account settings</p>
        </ui-file-upload>
      }
      @case ('Custom content') {
        <ui-file-upload [(value)]="customFiles" class="max-w-md" multiple>
          <svg
            slot="icon"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-cloud-upload text-primary mb-2 size-10"
            aria-hidden="true"
          >
            <path d="M12 13v8" />
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="m8 17 4-4 4 4" />
          </svg>
          <p class="text-sm font-semibold">Drop your assets</p>
          <p class="text-muted-foreground mt-1 text-xs">PNG, JPG, or SVG up to 10 MB each</p>
          @if (customFiles.length) {
            <ui-file-upload-content>
              @for (file of customFiles; track file.name + $index) {
                <ui-file-upload-item [file]="file" (remove)="customFiles = removeAt(customFiles, $index)" />
              }
            </ui-file-upload-content>
          }
        </ui-file-upload>
      }
    }
  `,
})
export class AngularFileUploadDemoComponent {
  @Input() story = 'Default'
  images: File[] = []
  docs: File[] = []
  pdfs: File[] = []
  customFiles: File[] = []

  removeAt(list: File[], idx: number): File[] {
    return list.filter((_, i) => i !== idx)
  }
}
