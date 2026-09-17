<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileDown,
  FileText,
  Filter,
  KeyRound,
  Lock,
  RefreshCw,
  Search,
  Server,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Props {
  class?: HTMLAttributes['class']
  defaultFramework?: string
}

const props = withDefaults(defineProps<Props>(), {
  defaultFramework: 'soc2',
})

export interface PillarData {
  code: string
  title: string
  description: string
  score: number
  passed: number
  total: number
  status: string
  statusVariant: 'success' | 'warning' | 'secondary'
  highlights: string[]
  iconType: 'key' | 'shield' | 'activity' | 'users' | 'lock' | 'server' | 'file'
}

export interface EvidenceTestItem {
  id: string
  code: string
  name: string
  description: string
  category: 'Identity & Auth' | 'Cloud Infrastructure' | 'Security Operations' | 'DevOps & CI/CD' | 'People & HR'
  frequency: 'Continuous (1h)' | 'Daily' | 'Monthly' | 'Quarterly'
  status: 'Passing' | 'Needs Attention'
  statusVariant: 'success' | 'warning'
  artifact: string
  verified: boolean
  lastTested: string
  auditorNotes: string
}

export interface FrameworkConfig {
  id: string
  tabLabel: string
  name: string
  badge: string
  standard: string
  score: number
  readinessLabel: string
  period: string
  auditor: string
  totalPassing: number
  totalTests: number
  pillars: PillarData[]
  tests: EvidenceTestItem[]
  trustCenterUrl: string
}

