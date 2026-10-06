import { Component, Input, signal } from '@angular/core'
import {
  UiMenubarCheckboxItemComponent,
  UiMenubarComponent,
  UiMenubarContentComponent,
  UiMenubarItemComponent,
  UiMenubarLabelComponent,
  UiMenubarMenuComponent,
  UiMenubarRadioGroupComponent,
  UiMenubarRadioItemComponent,
  UiMenubarSeparatorComponent,
  UiMenubarShortcutComponent,
  UiMenubarSubComponent,
  UiMenubarSubContentComponent,
  UiMenubarSubTriggerComponent,
  UiMenubarTriggerComponent,
} from '../../../../../packages/registry-angular/components/menubar/menubar.component'

/** Angular demo for the menubar page. Mirrors demos/react/menubar.tsx story by story. */
@Component({
  selector: 'angular-menubar-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiMenubarComponent,
    UiMenubarMenuComponent,
    UiMenubarTriggerComponent,
    UiMenubarContentComponent,
    UiMenubarItemComponent,
    UiMenubarCheckboxItemComponent,
    UiMenubarRadioGroupComponent,
    UiMenubarRadioItemComponent,
    UiMenubarLabelComponent,
    UiMenubarSeparatorComponent,
    UiMenubarShortcutComponent,
    UiMenubarSubComponent,
    UiMenubarSubTriggerComponent,
    UiMenubarSubContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-menubar class="max-w-md">
          <ui-menubar-menu>
            <button ui-menubar-trigger>File</button>
            <ui-menubar-content>
              <ui-menubar-item>New Tab <ui-menubar-shortcut>⌘T</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-item>New Window <ui-menubar-shortcut>⌘N</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-separator />
              <ui-menubar-item>Print… <ui-menubar-shortcut>⌘P</ui-menubar-shortcut></ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>
          <ui-menubar-menu>
            <button ui-menubar-trigger>Edit</button>
            <ui-menubar-content>
              <ui-menubar-item>Undo <ui-menubar-shortcut>⌘Z</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-item>Redo <ui-menubar-shortcut>⇧⌘Z</ui-menubar-shortcut></ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>
          <ui-menubar-menu>
            <button ui-menubar-trigger>View</button>
            <ui-menubar-content>
              <ui-menubar-item>Reload <ui-menubar-shortcut>⌘R</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-item>Toggle Fullscreen</ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>
        </ui-menubar>
      }
      @case ('With checkbox items') {
        <ui-menubar class="max-w-md">
          <ui-menubar-menu>
            <button ui-menubar-trigger>View</button>
            <ui-menubar-content>
              <ui-menubar-label>Appearance</ui-menubar-label>
              <ui-menubar-separator />
              <ui-menubar-checkbox-item [checked]="showBookmarks()" (checkedChange)="showBookmarks.set($event)"
                >Always Show Bookmarks Bar</ui-menubar-checkbox-item
              >
              <ui-menubar-checkbox-item [checked]="showFullUrls()" (checkedChange)="showFullUrls.set($event)"
                >Always Show Full URLs</ui-menubar-checkbox-item
              >
            </ui-menubar-content>
          </ui-menubar-menu>
        </ui-menubar>
        <p class="text-muted-foreground mt-2 text-xs">
          Bookmarks: {{ showBookmarks() ? 'on' : 'off' }} · Full URLs: {{ showFullUrls() ? 'on' : 'off' }}
        </p>
      }
      @case ('With radio group') {
        <ui-menubar class="max-w-md">
          <ui-menubar-menu>
            <button ui-menubar-trigger>Profile</button>
            <ui-menubar-content>
              <ui-menubar-label>People</ui-menubar-label>
              <ui-menubar-separator />
              <ui-menubar-radio-group [value]="profile()" (valueChange)="profile.set($event)">
                <ui-menubar-radio-item value="andy">Andy</ui-menubar-radio-item>
                <ui-menubar-radio-item value="benoit">Benoit</ui-menubar-radio-item>
                <ui-menubar-radio-item value="luis">Luis</ui-menubar-radio-item>
              </ui-menubar-radio-group>
            </ui-menubar-content>
          </ui-menubar-menu>
        </ui-menubar>
        <p class="text-muted-foreground mt-2 text-xs">Selected: {{ profile() }}</p>
      }
      @case ('With submenu') {
        <ui-menubar class="max-w-md">
          <ui-menubar-menu>
            <button ui-menubar-trigger>Share</button>
            <ui-menubar-content>
              <ui-menubar-item>Email link</ui-menubar-item>
              <ui-menubar-item>Copy link</ui-menubar-item>
              <ui-menubar-sub>
                <ui-menubar-sub-trigger>Send to…</ui-menubar-sub-trigger>
                <ui-menubar-sub-content>
                  <ui-menubar-item>Slack</ui-menubar-item>
                  <ui-menubar-item>Discord</ui-menubar-item>
                  <ui-menubar-item>WhatsApp</ui-menubar-item>
                  <ui-menubar-separator />
                  <ui-menubar-item>More apps…</ui-menubar-item>
                </ui-menubar-sub-content>
              </ui-menubar-sub>
              <ui-menubar-separator />
              <ui-menubar-item>Print</ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>
        </ui-menubar>
      }
      @case ('With shortcuts') {
        <ui-menubar class="max-w-md">
          <ui-menubar-menu>
            <button ui-menubar-trigger>Edit</button>
            <ui-menubar-content>
              <ui-menubar-item>Cut <ui-menubar-shortcut>⌘X</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-item>Copy <ui-menubar-shortcut>⌘C</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-item>Paste <ui-menubar-shortcut>⌘V</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-separator />
              <ui-menubar-item>Find… <ui-menubar-shortcut>⌘F</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-item>Find Next <ui-menubar-shortcut>⌘G</ui-menubar-shortcut></ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>
        </ui-menubar>
      }
      @case ('Full app menubar') {
        <ui-menubar>
          <ui-menubar-menu>
            <button ui-menubar-trigger>File</button>
            <ui-menubar-content>
              <ui-menubar-item>New <ui-menubar-shortcut>⌘N</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-item>Open… <ui-menubar-shortcut>⌘O</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-sub>
                <ui-menubar-sub-trigger>Open Recent</ui-menubar-sub-trigger>
                <ui-menubar-sub-content>
                  <ui-menubar-item>project-alpha.md</ui-menubar-item>
                  <ui-menubar-item>roadmap.md</ui-menubar-item>
                  <ui-menubar-item>notes.md</ui-menubar-item>
                </ui-menubar-sub-content>
              </ui-menubar-sub>
              <ui-menubar-separator />
              <ui-menubar-item>Save <ui-menubar-shortcut>⌘S</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-item>Save As… <ui-menubar-shortcut>⇧⌘S</ui-menubar-shortcut></ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>
          <ui-menubar-menu>
            <button ui-menubar-trigger>Edit</button>
            <ui-menubar-content>
              <ui-menubar-item>Undo <ui-menubar-shortcut>⌘Z</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-item>Redo <ui-menubar-shortcut>⇧⌘Z</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-separator />
              <ui-menubar-item>Cut <ui-menubar-shortcut>⌘X</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-item>Copy <ui-menubar-shortcut>⌘C</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-item>Paste <ui-menubar-shortcut>⌘V</ui-menubar-shortcut></ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>
          <ui-menubar-menu>
            <button ui-menubar-trigger>View</button>
            <ui-menubar-content>
              <ui-menubar-checkbox-item [checked]="showBookmarks()" (checkedChange)="showBookmarks.set($event)"
                >Bookmarks bar</ui-menubar-checkbox-item
              >
              <ui-menubar-checkbox-item [checked]="showFullUrls()" (checkedChange)="showFullUrls.set($event)"
                >Full URLs</ui-menubar-checkbox-item
              >
              <ui-menubar-separator />
              <ui-menubar-item>Reload <ui-menubar-shortcut>⌘R</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-item>Force Reload <ui-menubar-shortcut>⇧⌘R</ui-menubar-shortcut></ui-menubar-item>
              <ui-menubar-separator />
              <ui-menubar-item>Toggle Fullscreen</ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>
          <ui-menubar-menu>
            <button ui-menubar-trigger>Profiles</button>
            <ui-menubar-content>
              <ui-menubar-radio-group [value]="profile()" (valueChange)="profile.set($event)">
                <ui-menubar-radio-item value="andy">Andy</ui-menubar-radio-item>
                <ui-menubar-radio-item value="benoit">Benoit</ui-menubar-radio-item>
                <ui-menubar-radio-item value="luis">Luis</ui-menubar-radio-item>
              </ui-menubar-radio-group>
              <ui-menubar-separator />
              <ui-menubar-item>Edit…</ui-menubar-item>
              <ui-menubar-item>Add Profile…</ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>
          <ui-menubar-menu>
            <button ui-menubar-trigger>Help</button>
            <ui-menubar-content>
              <ui-menubar-item>Documentation</ui-menubar-item>
              <ui-menubar-item>Release Notes</ui-menubar-item>
              <ui-menubar-separator />
              <ui-menubar-item>About</ui-menubar-item>
            </ui-menubar-content>
          </ui-menubar-menu>
        </ui-menubar>
      }
    }
  `,
})
export class AngularMenubarDemoComponent {
  @Input() story = 'Default'
  readonly showBookmarks = signal(true)
  readonly showFullUrls = signal(false)
  readonly profile = signal('benoit')
}
