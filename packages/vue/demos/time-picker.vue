<script setup lang="ts">
import { ref } from "vue";
import { Label } from "@/components/ui/label";
import { TimePicker, TimeRangePicker } from "@/components/ui/time-picker";
// ── Basic ──
const basicValue = ref("09:30");

// ── Formats ──
const hmValue = ref("14:30");
const hmsValue = ref("14:30:45");
const h12Value = ref("14:30");

// ── 12-Hour mode ──
const amPmValue = ref("09:30");

// ── Disabled time ──
const disabledValue = ref("12:00");
const disabledHours = () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 20, 21, 22, 23];
const disabledMinutes = (h: number) => {
  if (h === 12)
    return [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    ];
  return [];
};
const disabledSeconds = (h: number, m: number) => {
  if (h === 12 && m === 30) return [0, 1, 2, 3, 4, 5];
  return [];
};

// ── Hide disabled ──
const hideDisabledValue = ref("12:00");

// ── Steps ──
const stepValue = ref("09:00");

// ── Presets ──
const presetValue = ref("09:00");
const timePresets = [
  { label: "Morning", value: "08:00" },
  { label: "Noon", value: "12:00" },
  { label: "Afternoon", value: "14:00" },
  { label: "Evening", value: "18:00" },
  { label: "Night", value: "21:00" },
];

// ── Range ──
const rangeValue = ref<[string, string] | null>(["09:00", "17:00"]);
const rangePresets = [
  { label: "Work Day", value: ["09:00", "17:00"] as [string, string] },
  { label: "Morning Shift", value: ["06:00", "14:00"] as [string, string] },
  { label: "Night Shift", value: ["22:00", "06:00"] as [string, string] },
];

// ── Sizes ──
const smValue = ref("08:00");
const mdValue = ref("12:00");
const lgValue = ref("18:00");

// ── Status ──
const errorValue = ref("");
const warningValue = ref("");

// ── Clearable ──
const clearableValue = ref("10:00");
const nonClearableValue = ref("10:00");
</script>

