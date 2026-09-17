import { useState } from "react";
import Story from "../../components/story/Story";
import { Button } from "@react-registry/button";
import { Calendar } from "@react-registry/calendar";
import { Input } from "@react-registry/input";
import { Label } from "@react-registry/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@react-registry/popover";
import { RadioGroup, RadioGroupItem } from "@react-registry/radio-group";
import {
  CalendarDays,
  Filter,
  MoreHorizontal,
  Settings,
  Share2,
} from "lucide-react";

export default function PopoverDemo() {
  const [status, setStatus] = useState("active");
  const [tier, setTier] = useState("pro");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Story
        title="With form fields"
        description="Click the trigger to open. PopoverContent floats above the page and traps focus until dismissed."
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Dimensions</h4>
              <p className="text-muted-foreground text-sm">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="mt-4 grid gap-2">
              <div className="grid grid-cols-3 items-center gap-3">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  defaultValue="100%"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-3">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  defaultValue="25px"
                  className="col-span-2 h-8"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </Story>

      <Story
        title="Compact info"
        description="Use a smaller width for short summaries — session info, account hover, etc."
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              Show details
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 space-y-1 text-sm">
            <p className="font-medium">Active session</p>
            <p className="text-muted-foreground text-xs">
              Started 2h ago · IP 192.0.2.1
            </p>
          </PopoverContent>
        </Popover>
      </Story>

      <Story
        title="Sides + alignment"
        description="side controls top / right / bottom / left; align controls start / center / end along that side."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Top · start
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-44">
              Aligned to the start of the trigger's top edge.
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Right · center
              </Button>
            </PopoverTrigger>
            <PopoverContent side="right" align="center" className="w-44">
              Centered on the right side.
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                Bottom · end
              </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="end" className="w-44">
              Aligned to the end of the bottom edge.
            </PopoverContent>
          </Popover>
        </div>
      </Story>

      <Story
        title="Filter chips"
        description="Common pattern — an icon trigger that opens a panel of filter controls."
      >
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="size-3.5" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs tracking-wider uppercase">
                  Status
                </Label>
                <RadioGroup
                  value={status}
                  onValueChange={setStatus}
                  className="flex gap-3"
                >
                  <label className="flex items-center gap-1.5 text-sm">
                    {" "}
                    <RadioGroupItem value="all" /> All{" "}
                  </label>
                  <label className="flex items-center gap-1.5 text-sm">
                    {" "}
                    <RadioGroupItem value="active" /> Active{" "}
                  </label>
                  <label className="flex items-center gap-1.5 text-sm">
                    {" "}
                    <RadioGroupItem value="archived" /> Archived{" "}
                  </label>
                </RadioGroup>
              </div>
              <div className="space-y-1.5">
                <Label className="text-muted-foreground text-xs tracking-wider uppercase">
                  Tier
                </Label>
                <RadioGroup
                  value={tier}
                  onValueChange={setTier}
                  className="flex gap-3"
                >
                  <label className="flex items-center gap-1.5 text-sm">
                    {" "}
                    <RadioGroupItem value="free" /> Free{" "}
                  </label>
                  <label className="flex items-center gap-1.5 text-sm">
                    {" "}
                    <RadioGroupItem value="pro" /> Pro{" "}
                  </label>
                  <label className="flex items-center gap-1.5 text-sm">
                    {" "}
                    <RadioGroupItem value="ent" /> Enterprise{" "}
                  </label>
                </RadioGroup>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </Story>

      <Story
        title="Icon-only quick actions"
        description="Each row-action button can open a contextual popover for delete-confirm, share-options, etc."
      >
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Settings">
                <Settings />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 text-sm">
              <p className="mb-2 font-medium">Quick settings</p>
              <p className="text-muted-foreground text-xs">
                Choose a default view for new tabs.
              </p>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Share">
                <Share2 />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 space-y-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                Copy link
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                Email
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                Slack
              </Button>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Schedule">
                <CalendarDays />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More">
                <MoreHorizontal />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 space-y-0.5">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                Duplicate
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start"
              >
                Archive
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive w-full justify-start"
              >
                Delete
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </Story>

      <Story
        title="Controlled with v-model:open"
        description="Drive open state externally for programmatic open / close (form submission, keyboard shortcut, etc.)."
      >
        <div className="flex items-center gap-3">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">Toggle externally</Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 text-sm">
              <p>Controlled via v-model:open.</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Click 'Close' to dismiss.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </PopoverContent>
          </Popover>
          <span className="text-muted-foreground text-xs">
            open = {String(open)}
          </span>
        </div>
      </Story>

      <Story
        title="Persistent (localStorage)"
        description="Pass persist as a key. The open state survives page reload."
      >
        <Popover persist="demo-persist-1">
          <PopoverTrigger asChild>
            <Button variant="outline">Toggle, then reload</Button>
          </PopoverTrigger>
          <PopoverContent>I remember my state across reloads.</PopoverContent>
        </Popover>
      </Story>

      <Story
        title="Close behavior - manual"
        description='closeBehavior="manual" ignores click-outside and Escape. Use a Close button.'
      >
        <Popover closeBehavior="manual">
          <PopoverTrigger asChild>
            <Button variant="outline">Open manual</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-2">
              <p className="text-sm">
                I won't close on outside click or Escape.
              </p>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline">
                  Close
                </Button>
              </PopoverTrigger>
            </div>
          </PopoverContent>
        </Popover>
      </Story>

      <Story
        title="Close behavior - click-outside only"
        description="Escape is suppressed; clicking outside still closes."
      >
        <Popover closeBehavior="click-outside">
          <PopoverTrigger asChild>
            <Button variant="outline">Open click-outside-only</Button>
          </PopoverTrigger>
          <PopoverContent>
            Press Escape - nothing happens. Click outside - I close.
          </PopoverContent>
        </Popover>
      </Story>
    </>
  );
}
