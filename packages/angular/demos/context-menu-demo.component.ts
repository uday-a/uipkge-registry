import { Component, Input, signal } from '@angular/core'
import {
  UiContextMenuCheckboxItemComponent,
  UiContextMenuComponent,
  UiContextMenuContentComponent,
  UiContextMenuItemComponent,
  UiContextMenuLabelComponent,
  UiContextMenuRadioGroupComponent,
  UiContextMenuRadioItemComponent,
  UiContextMenuSeparatorComponent,
  UiContextMenuShortcutComponent,
  UiContextMenuSubComponent,
  UiContextMenuSubContentComponent,
  UiContextMenuSubTriggerComponent,
  UiContextMenuTriggerComponent,
} from '../../../../../packages/registry-angular/components/context-menu/context-menu.component'

/** Angular demo for the context-menu page. Mirrors demos/react/context-menu.tsx story by story. */
@Component({
  selector: 'angular-context-menu-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiContextMenuComponent,
    UiContextMenuTriggerComponent,
    UiContextMenuContentComponent,
    UiContextMenuItemComponent,
    UiContextMenuCheckboxItemComponent,
    UiContextMenuRadioGroupComponent,
    UiContextMenuRadioItemComponent,
    UiContextMenuLabelComponent,
    UiContextMenuSeparatorComponent,
    UiContextMenuShortcutComponent,
    UiContextMenuSubComponent,
    UiContextMenuSubTriggerComponent,
    UiContextMenuSubContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-context-menu>
          <ui-context-menu-trigger
            class="border-border bg-muted/30 grid h-32 w-72 place-items-center rounded-md border border-dashed text-sm"
            >Right-click here</ui-context-menu-trigger
          >
          <ui-context-menu-content class="w-48">
            <ui-context-menu-item>Back</ui-context-menu-item>
            <ui-context-menu-item>Forward</ui-context-menu-item>
            <ui-context-menu-item>Reload</ui-context-menu-item>
            <ui-context-menu-separator />
            <ui-context-menu-item>Inspect</ui-context-menu-item>
          </ui-context-menu-content>
        </ui-context-menu>
      }
      @case ('Checkbox items') {
        <ui-context-menu>
          <ui-context-menu-trigger
            class="border-border bg-muted/30 grid h-32 w-72 place-items-center rounded-md border border-dashed text-sm"
            >Right-click for view options</ui-context-menu-trigger
          >
          <ui-context-menu-content class="w-56">
            <ui-context-menu-label>View</ui-context-menu-label>
            <ui-context-menu-separator />
            <ui-context-menu-checkbox-item [checked]="showBookmarks()" (checkedChange)="showBookmarks.set($event)">
              Show Bookmarks Bar
            </ui-context-menu-checkbox-item>
            <ui-context-menu-checkbox-item [checked]="showFullUrls()" (checkedChange)="showFullUrls.set($event)">
              Show Full URLs
            </ui-context-menu-checkbox-item>
          </ui-context-menu-content>
        </ui-context-menu>
        <p class="text-muted-foreground mt-2 text-xs">
          Bookmarks: {{ showBookmarks() }} · Full URLs: {{ showFullUrls() }}
        </p>
      }
      @case ('Radio group') {
        <ui-context-menu>
          <ui-context-menu-trigger
            class="border-border bg-muted/30 grid h-32 w-72 place-items-center rounded-md border border-dashed text-sm"
            >Right-click to pick a person</ui-context-menu-trigger
          >
          <ui-context-menu-content class="w-56">
            <ui-context-menu-label>People</ui-context-menu-label>
            <ui-context-menu-separator />
            <ui-context-menu-radio-group [value]="person()" (valueChange)="person.set($event)">
              <ui-context-menu-radio-item value="pedro">Pedro Duarte</ui-context-menu-radio-item>
              <ui-context-menu-radio-item value="colm">Colm Tuite</ui-context-menu-radio-item>
              <ui-context-menu-radio-item value="benoit">Benoît Grélard</ui-context-menu-radio-item>
            </ui-context-menu-radio-group>
          </ui-context-menu-content>
        </ui-context-menu>
        <p class="text-muted-foreground mt-2 text-xs">Selected: {{ person() }}</p>
      }
      @case ('Submenu') {
        <ui-context-menu>
          <ui-context-menu-trigger
            class="border-border bg-muted/30 grid h-32 w-72 place-items-center rounded-md border border-dashed text-sm"
            >Right-click for share options</ui-context-menu-trigger
          >
          <ui-context-menu-content class="w-56">
            <ui-context-menu-item>Open</ui-context-menu-item>
            <ui-context-menu-item>Rename</ui-context-menu-item>
            <ui-context-menu-sub>
              <ui-context-menu-sub-trigger>Share</ui-context-menu-sub-trigger>
              <ui-context-menu-sub-content class="w-44">
                <ui-context-menu-item>Email link</ui-context-menu-item>
                <ui-context-menu-item>Copy link</ui-context-menu-item>
                <ui-context-menu-item>Slack</ui-context-menu-item>
              </ui-context-menu-sub-content>
            </ui-context-menu-sub>
            <ui-context-menu-separator />
            <ui-context-menu-item>Delete</ui-context-menu-item>
          </ui-context-menu-content>
        </ui-context-menu>
      }
      @case ('With shortcuts') {
        <ui-context-menu>
          <ui-context-menu-trigger
            class="border-border bg-muted/30 grid h-32 w-72 place-items-center rounded-md border border-dashed text-sm"
            >Right-click for shortcuts</ui-context-menu-trigger
          >
          <ui-context-menu-content class="w-56">
            <ui-context-menu-item>
              Back
              <ui-context-menu-shortcut>⌘[</ui-context-menu-shortcut>
            </ui-context-menu-item>
            <ui-context-menu-item>
              Forward
              <ui-context-menu-shortcut>⌘]</ui-context-menu-shortcut>
            </ui-context-menu-item>
            <ui-context-menu-item>
              Reload
              <ui-context-menu-shortcut>⌘R</ui-context-menu-shortcut>
            </ui-context-menu-item>
            <ui-context-menu-separator />
            <ui-context-menu-item>
              Print
              <ui-context-menu-shortcut>⌘P</ui-context-menu-shortcut>
            </ui-context-menu-item>
          </ui-context-menu-content>
        </ui-context-menu>
      }
      @case ('Disabled item') {
        <ui-context-menu>
          <ui-context-menu-trigger
            class="border-border bg-muted/30 grid h-32 w-72 place-items-center rounded-md border border-dashed text-sm"
            >Right-click here</ui-context-menu-trigger
          >
          <ui-context-menu-content class="w-48">
            <ui-context-menu-item>Cut</ui-context-menu-item>
            <ui-context-menu-item>Copy</ui-context-menu-item>
            <ui-context-menu-item disabled>Paste (clipboard empty)</ui-context-menu-item>
            <ui-context-menu-separator />
            <ui-context-menu-item disabled>Delete</ui-context-menu-item>
          </ui-context-menu-content>
        </ui-context-menu>
      }
    }
  `,
})
export class AngularContextMenuDemoComponent {
  @Input() story = 'Default'
  readonly showBookmarks = signal(true)
  readonly showFullUrls = signal(false)
  readonly person = signal('pedro')
}
