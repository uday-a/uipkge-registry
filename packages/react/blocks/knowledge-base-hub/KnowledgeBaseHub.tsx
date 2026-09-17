'use client'

import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Clock,
  Code,
  CreditCard,
  Eye,
  HelpCircle,
  MessageSquare,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface Category {
  id: string
  title: string
  description: string
  articlesCount: number
  icon: LucideIcon
  featuredTopics: string[]
}

interface Article {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  viewCount: string
}

export interface KnowledgeBaseHubProps extends React.HTMLAttributes<HTMLDivElement> {}

const QUICK_TOPICS = ['Authentication', 'Billing', 'Webhooks', 'Custom Domains']

const CATEGORIES: Category[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Rocket,
    articlesCount: 14,
    description: 'Quick start guides, installation walkthroughs, and core architecture concepts.',
    featuredTopics: ['Quickstart Guide', 'Project Setup', 'First Deployment'],
  },
  {
    id: 'account-billing',
    title: 'Account & Billing',
    icon: CreditCard,
    articlesCount: 22,
    description: 'Subscription plans, payment methods, invoice management, and seat licensing.',
    featuredTopics: ['Upgrade Plan', 'Payment Methods', 'Invoices'],
  },
  {
    id: 'api-sdks',
    title: 'API & Developer SDKs',
    icon: Code,
    articlesCount: 35,
    description: 'REST & GraphQL endpoints, SDK reference libraries, auth tokens, and rate limits.',
    featuredTopics: ['Authentication', 'Rate Limits', 'SDK Libraries'],
  },
  {
    id: 'security-compliance',
    title: 'Security & Compliance',
    icon: Shield,
    articlesCount: 18,
    description: 'SOC 2 certification, SSO/SAML configuration, audit logs, and data encryption.',
    featuredTopics: ['SAML SSO', 'Audit Logs', 'Data Encryption'],
  },
  {
    id: 'integrations-webhooks',
    title: 'Integrations & Webhooks',
    icon: Blocks,
    articlesCount: 28,
    description: 'Connecting third-party apps, custom webhooks, payload schemas, and event retries.',
    featuredTopics: ['Webhooks Setup', 'Slack App', 'Retry Policies'],
  },
  {
    id: 'troubleshooting-faq',
    title: 'Troubleshooting & FAQ',
    icon: HelpCircle,
    articlesCount: 40,
    description: 'Common error codes, debugging workflows, known limits, and frequent questions.',
    featuredTopics: ['Error Codes', 'Performance', 'Account Recovery'],
  },
]

const TRENDING_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Setting up SAML 2.0 Single Sign-On (SSO)',
    description: 'Step-by-step instructions for configuring Okta, Azure AD, and Google Workspace SSO.',
    category: 'Security',
    readTime: '6 min read',
    viewCount: '14.2k views',
  },
  {
    id: 'art-2',
    title: 'Migrating from v1 REST API to v2 GraphQL',
    description: 'Breaking changes, schema transformations, and backward-compatibility guidelines.',
    category: 'API & SDKs',
    readTime: '8 min read',
    viewCount: '11.8k views',
  },
  {
    id: 'art-3',
    title: 'Configuring Custom Domains & SSL Certificates',
    description: 'DNS record configuration, automatic TLS provisioning, and apex domain routing.',
    category: 'Getting Started',
    readTime: '4 min read',
    viewCount: '9.5k views',
  },
  {
    id: 'art-4',
    title: 'Webhook Signatures & Replay Attack Prevention',
    description: 'Verify HMAC-SHA256 signatures and implement idempotency keys for event handling.',
    category: 'Integrations',
    readTime: '5 min read',
    viewCount: '8.9k views',
  },
  {
    id: 'art-5',
    title: 'Managing Team Roles & Granular Permissions',
    description: 'Assigning RBAC policies, custom permission sets, and project-level scopes.',
    category: 'Account',
    readTime: '5 min read',
    viewCount: '7.4k views',
  },
  {
    id: 'art-6',
    title: 'Debugging 429 Rate Limit Errors & Backoff Strategies',
    description: 'Understanding quota tiers, exponential backoff algorithms, and jitter implementations.',
    category: 'Troubleshooting',
    readTime: '7 min read',
    viewCount: '12.1k views',
  },
]

