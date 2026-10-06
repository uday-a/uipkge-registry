import { Component, Input, signal } from '@angular/core'
import {
  UiAlertModalComponent,
  UiAlertModalTriggerDirective,
} from '../../../../../packages/registry-angular/components/alert-modal/alert-modal.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

/** Angular demo for the alert-modal page. Mirrors demos/react/alert-modal.tsx story by story. */
@Component({
  selector: 'angular-alert-modal-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiAlertModalComponent, UiAlertModalTriggerDirective, UiButtonComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-alert-modal
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
          actionLabel="Continue"
        >
          <button ui-button variant="outline" ui-alert-modal-trigger>Show alert modal</button>
        </ui-alert-modal>
      }
      @case ('Destructive tone') {
        <ui-alert-modal
          [open]="open1()"
          (openChange)="open1.set($event)"
          title="Delete project?"
          description="This permanently deletes the project and every file inside it. There is no recovery."
          tone="destructive"
          icon="error"
          actionLabel="Delete project"
          (action)="open1.set(false)"
        >
          <button ui-button variant="destructive" ui-alert-modal-trigger>
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
              class="lucide lucide-trash-2 size-4"
              aria-hidden="true"
            >
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M3 6h18" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete project
          </button>
        </ui-alert-modal>
      }
      @case ('Tone variants') {
        <div class="flex flex-wrap gap-2">
          <ui-alert-modal
            title="Heads up"
            description="Read this before proceeding."
            tone="default"
            icon="info"
            actionLabel="Got it"
            [cancelLabel]="null"
          >
            <button ui-button variant="outline" ui-alert-modal-trigger>Info</button>
          </ui-alert-modal>
          <ui-alert-modal
            title="Saved"
            description="Your changes have been saved successfully."
            tone="success"
            icon="success"
            actionLabel="Done"
            [cancelLabel]="null"
          >
            <button ui-button variant="outline" ui-alert-modal-trigger>Success</button>
          </ui-alert-modal>
          <ui-alert-modal
            title="Heads up"
            description="This will overwrite the existing config."
            tone="warning"
            icon="warning"
            actionLabel="Overwrite"
          >
            <button ui-button variant="outline" ui-alert-modal-trigger>Warning</button>
          </ui-alert-modal>
          <ui-alert-modal
            title="Cannot continue"
            description="Your session has expired. Please sign in again."
            tone="destructive"
            icon="error"
            actionLabel="Sign in"
            [cancelLabel]="null"
          >
            <button ui-button variant="outline" ui-alert-modal-trigger>Error</button>
          </ui-alert-modal>
        </div>
      }
      @case ('Async action with loading') {
        <ui-alert-modal
          [open]="deleteOpen()"
          (openChange)="deleteOpen.set($event)"
          title="Delete 24 files?"
          description="This permanently removes the selected items."
          tone="destructive"
          icon="error"
          actionLabel="Delete"
          [loading]="deleting()"
          (action)="handleDelete()"
        >
          <button ui-button variant="destructive" ui-alert-modal-trigger>Delete 24 files…</button>
        </ui-alert-modal>
      }
      @case ('Controlled (no trigger)') {
        <div class="flex items-center gap-3">
          <button ui-button variant="outline" (click)="externalOpen.set(true)">Open externally</button>
          <ui-alert-modal
            [open]="externalOpen()"
            (openChange)="externalOpen.set($event)"
            title="Continue without saving?"
            description="You have unsaved changes that will be lost."
            actionLabel="Discard"
            tone="destructive"
            (action)="externalOpen.set(false)"
          />
          <span class="text-muted-foreground text-xs">open = {{ externalOpen() }}</span>
        </div>
      }
      @case ('Slot escape hatch') {
        <ui-alert-modal
          [open]="slotsOpen()"
          (openChange)="slotsOpen.set($event)"
          title="Cancel subscription"
          description="Your plan stays active until the end of the current period."
          icon="warning"
          tone="warning"
          [actions]="slotActions"
        >
          <button ui-button variant="outline" ui-alert-modal-trigger>Cancel subscription</button>
          <ul class="text-muted-foreground my-2 list-disc space-y-1 pl-4 text-sm">
            <li>Your data is preserved for 90 days.</li>
            <li>You can resubscribe anytime.</li>
            <li>Pro perks remain until Dec 31, 2026.</li>
          </ul>
        </ui-alert-modal>
        <ng-template #slotActions>
          <button ui-button variant="outline" (click)="slotsOpen.set(false)">Stay on plan</button>
          <button ui-button variant="ghost" (click)="slotsOpen.set(false)">Downgrade to Free</button>
          <button ui-button variant="destructive" (click)="slotsOpen.set(false)">Cancel anyway</button>
        </ng-template>
      }
    }
  `,
})
export class AngularAlertModalDemoComponent {
  @Input() story = 'Default'
  readonly open1 = signal(false)
  readonly externalOpen = signal(false)
  readonly deleting = signal(false)
  readonly deleteOpen = signal(false)
  readonly slotsOpen = signal(false)

  async handleDelete(): Promise<void> {
    this.deleting.set(true)
    await new Promise((r) => setTimeout(r, 1200))
    this.deleting.set(false)
    this.deleteOpen.set(false)
  }
}
