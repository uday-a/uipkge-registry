import { Component, Input, signal } from '@angular/core'
import {
  UiQRCodeComponent,
  type QRCodeErrorLevel,
  type QRCodeStatus,
} from '../../../../../packages/registry-angular/components/qr-code/qr-code.component'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'

const basicValue = 'https://uipkge.dev'

/** Angular demo for the qr-code page. Mirrors demos/react/qr-code.tsx story by story. */
@Component({
  selector: 'angular-qr-code-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiQRCodeComponent, UiButtonComponent],
  template: `
    @switch (story) {
      @case ('Basic') {
        <ui-qr-code [value]="basicValue" />
      }
      @case ('Sizes') {
        <div class="flex flex-wrap items-end gap-4">
          <ui-qr-code [value]="basicValue" [size]="80" />
          <ui-qr-code [value]="basicValue" [size]="120" />
          <ui-qr-code [value]="basicValue" [size]="160" />
          <ui-qr-code [value]="basicValue" [size]="200" />
        </div>
      }
      @case ('Custom Colors') {
        <div class="flex flex-wrap gap-4">
          @for (c of colors; track c.label) {
            <div class="flex flex-col items-center gap-1">
              <ui-qr-code [value]="basicValue" [color]="c.color" [bgColor]="c.bgColor" [size]="100" />
              <span class="text-muted-foreground text-xs">{{ c.label }}</span>
            </div>
          }
        </div>
      }
      @case ('SVG Type') {
        <div class="flex gap-4">
          <ui-qr-code [value]="basicValue" type="canvas" />
          <ui-qr-code [value]="basicValue" type="svg" />
        </div>
      }
      @case ('With Icon') {
        <ui-qr-code [value]="iconValue" icon="https://github.com/uday-a.png" [iconSize]="40" errorLevel="H" />
      }
      @case ('Error Levels') {
        <div class="flex flex-wrap gap-4">
          @for (level of errorLevels; track level) {
            <div class="flex flex-col items-center gap-1">
              <ui-qr-code [value]="longValue" [errorLevel]="level" [size]="120" />
              <span class="text-muted-foreground text-xs">Level {{ level }}</span>
            </div>
          }
        </div>
      }
      @case ('Borderless') {
        <ui-qr-code [value]="basicValue" [bordered]="false" />
      }
      @case ('Margin / Quiet Zone') {
        <div class="flex gap-4">
          <ui-qr-code [value]="basicValue" [marginSize]="0" [size]="120" />
          <ui-qr-code [value]="basicValue" [marginSize]="2" [size]="120" />
          <ui-qr-code [value]="basicValue" [marginSize]="4" [size]="120" />
        </div>
      }
      @case ('Status') {
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            @for (s of statuses; track s) {
              <button
                ui-button
                size="sm"
                [variant]="currentStatus() === s ? 'default' : 'outline'"
                (click)="currentStatus.set(s)"
              >
                {{ s }}
              </button>
            }
          </div>
          <ui-qr-code [value]="customValue" [status]="currentStatus()" (refresh)="onRefresh()" />
        </div>
      }
      @case ('Long URL') {
        <div class="flex flex-col items-start gap-2">
          <ui-qr-code [value]="longValue" [size]="200" errorLevel="H" />
          <p class="text-muted-foreground max-w-md truncate text-xs">{{ longValue }}</p>
        </div>
      }
      @case ('Download') {
        <ui-qr-code [value]="basicValue" />
      }
      @case ('Custom Content') {
        <ng-template #extra>
          <div class="flex items-center gap-2">
            <button
              ui-button
              size="sm"
              variant="outline"
              (click)="customContentValue.set('https://uipkge.dev/components/advance-select')"
            >
              Change URL
            </button>
            <button ui-button size="sm" variant="outline" (click)="customContentValue.set('https://uipkge.dev')">
              Reset
            </button>
          </div>
        </ng-template>
        <ui-qr-code [value]="customContentValue()" [extra]="extra" />
      }
    }
  `,
})
export class AngularQrCodeDemoComponent {
  @Input() story = 'Basic'
  readonly basicValue = basicValue
  readonly customValue = 'https://github.com/uday-a/angular-boilerplate'
  readonly iconValue = 'https://uipkge.dev'
  readonly longValue = 'https://uipkge.dev/components/qr-code?demo=true&source=github&ref=main'
  readonly statuses: QRCodeStatus[] = ['active', 'expired', 'loading', 'scanned']
  readonly colors = [
    { color: '#000000', bgColor: '#ffffff', label: 'Default' },
    { color: '#1677ff', bgColor: '#ffffff', label: 'Blue' },
    { color: '#52c41a', bgColor: '#ffffff', label: 'Green' },
    { color: '#fa8c16', bgColor: '#ffffff', label: 'Orange' },
    { color: '#eb2f96', bgColor: '#ffffff', label: 'Pink' },
    { color: '#722ed1', bgColor: '#ffffff', label: 'Purple' },
  ]
  readonly errorLevels: QRCodeErrorLevel[] = ['L', 'M', 'Q', 'H']
  readonly currentStatus = signal<QRCodeStatus>('active')
  readonly customContentValue = signal(basicValue)

  onRefresh(): void {
    alert('Refresh triggered!')
  }
}
