'use client'

import * as React from 'react'
import {
  Bot,
  Braces,
  Check,
  Clock,
  Copy,
  Cpu,
  FileCode,
  MessageSquare,
  RotateCcw,
  Save,
  Sliders,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface ModelOption {
  id: string
  name: string
  provider: string
  contextWindow: string
  inputCostPer1M: number
  outputCostPer1M: number
}

interface Preset {
  id: string
  name: string
  description: string
  model: string
  temperature: number
  maxTokens: number
  topP: number
  jsonMode: boolean
  stream: boolean
  systemPrompt: string
  userMessage: string
  mockResponse: string
  mockTokens: number
  mockLatency: string
}

const models: ModelOption[] = [
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    contextWindow: '200k',
    inputCostPer1M: 3.0,
    outputCostPer1M: 15.0,
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    contextWindow: '128k',
    inputCostPer1M: 2.5,
    outputCostPer1M: 10.0,
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    contextWindow: '128k',
    inputCostPer1M: 0.6,
    outputCostPer1M: 0.8,
  },
]

const presets: Preset[] = [
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    description: 'Security & vulnerability audit for backend code',
    model: 'claude-3-5-sonnet',
    temperature: 0.2,
    maxTokens: 2048,
    topP: 0.9,
    jsonMode: false,
    stream: true,
    systemPrompt:
      'You are a world-class senior developer assistant specializing in application security, code reviews, and high-performance software architecture. Analyze code with precision, highlight vulnerabilities (OWASP Top 10), and provide clean refactored snippets.',
    userMessage:
      'Review the following authentication middleware for security vulnerabilities and race conditions:\n\n```typescript\nexport async function authMiddleware(req: Request) {\n  const token = req.headers.get("authorization")?.split(" ")[1];\n  if (!token) throw new Error("Unauthorized");\n  const session = await db.session.findUnique({ where: { token } });\n  if (session.expiresAt < new Date()) {\n    await db.session.delete({ where: { token } });\n    throw new Error("Expired");\n  }\n  return session.user;\n}\n```',
    mockResponse:
      '### Security Review & Vulnerability Analysis\n\nI identified 3 key security & stability issues in the provided authentication middleware:\n\n1. **Unhandled Exceptions / Missing Error Envelope:**\n   Throwing raw `Error` instances inside middleware can cause unhandled 500 crashes instead of structured 401/403 HTTP responses.\n2. **Missing Token Existence Check on DB lookup:**\n   If `session` is not found, `session.expiresAt` throws a `TypeError` (cannot read properties of null).\n3. **Non-atomic Cleanup & Database Mutation:**\n   Deleting expired tokens in the read path introduces write amplification on every expired request and isn\'t atomic with the expiration verification.\n\n---\n\n### Recommended Refactoring\n\n```typescript\nimport { NextResponse } from "next/server";\n\nexport async function authMiddleware(req: Request) {\n  const authHeader = req.headers.get("authorization");\n  if (!authHeader?.startsWith("Bearer ")) {\n    return new Response(JSON.stringify({ error: "Missing or malformed Authorization header" }), {\n      status: 401,\n      headers: { "Content-Type": "application/json" },\n    });\n  }\n\n  const token = authHeader.slice(7).trim();\n  const session = await db.session.findUnique({\n    where: { token },\n    include: { user: true },\n  });\n\n  if (!session || session.expiresAt.getTime() <= Date.now()) {\n    return new Response(JSON.stringify({ error: "Invalid or expired session" }), {\n      status: 401,\n      headers: { "Content-Type": "application/json" },\n    });\n  }\n\n  return session.user;\n}\n```\n\n**Key Improvements:**\n- Constant-time prefix check avoiding unexpected array indexing errors.\n- Null-safe session expiration check without throwing uncaught exceptions.\n- Immediate 401 JSON error responses matching standard API conventions.',
    mockTokens: 428,
    mockLatency: '1.4s',
  },
  {
    id: 'customer-support',
    name: 'Customer Support Agent',
    description: 'Empathetic, brand-aligned troubleshooting for customer inquiries',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 1024,
    topP: 0.95,
    jsonMode: false,
    stream: true,
    systemPrompt:
      'You are an empathetic, concise, and professional Tier-2 support specialist for CloudFlow SaaS. Your goal is to troubleshoot customer issues efficiently while maintaining a helpful, brand-aligned tone.',
    userMessage:
      'A customer wrote: "Our webhooks stopped delivering payload events since 14:00 UTC today. We are seeing intermittent 504 gateway timeout errors on endpoint https://api.client.com/events. Can you check our account ID #ACC-9821?"',
    mockResponse:
      'Hello Team,\n\nThank you for reaching out, and I apologize for the disruption to your event pipeline.\n\nI investigated account **#ACC-9821** and observed the following:\n\n- **Root Cause:** Our webhook dispatch worker encountered downstream 504 Gateway Timeouts from `https://api.client.com/events` when response times exceeded the 5,000ms threshold.\n- **Retry Mechanism:** Failed webhook events have been automatically enrolled into exponential backoff (attempt 3 of 5).\n- **Action Taken:** We temporarily increased the worker handshake timeout to 8,000ms for your tenant while your ingress recovers.\n\n**Recommended Next Steps:**\n1. Check your upstream server logs around 14:00 UTC for concurrent connection saturation or database connection pool starvation.\n2. If you need all 14:00–15:00 UTC events replayed immediately, reply with **"CONFIRM REPLAY #ACC-9821"** and I will trigger a zero-loss backfill.\n\nBest regards,\n**CloudFlow Tier-2 Engineering Support**',
    mockTokens: 286,
    mockLatency: '0.9s',
  },
  {
    id: 'json-extractor',
    name: 'JSON Extractor',
    description: 'Strict schema extraction from unstructured invoices or logs',
    model: 'gpt-4o',
    temperature: 0.0,
    maxTokens: 1024,
    topP: 0.1,
    jsonMode: true,
    stream: false,
    systemPrompt:
      'You are an infallible data extraction engine. Extract structured entities from unstructured receipts, invoices, or logs and return ONLY valid RFC-8259 JSON matching the requested schema. Do not include markdown formatting, explanations, or prologue.',
    userMessage:
      'Extract invoice metadata:\nInvoice Number: INV-2026-8891\nDate: August 21, 2026\nVendor: Acme Cloud Services LLC (Tax ID: US-99182312)\nClient: Cyberdyne Systems\nItems:\n1. GPU Cluster Instance H100 x 48 hrs @ $3.20/hr = $153.60\n2. NVMe High-Speed Storage 2TB x 1 mo @ $80.00/mo = $80.00\nTax: $18.69 (8%)\nTotal Due: $252.29',
    mockResponse:
      '{\n  "invoiceNumber": "INV-2026-8891",\n  "issueDate": "2026-08-21",\n  "vendor": {\n    "name": "Acme Cloud Services LLC",\n    "taxId": "US-99182312"\n  },\n  "client": {\n    "name": "Cyberdyne Systems"\n  },\n  "lineItems": [\n    {\n      "description": "GPU Cluster Instance H100",\n      "quantity": 48,\n      "unit": "hours",\n      "unitPrice": 3.20,\n      "totalPrice": 153.60\n    },\n    {\n      "description": "NVMe High-Speed Storage 2TB",\n      "quantity": 1,\n      "unit": "month",\n      "unitPrice": 80.00,\n      "totalPrice": 80.00\n    }\n  ],\n  "subtotal": 233.60,\n  "taxRate": 0.08,\n  "taxAmount": 18.69,\n  "totalAmount": 252.29,\n  "currency": "USD"\n}',
    mockTokens: 215,
    mockLatency: '0.6s',
  },
]

