import { useState, useEffect } from "react";
import Story from "../../components/story/Story";
import { Button } from "@react-registry/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@react-registry/command";
import {
  Calculator,
  Calendar,
  CreditCard,
  Mail,
  Settings,
  Smile,
  User,
} from "lucide-react";

export default function CommandDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  function toggleLoading() {
    setLoading((v) => !v);
  }

  // Cmd-K binding for the dialog story.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setDialogOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <Story
        title="Default"
        description="Searchable command palette with grouped items and an empty state."
      >
        <Command className="max-w-md rounded-lg border shadow-sm">
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar">
                <Calendar />
                Calendar
              </CommandItem>
              <CommandItem value="emoji">
                <Smile />
                Search emoji
              </CommandItem>
              <CommandItem value="profile">
                <User />
                Profile
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Story>

      <Story
        title="With shortcuts"
        description="CommandShortcut renders a right-aligned keyboard hint on each item."
      >
        <Command className="max-w-md rounded-lg border shadow-sm">
          <CommandInput placeholder="Search actions…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem value="profile">
                <User />
                Profile
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem value="mail">
                <Mail />
                Mail
                <CommandShortcut>⌘M</CommandShortcut>
              </CommandItem>
              <CommandItem value="settings">
                <Settings />
                Settings
                <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Story>

      <Story
        title="Multiple groups + separator"
        description="Multiple CommandGroup headings divided by a CommandSeparator."
      >
        <Command className="max-w-md rounded-lg border shadow-sm">
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar">
                <Calendar />
                Calendar
              </CommandItem>
              <CommandItem value="emoji">
                <Smile />
                Search emoji
              </CommandItem>
              <CommandItem value="calculator">
                <Calculator />
                Calculator
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem value="profile">
                <User />
                Profile
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem value="billing">
                <CreditCard />
                Billing
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem value="settings">
                <Settings />
                Settings
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Story>

      <Story
        title="CommandDialog (modal)"
        description="Press ⌘K (or click the button) to open a modal command palette."
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setDialogOpen(true)}>
            Open command menu
            <kbd className="bg-muted text-muted-foreground ml-2 rounded px-1.5 py-0.5 text-xs">
              ⌘K
            </kbd>
          </Button>
          <span className="text-muted-foreground text-sm">
            open = {String(dialogOpen)}
          </span>
        </div>
        <CommandDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <CommandInput placeholder="Type a command or search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem
                value="calendar"
                onSelect={() => setDialogOpen(false)}
              >
                <Calendar />
                Calendar
              </CommandItem>
              <CommandItem value="emoji" onSelect={() => setDialogOpen(false)}>
                <Smile />
                Search emoji
              </CommandItem>
              <CommandItem
                value="calculator"
                onSelect={() => setDialogOpen(false)}
              >
                <Calculator />
                Calculator
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem
                value="profile"
                onSelect={() => setDialogOpen(false)}
              >
                <User />
                Profile
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem
                value="settings"
                onSelect={() => setDialogOpen(false)}
              >
                <Settings />
                Settings
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </Story>

      <Story
        title="Loading & empty state"
        description="Show a loading skeleton then fall through to CommandEmpty when no items match."
      >
        <div className="max-w-md space-y-3">
          <Button variant="outline" size="sm" onClick={toggleLoading}>
            Toggle: {loading ? "Loading" : "Empty"}
          </Button>
          <Command className="rounded-lg border shadow-sm">
            <CommandInput placeholder="Search…" />
            <CommandList>
              {loading ? (
                <div className="space-y-2 p-3">
                  <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-1/2 animate-pulse rounded" />
                  <div className="bg-muted h-4 w-2/3 animate-pulse rounded" />
                </div>
              ) : (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      </Story>
    </>
  );
}
