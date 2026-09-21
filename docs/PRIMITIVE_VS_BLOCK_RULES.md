# The Primitive vs. Block Boundary

The division between **primitives** (`registry:ui`) and **blocks** (`registry:block`) is the single most important architectural rule in UIPKGE.

---

## 1. The Core Distinction

| Characteristic   | Primitive (`registry:ui`)                                                       | Block (`registry:block`)                                                    |
| ---------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Purpose**      | Abstracts mechanics, accessibility, styling tokens, and low-level DOM behavior. | Composes primitives into higher-level business layouts and domain patterns. |
| **Visibility**   | Internal mechanics are encapsulated.                                            | Internals are visible and editable top-to-bottom.                           |
| **Layout Props** | Never accepts record arrays to render fixed layouts.                            | Spells out cards, rows, icons, and titles inline.                           |
| **Examples**     | `Button`, `Card`, `DataTable`, `Dialog`, `Progress`, `KpiGrid`, `Input`.        | `cloud-backup-schedule`, `workspace-usage`, `activity-feed`.                |

---

## 2. The Golden Boundary Test

- **If a prop changes BEHAVIOR or APPEARANCE**: It belongs on a **primitive**.
  - Examples: `disabled`, `multiple`, `variant="destructive"`, `size="sm"`, `smooth={true}`.
- **If a prop changes LAYOUT, DATA FIELDS, or CARD SHAPES**: It belongs in a **block**.
  - Examples: `items`, `columns`, `showTrend`, records with `title`, `value`, `icon`, `trend`.

---

## 3. Strict Rules

1. **Base Component Immunity (Never Touch Primitives in Block Work)**:
   Existing base primitives (`components/ui/*`) and shared design tokens (`packages/shared/*`) are considered **immutable** during block creation. If a block needs custom spacing or styling, apply utility classes directly in the block template. Never patch or alter a base component to satisfy a block.
2. **No Layout-Hiding Collection Props**:
   Primitives must never take an `items` or `data` array of structured records and render a fixed layout.
3. **No Baked Card Templates ("No StatCard" Rule)**:
   Primitives like `StatCard`, `MetricCard`, or `InfoTile` that bake in a layout shape are **strictly banned**. Always compose `Card`, `CardHeader`, `CardTitle`, and typography inline.
4. **Top-to-Bottom Readability**:
   Blocks must read cleanly at the call site. The titles, values, status badges, and buttons should all be clearly visible in the block's source code so users can modify them easily after installing.
5. **Section, Not Full Route**:
   Blocks represent self-contained UI sections (a dashboard grid, a filter toolbar, an audit timeline, a settings drawer). They are **not** full-viewport page shells, auth flows, or multi-screen route stacks unless explicitly typed `registry:page`.
6. **One Block = One Install Unit**:
   A block should never embed another block's entire UI. Shared sub-patterns should be promoted to their own block first and declared in `registryDependencies`.
7. **Line Budget (~500 Lines Soft Cap)**:
   A single-file block should stay under ~500 lines. Anything larger must be modularized into subcomponents in the same block folder (e.g. `KanbanColumn.tsx`, `KanbanCard.tsx`).
8. **Minimal Seed Data in Block Source**:
   Rich sample datasets belong in the playground demo stories (`packages/{vue,react}/demos/`). The block itself ships with only a minimal inline default seed (1–3 rows) or scalar props.
9. **Layout Containers**:
   Layout containers (`KpiGrid`, `Grid`, `Separator`) may be primitives only when they provide pure structure without content assumptions.

---

## 4. Scope Guard Protection (`scripts/check-pr-scope.ts`)

In `uipkge-registry`, an automated CI gate enforces that pull requests contributing blocks do **not** touch or alter existing primitives or shared design tokens:

- **Block PR**: Touches only `packages/{vue,react}/blocks/<name>/` and `packages/{vue,react}/demos/<name>.*`.
- **Primitive PR**: Modifies base primitives (`packages/{vue,react}/components/`) or tokens (`packages/shared/`).
- **Mixed PRs are Blocked**: Combining block changes with primitive edits in a single community PR will fail `bun run check:scope` in CI. If a base component has a genuine bug, it must be submitted in a separate, dedicated PR titled `fix(ui): ...` with companion unit tests.

