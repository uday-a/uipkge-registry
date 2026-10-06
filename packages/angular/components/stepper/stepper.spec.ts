// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, TemplateRef, ViewChild, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiStepperComponent,
  UiStepperContentComponent,
  UiStepperContentTemplateDirective,
  UiStepperStepComponent,
  type StepperStep,
} from './stepper.component'

// Behaviour parity with the React Stepper. If these break, users notice: the step strip is
// empty, the current / done / failed steps look alike, clicking a finished step no longer
// takes you back (or lets you jump forward / onto a disabled step), connectors don't fill,
// and wizard panels for inactive steps stay visible.

@Component({
  standalone: true,
  imports: [UiStepperComponent, UiStepperContentComponent, UiStepperContentTemplateDirective, UiStepperStepComponent],
  template: `
    <ng-template #userIcon><svg class="lucide lucide-user"></svg></ng-template>
    <ui-stepper
      id="s"
      [steps]="steps()"
      [value]="value()"
      [orientation]="orientation()"
      (valueChange)="changes.push($event); value.set($event)"
    >
      @if (withContent()) {
        <ui-stepper-content [step]="1" [activeStep]="value()">One</ui-stepper-content>
        <ui-stepper-content [step]="2" [activeStep]="value()">Two</ui-stepper-content>
      }
      @if (withTemplate()) {
        <ng-template uiStepperContent let-active="activeStep" let-steps="steps"
          >Step {{ active }} / {{ steps.length }}</ng-template
        >
      }
    </ui-stepper>
    <ui-stepper-step id="standalone" title="Standalone" [completed]="true" />
  `,
})
class HostComponent {
  @ViewChild('userIcon', { static: true }) userIcon!: TemplateRef<unknown>
  readonly value = signal(3)
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal')
  readonly withContent = signal(false)
  readonly withTemplate = signal(false)
  readonly steps = signal<StepperStep[]>([])
  changes: number[] = []
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  const host = fixture.componentInstance
  host.steps.set([
    { id: 1, title: 'Account', icon: host.userIcon },
    { id: 2, title: 'Payment', disabled: true },
    { id: 3, title: 'Confirm' },
    { id: 4, title: 'Done', description: 'All set' },
  ])
  init(host)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const root = fixture.nativeElement.querySelector('#s') as HTMLElement
  const items = () => Array.from(root.querySelectorAll<HTMLElement>('[data-slot="stepper-item"]'))
  const indicator = (i: number) => items()[i].querySelector<HTMLButtonElement>('[data-slot="stepper-indicator"]')!
  const settle = async () => {
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
  }
  return { fixture, host, root, items, indicator, settle }
}

