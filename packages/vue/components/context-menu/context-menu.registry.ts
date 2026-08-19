import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "context-menu",
  type: "registry:ui",
  categories: ["overlay"],
  framework: "vue",
  description:
    "Right-click menu — same primitives as Dropdown Menu but triggered by `contextmenu` events. Drop on any element you want to attach row actions, file-system style operations, or copy/paste menus to.",
  files: [
    {
      path: "ContextMenu.vue",
      target: "components/ui/context-menu/ContextMenu.vue",
    },
    {
      path: "ContextMenuCheckboxItem.vue",
      target: "components/ui/context-menu/ContextMenuCheckboxItem.vue",
    },
    {
      path: "ContextMenuContent.vue",
      target: "components/ui/context-menu/ContextMenuContent.vue",
    },
    {
      path: "ContextMenuGroup.vue",
      target: "components/ui/context-menu/ContextMenuGroup.vue",
    },
    {
      path: "ContextMenuItem.vue",
      target: "components/ui/context-menu/ContextMenuItem.vue",
    },
    {
      path: "context-menu-item.variants.ts",
      target: "components/ui/context-menu/context-menu-item.variants.ts",
    },
    {
      path: "ContextMenuLabel.vue",
      target: "components/ui/context-menu/ContextMenuLabel.vue",
    },
    {
      path: "ContextMenuPortal.vue",
      target: "components/ui/context-menu/ContextMenuPortal.vue",
    },
    {
      path: "ContextMenuRadioGroup.vue",
      target: "components/ui/context-menu/ContextMenuRadioGroup.vue",
    },
    {
      path: "ContextMenuRadioItem.vue",
      target: "components/ui/context-menu/ContextMenuRadioItem.vue",
    },
    {
      path: "ContextMenuSeparator.vue",
      target: "components/ui/context-menu/ContextMenuSeparator.vue",
    },
    {
      path: "ContextMenuShortcut.vue",
      target: "components/ui/context-menu/ContextMenuShortcut.vue",
    },
    {
      path: "ContextMenuSub.vue",
      target: "components/ui/context-menu/ContextMenuSub.vue",
    },
    {
      path: "ContextMenuSubContent.vue",
      target: "components/ui/context-menu/ContextMenuSubContent.vue",
    },
    {
      path: "ContextMenuSubTrigger.vue",
      target: "components/ui/context-menu/ContextMenuSubTrigger.vue",
    },
    {
      path: "ContextMenuTrigger.vue",
      target: "components/ui/context-menu/ContextMenuTrigger.vue",
    },
    { path: "index.ts", target: "components/ui/context-menu/index.ts" },
  ],
  dependencies: [
    "@vueuse/core",
    "class-variance-authority",
    "lucide-vue-next",
    "reka-ui",
  ],
  registryDependencies: [],
});
