import { useState } from "react";
import Story from "../../components/story/Story";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@react-registry/card";
import { TreeSelect } from "@react-registry/tree-select";
import type { TreeSelectNode } from "@react-registry/tree-select";

const fileTree: TreeSelectNode[] = [
  {
    value: "src",
    label: "src",
    children: [
      {
        value: "src/components",
        label: "components",
        children: [
          { value: "src/components/Button.tsx", label: "Button.tsx" },
          { value: "src/components/Card.tsx", label: "Card.tsx" },
          { value: "src/components/Dialog.tsx", label: "Dialog.tsx" },
        ],
      },
      {
        value: "src/hooks",
        label: "hooks",
        children: [
          { value: "src/hooks/useToast.ts", label: "useToast.ts" },
          { value: "src/hooks/useTheme.ts", label: "useTheme.ts" },
        ],
      },
      { value: "src/App.tsx", label: "App.tsx" },
      { value: "src/main.tsx", label: "main.tsx" },
    ],
  },
  { value: "package.json", label: "package.json" },
  { value: "tsconfig.json", label: "tsconfig.json" },
];

const orgTree: TreeSelectNode[] = [
  {
    value: "engineering",
    label: "Engineering",
    children: [
      { value: "frontend", label: "Frontend Team" },
      { value: "backend", label: "Backend Team" },
      { value: "devops", label: "DevOps Team" },
    ],
  },
  {
    value: "design",
    label: "Design",
    children: [
      { value: "ux", label: "UX Team" },
      { value: "visual", label: "Visual Team" },
    ],
  },
  {
    value: "product",
    label: "Product",
    children: [
      { value: "pm", label: "Product Managers" },
      { value: "analytics", label: "Analytics" },
    ],
  },
];

const restrictedTree: TreeSelectNode[] = [
  {
    value: "folder1",
    label: "Folder 1",
    children: [
      { value: "file1", label: "file1.txt" },
      { value: "file2", label: "file2.txt", disabled: true },
    ],
  },
  { value: "locked", label: "Locked folder", disabled: true, children: [] },
];

export default function TreeSelectDemo() {
  const [fileValue, setFileValue] = useState<string | null>(null);
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [smValue, setSmValue] = useState<string | null>(null);
  const [lgValue, setLgValue] = useState<string | null>(null);
  const [orgValue, setOrgValue] = useState<string[]>(["frontend", "backend"]);

  return (
    <>
      <Story
        title="File picker"
        description="Select a single file from a nested project tree — common in editor open-file dialogs."
      >
        <div className="max-w-md space-y-2">
          <TreeSelect
            value={fileValue}
            onValueChange={setFileValue}
            data={fileTree}
            placeholder="Select a file..."
            className="w-full"
          />
          <p className="text-muted-foreground text-xs">
            Selected: {fileValue ?? "none"}
          </p>
        </div>
      </Story>

      <Story
        title="Multi-select with checkboxes"
        description="Pick multiple files at once. Selecting a parent cascades to all leaf descendants."
      >
        <div className="max-w-md space-y-2">
          <TreeSelect
            value={multiValue}
            onValueChange={setMultiValue}
            data={fileTree}
            multiple
            placeholder="Select files..."
            className="w-full"
          />
          <p className="text-muted-foreground text-xs">
            {multiValue.length} file(s) selected
          </p>
        </div>
      </Story>

      <Story
        title="Size variants"
        description="Small, default, and large triggers side by side for comparison."
      >
        <div className="max-w-md space-y-3">
          <TreeSelect
            value={smValue}
            onValueChange={setSmValue}
            data={fileTree}
            size="sm"
            placeholder="Small..."
            className="w-full"
          />
          <TreeSelect
            data={fileTree}
            placeholder="Default..."
            className="w-full"
          />
          <TreeSelect
            value={lgValue}
            onValueChange={setLgValue}
            data={fileTree}
            size="lg"
            placeholder="Large..."
            className="w-full"
          />
        </div>
      </Story>

      <Story
        title="Loading & disabled states"
        description="Spinner while data loads, and a fully disabled control."
      >
        <div className="max-w-md space-y-3">
          <TreeSelect
            data={fileTree}
            loading
            placeholder="Loading files..."
            className="w-full"
          />
          <TreeSelect
            data={fileTree}
            disabled
            placeholder="Disabled"
            className="w-full"
          />
        </div>
      </Story>

      <Story
        title="Restricted nodes"
        description="Individual nodes can be disabled — locked folders and protected files stay non-selectable."
      >
        <div className="max-w-md">
          <TreeSelect
            data={restrictedTree}
            placeholder="Select a file..."
            className="w-full"
          />
        </div>
      </Story>

      <Story
        title="In context: Team permissions"
        description="Assigning teams to a project inside a settings card. Pre-selected teams and multi-select with live count."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Project access</CardTitle>
            <CardDescription>
              Choose which teams can collaborate on this repository.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TreeSelect
              value={orgValue}
              onValueChange={setOrgValue}
              data={orgTree}
              multiple
              defaultExpandAll
              placeholder="Select teams..."
              className="w-full"
            />
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>{orgValue.length} team(s) granted access</span>
              <span className="text-foreground font-medium">
                {orgValue.join(", ") || "No access"}
              </span>
            </div>
          </CardContent>
        </Card>
      </Story>
    </>
  );
}
