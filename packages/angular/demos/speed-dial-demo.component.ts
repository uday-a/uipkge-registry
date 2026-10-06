import { Component, Input, OnInit, TemplateRef, ViewChild, signal } from '@angular/core'
import {
  UiSpeedDialComponent,
  type SpeedDialAction,
} from '../../../../../packages/registry-angular/components/speed-dial/speed-dial.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

/** Angular demo for the speed-dial page. Mirrors demos/react/speed-dial.tsx story by story. */
@Component({
  selector: 'angular-speed-dial-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiSpeedDialComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  template: `
    <ng-template #fileTextIcon
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
        class="lucide lucide-file-text"
        aria-hidden="true"
      >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" /></svg
    ></ng-template>
    <ng-template #imageIcon
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
        class="lucide lucide-image"
        aria-hidden="true"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg
    ></ng-template>
    <ng-template #notebookIcon
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
        class="lucide lucide-notebook"
        aria-hidden="true"
      >
        <path d="M2 6h4" />
        <path d="M2 10h4" />
        <path d="M2 14h4" />
        <path d="M2 18h4" />
        <rect width="16" height="20" x="4" y="2" rx="2" />
        <path d="M16 2v20" /></svg
    ></ng-template>
    <ng-template #mailIcon
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
        class="lucide lucide-mail"
        aria-hidden="true"
      >
        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
        <rect x="2" y="4" width="20" height="16" rx="2" /></svg
    ></ng-template>
    <ng-template #messageSquareIcon
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
        class="lucide lucide-message-square"
        aria-hidden="true"
      >
        <path
          d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"
        /></svg
    ></ng-template>
    <ng-template #share2Icon
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
        class="lucide lucide-share-2"
        aria-hidden="true"
      >
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
        <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg
    ></ng-template>
    <ng-template #cameraIcon
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
        class="lucide lucide-camera"
        aria-hidden="true"
      >
        <path
          d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"
        />
        <circle cx="12" cy="13" r="3" /></svg
    ></ng-template>
    <ng-template #videoIcon
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
        class="lucide lucide-video"
        aria-hidden="true"
      >
        <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
        <rect x="2" y="6" width="14" height="12" rx="2" /></svg
    ></ng-template>
    <ng-template #micIcon
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
        class="lucide lucide-mic"
        aria-hidden="true"
      >
        <path d="M12 19v3" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <rect x="9" y="2" width="6" height="13" rx="3" /></svg
    ></ng-template>
    <ng-template #mapPinIcon
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
        class="lucide lucide-map-pin"
        aria-hidden="true"
      >
        <path
          d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
        />
        <circle cx="12" cy="10" r="3" /></svg
    ></ng-template>
    <ng-template #paperclipIcon
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
        class="lucide lucide-paperclip"
        aria-hidden="true"
      >
        <path
          d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"
        /></svg
    ></ng-template>
    <ng-template #sendIcon
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
        class="lucide lucide-send"
        aria-hidden="true"
      >
        <path
          d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
        />
        <path d="m21.854 2.147-10.94 10.939" /></svg
    ></ng-template>
    <ng-template #plusIcon
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
        class="lucide lucide-plus"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" /></svg
    ></ng-template>
    @switch (story) {
      @case ('Compose menu (click)') {
        <div class="flex h-56 items-end gap-8">
          <ui-speed-dial [actions]="composeActions" position="inline" label="Create" />
          <div class="text-muted-foreground text-xs">
            <p class="mb-1 font-medium">Recent:</p>
            @for (entry of log(); track entry) {
              <p>{{ entry }}</p>
            }
            @if (log().length === 0) {
              <p>No actions yet.</p>
            }
          </div>
        </div>
      }
      @case ('Share menu (hover)') {
        <div class="flex h-56 items-end">
          <ui-speed-dial [actions]="shareActions" trigger="hover" position="inline" label="Share" />
        </div>
      }
      @case ('In a card') {
        <ui-card class="relative max-w-md overflow-hidden">
          <ui-card-header>
            <ui-card-title>New capture</ui-card-title>
            <ui-card-description>Choose how you'd like to start recording.</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <div class="bg-muted/30 text-muted-foreground flex h-32 items-center justify-center rounded-md text-sm">
              Preview area
            </div>
          </ui-card-content>
          <ui-speed-dial [actions]="mediaActions" absolute position="bottom-right" label="Capture" />
        </ui-card>
      }
      @case ('Directions') {
        <div class="flex h-64 items-center justify-around gap-8">
          <ui-speed-dial [actions]="mediaActions" direction="up" position="inline" label="Up" />
          <ui-speed-dial [actions]="mediaActions" direction="down" position="inline" label="Down" />
          <ui-speed-dial [actions]="mediaActions" direction="left" position="inline" label="Left" />
          <ui-speed-dial [actions]="mediaActions" direction="right" position="inline" label="Right" />
        </div>
      }
      @case ('Variants & custom icon') {
        <div class="flex h-56 items-end gap-6">
          <ui-speed-dial [actions]="composeActions" variant="default" position="inline" label="Default" />
          <ui-speed-dial [actions]="composeActions" variant="secondary" position="inline" label="Secondary" />
          <ui-speed-dial
            [actions]="composeActions"
            variant="outline"
            [icon]="plusIcon"
            position="inline"
            label="Outline"
          />
        </div>
      }
      @case ('Disabled action & keep-open') {
        <div class="flex h-56 items-end gap-8">
          <ui-speed-dial [actions]="attachActions" position="inline" label="Attach" />
          <ui-speed-dial [actions]="composeActions" [closeOnAction]="false" position="inline" label="Keep open" />
        </div>
      }
      @case ('Fixed to viewport') {
        <p class="text-muted-foreground max-w-md text-sm">
          The dial in the corner is live and stays anchored as you scroll.
        </p>
        <ui-speed-dial [actions]="composeActions" label="Create" />
      }
    }
  `,
})
export class AngularSpeedDialDemoComponent implements OnInit {
  @Input() story = 'Compose menu (click)'
  @ViewChild('fileTextIcon', { static: true }) fileTextIcon!: TemplateRef<unknown>
  @ViewChild('imageIcon', { static: true }) imageIcon!: TemplateRef<unknown>
  @ViewChild('notebookIcon', { static: true }) notebookIcon!: TemplateRef<unknown>
  @ViewChild('mailIcon', { static: true }) mailIcon!: TemplateRef<unknown>
  @ViewChild('messageSquareIcon', { static: true }) messageSquareIcon!: TemplateRef<unknown>
  @ViewChild('share2Icon', { static: true }) share2Icon!: TemplateRef<unknown>
  @ViewChild('cameraIcon', { static: true }) cameraIcon!: TemplateRef<unknown>
  @ViewChild('videoIcon', { static: true }) videoIcon!: TemplateRef<unknown>
  @ViewChild('micIcon', { static: true }) micIcon!: TemplateRef<unknown>
  @ViewChild('mapPinIcon', { static: true }) mapPinIcon!: TemplateRef<unknown>
  @ViewChild('paperclipIcon', { static: true }) paperclipIcon!: TemplateRef<unknown>
  @ViewChild('sendIcon', { static: true }) sendIcon!: TemplateRef<unknown>
  @ViewChild('plusIcon', { static: true }) plusIcon!: TemplateRef<unknown>

  readonly log = signal<string[]>([])
  composeActions: SpeedDialAction[] = []
  shareActions: SpeedDialAction[] = []
  mediaActions: SpeedDialAction[] = []
  attachActions: SpeedDialAction[] = []

  push(entry: string): void {
    this.log.update((prev) => [entry, ...prev].slice(0, 4))
  }

  ngOnInit(): void {
    const act = (icon: TemplateRef<unknown>, label: string, extra: Partial<SpeedDialAction> = {}): SpeedDialAction => ({
      icon,
      label,
      handler: () => this.push(label),
      ...extra,
    })
    this.composeActions = [
      act(this.fileTextIcon, 'New document'),
      act(this.imageIcon, 'New image'),
      act(this.notebookIcon, 'New notebook'),
    ]
    this.shareActions = [
      act(this.mailIcon, 'Email'),
      act(this.messageSquareIcon, 'Message'),
      act(this.share2Icon, 'Copy link'),
    ]
    this.mediaActions = [
      act(this.cameraIcon, 'Camera'),
      act(this.videoIcon, 'Video'),
      act(this.micIcon, 'Audio'),
      act(this.mapPinIcon, 'Location'),
    ]
    this.attachActions = [act(this.paperclipIcon, 'Attach file'), act(this.sendIcon, 'Send now', { disabled: true })]
  }
}
