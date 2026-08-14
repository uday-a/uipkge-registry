import * as React from 'react'
import Story from '../../components/story/Story'
import {
  MatrixSwotAnalysis,
  type SwotItem,
  type StrategicInitiative,
} from '@react-registry-blocks/matrix-swot-analysis/MatrixSwotAnalysis'

const infraStrengths: SwotItem[] = [
  {
    id: 'is-1',
    title: 'Zero-downtime Canary Deployments',
    description:
      'ArgoCD progressive rollouts with automated Prometheus metric health validation and instant rollbacks.',
    impact: 'high',
    tag: 'Reliability',
  },
  {
    id: 'is-2',
    title: 'Multi-cloud AWS & GCP redundancy',
    description: 'Stateless workload failover across dual tier-1 hyperscalers prevents vendor lock-in.',
    impact: 'high',
    tag: 'Fault Tolerance',
  },
  {
    id: 'is-3',
    title: 'Automated Terraform IaC pipelines',
    description: '100% declarative infrastructure provisioning tested in ephemeral CI staging sandboxes.',
    impact: 'medium',
    tag: 'DevOps',
  },
]

const infraWeaknesses: SwotItem[] = [
  {
    id: 'iw-1',
    title: 'Cross-region database replication latency',
    description: 'Global distributed writes require 120ms roundtrip consensus before commit acknowledgment.',
    impact: 'high',
    tag: 'Performance',
  },
  {
    id: 'iw-2',
    title: 'High egress network transfer fees',
    description: 'Cross-cloud synchronization generates elevated operational data transfer expenses.',
    impact: 'high',
    tag: 'FinOps Cost',
  },
  {
    id: 'iw-3',
    title: 'Legacy monolith service extraction backlog',
    description: '3 remaining high-throughput services still require containerization and refactoring.',
    impact: 'medium',
    tag: 'Technical Debt',
  },
]

const infraOpportunities: SwotItem[] = [
  {
    id: 'io-1',
    title: 'Spot instance optimization reducing compute cost by 45%',
    description: 'Leveraging fault-tolerant Karpenter auto-scalers on spot pools during off-peak data processing.',
    impact: 'high',
    tag: 'FinOps',
  },
  {
    id: 'io-2',
    title: 'Edge compute caching closer to APAC & EMEA users',
    description: 'Deploying lightweight Cloudflare Workers to serve cached SSR responses in under 20ms.',
    impact: 'high',
    tag: 'Latency',
  },
  {
    id: 'io-3',
    title: 'Automated autoscaling during flash traffic events',
    description: 'KEDA event-driven scaling on queue depth preventing API queue starvation.',
    impact: 'medium',
    tag: 'Scalability',
  },
]

const infraThreats: SwotItem[] = [
  {
    id: 'it-1',
    title: 'Major cloud provider zonal outage risks',
    description: 'Simultaneous multi-AZ network degradation could impact primary telemetry endpoints.',
    impact: 'high',
    tag: 'Infrastructure',
  },
  {
    id: 'it-2',
    title: 'Regulatory data sovereignty compliance fines',
    description: 'Strict EU GDPR and Japanese APPI localization requirements mandate in-region data retention.',
    impact: 'high',
    tag: 'Compliance',
  },
  {
    id: 'it-3',
    title: 'Container security zero-day vulnerabilities',
    description: 'Base image CVEs requiring continuous Trivy vulnerability scanning and fast automated patching.',
    impact: 'medium',
    tag: 'SecOps',
  },
]

