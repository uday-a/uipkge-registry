import { Component, Input } from '@angular/core'
import { UiVideoComponent } from '../../../../../packages/registry-angular/components/video/video.component'
import {
  UiCardComponent,
  UiCardContentComponent,
  UiCardDescriptionComponent,
  UiCardHeaderComponent,
  UiCardTitleComponent,
} from '../../../../../packages/registry-angular/components/card/card.component'

const sampleMp4 = '/media/flower.mp4'
const samplePoster = '/media/flower.jpg'

@Component({
  selector: 'angular-video-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    UiVideoComponent,
    UiCardComponent,
    UiCardHeaderComponent,
    UiCardTitleComponent,
    UiCardDescriptionComponent,
    UiCardContentComponent,
  ],
  template: `
    @switch (story) {
      @case ('Feature player') {
        <ui-video [src]="sampleMp4" [poster]="samplePoster" class="max-w-2xl" />
      }
      @case ('Autoplay (muted)') {
        <ui-video
          [src]="sampleMp4"
          [poster]="samplePoster"
          [autoplay]="true"
          [muted]="true"
          [loop]="true"
          class="max-w-2xl"
        />
      }
      @case ('Native controls') {
        <ui-video [src]="sampleMp4" [poster]="samplePoster" [nativeControls]="true" class="max-w-2xl" />
      }
      @case ('Aspect ratio variants') {
        <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
          <div class="space-y-1.5">
            <p class="text-muted-foreground text-xs">4/3 — classic TV</p>
            <ui-video [src]="sampleMp4" [poster]="samplePoster" aspectRatio="4/3" />
          </div>
          <div class="space-y-1.5">
            <p class="text-muted-foreground text-xs">1/1 — square</p>
            <ui-video [src]="sampleMp4" [poster]="samplePoster" aspectRatio="1/1" />
          </div>
          <div class="space-y-1.5">
            <p class="text-muted-foreground text-xs">9/16 — portrait</p>
            <ui-video [src]="sampleMp4" [poster]="samplePoster" aspectRatio="9/16" class="max-w-xs" />
          </div>
          <div class="space-y-1.5">
            <p class="text-muted-foreground text-xs">16/9 — widescreen</p>
            <ui-video [src]="sampleMp4" [poster]="samplePoster" aspectRatio="16/9" />
          </div>
        </div>
      }
      @case ('Without poster') {
        <ui-video [src]="sampleMp4" class="max-w-2xl" />
      }
      @case ('Custom playback rate') {
        <ui-video [src]="sampleMp4" [poster]="samplePoster" [playbackRate]="1.5" class="max-w-2xl" />
      }
      @case ('In a content card') {
        <ui-card class="max-w-2xl">
          <ui-card-header>
            <ui-card-title>Lesson 3 — Composition basics</ui-card-title>
            <ui-card-description>5 min · 1.5× speed recommended</ui-card-description>
          </ui-card-header>
          <ui-card-content>
            <ui-video [src]="sampleMp4" [poster]="samplePoster" [playbackRate]="1.5" />
          </ui-card-content>
        </ui-card>
      }
    }
  `,
})
export class AngularVideoDemoComponent {
  @Input() story = 'Feature player'

  readonly sampleMp4 = sampleMp4
  readonly samplePoster = samplePoster
}
