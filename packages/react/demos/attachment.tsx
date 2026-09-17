import Story from "../../components/story/Story";
import { Attachment } from "@react-registry/attachment";

export default function AttachmentDemo() {
  return (
    <>
      <Story
        title="Default"
        description="title + description. Default size, done state, file media."
      >
        <Attachment title="sales-dashboard.pdf" description="PDF · 2.4 MB" />
      </Story>

      <Story
        title="State"
        description="state drives idle, uploading, processing, error, and done."
      >
        <div className="flex flex-col gap-3">
          <Attachment
            title="Add a file"
            description="PNG or JPG"
            state="idle"
            media="image"
          />
          <Attachment
            title="sales-dashboard.pdf"
            description="Uploading · 64%"
            state="uploading"
          />
          <Attachment
            title="invoice.png"
            description="Processing"
            state="processing"
            media="image"
          />
          <Attachment
            title="corrupt.bin"
            description="Upload failed"
            state="error"
            removable
          />
          <Attachment
            title="notes.pdf"
            description="PDF · 2.4 MB"
            state="done"
          />
        </div>
      </Story>

      <Story title="Size" description="size is default, sm, or xs.">
        <div className="flex flex-col gap-3">
          <Attachment
            title="schema.ts"
            description="TypeScript · default"
            media="code"
            size="default"
          />
          <Attachment
            title="schema.ts"
            description="TypeScript · sm"
            media="code"
            size="sm"
          />
          <Attachment
            title="schema.ts"
            description="TypeScript · xs"
            media="code"
            size="xs"
          />
        </div>
      </Story>

      <Story
        title="Orientation"
        description="orientation=vertical stacks media above the title."
      >
        <Attachment
          title="cover.jpg"
          description="JPG · 1.1 MB"
          media="image"
          orientation="vertical"
        />
      </Story>

      <Story
        title="Media"
        description="media is file, image, or code. src fills the thumbnail when media is image."
      >
        <div className="flex flex-col gap-3">
          <Attachment
            title="brief.pdf"
            description="PDF · 820 KB"
            media="file"
          />
          <Attachment title="schema.ts" description="TS · 12 KB" media="code" />
          <Attachment
            title="hero.webp"
            description="WEBP · 940 KB"
            media="image"
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop&q=80"
            alt="Coast"
          />
        </div>
      </Story>

      <Story
        title="Removable"
        description="removable adds a close control. Listen for onRemove."
      >
        <Attachment title="notes.pdf" description="PDF · 2.4 MB" removable />
      </Story>

      <Story title="Title only" description="description is optional.">
        <Attachment title="untitled.bin" />
      </Story>

      <Story
        title="Long title"
        description="Overflow truncates inside the chip."
      >
        <Attachment
          className="max-w-xs"
          title="very-long-quarterly-sales-dashboard-export-final-v3.pdf"
          description="PDF · 18.2 MB"
        />
      </Story>

      <Story
        title="Small removable image"
        description="Combine size, media, src, and removable."
      >
        <Attachment
          title="avatar.png"
          description="PNG · 210 KB"
          size="sm"
          media="image"
          src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200&h=200&fit=crop&q=80"
          alt="City"
          removable
        />
      </Story>

      <Story
        title="Idle image drop"
        description="idle + media=image is the empty chip before a file is chosen."
      >
        <Attachment
          title="Add an image"
          description="PNG or JPG"
          state="idle"
          media="image"
        />
      </Story>
    </>
  );
}
