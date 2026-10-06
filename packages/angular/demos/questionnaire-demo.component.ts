import { Component, Input } from '@angular/core'
import { UiQuestionnaireComponent, type QuestionnaireAnswers, type QuestionnaireItemDef } from '@/ui/questionnaire'

@Component({
  selector: 'angular-questionnaire-demo',
  standalone: true,
  imports: [UiQuestionnaireComponent],
  template: `
    @switch (story) {
      @case ('Default') {
        <ui-questionnaire [items]="agentItems" />
      }

      @case ('Letter shortcuts') {
        <ui-questionnaire [items]="agentItems" shortcuts="letters" />
      }

      @case ('Number shortcuts') {
        <ui-questionnaire [items]="agentItems.slice(0, 1)" shortcuts="numbers" />
      }

      @case ('Multiple') {
        <ui-questionnaire [items]="multiItems" />
      }

      @case ('Freeform only') {
        <ui-questionnaire
          [items]="[{ name: 'why', prompt: 'Why now?', description: 'Optional.', input: { placeholder: 'Optional' } }]"
        />
      }

      @case ('Required validation') {
        <ui-questionnaire [items]="agentItems.slice(0, 1)" requiredMessage="Pick a direction before continuing." />
      }

      @case ('Hide progress') {
        <ui-questionnaire [items]="agentItems.slice(0, 1)" [showProgress]="false" />
      }

      @case ('Disabled choice') {
        <ui-questionnaire [items]="multiItems" />
      }

      @case ('Single question') {
        <ui-questionnaire
          [items]="[
            {
              name: 'ok',
              prompt: 'Ship it?',
              required: true,
              choices: [
                { value: 'yes', label: 'Yes' },
                { value: 'later', label: 'Later' },
              ],
            },
          ]"
        />
      }

      @case ('Submit payload') {
        <ui-questionnaire [items]="agentItems.slice(0, 1)" (submit)="lastSubmit = $event" />
        @if (lastSubmit) {
          <p class="text-muted-foreground mt-3 font-mono text-xs">{{ lastSubmitJson }}</p>
        }
      }
    }
  `,
})
export class QuestionnaireDemoComponent {
  @Input() story?: string

  lastSubmit: QuestionnaireAnswers | null = null

  get lastSubmitJson(): string {
    return JSON.stringify(this.lastSubmit)
  }

  readonly agentItems: QuestionnaireItemDef[] = [
    {
      name: 'direction',
      prompt: 'What should we build next?',
      description: 'Choose a direction or write your own.',
      required: true,
      choices: [
        { value: 'attach', label: 'Attachment chip', description: 'File, image, or code with upload states.' },
        { value: 'crop', label: 'Image cropper', description: 'Zoom, pan, aspect ratio.' },
        { value: 'both', label: 'Both together' },
      ],
      input: { placeholder: 'Describe another task…' },
    },
    {
      name: 'scope',
      prompt: 'Who is this for?',
      required: true,
      choices: [
        { value: 'agents', label: 'AI agents' },
        { value: 'support', label: 'Support inbox' },
        { value: 'onboarding', label: 'Onboarding' },
      ],
    },
    {
      name: 'notes',
      prompt: 'Anything else?',
      description: 'Optional. Skip if you have nothing to add.',
      choices: [{ value: 'none', label: 'Nothing else' }],
      input: { placeholder: 'Extra context' },
    },
  ]

  readonly multiItems: QuestionnaireItemDef[] = [
    {
      name: 'stack',
      prompt: 'Which stacks should we support?',
      multiple: true,
      required: true,
      choices: [
        { value: 'vue', label: 'Vue' },
        { value: 'react', label: 'React' },
        { value: 'svelte', label: 'Svelte', disabled: true },
      ],
    },
  ]
}