const frameworksData: Record<string, FrameworkConfig> = {
  soc2: {
    id: 'soc2',
    tabLabel: 'SOC 2 Type II',
    name: 'SOC 2 Type II Readiness',
    badge: 'Security & Confidentiality',
    standard: 'AICPA Trust Services Criteria (CC1–CC9)',
    score: 96,
    readinessLabel: '96% Audit Ready',
    period: 'Jan 1, 2026 – Dec 31, 2026',
    auditor: 'KPMG LLP · Sarah Jenkins, CPA/CISA',
    totalPassing: 69,
    totalTests: 71,
    pillars: [
      {
        code: 'CC1',
        title: 'Access Control & IAM',
        description: 'Identity federation, MFA enforcement, and least-privilege role provisioning.',
        score: 100,
        passed: 24,
        total: 24,
        status: '100% Passed · 24/24 tests',
        statusVariant: 'success',
        highlights: ['FIDO2/WebAuthn Hardware MFA', 'Just-In-Time Role Elevation'],
        iconType: 'key',
      },
      {
        code: 'CC2',
        title: 'Encryption & Key Management',
        description: 'Data encryption in-transit & at rest with automated CMK key rotation.',
        score: 98,
        passed: 18,
        total: 18,
        status: '98% Passed · 18/18 tests',
        statusVariant: 'success',
        highlights: ['AWS KMS Envelope CMKs', 'TLS 1.3 Strict Cipher Suites'],
        iconType: 'shield',
      },
      {
        code: 'CC3',
        title: 'Incident Response & Logging',
        description: 'Immutable audit trail ingesters, P1 runbooks, and real-time SIEM alerts.',
        score: 94,
        passed: 15,
        total: 16,
        status: '94% Passed · 15/16 tests',
        statusVariant: 'warning',
        highlights: ['Immutable WORM S3 Bucket', 'Quarterly Drill Executed'],
        iconType: 'activity',
      },
      {
        code: 'CC4',
        title: 'Employee Security & Vendor Risk',
        description: 'Background checks, awareness training, and third-party vendor DPA reviews.',
        score: 92,
        passed: 12,
        total: 13,
        status: '92% Passed · 12/13 tests',
        statusVariant: 'secondary',
        highlights: ['100% Staff Security Training', 'Tier 1 Vendor DPA Signed'],
        iconType: 'users',
      },
    ],
    tests: [
      {
        id: 'test-soc2-1',
        code: 'CC6.1',
        name: 'MFA Enforced for All Staff',
        description: 'Continuous sync with Okta IAM confirming hardware/TOTP MFA active on all active seats.',
        category: 'Identity & Auth',
        frequency: 'Continuous (1h)',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'okta-mfa-sync-v2.json',
        verified: true,
        lastTested: '4m ago',
        auditorNotes: '100% of 248 accounts verified with WebAuthn/FIDO2 hardware key enforcement.',
      },
      {
        id: 'test-soc2-2',
        code: 'CC6.6',
        name: 'DB Storage Encrypted with KMS',
        description: 'All production RDS PostgreSQL and Redis storage volumes encrypted at rest with AWS KMS.',
        category: 'Cloud Infrastructure',
        frequency: 'Continuous (1h)',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'aws-kms-rds-audit-prod.json',
        verified: true,
        lastTested: '12m ago',
        auditorNotes: 'AES-256 GCM encryption validated across primary cluster and 4 replica volumes.',
      },
      {
        id: 'test-soc2-3',
        code: 'CC7.2',
        name: 'Quarterly Penetration Test Completed',
        description: 'Independent gray-box network and web application penetration test with zero open criticals.',
        category: 'Security Operations',
        frequency: 'Quarterly',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'BishopFox-Pentest-Q2-2026.pdf',
        verified: true,
        lastTested: 'Aug 12, 2026',
        auditorNotes: 'Full remediation verified within 14-day SLA. Attestation signed by Bishop Fox.',
      },
      {
        id: 'test-soc2-4',
        code: 'CC6.7',
        name: 'Automated Backup Verification Daily',
        description: 'Daily point-in-time cross-region database snapshot validation and SHA-256 checksum test.',
        category: 'Cloud Infrastructure',
        frequency: 'Daily',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 's3-replica-checksum-20260821.log',
        verified: true,
        lastTested: '2h ago',
        auditorNotes: 'Automated restore drill executed with RPO < 5m and RTO < 15m.',
      },
      {
        id: 'test-soc2-5',
        code: 'CC8.1',
        name: 'Branch Protection & PR Reviews Enforced',
        description: 'GitHub repository rulesets require min 2 peer reviews, signed commits, and passing CI.',
        category: 'DevOps & CI/CD',
        frequency: 'Continuous (1h)',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'github-branch-policy-main.json',
        verified: true,
        lastTested: '18m ago',
        auditorNotes: 'Zero bypass permissions granted. Administrator force-push strictly disabled.',
      },
      {
        id: 'test-soc2-6',
        code: 'CC9.2',
        name: 'Third-Party Vendor Risk Assessment',
        description: 'Annual SOC 2 Type II report collection and DPA compliance review for active SaaS vendors.',
        category: 'People & HR',
        frequency: 'Monthly',
        status: 'Needs Attention',
        statusVariant: 'warning',
        artifact: 'vendor-risk-matrix-2026.csv',
        verified: false,
        lastTested: 'Yesterday',
        auditorNotes: '1 vendor report renewal pending (Datadog EU renewal contract awaiting counter-signature).',
      },
    ],
    trustCenterUrl: 'https://trust.uipkge.dev',
  },
  iso27001: {
    id: 'iso27001',
    tabLabel: 'ISO 27001',
    name: 'ISO/IEC 27001:2022 ISMS',
    badge: 'Information Security Management',
    standard: 'Annex A Controls (A.5 – A.8) · Stage 2 Ready',
    score: 94,
    readinessLabel: '94% Stage 2 Ready',
    period: 'Audit Cycle 2026–2027',
    auditor: 'BSI Group · Henrik Lindqvist, Lead Auditor',
    totalPassing: 88,
    totalTests: 93,
    pillars: [
      {
        code: 'A.5',
        title: 'Organizational Controls',
        description: 'Information security policies, supplier governance, and asset inventories.',
        score: 96,
        passed: 35,
        total: 37,
        status: '96% Passed · 35/37 controls',
        statusVariant: 'success',
        highlights: ['Approved Security Policies', 'Supplier Risk Classification'],
        iconType: 'shield',
      },
      {
        code: 'A.6',
        title: 'People Controls',
        description: 'Screening, remote work guidelines, and continuous infosec education.',
        score: 92,
        passed: 8,
        total: 8,
        status: '92% Passed · 8/8 controls',
        statusVariant: 'success',
        highlights: ['Annual Training Certification', 'Formal Disciplinary Rules'],
        iconType: 'users',
      },
      {
        code: 'A.7',
        title: 'Physical Controls',
        description: 'Physical security perimeters, clear desk, and device screen lock policies.',
        score: 100,
        passed: 14,
        total: 14,
        status: '100% Passed · 14/14 controls',
        statusVariant: 'success',
        highlights: ['Zero Trust Cloud Infrastructure', 'Automated Screen Locking'],
        iconType: 'lock',
      },
      {
        code: 'A.8',
        title: 'Technological Controls',
        description: 'Endpoint protection, access rights, network security, and vulnerability management.',
        score: 93,
        passed: 31,
        total: 34,
        status: '93% Passed · 31/34 controls',
        statusVariant: 'warning',
        highlights: ['EDR on 100% Managed Laptops', 'Zero Trust Network Architecture'],
        iconType: 'server',
      },
    ],
    tests: [
      {
        id: 'test-iso-1',
        code: 'A.8.2',
        name: 'Privileged Access Rights Review',
        description: 'Quarterly review and revocation of administrative privileges on AWS and cloud IdPs.',
        category: 'Identity & Auth',
        frequency: 'Continuous (1h)',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'iam-privileged-access-matrix.json',
        verified: true,
        lastTested: '8m ago',
        auditorNotes: 'All root credentials locked behind hardware token in safe storage.',
      },
      {
        id: 'test-iso-2',
        code: 'A.8.24',
        name: 'Use of Cryptography & Key Management',
        description: 'Enforcement of cryptographic standard policies for data in transit and at rest.',
        category: 'Cloud Infrastructure',
        frequency: 'Continuous (1h)',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'crypto-policy-attestation.json',
        verified: true,
        lastTested: '15m ago',
        auditorNotes: 'TLS 1.3 enforced globally. Insecure TLS 1.0/1.1 disabled.',
      },
      {
        id: 'test-iso-3',
        code: 'A.5.24',
        name: 'Infosec Incident Management Plan',
        description: 'Annual test of incident response playbooks and SIEM real-time alerting integration.',
        category: 'Security Operations',
        frequency: 'Quarterly',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'incident-drill-simulation-2026.pdf',
        verified: true,
        lastTested: 'Aug 04, 2026',
        auditorNotes: 'Mean time to acknowledge (MTTA) under 3 minutes recorded during drill.',
      },
      {
        id: 'test-iso-4',
        code: 'A.8.9',
        name: 'Configuration Management Validation',
        description: 'Infrastructure-as-Code Terraform state tracking and drift detection alerts.',
        category: 'DevOps & CI/CD',
        frequency: 'Daily',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'terraform-drift-scan-log.json',
        verified: true,
        lastTested: '1h ago',
        auditorNotes: '100% cloud resources provisioned strictly via verified CI pipelines.',
      },
      {
        id: 'test-iso-5',
        code: 'A.6.3',
        name: 'Security Awareness & Training',
        description: 'Tracking employee onboarding training completion and phishing simulation resilience.',
        category: 'People & HR',
        frequency: 'Monthly',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'knowbe4-training-summary-q2.csv',
        verified: true,
        lastTested: 'Aug 18, 2026',
        auditorNotes: '98.4% staff passed quarterly spear-phishing test simulation.',
      },
      {
        id: 'test-iso-6',
        code: 'A.5.19',
        name: 'Supplier Security Governance',
        description: 'Formal security evaluation and risk scoring for external vendors processing company data.',
        category: 'People & HR',
        frequency: 'Monthly',
        status: 'Needs Attention',
        statusVariant: 'warning',
        artifact: 'iso-vendor-evaluation-register.csv',
        verified: false,
        lastTested: '2 days ago',
        auditorNotes: 'Annual security questionnaire overdue for 2 low-risk sub-contractors.',
      },
    ],
    trustCenterUrl: 'https://trust.uipkge.dev',
  },
  hipaa: {
    id: 'hipaa',
    tabLabel: 'HIPAA Security Rule',
    name: 'HIPAA Security & Privacy Rule',
    badge: 'Healthcare & ePHI Protection',
    standard: '45 CFR Part 160 & Part 164 Subparts A, C, E',
    score: 98,
    readinessLabel: '98% Compliant',
    period: 'Active Assessment · 2026',
    auditor: 'Coalfire Systems · HIPAA Assessor',
    totalPassing: 42,
    totalTests: 43,
    pillars: [
      {
        code: '164.308',
        title: 'Administrative Safeguards',
        description: 'Security management process, workforce clearance, and contingency operations.',
        score: 97,
        passed: 18,
        total: 18,
        status: '97% Passed · 18/18 tests',
        statusVariant: 'success',
        highlights: ['Emergency Mode Operations', 'Violation Sanction Policy'],
        iconType: 'shield',
      },
      {
        code: '164.310',
        title: 'Physical Safeguards',
        description: 'Facility access controls, workstation security, and device media control.',
        score: 100,
        passed: 10,
        total: 10,
        status: '100% Passed · 10/10 tests',
        statusVariant: 'success',
        highlights: ['Encrypted SSD Storage Media', 'Biometric Facility Access'],
        iconType: 'lock',
      },
      {
        code: '164.312',
        title: 'Technical Safeguards',
        description: 'ePHI encryption, unique user identification, and automated session timeout.',
        score: 96,
        passed: 12,
        total: 13,
        status: '96% Passed · 12/13 tests',
        statusVariant: 'warning',
        highlights: ['15-Minute Auto-Lock Policy', 'SHA-256 Audit Trail Integrity'],
        iconType: 'server',
      },
      {
        code: '164.314',
        title: 'Organizational Requirements',
        description: 'Business Associate Agreements (BAAs) with all vendors handling ePHI.',
        score: 100,
        passed: 2,
        total: 2,
        status: '100% Passed · 2/2 BAAs',
        statusVariant: 'success',
        highlights: ['AWS HIPAA BAA Signed', 'Cloudflare HIPAA BAA Signed'],
        iconType: 'users',
      },
    ],
    tests: [
      {
        id: 'test-hipaa-1',
        code: '164.312(a)(1)',
        name: 'Unique User ePHI Access Identification',
        description: 'Every healthcare provider and system operator assigned a unique non-shared login.',
        category: 'Identity & Auth',
        frequency: 'Continuous (1h)',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'hipaa-identity-access-log.json',
        verified: true,
        lastTested: '10m ago',
        auditorNotes: 'Zero generic or shared accounts found across electronic health records.',
      },
      {
        id: 'test-hipaa-2',
        code: '164.312(a)(2)(iii)',
        name: 'Automatic Logoff Configuration',
        description: 'System automatically terminates an electronic session after 15 minutes of inactivity.',
        category: 'Cloud Infrastructure',
        frequency: 'Continuous (1h)',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'session-timeout-policy-test.json',
        verified: true,
        lastTested: '22m ago',
        auditorNotes: 'Verified on web, desktop app, and clinician mobile portals.',
      },
      {
        id: 'test-hipaa-3',
        code: '164.312(b)',
        name: 'Audit Controls & 6-Year Retention',
        description: 'Immutable audit logs recording access, modification, and export of electronic patient data.',
        category: 'Security Operations',
        frequency: 'Continuous (1h)',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'audit-worm-retention-spec.json',
        verified: true,
        lastTested: '5m ago',
        auditorNotes: 'AWS S3 Object Lock in Compliance Mode active with 6-year retention policy.',
      },
      {
        id: 'test-hipaa-4',
        code: '164.312(e)(1)',
        name: 'Transmission Security TLS 1.3',
        description: 'ePHI in transit encrypted across public networks using TLS 1.3 with HSTS enabled.',
        category: 'Cloud Infrastructure',
        frequency: 'Continuous (1h)',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'tls-cipher-scan-report.json',
        verified: true,
        lastTested: '30m ago',
        auditorNotes: 'A+ SSL Labs score verified on all public API endpoints.',
      },
      {
        id: 'test-hipaa-5',
        code: '164.314(a)(1)',
        name: 'Active BAAs for All Cloud Vendors',
        description: 'Executed Business Associate Agreements signed with all subprocessors with access to ePHI.',
        category: 'People & HR',
        frequency: 'Monthly',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'signed-baa-register-2026.pdf',
        verified: true,
        lastTested: 'Aug 15, 2026',
        auditorNotes: 'BAA signed with AWS, Twilio, SendGrid, and Datadog.',
      },
      {
        id: 'test-hipaa-6',
        code: '164.308(a)(7)',
        name: 'Contingency & Disaster Recovery Plan',
        description: 'Documented emergency mode operations and annual disaster recovery failover drill.',
        category: 'Security Operations',
        frequency: 'Quarterly',
        status: 'Needs Attention',
        statusVariant: 'warning',
        artifact: 'dr-failover-drill-q2.pdf',
        verified: false,
        lastTested: '3 days ago',
        auditorNotes: 'Q3 secondary region failover drill scheduled for next Tuesday.',
      },
    ],
    trustCenterUrl: 'https://trust.uipkge.dev',
  },
  gdpr: {
    id: 'gdpr',
    tabLabel: 'GDPR',
    name: 'General Data Protection Regulation',
    badge: 'Data Privacy & Subject Rights',
    standard: 'Regulation (EU) 2016/679 · DPO Supervised',
    score: 95,
    readinessLabel: '95% Compliant',
    period: 'Annual Privacy Review · 2026',
    auditor: 'Internal DPO & Lead Data Authority',
    totalPassing: 32,
    totalTests: 34,
    pillars: [
      {
        code: 'Art 25',
        title: 'Data Protection by Design',
        description: 'Pseudonymization, data minimization, and automated retention limits.',
        score: 94,
        passed: 9,
        total: 10,
        status: '94% Passed · 9/10 tests',
        statusVariant: 'success',
        highlights: ['Automated 90-Day PII Purge', 'Data Minimization Schemas'],
        iconType: 'shield',
      },
      {
        code: 'Art 30',
        title: 'Records of Processing (RoPA)',
        description: 'Complete registry of personal data processing categories and legal purposes.',
        score: 100,
        passed: 8,
        total: 8,
        status: '100% Passed · 8/8 records',
        statusVariant: 'success',
        highlights: ['Dynamic RoPA Data Flow', 'Lawful Basis Cataloged'],
        iconType: 'file',
      },
      {
        code: 'Art 32',
        title: 'Security of Processing',
        description: 'Technical safeguards, encryption, and regular vulnerability assessments.',
        score: 96,
        passed: 11,
        total: 11,
        status: '100% Passed · 11/11 tests',
        statusVariant: 'success',
        highlights: ['Field-Level PII Encryption', 'Zero-Trust Bastion Access'],
        iconType: 'lock',
      },
      {
        code: 'Art 33/34',
        title: 'Breach Notification Protocol',
        description: '72-hour supervisory authority notification process and risk assessments.',
        score: 90,
        passed: 4,
        total: 5,
        status: '90% Passed · 4/5 tests',
        statusVariant: 'warning',
        highlights: ['72-Hour DPA Escalation SLA', 'Subject Notification Workflow'],
        iconType: 'activity',
      },
    ],
    tests: [
      {
        id: 'test-gdpr-1',
        code: 'Art 17',
        name: 'Right to Erasure / DSR Pipeline',
        description: 'Automated user data deletion across database tables and 3rd party integrations in < 30 days.',
        category: 'DevOps & CI/CD',
        frequency: 'Continuous (1h)',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'dsr-erasure-orchestrator.json',
        verified: true,
        lastTested: '14m ago',
        auditorNotes: 'Mean time to complete erasure request: 4.2 hours.',
      },
      {
        id: 'test-gdpr-2',
        code: 'Art 30',
        name: 'RoPA Inventory Live Synchronization',
        description:
          'Data classification tags synced with schema catalog to ensure full records of processing coverage.',
        category: 'Identity & Auth',
        frequency: 'Continuous (1h)',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'ropa-schema-mapping-v3.json',
        verified: true,
        lastTested: '6m ago',
        auditorNotes: '100% of PII data fields mapped to lawful basis.',
      },
      {
        id: 'test-gdpr-3',
        code: 'Art 28',
        name: 'Data Processing Agreements (DPAs)',
        description: 'Standard Contractual Clauses (SCCs) and DPAs executed with all EU data processors.',
        category: 'People & HR',
        frequency: 'Monthly',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'dpa-register-eu-2026.pdf',
        verified: true,
        lastTested: 'Aug 10, 2026',
        auditorNotes: 'All sub-processors compliant with EU-US Data Privacy Framework.',
      },
      {
        id: 'test-gdpr-4',
        code: 'Art 7',
        name: 'Cookie Consent & Preference CMP',
        description: 'Explicit opt-in banner blocking non-essential tracking prior to affirmative user consent.',
        category: 'Cloud Infrastructure',
        frequency: 'Continuous (1h)',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'cmp-consent-telemetry.json',
        verified: true,
        lastTested: '1h ago',
        auditorNotes: 'Zero tracking cookies loaded prior to consent confirmation.',
      },
      {
        id: 'test-gdpr-5',
        code: 'Art 32(1)(a)',
        name: 'PII Field-Level Encryption at Rest',
        description: 'Names, emails, and financial identifiers hashed or encrypted with AES-256 before storage.',
        category: 'Cloud Infrastructure',
        frequency: 'Continuous (1h)',
        status: 'Passing',
        statusVariant: 'success',
        artifact: 'field-encryption-audit.json',
        verified: true,
        lastTested: '25m ago',
        auditorNotes: 'KMS envelope encryption active on all customer records.',
      },
      {
        id: 'test-gdpr-6',
        code: 'Art 33',
        name: '72-Hour Breach Notification Drill',
        description: 'Tabletop simulation testing supervisory authority DPA notification within statutory 72h window.',
        category: 'Security Operations',
        frequency: 'Quarterly',
        status: 'Needs Attention',
        statusVariant: 'warning',
        artifact: 'gdpr-breach-playbook-2026.pdf',
        verified: false,
        lastTested: '4 days ago',
        auditorNotes: 'DPO escalation contact list updated; tabletop review due in Q3.',
      },
    ],
    trustCenterUrl: 'https://trust.uipkge.dev',
  },
}

