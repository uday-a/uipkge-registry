import { Component, Input, signal } from '@angular/core'
import { UiClipboardComponent } from '../../../../../packages/registry-angular/components/clipboard/clipboard.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

/** Angular demo for the clipboard page. Mirrors demos/react/clipboard.tsx story by story. */
@Component({
  selector: 'angular-clipboard-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiClipboardComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Install command') {
        <div class="bg-muted flex max-w-md items-center justify-between rounded-md p-3">
          <code class="text-sm">npm install &#64;uipkge/ui</code>
          <ui-clipboard text="npm install @uipkge/ui" (copyText)="onCopy($event)" />
        </div>
      }
      @case ('API key & secrets') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>Live API key</h3>
            <p ui-card-description>Use this key in your server-side code. Keep it secret.</p>
          </div>
          <div ui-card-content class="space-y-3">
            <div class="bg-muted flex items-center justify-between rounded-md p-3">
              <code class="text-sm">mock_key_a1b2c3d4e5f6g7h8i9j0</code>
              <ui-clipboard
                text="mock_key_a1b2c3d4e5f6g7h8i9j0"
                label="Copy key"
                [timeout]="3000"
                (copyText)="onCopy($event)"
              />
            </div>
            <div class="bg-muted/50 flex items-center justify-between rounded-md p-3">
              <code class="text-muted-foreground text-sm">sk_test_z9y8x7w6v5u4t3s2r1</code>
              <ui-clipboard text="sk_test_z9y8x7w6v5u4t3s2r1" label="Copy test key" (copyText)="onCopy($event)" />
            </div>
          </div>
        </div>
      }
      @case ('Code snippets') {
        <div class="max-w-md space-y-3">
          <div class="bg-muted flex items-center justify-between rounded-md p-3">
            <code class="text-sm">git clone https://github.com/uday-a/angular-boilerplate.git</code>
            <ui-clipboard text="git clone https://github.com/uday-a/angular-boilerplate.git" (copyText)="onCopy($event)" />
          </div>
          <div class="bg-muted flex items-center justify-between rounded-md p-3">
            <code class="text-sm">VITE_API_URL=https://api.example.com</code>
            <ui-clipboard text="VITE_API_URL=https://api.example.com" (copyText)="onCopy($event)" />
          </div>
        </div>
      }
      @case ('Contact details') {
        <div class="flex max-w-md flex-wrap items-center gap-4">
          <ui-clipboard
            text="support@uipkge.dev"
            tooltip="Copy email"
            successText="Email copied!"
            label="support@uipkge.dev"
            (copyText)="onCopy($event)"
          />
          <ui-clipboard
            text="https://uipkge.dev/docs/getting-started"
            tooltip="Copy link"
            successText="Link copied!"
            label="Copy docs link"
            (copyText)="onCopy($event)"
          />
        </div>
      }
      @case ('Label-only & custom render prop') {
        <div class="flex max-w-md flex-wrap items-center gap-4">
          <ui-clipboard text="label-only-text" label="Copy this text" hideIcon (copyText)="onCopy($event)" />
          <ui-clipboard text="slot-demo" (copyText)="onCopy($event)">
            <ng-template let-state>
              <span
                class="text-xs font-medium"
                [class.text-emerald-500]="state === 'success'"
                [class.text-muted-foreground]="state !== 'success'"
                >{{ state === 'success' ? 'Done!' : 'Copy me' }}</span
              >
            </ng-template>
          </ui-clipboard>
        </div>
      }
      @case ('Button-styled') {
        <ui-clipboard
          text="npx shadcn@latest add https://uipkge.dev/r/react/button.json"
          class="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground px-3 py-1.5"
          label="Copy install command"
          (copyText)="onCopy($event)"
        />
      }
      @case ('Event log') {
        <div class="max-w-md space-y-3">
          <div class="flex flex-wrap items-center gap-3">
            <ui-clipboard text="event-demo-1" (copyText)="onCopy($event)" />
            <ui-clipboard text="event-demo-2" label="Copy second" (copyText)="onCopy($event)" />
            <ui-clipboard text="cannot-copy" disabled tooltip="Disabled" />
          </div>
          <div class="bg-muted/40 rounded-md p-3 text-xs">
            @if (log().length === 0) {
              <p class="text-muted-foreground">No copies yet — click a button above.</p>
            } @else {
              <ul class="space-y-1">
                @for (line of log().slice(0, 5); track $index) {
                  <li class="text-foreground">{{ line }}</li>
                }
              </ul>
            }
          </div>
        </div>
      }
    }
  `,
})
export class AngularClipboardDemoComponent {
  @Input() story = 'Install command'
  readonly log = signal<string[]>([])

  onCopy(t: string): void {
    this.log.update((prev) => [
      `Copied "${t.slice(0, 40)}${t.length > 40 ? '…' : ''}" at ${new Date().toLocaleTimeString()}`,
      ...prev,
    ])
  }
}
