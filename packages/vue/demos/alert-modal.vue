<script setup lang="ts">
import { ref } from "vue";
import { AlertModal } from "@/components/ui/alert-modal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-vue-next";

// Confirm-with-trigger
const open1 = ref(false);

// Controlled (no trigger slot)
const externalOpen = ref(false);

// Async action
const deleting = ref(false);
const deleteOpen = ref(false);
async function handleDelete() {
  deleting.value = true;
  await new Promise((r) => setTimeout(r, 1200));
  deleting.value = false;
  deleteOpen.value = false;
}

// Slot-based extras
const slotsOpen = ref(false);
</script>

<template>
  <Story
    title="Default"
    description="Drop in title, description, and labels — AlertModal renders an alertdialog (focus trap, no soft-dismiss, semantic role)."
  >
    <AlertModal
      title="Are you absolutely sure?"
      description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
      action-label="Continue"
    >
      <template #trigger>
        <Button variant="outline">Show alert modal</Button>
      </template>
    </AlertModal>
  </Story>

  <Story
    title="Destructive tone"
    description="tone='destructive' colors the action button red and pairs with the error icon."
  >
    <AlertModal
      v-model:open="open1"
      title="Delete project?"
      description="This permanently deletes the project and every file inside it. There is no recovery."
      tone="destructive"
      icon="error"
      action-label="Delete project"
      @action="open1 = false"
    >
      <template #trigger>
        <Button variant="destructive">
          <Trash2 class="size-4" />
          Delete project
        </Button>
      </template>
    </AlertModal>
  </Story>

  <Story
    title="Tone variants"
    description="Built-in icon shortcuts (info / success / warning / error) and matching tone tokens."
  >
    <div class="flex flex-wrap gap-2">
      <AlertModal
        title="Heads up"
        description="Read this before proceeding."
        tone="default"
        icon="info"
        action-label="Got it"
        :cancel-label="null"
      >
        <template #trigger><Button variant="outline">Info</Button></template>
      </AlertModal>
      <AlertModal
        title="Saved"
        description="Your changes have been saved successfully."
        tone="success"
        icon="success"
        action-label="Done"
        :cancel-label="null"
      >
        <template #trigger><Button variant="outline">Success</Button></template>
      </AlertModal>
      <AlertModal
        title="Heads up"
        description="This will overwrite the existing config."
        tone="warning"
        icon="warning"
        action-label="Overwrite"
      >
        <template #trigger><Button variant="outline">Warning</Button></template>
      </AlertModal>
      <AlertModal
        title="Cannot continue"
        description="Your session has expired. Please sign in again."
        tone="destructive"
        icon="error"
        action-label="Sign in"
        :cancel-label="null"
      >
        <template #trigger><Button variant="outline">Error</Button></template>
      </AlertModal>
    </div>
  </Story>

  <Story
    title="Async action with loading"
    description="loading shows a spinner on the action button and disables both buttons until the promise resolves."
  >
    <AlertModal
      v-model:open="deleteOpen"
      title="Delete 24 files?"
      description="This permanently removes the selected items."
      tone="destructive"
      icon="error"
      action-label="Delete"
      :loading="deleting"
      @action="handleDelete"
    >
      <template #trigger>
        <Button variant="destructive">Delete 24 files…</Button>
      </template>
    </AlertModal>
  </Story>

  <Story
    title="Controlled (no trigger)"
    description="Drive open state externally — common when the modal is summoned from a menu, keyboard shortcut, or after an async event."
  >
    <div class="flex items-center gap-3">
      <Button variant="outline" @click="externalOpen = true"
        >Open externally</Button
      >
      <AlertModal
        v-model:open="externalOpen"
        title="Continue without saving?"
        description="You have unsaved changes that will be lost."
        action-label="Discard"
        tone="destructive"
        @action="externalOpen = false"
      />
      <span class="text-muted-foreground text-xs"
        >open = {{ externalOpen }}</span
      >
    </div>
  </Story>

  <Story
    title="Slot escape hatch"
    description="Slot any content into #default for inline body, or override #actions entirely for a non-default footer."
  >
    <AlertModal
      v-model:open="slotsOpen"
      title="Cancel subscription"
      description="Your plan stays active until the end of the current period."
      icon="warning"
      tone="warning"
    >
      <template #trigger>
        <Button variant="outline">Cancel subscription</Button>
      </template>

      <ul class="text-muted-foreground my-2 list-disc space-y-1 pl-4 text-sm">
        <li>Your data is preserved for 90 days.</li>
        <li>You can resubscribe anytime.</li>
        <li>Pro perks remain until Dec 31, 2026.</li>
      </ul>

      <template #actions>
        <Button variant="outline" @click="slotsOpen = false"
          >Stay on plan</Button
        >
        <Button variant="ghost" @click="slotsOpen = false"
          >Downgrade to Free</Button
        >
        <Button variant="destructive" @click="slotsOpen = false"
          >Cancel anyway</Button
        >
      </template>
    </AlertModal>
  </Story>
</template>
