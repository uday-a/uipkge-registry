import Story from "../../components/story/Story";
import { Button } from "@react-registry/button";
import { Kbd } from "@react-registry/kbd";

export default function KbdDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Inline keyboard hint styled with muted surface and mono font."
      >
        <p className="text-sm">
          Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to open the command palette.
        </p>
      </Story>

      <Story
        title="Single key"
        description="One-letter shortcuts for arrow keys and modifiers."
      >
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>Enter</Kbd>
        </div>
      </Story>

      <Story
        title="Modifier combos"
        description="Group related keys inline — each key is its own chip."
      >
        <p className="text-sm">
          Save with <Kbd>⌘</Kbd> <Kbd>S</Kbd> or <Kbd>Ctrl</Kbd> <Kbd>S</Kbd> on
          Windows.
        </p>
      </Story>

      <Story
        title="In a button row"
        description="Pair with Button for shortcut affordances on toolbars."
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Search
            <Kbd className="ml-2">⌘K</Kbd>
          </Button>
          <Button variant="ghost" size="sm">
            New
            <Kbd className="ml-2">N</Kbd>
          </Button>
        </div>
      </Story>

      <Story
        title="Long label"
        description="Chips grow with content — no truncation on wider labels."
      >
        <Kbd>Shift</Kbd>
      </Story>
    </>
  );
}
