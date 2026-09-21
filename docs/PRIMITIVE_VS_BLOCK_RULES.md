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

1. **No Layout-Hiding Collection Props**:
   Primitives must never take an `items` or `data` array of structured records and render a fixed layout.
2. **No Baked Card Templates**:
   Primitives like `StatCard`, `MetricCard`, or `InfoTile` that bake in a layout shape are **banned**. Always compose `Card`, `CardHeader`, `CardTitle`, and typography inline.
3. **Top-to-Bottom Readability**:
   Blocks must read cleanly at the call site. The titles, values, status badges, and buttons should all be clearly visible in the block's source code so users can modify them easily after installing.
4. **Layout Containers**:
   Layout containers (`KpiGrid`, `Grid`, `Separator`) may be primitives only when they provide pure structure without content assumptions.
5. **No Nesting Blocks in Blocks**:
   One block is one install unit. A block should never embed another block's entire UI.

---

## 4. Scope Guard Protection (`scripts/check-pr-scope.ts`)

In `uipkge-registry`, a CI gate enforces that community PRs contributing blocks do **not** touch or alter existing primitives or shared design tokens:

- **Block PR**: Touches only `packages/{vue,react}/blocks/<name>/` and `packages/{vue,react}/demos/<name>.*`.
- **Primitive PR**: Modifies primitives or tokens.
- Combining both in a single community PR is blocked by `bun run check:scope` to ensure zero unintended regressions for consumers.
