import { Component, Input } from '@angular/core'
import { UiDockComponent, type DockItem } from '../../../../../packages/registry-angular/components/dock/dock.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

const FOLDER_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-folder size-full"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 8 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>`
const MAIL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail size-full"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`
const CALENDAR_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar size-full"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`
const NOTES_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-file-text size-full"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`
const TERMINAL_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-terminal size-full"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`
const MUSIC_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-music size-full"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`
const SETTINGS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings size-full"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`

const SEARCH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search size-full"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`
const CAMERA_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-camera size-full"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`
const CHAT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle size-full"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>`
const CLOUD_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud size-full"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`

@Component({
  selector: 'dock-demo',
  standalone: true,
  imports: [
    UiDockComponent,
    UiCardComponent,
    UiCardContentComponent,
    UiCardDescriptionComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
  ],
  template: `
    @switch (story) {
      @case ('App launcher') {
        <div
          class="flex h-56 flex-col justify-between rounded-lg bg-gradient-to-b from-sky-100 to-indigo-200 p-6 dark:from-sky-950 dark:to-indigo-950"
        >
          <p class="text-sm text-slate-700 dark:text-slate-200">
            Active app: <span class="font-medium">{{ activeId }}</span>
          </p>
          <div class="flex justify-center">
            <ui-dock [items]="apps" />
          </div>
        </div>
      }
      @case ('In a desktop shell') {
        <div
          class="border-border/60 relative flex h-64 items-end justify-center overflow-hidden rounded-lg border bg-gradient-to-b from-zinc-800 to-zinc-950"
        >
          <div class="absolute top-4 left-4 text-sm font-medium text-white/90">My Desktop</div>
          <ui-dock [items]="apps" class="mb-3" />
        </div>
      }
      @case ('Click handlers') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>Quick tools</h3>
            <p ui-card-description>Click a dock icon to launch it.</p>
          </div>
          <div ui-card-content>
            <p class="text-muted-foreground text-sm">
              Last launched: <span class="text-foreground font-medium">{{ lastLaunched }}</span>
            </p>
          </div>
        </div>
        <div class="bg-muted/30 mt-4 flex items-end justify-center rounded-lg py-6">
          <ui-dock [items]="tools" />
        </div>
      }
      @case ('Magnification tuning') {
        <div class="grid gap-4">
          <div class="bg-muted/30 flex items-end justify-center rounded-lg py-6">
            <ui-dock [items]="apps" [baseSize]="36" />
          </div>
          <div class="border-border/60 bg-muted/40 flex items-end justify-center rounded-lg border py-6">
            <ui-dock [items]="apps" [magnification]="2" [distance]="150" />
          </div>
        </div>
      }
      @case ('Custom styling') {
        <div class="flex items-end justify-center rounded-lg bg-zinc-900 py-6">
          <ui-dock [items]="apps" class="border-zinc-700 bg-zinc-800/80 text-zinc-100" />
        </div>
      }
      @case ('Tooltips off') {
        <div class="bg-muted/30 flex items-end justify-center rounded-lg py-6">
          <ui-dock [items]="apps" [showTooltips]="false" />
        </div>
      }
    }
  `,
})
export class DockDemoComponent {
  @Input() story = 'App launcher'

  activeId = 'finder'
  lastLaunched = '—'

  apps: DockItem[] = [
    { id: 'finder', label: 'Finder', icon: FOLDER_ICON, active: true, handler: () => (this.activeId = 'finder') },
    { id: 'mail', label: 'Mail', icon: MAIL_ICON, handler: () => (this.activeId = 'mail') },
    { id: 'calendar', label: 'Calendar', icon: CALENDAR_ICON, handler: () => (this.activeId = 'calendar') },
    { id: 'notes', label: 'Notes', icon: NOTES_ICON, handler: () => (this.activeId = 'notes') },
    { id: 'terminal', label: 'Terminal', icon: TERMINAL_ICON, handler: () => (this.activeId = 'terminal') },
    { id: 'music', label: 'Music', icon: MUSIC_ICON, handler: () => (this.activeId = 'music') },
    { id: 'settings', label: 'Settings', icon: SETTINGS_ICON, handler: () => (this.activeId = 'settings') },
  ]

  tools: DockItem[] = [
    { id: 'search', label: 'Search', icon: SEARCH_ICON, handler: () => (this.lastLaunched = 'Search') },
    { id: 'camera', label: 'Camera', icon: CAMERA_ICON, handler: () => (this.lastLaunched = 'Camera') },
    { id: 'chat', label: 'Messages', icon: CHAT_ICON, handler: () => (this.lastLaunched = 'Messages') },
    { id: 'cloud', label: 'Cloud', icon: CLOUD_ICON, handler: () => (this.lastLaunched = 'Cloud') },
  ]
}