const activeFrameworkId = ref(props.defaultFramework || 'soc2')
const searchQuery = ref('')
const selectedCategory = ref<string>('all')
const runningTestIds = ref<Record<string, boolean>>({})
const lastTestedMap = ref<Record<string, string>>({})
const activeEvidenceModal = ref<EvidenceTestItem | null>(null)
const isTestingAll = ref(false)
const scheduleRequested = ref(false)
const exportSuccess = ref(false)

const currentFramework = computed(() => frameworksData[activeFrameworkId.value] || frameworksData.soc2)

const availableCategories = computed(() => {
  const cats = new Set<string>()
  currentFramework.value.tests.forEach((t) => cats.add(t.category))
  return ['all', ...Array.from(cats)]
})

const filteredTests = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const cat = selectedCategory.value
  return currentFramework.value.tests.filter((test) => {
    const matchesCat = cat === 'all' || test.category === cat
    const matchesQuery =
      !q ||
      test.code.toLowerCase().includes(q) ||
      test.name.toLowerCase().includes(q) ||
      test.description.toLowerCase().includes(q) ||
      test.artifact.toLowerCase().includes(q) ||
      test.category.toLowerCase().includes(q)
    return matchesCat && matchesQuery
  })
})

function getPillarIcon(iconType: string) {
  switch (iconType) {
    case 'key':
      return KeyRound
    case 'shield':
      return ShieldCheck
    case 'activity':
      return Zap
    case 'users':
      return Users
    case 'lock':
      return Lock
    case 'server':
      return Server
    case 'file':
      return FileText
    default:
      return Shield
  }
}

