import { Component, Input } from '@angular/core'
import { UiSwitchComponent } from '../../../../../packages/registry-angular/components/switch/switch.component'
import { UiLabelComponent } from '../../../../../packages/registry-angular/components/label/label.component'

/** Angular demo for the switch page. Mirrors demos/react/switch.tsx story by story. */
@Component({
  selector: 'angular-switch-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiSwitchComponent, UiLabelComponent],
  template: `
    <ng-template #check
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
        class="lucide lucide-check size-3"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" /></svg
    ></ng-template>
    <ng-template #x
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
        class="lucide lucide-x size-3"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" /></svg
    ></ng-template>
    <ng-template #checkLg
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
        class="lucide lucide-check size-3.5"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" /></svg
    ></ng-template>
    <ng-template #xLg
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
        class="lucide lucide-x size-3.5"
        aria-hidden="true"
      >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" /></svg
    ></ng-template>
    @switch (story) {
      @case ('Default') {
        <div class="flex items-center gap-2">
          <button ui-switch id="airplane" [(checked)]="enabled"></button>
          <label ui-label for="airplane">Airplane mode {{ enabled ? '(on)' : '(off)' }}</label>
        </div>
      }
      @case ('States') {
        <div class="space-y-3">
          <div class="flex items-center gap-2">
            <button ui-switch id="s1" defaultChecked></button>
            <label ui-label for="s1">Default on</label>
          </div>
          <div class="flex items-center gap-2">
            <button ui-switch id="s2"></button>
            <label ui-label for="s2">Default off</label>
          </div>
          <div class="flex items-center gap-2">
            <button ui-switch id="s3" disabled></button>
            <label ui-label for="s3" class="text-muted-foreground">Disabled</label>
          </div>
          <div class="flex items-center gap-2">
            <button ui-switch id="s4" defaultChecked disabled></button>
            <label ui-label for="s4" class="text-muted-foreground">Disabled on</label>
          </div>
        </div>
      }
      @case ('With text') {
        <div class="flex flex-wrap items-center gap-4">
          <button ui-switch checkedChildren="ON" unCheckedChildren="OFF" defaultChecked></button>
          <button ui-switch checkedChildren="ON" unCheckedChildren="OFF"></button>
          <button ui-switch checkedChildren="Yes" unCheckedChildren="No" size="lg" defaultChecked></button>
          <button ui-switch checkedChildren="Yes" unCheckedChildren="No" size="lg"></button>
        </div>
      }
      @case ('With icons') {
        <div class="flex flex-wrap items-center gap-4">
          <button ui-switch defaultChecked [checkedChildren]="check" [unCheckedChildren]="x"></button>
          <button ui-switch [checkedChildren]="check" [unCheckedChildren]="x"></button>
          <button ui-switch size="lg" defaultChecked [checkedChildren]="checkLg" [unCheckedChildren]="xLg"></button>
        </div>
      }
      @case ('Loading') {
        <div class="flex flex-wrap items-center gap-4">
          <button ui-switch loading defaultChecked></button>
          <button ui-switch loading></button>
          <button ui-switch loading size="lg" defaultChecked></button>
          <button ui-switch loading size="lg" checkedChildren="ON" unCheckedChildren="OFF" defaultChecked></button>
        </div>
      }
      @case ('Sizes') {
        <div class="space-y-3">
          <div class="flex flex-wrap items-center gap-4">
            <button ui-switch size="sm" defaultChecked></button>
            <button ui-switch size="default" defaultChecked></button>
            <button ui-switch size="lg" defaultChecked></button>
          </div>
          <div class="flex flex-wrap items-center gap-4">
            <button ui-switch size="sm" checkedChildren="1" unCheckedChildren="0" defaultChecked></button>
            <button ui-switch size="default" checkedChildren="ON" unCheckedChildren="OFF" defaultChecked></button>
            <button ui-switch size="lg" checkedChildren="ON" unCheckedChildren="OFF" defaultChecked></button>
          </div>
        </div>
      }
      @case ('Colors') {
        <div class="flex flex-wrap items-center gap-4">
          <button ui-switch color="success" defaultChecked></button>
          <button ui-switch color="warning" defaultChecked></button>
          <button ui-switch color="error" defaultChecked></button>
          <button ui-switch color="info" defaultChecked></button>
          <button ui-switch color="secondary" defaultChecked></button>
          <button ui-switch color="#8b5cf6" defaultChecked></button>
        </div>
      }
    }
  `,
})
export class AngularSwitchDemoComponent {
  @Input() story = 'Default'
  enabled = true
}
