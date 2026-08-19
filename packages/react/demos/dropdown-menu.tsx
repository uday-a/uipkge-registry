import { useState } from "react";
import Story from "../../components/story/Story";
import { Button } from "@react-registry/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@react-registry/dropdown-menu";
import {
  ChevronDown,
  Cloud,
  CreditCard,
  GitBranch,
  HelpCircle,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

export default function DropdownMenuDemo() {
  const [showStatus, setShowStatus] = useState(true);
  const [showActivity, setShowActivity] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [position, setPosition] = useState("center");

  return (
    <>
      <Story
        title="Account menu"
        description="Label + grouped items with separators. Destructive item uses text-destructive."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="size-4" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="size-4" /> Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="size-4" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Keyboard className="size-4" /> Shortcuts
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="size-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Story>

      <Story
        title="With shortcuts"
        description="DropdownMenuShortcut renders a right-aligned hint per item — common for editor menus."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Edit</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem>
              New tab
              <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              New window
              <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              New private window
              <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Print
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Story>

      <Story
        title="With checkbox items"
        description="DropdownMenuCheckboxItem holds v-model:checked state — multiple toggles can stay open across opens."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">View options</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={showStatus}
              onCheckedChange={setShowStatus}
            >
              Status bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showActivity}
              onCheckedChange={setShowActivity}
            >
              Activity bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={showPanel}
              onCheckedChange={setShowPanel}
            >
              Panel
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Story>

      <Story
        title="With radio group"
        description="DropdownMenuRadioGroup holds a single selected value across DropdownMenuRadioItem children."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Panel position</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Panel position</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
            >
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="center">
                Center
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                Bottom
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </Story>

      <Story
        title="With submenus"
        description="DropdownMenuSub + SubTrigger + SubContent build a nested cascading menu."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Help</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem>
              <LifeBuoy className="size-4" /> Support
            </DropdownMenuItem>
            <DropdownMenuItem>
              <GitBranch className="size-4" /> GitHub
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <UserPlus className="size-4" /> Invite teammates
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail className="size-4" /> Email
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare className="size-4" /> Message
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <PlusCircle className="size-4" /> Send invite link
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <HelpCircle className="size-4" /> Keyboard shortcuts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              <Cloud className="size-4" /> API (coming soon)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Story>

      <Story
        title="Icon trigger (row action)"
        description="Common table-row pattern — icon-only trigger that opens a small action menu."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Row actions">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuItem>Rename…</DropdownMenuItem>
            <DropdownMenuItem>Move to folder…</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Story>

      <Story
        title="Action menu"
        description="Chevron-trigger pattern for create-new menus."
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Plus className="size-3.5" /> New
              <ChevronDown className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuItem>
              <Plus className="size-4" /> Project
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users className="size-4" /> Team
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Cloud className="size-4" /> Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Story>
    </>
  );
}