export function PromptPlayground({ className }: { className?: string }) {
  const [selectedModel, setSelectedModel] = React.useState('claude-3-5-sonnet')
  const [selectedPreset, setSelectedPreset] = React.useState('code-reviewer')

  const [systemPrompt, setSystemPrompt] = React.useState(presets[0].systemPrompt)
  const [userMessage, setUserMessage] = React.useState(presets[0].userMessage)
  const [temperature, setTemperature] = React.useState(presets[0].temperature)
  const [maxTokens, setMaxTokens] = React.useState(presets[0].maxTokens)
  const [topP, setTopP] = React.useState(presets[0].topP)
  const [jsonMode, setJsonMode] = React.useState(presets[0].jsonMode)
  const [streamResponses, setStreamResponses] = React.useState(presets[0].stream)

  const [displayedResponse, setDisplayedResponse] = React.useState(presets[0].mockResponse)
  const [responseStatus, setResponseStatus] = React.useState('200 OK · 1.4s · 428 tokens')
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [showRawJson, setShowRawJson] = React.useState(false)
  const [isCopied, setIsCopied] = React.useState(false)
  const [isPresetSaved, setIsPresetSaved] = React.useState(false)

  const streamTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null)

  const activeModel = React.useMemo(() => {
    return models.find((m) => m.id === selectedModel) ?? models[0]
  }, [selectedModel])

  const estimatedPromptTokens = React.useMemo(() => {
    const combined = (systemPrompt || '') + (userMessage || '')
    return Math.max(1, Math.round(combined.length / 3.8))
  }, [systemPrompt, userMessage])

  const estimatedTotalTokens = React.useMemo(() => {
    const outputEstimate = isGenerating ? Math.round(maxTokens / 4) : 428
    return estimatedPromptTokens + outputEstimate
  }, [estimatedPromptTokens, isGenerating, maxTokens])

  const estimatedCost = React.useMemo(() => {
    const inputCost = (estimatedPromptTokens / 1_000_000) * activeModel.inputCostPer1M
    const outputCost = (428 / 1_000_000) * activeModel.outputCostPer1M
    return (inputCost + outputCost).toFixed(4)
  }, [estimatedPromptTokens, activeModel])

  const rawJsonPayload = React.useMemo(() => {
    return JSON.stringify(
      {
        id: `chatcmpl-${Math.random().toString(36).substring(2, 10)}`,
        object: 'chat.completion',
        created: 1787313600,
        model: selectedModel,
        system_fingerprint: 'fp_uipkge_49a',
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: displayedResponse,
            },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: estimatedPromptTokens,
          completion_tokens: 428,
          total_tokens: estimatedPromptTokens + 428,
        },
        configuration: {
          temperature,
          max_tokens: maxTokens,
          top_p: topP,
          response_format: jsonMode ? { type: 'json_object' } : { type: 'text' },
          stream: streamResponses,
        },
      },
      null,
      2,
    )
  }, [selectedModel, displayedResponse, estimatedPromptTokens, temperature, maxTokens, topP, jsonMode, streamResponses])

  const handlePresetChange = React.useCallback((presetId: string) => {
    setSelectedPreset(presetId)
    const preset = presets.find((p) => p.id === presetId)
    if (!preset) return

    setSystemPrompt(preset.systemPrompt)
    setUserMessage(preset.userMessage)
    setSelectedModel(preset.model)
    setTemperature(preset.temperature)
    setMaxTokens(preset.maxTokens)
    setTopP(preset.topP)
    setJsonMode(preset.jsonMode)
    setStreamResponses(preset.stream)
    setDisplayedResponse(preset.mockResponse)
    setResponseStatus(`200 OK · ${preset.mockLatency} · ${preset.mockTokens} tokens`)
  }, [])

  const runPrompt = React.useCallback(() => {
    if (isGenerating) return
    if (streamTimerRef.current) clearInterval(streamTimerRef.current)

    const activePresetObj = presets.find((p) => p.id === selectedPreset) ?? presets[0]
    const targetResponse =
      jsonMode && !activePresetObj.jsonMode ? presets[2].mockResponse : activePresetObj.mockResponse
    const targetLatency = activePresetObj.mockLatency
    const targetTokens = activePresetObj.mockTokens

    setIsGenerating(true)
    setResponseStatus('Generating...')

    if (streamResponses) {
      setDisplayedResponse('')
      let charIndex = 0
      const chunkSize = 8
      const totalChars = targetResponse.length

      streamTimerRef.current = setInterval(() => {
        charIndex += chunkSize
        if (charIndex >= totalChars) {
          setDisplayedResponse(targetResponse)
          if (streamTimerRef.current) clearInterval(streamTimerRef.current)
          streamTimerRef.current = null
          setIsGenerating(false)
          setResponseStatus(`200 OK · ${targetLatency} · ${targetTokens} tokens`)
        } else {
          setDisplayedResponse(targetResponse.slice(0, charIndex))
        }
      }, 25)
    } else {
      setTimeout(() => {
        setDisplayedResponse(targetResponse)
        setIsGenerating(false)
        setResponseStatus(`200 OK · ${targetLatency} · ${targetTokens} tokens`)
      }, 600)
    }
  }, [isGenerating, selectedPreset, jsonMode, streamResponses])

  const handleCopyResponse = React.useCallback(() => {
    if (!displayedResponse) return
    navigator.clipboard?.writeText(displayedResponse)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }, [displayedResponse])

  const handleSavePreset = React.useCallback(() => {
    setIsPresetSaved(true)
    setTimeout(() => setIsPresetSaved(false), 2000)
  }, [])

  const handleResetDefaults = React.useCallback(() => {
    setTemperature(0.7)
    setMaxTokens(2048)
    setTopP(0.9)
    setJsonMode(false)
    setStreamResponses(true)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        runPrompt()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (streamTimerRef.current) clearInterval(streamTimerRef.current)
    }
  }, [runPrompt])

  return (
    <div data-slot="prompt-playground" className={cn('w-full space-y-6', className)}>
      {/* Top Toolbar */}
      <div className="border-border bg-card/70 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3.5 shadow-xs backdrop-blur-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Model Selector */}
          <div className="w-48">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="h-9 w-full text-xs font-medium" aria-label="Select AI Model">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-primary size-3.5" />
                      <span>{m.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Preset Template Dropdown */}
          <div className="w-52">
            <Select value={selectedPreset} onValueChange={handlePresetChange}>
              <SelectTrigger className="h-9 w-full text-xs" aria-label="Select Preset Template">
                <SelectValue placeholder="Preset template" />
              </SelectTrigger>
              <SelectContent>
                {presets.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    <span>{p.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Token Counter Pill */}
          <div className="border-border bg-muted/60 text-muted-foreground hidden items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs md:inline-flex">
            <Cpu className="text-primary size-3.5" />
            <span>{estimatedTotalTokens.toLocaleString()} tokens</span>
            <span className="text-foreground font-medium">${estimatedCost}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Save Preset Outline Button */}
          <Button variant="outline" size="sm" className="h-9 gap-1.5 text-xs font-medium" onClick={handleSavePreset}>
            {isPresetSaved ? <Check className="text-success size-3.5" /> : <Save className="size-3.5" />}
            <span>{isPresetSaved ? 'Saved!' : 'Save Preset'}</span>
          </Button>

          {/* Run Prompt Primary Button */}
          <Button
            size="sm"
            className="bg-primary text-primary-foreground h-9 gap-1.5 text-xs font-medium shadow-xs"
            disabled={isGenerating}
            onClick={runPrompt}
          >
            {isGenerating ? (
              <span className="border-primary-foreground size-3.5 animate-spin rounded-full border-2 border-t-transparent" />
            ) : (
              <Zap className="size-3.5 fill-current" />
            )}
            <span>{isGenerating ? 'Running...' : 'Run Prompt'}</span>
            <kbd className="bg-primary-foreground/20 hidden items-center rounded px-1 py-0.5 font-mono text-xs sm:inline-flex">
              ⌘↵
            </kbd>
          </Button>
        </div>
      </div>

      {/* 2-Column Studio Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Panel: Prompt Configuration & Test Input */}
        <div className="space-y-6 lg:col-span-7">
          {/* System Instructions Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                    <Bot className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">System Instructions</CardTitle>
                    <CardDescription className="text-xs">
                      Behavior, role personality, and operational constraints
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  role: system
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Textarea
                value={systemPrompt}
                onValueChange={setSystemPrompt}
                placeholder="You are an expert AI assistant..."
                rows={4}
                noResize
                className="border-border/70 focus:border-primary font-mono text-xs leading-relaxed"
              />
            </CardContent>
            <CardFooter className="border-border text-muted-foreground flex flex-wrap items-center justify-between border-t pt-3 text-xs">
              <span className="flex flex-wrap items-center gap-1.5">
                <FileCode className="size-3.5" />
                <span>Context: {activeModel.contextWindow}</span>
              </span>
              <span className="font-mono">{systemPrompt.length} chars</span>
            </CardFooter>
          </Card>

          {/* User Message Input Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-secondary text-secondary-foreground flex size-7 items-center justify-center rounded-md">
                    <MessageSquare className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">User Message</CardTitle>
                    <CardDescription className="text-xs">Prompt input payload and test variables</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  role: user
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Textarea
                value={userMessage}
                onValueChange={setUserMessage}
                placeholder="Enter user test prompt..."
                rows={7}
                noResize
                className="border-border/70 focus:border-primary font-mono text-xs leading-relaxed"
              />
            </CardContent>
            <CardFooter className="border-border text-muted-foreground flex flex-wrap items-center justify-between border-t pt-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Quick inject:</span>
                <button
                  type="button"
                  className="hover:border-primary/60 hover:text-foreground min-h-6 rounded border border-dashed px-1.5 py-0.5 font-mono text-xs transition-colors"
                  onClick={() => setUserMessage((prev) => prev + '\n\nEnsure strict backward compatibility.')}
                >
                  +compatibility
                </button>
                <button
                  type="button"
                  className="hover:border-primary/60 hover:text-foreground min-h-6 rounded border border-dashed px-1.5 py-0.5 font-mono text-xs transition-colors"
                  onClick={() => setUserMessage((prev) => prev + '\n\nOutput in concise bullet points.')}
                >
                  +bullets
                </button>
              </div>
              <span className="font-mono">~{estimatedPromptTokens} tokens</span>
            </CardFooter>
          </Card>
        </div>

        {/* Right Panel: Parameters Sidebar + Output Card */}
        <div className="space-y-6 lg:col-span-5">
          {/* Right Parameter Sidebar Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-muted text-muted-foreground flex size-7 items-center justify-center rounded-md">
                    <Sliders className="size-4" />
                  </div>
                  <CardTitle className="text-sm font-semibold">Parameters</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                  onClick={handleResetDefaults}
                >
                  <RotateCcw className="mr-1 size-3" />
                  <span>Reset</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              {/* Temperature Slider */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between text-xs">
                  <label className="text-foreground font-medium">Temperature</label>
                  <span className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono font-medium">
                    {Number(temperature).toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[temperature]}
                  onValueChange={(val) => setTemperature(val[0])}
                  min={0}
                  max={1}
                  step={0.05}
                />
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>0.0 (Deterministic)</span>
                  <span>1.0 (Creative)</span>
                </div>
              </div>

              {/* Max Tokens Slider */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between text-xs">
                  <label className="text-foreground font-medium">Max Tokens</label>
                  <span className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono font-medium">
                    {Number(maxTokens).toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[maxTokens]}
                  onValueChange={(val) => setMaxTokens(val[0])}
                  min={256}
                  max={4096}
                  step={128}
                />
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>256</span>
                  <span>4,096</span>
                </div>
              </div>

              {/* Top P Slider */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between text-xs">
                  <label className="text-foreground font-medium">Top P</label>
                  <span className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono font-medium">
                    {Number(topP).toFixed(2)}
                  </span>
                </div>
                <Slider value={[topP]} onValueChange={(val) => setTopP(val[0])} min={0} max={1} step={0.05} />
                <div className="text-muted-foreground flex justify-between text-xs">
                  <span>0.0 (Focused)</span>
                  <span>1.0 (Diverse)</span>
                </div>
              </div>

              <Separator />

              {/* Switches */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <label htmlFor="react-json-mode" className="text-foreground cursor-pointer text-xs font-medium">
                      JSON Mode
                    </label>
                    <p className="text-muted-foreground text-xs">Enforce structured JSON output</p>
                  </div>
                  <Switch id="react-json-mode" checked={jsonMode} onCheckedChange={setJsonMode} />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <label
                      htmlFor="react-stream-responses"
                      className="text-foreground cursor-pointer text-xs font-medium"
                    >
                      Stream Responses
                    </label>
                    <p className="text-muted-foreground text-xs">Simulate real-time token streaming</p>
                  </div>
                  <Switch id="react-stream-responses" checked={streamResponses} onCheckedChange={setStreamResponses} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Output Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                    <Terminal className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Response Output</CardTitle>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'h-7 px-2 text-xs',
                      showRawJson ? 'text-primary bg-primary/10' : 'text-muted-foreground',
                    )}
                    onClick={() => setShowRawJson(!showRawJson)}
                  >
                    <Braces className="mr-1 size-3.5" />
                    <span>{showRawJson ? 'Formatted' : 'Raw JSON'}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                    onClick={handleCopyResponse}
                  >
                    {isCopied ? <Check className="text-success mr-1 size-3.5" /> : <Copy className="mr-1 size-3.5" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    'font-mono text-xs',
                    isGenerating ? 'border-primary/40 text-primary animate-pulse' : 'border-success/30 text-success',
                  )}
                >
                  <span
                    className={cn(
                      'mr-1.5 inline-block size-1.5 rounded-full',
                      isGenerating ? 'bg-primary' : 'bg-success',
                    )}
                  />
                  {responseStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Raw JSON View */}
              {showRawJson ? (
                <div className="relative">
                  <pre className="border-border bg-muted/40 text-foreground max-h-[380px] overflow-x-auto overflow-y-auto rounded-md border p-3.5 font-mono text-xs leading-relaxed">
                    <code>{rawJsonPayload}</code>
                  </pre>
                </div>
              ) : (
                /* Prose / Markdown View */
                <div className="border-border bg-muted/20 text-foreground max-h-[380px] min-h-[220px] overflow-y-auto rounded-md border p-3.5 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                  {displayedResponse}
                  {isGenerating && <span className="text-primary ml-0.5 inline-block animate-pulse">▋</span>}
                </div>
              )}
            </CardContent>
            <CardFooter className="border-border text-muted-foreground flex flex-wrap items-center justify-between border-t pt-3 text-xs">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                <span>Finish: stop</span>
              </span>
              <span className="font-mono">Throughput: ~305 tok/s</span>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
