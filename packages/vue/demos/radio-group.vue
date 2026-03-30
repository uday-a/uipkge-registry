<script setup lang="ts">
import { ref } from 'vue'
import { Label } from '@/components/ui/label'
import { RadioButton, RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
const value = ref('comfortable')
const buttonValue = ref('b')
const solidValue = ref('weekly')
const optionsValue = ref('apple')
const disabledValue = ref('option1')

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

<template>
  <Story title="Default" description="Single-select group of mutually exclusive options.">
    <RadioGroup v-model="value">
      <div class="flex items-center gap-2">
        <RadioGroupItem id="r1" value="default" />
        <Label for="r1">Default</Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem id="r2" value="comfortable" />
        <Label for="r2">Comfortable</Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem id="r3" value="compact" />
        <Label for="r3">Compact</Label>
      </div>
    </RadioGroup>
  </Story>

  <Story title="Options prop" description="Render radios automatically from an options array.">
    <RadioGroup v-model="optionsValue" :options="fruitOptions" />
  </Story>

  <Story
    title="Button style — outline"
    description="Button-styled radios with outline variant, matching Ant Design Radio.Button."
  >
    <RadioGroup v-model="buttonValue" option-type="button" button-variant="outline" orientation="horizontal">
      <RadioButton value="a" label="Hangzhou" />
      <RadioButton value="b" label="Shanghai" />
      <RadioButton value="c" label="Beijing" />
      <RadioButton value="d" label="Chengdu" />
    </RadioGroup>
  </Story>

  <Story title="Button style — solid" description="Filled background when checked.">
    <RadioGroup v-model="solidValue" option-type="button" button-variant="solid" orientation="horizontal">
      <RadioButton value="daily" label="Daily" />
      <RadioButton value="weekly" label="Weekly" />
      <RadioButton value="monthly" label="Monthly" />
    </RadioGroup>
  </Story>

  <Story title="Button sizes" description="Small, middle (default), and large button radios.">
    <div class="space-y-3">
      <RadioGroup v-model="buttonValue" option-type="button" size="small" orientation="horizontal">
        <RadioButton value="a" label="Small" />
        <RadioButton value="b" label="Button" />
      </RadioGroup>
      <RadioGroup v-model="buttonValue" option-type="button" size="middle" orientation="horizontal">
        <RadioButton value="a" label="Middle" />
        <RadioButton value="b" label="Button" />
      </RadioGroup>
      <RadioGroup v-model="buttonValue" option-type="button" size="large" orientation="horizontal">
        <RadioButton value="a" label="Large" />
        <RadioButton value="b" label="Button" />
      </RadioGroup>
    </div>
  </Story>

  <Story title="Button group vertical" description="Button radios stacked vertically.">
    <RadioGroup v-model="solidValue" option-type="button" button-variant="solid" orientation="vertical">
      <RadioButton value="daily" label="Daily digest" />
      <RadioButton value="weekly" label="Weekly summary" />
      <RadioButton value="monthly" label="Monthly report" />
    </RadioGroup>
  </Story>

  <Story title="Button group with options" description="Button style rendered automatically from options.">
    <RadioGroup
      v-model="solidValue"
      option-type="button"
      button-variant="solid"
      orientation="horizontal"
      :options="planOptions"
    />
  </Story>

  <Story title="Group disabled" description="Disabling the group disables all children automatically.">
    <RadioGroup v-model="disabledValue" disabled>
      <div class="flex items-center gap-2">
        <RadioGroupItem id="d1" value="option1" />
        <Label for="d1">Option 1</Label>
      </div>
      <div class="flex items-center gap-2">
        <RadioGroupItem id="d2" value="option2" />
        <Label for="d2">Option 2</Label>
      </div>
    </RadioGroup>
  </Story>

  <Story title="Disabled button group" description="Disabled state works with button-style radios too.">
    <RadioGroup v-model="buttonValue" option-type="button" disabled orientation="horizontal">
      <RadioButton value="a" label="Enabled look" />
      <RadioButton value="b" label="But disabled" />
    </RadioGroup>
  </Story>
</template>
