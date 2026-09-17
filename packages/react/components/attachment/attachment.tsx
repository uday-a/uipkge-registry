import * as React from "react";
import {
  FileCode,
  FileText,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  attachmentMediaVariants,
  attachmentVariants,
  type AttachmentVariants,
} from "./attachment.variants";

export interface AttachmentProps
  extends
    Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    AttachmentVariants {
  title: string;
  description?: string;
  state?: "idle" | "uploading" | "processing" | "error" | "done";
  media?: "file" | "image" | "code";
  src?: string;
  alt?: string;
  removable?: boolean;
  onRemove?: () => void;
}

const Attachment = React.forwardRef<HTMLDivElement, AttachmentProps>(
  (
    {
      title,
      description,
      state = "done",
      size = "default",
      orientation = "horizontal",
      media = "file",
      src,
      alt = "",
      removable = false,
      onRemove,
      className,
      ...props
    },
    ref,
  ) => {
    const busy = state === "uploading" || state === "processing";
    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="attachment"
        data-state={state}
        data-size={size}
        data-orientation={orientation}
        className={cn(attachmentVariants({ size, orientation }), className)}
        {...props}
      >
        <div
          data-slot="attachment-media"
          className={cn(attachmentMediaVariants({ size }))}
        >
          {src && media === "image" && !busy ? (
            <img src={src} alt={alt} className="size-full object-cover" />
          ) : busy ? (
            <Loader2
              className="size-4 motion-safe:animate-spin"
              aria-hidden="true"
            />
          ) : media === "code" ? (
            <FileCode aria-hidden="true" />
          ) : media === "image" ? (
            <ImageIcon aria-hidden="true" />
          ) : (
            <FileText aria-hidden="true" />
          )}
        </div>
        <div
          data-slot="attachment-content"
          className="min-w-0 flex-1 leading-tight"
        >
          <span
            data-slot="attachment-title"
            className={cn(
              "block truncate font-medium",
              busy && "animate-pulse",
            )}
          >
            {title}
          </span>
          {description ? (
            <span
              data-slot="attachment-description"
              className={cn(
                "text-muted-foreground mt-0.5 block truncate text-xs",
                state === "error" && "text-destructive/80",
              )}
            >
              {description}
            </span>
          ) : null}
        </div>
        {removable ? (
          <button
            type="button"
            data-slot="attachment-remove"
            className="text-muted-foreground hover:bg-accent hover:text-foreground relative z-10 inline-flex size-7 shrink-0 items-center justify-center rounded-md"
            aria-label={`Remove ${title}`}
            onClick={onRemove}
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </div>
    );
  },
);
Attachment.displayName = "Attachment";

export { Attachment };
