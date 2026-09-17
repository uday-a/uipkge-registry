import { useState } from "react";
import Story from "../../components/story/Story";
import { SpeedDial, type SpeedDialAction } from "@react-registry/speed-dial";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@react-registry/card";
import {
  Camera,
  FileText,
  Image,
  Mail,
  MapPin,
  MessageSquare,
  Mic,
  Notebook,
  Paperclip,
  Plus,
  Send,
  Share2,
  Video,
} from "lucide-react";

export default function SpeedDialDemo() {
  const [log, setLog] = useState<string[]>([]);

  function push(entry: string) {
    setLog((prev) => {
      const next = [entry, ...prev];
      return next.slice(0, 4);
    });
  }

  const composeActions: SpeedDialAction[] = [
    {
      icon: FileText,
      label: "New document",
      handler: () => push("New document"),
    },
    { icon: Image, label: "New image", handler: () => push("New image") },
    {
      icon: Notebook,
      label: "New notebook",
      handler: () => push("New notebook"),
    },
  ];

  const shareActions: SpeedDialAction[] = [
    { icon: Mail, label: "Email", handler: () => push("Email") },
    { icon: MessageSquare, label: "Message", handler: () => push("Message") },
    { icon: Share2, label: "Copy link", handler: () => push("Copy link") },
  ];

  const mediaActions: SpeedDialAction[] = [
    { icon: Camera, label: "Camera", handler: () => push("Camera") },
    { icon: Video, label: "Video", handler: () => push("Video") },
    { icon: Mic, label: "Audio", handler: () => push("Audio") },
    { icon: MapPin, label: "Location", handler: () => push("Location") },
  ];

  const attachActions: SpeedDialAction[] = [
    {
      icon: Paperclip,
      label: "Attach file",
      handler: () => push("Attach file"),
    },
    {
      icon: Send,
      label: "Send now",
      handler: () => push("Send now"),
      disabled: true,
    },
  ];

  return (
    <>
      <Story
        title="Compose menu (click)"
        description="A document editor's primary action — click the FAB to fan out the 'create new' actions. The log records what fired."
      >
        <div className="flex h-56 items-end gap-8">
          <SpeedDial
            actions={composeActions}
            position="inline"
            label="Create"
          />
          <div className="text-muted-foreground text-xs">
            <p className="mb-1 font-medium">Recent:</p>
            {log.map((entry) => (
              <p key={entry}>{entry}</p>
            ))}
            {log.length === 0 && <p>No actions yet.</p>}
          </div>
        </div>
      </Story>

      <Story
        title="Share menu (hover)"
        description="trigger='hover' opens the dial on mouse enter — ideal for a share affordance that should feel weightless."
      >
        <div className="flex h-56 items-end">
          <SpeedDial
            actions={shareActions}
            trigger="hover"
            position="inline"
            label="Share"
          />
        </div>
      </Story>

      <Story
        title="In a card"
        description="A media capture card with the speed dial anchored to its bottom-right corner via absolute positioning."
      >
        <Card className="relative max-w-md overflow-hidden">
          <CardHeader>
            <CardTitle>New capture</CardTitle>
            <CardDescription>
              Choose how you'd like to start recording.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 text-muted-foreground flex h-32 items-center justify-center rounded-md text-sm">
              Preview area
            </div>
          </CardContent>
          <SpeedDial
            actions={mediaActions}
            absolute
            position="bottom-right"
            label="Capture"
          />
        </Card>
      </Story>

      <Story
        title="Directions"
        description="Expand up, down, left, or right from the trigger. Pick the direction that points into open space in your layout."
      >
        <div className="flex h-64 items-center justify-around gap-8">
          <SpeedDial
            actions={mediaActions}
            direction="up"
            position="inline"
            label="Up"
          />
          <SpeedDial
            actions={mediaActions}
            direction="down"
            position="inline"
            label="Down"
          />
          <SpeedDial
            actions={mediaActions}
            direction="left"
            position="inline"
            label="Left"
          />
          <SpeedDial
            actions={mediaActions}
            direction="right"
            position="inline"
            label="Right"
          />
        </div>
      </Story>

      <Story
        title="Variants & custom icon"
        description="The FAB variant controls the trigger color; pass an icon component to replace the default plus."
      >
        <div className="flex h-56 items-end gap-6">
          <SpeedDial
            actions={composeActions}
            variant="default"
            position="inline"
            label="Default"
          />
          <SpeedDial
            actions={composeActions}
            variant="secondary"
            position="inline"
            label="Secondary"
          />
          <SpeedDial
            actions={composeActions}
            variant="outline"
            icon={Plus}
            position="inline"
            label="Outline"
          />
        </div>
      </Story>

      <Story
        title="Disabled action & keep-open"
        description="Left: 'Send now' is disabled so it can't fire. Right: closeOnAction={false} leaves the dial open after each pick."
      >
        <div className="flex h-56 items-end gap-8">
          <SpeedDial actions={attachActions} position="inline" label="Attach" />
          <SpeedDial
            actions={composeActions}
            closeOnAction={false}
            position="inline"
            label="Keep open"
          />
        </div>
      </Story>

      <Story
        title="Fixed to viewport"
        description="A real fixed speed dial pinned to the demo viewport bottom-right. Scroll — it stays pinned."
      >
        <p className="text-muted-foreground max-w-md text-sm">
          The dial in the corner is live and stays anchored as you scroll.
        </p>
        <SpeedDial actions={composeActions} label="Create" />
      </Story>
    </>
  );
}
