import { Component, Input } from '@angular/core'
import {
  UiScrollSpyComponent,
  UiScrollSpyTitleComponent,
  UiScrollSpyListComponent,
  UiScrollSpyItemComponent,
  UiScrollSpyLinkComponent,
  UiScrollSpyIndicatorComponent,
  UiScrollSpyStepperComponent,
  type ScrollSpyItem,
} from '../../../../../packages/registry-angular/components/scroll-spy'

@Component({
  selector: 'ui-scroll-spy-demo',
  standalone: true,
  imports: [
    UiScrollSpyComponent,
    UiScrollSpyTitleComponent,
    UiScrollSpyListComponent,
    UiScrollSpyItemComponent,
    UiScrollSpyLinkComponent,
    UiScrollSpyIndicatorComponent,
    UiScrollSpyStepperComponent,
  ],
  template: `
    @switch (story) {
      @case ('On this page (Right rail)') {
        <div class="border-border/60 bg-card grid grid-cols-1 gap-6 rounded-xl border p-4 sm:grid-cols-[1fr_260px]">
          <div
            id="react-scroll-spy-container-right"
            class="border-border/40 bg-muted/20 h-80 space-y-8 overflow-y-auto scroll-smooth rounded-lg border p-6 pr-8"
          >
            <section id="react-demo-installation" class="space-y-3">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">01</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Installation</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Add the scroll-spy component to your project using the UIPKGE CLI command. Components are copied
                directly into your workspace so you have complete ownership of the source code.
              </p>
              <div
                class="border-border/50 bg-muted/60 text-foreground/90 rounded-md border px-3.5 py-2.5 font-mono text-xs"
              >
                <code>npx shadcn@latest add https://uipkge.dev/r/react/scroll-spy.json</code>
              </div>
              <p class="text-muted-foreground text-xs leading-relaxed">
                This automatically installs all compound primitives: <code>ScrollSpy</code>,
                <code>ScrollSpyTitle</code>, <code>ScrollSpyList</code>, <code>ScrollSpyItem</code>,
                <code>ScrollSpyLink</code>, and <code>ScrollSpyIndicator</code>.
              </p>
            </section>

            <section id="react-demo-examples" class="border-border/40 space-y-4 border-t pt-6">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">02</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Examples</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                ScrollSpy can be configured with straight border lines, continuous circuit SVG tracks, or stepper
                headers. It works with both window scrolling and local scroll containers.
              </p>

              <div id="react-demo-variants" class="border-border/50 bg-background/60 space-y-2 rounded-lg border p-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-foreground text-sm font-semibold">Variants</h4>
                  <span class="text-muted-foreground font-mono text-xs">variant="line | angle"</span>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Use <code>variant="line"</code> for traditional border-based rails with zero corner radius, or
                  <code>variant="angle"</code> for circuit rails with tangent-continuous cubic beziers.
                </p>
                <div class="grid grid-cols-2 gap-2 pt-1 text-xs">
                  <div class="border-border/40 bg-muted/30 rounded p-2.5">
                    <div class="text-foreground font-medium">Line Rail</div>
                    <div class="text-muted-foreground text-xs">Clean, straight border tracking</div>
                  </div>
                  <div class="border-border/40 bg-muted/30 rounded p-2.5">
                    <div class="text-foreground font-medium">Circuit Rail</div>
                    <div class="text-muted-foreground text-xs">Seamless S-curves for sub-levels</div>
                  </div>
                </div>
              </div>

              <div id="react-demo-sizes" class="border-border/50 bg-background/60 space-y-2 rounded-lg border p-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-foreground text-sm font-semibold">Sizes &amp; Depth</h4>
                  <span class="text-muted-foreground font-mono text-xs">depth 1 – 4</span>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Items can nest up to four levels deep. The vertical rail automatically indents sub-level items with
                  geometric padding.
                </p>
              </div>

              <div id="react-demo-states" class="border-border/50 bg-background/60 space-y-2 rounded-lg border p-4">
                <div class="flex items-center justify-between">
                  <h4 class="text-foreground text-sm font-semibold">States &amp; Interaction</h4>
                  <span class="text-muted-foreground font-mono text-xs">active, parent, scrolled</span>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Supports multiple highlight models: active only, parent branch illumination, and progressive scrolled
                  accumulation.
                </p>
              </div>
            </section>

            <section id="react-demo-props" class="border-border/40 space-y-3 border-t pt-6">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">03</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Props</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Comprehensive props API for layout alignment, offset thresholds, and indicator customization.
              </p>
              <div class="divide-border/40 border-border/50 bg-background/60 divide-y rounded-lg border text-xs">
                <div class="flex items-center justify-between p-3">
                  <span class="text-foreground font-mono font-medium">scrollContainer</span>
                  <span class="text-muted-foreground font-mono">string | HTMLElement</span>
                </div>
                <div class="flex items-center justify-between p-3">
                  <span class="text-foreground font-mono font-medium">position</span>
                  <span class="text-muted-foreground font-mono">"right" | "left" | "top" | "bottom"</span>
                </div>
                <div class="flex items-center justify-between p-3">
                  <span class="text-foreground font-mono font-medium">offsetTop</span>
                  <span class="text-muted-foreground font-mono">number (default: 0)</span>
                </div>
              </div>
            </section>

            <section id="react-demo-dependencies" class="border-border/40 space-y-3 border-t pt-6">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">04</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Dependencies</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Zero external third-party dependencies. Uses native browser <code>scroll</code> listeners,
                <code>getBoundingClientRect</code> math, and hardware-accelerated CSS spring animations.
              </p>
              <div
                class="border-border/50 bg-muted/20 text-muted-foreground flex items-center justify-between rounded-lg border p-3 text-xs"
              >
                <span>Runtime footprint</span>
                <span class="text-foreground font-mono font-semibold">0 external npm packages</span>
              </div>
            </section>

            <section id="react-demo-files" class="border-border/40 space-y-3 border-t pt-6 pb-12">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">05</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Files</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Modular architecture split into focused single-responsibility primitives:
              </p>
              <div class="grid grid-cols-2 gap-2 font-mono text-xs">
                <div class="border-border/40 bg-muted/30 text-foreground/80 rounded p-2">scroll-spy.tsx</div>
                <div class="border-border/40 bg-muted/30 text-foreground/80 rounded p-2">index.ts</div>
                <div class="border-border/40 bg-muted/30 text-foreground/80 rounded p-2">scroll-spy.registry.ts</div>
              </div>
            </section>
          </div>

          <div class="flex flex-col gap-3 py-2 pl-2">
            <div class="border-border/50 flex flex-col gap-2 border-b pb-2 text-xs">
              <div class="flex items-center gap-3">
                <label
                  class="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 select-none"
                >
                  <input
                    type="checkbox"
                    [checked]="keepScrolledRight"
                    (change)="keepScrolledRight = !keepScrolledRight"
                    class="accent-primary border-border size-3.5 rounded"
                  />
                  <span>Keep scrolled</span>
                </label>
                <label
                  class="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1.5 select-none"
                >
                  <input
                    type="checkbox"
                    [checked]="highlightParentRight"
                    (change)="highlightParentRight = !highlightParentRight"
                    class="accent-primary border-border size-3.5 rounded"
                  />
                  <span>Highlight parent</span>
                </label>
              </div>
              <div class="flex flex-wrap items-center gap-1 pt-0.5">
                <span class="text-muted-foreground mr-0.5 font-mono text-[10px] tracking-wider uppercase">Color:</span>
                @for (c of colors; track c) {
                  <button
                    type="button"
                    (click)="colorRight = c"
                    class="rounded px-1.5 py-0.5 font-mono text-[10px] transition-colors"
                    [class.bg-primary]="colorRight === c"
                    [class.text-primary-foreground]="colorRight === c"
                    [class.font-semibold]="colorRight === c"
                    [class.bg-muted]="colorRight !== c"
                    [class.text-muted-foreground]="colorRight !== c"
                    [class.hover:text-foreground]="colorRight !== c"
                  >
                    {{ c === '#f59e0b' ? 'amber' : c }}
                  </button>
                }
              </div>
            </div>
            <ui-scroll-spy
              title="On this page"
              [items]="docItems"
              scrollContainer="#react-scroll-spy-container-right"
              position="right"
              variant="line"
              [color]="colorRight"
              [keepScrolled]="keepScrolledRight"
              [highlightParent]="highlightParentRight"
            />
          </div>
        </div>
      }

      @case ('Left-side scroll-spy option') {
        <div class="border-border/60 bg-card grid grid-cols-1 gap-6 rounded-xl border p-4 sm:grid-cols-[220px_1fr]">
          <div class="py-2 pr-2">
            <ui-scroll-spy
              title="Table of Contents"
              [items]="leftItems"
              scrollContainer="#react-scroll-spy-container-left"
              position="left"
              railPosition="right"
              variant="line"
            />
          </div>

          <div
            id="react-scroll-spy-container-left"
            class="border-border/40 bg-muted/20 h-80 space-y-8 overflow-y-auto scroll-smooth rounded-lg border p-6 pl-8"
          >
            <section id="react-left-intro" class="space-y-3">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">01</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Introduction</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Left-sidebar navigation places the table of contents directly between your primary navigation drawer and
                document body. With <code>railPosition="right"</code>, the vertical rail faces inwards toward the
                content.
              </p>
              <div class="border-border/50 bg-background/60 text-muted-foreground rounded-lg border p-3.5 text-xs">
                <strong class="text-foreground mb-1 block">Layout Flexibility</strong>
                Supports inverted rail alignments without altering document markup or DOM tab order.
              </div>
            </section>

            <section id="react-left-arch" class="border-border/40 space-y-4 border-t pt-6">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">02</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Architecture</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Engineered under the design standards of Rauno Freiberg and Linear, prioritizing information density and
                zero visual distraction.
              </p>

              <div id="react-left-tokens" class="border-border/50 bg-background/60 space-y-2 rounded-lg border p-4">
                <h4 class="text-foreground text-sm font-semibold">Design Tokens</h4>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Monochromatic token palette strictly bound to <code>border-border</code>, <code>bg-card</code>,
                  <code>text-foreground</code>, and <code>text-primary</code>. No arbitrary colored fills or loud
                  shadows.
                </p>
              </div>

              <div id="react-left-spacing" class="border-border/50 bg-background/60 space-y-2 rounded-lg border p-4">
                <h4 class="text-foreground text-sm font-semibold">Spacing Rhythm</h4>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Built on a strict 4px baseline grid with 32px touch-friendly hit areas and razor-sharp 0px border line
                  styling for crisp high-DPI rendering.
                </p>
              </div>
            </section>

            <section id="react-left-api" class="border-border/40 space-y-3 border-t pt-6">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">03</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">API Specs</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Configure both <code>position="left"</code> and <code>railPosition="right"</code> on the root component:
              </p>
              <div class="border-border/50 bg-muted/60 text-foreground/90 rounded-md border p-3 font-mono text-xs">
                <code>&lt;ScrollSpy position="left" railPosition="right" /&gt;</code>
              </div>
            </section>

            <section id="react-left-faq" class="border-border/40 space-y-3 border-t pt-6 pb-12">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">04</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">FAQ &amp; Troubleshooting</h3>
              </div>
              <div class="space-y-3">
                <div class="border-border/50 bg-background/60 space-y-1 rounded-lg border p-3.5">
                  <h5 class="text-foreground text-xs font-semibold">Can I use ScrollSpy with window scroll?</h5>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    Yes! Omit <code>scrollContainer</code> or pass <code>window</code>, and ScrollSpy will automatically
                    listen to window scroll events.
                  </p>
                </div>
                <div class="border-border/50 bg-background/60 space-y-1 rounded-lg border p-3.5">
                  <h5 class="text-foreground text-xs font-semibold">Does it handle asynchronous content loading?</h5>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    Yes. Section positions are calculated dynamically on scroll with ResizeObserver-aware bounds
                    checking.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      }

      @case ('Circuit rail (seamless S-curve)') {
        <div class="border-border/60 bg-card grid grid-cols-1 gap-6 rounded-xl border p-4 sm:grid-cols-[1fr_220px]">
          <div
            id="react-scroll-spy-container-angle"
            class="border-border/40 bg-muted/20 h-80 space-y-8 overflow-y-auto scroll-smooth rounded-lg border p-6 pr-8"
          >
            <section id="react-angle-installation" class="space-y-3">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">01</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Installation</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                The circuit rail is integrated directly into the core ScrollSpy primitive. Set
                <code>variant="angle"</code>
                to activate SVG vector path rendering.
              </p>
              <div
                class="border-border/50 bg-muted/60 text-foreground/90 rounded-md border px-3.5 py-2.5 font-mono text-xs"
              >
                <code>&lt;ScrollSpy variant="angle" items=&#123;items&#125; /&gt;</code>
              </div>
            </section>

            <section id="react-angle-examples" class="border-border/40 space-y-4 border-t pt-6">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">02</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Examples</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Observe how the SVG guide rail curves smoothly when transitioning from top-level headings to nested
                sub-topics.
              </p>

              <div id="react-angle-variants" class="border-border/50 bg-background/60 space-y-2 rounded-lg border p-4">
                <h4 class="text-foreground text-sm font-semibold">Tangent-Continuous Geometry</h4>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Transitions are drawn with cubic bezier curves where vertical tangents match perfectly at each
                  connection point, preventing sharp bends or discontinuous kinks.
                </p>
              </div>

              <div id="react-angle-sizes" class="border-border/50 bg-background/60 space-y-2 rounded-lg border p-4">
                <h4 class="text-foreground text-sm font-semibold">Depth Tracking</h4>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  When an active section changes, the highlighted segment glides along the exact bezier path using
                  hardware-accelerated <code>strokeDashoffset</code> interpolation.
                </p>
              </div>

              <div id="react-angle-states" class="border-border/50 bg-background/60 space-y-2 rounded-lg border p-4">
                <h4 class="text-foreground text-sm font-semibold">Optical Alignment</h4>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  The guide rail aligns precisely with the text baseline and link bullets, maintaining uniform visual
                  hierarchy across all indentation levels.
                </p>
              </div>
            </section>

            <section id="react-angle-props" class="border-border/40 space-y-3 border-t pt-6">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">03</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Props</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Customize curve smoothness with the <code>turn</code> prop:
              </p>
              <div class="divide-border/40 border-border/50 bg-background/60 divide-y rounded-lg border text-xs">
                <div class="flex items-start justify-between p-3">
                  <div>
                    <div class="text-foreground font-mono font-medium">turn="rounded"</div>
                    <div class="text-muted-foreground">Smooth cubic bezier S-curve transitions (default)</div>
                  </div>
                  <span class="text-muted-foreground font-mono">default</span>
                </div>
                <div class="flex items-start justify-between p-3">
                  <div>
                    <div class="text-foreground font-mono font-medium">turn="angle"</div>
                    <div class="text-muted-foreground">Geometric 45-degree chamfered bends</div>
                  </div>
                  <span class="text-muted-foreground font-mono">optional</span>
                </div>
              </div>
            </section>

            <section id="react-angle-dependencies" class="border-border/40 space-y-3 border-t pt-6 pb-12">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">04</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Dependencies</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Self-contained SVG vector math. All bezier curves and path lengths are computed with lightweight native
                trigonometric routines without any external math packages.
              </p>
            </section>
          </div>

          <div class="py-2 pl-2">
            <ui-scroll-spy
              title="On this page"
              [items]="angleItems"
              scrollContainer="#react-scroll-spy-container-angle"
              variant="angle"
            />
          </div>
        </div>
      }

      @case ('Top sticky stepper') {
        <div class="border-border/60 bg-card flex flex-col gap-4 rounded-xl border p-4">
          <ui-scroll-spy [items]="topItems" scrollContainer="#react-scroll-spy-container-top" position="top" />

          <div
            id="react-scroll-spy-container-top"
            class="border-border/40 bg-muted/20 h-80 space-y-8 overflow-y-auto scroll-smooth rounded-lg border p-6"
          >
            <section id="react-top-step-1" class="space-y-4">
              <div class="flex items-center gap-2">
                <span
                  class="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full font-mono text-xs font-semibold"
                >
                  1
                </span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Step 1: Account Setup</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Create your organization account and configure access credentials for your team.
              </p>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="border-border/50 bg-background/60 space-y-1 rounded-lg border p-3.5">
                  <label class="text-foreground text-xs font-medium">Organization Slug</label>
                  <div
                    class="border-border/40 bg-muted/40 text-muted-foreground rounded px-2.5 py-1.5 font-mono text-xs"
                  >
                    acme-corp
                  </div>
                </div>
                <div class="border-border/50 bg-background/60 space-y-1 rounded-lg border p-3.5">
                  <label class="text-foreground text-xs font-medium">Billing Contact</label>
                  <div
                    class="border-border/40 bg-muted/40 text-muted-foreground rounded px-2.5 py-1.5 font-mono text-xs"
                  >
                    billing@acme.com
                  </div>
                </div>
              </div>
            </section>

            <section id="react-top-step-2" class="border-border/40 space-y-4 border-t pt-6">
              <div class="flex items-center gap-2">
                <span
                  class="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full font-mono text-xs font-semibold"
                >
                  2
                </span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Step 2: Profile Details</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Configure member roles, team seats, and public directory information.
              </p>
              <div class="border-border/50 bg-background/60 space-y-3 rounded-lg border p-4">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-foreground font-medium">Single Sign-On (SAML / OIDC)</span>
                  <span class="text-primary font-mono font-medium">Enabled</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-foreground font-medium">Enforce Multi-Factor Authentication</span>
                  <span class="text-primary font-mono font-medium">Required</span>
                </div>
              </div>
            </section>

            <section id="react-top-step-3" class="border-border/40 space-y-4 border-t pt-6">
              <div class="flex items-center gap-2">
                <span
                  class="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full font-mono text-xs font-semibold"
                >
                  3
                </span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Step 3: Preferences</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Customize notification channels, weekly activity rollups, and webhook event filters.
              </p>
              <div class="grid grid-cols-3 gap-2">
                <div class="border-border/50 bg-background/60 rounded-lg border p-3 text-center">
                  <div class="text-foreground text-xs font-semibold">Slack</div>
                  <div class="text-muted-foreground text-[11px]">Instant alerts</div>
                </div>
                <div class="border-border/50 bg-background/60 rounded-lg border p-3 text-center">
                  <div class="text-foreground text-xs font-semibold">Email</div>
                  <div class="text-muted-foreground text-[11px]">Daily digest</div>
                </div>
                <div class="border-border/50 bg-background/60 rounded-lg border p-3 text-center">
                  <div class="text-foreground text-xs font-semibold">Webhooks</div>
                  <div class="text-muted-foreground text-[11px]">Raw JSON payload</div>
                </div>
              </div>
            </section>

            <section id="react-top-step-4" class="border-border/40 space-y-4 border-t pt-6 pb-12">
              <div class="flex items-center gap-2">
                <span
                  class="bg-primary text-primary-foreground flex h-5 w-5 items-center justify-center rounded-full font-mono text-xs font-semibold"
                >
                  4
                </span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Step 4: Review &amp; Launch</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Verify all parameters and security policies before activating production synchronization.
              </p>
              <div
                class="border-border/50 bg-muted/30 text-muted-foreground flex items-center justify-between rounded-lg border p-4 text-xs"
              >
                <span>Setup verification status:</span>
                <span class="text-primary font-semibold">All policies validated</span>
              </div>
            </section>
          </div>
        </div>
      }

      @case ('Top sticky scroll spy') {
        <div class="border-border/60 bg-card flex flex-col gap-4 rounded-xl border p-4">
          <ui-scroll-spy
            [items]="spyItems"
            scrollContainer="#react-scroll-spy-container-top-spy"
            position="top"
            variant="scrollspy"
          />

          <div
            id="react-scroll-spy-container-top-spy"
            class="border-border/40 bg-muted/20 h-80 space-y-8 overflow-y-auto scroll-smooth rounded-lg border p-6"
          >
            <section id="react-top-spy-overview" class="space-y-3">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">01</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Overview</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                The top sticky scroll spy navbar provides clean horizontal navigation across page sections. Unlike a
                multi-step form stepper, it highlights only the section currently in view.
              </p>
              <div class="border-border/50 bg-background/60 text-muted-foreground rounded-lg border p-3.5 text-xs">
                <strong class="text-foreground mb-1 block">Active Section Only</strong>
                Prior sections remain unselected rather than marked as completed checkmarks, making it ideal for landing
                pages, documentation, and technical articles.
              </div>
            </section>

            <section id="react-top-spy-features" class="border-border/40 space-y-4 border-t pt-6">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">02</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Features</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Engineered with zero-latency scroll detection and minimal visual distraction.
              </p>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div class="border-border/50 bg-background/60 space-y-1 rounded-lg border p-3.5">
                  <h4 class="text-foreground text-xs font-semibold">Active Indicator Dot</h4>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    An illuminated micro-dot indicates the current active item with smooth spring transitions.
                  </p>
                </div>
                <div class="border-border/50 bg-background/60 space-y-1 rounded-lg border p-3.5">
                  <h4 class="text-foreground text-xs font-semibold">Reading Progress Track</h4>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    A subtle 2px progress bar at the bottom edge tracks overall scroll completion.
                  </p>
                </div>
              </div>
            </section>

            <section id="react-top-spy-specs" class="border-border/40 space-y-4 border-t pt-6">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">03</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Specifications</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Activate the scroll spy variant simply by setting <code>variant="scrollspy"</code> alongside
                <code>position="top"</code>.
              </p>
              <div class="border-border/50 bg-muted/60 text-foreground/90 rounded-md border p-3 font-mono text-xs">
                <code>&lt;ScrollSpy position="top" variant="stepper" /&gt;</code>
              </div>
            </section>

            <section id="react-top-spy-faq" class="border-border/40 space-y-3 border-t pt-6 pb-12">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">04</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">FAQ</h3>
              </div>
              <div class="space-y-3">
                <div class="border-border/50 bg-background/60 space-y-1 rounded-lg border p-3.5">
                  <h5 class="text-foreground text-xs font-semibold">Can this be used on full-page window scrolls?</h5>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    Yes, simply omit <code>scrollContainer</code> or pass <code>window</code>, and add
                    <code>affix</code> to make it stick to the viewport header.
                  </p>
                </div>
                <div class="border-border/50 bg-background/60 space-y-1 rounded-lg border p-3.5">
                  <h5 class="text-foreground text-xs font-semibold">Does it support keyboard navigation?</h5>
                  <p class="text-muted-foreground text-xs leading-relaxed">
                    Yes, all buttons support Tab navigation and Enter/Space activation with visible focus rings.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      }

      @case ('Bottom sticky stepper capsule') {
        <div class="border-border/60 bg-card relative flex flex-col rounded-xl border p-4">
          <div
            id="react-scroll-spy-container-bottom"
            class="border-border/40 bg-muted/20 h-80 space-y-8 overflow-y-auto scroll-smooth rounded-lg border p-6 pb-20"
          >
            <section id="react-bot-sec-1" class="space-y-3">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">1</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Introduction &amp; Mission</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                UIPKGE is an unbundled UI registry where components are the product, not an npm dependency. You install
                source files directly into your application, giving you full customization control without package
                lock-in.
              </p>
              <p class="text-muted-foreground text-xs leading-relaxed">
                The floating capsule dock at the bottom of the viewport provides seamless navigation with minimal visual
                footprint, keeping readers oriented as they progress through long-form technical guides.
              </p>
            </section>

            <section id="react-bot-sec-2" class="border-border/40 space-y-3 border-t pt-6">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">2</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Core Primitives</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Every component is built on accessible headless mechanics. The capsule dock exposes previous and next
                arrows, interactive dot indicators, and an exact percentage reading calculated from scroll distance.
              </p>
              <div class="border-border/50 bg-background/60 space-y-2 rounded-lg border p-4">
                <h4 class="text-foreground text-xs font-semibold">Capsule Controls</h4>
                <p class="text-muted-foreground text-xs leading-relaxed">
                  Click the chevron arrows to navigate between sections, or tap on any dot indicator to jump directly to
                  that part of the document.
                </p>
              </div>
            </section>

            <section id="react-bot-sec-3" class="border-border/40 space-y-3 border-t pt-6">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">3</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Design Engineering</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Modeled after craft standards from Paco Coursey and Emil Kowalski: tactile spring physics, backdrop blur
                filtering, calibrated shadows, and keyboard-accessible focus outlines.
              </p>
              <div class="grid grid-cols-2 gap-3 text-xs">
                <div class="border-border/40 bg-muted/30 rounded-lg p-3">
                  <div class="text-foreground font-medium">Spring Motion</div>
                  <div class="text-muted-foreground text-xs">Fluid state transitions</div>
                </div>
                <div class="border-border/40 bg-muted/30 rounded-lg p-3">
                  <div class="text-foreground font-medium">Subtle Layering</div>
                  <div class="text-muted-foreground text-xs">Surface elevation with 1px border</div>
                </div>
              </div>
            </section>

            <section id="react-bot-sec-4" class="border-border/40 space-y-3 border-t pt-6 pb-12">
              <div class="flex items-center gap-2">
                <span class="bg-primary/10 text-primary rounded px-1.5 py-0.5 font-mono text-xs font-medium">4</span>
                <h3 class="text-foreground text-base font-semibold tracking-tight">Production Ready</h3>
              </div>
              <p class="text-muted-foreground text-sm leading-relaxed">
                Fully typed in TypeScript, compliant with WCAG AA contrast standards, and optimized for dual-framework
                parity across both Vue 3.5 and React 19.
              </p>
              <div
                class="border-border/50 bg-muted/40 text-foreground/90 flex items-center justify-between rounded-lg border p-3.5 text-xs"
              >
                <span>Production Status</span>
                <span class="text-primary font-semibold">100% Tested &amp; Verified</span>
              </div>
            </section>
          </div>

          <ui-scroll-spy
            [items]="botItems"
            scrollContainer="#react-scroll-spy-container-bottom"
            position="bottom"
            class="pointer-events-none absolute inset-x-0 bottom-6 z-20 flex justify-center [&>*]:pointer-events-auto"
          />
        </div>
      }
    }
  `,
})
export class ScrollSpyDemoComponent {
  @Input() story?: string
  keepScrolledRight = true
  highlightParentRight = true
  colorRight = 'primary'
  colors = ['primary', 'foreground', 'destructive', '#f59e0b']

