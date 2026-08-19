import { useState } from "react";
import Story from "../../components/story/Story";
import { ColorPicker } from "@react-registry/color-picker";
import { Label } from "@react-registry/label";

export default function ColorPickerDemo() {
  const [color, setColor] = useState("#3b82f6");
  const [primary, setPrimary] = useState("#22c55e");
  const [accent, setAccent] = useState("#ec4899");
  const [surface, setSurface] = useState("#171717");
  const [locked, setLocked] = useState("#8b5cf6");
  const [brand, setBrand] = useState("#f97316");

  return (
    <>
      <Story
        title="Default"
        description="Color picker bound to a hex string with the current value displayed below."
      >
        <div className="space-y-3">
          <ColorPicker value={color} onValueChange={setColor} />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{color}</code>
          </p>
        </div>
      </Story>

      <Story
        title="Side by side"
        description="Multiple independent pickers driving distinct theme tokens."
      >
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">Primary</p>
            <ColorPicker value={primary} onValueChange={setPrimary} />
            <div
              className="h-8 rounded-md border"
              style={{ backgroundColor: primary }}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Accent</p>
            <ColorPicker value={accent} onValueChange={setAccent} />
            <div
              className="h-8 rounded-md border"
              style={{ backgroundColor: accent }}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Surface</p>
            <ColorPicker value={surface} onValueChange={setSurface} />
            <div
              className="h-8 rounded-md border"
              style={{ backgroundColor: surface }}
            />
          </div>
        </div>
      </Story>

      <Story
        title="Disabled"
        description="Both the color trigger and the hex field become non-interactive."
      >
        <ColorPicker value={locked} onValueChange={setLocked} disabled />
      </Story>

      <Story
        title="Custom presets"
        description="Pass a presets array to override the default swatch palette — pair with hide-hex-input for a swatch-only picker."
      >
        <div className="space-y-3">
          <ColorPicker
            value={color}
            onValueChange={setColor}
            presets={["#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]}
            hideHexInput
          />
          <p className="text-muted-foreground text-xs">
            Value: <code className="text-foreground">{color}</code>
          </p>
        </div>
      </Story>

      <Story
        title="In a form"
        description="Wrapped in a labeled card with a helper sentence — the typical setting layout."
      >
        <div className="bg-card text-card-foreground max-w-sm space-y-3 rounded-lg border p-4">
          <div className="space-y-1">
            <Label htmlFor="brand-color">Brand color</Label>
            <p className="text-muted-foreground text-xs">
              Used on primary buttons, links, and active tabs.
            </p>
          </div>
          <ColorPicker value={brand} onValueChange={setBrand} />
          <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <span
              className="size-4 rounded"
              style={{ backgroundColor: brand }}
            />
            <span>
              Preview: this button uses <code>{brand}</code>
            </span>
          </div>
        </div>
      </Story>
    </>
  );
}
