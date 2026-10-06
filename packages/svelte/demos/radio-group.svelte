<script lang="ts">
  import { RadioButton, RadioGroup, RadioGroupItem } from '@svelte-registry/radio-group'

  let { story }: { story: string } = $props()

  let value = $state('comfortable')
  let buttonValue = $state('b')
  let solidValue = $state('weekly')
  let optionsValue = $state('apple')
  let disabledValue = $state('option1')

  const fruitOptions = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry', disabled: true },
    { label: 'Date', value: 'date' },
  ]

  const planOptions = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
  ]
</script>

{#if story === 'Default'}
  <RadioGroup bind:value>
    <div class="flex items-center gap-2">
      <RadioGroupItem id="r1" value="default" />
      <label for="r1" class="text-sm font-medium">Default</label>
    </div>
    <div class="flex items-center gap-2">
      <RadioGroupItem id="r2" value="comfortable" />
      <label for="r2" class="text-sm font-medium">Comfortable</label>
    </div>
    <div class="flex items-center gap-2">
      <RadioGroupItem id="r3" value="compact" />
      <label for="r3" class="text-sm font-medium">Compact</label>
    </div>
  </RadioGroup>
{/if}

{#if story === 'Options prop'}
  <RadioGroup bind:value={optionsValue} options={fruitOptions} />
{/if}

{#if story === 'Button style — outline'}
  <RadioGroup bind:value={buttonValue} optionType="button" buttonVariant="outline" orientation="horizontal">
    <RadioButton value="a" label="Hangzhou" />
    <RadioButton value="b" label="Shanghai" />
    <RadioButton value="c" label="Beijing" />
    <RadioButton value="d" label="Chengdu" />
  </RadioGroup>
{/if}

{#if story === 'Button style — solid'}
  <RadioGroup bind:value={solidValue} optionType="button" buttonVariant="solid" orientation="horizontal">
    <RadioButton value="daily" label="Daily" />
    <RadioButton value="weekly" label="Weekly" />
    <RadioButton value="monthly" label="Monthly" />
  </RadioGroup>
{/if}

{#if story === 'Button sizes'}
  <div class="space-y-3">
    <RadioGroup bind:value={buttonValue} optionType="button" size="small" orientation="horizontal">
      <RadioButton value="a" label="Small" />
      <RadioButton value="b" label="Button" />
    </RadioGroup>
    <RadioGroup bind:value={buttonValue} optionType="button" size="middle" orientation="horizontal">
      <RadioButton value="a" label="Middle" />
      <RadioButton value="b" label="Button" />
    </RadioGroup>
    <RadioGroup bind:value={buttonValue} optionType="button" size="large" orientation="horizontal">
      <RadioButton value="a" label="Large" />
      <RadioButton value="b" label="Button" />
    </RadioGroup>
  </div>
{/if}

{#if story === 'Button group vertical'}
  <RadioGroup bind:value={solidValue} optionType="button" buttonVariant="solid" orientation="vertical">
    <RadioButton value="daily" label="Daily digest" />
    <RadioButton value="weekly" label="Weekly summary" />
    <RadioButton value="monthly" label="Monthly report" />
  </RadioGroup>
{/if}

{#if story === 'Button group with options'}
  <RadioGroup
    bind:value={solidValue}
    optionType="button"
    buttonVariant="solid"
    orientation="horizontal"
    options={planOptions}
  />
{/if}

{#if story === 'Group disabled'}
  <RadioGroup bind:value={disabledValue} disabled>
    <div class="flex items-center gap-2">
      <RadioGroupItem id="d1" value="option1" />
      <label for="d1" class="text-sm font-medium">Option 1</label>
    </div>
    <div class="flex items-center gap-2">
      <RadioGroupItem id="d2" value="option2" />
      <label for="d2" class="text-sm font-medium">Option 2</label>
    </div>
  </RadioGroup>
{/if}

{#if story === 'Disabled button group'}
  <RadioGroup bind:value={buttonValue} optionType="button" disabled orientation="horizontal">
    <RadioButton value="a" label="Enabled look" />
    <RadioButton value="b" label="But disabled" />
  </RadioGroup>
{/if}
