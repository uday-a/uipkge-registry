import { useState } from 'react'
import Story from '../../components/story/Story'
import { AlertModal } from '@react-registry/alert-modal'
import { Button } from '@react-registry/button'
import { Trash2 } from 'lucide-react'

export default function AlertModalDemo() {
  // Destructive tone
  const [open1, setOpen1] = useState(false)

  // Controlled (no trigger)
  const [externalOpen, setExternalOpen] = useState(false)

  // Async action
  const [deleting, setDeleting] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  async function handleDelete() {
    setDeleting(true)
    await new Promise((r) => setTimeout(r, 1200))
    setDeleting(false)
    setDeleteOpen(false)
  }

  // Slot-based extras
  const [slotsOpen, setSlotsOpen] = useState(false)

  return (
    <>
      <Story
        title="Default"
        description="Drop in title, description, and labels — AlertModal renders an alertdialog (focus trap, no soft-dismiss, semantic role)."
      >
        <AlertModal
          title="Are you absolutely sure?"
          description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
          actionLabel="Continue"
          trigger={<Button variant="outline">Show alert modal</Button>}
        />
      </Story>

      <Story
        title="Destructive tone"
        description="tone='destructive' colors the action button red and pairs with the error icon."
      >
        <AlertModal
          open={open1}
          onOpenChange={setOpen1}
          title="Delete project?"
          description="This permanently deletes the project and every file inside it. There is no recovery."
          tone="destructive"
          icon="error"
          actionLabel="Delete project"
          onAction={() => setOpen1(false)}
          trigger={
            <Button variant="destructive">
              <Trash2 className="size-4" />
              Delete project
            </Button>
          }
        />
      </Story>

      <Story
        title="Tone variants"
        description="Built-in icon shortcuts (info / success / warning / error) and matching tone tokens."
      >
        <div className="flex flex-wrap gap-2">
          <AlertModal
            title="Heads up"
            description="Read this before proceeding."
            tone="default"
            icon="info"
            actionLabel="Got it"
            cancelLabel={null}
            trigger={<Button variant="outline">Info</Button>}
          />
          <AlertModal
            title="Saved"
            description="Your changes have been saved successfully."
            tone="success"
            icon="success"
            actionLabel="Done"
            cancelLabel={null}
            trigger={<Button variant="outline">Success</Button>}
          />
          <AlertModal
            title="Heads up"
            description="This will overwrite the existing config."
            tone="warning"
            icon="warning"
            actionLabel="Overwrite"
            trigger={<Button variant="outline">Warning</Button>}
          />
          <AlertModal
            title="Cannot continue"
            description="Your session has expired. Please sign in again."
            tone="destructive"
            icon="error"
            actionLabel="Sign in"
            cancelLabel={null}
            trigger={<Button variant="outline">Error</Button>}
          />
        </div>
      </Story>

      <Story
        title="Async action with loading"
        description="loading shows a spinner on the action button and disables both buttons until the promise resolves."
      >
        <AlertModal
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          title="Delete 24 files?"
          description="This permanently removes the selected items."
          tone="destructive"
          icon="error"
          actionLabel="Delete"
          loading={deleting}
          onAction={handleDelete}
          trigger={<Button variant="destructive">Delete 24 files…</Button>}
        />
      </Story>

      <Story
        title="Controlled (no trigger)"
        description="Drive open state externally — common when the modal is summoned from a menu, keyboard shortcut, or after an async event."
      >
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setExternalOpen(true)}>
            Open externally
          </Button>
          <AlertModal
            open={externalOpen}
            onOpenChange={setExternalOpen}
            title="Continue without saving?"
            description="You have unsaved changes that will be lost."
            actionLabel="Discard"
            tone="destructive"
            onAction={() => setExternalOpen(false)}
          />
          <span className="text-muted-foreground text-xs">open = {String(externalOpen)}</span>
        </div>
      </Story>

      <Story
        title="Slot escape hatch"
        description="Slot any content into #default for inline body, or override #actions entirely for a non-default footer."
      >
        <AlertModal
          open={slotsOpen}
          onOpenChange={setSlotsOpen}
          title="Cancel subscription"
          description="Your plan stays active until the end of the current period."
          icon="warning"
          tone="warning"
          trigger={<Button variant="outline">Cancel subscription</Button>}
          actions={
            <>
              <Button variant="outline" onClick={() => setSlotsOpen(false)}>
                Stay on plan
              </Button>
              <Button variant="ghost" onClick={() => setSlotsOpen(false)}>
                Downgrade to Free
              </Button>
              <Button variant="destructive" onClick={() => setSlotsOpen(false)}>
                Cancel anyway
              </Button>
            </>
          }
        >
          <ul className="text-muted-foreground my-2 list-disc space-y-1 pl-4 text-sm">
            <li>Your data is preserved for 90 days.</li>
            <li>You can resubscribe anytime.</li>
            <li>Pro perks remain until Dec 31, 2026.</li>
          </ul>
        </AlertModal>
      </Story>
    </>
  )
}
