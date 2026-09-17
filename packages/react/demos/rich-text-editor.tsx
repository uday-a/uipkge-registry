import Story from "../../components/story/Story";
import { useState } from "react";
import { RichTextEditor } from "@react-registry/rich-text-editor";

export default function RichTextEditorDemo() {
  const [empty, setEmpty] = useState("");
  const [filled, setFilled] = useState(
    "<p>Hello <strong>world</strong></p><p>This is a <em>rich text editor</em> demo.</p>",
  );
  const [tall, setTall] = useState(
    "<p>This editor has a taller minimum height for longer-form writing.</p>",
  );
  const [left, setLeft] = useState("<p>Left pane content.</p>");
  const [right, setRight] = useState("<p>Right pane content.</p>");

  return (
    <>
      <Story
        title="Empty with placeholder"
        description="No initial content — placeholder text shows until the user starts typing."
      >
        <div className="space-y-2">
          <RichTextEditor
            value={empty}
            onValueChange={setEmpty}
            placeholder="Write a description..."
            minHeight="120px"
          />
          <p className="text-muted-foreground text-xs">
            Length: <code className="text-foreground">{empty.length}</code>{" "}
            chars
          </p>
        </div>
      </Story>

      <Story
        title="Pre-filled content"
        description="Initial HTML rendered into the editor — try selecting text and toggling the toolbar."
      >
        <RichTextEditor
          value={filled}
          onValueChange={setFilled}
          minHeight="150px"
        />
      </Story>

      <Story
        title="Custom min-height"
        description="Taller editor surface for long-form content."
      >
        <RichTextEditor
          value={tall}
          onValueChange={setTall}
          placeholder="Draft your post..."
          minHeight="280px"
        />
      </Story>

      <Story
        title="Side-by-side editing"
        description="Two independent editor instances — useful for translations or before/after diffs."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium">English</p>
            <RichTextEditor
              value={left}
              onValueChange={setLeft}
              placeholder="Source..."
              minHeight="160px"
            />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Japanese</p>
            <RichTextEditor
              value={right}
              onValueChange={setRight}
              placeholder="Translation..."
              minHeight="160px"
            />
          </div>
        </div>
      </Story>
    </>
  );
}
