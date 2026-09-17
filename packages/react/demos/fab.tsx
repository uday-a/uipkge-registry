import { useState } from "react";
import Story from "../../components/story/Story";
import { Fab } from "@react-registry/fab";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@react-registry/card";
import { Edit, Mail, MessageSquare, Plus, Send, Trash2 } from "lucide-react";

export default function FabDemo() {
  const [clicks, setClicks] = useState(0);
  const [lastAction, setLastAction] = useState<string>("");

  const handleFabClick = (label: string) => {
    setClicks((c) => c + 1);
    setLastAction(label);
    setTimeout(() => setLastAction(""), 1500);
  };

  return (
    <>
      <Story
        title="In a settings panel"
        description="A primary action FAB anchored to the bottom-right of a card — the classic 'add new' affordance in a list view."
      >
        <Card className="relative max-w-md overflow-hidden">
          <CardHeader>
            <CardTitle>Team members</CardTitle>
            <CardDescription>5 of 10 seats used.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="bg-muted/40 flex items-center justify-between rounded-md px-3 py-2 text-sm">
                <span>Alex Morgan</span>
                <span className="text-muted-foreground text-xs">Owner</span>
              </div>
              <div className="bg-muted/40 flex items-center justify-between rounded-md px-3 py-2 text-sm">
                <span>Priya Sharma</span>
                <span className="text-muted-foreground text-xs">Admin</span>
              </div>
              <div className="bg-muted/40 flex items-center justify-between rounded-md px-3 py-2 text-sm">
                <span>Diego Reyes</span>
                <span className="text-muted-foreground text-xs">Editor</span>
              </div>
            </div>
          </CardContent>
          <Fab
            absolute
            position="bottom-right"
            aria-label="Invite member"
            onClick={() => handleFabClick("Invite member")}
          >
            <Plus />
          </Fab>
        </Card>
        <p className="text-muted-foreground mt-3 text-xs">
          Invites triggered: {clicks}{" "}
          {lastAction ? `(Clicked ${lastAction})` : ""}
        </p>
      </Story>

      <Story
        title="Variants & sizes"
        description="All four color variants and three circular sizes in one row, so the visual weight reads at a glance."
      >
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-4">
            <Fab
              position="inline"
              aria-label="Add"
              onClick={() => handleFabClick("Add")}
            >
              <Plus />
            </Fab>
            <Fab
              variant="secondary"
              position="inline"
              aria-label="Edit"
              onClick={() => handleFabClick("Edit")}
            >
              <Edit />
            </Fab>
            <Fab
              variant="destructive"
              position="inline"
              aria-label="Delete"
              onClick={() => handleFabClick("Delete")}
            >
              <Trash2 />
            </Fab>
            <Fab
              variant="outline"
              position="inline"
              aria-label="Send"
              onClick={() => handleFabClick("Send")}
            >
              <Send />
            </Fab>
          </div>
          <div className="flex items-center gap-4">
            <Fab
              size="mini"
              position="inline"
              aria-label="Mini"
              onClick={() => handleFabClick("Mini")}
            >
              <Plus />
            </Fab>
            <Fab
              size="default"
              position="inline"
              aria-label="Default"
              onClick={() => handleFabClick("Default")}
            >
              <Plus />
            </Fab>
            <Fab
              size="large"
              position="inline"
              aria-label="Large"
              onClick={() => handleFabClick("Large")}
            >
              <Plus />
            </Fab>
          </div>
        </div>
      </Story>

      <Story
        title="Extended FAB"
        description="Pass label to render a pill-shaped extended FAB — used for the primary action on a screen when a label aids discoverability."
      >
        <div className="flex flex-wrap items-center gap-4">
          <Fab
            label="Compose"
            position="inline"
            onClick={() => handleFabClick("Compose")}
          >
            <Mail />
          </Fab>
          <Fab
            label="New message"
            variant="secondary"
            position="inline"
            onClick={() => handleFabClick("New message")}
          >
            <MessageSquare />
          </Fab>
        </div>
      </Story>

      <Story
        title="Positioning"
        description="Five anchor positions rendered inside a positioned preview box. In a real page these are fixed to the viewport."
      >
        <div className="border-border relative h-56 w-full overflow-hidden rounded-md border">
          <Fab position="top-left" aria-label="Top left">
            <Plus />
          </Fab>
          <Fab position="top-right" aria-label="Top right">
            <Plus />
          </Fab>
          <Fab position="bottom-left" aria-label="Bottom left">
            <Plus />
          </Fab>
          <Fab position="bottom-right" aria-label="Bottom right">
            <Plus />
          </Fab>
          <Fab
            position="bottom-center"
            label="Center"
            aria-label="Bottom center"
          >
            <Plus />
          </Fab>
        </div>
      </Story>

      <Story
        title="With badge"
        description="Layer a notification count over the FAB — common for a messaging compose button with unread drafts."
      >
        <div className="relative w-fit">
          <Fab position="inline" aria-label="Messages">
            <Mail />
          </Fab>
          <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold">
            3
          </span>
        </div>
      </Story>

      <Story
        title="Disabled"
        description="Non-interactive FABs are dimmed and ignore clicks."
      >
        <div className="flex items-center gap-4">
          <Fab disabled position="inline" aria-label="Disabled">
            <Plus />
          </Fab>
          <Fab disabled label="Disabled" position="inline">
            <Plus />
          </Fab>
        </div>
      </Story>

      <Story
        title="Fixed to viewport"
        description="A real fixed FAB pinned to the demo viewport bottom-right. Scroll the page — it stays put."
      >
        <p className="text-muted-foreground max-w-md text-sm">
          The button in the corner is live. It remains anchored to the viewport
          as you scroll.
        </p>
        <Fab label="Action" aria-label="Fixed action">
          <Plus />
        </Fab>
      </Story>
    </>
  );
}
