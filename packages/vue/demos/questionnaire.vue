<script setup lang="ts">
import { ref } from 'vue'
import { Questionnaire, type QuestionnaireAnswers, type QuestionnaireItemDef } from '@/components/ui/questionnaire'

const agentItems: QuestionnaireItemDef[] = [
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

const multiItems: QuestionnaireItemDef[] = [
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

const lastSubmit = ref<QuestionnaireAnswers | null>(null)
</script>

<template>
  <Story title="Default" description="Pass items. Progress, next, skip, and submit come from those props.">
    <Questionnaire :items="agentItems" />
  </Story>

  <Story title="Letter shortcuts" description="shortcuts=letters assigns A, B, C to choices.">
    <Questionnaire :items="agentItems" shortcuts="letters" />
  </Story>

  <Story title="Number shortcuts" description="shortcuts=numbers assigns 1–9.">
    <Questionnaire :items="agentItems.slice(0, 1)" shortcuts="numbers" />
  </Story>

  <Story title="Multiple" description="Set multiple on an item to collect checkboxes.">
    <Questionnaire :items="multiItems" />
  </Story>

  <Story
    title="Freeform only"
    description="An item with input and no choices. Skip is available when required is false."
  >
    <Questionnaire
      :items="[{ name: 'why', prompt: 'Why now?', description: 'Optional.', input: { placeholder: 'Optional' } }]"
    />
  </Story>

  <Story title="Required validation" description="Next on an empty required item shows requiredMessage.">
    <Questionnaire :items="agentItems.slice(0, 1)" required-message="Pick a direction before continuing." />
  </Story>

  <Story title="Hide progress" description="showProgress=false removes the bar.">
    <Questionnaire :items="agentItems.slice(0, 1)" :show-progress="false" />
  </Story>

  <Story title="Disabled choice" description="A choice can set disabled: true in the items array.">
    <Questionnaire :items="multiItems" />
  </Story>

  <Story title="Single question" description="One required item — Submit shows immediately.">
    <Questionnaire
      :items="[
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
  </Story>

  <Story title="Submit payload" description="Listen for submit to read the answers map.">
    <Questionnaire :items="agentItems.slice(0, 1)" @submit="lastSubmit = $event" />
    <p v-if="lastSubmit" class="text-muted-foreground mt-3 font-mono text-xs">{{ JSON.stringify(lastSubmit) }}</p>
  </Story>
</template>
