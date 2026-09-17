<script setup lang="ts">
import { ref } from "vue";
import { Label } from "@/components/ui/label";
import {
  PinInput,
  PinInputGroup,
  PinInputSeparator,
  PinInputSlot,
} from "@/components/ui/pin-input";
const value = ref<string[]>([]);
const password = ref<string[]>([]);
const statusError = ref<string[]>([]);
const statusSuccess = ref<string[]>(["1", "2", "3", "4"]);
const small = ref<string[]>([]);
const large = ref<string[]>([]);
const shakeCode = ref<string[]>([]);
const shakeStatus = ref<"default" | "error">("default");

function onShakeComplete(v: string) {
  if (v === "1234") {
    shakeStatus.value = "default";
    return;
  }
  shakeStatus.value = "error";
  // Allow re-trigger: clear status then re-apply after a tick when user edits.
  window.setTimeout(() => {
    if (shakeStatus.value === "error") shakeCode.value = [];
  }, 450);
}

function onShakeUpdate(v: string[]) {
  shakeCode.value = v;
  if (shakeStatus.value === "error" && v.some(Boolean)) {
    shakeStatus.value = "default";
  }
}
</script>

<template>
  <Story
    title="Default"
    description="Six-slot one-time code input bound to a string array model."
  >
    <div class="space-y-2">
      <Label>One-time code</Label>
      <PinInput v-model="value" :length="6" placeholder="•">
        <PinInputGroup>
          <PinInputSlot v-for="(_, i) in 6" :key="i" :index="i" />
        </PinInputGroup>
      </PinInput>
      <p class="text-muted-foreground text-xs">
        Value: <code class="text-foreground">{{ value.join("") || "—" }}</code>
      </p>
    </div>
  </Story>

  <Story
    title="Masked (Password)"
    description="Hides entered characters like a password field."
  >
    <div class="space-y-2">
      <Label>Secure PIN</Label>
      <PinInput v-model="password" :length="4" mask placeholder="•">
        <PinInputGroup>
          <PinInputSlot v-for="(_, i) in 4" :key="i" :index="i" />
        </PinInputGroup>
      </PinInput>
      <p class="text-muted-foreground text-xs">
        Value:
        <code class="text-foreground">{{ password.join("") || "—" }}</code>
      </p>
    </div>
  </Story>

  <Story
    title="Sizes"
    description="Small, medium (default), and large slot sizes."
  >
    <div class="space-y-4">
      <div class="space-y-2">
        <Label class="text-xs">Small</Label>
        <PinInput v-model="small" :length="4" size="sm">
          <PinInputGroup>
            <PinInputSlot v-for="(_, i) in 4" :key="i" :index="i" />
          </PinInputGroup>
        </PinInput>
      </div>
      <div class="space-y-2">
        <Label>Medium (default)</Label>
        <PinInput v-model="value" :length="4">
          <PinInputGroup>
            <PinInputSlot v-for="(_, i) in 4" :key="i" :index="i" />
          </PinInputGroup>
        </PinInput>
      </div>
      <div class="space-y-2">
        <Label class="text-lg">Large</Label>
        <PinInput v-model="large" :length="4" size="lg">
          <PinInputGroup>
            <PinInputSlot v-for="(_, i) in 4" :key="i" :index="i" />
          </PinInputGroup>
        </PinInput>
      </div>
    </div>
  </Story>

  <Story
    title="Status"
    description="Error, warning, and success visual states."
  >
    <div class="space-y-4">
      <div class="space-y-2">
        <Label>Error</Label>
        <PinInput v-model="statusError" :length="4" status="error">
          <PinInputGroup>
            <PinInputSlot v-for="(_, i) in 4" :key="i" :index="i" />
          </PinInputGroup>
        </PinInput>
      </div>
      <div class="space-y-2">
        <Label>Success</Label>
        <PinInput v-model="statusSuccess" :length="4" status="success">
          <PinInputGroup>
            <PinInputSlot v-for="(_, i) in 4" :key="i" :index="i" />
          </PinInputGroup>
        </PinInput>
      </div>
    </div>
  </Story>

  <Story
    title="Error shake"
    description="One-shot shake when status becomes error. Enter any code except 1234 to trigger."
  >
    <div class="space-y-2">
      <Label>Try a code (correct: 1234)</Label>
      <PinInput
        :model-value="shakeCode"
        :length="4"
        :status="shakeStatus"
        @update:model-value="onShakeUpdate"
        @complete="onShakeComplete"
      >
        <PinInputGroup>
          <PinInputSlot v-for="(_, i) in 4" :key="i" :index="i" />
        </PinInputGroup>
      </PinInput>
      <p class="text-muted-foreground text-xs">
        Status: <code class="text-foreground">{{ shakeStatus }}</code>
      </p>
    </div>
  </Story>

  <Story title="With Separator" description="Visual grouping with separators.">
    <div class="space-y-2">
      <Label>Grouped code</Label>
      <PinInput v-model="value" :length="6" placeholder="0">
        <PinInputGroup>
          <PinInputSlot v-for="(_, i) in 3" :key="i" :index="i" />
        </PinInputGroup>
        <PinInputSeparator />
        <PinInputGroup>
          <PinInputSlot v-for="(_, i) in 3" :key="i + 3" :index="i + 3" />
        </PinInputGroup>
      </PinInput>
    </div>
  </Story>

  <Story
    title="Auto Submit"
    description="Emits complete event when all slots are filled."
  >
    <div class="space-y-2">
      <Label>Auto-submit PIN</Label>
      <PinInput
        :length="4"
        auto-submit
        @complete="(v) => alert('PIN complete: ' + v)"
      >
        <PinInputGroup>
          <PinInputSlot v-for="(_, i) in 4" :key="i" :index="i" />
        </PinInputGroup>
      </PinInput>
      <p class="text-muted-foreground text-xs">
        Fill all 4 digits to trigger the complete event
      </p>
    </div>
  </Story>

  <Story title="Disabled" description="Non-interactive state.">
    <div class="space-y-2">
      <Label>Disabled</Label>
      <PinInput :model-value="['1', '2', '3', '4']" :length="4" disabled>
        <PinInputGroup>
          <PinInputSlot v-for="(_, i) in 4" :key="i" :index="i" />
        </PinInputGroup>
      </PinInput>
    </div>
  </Story>
</template>
