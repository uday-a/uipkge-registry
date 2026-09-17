import Story from "../../components/story/Story";
import { useState } from "react";
import { Rating } from "@react-registry/rating";

export default function RatingDemo() {
  const [value, setValue] = useState(3.5);
  const [sized, setSized] = useState(4);
  const [variantValue, setVariantValue] = useState(4.5);
  const [tenScale, setTenScale] = useState(7);
  const [reviewScore, setReviewScore] = useState(4);
  const [lockedRating, setLockedRating] = useState(3);
  const [clearableRating, setClearableRating] = useState(2);
  const [valued, setValued] = useState(3.5);
  const [tooltipped, setTooltipped] = useState(3);
  const [integerOnly, setIntegerOnly] = useState(4);

  return (
    <>
      <Story
        title="Default"
        description="Star rating input with half-step support up to a max of five."
      >
        <div className="space-y-3">
          <Rating
            value={value}
            onValueChange={setValue}
            max={5}
            halfIncrements
          />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{value}</code>
          </p>
        </div>
      </Story>

      <Story title="Sizes" description="Five sizes from x-small to x-large.">
        <div className="space-y-2">
          <Rating value={sized} onValueChange={setSized} size="x-small" />
          <Rating value={sized} onValueChange={setSized} size="small" />
          <Rating value={sized} onValueChange={setSized} size="medium" />
          <Rating value={sized} onValueChange={setSized} size="large" />
          <Rating value={sized} onValueChange={setSized} size="x-large" />
        </div>
      </Story>

      <Story
        title="Variants"
        description="Outlined (default), filled, and soft background variants."
      >
        <div className="space-y-3">
          <Rating
            value={variantValue}
            onValueChange={setVariantValue}
            variant="outlined"
            halfIncrements
          />
          <Rating
            value={variantValue}
            onValueChange={setVariantValue}
            variant="filled"
            halfIncrements
          />
          <Rating
            value={variantValue}
            onValueChange={setVariantValue}
            variant="soft"
            halfIncrements
          />
        </div>
      </Story>

      <Story
        title="Custom max"
        description="Change the number of stars with the max prop."
      >
        <div className="space-y-3">
          <Rating
            value={tenScale}
            onValueChange={setTenScale}
            max={10}
            size="small"
          />
          <p className="text-muted-foreground text-xs">{tenScale} / 10</p>
        </div>
      </Story>

      <Story
        title="Read-only"
        description="Non-interactive display of an existing score."
      >
        <div className="flex items-center gap-2">
          <Rating value={4.5} max={5} halfIncrements readonly />
          <span className="text-muted-foreground text-xs">
            (4.5 from 1,284 reviews)
          </span>
        </div>
      </Story>

      <Story title="Disabled" description="Visually muted and non-interactive.">
        <Rating
          value={lockedRating}
          onValueChange={setLockedRating}
          max={5}
          disabled
        />
      </Story>

      <Story
        title="Clearable"
        description="Click the currently selected star to reset to zero."
      >
        <div className="space-y-2">
          <Rating
            value={clearableRating}
            onValueChange={setClearableRating}
            max={5}
            clearable
          />
          <p className="text-muted-foreground text-xs">
            Click the active star to clear. Value:{" "}
            <code className="text-foreground">{clearableRating}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Show value"
        description="Display the current numeric value next to the stars."
      >
        <Rating
          value={valued}
          onValueChange={setValued}
          max={5}
          halfIncrements
          showValue
        />
      </Story>

      <Story
        title="With tooltips"
        description="Provide one tooltip per star via the tooltips array."
      >
        <Rating
          value={tooltipped}
          onValueChange={setTooltipped}
          max={5}
          tooltips={["Terrible", "Poor", "Average", "Good", "Excellent"]}
        />
      </Story>

      <Story
        title="Integer-only"
        description="Omit halfIncrements to restrict input to whole stars."
      >
        <Rating value={integerOnly} onValueChange={setIntegerOnly} max={5} />
      </Story>

      <Story
        title="Hover effect"
        description="Stars scale up on hover for stronger feedback."
      >
        <Rating
          value={reviewScore}
          onValueChange={setReviewScore}
          max={5}
          hover
        />
      </Story>
    </>
  );
}
