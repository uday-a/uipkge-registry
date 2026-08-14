'use client'

import * as React from 'react'
import {
  Activity,
  Boxes,
  Braces,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  FileCode,
  Link2,
  MoreHorizontal,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  Terminal,
  Trash2,
  Wrench,
  X,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type TransportType = 'stdio' | 'sse'
export type ServerStatus = 'healthy' | 'reconnecting' | 'degraded'

export interface ToolParam {
  name: string
  type: 'string' | 'number' | 'boolean' | 'object' | 'array'
  required: boolean
  description: string
  default?: string
  enum?: string[]
}

export interface ToolSchema {
  name: string
  displayName: string
  description: string
  category: 'documentation' | 'database' | 'version-control' | 'deployment' | 'web-search' | 'observability'
  parameters: ToolParam[]
  sampleRpcRequest: {
    jsonrpc: '2.0'
    id: string
    method: 'tools/call'
    params: {
      name: string
      arguments: Record<string, any>
    }
  }
  sampleRpcResponse: {
    jsonrpc: '2.0'
    id: string
    result: {
      content: Array<{
        type: 'text' | 'resource' | 'image'
        text?: string
        resource?: any
      }>
      isError: boolean
    }
  }
}

export interface ResourceTemplate {
  uriTemplate: string
  name: string
  description: string
  mimeType: string
}

export interface McpServer {
  id: string
  name: string
  scope: string
  version: string
  transport: TransportType
  commandOrUrl: string
  status: ServerStatus
  uptime: string
  latencyMs: number
  callsToday: number
  description: string
  envVars: string[]
  resourceTemplates: ResourceTemplate[]
  tools: ToolSchema[]
}

export interface McpServerRegistryManagerProps {
  className?: string
  initialSearch?: string
  initialTransportFilter?: 'all' | 'stdio' | 'sse'
  initialStatusFilter?: 'all' | 'healthy' | 'reconnecting'
  initialSelectedToolName?: string
  initialDrawerOpen?: boolean
  initialInstallDialogOpen?: boolean
  initialHandshakeAlert?: boolean
  initialServers?: McpServer[]
}

const defaultServers: McpServer[] = [
  {
    id: 'server-ctx-1',
    name: 'mcp/context7-docs',
    scope: '@context7/mcp-server',
    version: 'v1.4.2',
    transport: 'stdio',
    commandOrUrl: 'npx -y @context7/mcp-server',
    status: 'healthy',
    uptime: '99.98%',
    latencyMs: 18,
    callsToday: 4120,
    description: 'Context-aware documentation retriever and code snippet indexer for public libraries and frameworks.',
    envVars: ['CONTEXT7_API_KEY=c7_live_***', 'CACHE_TTL=3600'],
    resourceTemplates: [
      {
        uriTemplate: 'docs://{library}/{version}',
        name: 'Library Documentation AST',
        description: 'Direct access to indexed AST documentation, type exports, and code snippets',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'cheatsheets://{framework}/api-reference',
        name: 'Framework Cheatsheet',
        description: 'High-density API method cheat sheets and migration summaries',
        mimeType: 'text/markdown',
      },
    ],
    tools: [
      {
        name: 'query_docs',
        displayName: 'Query Library Docs',
        description:
          'Retrieves up-to-date documentation and code examples from Context7 for any programming library or framework.',
        category: 'documentation',
        parameters: [
          {
            name: 'libraryId',
            type: 'string',
            required: true,
            description: 'Exact Context7-compatible library ID (e.g. /tailwindlabs/tailwindcss or /unovue/reka-ui).',
          },
          {
            name: 'query',
            type: 'string',
            required: true,
            description: 'What to look up in the library documentation, scoped to a single concept.',
          },
          {
            name: 'limit',
            type: 'number',
            required: false,
            default: '5',
            description: 'Maximum number of relevant code snippets to return (1-20).',
          },
          {
            name: 'includeSnippets',
            type: 'boolean',
            required: false,
            default: 'true',
            description: 'Whether to include verified code snippet examples in markdown format.',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-ctx-001',
          method: 'tools/call',
          params: {
            name: 'query_docs',
            arguments: {
              libraryId: '/tailwindlabs/tailwindcss',
              query: 'CSS variables and OKLCH color palettes v4',
              limit: 3,
              includeSnippets: true,
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-ctx-001',
          result: {
            content: [
              {
                type: 'text',
                text: 'Tailwind CSS v4 introduces native CSS-first theme configuration using `@theme` and OKLCH color functions without javascript config files.',
              },
            ],
            isError: false,
          },
        },
      },
      {
        name: 'resolve_library_id',
        displayName: 'Resolve Library ID',
        description:
          'Resolves a package or product name to a Context7-compatible library ID and returns matching ranked libraries.',
        category: 'documentation',
        parameters: [
          {
            name: 'libraryName',
            type: 'string',
            required: true,
            description: 'Library name to search for (e.g. Next.js, Reka UI, Lucide).',
          },
          {
            name: 'ecosystem',
            type: 'string',
            required: false,
            default: 'npm',
            enum: ['npm', 'pypi', 'crates', 'go', 'gem'],
            description: 'Package registry ecosystem to prioritize during identifier resolution.',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-ctx-002',
          method: 'tools/call',
          params: {
            name: 'resolve_library_id',
            arguments: {
              libraryName: 'reka-ui',
              ecosystem: 'npm',
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-ctx-002',
          result: {
            content: [
              {
                type: 'text',
                text: '{"libraryId":"/unovue/reka-ui","name":"Reka UI","description":"Headless UI primitives for Vue 3.5","reputation":"High","benchmarkScore":99}',
              },
            ],
            isError: false,
          },
        },
      },
    ],
  },
  {
    id: 'server-pg-2',
    name: 'mcp/postgres-inspector',
    scope: '@modelcontextprotocol/server-postgres',
    version: 'v0.9.1',
    transport: 'stdio',
    commandOrUrl: 'npx -y @modelcontextprotocol/server-postgres postgresql://app_user:***@db.internal:5432/prod_main',
    status: 'healthy',
    uptime: '99.95%',
    latencyMs: 24,
    callsToday: 3450,
    description:
      'Direct PostgreSQL read-only query execution, EXPLAIN execution plan inspector, and live schema reflection.',
    envVars: ['PGSSLMODE=require', 'MAX_CONNECTIONS=10'],
    resourceTemplates: [
      {
        uriTemplate: 'postgres://{schema}/{table}',
        name: 'Table Schema Definition',
        description: 'PostgreSQL table column constraints, foreign keys, row count estimations, and B-Tree indexes',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'postgres://metrics/slow-queries',
        name: 'PgStatStatements Log Buffer',
        description: 'Aggregated query execution statistics and cache hit ratios',
        mimeType: 'application/json',
      },
    ],
    tools: [
      {
        name: 'execute_sql',
        displayName: 'Execute Read-Only SQL',
        description:
          'Executes read-only SQL queries against Postgres connection with safe execution timeout safeguards.',
        category: 'database',
        parameters: [
          {
            name: 'query',
            type: 'string',
            required: true,
            description: 'SQL statement (SELECT only) to execute on the cluster.',
          },
          {
            name: 'readOnly',
            type: 'boolean',
            required: false,
            default: 'true',
            description: 'Enforces transaction read-only flag before executing SQL.',
          },
          {
            name: 'timeoutMs',
            type: 'number',
            required: false,
            default: '5000',
            description: 'Statement cancellation timeout in milliseconds.',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-pg-001',
          method: 'tools/call',
          params: {
            name: 'execute_sql',
            arguments: {
              query: 'SELECT id, email, role, created_at FROM public.users WHERE is_active = true LIMIT 5;',
              readOnly: true,
              timeoutMs: 5000,
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-pg-001',
          result: {
            content: [
              {
                type: 'text',
                text: '{"rows":[{"id":"usr_8492","email":"alex@example.com","role":"admin","created_at":"2026-02-14T08:30:00Z"}],"rowCount":1,"durationMs":14.2}',
              },
            ],
            isError: false,
          },
        },
      },
      {
        name: 'explain_query',
        displayName: 'Explain Query Plan',
        description: 'Runs EXPLAIN ANALYZE on query plans to detect slow sequential scans and missing indexes.',
        category: 'database',
        parameters: [
          {
            name: 'query',
            type: 'string',
            required: true,
            description: 'SQL query to analyze execution graph and node timings.',
          },
          {
            name: 'analyze',
            type: 'boolean',
            required: false,
            default: 'true',
            description: 'Execute statement to measure actual wall-clock row counts and buffer usage.',
          },
          {
            name: 'format',
            type: 'string',
            required: false,
            default: 'json',
            enum: ['json', 'text', 'yaml'],
            description: 'Postgres execution plan output serialization format.',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-pg-002',
          method: 'tools/call',
          params: {
            name: 'explain_query',
            arguments: {
              query: 'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC;',
              analyze: true,
              format: 'json',
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-pg-002',
          result: {
            content: [
              {
                type: 'text',
                text: '{"Plan":{"Node Type":"Index Scan","Index Name":"idx_orders_user_id","Startup Cost":0.42,"Total Cost":8.44,"Plan Rows":1,"Actual Rows":1,"Actual Total Time":0.114}}',
              },
            ],
            isError: false,
          },
        },
      },
      {
        name: 'inspect_schema',
        displayName: 'Inspect Schema Meta',
        description: 'Returns table column definitions, constraints, foreign keys, and indexes for a database schema.',
        category: 'database',
        parameters: [
          {
            name: 'schema',
            type: 'string',
            required: false,
            default: 'public',
            description: 'Target namespace schema name (e.g. public, auth, billing).',
          },
          {
            name: 'includeForeignKeys',
            type: 'boolean',
            required: false,
            default: 'true',
            description: 'Include relation cardinality graphs and ON DELETE cascade actions.',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-pg-003',
          method: 'tools/call',
          params: {
            name: 'inspect_schema',
            arguments: {
              schema: 'public',
              includeForeignKeys: true,
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-pg-003',
          result: {
            content: [
              {
                type: 'text',
                text: '{"schema":"public","tablesCount":18,"tables":["users","teams","orders","invoices","audit_logs"]}',
              },
            ],
            isError: false,
          },
        },
      },
    ],
  },
  {
    id: 'server-gh-3',
    name: 'mcp/github-tools',
    scope: '@modelcontextprotocol/server-github',
    version: 'v2.1.0',
    transport: 'stdio',
    commandOrUrl: 'npx -y @modelcontextprotocol/server-github',
    status: 'healthy',
    uptime: '99.91%',
    latencyMs: 92,
    callsToday: 2890,
    description:
      'GitHub REST & GraphQL API bindings for pull request management, diff inspection, and GitHub Actions CI triggers.',
    envVars: ['GITHUB_PERSONAL_ACCESS_TOKEN=ghp_live_***'],
    resourceTemplates: [
      {
        uriTemplate: 'github://repos/{owner}/{repo}/pulls/{number}',
        name: 'Pull Request Snapshot',
        description: 'Structured pull request metadata, commits, CI checks, and review discussions',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'github://repos/{owner}/{repo}/actions/{runId}',
        name: 'CI Workflow Run Logs',
        description: 'GitHub Actions build step outputs and failure diagnostics',
        mimeType: 'text/plain',
      },
    ],
    tools: [
      {
        name: 'create_pr',
        displayName: 'Create Pull Request',
        description: 'Creates a GitHub pull request with title, description, branch target, and reviewer tags.',
        category: 'version-control',
        parameters: [
          { name: 'owner', type: 'string', required: true, description: 'GitHub account or organization name.' },
          { name: 'repo', type: 'string', required: true, description: 'Repository name.' },
          { name: 'title', type: 'string', required: true, description: 'Pull request header title.' },
          { name: 'head', type: 'string', required: true, description: 'Source branch containing commits.' },
          { name: 'base', type: 'string', required: true, description: 'Target branch (e.g. main).' },
          { name: 'draft', type: 'boolean', required: false, default: 'false', description: 'Create in draft mode.' },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-gh-001',
          method: 'tools/call',
          params: {
            name: 'create_pr',
            arguments: {
              owner: 'uday-a',
              repo: 'uipkge',
              title: 'feat(mcp): add mcp-server-registry-manager block',
              head: 'feat/mcp-manager',
              base: 'main',
              draft: false,
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-gh-001',
          result: {
            content: [
              {
                type: 'text',
                text: '{"number":142,"url":"https://github.com/uday-a/uipkge/pull/142","status":"open","mergeable":true}',
              },
            ],
            isError: false,
          },
        },
      },
      {
        name: 'review_diff',
        displayName: 'Review Diff',
        description: 'Fetches and analyzes pull request unified diffs against target base branch.',
        category: 'version-control',
        parameters: [
          { name: 'owner', type: 'string', required: true, description: 'Repository owner.' },
          { name: 'repo', type: 'string', required: true, description: 'Repository name.' },
          { name: 'pullNumber', type: 'number', required: true, description: 'GitHub pull request number.' },
          {
            name: 'contextLines',
            type: 'number',
            required: false,
            default: '3',
            description: 'Number of surrounding context lines to include.',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-gh-002',
          method: 'tools/call',
          params: {
            name: 'review_diff',
            arguments: {
              owner: 'uday-a',
              repo: 'uipkge',
              pullNumber: 142,
              contextLines: 3,
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-gh-002',
          result: {
            content: [
              {
                type: 'text',
                text: 'diff --git a/components/blocks/McpServerRegistryManager.tsx b/components/blocks/McpServerRegistryManager.tsx\n+export function McpServerRegistryManager() { return <div>...</div> }',
              },
            ],
            isError: false,
          },
        },
      },
      {
        name: 'merge_pr',
        displayName: 'Merge Pull Request',
        description: 'Performs squash-merge or merge commit with branch auto-deletion.',
        category: 'version-control',
        parameters: [
          { name: 'owner', type: 'string', required: true, description: 'Repository owner.' },
          { name: 'repo', type: 'string', required: true, description: 'Repository name.' },
          { name: 'pullNumber', type: 'number', required: true, description: 'Pull request number.' },
          {
            name: 'mergeMethod',
            type: 'string',
            required: false,
            default: 'squash',
            enum: ['squash', 'merge', 'rebase'],
            description: 'Git merge strategy to apply.',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-gh-003',
          method: 'tools/call',
          params: {
            name: 'merge_pr',
            arguments: {
              owner: 'uday-a',
              repo: 'uipkge',
              pullNumber: 142,
              mergeMethod: 'squash',
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-gh-003',
          result: {
            content: [
              {
                type: 'text',
                text: '{"sha":"8a7c2b3d...","merged":true,"message":"Pull Request successfully merged and closed"}',
              },
            ],
            isError: false,
          },
        },
      },
      {
        name: 'get_workflow_runs',
        displayName: 'Get Workflow Runs',
        description: 'Lists GitHub Actions CI workflow run statuses and failure logs.',
        category: 'version-control',
        parameters: [
          { name: 'owner', type: 'string', required: true, description: 'Repository owner.' },
          { name: 'repo', type: 'string', required: true, description: 'Repository name.' },
          {
            name: 'status',
            type: 'string',
            required: false,
            default: 'completed',
            enum: ['completed', 'in_progress', 'queued', 'failure'],
            description: 'Filter CI runs by lifecycle status.',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-gh-004',
          method: 'tools/call',
          params: {
            name: 'get_workflow_runs',
            arguments: {
              owner: 'uday-a',
              repo: 'uipkge',
              status: 'completed',
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-gh-004',
          result: {
            content: [
              {
                type: 'text',
                text: '{"total_count":24,"workflow_runs":[{"id":9812401,"name":"CI Registry Build","conclusion":"success"}]}',
              },
            ],
            isError: false,
          },
        },
      },
    ],
  },
  {
    id: 'server-cf-4',
    name: 'mcp/cloudflare-deployer',
    scope: '@cloudflare/mcp-pages-worker',
    version: 'v3.0.4',
    transport: 'sse',
    commandOrUrl: 'https://mcp-gateway.cloudflare.com/sse/v1/uipkge-prod',
    status: 'healthy',
    uptime: '100.0%',
    latencyMs: 48,
    callsToday: 1180,
    description:
      'Edge runtime deployment automation, real-time Cloudflare Worker telemetry log tailing, and CDN cache invalidation.',
    envVars: ['CLOUDFLARE_API_TOKEN=cft_live_***', 'CLOUDFLARE_ACCOUNT_ID=8bb9e07a...'],
    resourceTemplates: [
      {
        uriTemplate: 'cloudflare://zones/{zoneId}/pages',
        name: 'Pages Deployment Manifest',
        description: 'Active production and preview deployment bundles with rollback pointers',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'cloudflare://workers/{scriptName}/tail',
        name: 'Live Worker Telemetry Stream',
        description: 'Real-time structured event logs, CPU execution times, and exceptions',
        mimeType: 'application/x-ndjson',
      },
    ],
    tools: [
      {
        name: 'deploy_pages',
        displayName: 'Deploy Cloudflare Pages',
        description: 'Triggers atomic Cloudflare Pages deployment bundle upload with verification.',
        category: 'deployment',
        parameters: [
          {
            name: 'projectName',
            type: 'string',
            required: true,
            description: 'Cloudflare Pages project name (uipkge).',
          },
          { name: 'branch', type: 'string', required: true, description: 'Git branch trigger (e.g. main).' },
          { name: 'commitHash', type: 'string', required: true, description: 'Target 40-char Git commit hash.' },
          {
            name: 'environment',
            type: 'string',
            required: false,
            default: 'production',
            enum: ['production', 'preview'],
            description: 'Deployment target stage.',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-cf-001',
          method: 'tools/call',
          params: {
            name: 'deploy_pages',
            arguments: {
              projectName: 'uipkge',
              branch: 'main',
              commitHash: '7c8b91a24d0e932b12f4567890abcdef12345678',
              environment: 'production',
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-cf-001',
          result: {
            content: [
              {
                type: 'text',
                text: '{"deploymentId":"dep_9801a","url":"https://uipkge.dev","status":"active","buildDurationSec":14}',
              },
            ],
            isError: false,
          },
        },
      },
      {
        name: 'purge_cache',
        displayName: 'Purge CDN Cache',
        description: 'Purges Cloudflare CDN cache zones by URL pattern or Cache-Tag headers.',
        category: 'deployment',
        parameters: [
          { name: 'zoneId', type: 'string', required: true, description: 'Cloudflare Zone identifier.' },
          {
            name: 'purgeEverything',
            type: 'boolean',
            required: false,
            default: 'false',
            description: 'Purge entire CDN edge cache.',
          },
          { name: 'tags', type: 'array', required: false, description: 'Array of Cache-Tag headers to invalidate.' },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-cf-002',
          method: 'tools/call',
          params: {
            name: 'purge_cache',
            arguments: {
              zoneId: 'zn_uipkge_core_912',
              purgeEverything: false,
              tags: ['registry-json', 'llms-txt'],
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-cf-002',
          result: {
            content: [
              {
                type: 'text',
                text: '{"success":true,"purgedTags":["registry-json","llms-txt"],"timestamp":"2026-08-21T10:45:00Z"}',
              },
            ],
            isError: false,
          },
        },
      },
      {
        name: 'tail_worker_logs',
        displayName: 'Tail Worker Logs',
        description: 'Subscribes to real-time Cloudflare Worker telemetry logs and exception traces.',
        category: 'deployment',
        parameters: [
          { name: 'scriptName', type: 'string', required: true, description: 'Worker script identifier.' },
          {
            name: 'samplingRate',
            type: 'number',
            required: false,
            default: '1.0',
            description: 'Trace event sampling ratio (0.1 to 1.0).',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-cf-003',
          method: 'tools/call',
          params: {
            name: 'tail_worker_logs',
            arguments: {
              scriptName: 'uipkge-registry-proxy',
              samplingRate: 1.0,
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-cf-003',
          result: {
            content: [
              {
                type: 'text',
                text: '{"sessionId":"tail_sess_904","status":"streaming","eventsProcessed":480}',
              },
            ],
            isError: false,
          },
        },
      },
    ],
  },
  {
    id: 'server-bv-5',
    name: 'mcp/brave-search',
    scope: '@modelcontextprotocol/server-brave-search',
    version: 'v1.1.2',
    transport: 'sse',
    commandOrUrl: 'https://mcp-stream.brave.internal/sse?channel=research',
    status: 'reconnecting',
    uptime: '98.40%',
    latencyMs: 165,
    callsToday: 840,
    description: 'Privacy-preserving web search, index lookup, and clean markdown extraction from live URLs.',
    envVars: ['BRAVE_API_KEY=bsa_live_***', 'RATE_LIMIT_RPS=20'],
    resourceTemplates: [
      {
        uriTemplate: 'search://web/{query}',
        name: 'Real-Time Web Search Cache',
        description: 'Cached organic search result nodes with domain trust rankings',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'webpage://cached/{urlHash}',
        name: 'Normalized Page Mirror',
        description: 'Clean reader-mode markdown representation of fetched webpage',
        mimeType: 'text/markdown',
      },
    ],
    tools: [
      {
        name: 'brave_search',
        displayName: 'Brave Web Search',
        description: 'Queries Brave Search API for web results, snippets, publishing dates, and ranking scores.',
        category: 'web-search',
        parameters: [
          { name: 'query', type: 'string', required: true, description: 'Search term or technical keyword.' },
          {
            name: 'count',
            type: 'number',
            required: false,
            default: '10',
            description: 'Number of organic results (1-20).',
          },
          {
            name: 'freshness',
            type: 'string',
            required: false,
            enum: ['pd', 'pw', 'pm', 'py'],
            description: 'Filter by time horizon: past day, week, month, or year.',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-bv-001',
          method: 'tools/call',
          params: {
            name: 'brave_search',
            arguments: {
              query: 'Reka UI Vue 3.5 release notes',
              count: 5,
              freshness: 'pm',
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-bv-001',
          result: {
            content: [
              {
                type: 'text',
                text: '{"results":[{"title":"Reka UI v1.4 Documentation","url":"https://reka-ui.com","snippet":"Radix-vue is now Reka UI with Vue 3.5 TypeScript improvements."}]}',
              },
            ],
            isError: false,
          },
        },
      },
      {
        name: 'fetch_web_content',
        displayName: 'Fetch Web Content',
        description: 'Fetches full clean markdown representations from verified web URLs.',
        category: 'web-search',
        parameters: [
          { name: 'url', type: 'string', required: true, description: 'Fully qualified HTTP/HTTPS URL to crawl.' },
          {
            name: 'format',
            type: 'string',
            required: false,
            default: 'markdown',
            enum: ['markdown', 'text', 'html'],
            description: 'Target format of extracted webpage body content.',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-bv-002',
          method: 'tools/call',
          params: {
            name: 'fetch_web_content',
            arguments: {
              url: 'https://modelcontextprotocol.io/introduction',
              format: 'markdown',
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-bv-002',
          result: {
            content: [
              {
                type: 'text',
                text: '# Model Context Protocol\n\nMCP is an open standard that enables developers to build secure, two-way connections between their data sources and AI-powered tools.',
              },
            ],
            isError: false,
          },
        },
      },
    ],
  },
  {
    id: 'server-sn-6',
    name: 'mcp/sentry-telemetry',
    scope: '@sentry/mcp-telemetry',
    version: 'v1.8.0',
    transport: 'stdio',
    commandOrUrl: 'npx -y @sentry/mcp-telemetry --org=uipkge',
    status: 'healthy',
    uptime: '99.99%',
    latencyMs: 35,
    callsToday: 820,
    description:
      'Production crash monitoring, unhandled exceptions triage, and stacktrace source-mapping for AI agents.',
    envVars: ['SENTRY_AUTH_TOKEN=sntrys_live_***', 'SENTRY_ORG=uipkge'],
    resourceTemplates: [
      {
        uriTemplate: 'sentry://projects/{project}/issues/{issueId}',
        name: 'Sentry Issue Context',
        description: 'Resolved source maps, breadcrumbs trail, device context, and user impact rate',
        mimeType: 'application/json',
      },
      {
        uriTemplate: 'sentry://projects/{project}/stats/24h',
        name: 'Hourly Error Volume',
        description: 'Aggregated error frequency histograms across release versions',
        mimeType: 'application/json',
      },
    ],
    tools: [
      {
        name: 'query_sentry_issues',
        displayName: 'Query Sentry Issues',
        description: 'Lists unhandled exceptions and regression issues by release tag and frequency.',
        category: 'observability',
        parameters: [
          { name: 'project', type: 'string', required: true, description: 'Sentry project slug.' },
          { name: 'query', type: 'string', required: false, description: 'Sentry search query (e.g. is:unresolved).' },
          {
            name: 'statsPeriod',
            type: 'string',
            required: false,
            default: '24h',
            enum: ['24h', '14d', '30d'],
            description: 'Time window for issue occurrence statistics.',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-sn-001',
          method: 'tools/call',
          params: {
            name: 'query_sentry_issues',
            arguments: {
              project: 'uipkge-astro-site',
              query: 'is:unresolved level:error',
              statsPeriod: '24h',
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-sn-001',
          result: {
            content: [
              {
                type: 'text',
                text: '{"issues":[{"id":"iss_991","title":"TypeError: Cannot read properties of undefined (reading \'dataset\')","count":3,"lastSeen":"2026-08-21T09:12:00Z"}]}',
              },
            ],
            isError: false,
          },
        },
      },
      {
        name: 'get_issue_stacktrace',
        displayName: 'Get De-minified Stacktrace',
        description: 'Retrieves de-minified source code stacktrace and breadcrumb chain for an error ID.',
        category: 'observability',
        parameters: [
          { name: 'issueId', type: 'string', required: true, description: 'Unique Sentry issue identifier.' },
          {
            name: 'expandContext',
            type: 'boolean',
            required: false,
            default: 'true',
            description: 'Include 5 lines of source code surrounding the crashing line.',
          },
        ],
        sampleRpcRequest: {
          jsonrpc: '2.0',
          id: 'req-sn-002',
          method: 'tools/call',
          params: {
            name: 'get_issue_stacktrace',
            arguments: {
              issueId: 'iss_991',
              expandContext: true,
            },
          },
        },
        sampleRpcResponse: {
          jsonrpc: '2.0',
          id: 'req-sn-002',
          result: {
            content: [
              {
                type: 'text',
                text: '{"filename":"src/components/story/Story.tsx","lineno":42,"colno":14,"function":"handleCopy","contextLine":"navigator.clipboard.writeText(props.code)"}',
              },
            ],
            isError: false,
          },
        },
      },
    ],
  },
]

function getToolSchemaDraft7(tool: ToolSchema) {
  const properties: Record<string, any> = {}
  const required: string[] = []

  for (const p of tool.parameters) {
    properties[p.name] = {
      type: p.type,
      description: p.description,
    }
    if (p.default !== undefined) properties[p.name].default = p.default
    if (p.enum) properties[p.name].enum = p.enum
    if (p.required) required.push(p.name)
  }

  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties,
    required,
    additionalProperties: false,
  }
}

export function McpServerRegistryManager({
  className,
  initialSearch = '',
  initialTransportFilter = 'all',
  initialStatusFilter = 'all',
  initialSelectedToolName,
  initialDrawerOpen = false,
  initialInstallDialogOpen = false,
  initialHandshakeAlert = false,
  initialServers,
}: McpServerRegistryManagerProps) {
  const [servers, setServers] = React.useState<McpServer[]>(() =>
    initialServers ? [...initialServers] : [...defaultServers],
  )
  const [searchQuery, setSearchQuery] = React.useState(initialSearch)
  const [transportFilter, setTransportFilter] = React.useState<'all' | 'stdio' | 'sse'>(initialTransportFilter)
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'healthy' | 'reconnecting'>(initialStatusFilter)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(initialDrawerOpen)
  const [isInstallDialogOpen, setIsInstallDialogOpen] = React.useState(initialInstallDialogOpen)
  const [handshakeAlertVisible, setHandshakeAlertVisible] = React.useState(initialHandshakeAlert)
  const [isHandshaking, setIsHandshaking] = React.useState(false)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)
  const [inspectorTab, setInspectorTab] = React.useState<'request' | 'response' | 'schema'>('request')
  const [activeViewTab, setActiveViewTab] = React.useState<'servers' | 'handshake-logs' | 'config-json'>('servers')

  // Selected tool & server for the schema drawer
  const [selectedServer, setSelectedServer] = React.useState<McpServer>(() => {
    if (initialSelectedToolName) {
      for (const s of defaultServers) {
        if (s.tools.some((t) => t.name === initialSelectedToolName)) return s
      }
    }
    return defaultServers[0]
  })

  const [selectedTool, setSelectedTool] = React.useState<ToolSchema>(() => {
    if (initialSelectedToolName) {
      for (const s of defaultServers) {
        const found = s.tools.find((t) => t.name === initialSelectedToolName)
        if (found) return found
      }
    }
    return defaultServers[0].tools[0]
  })

  // New server form inputs
  const [newServerName, setNewServerName] = React.useState('')
  const [newServerScope, setNewServerScope] = React.useState('')
  const [newTransport, setNewTransport] = React.useState<TransportType>('stdio')
  const [newCommandOrUrl, setNewCommandOrUrl] = React.useState('')
  const [newDescription, setNewDescription] = React.useState('')

  // Dry run simulation
  const [isDryRunning, setIsDryRunning] = React.useState(false)
  const [dryRunOutput, setDryRunOutput] = React.useState<string | null>(null)

  // Filtering Logic
  const filteredServers = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return servers.filter((s) => {
      const matchTransport = transportFilter === 'all' || s.transport === transportFilter
      const matchStatus = statusFilter === 'all' || s.status === statusFilter
      if (!matchTransport || !matchStatus) return false

      if (!q) return true
      const inName = s.name.toLowerCase().includes(q)
      const inScope = s.scope.toLowerCase().includes(q)
      const inDesc = s.description.toLowerCase().includes(q)
      const inCmd = s.commandOrUrl.toLowerCase().includes(q)
      const inTools = s.tools.some((t) => t.name.toLowerCase().includes(q) || t.displayName.toLowerCase().includes(q))
      const inUris = s.resourceTemplates.some((r) => r.uriTemplate.toLowerCase().includes(q))
      return inName || inScope || inDesc || inCmd || inTools || inUris
    })
  }, [servers, searchQuery, transportFilter, statusFilter])

  // Counts
  const totalConnectedServers = React.useMemo(() => servers.filter((s) => s.status === 'healthy').length, [servers])
  const totalRegisteredTools = React.useMemo(() => servers.reduce((acc, s) => acc + s.tools.length, 0), [servers])

  const openToolInspector = React.useCallback((server: McpServer, tool: ToolSchema) => {
    setSelectedServer(server)
    setSelectedTool(tool)
    setDryRunOutput(null)
    setIsDrawerOpen(true)
  }, [])

  const openServerInspector = React.useCallback((server: McpServer) => {
    if (server.tools.length > 0) {
      setSelectedServer(server)
      setSelectedTool(server.tools[0])
      setDryRunOutput(null)
      setIsDrawerOpen(true)
    }
  }, [])

  const copyToClipboard = React.useCallback((text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev))
      }, 2000)
    }
  }, [])

  const runHandshakeTest = React.useCallback(() => {
    setIsHandshaking(true)
    setHandshakeAlertVisible(false)
    setTimeout(() => {
      setIsHandshaking(false)
      setHandshakeAlertVisible(true)
    }, 650)
  }, [])

  const handleAddServer = React.useCallback(() => {
    if (!newServerName.trim() || !newCommandOrUrl.trim()) return

    const newServer: McpServer = {
      id: `server-${Date.now()}`,
      name: newServerName.trim(),
      scope: newServerScope.trim() || `@custom/${newServerName.replace(/^mcp\//, '')}`,
      version: 'v1.0.0',
      transport: newTransport,
      commandOrUrl: newCommandOrUrl.trim(),
      status: 'healthy',
      uptime: '100.0%',
      latencyMs: newTransport === 'stdio' ? 22 : 64,
      callsToday: 0,
      description: newDescription.trim() || 'Custom registered Model Context Protocol runtime server.',
      envVars: ['MCP_ENABLED=true'],
      resourceTemplates: [
        {
          uriTemplate: `custom://${newServerName.replace(/^mcp\//, '')}/{resourceId}`,
          name: 'Custom Parameterized Resource',
          description: 'Dynamic schema endpoint for custom tool payloads',
          mimeType: 'application/json',
        },
      ],
      tools: [
        {
          name: `${newServerName.replace(/^mcp\//, '').replace(/[^a-zA-Z0-9_]/g, '_')}_action`,
          displayName: 'Execute Custom Action',
          description: 'Default action handler registered for this server.',
          category: 'deployment',
          parameters: [{ name: 'payload', type: 'string', required: true, description: 'Action parameter payload.' }],
          sampleRpcRequest: {
            jsonrpc: '2.0',
            id: 'req-custom-001',
            method: 'tools/call',
            params: {
              name: `${newServerName.replace(/^mcp\//, '').replace(/[^a-zA-Z0-9_]/g, '_')}_action`,
              arguments: { payload: 'execute' },
            },
          },
          sampleRpcResponse: {
            jsonrpc: '2.0',
            id: 'req-custom-001',
            result: {
              content: [{ type: 'text', text: '{"status":"success","executedAt":"2026-08-21T12:00:00Z"}' }],
              isError: false,
            },
          },
        },
      ],
    }

    setServers((prev) => [newServer, ...prev])
    setNewServerName('')
    setNewServerScope('')
    setNewCommandOrUrl('')
    setNewDescription('')
    setIsInstallDialogOpen(false)
  }, [newServerName, newServerScope, newTransport, newCommandOrUrl, newDescription])

  const removeServer = React.useCallback((serverId: string) => {
    setServers((prev) => prev.filter((s) => s.id !== serverId))
  }, [])

  const restartServer = React.useCallback((server: McpServer) => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === server.id ? { ...s, status: 'healthy', latencyMs: Math.floor(Math.random() * 20) + 15 } : s,
      ),
    )
  }, [])

  const runDryRunTest = React.useCallback(() => {
    if (!selectedTool) return
    setIsDryRunning(true)
    setTimeout(() => {
      setIsDryRunning(false)
      setDryRunOutput(JSON.stringify(selectedTool.sampleRpcResponse.result, null, 2))
    }, 450)
  }, [selectedTool])

  const activeMcpConfigJson = React.useMemo(() => {
    const config: { mcpServers: Record<string, any> } = { mcpServers: {} }
    for (const s of servers) {
      const key = s.name.replace(/^mcp\//, '')
      if (s.transport === 'stdio') {
        const parts = s.commandOrUrl.split(' ')
        config.mcpServers[key] = {
          command: parts[0],
          args: parts.slice(1),
          env: s.envVars.reduce((acc: Record<string, string>, ev) => {
            const [k, v] = ev.split('=')
            if (k && v) acc[k] = v
            return acc
          }, {}),
        }
      } else {
        config.mcpServers[key] = {
          transport: 'sse',
          url: s.commandOrUrl,
        }
      }
    }
    return JSON.stringify(config, null, 2)
  }, [servers])

  return (
    <div
      data-slot="mcp-server-registry-manager"
      className={cn(
        'bg-background text-foreground border-border w-full space-y-6 overflow-hidden rounded-xl border p-4 shadow-xs sm:p-6 md:p-8',
        className,
      )}
    >
      {/* Top System Header */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-primary/10 text-primary border-primary/20 flex size-9 items-center justify-center rounded-lg border">
              <Server className="size-4.5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Model Context Protocol (MCP) Server Manager
            </h1>
          </div>
          <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
            <Badge variant="secondary" className="font-mono text-xs font-normal">
              MCP Spec 2024-11-05 · JSON-RPC 2.0
            </Badge>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
              <span className="flex size-2 animate-pulse rounded-full bg-emerald-500" />
              {totalConnectedServers} Connected · {totalRegisteredTools} Tools Active
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Anthropic Runtime & Agent Registry</span>
          </div>
        </div>

        {/* Action CTA Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium"
            disabled={isHandshaking}
            onClick={runHandshakeTest}
          >
            <RefreshCw className={cn('size-3.5', isHandshaking && 'text-primary animate-spin')} />
            <span>{isHandshaking ? 'Handshaking...' : 'Test Tool Handshake'}</span>
          </Button>

          <Button
            size="sm"
            className="h-9 gap-1.5 text-xs font-medium shadow-xs"
            onClick={() => setIsInstallDialogOpen(true)}
          >
            <Plus className="size-3.5" />
            <span>Install New MCP Server</span>
          </Button>
        </div>
      </header>

      {/* Handshake Diagnostic Alert Banner */}
      {handshakeAlertVisible && (
        <div className="flex items-start justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-900 transition-all dark:text-emerald-200">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="space-y-0.5">
              <p className="font-semibold text-emerald-950 dark:text-emerald-100">
                Handshake Verified · All 6 MCP Servers Responded (Avg 42ms)
              </p>
              <p className="text-emerald-800 dark:text-emerald-300">
                34 tool schemas, 18 resource templates, and prompt interfaces validated against MCP Specification
                2024-11-05.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-md p-1 text-emerald-700 transition-colors hover:text-emerald-950 dark:text-emerald-400 dark:hover:text-emerald-100"
            onClick={() => setHandshakeAlertVisible(false)}
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* 4 MCP System KPI Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Connected MCP Servers */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Connected Servers
            </CardTitle>
            <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <Server className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">{servers.length} Active Servers</div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
              <span>{totalConnectedServers} healthy</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400">1 reconnecting</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Registered Tools */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Registered Tools
            </CardTitle>
            <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <Wrench className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">34 Tool Functions</div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-3.5" />
              <span>100% Schema Validated</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Resource Templates */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Resource Templates
            </CardTitle>
            <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <Link2 className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">18 Parameterized URIs</div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Boxes className="size-3.5" />
              <span>Dynamic URI Subscriptions</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Tool Invocation Volume */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
              Invocation Volume
            </CardTitle>
            <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
              <Zap className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight">12,480 calls today</div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Activity className="size-3.5 text-emerald-500" />
              <span className="text-foreground font-medium">99.8%</span> success · 142ms avg
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Navigation & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* View Tabs */}
          <Tabs
            value={activeViewTab}
            onValueChange={(val) => setActiveViewTab(val as any)}
            className="w-full md:w-auto"
          >
            <TabsList className="grid h-9 w-full grid-cols-3 md:w-[380px]">
              <TabsTrigger value="servers" className="text-xs">
                Servers & Tools ({servers.length})
              </TabsTrigger>
              <TabsTrigger value="handshake-logs" className="text-xs">
                Handshake Logs
              </TabsTrigger>
              <TabsTrigger value="config-json" className="text-xs">
                Raw JSON Config
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Search Bar and Transport Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search servers, tools, URIs..."
                className="bg-background h-8.5 pl-8 text-xs"
              />
            </div>

            {/* Transport Filter Buttons */}
            <div className="border-border bg-muted/40 flex items-center rounded-lg border p-0.5 text-xs">
              <button
                type="button"
                className={cn(
                  'rounded-md px-2.5 py-1 font-medium transition-colors',
                  transportFilter === 'all'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setTransportFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-colors',
                  transportFilter === 'stdio'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setTransportFilter('stdio')}
              >
                <Terminal className="size-3" />
                stdio
              </button>
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition-colors',
                  transportFilter === 'sse'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setTransportFilter('sse')}
              >
                <Radio className="size-3" />
                SSE Stream
              </button>
            </div>
          </div>
        </div>

        {/* Tab View 1: Servers & Tools List */}
        {activeViewTab === 'servers' && (
          <div className="space-y-4">
            {/* Empty State */}
            {filteredServers.length === 0 && (
              <div className="border-border bg-card/40 flex flex-col items-center justify-center rounded-xl border border-dashed p-10 text-center">
                <Server className="text-muted-foreground/60 mb-3 size-10" />
                <h3 className="text-sm font-semibold">No MCP Servers Found</h3>
                <p className="text-muted-foreground mt-1 max-w-sm text-xs">
                  No servers match your current search query or filter criteria. Clear filters or add a new MCP server
                  connection.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 h-8 text-xs"
                  onClick={() => {
                    setSearchQuery('')
                    setTransportFilter('all')
                    setStatusFilter('all')
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}

            {/* Servers Cards */}
            {filteredServers.map((server) => (
              <div
                key={server.id}
                className="border-border bg-card hover:border-border/80 space-y-3.5 rounded-xl border p-4 shadow-xs transition-all"
              >
                {/* Server Header Line */}
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <div className="bg-muted text-foreground border-border flex size-8 items-center justify-center rounded-lg border">
                      {server.transport === 'stdio' ? (
                        <Terminal className="size-4" />
                      ) : (
                        <Radio className="size-4 text-sky-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-foreground font-mono text-sm font-semibold tracking-tight">
                          {{ ...server }.name}
                        </span>
                        <Badge variant="secondary" className="font-mono text-xs font-normal">
                          {server.version}
                        </Badge>
                        <Badge
                          variant={server.transport === 'stdio' ? 'outline' : 'secondary'}
                          className="gap-1 font-mono text-xs"
                        >
                          {server.transport === 'stdio' ? (
                            <Terminal className="size-3" />
                          ) : (
                            <Radio className="size-3 text-sky-500" />
                          )}
                          {server.transport === 'stdio' ? 'stdio' : 'SSE stream'}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mt-0.5 text-xs">
                        {server.scope} · {server.description}
                      </p>
                    </div>
                  </div>

                  {/* Status and Dropdown Actions */}
                  <div className="flex items-center gap-2 sm:self-center">
                    {server.status === 'healthy' ? (
                      <Badge
                        variant="outline"
                        className="gap-1.5 border-emerald-500/40 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400"
                      >
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Connected & Healthy
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="gap-1.5 border-amber-500/40 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-400"
                      >
                        <span className="size-1.5 rounded-full bg-amber-500" />
                        Reconnecting ({server.latencyMs}ms)
                      </Badge>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Server Options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 text-xs">
                        <DropdownMenuLabel>Server Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => openServerInspector(server)}>
                          <FileCode className="mr-2 size-3.5" />
                          Inspect Tool Schema
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => restartServer(server)}>
                          <RefreshCw className="mr-2 size-3.5" />
                          Restart Process
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(server.commandOrUrl, `cmd-${server.id}`)}>
                          <Copy className="mr-2 size-3.5" />
                          {copiedKey === `cmd-${server.id}` ? 'Copied Command!' : 'Copy Command'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => removeServer(server.id)}
                        >
                          <Trash2 className="mr-2 size-3.5" />
                          Disconnect Server
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Command or Endpoint snippet */}
                <div className="bg-muted/60 border-border flex items-center justify-between rounded-lg border px-3 py-2 font-mono text-xs">
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <span className="text-muted-foreground select-none">$</span>
                    <span className="text-foreground truncate">{server.commandOrUrl}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 size-6 shrink-0"
                    onClick={() => copyToClipboard(server.commandOrUrl, `cmd-btn-${server.id}`)}
                  >
                    {copiedKey === `cmd-btn-${server.id}` ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="text-muted-foreground size-3" />
                    )}
                  </Button>
                </div>

                {/* Resource Templates List */}
                {server.resourceTemplates.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                      <Link2 className="size-3" />
                      <span>Resource URI Templates:</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {server.resourceTemplates.map((res) => (
                        <div
                          key={res.uriTemplate}
                          className="bg-muted/40 border-border text-foreground hover:bg-muted inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
                          title={res.description}
                        >
                          <span className="text-primary font-medium">{res.uriTemplate}</span>
                          <span className="text-muted-foreground font-sans text-xs">({res.name})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registered Tool Badges & Inspector Triggers */}
                <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-muted-foreground mr-1 text-xs font-medium">
                      Tools ({server.tools.length}):
                    </span>
                    {server.tools.map((tool) => (
                      <button
                        key={tool.name}
                        type="button"
                        className="border-primary/30 bg-primary/5 hover:bg-primary/15 text-primary focus-visible:ring-ring inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-1 font-mono text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
                        onClick={() => openToolInspector(server, tool)}
                      >
                        <Code2 className="size-3" />
                        <span>{tool.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Inspect Action Button */}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground hidden text-xs lg:inline">
                      {server.callsToday.toLocaleString()} calls · {server.latencyMs}ms ping
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7.5 gap-1 text-xs"
                      onClick={() => openServerInspector(server)}
                    >
                      <Braces className="size-3.5" />
                      <span>Inspect Tool JSON Schema</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab View 2: Handshake & Telemetry Logs */}
        {activeViewTab === 'handshake-logs' && (
          <div className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold">MCP Handshake & Protocol Event Stream</CardTitle>
                    <CardDescription className="text-xs">
                      Real-time JSON-RPC 2.0 handshake pings and capability negotiation logs.
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs" onClick={runHandshakeTest}>
                    <RefreshCw className={cn('size-3.5', isHandshaking && 'animate-spin')} />
                    Re-probe Connections
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">Server / Scope</TableHead>
                      <TableHead className="text-xs">Transport</TableHead>
                      <TableHead className="text-xs">Handshake Status</TableHead>
                      <TableHead className="text-xs">Latency</TableHead>
                      <TableHead className="text-xs">Tools Validated</TableHead>
                      <TableHead className="text-right text-xs">Last Ping</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {servers.map((s) => (
                      <TableRow key={s.id} className="text-xs">
                        <TableCell className="font-mono font-medium">{s.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="font-mono text-xs">
                            {s.transport}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn(
                              'inline-flex items-center gap-1.5 font-medium',
                              s.status === 'healthy'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-amber-600 dark:text-amber-400',
                            )}
                          >
                            <span
                              className={cn(
                                'size-1.5 rounded-full',
                                s.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500',
                              )}
                            />
                            {s.status === 'healthy' ? 'SYN_ACK 200 OK' : 'RETRY_BACKOFF'}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono">{s.latencyMs}ms</TableCell>
                        <TableCell>
                          <span className="text-foreground font-medium">{s.tools.length} schemas</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-right">Just now</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab View 3: Raw JSON Configuration */}
        {activeViewTab === 'config-json' && (
          <div className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold">Claude Desktop & Cursor MCP Config</CardTitle>
                    <CardDescription className="text-xs">
                      Exportable JSON format compatible with{' '}
                      <code className="font-mono">claude_desktop_config.json</code>.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 gap-1.5 text-xs"
                    onClick={() => copyToClipboard(activeMcpConfigJson, 'mcp-config-json')}
                  >
                    {copiedKey === 'mcp-config-json' ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    {copiedKey === 'mcp-config-json' ? 'JSON Copied!' : 'Copy Config JSON'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted/60 border-border text-foreground max-h-[420px] overflow-x-auto rounded-lg border p-4 font-mono text-xs leading-relaxed">
                  {activeMcpConfigJson}
                </pre>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Tool Schema Inspection Drawer (Sheet) */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full space-y-6 overflow-y-auto p-6 sm:max-w-xl md:max-w-2xl">
          <SheetHeader className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-mono text-xs font-medium">
                {selectedServer?.name}
              </Badge>
              <Badge variant="outline" className="font-mono text-xs">
                {selectedServer?.transport}
              </Badge>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs capitalize" variant="outline">
                {selectedTool?.category}
              </Badge>
            </div>
            <SheetTitle className="text-foreground flex items-center gap-2 font-mono text-lg font-bold tracking-tight">
              <Code2 className="text-primary size-5" />
              <span>{selectedTool?.name}</span>
            </SheetTitle>
            <SheetDescription className="text-muted-foreground text-xs leading-relaxed">
              {selectedTool?.description}
            </SheetDescription>
          </SheetHeader>

          <Separator />

          {/* Parameters Specification Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Parameter Schema ({selectedTool?.parameters.length})
              </h4>
              <span className="text-muted-foreground font-mono text-xs">JSON-RPC 2.0 Method</span>
            </div>

            <div className="border-border overflow-hidden rounded-lg border">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-xs font-semibold">Parameter</TableHead>
                    <TableHead className="text-xs font-semibold">Type</TableHead>
                    <TableHead className="text-xs font-semibold">Required</TableHead>
                    <TableHead className="text-xs font-semibold">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTool?.parameters.map((param) => (
                    <TableRow key={param.name} className="text-xs">
                      <TableCell className="text-foreground font-mono font-medium">{param.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {param.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={param.required ? 'default' : 'outline'}
                          className={cn(
                            'text-xs font-medium',
                            param.required
                              ? 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400'
                              : 'text-muted-foreground',
                          )}
                        >
                          {param.required ? 'Required' : 'Optional'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        <div>{param.description}</div>
                        {param.default && (
                          <div className="text-foreground/80 mt-0.5 font-mono text-xs">
                            default: <span className="text-primary">{param.default}</span>
                          </div>
                        )}
                        {param.enum && (
                          <div className="text-foreground/80 mt-0.5 font-mono text-xs">
                            enum: [{param.enum.join(', ')}]
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Tabbed JSON-RPC Schema & Payloads */}
          <div className="space-y-3">
            <Tabs value={inspectorTab} onValueChange={(val) => setInspectorTab(val as any)} className="w-full">
              <div className="mb-2 flex items-center justify-between">
                <TabsList className="h-8">
                  <TabsTrigger value="request" className="text-xs">
                    Sample Request
                  </TabsTrigger>
                  <TabsTrigger value="response" className="text-xs">
                    Sample Response
                  </TabsTrigger>
                  <TabsTrigger value="schema" className="text-xs">
                    Draft-07 Schema
                  </TabsTrigger>
                </TabsList>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 text-xs"
                  onClick={() =>
                    copyToClipboard(
                      inspectorTab === 'request'
                        ? JSON.stringify(selectedTool.sampleRpcRequest, null, 2)
                        : inspectorTab === 'response'
                          ? JSON.stringify(selectedTool.sampleRpcResponse, null, 2)
                          : JSON.stringify(getToolSchemaDraft7(selectedTool), null, 2),
                      'drawer-copied-schema',
                    )
                  }
                >
                  {copiedKey === 'drawer-copied-schema' ? (
                    <Check className="size-3 text-emerald-500" />
                  ) : (
                    <Copy className="size-3" />
                  )}
                  {copiedKey === 'drawer-copied-schema' ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>

              {/* Tab 1: Request */}
              <TabsContent value="request" className="m-0">
                <pre className="bg-muted/60 border-border text-foreground max-h-56 overflow-x-auto rounded-lg border p-3.5 font-mono text-xs leading-relaxed">
                  {JSON.stringify(selectedTool?.sampleRpcRequest, null, 2)}
                </pre>
              </TabsContent>

              {/* Tab 2: Response */}
              <TabsContent value="response" className="m-0">
                <pre className="bg-muted/60 border-border text-foreground max-h-56 overflow-x-auto rounded-lg border p-3.5 font-mono text-xs leading-relaxed">
                  {JSON.stringify(selectedTool?.sampleRpcResponse, null, 2)}
                </pre>
              </TabsContent>

              {/* Tab 3: Draft-07 Schema */}
              <TabsContent value="schema" className="m-0">
                <pre className="bg-muted/60 border-border text-foreground max-h-56 overflow-x-auto rounded-lg border p-3.5 font-mono text-xs leading-relaxed">
                  {JSON.stringify(getToolSchemaDraft7(selectedTool), null, 2)}
                </pre>
              </TabsContent>
            </Tabs>
          </div>

          {/* Dry Run Simulator */}
          <div className="border-border bg-muted/20 space-y-3 rounded-lg border p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                <Play className="text-primary size-3.5" />
                Simulate Tool Invocation
              </span>
              <Button size="sm" className="h-7.5 gap-1 text-xs" disabled={isDryRunning} onClick={runDryRunTest}>
                <RefreshCw className={cn('size-3', isDryRunning && 'animate-spin')} />
                {isDryRunning ? 'Invoking RPC...' : 'Test Dry-Run Call'}
              </Button>
            </div>

            {dryRunOutput && (
              <div className="space-y-1">
                <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  ✓ Invocation 200 OK (32ms):
                </span>
                <pre className="bg-muted/80 border-border text-foreground max-h-36 overflow-x-auto rounded border p-2.5 font-mono text-xs leading-tight">
                  {dryRunOutput}
                </pre>
              </div>
            )}
          </div>

          <SheetFooter className="pt-2">
            <SheetClose asChild>
              <Button variant="outline" className="h-8.5 w-full text-xs sm:w-auto">
                Close Inspector
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Install New MCP Server Dialog */}
      <Dialog open={isInstallDialogOpen} onOpenChange={setIsInstallDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="space-y-1.5">
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Plus className="text-primary size-4" />
              Install New MCP Server
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Connect an Anthropic Model Context Protocol compliant local command or remote SSE stream.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1">
              <label className="text-foreground text-xs font-medium">Server Identifier</label>
              <Input
                value={newServerName}
                onChange={(e) => setNewServerName(e.target.value)}
                placeholder="e.g. mcp/custom-inspector"
                className="h-8.5 font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-foreground text-xs font-medium">Package Scope or Organization</label>
              <Input
                value={newServerScope}
                onChange={(e) => setNewServerScope(e.target.value)}
                placeholder="e.g. @org/mcp-server-custom"
                className="h-8.5 font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-foreground text-xs font-medium">Transport Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className={cn(
                    'flex items-center gap-2 rounded-lg border p-2.5 text-left text-xs transition-all',
                    newTransport === 'stdio'
                      ? 'border-primary bg-primary/10 text-foreground font-semibold'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted',
                  )}
                  onClick={() => setNewTransport('stdio')}
                >
                  <Terminal className="text-primary size-4 shrink-0" />
                  <div>
                    <div className="text-foreground font-medium">stdio Subprocess</div>
                    <div className="text-muted-foreground text-xs">Local executable</div>
                  </div>
                </button>

                <button
                  type="button"
                  className={cn(
                    'flex items-center gap-2 rounded-lg border p-2.5 text-left text-xs transition-all',
                    newTransport === 'sse'
                      ? 'border-primary bg-primary/10 text-foreground font-semibold'
                      : 'border-border bg-card text-muted-foreground hover:bg-muted',
                  )}
                  onClick={() => setNewTransport('sse')}
                >
                  <Radio className="size-4 shrink-0 text-sky-500" />
                  <div>
                    <div className="text-foreground font-medium">SSE HTTP Stream</div>
                    <div className="text-muted-foreground text-xs">Remote gateway</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-foreground text-xs font-medium">
                {newTransport === 'stdio' ? 'Command Line Entrypoint' : 'SSE Gateway URL'}
              </label>
              <Input
                value={newCommandOrUrl}
                onChange={(e) => setNewCommandOrUrl(e.target.value)}
                placeholder={
                  newTransport === 'stdio'
                    ? 'npx -y @org/mcp-server --config=prod'
                    : 'https://mcp.internal.company.com/sse/v1'
                }
                className="h-8.5 font-mono text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-foreground text-xs font-medium">Server Description</label>
              <Input
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Short summary of tools and capabilities provided by this server"
                className="h-8.5 text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" className="h-8.5 text-xs">
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="h-8.5 text-xs"
              disabled={!newServerName.trim() || !newCommandOrUrl.trim()}
              onClick={handleAddServer}
            >
              Register Server
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default McpServerRegistryManager
