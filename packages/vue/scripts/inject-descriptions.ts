/**
 * One-shot script: injects a curated `description` field into every
 * `*.registry.ts` sidecar that doesn't already have one.
 *
 * Idempotent — files with `description:` already present are skipped.
 * After running, run `npm run build:registry` to refresh the JSON output.
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const DESCRIPTIONS: Record<string, string> = {
  accordion:
    "Vertically stacked, collapsible panels — one or many open at a time. Use for FAQs, settings groups, and any place where space is tight but content needs to stay browsable. Built on reka-ui with smooth animation and full keyboard support.",
  "advance-select":
    "Searchable, async-capable select with keyboard navigation, multi-select, and option grouping. Drop in when the native `<select>` or the basic Select primitive runs out of room — large lists, debounced server-side filtering, custom rendered items.",
  alert:
    "Static, in-flow notice block with a leading icon, title, and description. Use for inline page-level messages — info banners, success confirmations, warning callouts. Five tones: default, info, success, warning, destructive.",
  "alert-modal":
    "Props-driven shortcut for confirm and destructive prompts — pass `title`, `description`, `actionLabel`, and a `tone` and you get a fully styled modal with a leading icon ring, action button, and optional async loading state. Skip it and use Dialog when you need a free-form modal instead.",
  "aspect-ratio":
    "Wraps content (typically images, video, or iframes) at a fixed width:height ratio so it never letterboxes or jumps as it loads. Common ratios: 16/9 for video, 1/1 for avatars, 4/3 for cards.",
  avatar:
    "Round or rounded-square user image with a fallback that shows initials or an icon when the image is missing or fails to load. Sizes from xs to 2xl, optional status dot, and a group composition for stacked avatar lists.",
  badge:
    "Small inline label for status, counts, or tags — sits beside other content, not as a standalone control. Six variants (default, secondary, info, success, warning, destructive) plus an outline style.",
  breadcrumb:
    "Hierarchical wayfinding strip that shows a user’s position in a nested page tree. Built from `<BreadcrumbList>` and `<BreadcrumbItem>` primitives so you can drop in custom separators, dropdowns for collapsed parents, and ellipsis for overflow.",
  button:
    "The primary clickable primitive — six variants (default, destructive, outline, secondary, ghost, link), four sizes, and an as-child mode that lets you render a router-link or anchor with full button styling.",
  calendar:
    "Single-month calendar grid for date selection, built on reka-ui’s Calendar primitive. Pair it with a Popover or use it inline. Supports min/max bounds, disabled dates, and locale formatting.",
  card: "Bordered container with an opinionated header / content / footer layout. Use it as the wrapper around any self-contained block of content — settings panels, dashboard tiles, list cells.",
  carousel:
    "Horizontal scroller with previous/next controls and optional autoplay. Built on Embla — pinpoint snap, momentum, and fully keyboard-accessible. Drop in images, cards, or any custom slide content.",
  charts:
    "Six chart types (line, area, bar, pie, donut, sparkline) wrapped around Apache ECharts with sensible defaults: registry tokens for theming, tooltip styling, and dark mode wired up. Drop a `data` array in and go.",
  checkbox:
    "Standalone or in-form binary toggle, built on reka-ui. Supports indeterminate state for tri-state lists, sizes, and proper keyboard / screen-reader behavior. Pair with Label for clickable text.",
  chip: "Compact, removable tag — typically used inside `tags-input` or as a filter pill. Two visual styles (filled / outlined), six tones, and an optional close button.",
  "code-block":
    "Read-only code preview with a header, optional filename, copy button, and `<pre>`-rendered content. Use for installation snippets, API examples, and snippets you want users to copy verbatim.",
  collapsible:
    "Headless single-region show/hide primitive. Use it when Accordion is overkill — a single toggle reveals one panel of content. Smooth height animation built in.",
  "color-picker":
    "Hex / RGB color input with a popover swatch grid. Supports controlled and uncontrolled modes, alpha channel, and a recent-colors row.",
  command:
    "Searchable command palette à la Cmd-K — keyboard-driven menu with grouped items, icons, shortcuts, and fuzzy filtering. Use as a global launcher (mounted in a Dialog) or inline as a typeahead select.",
  "context-menu":
    "Right-click menu — same primitives as Dropdown Menu but triggered by `contextmenu` events. Drop on any element you want to attach row actions, file-system style operations, or copy/paste menus to.",
  "data-list":
    "Vertical key/value list for showing read-only metadata — invoice details, settings summaries, profile fields. Pair items in label/value rows; supports inline edit triggers and trailing actions per row.",
  "data-table":
    "Full-feature table with sorting, filtering, column pinning, pagination, row selection, and an opinionated header/toolbar. Built on TanStack Table — pass `columns` + `data` and configure as needed.",
  "date-picker":
    "Date input that opens a Calendar in a Popover. Handles parsing, formatting, min/max bounds, and disabled dates. Use the Range Calendar version for from/to selections.",
  dialog:
    "Free-form modal primitive — composable from `Dialog`, `DialogTrigger`, `DialogContent`, and friends. Use for forms, info cards, pickers, and any custom modal layout. For confirm/destructive prompts, prefer the prebuilt `AlertModal` shortcut.",
  "empty-state":
    'Centered placeholder with icon, headline, supporting text, and one or two actions. Drop into empty lists, blank dashboards, and unauthenticated views — the standard "nothing here yet" pattern.',
  "file-upload":
    'Drag-and-drop file dropzone with click-to-browse fallback, file-type filtering, multi-file support, and per-file progress + remove controls. Wraps native `<input type="file">` with proper a11y.',
  form: "Zod-first form block built on TanStack Vue Form. Wires field labels, descriptions, error messages, and validation together; bind a field once and the rest is automatic.",
  grid: "Responsive CSS grid container with `cols`, `gap`, and breakpoint props. A small but useful primitive for laying out card grids, KPI tiles, and form sections without writing repetitive Tailwind classes.",
  "hover-card":
    "Rich popover triggered by hover/focus instead of click. Use for inline previews — user cards on @mentions, link previews, KPI explanations. Built on reka-ui with a configurable open/close delay.",
  "icon-box":
    "Small framed icon used inside cards, list items, and stat tiles. Six tones, three sizes, and a `variant` prop for filled, soft, or outline backgrounds. Drop a Lucide icon in, get a polished badge.",
  icons:
    "Showcase + recipe page for the registry’s default icon set (Lucide). Not a runtime component — install the npm package directly. Documented here so consumers can browse names and import recipes.",
  input:
    "Text input — single-line. Same sizing and ring treatment as the rest of the form primitives. Pair with Label, attach an icon via the `start` / `end` slots, or compose into a search input.",
  label:
    "Accessible label primitive — wraps text and binds to its child input via `for`. Disabled-state styling, optional required-asterisk, and proper screen-reader behavior.",
  "labeled-value":
    'Read-only label/value pair for surface details — "Email: jane@…" or "Status: Active". Compose them in a Data List, a Stat Card, or a Section Card detail row.',
  list: "Plain content list with `<ul>` / `<li>` semantics and a few preset gap and divider modes. Use for menu items, navigation lists, or any vertical sequence of small rows.",
  "masked-input":
    "Input with a fixed format mask — phone numbers, credit cards, dates, postal codes. Built on Maska. Pass a mask string (e.g. `(###) ###-####`) and the input enforces it as the user types.",
  menubar:
    "Top-level menu bar — File / Edit / View — for desktop-style apps. Same primitives as Dropdown Menu but laid out horizontally and keyboard-navigable across siblings (left/right arrows).",
  "navigation-menu":
    "Top-of-page horizontal navigation with hover/click triggered megamenus. Use for marketing sites and product navs that need rich content — featured links, mini-cards, and submenu columns.",
  "number-field":
    "Numeric input with stepper buttons, min/max bounds, step size, and decimal precision. Use for quantities, prices, and any field that should be a number rather than free text.",
  page: "Page-level layout shell — title row, optional breadcrumbs, action bar, and slotted content well. The standard wrapper for `routes/*.vue` pages so every screen looks consistent.",
  pagination:
    "Page-number bar with previous/next, ellipsis collapse, and a configurable visible-window size. Pair with a data-table or any paged list.",
  "pin-input":
    "One-time-code input — N separate boxes that auto-advance and accept paste. Use for SMS verification, 2FA, and short numeric codes. Length, masking, and per-slot status all configurable.",
  popover:
    'Click-triggered floating panel anchored to a trigger element. Use for inline forms, color pickers, mini-menus, and any "small thing in a balloon." Built on reka-ui with collision detection.',
  progress:
    "Linear progress bar — determinate or indeterminate. Two visual densities (slim, default), four tones, and an optional inline percentage label.",
  "progress-item":
    "Labeled progress row — item name on the left, progress bar in the middle, percent or count on the right. Use for batched task lists, file upload queues, or onboarding checklists.",
  "progress-linear":
    "Top-of-screen page-loading bar (à la NProgress / nuxt loading-indicator). Auto-advances while a navigation or fetch is in flight, then completes. Drop into the app shell once.",
  "qr-code":
    "Static QR code renderer — pass `value` and a size, get an SVG. Useful for sign-in links, share URLs, and Wi-Fi credentials. No dependencies on a heavy QR library.",
  "radio-group":
    "Single-selection group of radio inputs. Vertical or horizontal layout, optional descriptions per item, and full keyboard navigation. Pair with Form for validation messages.",
  "range-calendar":
    "Calendar variant for from/to date selection — click two dates and the range fills in between. Same min/max and disabled-date support as the single-date Calendar.",
  "range-slider":
    'Two-thumb range slider for "between X and Y" inputs — price filters, age ranges, time windows. Built on reka-ui with proper keyboard handling and aria-valuetext.',
  rating:
    "Star (or custom icon) rating control — pick a value from 1 to N. Read-only mode for displaying review averages, with half-step support.",
  resizable:
    "Drag-to-resize panel layout — horizontal or vertical splits with persistent sizes. Use for IDE-style sidebars, split views, and any layout the user should be able to reshape.",
  "rich-text-editor":
    "WYSIWYG editor wrapped around TipTap — bold/italic/links/lists/headings/blockquote/code, plus a configurable toolbar. Drop into forms where Markdown is too low-level.",
  "scroll-area":
    "Custom scrollbar that always renders the same way across OSes (no flashing native scrollbars on Windows). Use for sidebars, dropdown content, and any overflow region you want to feel consistent.",
  "section-card":
    "Card variant tuned for settings pages — title, description, and content slots, with optional footer for save/cancel actions. The block-level building block for `.../settings/*` routes.",
  select:
    "Dropdown select primitive — single-select, with optional groups, descriptions per item, and a search input via the AdvanceSelect variant. Built on reka-ui.",
  separator:
    "Horizontal or vertical visual divider — a `<div>` with the right ARIA role and a registry-token border color. Use between sections, list rows, and toolbar groups.",
  sheet:
    "Side-mounted modal that slides in from the top, right, bottom, or left edge. Use for filter panels, edit drawers, and mobile menus.",
  sidebar:
    "Full-height app sidebar — collapsible to icons, with grouping, sub-grouping, and integrated search. The navigation surface for product apps with many sections.",
  skeleton:
    "Animated placeholder rectangles for loading states — drop one in shape of the content that’s about to render. Variants for text lines, avatars, rounded rectangles, and circles.",
  slider:
    "Single-thumb slider — pick a value within a range. Optional tick marks, step size, and inline value display.",
  sonner:
    "Toast notification system — non-blocking, auto-dismissing alerts that stack in a corner. Built on the `vue-sonner` library with the registry’s tokens applied.",
  spinner:
    "Lightweight loading indicator — circular spinner with three sizes and tone variants. Use inside buttons (replacing the icon when an action is in flight) or as a centered page loader.",
  "stat-card":
    "KPI tile — large value, label, optional delta with up/down arrow and tone, and optional trend sparkline. Compose them in a KPI grid for dashboard headers.",
  stepper:
    "Multi-step indicator — horizontal or vertical, with completed / current / upcoming states and optional descriptions per step. Use for onboarding wizards and checkout flows.",
  switch:
    "On/off toggle — visual analog of a hardware switch. Use for binary settings where the change takes effect immediately, not for form fields that submit later (use Checkbox there).",
  table:
    "Plain HTML table primitives — `<Table>`, `<TableHeader>`, `<TableRow>`, `<TableCell>` — with the registry’s borders, padding, and tokens already applied. Use this when Data Table is too heavy.",
  tabs: "Horizontal tab navigation with content panels — pick one panel at a time. Underline or pills variants. Built on reka-ui with full keyboard navigation.",
  "tags-input":
    "Multi-tag input — type a value, hit Enter, get a Chip. Backspace removes the last tag. Use for email recipient lists, tag sets, and free-form keyword inputs.",
  textarea:
    "Multi-line text input. Auto-resize variant, character counter, and the same ring/border treatment as the rest of the form primitives.",
  "theme-switch":
    "Light / dark / system theme toggle — drop in the header. Seven visual variants (icon, dropdown, segmented, etc.). Persists choice to `localStorage` and respects `prefers-color-scheme` for `system`.",
  "time-picker":
    "Standalone time input — hours, minutes, optional seconds, and 12h/24h modes. Pairs with Date Picker for full datetime entry.",
  timeline:
    "Vertical or horizontal sequence of events with connectors and node markers. Statuses (pending, current, completed, failed) tint the connector. Use for activity feeds, audit logs, and progress tracking.",
  "toggle-group":
    'Group of `Toggle` buttons that act as a single-select or multi-select control. Use for view-mode pickers (grid/list), text-format toolbars, and any "pick one of N" button bar.',
  toggle:
    'On/off button (different from Switch — this is shaped like a button and lives in toolbars). Three sizes, two variants. Use inside Toggle Group or standalone for "press to enable" buttons like bold / italic.',
  tooltip:
    "Small popover triggered by hover/focus, used for short labels — icon-button names, abbreviation expansions, keyboard shortcuts. Auto-positions and respects `prefers-reduced-motion`.",
  "tree-view":
    "Indented tree of expandable nodes — file browsers, taxonomy editors, nested settings. Discord-style elbow connectors, lazy-load branches, and full keyboard navigation.",
  "vertical-tabs":
    "Settings-page navigation pattern — labels stack on the left, content panel on the right. Same API as Tabs but with a vertical orientation. Use for dense, multi-section settings UIs.",
};

async function inject(
  file: string,
): Promise<"updated" | "skipped" | "unknown"> {
  const path = join(ROOT, file);
  const raw = await readFile(path, "utf8");
  if (raw.includes("description:")) return "skipped";
  const match = raw.match(/name:\s*['"]([^'"]+)['"]/);
  if (!match) return "unknown";
  const name = match[1];
  const desc = DESCRIPTIONS[name];
  if (!desc) return "unknown";
  // Insert description after the framework line, or after type if no framework.
  const escaped = desc.replace(/'/g, "\\'");
  const indent = "  ";
  const insertion = `${indent}description: '${escaped}',\n`;
  let next = raw;
  if (raw.includes("framework: 'vue',\n")) {
    next = raw.replace(/(framework:\s*'vue',\n)/, `$1${insertion}`);
  } else if (raw.includes("framework: 'nuxt',\n")) {
    next = raw.replace(/(framework:\s*'nuxt',\n)/, `$1${insertion}`);
  } else {
    // No framework line — insert after type line.
    next = raw.replace(/(type:\s*'[^']+',\n)/, `$1${insertion}`);
  }
  if (next === raw) return "unknown";
  await writeFile(path, next);
  return "updated";
}

async function main() {
  const files = [
    "components/accordion/accordion.registry.ts",
    "components/advance-select/advance-select.registry.ts",
    "components/alert-modal/alert-modal.registry.ts",
    "components/alert/alert.registry.ts",
    "components/aspect-ratio/aspect-ratio.registry.ts",
    "components/avatar/avatar.registry.ts",
    "components/badge/badge.registry.ts",
    "components/breadcrumb/breadcrumb.registry.ts",
    "components/button/button.registry.ts",
    "components/calendar/calendar.registry.ts",
    "components/card/card.registry.ts",
    "components/carousel/carousel.registry.ts",
    "components/charts/charts.registry.ts",
    "components/checkbox/checkbox.registry.ts",
    "components/chip/chip.registry.ts",
    "components/code-block/code-block.registry.ts",
    "components/collapsible/collapsible.registry.ts",
    "components/color-picker/color-picker.registry.ts",
    "components/command/command.registry.ts",
    "components/context-menu/context-menu.registry.ts",
    "components/data-list/data-list.registry.ts",
    "components/data-table/data-table.registry.ts",
    "components/date-picker/date-picker.registry.ts",
    "components/dialog/dialog.registry.ts",
    "components/empty-state/empty-state.registry.ts",
    "components/file-upload/file-upload.registry.ts",
    "components/form/form.registry.ts",
    "components/grid/grid.registry.ts",
    "components/hover-card/hover-card.registry.ts",
    "components/icon-box/icon-box.registry.ts",
    "components/icons/icons.registry.ts",
    "components/input/input.registry.ts",
    "components/label/label.registry.ts",
    "components/labeled-value/labeled-value.registry.ts",
    "components/list/list.registry.ts",
    "components/masked-input/masked-input.registry.ts",
    "components/menubar/menubar.registry.ts",
    "components/navigation-menu/navigation-menu.registry.ts",
    "components/number-field/number-field.registry.ts",
    "components/page/page.registry.ts",
    "components/pagination/pagination.registry.ts",
    "components/pin-input/pin-input.registry.ts",
    "components/popover/popover.registry.ts",
    "components/progress-item/progress-item.registry.ts",
    "components/progress-linear/progress-linear.registry.ts",
    "components/progress/progress.registry.ts",
    "components/qr-code/qr-code.registry.ts",
    "components/radio-group/radio-group.registry.ts",
    "components/range-calendar/range-calendar.registry.ts",
    "components/range-slider/range-slider.registry.ts",
    "components/rating/rating.registry.ts",
    "components/resizable/resizable.registry.ts",
    "components/rich-text-editor/rich-text-editor.registry.ts",
    "components/scroll-area/scroll-area.registry.ts",
    "components/section-card/section-card.registry.ts",
    "components/select/select.registry.ts",
    "components/separator/separator.registry.ts",
    "components/sheet/sheet.registry.ts",
    "components/sidebar/sidebar.registry.ts",
    "components/skeleton/skeleton.registry.ts",
    "components/slider/slider.registry.ts",
    "components/sonner/sonner.registry.ts",
    "components/spinner/spinner.registry.ts",
    "components/stat-card/stat-card.registry.ts",
    "components/stepper/stepper.registry.ts",
    "components/switch/switch.registry.ts",
    "components/table/table.registry.ts",
    "components/tabs/tabs.registry.ts",
    "components/tags-input/tags-input.registry.ts",
    "components/textarea/textarea.registry.ts",
    "components/theme-switch/theme-switch.registry.ts",
    "components/time-picker/time-picker.registry.ts",
    "components/timeline/timeline.registry.ts",
    "components/toggle-group/toggle-group.registry.ts",
    "components/toggle/toggle.registry.ts",
    "components/tooltip/tooltip.registry.ts",
    "components/tree-view/tree-view.registry.ts",
    "components/vertical-tabs/vertical-tabs.registry.ts",
  ];
  let updated = 0;
  let skipped = 0;
  let unknown = 0;
  for (const f of files) {
    const path = join(ROOT, f);
    if (!existsSync(path)) {
      console.warn(`[skip-missing] ${f}`);
      continue;
    }
    const result = await inject(f);
    if (result === "updated") updated++;
    else if (result === "skipped") skipped++;
    else {
      unknown++;
      console.warn(`[unknown] ${f}`);
    }
  }
  console.log(
    `[descriptions] updated=${updated} skipped=${skipped} unknown=${unknown}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
