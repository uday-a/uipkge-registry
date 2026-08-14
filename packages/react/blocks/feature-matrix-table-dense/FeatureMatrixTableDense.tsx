import * as React from 'react'
import { ArrowRight, Check, ChevronDown, ChevronRight, Filter, Minus, Search, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MatrixFeature {
  name: string
  description: string
  uipkge: boolean | string
  npmMonolith: boolean | string
  inHouse: boolean | string
}

export interface MatrixCategory {
  id: string
  title: string
  features: MatrixFeature[]
}

export interface FeatureMatrixTableDenseProps {
  title?: string
  description?: string
  categories?: MatrixCategory[]
  className?: string
}

const DEFAULT_CATEGORIES: MatrixCategory[] = [
  {
    id: 'architecture',
    title: 'Architecture & Runtime Ownership',
    features: [
      {
        name: 'Zero NPM Runtime Dependency',
        description: 'Source code copied directly into your repository with 100% ownership.',
        uipkge: true,
        npmMonolith: false,
        inHouse: true,
      },
      {
        name: 'Dual Framework 1:1 Parity',
        description: 'Synchronized Vue 3.5 and React 19 primitives with identical token bindings.',
        uipkge: true,
        npmMonolith: false,
        inHouse: 'High Cost',
      },
      {
        name: 'Deterministic Tree-Shaking',
        description: 'Zero dead code in final production bundles; only imported components compile.',
        uipkge: true,
        npmMonolith: 'Partial',
        inHouse: true,
      },
      {
        name: 'Tailwind CSS v4 Native Tokens',
        description: 'Direct @theme inline OKLCH bindings without legacy tailwind.config.js overhead.',
        uipkge: true,
        npmMonolith: false,
        inHouse: 'Manual',
      },
    ],
  },
  {
    id: 'developer-experience',
    title: 'Developer Experience & Tooling',
    features: [
      {
        name: 'Headless Primitive Foundation',
        description: 'Powered by battle-tested Reka UI and Radix UI accessible state machines.',
        uipkge: true,
        npmMonolith: 'Proprietary',
        inHouse: 'Custom',
      },
      {
        name: 'CLI Direct Add Workflow',
        description: 'Install via npx shadcn add @uipkge/<name> with automated dependency resolution.',
        uipkge: true,
        npmMonolith: false,
        inHouse: false,
      },
      {
        name: 'Automated Parity Check Suite',
        description: 'Built-in AST parity verification scripts guarding against framework drift.',
        uipkge: true,
        npmMonolith: false,
        inHouse: false,
      },
    ],
  },
  {
    id: 'enterprise',
    title: 'Enterprise & Security Compliance',
    features: [
      {
        name: 'Zero Supply-Chain Vulnerabilities',
        description: 'No third-party registry packages or compromised transitive semver updates.',
        uipkge: true,
        npmMonolith: false,
        inHouse: true,
      },
      {
        name: 'Full Customization Freedom',
        description: 'Modify any CSS class, DOM attribute, or internal logic without breaking upstream.',
        uipkge: true,
        npmMonolith: 'Limited',
        inHouse: true,
      },
      {
        name: 'WCAG 2.1 AA Accessibility',
        description: 'Keyboard ergonomics, focus rings, ARIA roles, and screen-reader audited.',
        uipkge: true,
        npmMonolith: 'Partial',
        inHouse: 'Manual',
      },
    ],
  },
]

export function FeatureMatrixTableDense({
  title = 'Engineered for teams who demand complete source code control.',
  description = 'Compare how unbundled registry components stack up against traditional monolithic npm packages and bespoke in-house design systems.',
  categories = DEFAULT_CATEGORIES,
  className,
}: FeatureMatrixTableDenseProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [onlyDifferences, setOnlyDifferences] = React.useState(false)
  const [collapsedCategories, setCollapsedCategories] = React.useState<Record<string, boolean>>({})

  function toggleCategory(catId: string) {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }))
  }

  const filteredCategories = React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return categories
      .map((cat) => {
        const filteredFeatures = cat.features.filter((f) => {
          const matchesQuery =
            !query || f.name.toLowerCase().includes(query) || f.description.toLowerCase().includes(query)

          if (!matchesQuery) return false

          if (onlyDifferences) {
            const isSame = f.uipkge === f.npmMonolith && f.npmMonolith === f.inHouse
            if (isSame) return false
          }

          return true
        })

        return {
          ...cat,
          features: filteredFeatures,
        }
      })
      .filter((cat) => cat.features.length > 0)
  }, [categories, searchQuery, onlyDifferences])

  return (
    <section
      data-slot="feature-matrix-table-dense"
      className={cn('bg-background relative overflow-hidden py-16 sm:py-24', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <a
            href="#technical-matrix"
            className="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
          >
            <Sparkles className="text-primary size-3.5" />
            <span>Technical Architecture Comparison</span>
            <ArrowRight className="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>

          <p className="text-muted-foreground text-base sm:text-lg">{description}</p>
        </div>

        {/* Controls Strip: Search & Filter Toggles */}
        <div className="border-border mt-10 flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter capabilities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-border bg-muted/40 text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-8 w-full rounded-md border pr-3 pl-8 text-xs focus-visible:ring-1 focus-visible:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className={cn(
                'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors',
                onlyDifferences
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setOnlyDifferences((prev) => !prev)}
            >
              <Filter className="size-3" />
              <span>Show Differences Only</span>
            </button>
          </div>
        </div>

        {/* Dense Comparison Matrix Table */}
        <div className="border-border bg-card mt-6 overflow-x-auto rounded-lg border shadow-xs">
          <table className="w-full text-left text-xs">
            {/* Table Sticky Header */}
            <thead className="border-border bg-muted/50 text-foreground border-b font-medium">
              <tr>
                <th scope="col" className="w-1/2 py-3.5 pr-3 pl-4 text-sm font-semibold sm:w-5/12 sm:pl-6">
                  Capability & Specification
                </th>
                <th
                  scope="col"
                  className="text-primary bg-primary/5 border-border border-x px-3 py-3.5 text-center font-bold sm:w-3/12"
                >
                  <div className="flex flex-col items-center">
                    <span>UIPKGE Registry</span>
                    <span className="text-muted-foreground text-xs font-normal">Unbundled Code Ownership</span>
                  </div>
                </th>
                <th scope="col" className="text-muted-foreground px-3 py-3.5 text-center sm:w-2/12">
                  <div className="flex flex-col items-center">
                    <span>NPM Monolith</span>
                    <span className="text-muted-foreground text-xs font-normal">e.g. MUI / AntD</span>
                  </div>
                </th>
                <th scope="col" className="text-muted-foreground px-3 py-3.5 text-center sm:w-2/12">
                  <div className="flex flex-col items-center">
                    <span>In-House Bespoke</span>
                    <span className="text-muted-foreground text-xs font-normal">Built from scratch</span>
                  </div>
                </th>
              </tr>
            </thead>

            {/* Table Body with Collapsible Category Rows */}
            <tbody className="divide-border/60 divide-y">
              {filteredCategories.map((category) => (
                <React.Fragment key={category.id}>
                  {/* Category Header Row */}
                  <tr
                    className="bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors select-none"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <td colSpan={4} className="py-2.5 pr-3 pl-4 sm:pl-6">
                      <div className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                        {!collapsedCategories[category.id] ? (
                          <ChevronDown className="text-muted-foreground size-3.5" />
                        ) : (
                          <ChevronRight className="text-muted-foreground size-3.5" />
                        )}
                        <span>{category.title}</span>
                        <span className="text-muted-foreground ml-1 text-xs font-normal">
                          ({category.features.length})
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Feature Items Rows */}
                  {!collapsedCategories[category.id] &&
                    category.features.map((feature, fIdx) => (
                      <tr key={fIdx} className="hover:bg-muted/10 transition-colors">
                        {/* Feature Info (Col 1) */}
                        <td className="space-y-0.5 py-3 pr-3 pl-4 sm:pl-6">
                          <div className="text-foreground font-semibold">{feature.name}</div>
                          <div className="text-muted-foreground text-xs">{feature.description}</div>
                        </td>

                        {/* UIPKGE (Col 2 - Highlighted) */}
                        <td className="bg-primary/5 border-border border-x px-3 py-3 text-center">
                          <div className="flex items-center justify-center">
                            {feature.uipkge === true ? (
                              <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-500/10 font-bold text-emerald-500">
                                <Check className="size-3.5 stroke-[2.5]" />
                              </span>
                            ) : typeof feature.uipkge === 'string' ? (
                              <span className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs font-medium">
                                {feature.uipkge}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">
                                <Minus className="size-3.5" />
                              </span>
                            )}
                          </div>
                        </td>

                        {/* NPM Monolith (Col 3) */}
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center">
                            {feature.npmMonolith === true ? (
                              <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                <Check className="size-3.5" />
                              </span>
                            ) : typeof feature.npmMonolith === 'string' ? (
                              <span className="bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs font-medium">
                                {feature.npmMonolith}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/60">
                                <Minus className="size-3.5" />
                              </span>
                            )}
                          </div>
                        </td>

                        {/* In-House Bespoke (Col 4) */}
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center">
                            {feature.inHouse === true ? (
                              <span className="inline-flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                                <Check className="size-3.5" />
                              </span>
                            ) : typeof feature.inHouse === 'string' ? (
                              <span className="bg-muted/60 text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs font-medium">
                                {feature.inHouse}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/60">
                                <Minus className="size-3.5" />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
