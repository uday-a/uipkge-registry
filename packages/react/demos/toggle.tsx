import Story from "../../components/story/Story";
import { useState } from "react";
import { Toggle } from "@react-registry/toggle";
import { Bold, Italic, Underline, Star } from "lucide-react";

export default function ToggleDemo() {
  const [pinned, setPinned] = useState(false);
  const starred = true;

  return (
    <>
      <Story
        title="Default"
        description="Independent on/off icon button for formatting actions."
      >
        <div className="flex gap-2">
          <Toggle aria-label="Bold">
            <Bold className="size-4" />
          </Toggle>
          <Toggle aria-label="Italic">
            <Italic className="size-4" />
          </Toggle>
          <Toggle aria-label="Underline">
            <Underline className="size-4" />
          </Toggle>
        </div>
      </Story>

      <Story
        title="Variants"
        description="Default has no border; outline adds a visible border and shadow."
      >
        <div className="flex gap-2">
          <Toggle variant="default" aria-label="Bold default">
            <Bold className="size-4" />
          </Toggle>
          <Toggle variant="outline" aria-label="Bold outline">
            <Bold className="size-4" />
          </Toggle>
        </div>
      </Story>

      <Story title="Sizes" description="Small, default, and large heights.">
        <div className="flex items-center gap-2">
          <Toggle size="sm" aria-label="Bold sm">
            <Bold className="size-4" />
          </Toggle>
          <Toggle size="default" aria-label="Bold default">
            <Bold className="size-4" />
          </Toggle>
          <Toggle size="lg" aria-label="Bold lg">
            <Bold className="size-4" />
          </Toggle>
        </div>
      </Story>

      <Story
        title="With label"
        description="Toggle accepts arbitrary children, including text alongside icons."
      >
        <div className="flex gap-2">
          <Toggle variant="outline" aria-label="Star this">
            <Star className="size-4" />
            <span>Star</span>
          </Toggle>
        </div>
      </Story>

      <Story
        title="Controlled"
        description="Bind state with v-model and observe pressed state externally."
      >
        <div className="flex items-center gap-3">
          <Toggle
            pressed={pinned}
            onPressedChange={setPinned}
            variant="outline"
            aria-label="Pin"
          >
            <Star className="size-4" />
            <span>{pinned ? "Pinned" : "Pin"}</span>
          </Toggle>
          <span className="text-muted-foreground text-xs">
            Pressed: <code className="text-foreground">{String(pinned)}</code>
          </span>
        </div>
      </Story>

      <Story
        title="Disabled"
        description="Non-interactive state respects the current pressed value."
      >
        <div className="flex gap-2">
          <Toggle disabled aria-label="Off disabled">
            <Bold className="size-4" />
          </Toggle>
          <Toggle
            pressed={starred}
            disabled
            variant="outline"
            aria-label="On disabled"
          >
            <Star className="size-4" />
          </Toggle>
        </div>
      </Story>
    </>
  );
}
