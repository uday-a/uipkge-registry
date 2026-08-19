<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "vue-sonner";

function fakeAsync(ms = 1500, fail = false) {
  return new Promise((resolve, reject) => {
    setTimeout(
      () => (fail ? reject(new Error("Network error")) : resolve("Saved")),
      ms,
    );
  });
}
</script>

<template>
  <div class="space-y-8">
    <Toaster position="bottom-right" />

    <Story
      title="Variants"
      description="Toast styles for default, success, info, warning, error, and with-description."
    >
      <div class="flex flex-wrap gap-2">
        <Button variant="outline" @click="toast('Event has been created.')"
          >Default</Button
        >
        <Button variant="outline" @click="toast.success('Saved successfully.')"
          >Success</Button
        >
        <Button variant="outline" @click="toast.info('Heads up!')">Info</Button>
        <Button variant="outline" @click="toast.warning('Please review.')"
          >Warning</Button
        >
        <Button variant="outline" @click="toast.error('Failed to save.')"
          >Error</Button
        >
        <Button
          variant="outline"
          @click="
            toast('Settings updated', {
              description: 'Your preferences have been saved.',
            })
          "
        >
          With description
        </Button>
      </div>
    </Story>

    <Story
      title="With action button"
      description="Pass an action with label + onClick — shown as a trailing button inside the toast."
    >
      <div class="flex flex-wrap gap-2">
        <Button
          variant="outline"
          @click="
            toast('Event has been created', {
              description: 'Sunday, December 03, 2023 at 9:00 AM',
              action: {
                label: 'Undo',
                onClick: () => toast.success('Reverted'),
              },
            })
          "
        >
          Show with action
        </Button>
        <Button
          variant="outline"
          @click="
            toast.success('Invitation sent', {
              action: { label: 'Resend', onClick: () => toast('Resending…') },
            })
          "
        >
          Success with action
        </Button>
      </div>
    </Story>

    <Story
      title="With dismiss button"
      description="Pass closeButton: true (or set globally on Toaster) to render an X dismiss control."
    >
      <div class="flex flex-wrap gap-2">
        <Button
          variant="outline"
          @click="
            toast('Tap the X to dismiss this toast manually.', {
              closeButton: true,
            })
          "
        >
          With close button
        </Button>
        <Button
          variant="outline"
          @click="
            toast.error('Something went wrong', {
              description: 'Click the X to clear this manually.',
              closeButton: true,
            })
          "
        >
          Error w/ close
        </Button>
      </div>
    </Story>

    <Story
      title="Long-running with manual dismiss"
      description="Set duration: Infinity to keep the toast open until the user dismisses it."
    >
      <div class="flex flex-wrap gap-2">
        <Button
          variant="outline"
          @click="
            toast('Sticky notification', {
              description: 'This toast stays until you close it.',
              duration: Number.POSITIVE_INFINITY,
              closeButton: true,
            })
          "
        >
          Sticky toast
        </Button>
        <Button
          variant="outline"
          @click="
            () => {
              const id = toast.loading('Processing… this may take a while.');
              setTimeout(() => toast.success('Done!', { id }), 3000);
            }
          "
        >
          Loading then resolve
        </Button>
      </div>
    </Story>

    <Story
      title="Promise toast"
      description="toast.promise binds a promise to loading / success / error states automatically."
    >
      <div class="flex flex-wrap gap-2">
        <Button
          variant="outline"
          @click="
            toast.promise(fakeAsync(1500), {
              loading: 'Saving…',
              success: 'Saved successfully',
              error: 'Failed to save',
            })
          "
        >
          Promise (resolves)
        </Button>
        <Button
          variant="outline"
          @click="
            toast.promise(fakeAsync(1500, true), {
              loading: 'Uploading…',
              success: 'Upload complete',
              error: (err) => `Upload failed: ${err.message}`,
            })
          "
        >
          Promise (rejects)
        </Button>
      </div>
    </Story>
  </div>
</template>
