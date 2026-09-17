import { useState } from "react";
import Story from "../../components/story/Story";
import { Chip, ChipGroup } from "@react-registry/chip";
import { Hash } from "lucide-react";

export default function ChipDemo() {
  const [tags, setTags] = useState([
    "design",
    "engineering",
    "product",
    "marketing",
  ]);

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag));
  }

  return (
    <>
      <Story
        title="Variants"
        description="Seven visual styles. default / filled / outlined / elevated for visual weight; success / warning / destructive for tone."
      >
        <div className="flex flex-wrap gap-2">
          <Chip>Default</Chip>
          <Chip variant="filled">Filled</Chip>
          <Chip variant="outlined">Outlined</Chip>
          <Chip variant="elevated">Elevated</Chip>
          <Chip variant="success">Success</Chip>
          <Chip variant="warning">Warning</Chip>
          <Chip variant="destructive">Destructive</Chip>
        </div>
      </Story>

      <Story
        title="Sizes"
        description="Three sizes — sm, default, lg — pair naturally with surrounding text scale."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Chip size="sm">Small</Chip>
          <Chip>Default</Chip>
          <Chip size="lg">Large</Chip>
        </div>
      </Story>

      <Story
        title="With leading icon"
        description="Slot any icon before the label — common for hashtag and category chips."
      >
        <div className="flex flex-wrap gap-2">
          <Chip>
            <Hash className="size-3" /> design
          </Chip>
          <Chip>
            <Hash className="size-3" /> engineering
          </Chip>
          <Chip>
            <Hash className="size-3" /> product
          </Chip>
        </div>
      </Story>

      <Story
        title="Closable"
        description="closable renders a built-in dismiss button. Pass onClose to remove the chip from your list."
      >
        <div className="flex flex-wrap gap-2">
          <Chip closable>tag-one</Chip>
          <Chip closable variant="elevated">
            tag-two
          </Chip>
          <Chip closable variant="outlined">
            tag-three
          </Chip>
        </div>
      </Story>

      <Story
        title="ChipGroup with reactive removal"
        description="Combine ChipGroup with map and closable chips — handle onClose to update the list."
      >
        <div className="space-y-3">
          <ChipGroup>
            {() => (
              <>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    variant="elevated"
                    closable
                    onClose={() => removeTag(tag)}
                  >
                    #{tag}
                  </Chip>
                ))}
              </>
            )}
          </ChipGroup>
          {tags.length === 0 && (
            <button
              className="text-muted-foreground text-xs underline"
              onClick={() =>
                setTags(["design", "engineering", "product", "marketing"])
              }
            >
              Reset chips
            </button>
          )}
        </div>
      </Story>

      <Story
        title="Status filters"
        description="Tone variants are useful for filter-bar status chips that double as legend items."
      >
        <ChipGroup>
          {() => (
            <>
              <Chip variant="success">2 passing</Chip>
              <Chip variant="warning">3 pending</Chip>
              <Chip variant="destructive">1 failed</Chip>
            </>
          )}
        </ChipGroup>
      </Story>
    </>
  );
}