const infraInitiatives: StrategicInitiative[] = [
  {
    id: 'ii-1',
    title: 'Global Edge CDN & Multi-Region Compute Mesh',
    description:
      'Pair our multi-cloud architecture with edge caching to deliver sub-30ms API responses globally while ensuring in-region data sovereignty compliance.',
    strategyType: 'SO',
    strategyLabel: 'SO Strategy (Strengths × Opportunities)',
    priority: 'Critical',
    timeframe: 'Q4 2026',
    targetMetric: '99.995% Global Availability SLA',
  },
  {
    id: 'ii-2',
    title: 'Automated FinOps Ingress/Egress Optimization Pipeline',
    description:
      'Implement intelligent spot instance scheduling and compressed binary RPC transport protocols to slash egress transfer overhead.',
    strategyType: 'WO',
    strategyLabel: 'WO Strategy (Weaknesses × Opportunities)',
    priority: 'High',
    timeframe: 'Q4 2026',
    targetMetric: '-$180k/mo Cloud Egress Savings',
  },
  {
    id: 'ii-3',
    title: 'Chaos Engineering & Automated Disaster Recovery Drills',
    description:
      'Execute bi-weekly automated Chaos Mesh regional teardown drills to validate sub-60 second traffic migration during major cloud provider incidents.',
    strategyType: 'ST',
    strategyLabel: 'ST Strategy (Strengths × Threats)',
    priority: 'Strategic',
    timeframe: 'Q1 2027',
    targetMetric: '< 60s Cross-Cloud Failover Time',
  },
]

const aiStrengths: SwotItem[] = [
  {
    id: 'as-1',
    title: 'Proprietary AST Code Parsing & Graph Indexing',
    description: 'Deep semantic graph representation of repository symbols, types, and cross-file imports.',
    impact: 'high',
    tag: 'Core AI',
  },
  {
    id: 'as-2',
    title: 'Sub-200ms Token Streaming Inference',
    description: 'Low-latency speculative decoding optimized for instantaneous inline developer suggestions.',
    impact: 'high',
    tag: 'Performance',
  },
  {
    id: 'as-3',
    title: 'Native IDE extension ecosystem',
    description: 'First-class extensions for VSCode, Cursor, and JetBrains IDEs with high user engagement.',
    impact: 'high',
    tag: 'Distribution',
  },
]

const aiWeaknesses: SwotItem[] = [
  {
    id: 'aw-1',
    title: 'High token cost for large-context codebase repos',
    description: 'Processing 1M+ token repository contexts generates substantial LLM compute expense.',
    impact: 'high',
    tag: 'Unit Economics',
  },
  {
    id: 'aw-2',
    title: 'Hallucination risks in complex domain algorithms',
    description: 'Complex math and legacy code transformations occasionally generate uncompilable code passes.',
    impact: 'high',
    tag: 'Quality',
  },
  {
    id: 'aw-3',
    title: 'GPU cluster provisioning dependencies',
    description: 'Tight H100/A100 cloud cluster supply constraints limit rapid regional inference scaling.',
    impact: 'medium',
    tag: 'Compute',
  },
]

const aiOpportunities: SwotItem[] = [
  {
    id: 'ao-1',
    title: 'Enterprise private air-gapped on-prem deployments',
    description: 'Surging demand from Fortune 500 banks and defense teams for zero-data-retention local models.',
    impact: 'high',
    tag: 'Enterprise B2B',
  },
  {
    id: 'ao-2',
    title: 'Automated unit test generation & test fixture synthesis',
    description: 'High customer willingness to pay for automated 100% code coverage synthesis suites.',
    impact: 'high',
    tag: 'QA Automation',
  },
  {
    id: 'ao-3',
    title: 'Multi-file automated refactoring workflows',
    description: 'Agentic multi-turn refactoring loops capable of updating 20+ files in a single pull request.',
    impact: 'medium',
    tag: 'Productivity',
  },
]

const aiThreats: SwotItem[] = [
  {
    id: 'at-1',
    title: 'Rapid open-weight foundation model releases',
    description: 'Frontier foundation models commoditizing proprietary code generation fine-tunes.',
    impact: 'high',
    tag: 'Model Commodity',
  },
  {
    id: 'at-2',
    title: 'Enterprise IP copyright indemnity concerns',
    description: 'Customer legal departments demanding strict training data provenance guarantees.',
    impact: 'high',
    tag: 'Legal / IP',
  },
  {
    id: 'at-3',
    title: 'Rate limiting on upstream model inference providers',
    description: 'Third-party API quotas risking degraded latency during peak enterprise developer hours.',
    impact: 'medium',
    tag: 'Provider Risk',
  },
]

