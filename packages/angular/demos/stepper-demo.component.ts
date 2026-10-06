import { Component, Input, OnInit, TemplateRef, ViewChild, signal } from '@angular/core'
import { UiButtonComponent } from '../../../../../packages/registry-angular/components/button/button.component'
import {
  UiStepperComponent,
  type StepperStep,
} from '../../../../../packages/registry-angular/components/stepper/stepper.component'

const verticalSteps: StepperStep[] = [
  { id: 1, title: 'Cart', description: '3 items' },
  { id: 2, title: 'Address', description: 'Where to ship' },
  { id: 3, title: 'Payment', description: 'Card or wallet' },
  { id: 4, title: 'Review', description: 'Place order' },
]

const errorSteps: StepperStep[] = [
  { id: 1, title: 'Account' },
  { id: 2, title: 'Payment', error: true },
  { id: 3, title: 'Confirm' },
]

const disabledSteps: StepperStep[] = [
  { id: 1, title: 'Sign up' },
  { id: 2, title: 'Verify email' },
  { id: 3, title: 'Subscribe', disabled: true },
  { id: 4, title: 'Done' },
]

const descriptionSteps: StepperStep[] = [
  { id: 1, title: 'Account', description: 'Email + password' },
  { id: 2, title: 'Profile', description: 'Tell us about you' },
  { id: 3, title: 'Plan', description: 'Pick a tier' },
]

/** Angular demo for the stepper page. Mirrors demos/react/stepper.tsx story by story. */
@Component({
  selector: 'angular-stepper-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [UiStepperComponent, UiButtonComponent],
  template: `
    <ng-template #userIcon
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
        class="lucide lucide-user"
        aria-hidden="true"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" /></svg
    ></ng-template>
    <ng-template #truckIcon
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
        class="lucide lucide-truck"
        aria-hidden="true"
      >
        <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
        <path d="M15 18H9" />
        <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
        <circle cx="17" cy="18" r="2" />
        <circle cx="7" cy="18" r="2" /></svg
    ></ng-template>
    <ng-template #shieldCheckIcon
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
        class="lucide lucide-shield-check"
        aria-hidden="true"
      >
        <path
          d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
        />
        <path d="m9 12 2 2 4-4" /></svg
    ></ng-template>
    <ng-template #packageIcon
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
        class="lucide lucide-package"
        aria-hidden="true"
      >
        <path
          d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"
        />
        <path d="M12 22V12" />
        <polyline points="3.29 7 12 12 20.71 7" />
        <path d="m7.5 4.27 9 5.15" /></svg
    ></ng-template>
    <ng-template #creditCardIcon
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
        class="lucide lucide-credit-card"
        aria-hidden="true"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" /></svg
    ></ng-template>
    @switch (story) {
      @case ('Default') {
        <ui-stepper [value]="step()" (valueChange)="step.set($event)" [steps]="baseSteps" class="max-w-md" />
      }
      @case ('Vertical orientation') {
        <ui-stepper [value]="2" [steps]="verticalSteps" orientation="vertical" class="max-w-xs" />
      }
      @case ('Error state') {
        <ui-stepper [value]="2" [steps]="errorSteps" class="max-w-md" />
      }
      @case ('Disabled step') {
        <ui-stepper [value]="2" [steps]="disabledSteps" class="max-w-lg" />
      }
      @case ('With descriptions') {
        <ui-stepper [value]="2" [steps]="descriptionSteps" class="max-w-2xl" />
      }
      @case ('Programmatic v-model') {
        <div class="space-y-4">
          <ui-stepper
            [value]="wizardStep()"
            (valueChange)="wizardStep.set($event)"
            [steps]="wizardSteps"
            class="max-w-xl"
          />
          <div class="flex items-center gap-2">
            <button
              ui-button
              variant="outline"
              size="sm"
              [disabled]="wizardStep() === 1"
              (click)="wizardStep.set(wizardStep() - 1)"
            >
              Prev
            </button>
            <button
              ui-button
              size="sm"
              [disabled]="wizardStep() === wizardSteps.length"
              (click)="wizardStep.set(wizardStep() + 1)"
            >
              Next
            </button>
            <span class="text-muted-foreground ml-2 text-xs">Step {{ wizardStep() }} of {{ wizardSteps.length }}</span>
          </div>
        </div>
      }
    }
  `,
})
export class AngularStepperDemoComponent implements OnInit {
  @Input() story = 'Default'
  @ViewChild('userIcon', { static: true }) userIcon!: TemplateRef<unknown>
  @ViewChild('truckIcon', { static: true }) truckIcon!: TemplateRef<unknown>
  @ViewChild('shieldCheckIcon', { static: true }) shieldCheckIcon!: TemplateRef<unknown>
  @ViewChild('packageIcon', { static: true }) packageIcon!: TemplateRef<unknown>
  @ViewChild('creditCardIcon', { static: true }) creditCardIcon!: TemplateRef<unknown>

  readonly step = signal(2)
  readonly wizardStep = signal(1)
  readonly verticalSteps = verticalSteps
  readonly errorSteps = errorSteps
  readonly disabledSteps = disabledSteps
  readonly descriptionSteps = descriptionSteps
  baseSteps: StepperStep[] = []
  wizardSteps: StepperStep[] = []

  ngOnInit(): void {
    this.baseSteps = [
      { id: 1, title: 'Account', icon: this.userIcon },
      { id: 2, title: 'Shipping', icon: this.truckIcon },
      { id: 3, title: 'Confirm', icon: this.shieldCheckIcon },
    ]
    this.wizardSteps = [
      { id: 1, title: 'Details', icon: this.userIcon },
      { id: 2, title: 'Items', icon: this.packageIcon },
      { id: 3, title: 'Payment', icon: this.creditCardIcon },
      { id: 4, title: 'Done', icon: this.shieldCheckIcon },
    ]
  }
}
