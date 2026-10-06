import { Component, Input } from '@angular/core'
import {
  UiAvatarComponent,
  UiAvatarFallbackComponent,
  UiAvatarGroupComponent,
  UiAvatarImageComponent,
} from '../../../../../packages/registry-angular/components/avatar/avatar.component'

/** Angular demo for the avatar page. Mirrors demos/react/avatar.tsx story by story. */
@Component({
  selector: 'angular-avatar-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiAvatarComponent, UiAvatarFallbackComponent, UiAvatarImageComponent, UiAvatarGroupComponent],
  template: `
    @switch (story) {
      @case ('Sizes') {
        <div class="flex items-end gap-4">
          <ui-avatar class="size-6"><ui-avatar-fallback class="text-xs">XS</ui-avatar-fallback></ui-avatar>
          <ui-avatar class="size-8"><ui-avatar-fallback class="text-xs">SM</ui-avatar-fallback></ui-avatar>
          <ui-avatar class="size-10"><ui-avatar-fallback>MD</ui-avatar-fallback></ui-avatar>
          <ui-avatar class="size-12"><ui-avatar-fallback>LG</ui-avatar-fallback></ui-avatar>
          <ui-avatar class="size-16"><ui-avatar-fallback>XL</ui-avatar-fallback></ui-avatar>
          <ui-avatar class="size-20"><ui-avatar-fallback>2XL</ui-avatar-fallback></ui-avatar>
        </div>
      }
      @case ('Stack') {
        <div class="flex -space-x-2">
          <ui-avatar class="ring-background size-8 ring-2"><ui-avatar-fallback>AD</ui-avatar-fallback></ui-avatar>
          <ui-avatar class="ring-background size-8 ring-2"><ui-avatar-fallback>RM</ui-avatar-fallback></ui-avatar>
          <ui-avatar class="ring-background size-8 ring-2"><ui-avatar-fallback>PK</ui-avatar-fallback></ui-avatar>
          <ui-avatar class="ring-background size-8 ring-2"><ui-avatar-fallback>+5</ui-avatar-fallback></ui-avatar>
        </div>
      }
      @case ('Avatar group') {
        <div class="space-y-3">
          <ui-avatar-group [max]="3" size="default">
            <ui-avatar class="ring-background size-8 ring-2"><ui-avatar-fallback>AD</ui-avatar-fallback></ui-avatar>
            <ui-avatar class="ring-background size-8 ring-2"><ui-avatar-fallback>RM</ui-avatar-fallback></ui-avatar>
            <ui-avatar class="ring-background size-8 ring-2"><ui-avatar-fallback>PK</ui-avatar-fallback></ui-avatar>
            <ui-avatar class="ring-background size-8 ring-2"><ui-avatar-fallback>JS</ui-avatar-fallback></ui-avatar>
            <ui-avatar class="ring-background size-8 ring-2"><ui-avatar-fallback>LO</ui-avatar-fallback></ui-avatar>
          </ui-avatar-group>

          <ui-avatar-group [overlap]="false">
            <ui-avatar class="size-8"><ui-avatar-fallback>AD</ui-avatar-fallback></ui-avatar>
            <ui-avatar class="size-8"><ui-avatar-fallback>RM</ui-avatar-fallback></ui-avatar>
            <ui-avatar class="size-8"><ui-avatar-fallback>PK</ui-avatar-fallback></ui-avatar>
          </ui-avatar-group>
        </div>
      }
      @case ('With image (broken → fallback)') {
        <ui-avatar class="size-12">
          <ui-avatar-image src="https://broken-url.example/img.jpg" alt="user" />
          <ui-avatar-fallback>UI</ui-avatar-fallback>
        </ui-avatar>
      }
    }
  `,
})
export class AngularAvatarDemoComponent {
  @Input() story = 'Sizes'
}
