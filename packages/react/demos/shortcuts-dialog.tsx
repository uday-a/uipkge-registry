import Story from '../../components/story/Story'
import { ShortcutsDialog, type ShortcutGroup } from '@react-registry-blocks/shortcuts-dialog/ShortcutsDialog'
import { Button } from '@react-registry/button'
import * as React from 'react'

const boardGroups: ShortcutGroup[] = [
  {
    label: 'Board',
    shortcuts: [
      { keys: ['N'], description: 'New card' },
      { keys: ['⌘', '⏎'], description: 'Save card' },
      { keys: ['Space'], description: 'Pick up card' },
    ],
  },
  {
    label: 'View',
    shortcuts: [
      { keys: ['1', '2', '3'], description: 'Switch swimlanes' },
      { keys: ['F'], description: 'Toggle filters' },
    ],
  },
]

const editorGroups: ShortcutGroup[] = [
  {
    label: 'Editor',
    shortcuts: [
      { keys: ['⌘', 'B'], description: 'Bold selection' },
      { keys: ['⌘', 'I'], description: 'Italicize selection' },
      { keys: ['⌘', 'K'], description: 'Insert link' },
    ],
  },
]

const longGroups: ShortcutGroup[] = Array.from({ length: 5 }, (_, g) => ({
  label: `Group ${g + 1}`,
  shortcuts: Array.from({ length: 6 }, (_, s) => ({
    keys: ['⌘', '⇧', String(s + 1)],
    description: `Group ${g + 1} action ${s + 1}`,
  })),
}))

function ControlledOpen() {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex items-center gap-3">
      <Button size="sm" onClick={() => setOpen(true)}>
        Open shortcuts
      </Button>
      <ShortcutsDialog trigger={false} open={open} onOpenChange={setOpen} />
    </div>
  )
}

export default function ShortcutsDialogDemo() {
  return (
    <>
      <Story title="Default" description="Built-in trigger button with a Kbd hint; click to open the sheet.">
        <ShortcutsDialog />
      </Story>

      <Story title="Controlled open" description="Driven externally — the button below forces it open.">
        <ControlledOpen />
      </Story>

      <Story title="Custom groups" description="Swap in your own sections via the groups prop.">
        <ShortcutsDialog groups={boardGroups} />
      </Story>

      <Story title="Single group" description="One focused section renders as a clean single column.">
        <ShortcutsDialog groups={editorGroups} />
      </Story>

      <Story title="Long list" description="Many shortcuts scroll inside the dialog while headers stay put.">
        <ShortcutsDialog groups={longGroups} />
      </Story>

      <Story title="Custom trigger" description="trigger=false swaps in your own trigger via triggerSlot.">
        <ShortcutsDialog
          trigger={false}
          triggerSlot={
            <button
              type="button"
              className="text-primary inline-flex min-h-6 items-center text-sm underline underline-offset-4"
            >
              Keyboard shortcuts
            </button>
          }
        />
      </Story>

      <Story title="No footer" description="footer=false drops the Esc hint row.">
        <ShortcutsDialog footer={false} />
      </Story>

      <Story
        title="Windows modifiers"
        description="Keys are plain strings — render Ctrl-based combos for non-mac audiences."
      >
        <ShortcutsDialog
          groups={[
            {
              label: 'Actions',
              shortcuts: [
                { keys: ['Ctrl', 'K'], description: 'Open command menu' },
                { keys: ['Ctrl', 'S'], description: 'Save changes' },
                { keys: ['Ctrl', '⇧', 'P'], description: 'Command palette' },
              ],
            },
          ]}
        />
      </Story>
    </>
  )
}
