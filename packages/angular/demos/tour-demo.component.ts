import { Component, Input, signal } from '@angular/core'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import { UiTourComponent, type TourStep } from '../../../../../packages/registry-angular/components/tour/tour.component'

const steps1: TourStep[] = [
  { target: '#tour-target-a', title: 'Welcome', description: 'This is the first stop.' },
  { target: '#tour-target-b', title: 'Search bar', description: 'Find anything from here.' },
  { target: '#tour-target-c', title: 'Settings', description: 'Configure your account.' },
  { target: '#tour-target-d', title: 'Done!', description: 'You finished the tour.' },
]

const steps2: TourStep[] = [
  {
    target: '#tour-target-cover-a',
    title: 'Cover image',
    description: 'A short marketing intro to a feature.',
    cover: 'https://placehold.co/600x180/0ea5e9/white?text=Cover',
  },
  {
    target: '#tour-target-cover-b',
    title: 'Try it',
    description: 'Use this control to begin.',
  },
]

const steps3: TourStep[] = [
  { title: 'Welcome', description: 'A centered intro step (no target).', mask: true },
  { target: '#tour-target-centered', title: 'Then a real target', description: 'Now we anchor.' },
]

const steps4: TourStep[] = [
  {
    target: '#tour-long-a',
    title: 'Step 1 of 6',
    description: 'A longer tour with six stops, useful for full onboarding flows.',
  },
  { target: '#tour-long-b', title: 'Step 2 of 6', description: 'Each step can reference any selector on the page.' },
  {
    target: '#tour-long-c',
    title: 'Step 3 of 6',
    description: 'Mid-tour stops can re-anchor the user to a new area of the UI.',
  },
  {
    target: '#tour-long-d',
    title: 'Step 4 of 6',
    description: 'Use longer descriptions for steps that introduce new concepts.',
  },
  { target: '#tour-long-e', title: 'Step 5 of 6', description: 'Nearly there — one more checkpoint.' },
  { target: '#tour-long-f', title: 'Done', description: 'Six stops in, the user has seen the whole surface.' },
]

const steps5: TourStep[] = [
  {
    target: '#tour-mask-a',
    title: 'Masked target',
    description: 'The mask cuts out a hole around the target so the rest of the page is dimmed.',
    mask: true,
  },
  {
    target: '#tour-mask-b',
    title: 'No mask',
    description:
      'mask=false leaves the page un-dimmed for this step — useful when the surrounding context still matters.',
    mask: false,
  },
]

/** Angular demo for the tour page. Mirrors demos/react/tour.tsx story by story. */
@Component({
  selector: 'angular-tour-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiButtonComponent, UiTourComponent],
  template: `
    @switch (story) {
      @case ('Basic 4-step tour') {
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <button ui-button id="tour-target-a">Step 1 target</button>
            <button ui-button id="tour-target-b" variant="outline">Step 2 target</button>
            <button ui-button id="tour-target-c" variant="secondary">Step 3 target</button>
            <button ui-button id="tour-target-d" variant="ghost">Step 4 target</button>
          </div>
          <button ui-button (click)="start(0)">Start tour</button>
        </div>
        <ui-tour
          [open]="open()[0]"
          [current]="step()[0]"
          [steps]="steps1"
          (openChange)="setOpen(0, $event)"
          (currentChange)="setStep(0, $event)"
        />
      }
      @case ('Cover image + primary type') {
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <button ui-button id="tour-target-cover-a">Anchor 1</button>
            <button ui-button id="tour-target-cover-b" variant="outline">Anchor 2</button>
          </div>
          <button ui-button (click)="start(1)">Start tour</button>
        </div>
        <ui-tour
          [open]="open()[1]"
          [current]="step()[1]"
          [steps]="steps2"
          type="primary"
          (openChange)="setOpen(1, $event)"
          (currentChange)="setStep(1, $event)"
        />
      }
      @case ('Centered (no target) step') {
        <div class="space-y-4">
          <button ui-button id="tour-target-centered" variant="outline">Anchor for step 2</button>
          <button ui-button (click)="start(2)">Start tour</button>
        </div>
        <ui-tour
          [open]="open()[2]"
          [current]="step()[2]"
          [steps]="steps3"
          (openChange)="setOpen(2, $event)"
          (currentChange)="setStep(2, $event)"
        />
      }
      @case ('Long onboarding tour (6 steps)') {
        <div class="space-y-4">
          <div class="grid grid-cols-3 gap-2">
            <button ui-button id="tour-long-a">Stop 1</button>
            <button ui-button id="tour-long-b" variant="outline">Stop 2</button>
            <button ui-button id="tour-long-c" variant="secondary">Stop 3</button>
            <button ui-button id="tour-long-d" variant="ghost">Stop 4</button>
            <button ui-button id="tour-long-e">Stop 5</button>
            <button ui-button id="tour-long-f" variant="outline">Stop 6</button>
          </div>
          <button ui-button (click)="start(3)">Start 6-step tour</button>
        </div>
        <ui-tour
          [open]="open()[3]"
          [current]="step()[3]"
          [steps]="steps4"
          (openChange)="setOpen(3, $event)"
          (currentChange)="setStep(3, $event)"
        />
      }
      @case ('Mask on / off per step') {
        <div class="space-y-4">
          <div class="flex gap-2">
            <button ui-button id="tour-mask-a">Masked</button>
            <button ui-button id="tour-mask-b" variant="outline">Unmasked</button>
          </div>
          <button ui-button (click)="start(4)">Start tour</button>
        </div>
        <ui-tour
          [open]="open()[4]"
          [current]="step()[4]"
          [steps]="steps5"
          (openChange)="setOpen(4, $event)"
          (currentChange)="setStep(4, $event)"
        />
      }
    }
  `,
})
export class AngularTourDemoComponent {
  @Input() story = 'Basic 4-step tour'
  readonly steps1 = steps1
  readonly steps2 = steps2
  readonly steps3 = steps3
  readonly steps4 = steps4
  readonly steps5 = steps5
  readonly open = signal([false, false, false, false, false])
  readonly step = signal([0, 0, 0, 0, 0])

  setOpen(i: number, v: boolean): void {
    this.open.update((a) => a.map((x, j) => (j === i ? v : x)))
  }

  setStep(i: number, v: number): void {
    this.step.update((a) => a.map((x, j) => (j === i ? v : x)))
  }

  start(i: number): void {
    this.setOpen(i, true)
    this.setStep(i, 0)
  }
}
