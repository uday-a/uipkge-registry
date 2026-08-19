import Story from "../../components/story/Story";
import { useState } from "react";
import { Label } from "@react-registry/label";
import { Textarea } from "@react-registry/textarea";

export default function TextareaDemo() {
  const [text, setText] = useState("");
  const [autoSizeText, setAutoSizeText] = useState("");
  const [minMaxText, setMinMaxText] = useState("");
  const [countText, setCountText] = useState("");
  const [formatterText, setFormatterText] = useState("");
  const [clearText, setClearText] = useState("Type something…");
  const [maxLengthText, setMaxLengthText] = useState("");

  return (
    <>
      <Story
        title="Default"
        description="Multi-line text input. Two-way bound with v-model."
      >
        <div className="grid max-w-md gap-2">
          <Label htmlFor="msg">Message</Label>
          <Textarea
            id="msg"
            value={text}
            onValueChange={setText}
            placeholder="Type your message here…"
          />
          <p className="text-muted-foreground text-xs">{text.length} chars</p>
        </div>
      </Story>

      <Story
        title="Auto size"
        description="Automatically grows and shrinks with content."
      >
        <div className="grid max-w-md gap-3">
          <Textarea
            value={autoSizeText}
            onValueChange={setAutoSizeText}
            autoSize
            placeholder="Type multiple lines…"
          />
        </div>
      </Story>

      <Story
        title="Auto size with min & max rows"
        description="Limits the height to a range."
      >
        <div className="grid max-w-md gap-3">
          <Textarea
            value={minMaxText}
            onValueChange={setMinMaxText}
            autoSize={{ minRows: 2, maxRows: 6 }}
            placeholder="Type to see height clamping…"
          />
        </div>
      </Story>

      <Story
        title="Show count"
        description="Displays character count below the textarea."
      >
        <div className="grid max-w-md gap-3">
          <Textarea
            value={countText}
            onValueChange={setCountText}
            showCount
            placeholder="Type to see count…"
          />
        </div>
      </Story>

      <Story
        title="Show count with formatter"
        description="Custom count formatting using a function."
      >
        <div className="grid max-w-md gap-3">
          <Textarea
            value={formatterText}
            onValueChange={setFormatterText}
            showCount={{
              formatter: (count: number, max?: number) =>
                `${count}${max ? " / " + max : ""} characters`,
            }}
            maxLength={100}
            placeholder="Custom formatter…"
          />
        </div>
      </Story>

      <Story title="Allow clear" description="Click the X to clear the value.">
        <div className="grid max-w-md gap-3">
          <Textarea
            value={clearText}
            onValueChange={setClearText}
            allowClear
            placeholder="Type something…"
          />
        </div>
      </Story>

      <Story
        title="Max length with show count"
        description="Native maxlength combined with visual counter."
      >
        <div className="grid max-w-md gap-3">
          <Textarea
            value={maxLengthText}
            onValueChange={setMaxLengthText}
            showCount
            maxLength={100}
            placeholder="Limited to 100 characters…"
          />
        </div>
      </Story>

      <Story
        title="Disabled & Readonly"
        description="Disabled prevents interaction; readonly shows value without editing."
      >
        <div className="grid max-w-md gap-3">
          <Textarea defaultValue="Disabled value" disabled />
          <Textarea defaultValue="Read-only value" readOnly />
        </div>
      </Story>

      <Story
        title="Variants with new features"
        description="Outlined, filled, solo, underlined, and plain variants combined with allowClear and showCount."
      >
        <div className="grid max-w-md gap-3">
          <Textarea
            variant="outlined"
            defaultValue="Outlined with clear"
            allowClear
            showCount
            maxLength={50}
          />
          <Textarea
            variant="filled"
            defaultValue="Filled with clear"
            allowClear
            showCount
            maxLength={50}
          />
          <Textarea
            variant="solo"
            defaultValue="Solo with clear"
            allowClear
            showCount
            maxLength={50}
          />
          <Textarea
            variant="underlined"
            defaultValue="Underlined with clear"
            allowClear
            showCount
            maxLength={50}
          />
          <Textarea
            variant="plain"
            defaultValue="Plain with clear"
            allowClear
            showCount
            maxLength={50}
          />
        </div>
      </Story>
    </>
  );
}
