import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    include: ['components/**/*.spec.ts', 'blocks/**/*.spec.ts', 'bootstrap/**/*.spec.ts'],
    setupFiles: ['./test-utils/setup.ts'],
    // Let Vite (not Node) resolve Angular + lucide-angular so resolve.dedupe below yields one copy
    // (and partially compiled FESM goes through the JIT compiler loaded in setup.ts).
    server: { deps: { inline: [/@angular\//, /lucide-angular/] } },
  },
  resolve: {
    // One Angular copy: @angular/forms is hoisted to the repo root, whose @angular/core is the
    // site's v21. Without dedupe it loads a second core and rendered specs break (NG0203 / firstCreatePass).
    dedupe: [
      '@angular/core',
      '@angular/common',
      '@angular/forms',
      '@angular/platform-browser',
      '@angular/compiler',
      'rxjs',
    ],
    // Mirror the consumer alias: `@/lib/utils` is the project's cn() helper.
    // In-repo it lives at bootstrap/utils/utils.ts; the tsconfig paths cover
    // tsc, this covers vitest.
    alias: {
      '@/lib/use-theme': fileURLToPath(new URL('./bootstrap/use-theme/use-theme.ts', import.meta.url)),
      '@/lib': fileURLToPath(new URL('./bootstrap/utils', import.meta.url)),
      '@/ui': fileURLToPath(new URL('./components', import.meta.url)),
    },
  },
})
