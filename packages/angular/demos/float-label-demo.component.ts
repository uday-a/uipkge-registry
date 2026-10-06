import { Component, Input, signal } from '@angular/core'
import { UiFloatLabelComponent } from '../../../../../packages/registry-angular/components/float-label/float-label.component'
import { UiInputComponent } from '../../../../../packages/registry-angular/components/input/input.component'
import { UiTextareaComponent } from '../../../../../packages/registry-angular/components/textarea/textarea.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

/** Angular demo for the float-label page. Mirrors demos/react/float-label.tsx story by story. */
@Component({
  selector: 'angular-float-label-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiFloatLabelComponent,
    UiInputComponent,
    UiTextareaComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
    UiButtonComponent,
  ],
  template: `
    @switch (story) {
      @case ('Basic input') {
        <div class="max-w-md space-y-2">
          <ui-float-label label="Full Name" class="w-full">
            <ui-input [(value)]="nameValue" placeholder=" " class="h-11" />
          </ui-float-label>
          <p class="text-muted-foreground text-xs">Value: {{ nameValue() || 'empty' }}</p>
        </div>
      }
      @case ('Pre-filled & required') {
        <div class="max-w-md space-y-4">
          <ui-float-label label="Full Name" class="w-full">
            <ui-input [(value)]="preselectedValue" placeholder=" " class="h-11" />
          </ui-float-label>
          <ui-float-label label="Email" required class="w-full">
            <ui-input type="email" [(value)]="emailValue" placeholder=" " class="h-11" />
          </ui-float-label>
        </div>
      }
      @case ('Input types') {
        <div class="max-w-md space-y-4">
          <ui-float-label label="Email Address" required class="w-full">
            <ui-input type="email" placeholder=" " class="h-11" />
          </ui-float-label>
          <ui-float-label label="Age" class="w-full">
            <ui-input type="number" placeholder=" " class="h-11" />
          </ui-float-label>
          <ui-float-label label="Password" required class="w-full">
            <ui-input type="password" placeholder=" " class="h-11" />
          </ui-float-label>
          <ui-float-label label="Message" class="w-full">
            <ui-textarea [(value)]="messageValue" placeholder=" " class="min-h-24" />
          </ui-float-label>
        </div>
      }
      @case ('Disabled') {
        <div class="max-w-md">
          <ui-float-label label="Username" disabled class="w-full">
            <ui-input disabled placeholder=" " class="h-11" />
          </ui-float-label>
        </div>
      }
      @case ('Side by side') {
        <div class="flex max-w-md gap-4">
          <ui-float-label label="First Name" class="flex-1">
            <ui-input [(value)]="firstNameValue" placeholder=" " class="h-11" />
          </ui-float-label>
          <ui-float-label label="Last Name" class="flex-1">
            <ui-input [(value)]="lastNameValue" placeholder=" " class="h-11" />
          </ui-float-label>
        </div>
      }
      @case ('In context: Profile form') {
        <div ui-card class="max-w-md">
          <div ui-card-header>
            <h3 ui-card-title>Edit profile</h3>
            <p ui-card-description>Update your personal information below.</p>
          </div>
          <div ui-card-content class="space-y-4">
            <div class="flex gap-4">
              <ui-float-label label="First Name" class="flex-1">
                <ui-input [(value)]="profileName" placeholder=" " class="h-11" />
              </ui-float-label>
              <ui-float-label label="Last Name" class="flex-1">
                <ui-input placeholder=" " class="h-11" />
              </ui-float-label>
            </div>
            <ui-float-label label="Email" required class="w-full">
              <ui-input type="email" [(value)]="profileEmail" placeholder=" " class="h-11" />
            </ui-float-label>
            <ui-float-label label="Bio" class="w-full">
              <ui-textarea [(value)]="profileBio" placeholder=" " class="min-h-20" />
            </ui-float-label>
            <button ui-button class="w-full">Save changes</button>
          </div>
        </div>
      }
    }
  `,
})
export class AngularFloatLabelDemoComponent {
  @Input() story = 'Basic input'
  readonly nameValue = signal('')
  readonly emailValue = signal('')
  readonly preselectedValue = signal('John Doe')
  readonly messageValue = signal('')
  readonly firstNameValue = signal('')
  readonly lastNameValue = signal('')
  readonly profileName = signal('Jane Smith')
  readonly profileEmail = signal('jane.smith@example.com')
  readonly profileBio = signal('Product designer passionate about design systems.')
}