export function KnowledgeBaseHub({ className, ...props }: KnowledgeBaseHubProps) {
  const [searchQuery, setSearchQuery] = React.useState('')

  function selectTopic(topic: string) {
    if (searchQuery === topic) {
      setSearchQuery('')
    } else {
      setSearchQuery(topic)
    }
  }

  const filteredCategories = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return CATEGORIES
    return CATEGORIES.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.featuredTopics.some((t) => t.toLowerCase().includes(q)),
    )
  }, [searchQuery])

  const filteredArticles = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return TRENDING_ARTICLES
    return TRENDING_ARTICLES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q),
    )
  }, [searchQuery])

  return (
    <div data-slot="knowledge-base-hub" className={cn('w-full space-y-12 py-6', className)} {...props}>
      {/* Hero Header */}
      <section className="mx-auto max-w-3xl space-y-6 text-center">
        <div className="space-y-3">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-medium">
            <Sparkles className="text-primary size-3.5" aria-hidden="true" />
            Help Center & Documentation
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">How can we help you today?</h1>
          <p className="text-muted-foreground mx-auto max-w-xl text-base sm:text-lg">
            Search our knowledge base for guides, API references, troubleshooting tips, and common workflows.
          </p>
        </div>

        <div className="relative mx-auto max-w-2xl">
          <Search
            aria-hidden="true"
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
          />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for answers, guides, and error codes..."
            className="bg-card h-12 rounded-xl pr-14 pl-11 text-base shadow-xs"
          />
          <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
            <kbd className="bg-muted text-muted-foreground border-border hidden h-6 items-center rounded border px-2 font-mono text-xs select-none sm:inline-flex">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-muted-foreground text-xs font-medium">Quick topics:</span>
          {QUICK_TOPICS.map((topic) => (
            <button
              key={topic}
              type="button"
              className={cn(
                'focus-visible:ring-ring inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                searchQuery === topic
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border-transparent',
              )}
              onClick={() => selectTopic(topic)}
            >
              {topic}
            </button>
          ))}
          {searchQuery && (
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 px-1.5 py-1 text-xs font-medium transition-colors"
              onClick={() => setSearchQuery('')}
            >
              <X className="size-3" aria-hidden="true" />
              Clear search
            </button>
          )}
        </div>
      </section>

      {/* Empty Search State */}
      {filteredCategories.length === 0 && filteredArticles.length === 0 && (
        <div className="border-border bg-card/40 rounded-xl border border-dashed p-10 text-center">
          <div className="bg-muted text-muted-foreground mx-auto flex size-12 items-center justify-center rounded-full">
            <Search className="size-6" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-base font-semibold">No matching articles found</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            No guides or categories matched &ldquo;{searchQuery}&rdquo;. Try searching for another topic.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => setSearchQuery('')}>
            Reset search
          </Button>
        </div>
      )}

      {/* Category Cards Grid */}
      {filteredCategories.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Browse by Category</h2>
            <span className="text-muted-foreground text-xs tabular-nums">{filteredCategories.length} categories</span>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((category) => {
              const Icon = category.icon
              return (
                <Card
                  key={category.id}
                  className="group/card hover:border-ring/50 relative flex flex-col justify-between overflow-hidden transition-all duration-200 hover:shadow-sm"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <Badge variant="secondary" className="text-xs font-normal">
                        {category.articlesCount} articles
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg font-semibold tracking-tight">{category.title}</CardTitle>
                    <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="border-border flex flex-wrap gap-1.5 border-t pt-3">
                      {category.featuredTopics.map((topic) => (
                        <span
                          key={topic}
                          className="bg-muted/60 text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="border-border bg-muted/20 flex items-center justify-between border-t py-3">
                    <a
                      href="#"
                      className="text-primary group-hover/card:text-primary/80 focus-visible:ring-ring flex min-h-6 items-center gap-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <span>Explore category</span>
                      <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/card:translate-x-1" />
                    </a>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Popular & Trending Articles Section */}
      {filteredArticles.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">Popular & Trending Articles</h2>
              <p className="text-muted-foreground mt-1 text-sm">
                Frequently read guides and developer documentation this week.
              </p>
            </div>
            <a
              href="#"
              className="text-primary hover:text-primary/80 inline-flex min-h-6 items-center gap-1 text-xs font-medium transition-colors"
            >
              <span>View all documentation</span>
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="group/article hover:border-ring/50 relative flex flex-col justify-between p-5 transition-all duration-200 hover:shadow-sm"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs font-medium">
                      {article.category}
                    </Badge>
                    <div className="text-muted-foreground flex items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" aria-hidden="true" />
                        {article.readTime}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="size-3.5" aria-hidden="true" />
                        {article.viewCount}
                      </span>
                    </div>
                  </div>

                  <div>
                    <a
                      href="#"
                      className="text-foreground group-hover/article:text-primary focus-visible:ring-ring flex items-start justify-between gap-2 text-base font-semibold tracking-tight transition-colors focus-visible:ring-2 focus-visible:outline-none"
                    >
                      <span>{article.title}</span>
                      <ArrowUpRight
                        className="text-muted-foreground group-hover/article:text-primary size-4 shrink-0 transition-transform duration-200 group-hover/article:translate-x-0.5 group-hover/article:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </a>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-relaxed">
                      {article.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Community & Live Support Footer Banner */}
      <Card className="border-border bg-card/60 overflow-hidden shadow-xs">
        <CardContent className="flex flex-col items-center justify-between gap-6 p-8 text-center sm:p-10 md:flex-row md:text-left">
          <div className="max-w-xl space-y-2">
            <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
              Can&apos;t find what you&apos;re looking for?
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our support engineers are available 24/7 to help resolve technical issues, or join our Discord community
              to connect with other developers.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
            <Button className="gap-2">
              <MessageSquare className="size-4" aria-hidden="true" />
              <span>Contact Support</span>
            </Button>
            <Button variant="outline" className="gap-2">
              <Users className="size-4" aria-hidden="true" />
              <span>Join Discord Community</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
