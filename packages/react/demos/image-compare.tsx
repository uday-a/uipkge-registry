import { useState } from "react";
import Story from "../../components/story/Story";
import { ImageCompare } from "@react-registry/image-compare";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@react-registry/card";
import { GripHorizontal } from "lucide-react";

export default function ImageCompareDemo() {
  const [pos, setPos] = useState(50);

  // Photo editing: original vs color-graded (warm graded retouch)
  const photoBefore =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80&sat=-60&con=-20";
  const photoAfter =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&q=80&sat=40&con=20";

  // Architecture / Cityscape: raw blueprint/monochrome vs full color
  const uiBefore =
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop&q=80&sat=-80";
  const uiAfter =
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=600&fit=crop&q=80";

  return (
    <>
      <Story
        title="Photo edit before / after"
        description="Drag the slider to compare an original photo with its color-graded version — the classic retouching reveal."
      >
        <ImageCompare
          beforeSrc={photoBefore}
          afterSrc={photoAfter}
          beforeLabel="Original"
          afterLabel="Edited"
          className="h-72 w-full max-w-2xl"
        />
      </Story>

      <Story
        title="UI redesign"
        description="Show stakeholders the old dashboard vs the new layout in one interactive frame."
      >
        <ImageCompare
          beforeSrc={uiBefore}
          afterSrc={uiAfter}
          beforeLabel="v1.0"
          afterLabel="v2.0"
          className="h-72 w-full max-w-2xl"
        />
      </Story>

      <Story
        title="Controlled slider"
        description="value binds the position (0–100). Pair with a range input for precise, keyboard-friendly control."
      >
        <div className="flex max-w-2xl flex-col gap-3">
          <ImageCompare
            value={pos}
            onValueChange={setPos}
            beforeSrc={photoBefore}
            afterSrc={photoAfter}
            className="h-72 w-full"
          />
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground w-16 tabular-nums">
              {pos.toFixed(0)}%
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              className="flex-1"
            />
          </div>
        </div>
      </Story>

      <Story
        title="Orientation & labels"
        description="Vertical divider and hidden captions for minimalist layouts."
      >
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <ImageCompare
            beforeSrc={photoBefore}
            afterSrc={photoAfter}
            orientation="vertical"
            className="h-80 w-full"
          />
          <ImageCompare
            beforeSrc={uiBefore}
            afterSrc={uiAfter}
            showLabels={false}
            className="h-80 w-full"
          />
        </div>
      </Story>

      <Story
        title="Custom handle"
        description="Replace the default arrow icon with a grip — or hide the handle entirely for a clean divider line."
      >
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <ImageCompare
            beforeSrc={photoBefore}
            afterSrc={photoAfter}
            className="h-72 w-full"
            handle={<GripHorizontal className="text-primary size-5" />}
          />
          <ImageCompare
            beforeSrc={uiBefore}
            afterSrc={uiAfter}
            showHandle={false}
            className="h-72 w-full"
          />
        </div>
      </Story>

      <Story
        title="Disabled & initial position"
        description="disabled locks the slider; set a defaultValue to start the comparison at a specific point."
      >
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <ImageCompare
            beforeSrc={photoBefore}
            afterSrc={photoAfter}
            defaultValue={30}
            disabled
            className="h-72 w-full"
          />
          <ImageCompare
            beforeSrc={uiBefore}
            afterSrc={uiAfter}
            defaultValue={25}
            className="h-72 w-full"
          />
        </div>
      </Story>

      <Story
        title="In a product card"
        description="Before/after comparison embedded in a card with context — the pattern for case studies and portfolios."
      >
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Beach retouch</CardTitle>
            <CardDescription>
              Color grade applied in Lightroom — drag to compare.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageCompare
              beforeSrc={photoBefore}
              afterSrc={photoAfter}
              beforeLabel="SOOC"
              afterLabel="Graded"
              className="h-72 w-full"
            />
          </CardContent>
        </Card>
      </Story>
    </>
  );
}
