<script lang="ts">
  import { Stepper, type StepperStepConfig } from '@svelte-registry/stepper'
  import { CreditCard, Package, ShieldCheck, Truck, User } from '@lucide/svelte'

  let { story }: { story: string } = $props()

  let step = $state(2)
  let wizardStep = $state(1)

  const baseSteps: StepperStepConfig[] = [
    { id: 1, title: 'Account', icon: User },
    { id: 2, title: 'Shipping', icon: Truck },
    { id: 3, title: 'Confirm', icon: ShieldCheck },
  ]

  const verticalSteps: StepperStepConfig[] = [
    { id: 1, title: 'Cart', description: '3 items' },
    { id: 2, title: 'Address', description: 'Where to ship' },
    { id: 3, title: 'Payment', description: 'Card or wallet' },
    { id: 4, title: 'Review', description: 'Place order' },
  ]

  const errorSteps: StepperStepConfig[] = [
    { id: 1, title: 'Account' },
    { id: 2, title: 'Payment', error: true },
    { id: 3, title: 'Confirm' },
  ]

  const disabledSteps: StepperStepConfig[] = [
    { id: 1, title: 'Sign up' },
    { id: 2, title: 'Verify email' },
    { id: 3, title: 'Subscribe', disabled: true },
    { id: 4, title: 'Done' },
  ]

  const descriptionSteps: StepperStepConfig[] = [
    { id: 1, title: 'Account', description: 'Email + password' },
    { id: 2, title: 'Profile', description: 'Tell us about you' },
    { id: 3, title: 'Plan', description: 'Pick a tier' },
  ]

  const wizardSteps: StepperStepConfig[] = [
    { id: 1, title: 'Details', icon: User },
    { id: 2, title: 'Items', icon: Package },
    { id: 3, title: 'Payment', icon: CreditCard },
    { id: 4, title: 'Done', icon: ShieldCheck },
  ]
</script>

{#if story === 'Default'}
  <Stepper bind:value={step} steps={baseSteps} class="max-w-md" />
{/if}

{#if story === 'Vertical orientation'}
  <Stepper value={2} steps={verticalSteps} orientation="vertical" class="max-w-xs" />
{/if}

{#if story === 'Error state'}
  <Stepper value={2} steps={errorSteps} class="max-w-md" />
{/if}

{#if story === 'Disabled step'}
  <Stepper value={2} steps={disabledSteps} class="max-w-lg" />
{/if}

{#if story === 'With descriptions'}
  <Stepper value={2} steps={descriptionSteps} class="max-w-2xl" />
{/if}

{#if story === 'Programmatic binding'}
  <div class="space-y-4">
    <Stepper bind:value={wizardStep} steps={wizardSteps} class="max-w-xl" />
    <div class="flex items-center gap-2">
      <button
        type="button"
        class="border bg-background hover:bg-accent h-8 rounded-md px-3 text-sm font-medium disabled:opacity-50"
        disabled={wizardStep === 1}
        onclick={() => wizardStep--}
      >
        Prev
      </button>
      <button
        type="button"
        class="bg-primary text-primary-foreground h-8 rounded-md px-3 text-sm font-medium disabled:opacity-50"
        disabled={wizardStep === wizardSteps.length}
        onclick={() => wizardStep++}
      >
        Next
      </button>
      <span class="text-muted-foreground ml-2 text-xs">Step {wizardStep} of {wizardSteps.length}</span>
    </div>
  </div>
{/if}
