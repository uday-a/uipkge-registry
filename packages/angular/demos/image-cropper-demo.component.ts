import { Component, Input } from '@angular/core'
import { UiImageCropperComponent } from '../../../../../packages/registry-angular/components/image-cropper/image-cropper.component'

const src = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=800&fit=crop&q=80'
const portrait = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=1200&fit=crop&q=80'

/** Angular demo for the image-cropper page. Mirrors demos/react/image-cropper.tsx story by story. */
@Component({
  selector: 'angular-image-cropper-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiImageCropperComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-image-cropper [src]="src" alt="Coast" />
      }
      @case ('Show zoom') {
        <ui-image-cropper [src]="src" alt="Coast" showZoom />
      }
      @case ('16 / 9') {
        <ui-image-cropper [src]="src" alt="Coast" [aspectRatio]="16 / 9" showZoom />
      }
      @case ('4 / 3') {
        <ui-image-cropper [src]="src" alt="Coast" [aspectRatio]="4 / 3" showZoom />
      }
      @case ('Portrait') {
        <ui-image-cropper [src]="portrait" alt="City" [aspectRatio]="3 / 4" showZoom />
      }
      @case ('Circle') {
        <ui-image-cropper [src]="src" alt="Coast" rounded="full" class="max-w-xs" showZoom />
      }
      @case ('Banner') {
        <ui-image-cropper [src]="src" alt="Coast" [aspectRatio]="21 / 9" showZoom />
      }
      @case ('Zoom limits') {
        <ui-image-cropper [src]="src" alt="Coast" [minZoom]="1" [maxZoom]="2" showZoom />
      }
      @case ('Disabled') {
        <ui-image-cropper [src]="src" alt="Coast" disabled showZoom />
      }
      @case ('No zoom control') {
        <ui-image-cropper [src]="src" alt="Coast" />
      }
    }
  `,
})
export class AngularImageCropperDemoComponent {
  @Input() story = 'Default'
  readonly src = src
  readonly portrait = portrait
}
