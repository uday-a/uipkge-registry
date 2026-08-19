<script setup lang="ts">
import { computed, ref, watch } from "vue";
import type { Component, HTMLAttributes } from "vue";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-vue-next";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogRoot,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "reka-ui";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type AlertIcon = "info" | "warning" | "error" | "success";

const props = withDefaults(
  defineProps<{
    /** Controlled open state. Pair with v-model:open. */
    open?: boolean;
    /** Title rendered in the header. Override with #title slot. */
    title?: string;
    /** Description rendered under the title. Override with #description slot. */
    description?: string;
    /** Label for the primary action button. */
    actionLabel?: string;
    /** Label for the cancel button. Pass null to hide. */
    cancelLabel?: string | null;
    /** Visual tone — colors the icon and action button. */
    tone?: "default" | "destructive" | "success" | "warning";
    /** Quick icon shortcut. Override with #icon slot. */
    icon?: AlertIcon | Component | null;
    /** Show a spinner on the action button and disable both buttons. */
    loading?: boolean;
    /** Disable the primary action without a spinner. */
    actionDisabled?: boolean;
    class?: HTMLAttributes["class"];
  }>(),
  {
    title: "",
    description: "",
    actionLabel: "Continue",
    cancelLabel: "Cancel",
    tone: "default",
    loading: false,
    actionDisabled: false,
  },
);

const emit = defineEmits<{
  "update:open": [value: boolean];
  action: [event: MouseEvent];
  cancel: [event: MouseEvent];
}>();

// Sync internal ref with v-model:open and emit changes back out so the
// component works in both controlled and uncontrolled modes.
const internalOpen = ref(props.open ?? false);

watch(
  () => props.open,
  (v) => {
    if (v !== undefined && v !== internalOpen.value) internalOpen.value = v;
  },
);

function setOpen(v: boolean) {
  // Keep the dialog open while an async action is in flight.
  if (!v && props.loading) return;
  internalOpen.value = v;
  emit("update:open", v);
}

const builtInIcons: Record<AlertIcon, Component> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
};

const ResolvedIcon = computed<Component | null>(() => {
  if (!props.icon) return null;
  if (typeof props.icon === "string") return builtInIcons[props.icon] ?? null;
  return props.icon;
});

const iconColorClass = computed(() => {
  switch (props.tone) {
    case "destructive":
      return "text-destructive";
    case "success":
      return "text-success";
    case "warning":
      return "text-warning";
    default:
      return "text-muted-foreground";
  }
});

const actionToneClass = computed(() => {
  switch (props.tone) {
    case "destructive":
      return "bg-destructive text-destructive-foreground hover:bg-destructive/90";
    case "success":
      return "bg-success text-success-foreground hover:bg-success/90";
    case "warning":
      return "bg-warning text-warning-foreground hover:bg-warning/90";
    default:
      return "";
  }
});

function handleAction(e: MouseEvent) {
  if (props.loading || props.actionDisabled) {
    e.preventDefault();
    return;
  }
  emit("action", e);
}

function handleCancel(e: MouseEvent) {
  emit("cancel", e);
}
</script>

<template>
  <AlertDialogRoot :open="internalOpen" @update:open="setOpen">
    <AlertDialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </AlertDialogTrigger>

    <AlertDialogPortal>
      <AlertDialogOverlay
        class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-neutral-900/80"
      />
      <AlertDialogContent
        :class="
          cn(
            'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
            props.class,
          )
        "
      >
        <div class="flex flex-col gap-2 text-center sm:text-left">
          <div
            v-if="$slots.icon || ResolvedIcon"
            :class="
              cn(
                'bg-muted mb-2 flex size-10 items-center justify-center rounded-full',
                iconColorClass,
              )
            "
          >
            <slot name="icon">
              <component
                :is="ResolvedIcon"
                v-if="ResolvedIcon"
                class="size-5"
              />
            </slot>
          </div>
          <AlertDialogTitle class="text-lg font-semibold">
            <slot name="title">{{ title }}</slot>
          </AlertDialogTitle>
          <AlertDialogDescription
            v-if="description || $slots.description"
            class="text-muted-foreground text-sm"
          >
            <slot name="description">{{ description }}</slot>
          </AlertDialogDescription>
        </div>

        <div v-if="$slots.default" class="text-sm">
          <slot />
        </div>

        <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <slot name="actions">
            <AlertDialogCancel v-if="cancelLabel" as-child>
              <Button
                variant="outline"
                :disabled="loading"
                @click="handleCancel"
              >
                {{ cancelLabel }}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction as-child>
              <Button
                :disabled="loading || actionDisabled"
                :aria-busy="loading"
                :class="actionToneClass"
                @click="handleAction"
              >
                <span
                  v-if="loading"
                  class="mr-2 inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                  aria-hidden="true"
                />
                {{ actionLabel }}
              </Button>
            </AlertDialogAction>
          </slot>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
