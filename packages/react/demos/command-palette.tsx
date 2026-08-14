import Story from '../../components/story/Story'
import { CommandPalette } from '@react-registry-blocks/command-palette/CommandPalette'

export default function CommandPaletteDemo() {
  return (
    <Story
      title="Command Palette"
      description="Slim trigger button (with platform-aware ⌘K/Ctrl-K kbd hint) plus the modal CommandDialog. Drop it once and the global keyboard shortcut wires itself. Click the trigger or press ⌘K / Ctrl-K to open."
    >
      <div className="flex max-w-md flex-col gap-2">
        <p className="text-muted-foreground text-xs">
          Click the trigger or press <kbd className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">⌘K</kbd> /
          <kbd className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">Ctrl K</kbd>
        </p>
        <CommandPalette />
      </div>
    </Story>
  )
}
