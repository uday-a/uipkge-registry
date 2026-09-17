import { z } from "zod";

const fileSchema = z.object({
  /** Source file path relative to the .registry.ts directory. */
  path: z.string(),
  /** Consumer destination path. Use a `~/` prefix to anchor at project root
   *  (e.g. `~/tailwind.css`); otherwise interpreted relative to the consumer's
   *  configured alias root (typically `components`). */
  target: z.string(),
});

const cssVarsSchema = z.object({
  theme: z.record(z.string()).optional(),
  light: z.record(z.string()).optional(),
  dark: z.record(z.string()).optional(),
});

/**
 * Spec compliance: this matches the upstream shadcn-vue / shadcn
 * registry-item.json schema as closely as our content allows.
 * https://shadcn-vue.com/schema/registry-item.json
 *
 * Sidecars may carry extra fields (e.g. `framework`); the Zod parse strips
 * them and build.ts emits only the spec-compliant subset.
 */
const registryItemSchema = z.object({
  name: z.string(),
  /** Which framework registry the item belongs to ('vue' | 'react').
   *  Informational for sidecar authors -- never emitted in output JSON
   *  (verify.ts lists it as a forbidden field). */
  framework: z.string().optional(),
  /** Required by spec. If omitted from a sidecar, build.ts derives a Title
   *  Case humanization of `name` (kebab-case -> "Kebab Case"). */
  title: z.string().optional(),
  type: z.enum([
    "registry:ui",
    "registry:block",
    "registry:lib",
    "registry:hook",
    "registry:style",
    "registry:theme",
    "registry:component",
    "registry:page",
    "registry:file",
  ]),
  description: z.string().optional(),
  /** Spec-supported categorisation; surfaced in the docs site for filtering. */
  categories: z.array(z.string()).optional(),
  files: z.array(fileSchema).default([]),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  registryDependencies: z.array(z.string()).default([]),
  /** Tailwind v4 token assignments. The CLI merges these into the
   *  consumer's existing CSS rather than overwriting. */
  cssVars: cssVarsSchema.optional(),
  /** Arbitrary CSS blocks (`@layer base`, `@keyframes`, etc.) that the CLI
   *  merges into the consumer's CSS. Keyed by selector/at-rule. */
  css: z.record(z.string()).optional(),
  tailwind: z
    .object({
      config: z.record(z.unknown()).optional(),
    })
    .optional(),
});

export type RegistryItem = z.infer<typeof registryItemSchema>;

export function defineRegistryItem(
  item: z.input<typeof registryItemSchema>,
): RegistryItem {
  return registryItemSchema.parse(item);
}
