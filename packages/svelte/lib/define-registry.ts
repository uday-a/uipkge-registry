import { z } from 'zod'

const fileSchema = z.object({
  path: z.string(),
  target: z.string(),
})

const cssVarsSchema = z.object({
  theme: z.record(z.string()).optional(),
  light: z.record(z.string()).optional(),
  dark: z.record(z.string()).optional(),
})

const registryItemSchema = z.object({
  name: z.string(),
  framework: z.string().optional(),
  title: z.string().optional(),
  type: z.enum([
    'registry:ui',
    'registry:block',
    'registry:lib',
    'registry:hook',
    'registry:style',
    'registry:theme',
    'registry:component',
    'registry:page',
    'registry:file',
  ]),
  description: z.string().optional(),
  categories: z.array(z.string()).optional(),
  deprecated: z.union([z.boolean(), z.string()]).optional(),
  replacedBy: z.string().optional(),
  files: z.array(fileSchema).default([]),
  dependencies: z.array(z.string()).default([]),
  devDependencies: z.array(z.string()).default([]),
  registryDependencies: z.array(z.string()).default([]),
  cssVars: cssVarsSchema.optional(),
  css: z.record(z.string()).optional(),
  tailwind: z
    .object({
      config: z.record(z.unknown()).optional(),
    })
    .optional(),
})

export type RegistryItem = z.infer<typeof registryItemSchema>

export function defineRegistryItem(item: z.input<typeof registryItemSchema>): RegistryItem {
  return registryItemSchema.parse(item)
}