  docItems: ScrollSpyItem[] = [
    { href: '#react-demo-installation', title: 'Installation' },
    {
      href: '#react-demo-examples',
      title: 'Examples',
      children: [
        { href: '#react-demo-variants', title: 'Variants' },
        { href: '#react-demo-sizes', title: 'Sizes & Depth' },
        { href: '#react-demo-states', title: 'States & Interaction' },
      ],
    },
    { href: '#react-demo-props', title: 'Props' },
    { href: '#react-demo-dependencies', title: 'Dependencies' },
    { href: '#react-demo-files', title: 'Files' },
  ]

  leftItems: ScrollSpyItem[] = [
    { href: '#react-left-intro', title: 'Introduction' },
    {
      href: '#react-left-arch',
      title: 'Architecture',
      children: [
        { href: '#react-left-tokens', title: 'Design Tokens' },
        { href: '#react-left-spacing', title: 'Spacing Rhythm' },
      ],
    },
    { href: '#react-left-api', title: 'API Specs' },
    { href: '#react-left-faq', title: 'FAQ & Troubleshooting' },
  ]

  angleItems: ScrollSpyItem[] = [
    { href: '#react-angle-installation', title: 'Installation' },
    {
      href: '#react-angle-examples',
      title: 'Examples',
      children: [
        { href: '#react-angle-variants', title: 'Continuous Curves' },
        { href: '#react-angle-sizes', title: 'Depth Tracking' },
        { href: '#react-angle-states', title: 'Optical Alignment' },
      ],
    },
    { href: '#react-angle-props', title: 'Props & Config' },
    { href: '#react-angle-dependencies', title: 'Vector Math' },
  ]

  topItems: ScrollSpyItem[] = [
    { href: '#react-top-step-1', title: 'Account' },
    { href: '#react-top-step-2', title: 'Profile' },
    { href: '#react-top-step-3', title: 'Preferences' },
    { href: '#react-top-step-4', title: 'Review' },
  ]

  spyItems: ScrollSpyItem[] = [
    { href: '#react-top-spy-overview', title: 'Overview' },
    { href: '#react-top-spy-features', title: 'Features' },
    { href: '#react-top-spy-specs', title: 'Specifications' },
    { href: '#react-top-spy-faq', title: 'FAQ' },
  ]

  botItems: ScrollSpyItem[] = [
    { href: '#react-bot-sec-1', title: 'Introduction' },
    { href: '#react-bot-sec-2', title: 'Primitives' },
    { href: '#react-bot-sec-3', title: 'Design' },
    { href: '#react-bot-sec-4', title: 'Production' },
  ]
}
