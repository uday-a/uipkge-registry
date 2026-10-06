import { Component, Input } from '@angular/core'
import { UiEmptyStateComponent } from '../../../../../packages/registry-angular/components/empty-state/empty-state.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

/** Angular demo for the empty-state page. Mirrors demos/react/empty-state.tsx story by story. */
@Component({
  selector: 'angular-empty-state-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiEmptyStateComponent, UiButtonComponent],
  template: `
    <ng-template #inbox
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-inbox"
        aria-hidden="true"
      >
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path
          d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
        /></svg
    ></ng-template>
    <ng-template #fileX
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-file-x-corner lucide-file-x-2"
        aria-hidden="true"
      >
        <path d="M11 22H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.706.706l3.588 3.588A2.4 2.4 0 0 1 20 8v5" />
        <path d="M14 2v5a1 1 0 0 0 1 1h5" />
        <path d="m15 17 5 5" />
        <path d="m20 17-5 5" /></svg
    ></ng-template>
    <ng-template #serverCrash
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-server-crash"
        aria-hidden="true"
      >
        <path d="M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
        <path d="M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2" />
        <path d="M6 6h.01" />
        <path d="M6 18h.01" />
        <path d="m13 6-4 6h6l-4 6" /></svg
    ></ng-template>
    <ng-template #search
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-search"
        aria-hidden="true"
      >
        <path d="m21 21-4.34-4.34" />
        <circle cx="11" cy="11" r="8" /></svg
    ></ng-template>
    @switch (story) {
      @case ('Default') {
        <ui-empty-state
          title="No messages"
          description="When you receive new messages, they'll appear here."
          [icon]="inbox"
        >
          <button ui-button class="mt-4">
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
              class="lucide lucide-plus"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            New message
          </button>
        </ui-empty-state>
      }
      @case ('Without action') {
        <ui-empty-state
          title="Nothing scheduled"
          description="You have no upcoming events on your calendar."
          [icon]="inbox"
        />
      }
      @case ('With multiple actions') {
        <ui-empty-state
          title="Project is empty"
          description="Get started by creating a new file or importing existing data."
          [icon]="fileX"
        >
          <div class="mt-4 flex flex-wrap justify-center gap-2">
            <button ui-button>
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
                class="lucide lucide-plus"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              New file
            </button>
            <button ui-button variant="outline">
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
                class="lucide lucide-upload"
                aria-hidden="true"
              >
                <path d="M12 3v12" />
                <path d="m17 8-5-5-5 5" />
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              </svg>
              Import
            </button>
          </div>
        </ui-empty-state>
      }
      @case ('Different scenarios') {
        <div class="grid gap-6 md:grid-cols-3">
          <ui-empty-state
            class="rounded-lg border border-dashed py-8"
            title="No data yet"
            description="Records will show up here once created."
            [icon]="inbox"
          />
          <ui-empty-state
            class="rounded-lg border border-dashed py-8"
            title="Something went wrong"
            description="We couldn't load this resource. Try again."
            [icon]="serverCrash"
          >
            <button ui-button variant="outline" size="sm" class="mt-4">Retry</button>
          </ui-empty-state>
          <ui-empty-state
            class="rounded-lg border border-dashed py-8"
            title="No matches"
            description="No results match your current filters."
            [icon]="search"
          >
            <button ui-button variant="ghost" size="sm" class="mt-4">Clear filters</button>
          </ui-empty-state>
        </div>
      }
    }
  `,
})
export class AngularEmptyStateDemoComponent {
  @Input() story = 'Default'
}
