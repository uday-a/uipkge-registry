import { Component, Input, OnDestroy } from '@angular/core'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import { UiToasterComponent, toast } from '../../../../../packages/registry-angular/components/sonner/sonner.component'

function fakeAsync(ms = 1500, fail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => (fail ? reject(new Error('Network error')) : resolve('Saved')), ms)
  })
}

/**
 * React renders one <Toaster> for the whole demo page; here every story card mounts its own
 * Angular app, so only the first mounted card renders the toaster (the others share it).
 */
let toasterOwner: object | null = null

/** Angular demo for the sonner page. Mirrors demos/react/sonner.tsx story by story. */
@Component({
  selector: 'angular-sonner-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiButtonComponent, UiToasterComponent],
  template: `
    <div class="space-y-8">
      @if (ownsToaster) {
        <ui-toaster position="bottom-right" />
      }
      @switch (story) {
        @case ('Variants') {
          <div class="flex flex-wrap gap-2">
            <button ui-button variant="outline" (click)="toast('Event has been created.')">Default</button>
            <button ui-button variant="outline" (click)="toast.success('Saved successfully.')">Success</button>
            <button ui-button variant="outline" (click)="toast.info('Heads up!')">Info</button>
            <button ui-button variant="outline" (click)="toast.warning('Please review.')">Warning</button>
            <button ui-button variant="outline" (click)="toast.error('Failed to save.')">Error</button>
            <button
              ui-button
              variant="outline"
              (click)="toast('Settings updated', { description: 'Your preferences have been saved.' })"
            >
              With description
            </button>
          </div>
        }
        @case ('With action button') {
          <div class="flex flex-wrap gap-2">
            <button ui-button variant="outline" (click)="showWithAction()">Show with action</button>
            <button ui-button variant="outline" (click)="successWithAction()">Success with action</button>
          </div>
        }
        @case ('With dismiss button') {
          <div class="flex flex-wrap gap-2">
            <button
              ui-button
              variant="outline"
              (click)="toast('Tap the X to dismiss this toast manually.', { closeButton: true })"
            >
              With close button
            </button>
            <button
              ui-button
              variant="outline"
              (click)="
                toast.error('Something went wrong', {
                  description: 'Click the X to clear this manually.',
                  closeButton: true,
                })
              "
            >
              Error w/ close
            </button>
          </div>
        }
        @case ('Long-running with manual dismiss') {
          <div class="flex flex-wrap gap-2">
            <button ui-button variant="outline" (click)="sticky()">Sticky toast</button>
            <button ui-button variant="outline" (click)="loadingThenResolve()">Loading then resolve</button>
          </div>
        }
        @case ('Promise toast') {
          <div class="flex flex-wrap gap-2">
            <button ui-button variant="outline" (click)="promiseResolves()">Promise (resolves)</button>
            <button ui-button variant="outline" (click)="promiseRejects()">Promise (rejects)</button>
          </div>
        }
      }
    </div>
  `,
})
export class AngularSonnerDemoComponent implements OnDestroy {
  @Input() story = 'Variants'
  readonly toast = toast
  readonly ownsToaster = toasterOwner === null
  private readonly token = {}

  constructor() {
    if (this.ownsToaster) toasterOwner = this.token
  }

  showWithAction(): void {
    toast('Event has been created', {
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: { label: 'Undo', onClick: () => toast.success('Reverted') },
    })
  }

  successWithAction(): void {
    toast.success('Invitation sent', { action: { label: 'Resend', onClick: () => toast('Resending…') } })
  }

  sticky(): void {
    toast('Sticky notification', {
      description: 'This toast stays until you close it.',
      duration: Number.POSITIVE_INFINITY,
      closeButton: true,
    })
  }

  loadingThenResolve(): void {
    const id = toast.loading('Processing… this may take a while.')
    setTimeout(() => toast.success('Done!', { id }), 3000)
  }

  promiseResolves(): void {
    toast.promise(fakeAsync(1500), { loading: 'Saving…', success: 'Saved successfully', error: 'Failed to save' })
  }

  promiseRejects(): void {
    toast.promise(fakeAsync(1500, true), {
      loading: 'Uploading…',
      success: 'Upload complete',
      error: (err) => `Upload failed: ${(err as Error).message}`,
    })
  }

  ngOnDestroy(): void {
    if (toasterOwner === this.token) toasterOwner = null
  }
}
