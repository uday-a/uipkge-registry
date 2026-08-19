import Story from "../../components/story/Story";
import { useState } from "react";
import { TreeView, type TreeViewItem } from "@react-registry/tree-view";
import { FileCode, FileText, Folder, Hash, Settings, User } from "lucide-react";

const fileTree: TreeViewItem[] = [
  {
    id: "1",
    label: "src",
    icon: Folder,
    children: [
      {
        id: "1-1",
        label: "components",
        icon: Folder,
        children: [
          { id: "1-1-1", label: "Button.tsx", icon: FileCode },
          { id: "1-1-2", label: "Card.tsx", icon: FileCode },
          { id: "1-1-3", label: "Dialog.tsx", icon: FileCode },
        ],
      },
      {
        id: "1-2",
        label: "hooks",
        icon: Folder,
        children: [
          { id: "1-2-1", label: "useToast.ts", icon: FileCode },
          { id: "1-2-2", label: "useTheme.ts", icon: FileCode },
        ],
      },
      { id: "1-3", label: "App.tsx", icon: FileCode },
      { id: "1-4", label: "main.ts", icon: FileCode },
    ],
  },
  { id: "2", label: "package.json", icon: FileText },
  { id: "3", label: "tsconfig.json", icon: FileText },
  { id: "4", label: "README.md", icon: FileText, disabled: true },
];

const channels: TreeViewItem[] = [
  {
    id: "general",
    label: "General",
    icon: Hash,
    children: [
      { id: "general-announcements", label: "announcements", icon: Hash },
      { id: "general-random", label: "random", icon: Hash },
      { id: "general-help", label: "help", icon: Hash, selected: true },
    ],
  },
  {
    id: "design",
    label: "Design",
    icon: Hash,
    children: [
      { id: "design-feedback", label: "feedback", icon: Hash },
      { id: "design-shipped", label: "shipped", icon: Hash },
    ],
  },
];

const settingsTree: TreeViewItem[] = [
  {
    id: "account",
    label: "Account",
    icon: User,
    children: [
      { id: "account-profile", label: "Profile" },
      { id: "account-security", label: "Security" },
      { id: "account-notifications", label: "Notifications" },
    ],
  },
  {
    id: "workspace",
    label: "Workspace",
    icon: Settings,
    children: [
      { id: "workspace-members", label: "Members" },
      { id: "workspace-billing", label: "Billing" },
      { id: "workspace-integrations", label: "Integrations" },
    ],
  },
];

export default function TreeViewDemo() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkSelected, setCheckSelected] = useState<string | null>(null);

  return (
    <>
      <Story
        title="Default"
        description="Expandable file tree with continuous Discord-style elbow connectors. Defaults to fully expanded."
      >
        <TreeView
          items={fileTree}
          defaultExpanded
          selectedId={selectedId}
          className="max-w-sm"
          onSelect={(item) => setSelectedId(item.id)}
        />
      </Story>

      <Story
        title="Collapsed by default"
        description="Set default-expanded to false (the default) to start fully collapsed; click chevrons to drill in."
      >
        <TreeView items={fileTree} className="max-w-sm" />
      </Story>

      <Story
        title="With checkboxes"
        description="show-checkboxes adds a 14px checkbox before each row's icon for selection-style trees."
      >
        <TreeView
          items={settingsTree}
          defaultExpanded
          showCheckboxes
          selectedId={checkSelected}
          className="max-w-sm"
          onSelect={(item) => setCheckSelected(item.id)}
        />
      </Story>

      <Story
        title="Without icons"
        description="show-icons=false drops the leading icon column for a tighter, label-only layout."
      >
        <TreeView
          items={settingsTree}
          defaultExpanded
          showIcons={false}
          className="max-w-sm"
        />
      </Story>

      <Story
        title="Channel-style"
        description="Discord-style channel tree with one item pre-selected."
      >
        <TreeView items={channels} defaultExpanded className="max-w-sm" />
      </Story>
    </>
  );
}