describe('Stepper (angular, 8 checks)', () => {
  it('1: renders a tablist with an <ol> of tab items from steps', async () => {
    const t = await setup()
    expect(t.root.getAttribute('role')).toBe('tablist')
    expect(t.root.getAttribute('aria-orientation')).toBe('horizontal')
    expect(t.root.querySelector('ol')?.className).toBe('flex flex-row items-start')
    expect(t.items().map((li) => li.tagName)).toEqual(['LI', 'LI', 'LI', 'LI'])
    expect(t.items().map((li) => li.getAttribute('role'))).toEqual(['tab', 'tab', 'tab', 'tab'])
    expect(t.items()[3].querySelector('p')?.textContent).toBe('All set')
    // No children: React renders no content wrapper (ours stays display:none).
    expect(t.root.lastElementChild!.className).toBe('hidden')
  })

  it('2: statuses follow the 1-based value: completed before, active at, pending after', async () => {
    const t = await setup()
    expect(t.items().map((li) => li.getAttribute('data-status'))).toEqual([
      'completed',
      'completed',
      'active',
      'pending',
    ])
    expect(t.items()[2].getAttribute('aria-selected')).toBe('true')
    expect(t.indicator(2).getAttribute('aria-current')).toBe('step')
    expect(t.indicator(3).querySelector('[data-slot="stepper-indicator-label"]')?.textContent).toBe('4')
  })

  it('3: completed steps show a check, a custom icon template wins and gets icon props', async () => {
    const t = await setup()
    const icon = t.indicator(0).querySelector('svg')!
    expect(icon.classList.contains('lucide-user')).toBe(true)
    expect(icon.classList.contains('size-4')).toBe(true)
    expect(icon.getAttribute('data-slot')).toBe('stepper-indicator-icon')
    expect(t.indicator(1).querySelector('svg.lucide-check')).not.toBeNull()
  })

  it('4: an error step renders the destructive indicator with an X', async () => {
    const t = await setup((h) => h.steps.update((s) => s.map((x, i) => (i === 3 ? { ...x, error: true } : x))))
    expect(t.indicator(3).getAttribute('data-status')).toBe('error')
    expect(t.indicator(3).className).toContain('bg-destructive')
    expect(t.indicator(3).querySelector('svg.lucide-x')).not.toBeNull()
  })

  it('5: clicking a completed step goes back; future and disabled steps are not clickable', async () => {
    const t = await setup()
    expect(t.indicator(3).disabled).toBe(true)
    expect(t.indicator(1).disabled).toBe(true) // disabled step, even though completed
    expect(t.items()[1].getAttribute('aria-disabled')).toBe('true')
    t.indicator(0).click()
    await t.settle()
    expect(t.host.changes).toEqual([1])
    expect(t.items().map((li) => li.getAttribute('data-status'))).toEqual(['active', 'pending', 'pending', 'pending'])
  })

  it('6: connector fills are completed up to the active step', async () => {
    const t = await setup()
    const fills = (i: number) =>
      Array.from(t.items()[i].querySelectorAll('[data-slot="stepper-connector-fill"]')).map((f) =>
        f.getAttribute('data-completed'),
      )
    expect(fills(0)).toEqual(['true']) // first item: right segment only
    expect(fills(2)).toEqual(['true', 'false'])
    expect(fills(3)).toEqual(['false']) // last item: left segment only
  })

  it('7: StepperContent hides inactive panels; the content wrapper only renders with children', async () => {
    const t = await setup((h) => h.withContent.set(true))
    const panels = Array.from(t.root.querySelectorAll<HTMLElement>('[data-slot="stepper-content"]'))
    expect(panels.map((p) => p.style.display)).toEqual(['none', 'none'])
    t.host.value.set(2)
    await t.settle()
    expect(panels.map((p) => p.style.display)).toEqual(['none', ''])
    expect([...panels[0].parentElement!.classList].sort()).toEqual(['flex-1', 'mt-6'])
  })

  it('8: a uiStepperContent template receives activeStep + steps; standalone StepperStep computes status', async () => {
    const t = await setup((h) => h.withTemplate.set(true))
    expect(t.root.textContent).toContain('Step 3 / 4')
    const standalone = t.fixture.nativeElement.querySelector('#standalone') as HTMLElement
    expect(standalone.querySelector('[data-slot="stepper-indicator"]')?.getAttribute('data-status')).toBe('completed')
    expect(standalone.textContent).toContain('Standalone')
  })
})

describe('Stepper on Angular 22 (OnPush by default)', () => {
  // The items read the parent's active step through getters. Under Angular 22's OnPush default
  // only the <li> host bindings refreshed, so indicators, check icons and connector fills stayed
  // on the first step and finished steps could not be clicked to go back.
  it('indicators follow value changes made after the first render', () => {
    @Component({
      standalone: true,
      imports: [UiStepperComponent],
      template: `<ui-stepper [steps]="steps" [value]="value()" />`,
    })
    class Host {
      steps: StepperStep[] = [
        { id: 1, title: 'One' },
        { id: 2, title: 'Two' },
        { id: 3, title: 'Three' },
      ]
      value = signal(1)
    }
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
    const fixture = TestBed.createComponent(Host)
    fixture.detectChanges()
    const statuses = () =>
      [...(fixture.nativeElement as HTMLElement).querySelectorAll('[data-slot="stepper-indicator"]')].map((i) =>
        i.getAttribute('data-status'),
      )
    expect(statuses()).toEqual(['active', 'pending', 'pending'])
    fixture.componentInstance.value.set(3)
    fixture.detectChanges()
    expect(statuses()).toEqual(['completed', 'completed', 'active'])
  })
})
