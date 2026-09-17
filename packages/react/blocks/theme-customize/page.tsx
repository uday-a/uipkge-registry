// Demo page wired by `npx shadcn@latest add https://uipkge.dev/r/react/theme-customize.json`.
// Visit /theme-customize-demo after install.
import { ThemeCustomize } from '@/components/blocks/ThemeCustomize'

export default function Page() {
  return (
    <div data-slot="theme-customize" className="bg-background min-h-svh">
      <header className="border-border border-b px-8 py-4">
        <h1 className="text-muted-foreground font-mono text-sm tracking-widest uppercase">theme-customize demo</h1>
      </header>
      <main className="p-8">
        <ThemeCustomize />
      </main>
    </div>
  )
}
