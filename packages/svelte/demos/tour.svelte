<script lang="ts">
  import { Button } from '@svelte-registry/button'
  import { Tour, type TourStep } from '@svelte-registry/tour'

  let { story }: { story: string } = $props()

  let open1 = $state(false)
  let step1 = $state(0)
  let open2 = $state(false)
  let step2 = $state(0)
  let open3 = $state(false)
  let step3 = $state(0)
  let open4 = $state(false)
  let step4 = $state(0)
  let open5 = $state(false)
  let step5 = $state(0)

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
        'mask={false} leaves the page un-dimmed for this step — useful when the surrounding context still matters.',
      mask: false,
    },
  ]
</script>

{#if story === 'Basic 4-step tour'}
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <Button id="tour-target-a">Step 1 target</Button>
      <Button id="tour-target-b" variant="outline">Step 2 target</Button>
      <Button id="tour-target-c" variant="secondary">Step 3 target</Button>
      <Button id="tour-target-d" variant="ghost">Step 4 target</Button>
    </div>
    <Button
      onclick={() => {
        open1 = true
        step1 = 0
      }}>Start tour</Button
    >
    <Tour bind:open={open1} bind:current={step1} steps={steps1} />
  </div>
{/if}

{#if story === 'Cover image + primary type'}
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <Button id="tour-target-cover-a">Anchor 1</Button>
      <Button id="tour-target-cover-b" variant="outline">Anchor 2</Button>
    </div>
    <Button
      onclick={() => {
        open2 = true
        step2 = 0
      }}>Start tour</Button
    >
    <Tour bind:open={open2} bind:current={step2} steps={steps2} type="primary" />
  </div>
{/if}

{#if story === 'Centered (no target) step'}
  <div class="space-y-4">
    <Button id="tour-target-centered" variant="outline">Anchor for step 2</Button>
    <Button
      onclick={() => {
        open3 = true
        step3 = 0
      }}>Start tour</Button
    >
    <Tour bind:open={open3} bind:current={step3} steps={steps3} />
  </div>
{/if}

{#if story === 'Long onboarding tour (6 steps)'}
  <div class="space-y-4">
    <div class="grid grid-cols-3 gap-2">
      <Button id="tour-long-a">Stop 1</Button>
      <Button id="tour-long-b" variant="outline">Stop 2</Button>
      <Button id="tour-long-c" variant="secondary">Stop 3</Button>
      <Button id="tour-long-d" variant="ghost">Stop 4</Button>
      <Button id="tour-long-e">Stop 5</Button>
      <Button id="tour-long-f" variant="outline">Stop 6</Button>
    </div>
    <Button
      onclick={() => {
        open4 = true
        step4 = 0
      }}>Start 6-step tour</Button
    >
    <Tour bind:open={open4} bind:current={step4} steps={steps4} />
  </div>
{/if}

{#if story === 'Mask on / off per step'}
  <div class="space-y-4">
    <div class="flex gap-2">
      <Button id="tour-mask-a">Masked</Button>
      <Button id="tour-mask-b" variant="outline">Unmasked</Button>
    </div>
    <Button
      onclick={() => {
        open5 = true
        step5 = 0
      }}>Start tour</Button
    >
    <Tour bind:open={open5} bind:current={step5} steps={steps5} />
  </div>
{/if}
