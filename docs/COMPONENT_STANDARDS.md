# Component Authoring & Craft Standards

## 1. Directory & File Conventions

Every component lives in its own directory under `packages/{vue,react}/components/<name>/`:

### Vue Layout

```text
packages/vue/components/<name>/
├── <Component>.vue          # Main Vue SFC
├── <name>.variants.ts       # CVA variants (if applicable)
├── index.ts                 # Barrel exports
├── <name>.registry.ts       # Sidecar registry manifest
└── __tests__/
    └── <name>.spec.ts       # Vitest unit test
```

### React Layout

```text
packages/react/components/<name>/
├── <Component>.tsx          # Main React TSX (with 'use client')
├── <name>.variants.ts       # CVA variants (if applicable)
├── index.ts                 # Barrel exports
├── <name>.registry.ts       # Sidecar registry manifest
└── __tests__/
    └── <name>.spec.tsx      # Vitest unit test
```

---

## 2. Vue Component Pattern (SFC)

```vue
<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from './button.variants'

interface Props {
  as?: string
  asChild?: boolean
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :data-size="size"
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>
```

### Vue Authoring Rules:

- **`data-slot` attribute**: Always add `data-slot="<name>"` on the root element.
- **State attributes**: Use `data-variant`, `data-size`, `data-state` for styling hooks.
- **Polymorphism**: Prefer `Primitive` from `reka-ui` with `as` and `asChild` support.
- **Avoid SFC Extends Trap**: Do not write `interface Props extends ExternalRekaUiProps`. Explicitly declare or intersect props to avoid Vue 3.5 compiler resolution issues.
- **CVA separation**: Keep `cva()` definitions in `<name>.variants.ts`, never in `index.ts`. This prevents Vue SSR circular import failures (`$setup.xxxVariants is not a function`).

---

## 3. React Component Pattern (TSX)

```tsx
'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from './button.variants'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
```

### React Authoring Rules:

- **`'use client'` Directive**: The very first line of any interactive component must be `'use client'`.
- **`forwardRef` and `displayName`**: Always forward refs and set `displayName`.
- **`asChild` via Radix Slot**: Support polymorphic composition through `@radix-ui/react-slot`.

---

## 4. Design Engineering & Craft Benchmark

Components follow world-class design standards influenced by Linear, Vercel, Raycast, Paco Coursey, and Emil Kowalski:

1. **Semantic Typography & Zero Micro-Text**:
   - Never use arbitrary sub-12px text (`text-[9px]`, `text-[10px]`, `text-[11px]`).
   - Use `text-xs` (12px) for badges and metadata.
   - Use `text-sm` (14px) for interactive controls and body.
   - Use `text-base`, `text-lg`, `text-2xl font-bold` for headings and metric values.
2. **Subtle 1px Borders & Layered Surfaces**:
   - Use `border border-border` and subtle shadows (`shadow-xs`, `shadow-sm`).
   - Avoid harsh high-contrast black outlines.
3. **Calibrated Motion**:
   - Use snappy durations (120ms–200ms) with spring physics (`--ease-spring`).
   - Never introduce sluggish or distracting transitions on core interactive controls.
4. **Keyboard & Focus States**:
   - Focus rings must be distinct: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50`.
   - WCAG AA contrast compliance is strictly mandatory.