<template>
  <!-- 1. Basic -->
  <Story
    title="Default"
    description="24-hour time input bound to a string in HH:mm format."
  >
    <div class="max-w-xs space-y-2">
      <Label>Pick a time</Label>
      <TimePicker v-model="basicValue" />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ basicValue }}</code>
      </p>
    </div>
  </Story>

  <!-- 2. Format HH:mm:ss -->
  <Story
    title="With Seconds"
    description="HH:mm:ss format includes a seconds column."
  >
    <div class="max-w-xs space-y-2">
      <Label>Pick a time</Label>
      <TimePicker v-model="hmsValue" format="HH:mm:ss" :second-step="5" />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ hmsValue }}</code>
      </p>
    </div>
  </Story>

  <!-- 3. Format hh:mm A -->
  <Story
    title="12-Hour Format"
    description="hh:mm A displays AM/PM and uses 12-hour columns."
  >
    <div class="max-w-xs space-y-2">
      <Label>Pick a time</Label>
      <TimePicker v-model="h12Value" format="hh:mm A" />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ h12Value }}</code>
      </p>
    </div>
  </Story>

  <!-- 4. use12Hours prop -->
  <Story
    title="use12Hours"
    description="Explicit 12-hour mode with AM/PM selector."
  >
    <div class="max-w-xs space-y-2">
      <Label>Pick a time</Label>
      <TimePicker v-model="amPmValue" use12-hours />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ amPmValue }}</code>
      </p>
    </div>
  </Story>

  <!-- 5. Disabled time -->
  <Story
    title="Disabled Time"
    description="Programmatically disable specific hours, minutes, and seconds."
  >
    <div class="max-w-xs space-y-2">
      <Label>Business hours only</Label>
      <TimePicker
        v-model="disabledValue"
        :disabled-hours="disabledHours"
        :disabled-minutes="disabledMinutes"
        :disabled-seconds="disabledSeconds"
        format="HH:mm:ss"
        :second-step="5"
      />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ disabledValue }}</code>
      </p>
    </div>
  </Story>

  <!-- 6. Hide disabled options -->
  <Story
    title="Hide Disabled Options"
    description="Disabled values are completely hidden from the columns rather than greyed out."
  >
    <div class="max-w-xs space-y-2">
      <Label>Business hours (hidden)</Label>
      <TimePicker
        v-model="hideDisabledValue"
        :disabled-hours="disabledHours"
        :disabled-minutes="disabledMinutes"
        hide-disabled-options
      />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ hideDisabledValue }}</code>
      </p>
    </div>
  </Story>

  <!-- 7. Steps -->
  <Story
    title="Steps"
    description="Skip values with hour, minute, and second steps."
  >
    <div class="max-w-xs space-y-2">
      <Label>15-min intervals</Label>
      <TimePicker
        v-model="stepValue"
        :hour-step="2"
        :minute-step="15"
        :second-step="10"
        format="HH:mm:ss"
      />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ stepValue }}</code>
      </p>
    </div>
  </Story>

  <!-- 8. Presets -->
  <Story
    title="Presets"
    description="Quick-select common times from a preset list."
  >
    <div class="max-w-xs space-y-2">
      <Label>Quick select</Label>
      <TimePicker v-model="presetValue" :presets="timePresets" />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ presetValue }}</code>
      </p>
    </div>
  </Story>

  <!-- 9. Range Picker -->
  <Story
    title="Range Picker"
    description="Select a start and end time side by side."
  >
    <div class="max-w-sm space-y-2">
      <Label>Working hours</Label>
      <TimeRangePicker v-model="rangeValue" :presets="rangePresets" />
      <p class="text-muted-foreground text-xs">
        Value:
        <code class="text-foreground">{{
          rangeValue ? `${rangeValue[0]} ~ ${rangeValue[1]}` : "none"
        }}</code>
      </p>
    </div>
  </Story>

  <!-- 10. Sizes -->
  <Story
    title="Sizes"
    description="Small, middle (default), and large trigger heights."
  >
    <div class="flex max-w-xs flex-col gap-3">
      <TimePicker v-model="smValue" size="small" placeholder="Small" />
      <TimePicker v-model="mdValue" size="middle" placeholder="Middle" />
      <TimePicker v-model="lgValue" size="large" placeholder="Large" />
    </div>
  </Story>

  <!-- 11. Status -->
  <Story title="Status" description="Error and warning validation states.">
    <div class="flex max-w-xs flex-col gap-3">
      <TimePicker
        v-model="errorValue"
        status="error"
        placeholder="Error state"
      />
      <TimePicker
        v-model="warningValue"
        status="warning"
        placeholder="Warning state"
      />
    </div>
  </Story>

  <!-- 12. Allow Clear -->
  <Story
    title="Allow Clear"
    description="Click the X to clear the selected time."
  >
    <div class="flex max-w-xs flex-col gap-3">
      <TimePicker
        v-model="clearableValue"
        allow-clear
        placeholder="Clearable"
      />
      <TimePicker
        v-model="nonClearableValue"
        :allow-clear="false"
        placeholder="Not clearable"
      />
    </div>
  </Story>

  <!-- 13. Suffix Icon -->
  <Story
    title="Suffix Icon"
    description="Clock icon is shown by default in the trigger."
  >
    <div class="max-w-xs space-y-2">
      <Label>Default clock icon</Label>
      <TimePicker v-model="basicValue" />
      <p class="text-muted-foreground text-xs">
        The Clock icon from Lucide is always rendered.
      </p>
    </div>
  </Story>

  <!-- 14. Full Featured -->
  <Story
    title="Full Featured"
    description="Seconds + 12-hour + steps + disabled time + presets all together."
  >
    <div class="max-w-xs space-y-2">
      <Label>Full featured</Label>
      <TimePicker
        v-model="hmsValue"
        format="HH:mm:ss"
        use12-hours
        :hour-step="1"
        :minute-step="5"
        :second-step="5"
        :disabled-hours="disabledHours"
        :disabled-minutes="disabledMinutes"
        :presets="timePresets"
        allow-clear
      />
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ hmsValue }}</code>
      </p>
    </div>
  </Story>
</template>