const aiInitiatives: StrategicInitiative[] = [
  {
    id: 'ai-1',
    title: 'Self-Hosted Speculative Decoding & Tree-Search Agent',
    description:
      'Leverage our AST parsing advantage to build a proprietary tree-search agent that streams code 3.5x faster while cutting reliance on external model APIs.',
    strategyType: 'SO',
    strategyLabel: 'SO Strategy (Strengths × Opportunities)',
    priority: 'Critical',
    timeframe: 'Q4 2026',
    targetMetric: '3.5x Faster Code Generation',
  },
  {
    id: 'ai-2',
    title: 'Local Quantized Embedding Cache for Monorepos',
    description:
      'Deploy on-device vector indexing to eliminate repeated 1M token context re-uploads and dramatically improve gross margins.',
    strategyType: 'WO',
    strategyLabel: 'WO Strategy (Weaknesses × Opportunities)',
    priority: 'High',
    timeframe: 'Q4 2026',
    targetMetric: '-65% LLM API Costs per Repo',
  },
  {
    id: 'ai-3',
    title: 'SOC-2 Compliant Air-Gapped Enterprise VPC Agent',
    description:
      'Package private on-prem deployment containers with verifiable IP clean-room training provenance to win regulated defense and fintech contracts.',
    strategyType: 'ST',
    strategyLabel: 'ST Strategy (Strengths × Threats)',
    priority: 'Strategic',
    timeframe: 'Q1 2027',
    targetMetric: '12 Enterprise Closed-VPC Contracts',
  },
]

export default function MatrixSwotAnalysisDemo() {
  return (
    <>
      <Story
        title="Default Strategy Canvas (UIPKGE Registry)"
        description="2x2 strategic TOWS SWOT matrix for UIPKGE Unbundled UI Registry Strategy · Q3 2026 with interactive card management, quadrant counters, TOWS strategic initiatives, and PDF/share toolbar."
      >
        <MatrixSwotAnalysis />
      </Story>

      <Story
        title="Cloud Infrastructure & Kubernetes Migration"
        description="Enterprise multi-cloud Kubernetes modernization SWOT canvas with reliability strengths, cross-region replication latency weaknesses, and FinOps cost initiatives."
      >
        <MatrixSwotAnalysis
          title="Cloud Infrastructure Modernization SWOT"
          project="Global Multi-Cloud Kubernetes & Edge Architecture · Q4 2026"
          lastUpdated="Sep 15, 2026"
          initialStrengths={infraStrengths}
          initialWeaknesses={infraWeaknesses}
          initialOpportunities={infraOpportunities}
          initialThreats={infraThreats}
          initiatives={infraInitiatives}
        />
      </Story>

      <Story
        title="AI Developer Agent Platform Strategy"
        description="Strategic positioning canvas for an autonomous AI coding assistant featuring AST parsing capabilities, token cost mitigation, and air-gapped enterprise VPC packaging."
      >
        <MatrixSwotAnalysis
          title="AI Developer Platform Strategy Matrix"
          project="Autonomous Coding Assistant & Engine · H1 2027"
          lastUpdated="Oct 02, 2026"
          initialStrengths={aiStrengths}
          initialWeaknesses={aiWeaknesses}
          initialOpportunities={aiOpportunities}
          initialThreats={aiThreats}
          initiatives={aiInitiatives}
        />
      </Story>

      <Story
        title="Read-Only Executive Briefing Canvas"
        description="Presentation mode for executive stakeholders and board reviews with input forms locked and card deletion disabled."
      >
        <MatrixSwotAnalysis
          title="Executive Strategy Canvas (Locked Briefing)"
          project="Board of Directors Strategic Review · Q3 2026 Summary"
          lastUpdated="Aug 21, 2026"
          readonly
        />
      </Story>
    </>
  )
}
