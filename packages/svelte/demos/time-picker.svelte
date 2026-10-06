<script lang="ts">
  import { TimePicker, TimeRangePicker } from '@svelte-registry/time-picker'

  let { story }: { story: string } = $props()

  let basic = $state('09:30')
  let seconds = $state('09:30:00')
  let twelve = $state('14:05')
  let stepped = $state('')
  let range = $state<[string, string] | null>(['09:00', '17:00'])
  let status = $state('')
</script>

{#if story === 'Default'}
  <TimePicker bind:value={basic} />
{/if}

{#if story === 'With Seconds'}
  <TimePicker bind:value={seconds} format="HH:mm:ss" secondStep={10} />
{/if}

{#if story === '12-Hour Format'}
  <TimePicker bind:value={twelve} format="hh:mm A" />
{/if}

{#if story === 'Steps'}
  <TimePicker bind:value={stepped} minuteStep={15} placeholder="Every 15 minutes" />
{/if}

{#if story === 'Presets'}
  <TimePicker
    bind:value={basic}
    presets={[
      { label: 'Morning standup', value: '09:30' },
      { label: 'Lunch', value: '12:30' },
      { label: 'EOD', value: '17:30' },
    ]}
  />
{/if}

{#if story === 'Range Picker'}
  <TimeRangePicker bind:value={range} />
{/if}

{#if story === 'Sizes'}
  <div class="flex flex-wrap items-center gap-2">
    <TimePicker size="small" placeholder="Small" />
    <TimePicker size="middle" placeholder="Middle" />
    <TimePicker size="large" placeholder="Large" />
  </div>
{/if}

{#if story === 'Status'}
  <div class="flex flex-wrap items-center gap-2">
    <TimePicker bind:value={status} status="error" placeholder="Error" />
    <TimePicker status="warning" placeholder="Warning" />
  </div>
{/if}
