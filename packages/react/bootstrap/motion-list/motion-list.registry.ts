import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "motion-list",
  type: "registry:style",
  title: "Motion preset — animated sortable lists",
  categories: ["motion"],
  description:
    "Drop-in transition styles for sortable lists, kanban columns, and reorderable cards. The enter/leave/move class convention pairs with any list-animation layer that toggles `motion-list-*` classes — siblings reflow smoothly while items fade-and-scale on enter/leave. Leaving items are taken out of layout flow (position: absolute) so the parent collapses immediately instead of waiting for the leave fade. All four timings and the settle curve are CSS variables (`--motion-list-curve`, `--motion-list-duration-{enter,leave,move}`, `--motion-list-leave-width`) so consumers tune per-context with one line. Consumed by `@uipkge/board` by default; usable standalone for any reorderable list. Tiny — one .css file, zero JS.",
  files: [{ path: "motion-list.css", target: "app/motion-list.css" }],
  dependencies: [],
  registryDependencies: [],
});
