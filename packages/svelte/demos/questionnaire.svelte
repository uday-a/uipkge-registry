<script lang="ts">
  import {
    Questionnaire,
    type QuestionnaireAnswers,
    type QuestionnaireItemDef,
  } from '@svelte-registry/questionnaire'

  let { story }: { story: string } = $props()

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

  let lastSubmit = $state<QuestionnaireAnswers | null>(null)
</script>

{#if story === 'Default'}
  <Questionnaire items={agentItems} />
{/if}

{#if story === 'Letter shortcuts'}
  <Questionnaire items={agentItems} shortcuts="letters" />
{/if}

{#if story === 'Number shortcuts'}
  <Questionnaire items={agentItems.slice(0, 1)} shortcuts="numbers" />
{/if}

{#if story === 'Multiple'}
  <Questionnaire items={multiItems} />
{/if}

{#if story === 'Freeform only'}
  <Questionnaire
    items={[{ name: 'why', prompt: 'Why now?', description: 'Optional.', input: { placeholder: 'Optional' } }]}
  />
{/if}

{#if story === 'Required validation'}
  <Questionnaire items={agentItems.slice(0, 1)} requiredMessage="Pick a direction before continuing." />
{/if}

{#if story === 'Hide progress'}
  <Questionnaire items={agentItems.slice(0, 1)} showProgress={false} />
{/if}

{#if story === 'Disabled choice'}
  <Questionnaire items={multiItems} />
{/if}

{#if story === 'Single question'}
  <Questionnaire
    items={[
      {
        name: 'ok',
        prompt: 'Ship it?',
        required: true,
        choices: [
          { value: 'yes', label: 'Yes' },
          { value: 'later', label: 'Later' },
        ],
      },
    ]}
  />
{/if}

{#if story === 'Submit payload'}
  <Questionnaire items={agentItems.slice(0, 1)} onSubmit={(answers) => (lastSubmit = answers)} />
  {#if lastSubmit}
    <p class="text-muted-foreground mt-3 font-mono text-xs">{JSON.stringify(lastSubmit)}</p>
  {/if}
{/if}