function handleRunTest(testId: string) {
  runningTestIds.value[testId] = true
  setTimeout(() => {
    runningTestIds.value[testId] = false
    lastTestedMap.value[testId] = 'Just now'
  }, 500)
}

function handleRunAllTests() {
  isTestingAll.value = true
  setTimeout(() => {
    isTestingAll.value = false
    currentFramework.value.tests.forEach((t) => {
      lastTestedMap.value[t.id] = 'Just now'
    })
  }, 700)
}

function handleScheduleReview() {
  scheduleRequested.value = true
  setTimeout(() => {
    scheduleRequested.value = false
  }, 3000)
}

function handleExportPackage() {
  exportSuccess.value = true
  setTimeout(() => {
    exportSuccess.value = false
  }, 3000)
}

function viewEvidence(test: EvidenceTestItem) {
  activeEvidenceModal.value = test
}

function closeEvidenceModal() {
  activeEvidenceModal.value = null
}
</script>

<template>
  <div data-slot="compliance-soc2-readiness" :class="cn('w-full space-y-6', props.class)">
    <!-- Framework Selector Tabs -->
    <Tabs v-model="activeFrameworkId" :default-value="props.defaultFramework" class="w-full">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TabsList class="grid w-full grid-cols-2 md:w-auto md:grid-cols-4">
          <TabsTrigger value="soc2" class="text-xs font-medium">SOC 2 Type II</TabsTrigger>
          <TabsTrigger value="iso27001" class="text-xs font-medium">ISO 27001</TabsTrigger>
          <TabsTrigger value="hipaa" class="text-xs font-medium">HIPAA Security Rule</TabsTrigger>
          <TabsTrigger value="gdpr" class="text-xs font-medium">GDPR</TabsTrigger>
        </TabsList>

        <div class="text-muted-foreground flex items-center gap-2 text-xs">
          <span class="inline-flex size-2 rounded-full bg-emerald-500" />
          <span>Real-time Telemetry Ingestion Active</span>
        </div>
      </div>

      <!-- Executive Overview Card -->
      <Card class="border-border bg-card mt-4 shadow-xs">
        <CardContent class="p-6">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <!-- Left: Framework info -->
            <div class="space-y-2">
              <div class="flex flex-wrap items-center gap-2.5">
                <h1 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  {{ currentFramework.name }}
                </h1>
                <Badge variant="secondary" class="font-medium">
                  {{ currentFramework.badge }}
                </Badge>
              </div>
              <p class="text-muted-foreground text-xs sm:text-sm">
                {{ currentFramework.standard }}
              </p>
              <div class="text-muted-foreground flex flex-wrap items-center gap-3 pt-1 text-xs">
                <Badge variant="outline" class="gap-1.5 font-normal">
                  <Calendar class="size-3.5" />
                  {{ currentFramework.period }}
                </Badge>
                <Separator orientation="vertical" class="hidden h-3.5 sm:block" />
                <span>
                  Lead Assessor: <strong class="text-foreground font-medium">{{ currentFramework.auditor }}</strong>
                </span>
              </div>
            </div>

            <!-- Right: Big Score Card & Action Buttons -->
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
              <!-- Score Badge -->
              <div
                class="flex items-center gap-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 shadow-xs"
              >
                <div
                  class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                >
                  <ShieldCheck class="size-6" />
                </div>
                <div class="space-y-0.5">
                  <div class="flex items-baseline gap-2">
                    <span
                      class="text-2xl font-bold tracking-tight text-emerald-600 tabular-nums sm:text-3xl dark:text-emerald-400"
                    >
                      {{ currentFramework.score }}%
                    </span>
                    <Badge variant="success" class="gap-1 px-2 text-xs font-semibold">
                      <Sparkles class="size-3" />
                      {{ currentFramework.readinessLabel.replace(`${currentFramework.score}% `, '') }}
                    </Badge>
                  </div>
                  <p class="text-muted-foreground text-xs">
                    {{ currentFramework.totalPassing }}/{{ currentFramework.totalTests }} Continuous Controls Passing
                  </p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-wrap gap-2.5 sm:flex-col">
                <Button variant="default" size="sm" class="gap-2 shadow-xs" @click="handleScheduleReview">
                  <Check v-if="scheduleRequested" class="size-4 text-emerald-300" />
                  <Calendar v-else class="size-4" />
                  <span>{{ scheduleRequested ? 'Review Requested!' : 'Schedule Auditor Review' }}</span>
                </Button>

                <Button variant="outline" size="sm" class="gap-2 shadow-xs" @click="handleExportPackage">
                  <Check v-if="exportSuccess" class="text-success size-4" />
                  <FileDown v-else class="size-4" />
                  <span>{{ exportSuccess ? 'Package Exported!' : 'Export Compliance Package' }}</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 4 Compliance Control Pillar Cards -->
      <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          v-for="pillar in currentFramework.pillars"
          :key="pillar.code"
          class="border-border bg-card hover:border-border shadow-xs transition-colors"
        >
          <CardHeader class="p-4 pb-2">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2">
                <div
                  class="bg-muted text-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border"
                >
                  <component :is="getPillarIcon(pillar.iconType)" class="size-4" />
                </div>
                <Badge variant="outline" class="font-mono text-xs font-semibold">
                  {{ pillar.code }}
                </Badge>
              </div>

              <Badge :variant="pillar.statusVariant" class="text-xs font-medium">
                {{ pillar.score === 100 ? 'Zero Gaps' : pillar.statusVariant === 'warning' ? '1 Warning' : 'Passing' }}
              </Badge>
            </div>

            <CardTitle class="mt-2 text-sm leading-snug font-semibold">
              {{ pillar.title }}
            </CardTitle>
            <CardDescription class="line-clamp-2 text-xs">
              {{ pillar.description }}
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-3 p-4 pt-1">
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 text-xs">
                <span class="text-foreground text-2xl font-bold tracking-tight tabular-nums">
                  {{ pillar.score }}%
                </span>
                <span class="text-muted-foreground font-medium tabular-nums">
                  {{ pillar.passed }}/{{ pillar.total }} tests
                </span>
              </div>
              <Progress :model-value="pillar.score" class="h-1.5 w-full" />
            </div>

            <!-- Bullet highlights -->
            <div class="bg-muted/40 border-border/60 space-y-1 rounded-md border p-2 text-xs">
              <div
                v-for="highlight in pillar.highlights"
                :key="highlight"
                class="text-muted-foreground flex items-center gap-1.5"
              >
                <CheckCircle2 class="text-success size-3 shrink-0" />
                <span class="truncate">{{ highlight }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Automated Evidence Tests Table Card -->
      <Card class="border-border bg-card mt-6 shadow-xs">
        <CardHeader class="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div class="flex items-center gap-2">
              <CardTitle class="text-base font-semibold">Automated Evidence Tests</CardTitle>
              <Badge variant="secondary" class="font-mono text-xs"> {{ filteredTests.length }} Active </Badge>
            </div>
            <CardDescription class="text-xs">
              Continuous synthetic and policy compliance evaluation across infrastructure and IAM.
            </CardDescription>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              class="gap-1.5 text-xs shadow-xs"
              :disabled="isTestingAll"
              @click="handleRunAllTests"
            >
              <RefreshCw :class="['size-3.5', isTestingAll ? 'animate-spin' : '']" />
              <span>{{ isTestingAll ? 'Evaluating Tests...' : 'Run All Automated Tests' }}</span>
            </Button>
          </div>
        </CardHeader>

        <!-- Filter & Search Toolbar -->
        <div class="border-border/60 border-t p-4 pt-3 pb-3">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div class="relative flex-1">
              <Search
                class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Filter by control code, name, category, or evidence artifact..."
                class="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-full rounded-md border px-3 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>

            <div class="flex flex-wrap items-center gap-1.5">
              <span class="text-muted-foreground mr-1 flex items-center gap-1 text-xs font-medium">
                <Filter class="size-3" />
                Category:
              </span>
              <button
                v-for="cat in availableCategories"
                :key="cat"
                type="button"
                :class="[
                  'focus-visible:ring-ring inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedCategory === cat
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
                ]"
                @click="selectedCategory = cat"
              >
                {{ cat === 'all' ? 'All Categories' : cat }}
              </button>
            </div>
          </div>
        </div>

        <!-- Table Container -->
        <CardContent class="p-0">
          <div class="border-border/60 overflow-x-auto border-t">
            <Table>
              <TableHeader class="bg-muted/50">
                <TableRow>
                  <TableHead class="min-w-[220px] text-xs">Control & Rule Name</TableHead>
                  <TableHead class="text-xs">Domain Category</TableHead>
                  <TableHead class="text-xs">Frequency</TableHead>
                  <TableHead class="text-xs">Status</TableHead>
                  <TableHead class="text-xs">Evidence Artifact</TableHead>
                  <TableHead class="text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="test in filteredTests" :key="test.id" class="hover:bg-muted/20">
                  <!-- Control Code & Name -->
                  <TableCell class="py-3">
                    <div class="space-y-0.5">
                      <div class="flex items-center gap-2">
                        <span class="text-foreground font-mono text-xs font-bold">{{ test.code }}</span>
                        <span class="text-foreground text-xs font-semibold">{{ test.name }}</span>
                      </div>
                      <p class="text-muted-foreground max-w-sm text-xs leading-relaxed sm:max-w-md">
                        {{ test.description }}
                      </p>
                    </div>
                  </TableCell>

                  <!-- Category -->
                  <TableCell class="py-3">
                    <Badge variant="outline" class="text-xs font-normal">
                      {{ test.category }}
                    </Badge>
                  </TableCell>

                  <!-- Frequency -->
                  <TableCell class="text-muted-foreground py-3 text-xs">
                    <div class="flex items-center gap-1.5 font-medium">
                      <Clock class="size-3.5" />
                      <span>{{ test.frequency }}</span>
                    </div>
                    <span class="text-muted-foreground/70 block text-xs">
                      Tested: {{ lastTestedMap[test.id] || test.lastTested }}
                    </span>
                  </TableCell>

                  <!-- Status -->
                  <TableCell class="py-3">
                    <Badge :variant="test.statusVariant" class="gap-1 text-xs font-medium">
                      <CheckCircle2 v-if="test.status === 'Passing'" class="size-3" />
                      <AlertTriangle v-else class="size-3" />
                      {{ test.status }}
                    </Badge>
                  </TableCell>

                  <!-- Evidence Artifact Link -->
                  <TableCell class="py-3">
                    <button
                      type="button"
                      class="hover:border-primary/40 hover:bg-muted/60 focus-visible:ring-ring group border-border/80 bg-muted/30 flex items-center gap-1.5 rounded-md border px-2 py-1 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                      @click="viewEvidence(test)"
                    >
                      <FileText class="text-muted-foreground group-hover:text-foreground size-3.5 shrink-0" />
                      <span class="text-foreground max-w-[150px] truncate font-mono text-xs sm:max-w-[200px]">
                        {{ test.artifact }}
                      </span>
                      <CheckCircle2 v-if="test.verified" class="text-success size-3 shrink-0" />
                    </button>
                  </TableCell>

                  <!-- Action Buttons -->
                  <TableCell class="py-3 text-right">
                    <div class="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="xs"
                        class="h-7 gap-1 text-xs"
                        :disabled="runningTestIds[test.id]"
                        @click="handleRunTest(test.id)"
                      >
                        <RefreshCw :class="['size-3', runningTestIds[test.id] ? 'animate-spin' : '']" />
                        <span class="hidden sm:inline">Test Now</span>
                      </Button>

                      <Button variant="outline" size="xs" class="h-7 gap-1 text-xs" @click="viewEvidence(test)">
                        <Eye class="size-3" />
                        <span>Evidence</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow v-if="filteredTests.length === 0">
                  <TableCell colspan="6" class="py-8 text-center">
                    <p class="text-muted-foreground text-xs">No automated compliance tests match your query.</p>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <!-- Auditor Access & Trust Center Preview Strip -->
      <Card class="border-border bg-card mt-6 overflow-hidden shadow-xs">
        <CardContent class="p-6">
          <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div class="flex items-start gap-4">
              <div
                class="bg-primary/10 text-primary border-primary/20 flex size-11 shrink-0 items-center justify-center rounded-xl border"
              >
                <BadgeCheck class="size-6" />
              </div>
              <div class="space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="text-foreground text-base font-semibold">Auditor Access & Public Trust Center</h3>
                  <Badge variant="outline" class="gap-1 font-mono text-xs">
                    <span class="size-1.5 rounded-full bg-emerald-500" />
                    Vault Online
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs leading-relaxed sm:text-sm">
                  Cryptographically verifiable evidence room configured for continuous compliance review by
                  <strong class="text-foreground font-medium">{{ currentFramework.auditor }}</strong
                  >.
                </p>
                <div class="text-muted-foreground flex flex-wrap items-center gap-3 pt-1 text-xs">
                  <span>Access Grant: <strong class="text-foreground font-medium">Valid for 14 days</strong></span>
                  <Separator orientation="vertical" class="hidden h-3 sm:block" />
                  <span
                    >Trust Portal:
                    <span class="text-foreground font-mono">{{ currentFramework.trustCenterUrl }}</span></span
                  >
                </div>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2.5 sm:self-start lg:self-center">
              <a :href="currentFramework.trustCenterUrl" target="_blank" rel="noreferrer" class="inline-flex">
                <Button variant="outline" size="sm" class="gap-1.5 shadow-xs">
                  <ArrowUpRight class="size-4" />
                  <span>Preview Live Trust Center</span>
                </Button>
              </a>

              <Button variant="secondary" size="sm" class="gap-1.5 shadow-xs">
                <KeyRound class="size-4" />
                <span>Manage Auditor Access</span>
              </Button>
            </div>
          </div>
        </CardContent>

        <!-- Bottom Audit Ingestion Watermark -->
        <div
          class="bg-muted/40 border-border flex flex-col gap-2 border-t px-6 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="text-muted-foreground flex items-center gap-2 font-mono">
            <span class="size-1.5 rounded-full bg-emerald-500" />
            <span>Ledger Stamp: 0x9b4a8e217f0a4421b8c1992019a · SHA-256 Verified</span>
          </div>
          <span class="text-muted-foreground font-mono text-xs">
            Framework: {{ currentFramework.tabLabel }} · Last Evaluation: Just now
          </span>
        </div>
      </Card>
    </Tabs>

    <!-- Modal / Sheet Preview for Evidence Artifact -->
    <div
      v-if="activeEvidenceModal"
      class="bg-background/80 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      @click.self="closeEvidenceModal"
    >
      <Card class="border-border bg-card w-full max-w-lg shadow-lg">
        <CardHeader class="flex flex-row items-center justify-between pb-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <Badge variant="outline" class="font-mono text-xs">{{ activeEvidenceModal.code }}</Badge>
              <CardTitle class="text-base font-semibold">Evidence Verification Details</CardTitle>
            </div>
            <CardDescription class="text-xs">{{ activeEvidenceModal.name }}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            class="size-7"
            aria-label="Close evidence modal"
            @click="closeEvidenceModal"
          >
            <X class="size-4" />
          </Button>
        </CardHeader>

        <CardContent class="space-y-4 text-xs">
          <div class="bg-muted/40 border-border/80 space-y-2 rounded-lg border p-3">
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground font-medium">Artifact File:</span>
              <span class="text-foreground font-mono font-semibold">{{ activeEvidenceModal.artifact }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground font-medium">Verification Status:</span>
              <Badge :variant="activeEvidenceModal.statusVariant" class="gap-1 text-xs">
                <CheckCircle2 v-if="activeEvidenceModal.verified" class="size-3" />
                <AlertCircle v-else class="size-3" />
                {{ activeEvidenceModal.verified ? 'Cryptographically Verified' : 'Action Required' }}
              </Badge>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-muted-foreground font-medium">Test Frequency:</span>
              <span class="text-foreground font-mono">{{ activeEvidenceModal.frequency }}</span>
            </div>
          </div>

          <div class="space-y-1.5">
            <span class="text-muted-foreground font-medium">Auditor Evaluation Notes:</span>
            <p class="bg-muted/20 border-border text-foreground rounded-md border p-2.5 leading-relaxed">
              {{ activeEvidenceModal.auditorNotes }}
            </p>
          </div>

          <div class="flex items-center justify-end gap-2 pt-2">
            <Button
              aria-label="Close evidence modal"
              variant="outline"
              size="sm"
              class="text-xs"
              @click="closeEvidenceModal"
            >
              Close
            </Button>
            <Button
              aria-label="Close evidence modal"
              variant="default"
              size="sm"
              class="gap-1.5 text-xs"
              @click="closeEvidenceModal"
            >
              <Download class="size-3.5" />
              Download Artifact
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
