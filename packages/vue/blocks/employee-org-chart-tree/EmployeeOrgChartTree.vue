<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Building2,
  Users,
  User,
  Mail,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  Check,
  Copy,
  Plus,
  Minus,
  Briefcase,
  Phone,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export interface EmployeeNode {
  id: string
  name: string
  role: string
  department: 'Executive' | 'Engineering' | 'Design' | 'Product' | 'Operations'
  email: string
  phone: string
  location: string
  avatar: string
  initials: string
  reportsCount: number
  teamHeadcount: number
  managerId?: string
  managerName?: string
  managerRole?: string
  startDate: string
  tenure: string
  bio: string
  skills: string[]
  status: 'active' | 'on-leave'
  children?: EmployeeNode[]
}

interface Props {
  title?: string
  subtitle?: string
  initialSelectedId?: string
  initialDepartment?: string
  initialSearch?: string
  initialExpandedIds?: string[]
  initialDrawerOpen?: boolean
  class?: HTMLAttributes['class']
}

// The tree is centered inside a canvas far wider than the viewport, so on a
// narrow screen scrollLeft 0 shows empty gutter. Start centered on the root.
const canvasRef = ref<HTMLDivElement | null>(null)
onMounted(() => {
  const el = canvasRef.value
  if (el) el.scrollLeft = Math.max(0, (el.scrollWidth - el.clientWidth) / 2)
})

const props = withDefaults(defineProps<Props>(), {
  title: 'Company Organizational Chart',
  subtitle: '148 Employees across 5 Departments',
  initialSelectedId: 'emp-ceo',
  initialDepartment: 'All',
  initialSearch: '',
  initialExpandedIds: () => ['emp-ceo', 'emp-eng-vp', 'emp-prod-vp', 'emp-ops-vp'],
  initialDrawerOpen: true,
})

const DEFAULT_ORG_DATA: EmployeeNode = {
  id: 'emp-ceo',
  name: 'Sarah Jenkins',
  role: 'Chief Executive Officer',
  department: 'Executive',
  email: 'sarah.jenkins@acme.corp',
  phone: '+1 (415) 890-1200',
  location: 'San Francisco, CA (HQ)',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
  initials: 'SJ',
  reportsCount: 3,
  teamHeadcount: 148,
  startDate: 'January 2019',
  tenure: '5 yrs 8 mos',
  bio: 'Directs company-wide vision, long-range enterprise roadmap, capital allocation, and executive leadership across 5 global divisions.',
  skills: ['Executive Leadership', 'Corporate Strategy', 'Enterprise SaaS', 'M&A', 'Culture'],
  status: 'active',
  children: [
    {
      id: 'emp-eng-vp',
      name: 'Marcus Vance',
      role: 'VP of Engineering',
      department: 'Engineering',
      email: 'marcus.vance@acme.corp',
      phone: '+1 (212) 745-9921',
      location: 'New York, NY',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      initials: 'MV',
      reportsCount: 3,
      teamHeadcount: 64,
      managerId: 'emp-ceo',
      managerName: 'Sarah Jenkins',
      managerRole: 'Chief Executive Officer',
      startDate: 'March 2020',
      tenure: '4 yrs 6 mos',
      bio: 'Leads 64 engineers across platform architecture, frontend infrastructure, and Site Reliability Engineering with 99.99% uptime SLA.',
      skills: ['Distributed Systems', 'Cloud Architecture', 'Tech Strategy', 'Kubernetes', 'Scalability'],
      status: 'active',
      children: [
        {
          id: 'emp-eng-lead-1',
          name: 'Alex Rivera',
          role: 'Principal Architect',
          department: 'Engineering',
          email: 'alex.rivera@acme.corp',
          phone: '+1 (512) 634-1109',
          location: 'Austin, TX',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
          initials: 'AR',
          reportsCount: 2,
          teamHeadcount: 18,
          managerId: 'emp-eng-vp',
          managerName: 'Marcus Vance',
          managerRole: 'VP of Engineering',
          startDate: 'September 2020',
          tenure: '4 yrs',
          bio: 'Designs core distributed event pipelines, data mesh architecture, and multi-tenant database infrastructure.',
          skills: ['Go', 'Kafka', 'PostgreSQL', 'System Architecture', 'Event Streaming'],
          status: 'active',
          children: [
            {
              id: 'emp-eng-ic-1',
              name: 'Kai Zhang',
              role: 'Senior Backend Engineer',
              department: 'Engineering',
              email: 'kai.zhang@acme.corp',
              phone: '+1 (512) 634-1188',
              location: 'Austin, TX',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
              initials: 'KZ',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-eng-lead-1',
              managerName: 'Alex Rivera',
              managerRole: 'Principal Architect',
              startDate: 'January 2022',
              tenure: '2 yrs 8 mos',
              bio: 'Builds low-latency gRPC services, consensus layers, and distributed caching protocols.',
              skills: ['Rust', 'gRPC', 'Raft', 'Redis', 'High Throughput'],
              status: 'active',
            },
            {
              id: 'emp-eng-ic-2',
              name: 'Hannah Schmidt',
              role: 'Staff Database Architect',
              department: 'Engineering',
              email: 'hannah.schmidt@acme.corp',
              phone: '+1 (512) 634-1192',
              location: 'Remote, US',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
              initials: 'HS',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-eng-lead-1',
              managerName: 'Alex Rivera',
              managerRole: 'Principal Architect',
              startDate: 'May 2021',
              tenure: '3 yrs 4 mos',
              bio: 'Specializes in multi-master replication, query optimization, and automated sharding migrations.',
              skills: ['PostgreSQL', 'CockroachDB', 'Data Warehousing', 'Query Tuning'],
              status: 'active',
            },
          ],
        },
        {
          id: 'emp-eng-lead-2',
          name: 'Sofia Rossi',
          role: 'Staff Frontend Lead',
          department: 'Engineering',
          email: 'sofia.rossi@acme.corp',
          phone: '+49 30 2219 4481',
          location: 'Berlin, Germany',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
          initials: 'SR',
          reportsCount: 2,
          teamHeadcount: 24,
          managerId: 'emp-eng-vp',
          managerName: 'Marcus Vance',
          managerRole: 'VP of Engineering',
          startDate: 'November 2020',
          tenure: '3 yrs 10 mos',
          bio: 'Leads the unified component design system, micro-frontend architecture, and web accessibility standards.',
          skills: ['Vue 3', 'React', 'Design Systems', 'Web Performance', 'WCAG AA'],
          status: 'active',
          children: [
            {
              id: 'emp-eng-ic-3',
              name: 'Leo Garcia',
              role: 'Senior UI Engineer',
              department: 'Engineering',
              email: 'leo.garcia@acme.corp',
              phone: '+49 30 2219 4490',
              location: 'Berlin, Germany',
              avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
              initials: 'LG',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-eng-lead-2',
              managerName: 'Sofia Rossi',
              managerRole: 'Staff Frontend Lead',
              startDate: 'February 2022',
              tenure: '2 yrs 7 mos',
              bio: 'Focuses on complex interactive data visualization canvases, charts, and keyboard shortcuts engine.',
              skills: ['TypeScript', 'Tailwind CSS', 'D3.js', 'Canvas API'],
              status: 'active',
            },
            {
              id: 'emp-eng-ic-4',
              name: 'Nina Patel',
              role: 'Frontend Platform Engineer',
              department: 'Engineering',
              email: 'nina.patel@acme.corp',
              phone: '+44 20 8123 9940',
              location: 'London, UK',
              avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&auto=format&fit=crop&q=80',
              initials: 'NP',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-eng-lead-2',
              managerName: 'Sofia Rossi',
              managerRole: 'Staff Frontend Lead',
              startDate: 'October 2022',
              tenure: '1 yr 11 mos',
              bio: 'Manages automated bundle size budgets, CI build plugins, and island rendering hydration pipelines.',
              skills: ['Vite', 'Turborepo', 'Playwright', 'ESBuild'],
              status: 'active',
            },
          ],
        },
        {
          id: 'emp-eng-lead-3',
          name: 'Tariq Mansour',
          role: 'DevOps & SRE Lead',
          department: 'Engineering',
          email: 'tariq.mansour@acme.corp',
          phone: '+1 (415) 555-8910',
          location: 'San Francisco, CA',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
          initials: 'TM',
          reportsCount: 2,
          teamHeadcount: 22,
          managerId: 'emp-eng-vp',
          managerName: 'Marcus Vance',
          managerRole: 'VP of Engineering',
          startDate: 'January 2021',
          tenure: '3 yrs 8 mos',
          bio: 'Directs cloud infrastructure resilience, multi-region Kubernetes clusters, and automated zero-downtime rollouts.',
          skills: ['AWS', 'Terraform', 'Kubernetes', 'CI/CD', 'Observability'],
          status: 'active',
          children: [
            {
              id: 'emp-eng-ic-5',
              name: 'Kiran Rao',
              role: 'Senior SRE Engineer',
              department: 'Engineering',
              email: 'kiran.rao@acme.corp',
              phone: '+1 (415) 555-8933',
              location: 'San Francisco, CA',
              avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80',
              initials: 'KR',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-eng-lead-3',
              managerName: 'Tariq Mansour',
              managerRole: 'DevOps & SRE Lead',
              startDate: 'August 2022',
              tenure: '2 yrs 1 mo',
              bio: 'Maintains Prometheus/Grafana telemetry stacks, SLO/SLI tracking dashboards, and disaster drills.',
              skills: ['Prometheus', 'Grafana', 'OpenTelemetry', 'Chaos Engineering'],
              status: 'active',
            },
            {
              id: 'emp-eng-ic-6',
              name: 'Elena Dubois',
              role: 'Cloud Security Specialist',
              department: 'Engineering',
              email: 'elena.dubois@acme.corp',
              phone: '+33 1 42 68 55 00',
              location: 'Paris, France',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
              initials: 'ED',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-eng-lead-3',
              managerName: 'Tariq Mansour',
              managerRole: 'DevOps & SRE Lead',
              startDate: 'March 2023',
              tenure: '1 yr 6 mos',
              bio: 'Owns zero-trust cloud network topology, HashiCorp Vault key rotation, and automated CVE vulnerability audits.',
              skills: ['Vault', 'OIDC', 'IAM Hardening', 'SOC 2 Type II'],
              status: 'active',
            },
          ],
        },
      ],
    },
    {
      id: 'emp-prod-vp',
      name: 'Elena Rostova',
      role: 'VP of Product & Design',
      department: 'Product',
      email: 'elena.rostova@acme.corp',
      phone: '+44 20 7946 0912',
      location: 'London, UK',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
      initials: 'ER',
      reportsCount: 2,
      teamHeadcount: 40,
      managerId: 'emp-ceo',
      managerName: 'Sarah Jenkins',
      managerRole: 'Chief Executive Officer',
      startDate: 'June 2020',
      tenure: '4 yrs 3 mos',
      bio: 'Guides end-to-end product vision, quarterly roadmap discovery cycles, and customer experience excellence across enterprise tools.',
      skills: ['Product Strategy', 'Design Leadership', 'User Research', 'PLG', 'Enterprise UX'],
      status: 'active',
      children: [
        {
          id: 'emp-prod-lead-1',
          name: 'Maya Patel',
          role: 'Head of Product Design',
          department: 'Design',
          email: 'maya.patel@acme.corp',
          phone: '+44 20 7946 0988',
          location: 'London, UK',
          avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=160&auto=format&fit=crop&q=80',
          initials: 'MP',
          reportsCount: 2,
          teamHeadcount: 18,
          managerId: 'emp-prod-vp',
          managerName: 'Elena Rostova',
          managerRole: 'VP of Product & Design',
          startDate: 'February 2021',
          tenure: '3 yrs 7 mos',
          bio: 'Leads our 18-member UI/UX and design research studio, creating intuitive interfaces for data-intensive enterprise users.',
          skills: ['Figma', 'UX Research', 'Design Systems', 'Design Operations'],
          status: 'active',
          children: [
            {
              id: 'emp-des-ic-1',
              name: 'Aria Thorne',
              role: 'Lead UX Researcher',
              department: 'Design',
              email: 'aria.thorne@acme.corp',
              phone: '+1 (415) 321-7789',
              location: 'San Francisco, CA',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
              initials: 'AT',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-prod-lead-1',
              managerName: 'Maya Patel',
              managerRole: 'Head of Product Design',
              startDate: 'July 2022',
              tenure: '2 yrs 2 mos',
              bio: 'Conducts qualitative enterprise customer interview loops, card sorting, and workflow pain-point mapping.',
              skills: ['Qualitative Analysis', 'Usability Testing', 'Personas', 'Journey Mapping'],
              status: 'active',
            },
            {
              id: 'emp-des-ic-2',
              name: 'Lucas Silva',
              role: 'Senior Interaction Designer',
              department: 'Design',
              email: 'lucas.silva@acme.corp',
              phone: '+351 21 098 7654',
              location: 'Lisbon, Portugal',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
              initials: 'LS',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-prod-lead-1',
              managerName: 'Maya Patel',
              managerRole: 'Head of Product Design',
              startDate: 'November 2022',
              tenure: '1 yr 10 mos',
              bio: 'Architects micro-interactions, spring animation specs, and tactile feedback patterns across web and desktop.',
              skills: ['Framer', 'Prototyping', 'Micro-interactions', 'Token Systems'],
              status: 'active',
            },
          ],
        },
        {
          id: 'emp-prod-lead-2',
          name: 'Liam Tanaka',
          role: 'Principal Product Manager',
          department: 'Product',
          email: 'liam.tanaka@acme.corp',
          phone: '+81 3 5555 0142',
          location: 'Tokyo, Japan',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
          initials: 'LT',
          reportsCount: 2,
          teamHeadcount: 22,
          managerId: 'emp-prod-vp',
          managerName: 'Elena Rostova',
          managerRole: 'VP of Product & Design',
          startDate: 'August 2021',
          tenure: '3 yrs 1 mo',
          bio: 'Spearheads core enterprise workflow automation, AI copilots, and monetization experiments across global markets.',
          skills: ['Product Roadmapping', 'AI Integration', 'Data Analytics', 'Enterprise Growth'],
          status: 'active',
          children: [
            {
              id: 'emp-prod-ic-1',
              name: 'Devon Vance',
              role: 'Senior Technical PM',
              department: 'Product',
              email: 'devon.vance@acme.corp',
              phone: '+1 (212) 745-3390',
              location: 'New York, NY',
              avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=160&auto=format&fit=crop&q=80',
              initials: 'DV',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-prod-lead-2',
              managerName: 'Liam Tanaka',
              managerRole: 'Principal Product Manager',
              startDate: 'April 2023',
              tenure: '1 yr 5 mos',
              bio: 'Defines developer API contracts, webhook architectures, and 3rd party integration partner specifications.',
              skills: ['API Specs', 'OpenAPI', 'Webhooks', 'Partner Integrations'],
              status: 'active',
            },
            {
              id: 'emp-prod-ic-2',
              name: 'Sarah Lin',
              role: 'Product Analytics Lead',
              department: 'Product',
              email: 'sarah.lin@acme.corp',
              phone: '+81 3 5555 0199',
              location: 'Tokyo, Japan',
              avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&auto=format&fit=crop&q=80',
              initials: 'SL',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-prod-lead-2',
              managerName: 'Liam Tanaka',
              managerRole: 'Principal Product Manager',
              startDate: 'January 2023',
              tenure: '1 yr 8 mos',
              bio: 'Models customer retention cohorts, feature usage drop-off rates, and self-service conversion funnels.',
              skills: ['SQL', 'Mixpanel', 'Cohort Retention', 'A/B Testing'],
              status: 'active',
            },
          ],
        },
      ],
    },
    {
      id: 'emp-ops-vp',
      name: 'David Chen',
      role: 'VP of Operations & Finance',
      department: 'Operations',
      email: 'david.chen@acme.corp',
      phone: '+65 6789 0123',
      location: 'Singapore',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=160&auto=format&fit=crop&q=80',
      initials: 'DC',
      reportsCount: 2,
      teamHeadcount: 44,
      managerId: 'emp-ceo',
      managerName: 'Sarah Jenkins',
      managerRole: 'Chief Executive Officer',
      startDate: 'August 2021',
      tenure: '3 yrs 1 mo',
      bio: 'Manages worldwide financial planning, global entity setup, real estate facilities, and international compliance operations.',
      skills: ['Financial Modeling', 'Corporate Finance', 'Global Compliance', 'Treasury', 'Operations'],
      status: 'active',
      children: [
        {
          id: 'emp-ops-lead-1',
          name: 'Chloe Dupont',
          role: 'Director of Finance',
          department: 'Operations',
          email: 'chloe.dupont@acme.corp',
          phone: '+33 1 42 68 90 12',
          location: 'Paris, France',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
          initials: 'CD',
          reportsCount: 2,
          teamHeadcount: 20,
          managerId: 'emp-ops-vp',
          managerName: 'David Chen',
          managerRole: 'VP of Operations & Finance',
          startDate: 'March 2022',
          tenure: '2 yrs 6 mos',
          bio: 'Leads FP&A, annual budgeting models, GAAP audits, and international cross-border tax compliance.',
          skills: ['FP&A', 'GAAP Audits', 'Treasury Management', 'Tax Modeling'],
          status: 'active',
          children: [
            {
              id: 'emp-ops-ic-1',
              name: 'Arthur Leclerc',
              role: 'Senior Financial Analyst',
              department: 'Operations',
              email: 'arthur.leclerc@acme.corp',
              phone: '+33 1 42 68 90 33',
              location: 'Paris, France',
              avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&auto=format&fit=crop&q=80',
              initials: 'AL',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-ops-lead-1',
              managerName: 'Chloe Dupont',
              managerRole: 'Director of Finance',
              startDate: 'November 2022',
              tenure: '1 yr 10 mos',
              bio: 'Analyzes recurring SaaS revenue trends, customer lifetime values, and department OPEX burn rates.',
              skills: ['Financial Forecasting', 'Excel Modeling', 'ARR Accounting'],
              status: 'active',
            },
            {
              id: 'emp-ops-ic-2',
              name: 'Zoe Martinez',
              role: 'Global Payroll & Benefits Lead',
              department: 'Operations',
              email: 'zoe.martinez@acme.corp',
              phone: '+34 91 555 0177',
              location: 'Madrid, Spain',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
              initials: 'ZM',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-ops-lead-1',
              managerName: 'Chloe Dupont',
              managerRole: 'Director of Finance',
              startDate: 'June 2023',
              tenure: '1 yr 3 mos',
              bio: 'Oversees payroll runs across 12 countries, international equity plans, and local pension schemes.',
              skills: ['Global Payroll', 'Equity Schemes', 'Statutory Benefits'],
              status: 'active',
            },
          ],
        },
        {
          id: 'emp-ops-lead-2',
          name: 'James Wilson',
          role: 'Director of Global Operations',
          department: 'Operations',
          email: 'james.wilson@acme.corp',
          phone: '+1 (212) 745-8812',
          location: 'New York, NY',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80',
          initials: 'JW',
          reportsCount: 2,
          teamHeadcount: 24,
          managerId: 'emp-ops-vp',
          managerName: 'David Chen',
          managerRole: 'VP of Operations & Finance',
          startDate: 'May 2022',
          tenure: '2 yrs 4 mos',
          bio: 'Oversees global facilities, vendor procurement relationships, workplace experience, and corporate IT hardware fleets.',
          skills: ['Vendor Negotiations', 'Facilities Management', 'Asset Tracking', 'Workplace Ops'],
          status: 'active',
          children: [
            {
              id: 'emp-ops-ic-3',
              name: 'Rachel Green',
              role: 'Workplace Experience Manager',
              department: 'Operations',
              email: 'rachel.green@acme.corp',
              phone: '+1 (212) 745-8833',
              location: 'New York, NY',
              avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=160&auto=format&fit=crop&q=80',
              initials: 'RG',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-ops-lead-2',
              managerName: 'James Wilson',
              managerRole: 'Director of Global Operations',
              startDate: 'January 2023',
              tenure: '1 yr 8 mos',
              bio: 'Coordinates global office events, collaborative space design, catering vendors, and team onsites.',
              skills: ['Event Planning', 'Space Management', 'Culture Initiatives'],
              status: 'active',
            },
            {
              id: 'emp-ops-ic-4',
              name: 'Vikram Seth',
              role: 'IT Systems & Security Lead',
              department: 'Operations',
              email: 'vikram.seth@acme.corp',
              phone: '+65 6789 0188',
              location: 'Singapore',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
              initials: 'VS',
              reportsCount: 0,
              teamHeadcount: 1,
              managerId: 'emp-ops-lead-2',
              managerName: 'James Wilson',
              managerRole: 'Director of Global Operations',
              startDate: 'October 2022',
              tenure: '1 yr 11 mos',
              bio: 'Manages enterprise MDM configurations, Okta SSO provisioning, and hardware lifecycle deployment.',
              skills: ['Okta SSO', 'Jamf MDM', 'Endpoint Security', 'Hardware Logistics'],
              status: 'active',
            },
          ],
        },
      ],
    },
  ],
}

// Flatten tree helper to query any employee by ID
function flatten(node: EmployeeNode): EmployeeNode[] {
  const result: EmployeeNode[] = [node]
  if (node.children) {
    for (const child of node.children) {
      result.push(...flatten(child))
    }
  }
  return result
}

const allEmployees = computed(() => flatten(DEFAULT_ORG_DATA))

// State
const searchQuery = ref(props.initialSearch)
const selectedDepartment = ref(props.initialDepartment)
const selectedEmployeeId = ref(props.initialSelectedId)
const expandedIds = ref<Set<string>>(new Set(props.initialExpandedIds))
const isDrawerOpen = ref(props.initialDrawerOpen)
const zoomLevel = ref(100)
const emailCopied = ref(false)

const departmentCounts = computed(() => {
  return [
    { label: 'All', value: 'All', count: 148 },
    { label: 'Executive', value: 'Executive', count: 1 },
    { label: 'Engineering', value: 'Engineering', count: 64 },
    { label: 'Design', value: 'Design', count: 18 },
    { label: 'Product', value: 'Product', count: 22 },
    { label: 'Operations', value: 'Operations', count: 44 },
  ]
})

const selectedEmployee = computed(() => {
  return allEmployees.value.find((e) => e.id === selectedEmployeeId.value) || DEFAULT_ORG_DATA
})

// Search matching logic
const matchingEmployeeIds = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return new Set<string>()
  const matches = new Set<string>()
  for (const emp of allEmployees.value) {
    if (
      emp.name.toLowerCase().includes(q) ||
      emp.role.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.location.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.skills.some((s) => s.toLowerCase().includes(q))
    ) {
      matches.add(emp.id)
    }
  }
  return matches
})

// Auto-expand ancestors when search changes
watch(
  () => searchQuery.value,
  (q) => {
    if (q.trim()) {
      // Auto expand all nodes with children so matches are revealed
      const allParentIds = allEmployees.value.filter((e) => e.children && e.children.length > 0).map((e) => e.id)
      expandedIds.value = new Set(allParentIds)
    }
  },
)

function isExpanded(id: string): boolean {
  return expandedIds.value.has(id)
}

function toggleExpand(id: string) {
  const updated = new Set(expandedIds.value)
  if (updated.has(id)) {
    updated.delete(id)
  } else {
    updated.add(id)
  }
  expandedIds.value = updated
}

function expandAll() {
  const allParentIds = allEmployees.value.filter((e) => e.children && e.children.length > 0).map((e) => e.id)
  expandedIds.value = new Set(allParentIds)
}

function collapseAll() {
  expandedIds.value = new Set()
}

function selectEmployee(emp: EmployeeNode) {
  selectedEmployeeId.value = emp.id
  isDrawerOpen.value = true
}

function selectSelectedManager() {
  const manager = allEmployees.value.find((e) => e.id === selectedEmployee.value?.managerId)
  if (manager) selectEmployee(manager)
}

function selectAndExpandEmployee(emp: EmployeeNode) {
  selectedEmployeeId.value = emp.id
  isDrawerOpen.value = true
  // Also expand parent if needed
  if (emp.managerId) {
    const updated = new Set(expandedIds.value)
    updated.add(emp.managerId)
    expandedIds.value = updated
  }
}

function copyEmail(email: string) {
  navigator.clipboard.writeText(email)
  emailCopied.value = true
  setTimeout(() => {
    emailCopied.value = false
  }, 2000)
}

function adjustZoom(delta: number) {
  zoomLevel.value = Math.min(130, Math.max(70, zoomLevel.value + delta))
}

function resetZoom() {
  zoomLevel.value = 100
}

function getDeptBadgeClasses(dept: string): string {
  switch (dept) {
    case 'Executive':
      return 'border-indigo-200 bg-indigo-50/70 text-indigo-700 dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-300'
    case 'Engineering':
      return 'border-blue-200 bg-blue-50/70 text-blue-700 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-300'
    case 'Design':
      return 'border-pink-200 bg-pink-50/70 text-pink-700 dark:border-pink-800/60 dark:bg-pink-950/40 dark:text-pink-300'
    case 'Product':
      return 'border-purple-200 bg-purple-50/70 text-purple-700 dark:border-purple-800/60 dark:bg-purple-950/40 dark:text-purple-300'
    case 'Operations':
      return 'border-amber-200 bg-amber-50/70 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300'
    default:
      return 'border-border bg-muted text-muted-foreground'
  }
}

function getDeptTopStripClasses(dept: string): string {
  switch (dept) {
    case 'Executive':
      return 'bg-indigo-500'
    case 'Engineering':
      return 'bg-blue-500'
    case 'Design':
      return 'bg-pink-500'
    case 'Product':
      return 'bg-purple-500'
    case 'Operations':
      return 'bg-amber-500'
    default:
      return 'bg-muted-foreground'
  }
}

function isNodeDimmed(node: EmployeeNode): boolean {
  if (selectedDepartment.value !== 'All') {
    if (selectedDepartment.value === 'Executive' && node.department !== 'Executive') return true
    if (
      selectedDepartment.value === 'Engineering' &&
      node.department !== 'Engineering' &&
      node.department !== 'Executive'
    )
      return true
    if (selectedDepartment.value === 'Design' && node.department !== 'Design' && node.department !== 'Executive')
      return true
    if (selectedDepartment.value === 'Product' && node.department !== 'Product' && node.department !== 'Executive')
      return true
    if (
      selectedDepartment.value === 'Operations' &&
      node.department !== 'Operations' &&
      node.department !== 'Executive'
    )
      return true
  }

  if (searchQuery.value.trim().length > 0) {
    const isDirectMatch = matchingEmployeeIds.value.has(node.id)
    const hasMatchingDescendant = flatten(node).some((n) => matchingEmployeeIds.value.has(n.id))
    return !isDirectMatch && !hasMatchingDescendant
  }

  return false
}

function isNodeHighlighted(node: EmployeeNode): boolean {
  if (searchQuery.value.trim().length > 0) {
    return matchingEmployeeIds.value.has(node.id)
  }
  return false
}
</script>

<template>
  <div
    data-slot="employee-org-chart-tree"
    :class="cn('bg-background border-border flex flex-col rounded-xl border shadow-xs', props.class)"
  >
    <!-- Header Section -->
    <div class="border-border flex flex-col gap-4 border-b p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <Building2 class="size-4" />
          </div>
          <h2 class="text-foreground text-lg font-semibold tracking-tight">{{ props.title }}</h2>
        </div>
        <p class="text-muted-foreground mt-1 text-xs">
          {{ props.subtitle }}
        </p>
      </div>

      <!-- Header Action Controls -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Search input -->
        <div class="relative max-w-xs min-w-[220px]">
          <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
          <Input v-model="searchQuery" placeholder="Search employee, title, skill..." class="h-8 pr-7 pl-8 text-xs" />
          <button
            v-if="searchQuery"
            type="button"
            class="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
            aria-label="Clear search"
            @click="searchQuery = ''"
          >
            <X class="size-3.5" />
          </button>
        </div>

        <Separator orientation="vertical" class="hidden h-6 md:block" />

        <!-- Expand / Collapse All -->
        <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs" @click="expandAll">
          <Plus class="size-3.5" />
          <span>Expand All</span>
        </Button>

        <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs" @click="collapseAll">
          <Minus class="size-3.5" />
          <span>Collapse All</span>
        </Button>

        <!-- Profile Drawer Toggle Button -->
        <Button
          variant="outline"
          size="sm"
          :class="cn('h-8 gap-1.5 text-xs', isDrawerOpen && 'bg-accent text-accent-foreground')"
          @click="isDrawerOpen = !isDrawerOpen"
        >
          <User class="size-3.5" />
          <span>{{ isDrawerOpen ? 'Hide Profile' : 'View Profile' }}</span>
        </Button>
      </div>
    </div>

    <!-- Filter & Toolbar Bar -->
    <div class="border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
      <!-- Department Filter Pills -->
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="text-muted-foreground mr-1 text-xs font-medium">Department:</span>
        <button
          v-for="dept in departmentCounts"
          :key="dept.value"
          type="button"
          :class="
            cn(
              'focus-visible:ring-ring inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
              selectedDepartment === dept.value
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'bg-background hover:bg-muted text-muted-foreground border-border border',
            )
          "
          @click="selectedDepartment = dept.value"
        >
          <span>{{ dept.label }}</span>
          <span
            :class="
              cn(
                'py-0.2 rounded-full px-1.5 text-xs',
                selectedDepartment === dept.value
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )
            "
          >
            {{ dept.count }}
          </span>
        </button>
      </div>

      <!-- Zoom and Search Banner -->
      <div class="flex items-center gap-2">
        <div v-if="searchQuery.trim()" class="text-xs text-emerald-600 dark:text-emerald-400">
          Found {{ matchingEmployeeIds.size }} matching member{{ matchingEmployeeIds.size === 1 ? '' : 's' }}
        </div>

        <div class="bg-background border-border flex items-center rounded-lg border p-0.5 shadow-2xs">
          <Button
            variant="ghost"
            size="icon"
            class="size-6 text-xs"
            :disabled="zoomLevel <= 70"
            aria-label="Zoom out"
            @click="adjustZoom(-10)"
          >
            <ZoomOut class="size-3" />
          </Button>
          <span class="text-muted-foreground w-10 text-center text-xs font-medium">{{ zoomLevel }}%</span>
          <Button
            variant="ghost"
            size="icon"
            class="size-6 text-xs"
            :disabled="zoomLevel >= 130"
            aria-label="Zoom in"
            @click="adjustZoom(10)"
          >
            <ZoomIn class="size-3" />
          </Button>
          <Separator orientation="vertical" class="mx-0.5 h-3.5" />
          <Button variant="ghost" size="icon" class="size-6 text-xs" aria-label="Reset zoom" @click="resetZoom">
            <RotateCcw class="size-3" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Main Content: Canvas & Quick Info Drawer -->
    <div class="relative flex flex-1 flex-col lg:flex-row">
      <!-- Tree Hierarchy Node Canvas -->
      <div ref="canvasRef" class="bg-muted/10 relative flex-1 overflow-x-auto overflow-y-visible p-6 md:p-10">
        <div
          class="flex min-w-max flex-col items-center transition-transform duration-200"
          :style="{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }"
        >
          <!-- LEVEL 0: CEO Node -->
          <div class="flex flex-col items-center">
            <!-- CEO Card -->
            <div
              :class="
                cn(
                  'bg-card border-border hover:border-primary/50 relative w-72 cursor-pointer rounded-xl border text-left shadow-xs transition-all duration-200 hover:shadow-md',
                  selectedEmployeeId === DEFAULT_ORG_DATA.id && 'ring-primary border-primary bg-primary/[0.02] ring-2',
                  isNodeHighlighted(DEFAULT_ORG_DATA) &&
                    'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500 dark:bg-emerald-950/20',
                  isNodeDimmed(DEFAULT_ORG_DATA) && 'opacity-35 grayscale-[25%]',
                )
              "
              tabindex="0"
              role="button"
              :aria-label="`Select ${DEFAULT_ORG_DATA.name}`"
              @click="selectEmployee(DEFAULT_ORG_DATA)"
              @keydown.enter="selectEmployee(DEFAULT_ORG_DATA)"
              @keydown.space.prevent="selectEmployee(DEFAULT_ORG_DATA)"
            >
              <!-- Top department accent strip -->
              <div :class="cn('h-1 w-full rounded-t-xl', getDeptTopStripClasses(DEFAULT_ORG_DATA.department))" />

              <div class="space-y-3 p-4">
                <!-- Identity row -->
                <div class="flex items-start justify-between gap-2.5">
                  <div class="flex min-w-0 items-center gap-2.5">
                    <div class="relative">
                      <Avatar class="border-border ring-background size-11 border ring-1">
                        <AvatarImage :src="DEFAULT_ORG_DATA.avatar" :alt="DEFAULT_ORG_DATA.name" />
                        <AvatarFallback>{{ DEFAULT_ORG_DATA.initials }}</AvatarFallback>
                      </Avatar>
                      <span
                        class="ring-background absolute right-0 bottom-0 size-2.5 rounded-full bg-emerald-500 ring-2"
                      />
                    </div>
                    <div class="min-w-0">
                      <h3 class="text-foreground truncate text-sm font-semibold">{{ DEFAULT_ORG_DATA.name }}</h3>
                      <p class="text-muted-foreground truncate text-xs">{{ DEFAULT_ORG_DATA.role }}</p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    :class="cn('shrink-0 text-xs font-normal', getDeptBadgeClasses(DEFAULT_ORG_DATA.department))"
                  >
                    {{ DEFAULT_ORG_DATA.department }}
                  </Badge>
                </div>

                <!-- Contact & Location info -->
                <div class="text-muted-foreground space-y-1 text-xs">
                  <div class="flex items-center gap-1.5">
                    <MapPin class="size-3.5 shrink-0" />
                    <span class="truncate">{{ DEFAULT_ORG_DATA.location }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <Mail class="size-3.5 shrink-0" />
                    <span class="truncate">{{ DEFAULT_ORG_DATA.email }}</span>
                  </div>
                </div>

                <!-- Team Reports Count Pill -->
                <div class="bg-muted/60 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs">
                  <div class="text-foreground flex items-center gap-1.5 font-medium">
                    <Users class="text-muted-foreground size-3.5" />
                    <span>Direct reports: {{ DEFAULT_ORG_DATA.reportsCount }} VPs</span>
                  </div>
                  <span class="text-muted-foreground text-xs">{{ DEFAULT_ORG_DATA.teamHeadcount }} total org</span>
                </div>

                <!-- Expand/Collapse Button -->
                <Button
                  variant="ghost"
                  size="sm"
                  class="text-muted-foreground hover:text-foreground h-7 w-full justify-between text-xs font-medium"
                  @click.stop="toggleExpand(DEFAULT_ORG_DATA.id)"
                >
                  <span class="flex items-center gap-1.5">
                    <ChevronDown v-if="isExpanded(DEFAULT_ORG_DATA.id)" class="size-3.5" />
                    <ChevronRight v-else class="size-3.5" />
                    <span>{{
                      isExpanded(DEFAULT_ORG_DATA.id) ? 'Collapse Executive Team' : 'Expand Executive Team'
                    }}</span>
                  </span>
                  <span class="bg-muted rounded px-1.5 py-0.5 text-xs">{{
                    DEFAULT_ORG_DATA.children?.length || 0
                  }}</span>
                </Button>
              </div>
            </div>

            <!-- Connector stem down from CEO -->
            <div
              v-if="isExpanded(DEFAULT_ORG_DATA.id) && DEFAULT_ORG_DATA.children?.length"
              class="bg-border h-8 w-px"
            />

            <!-- LEVEL 1: VPs and Directors -->
            <div
              v-if="isExpanded(DEFAULT_ORG_DATA.id) && DEFAULT_ORG_DATA.children?.length"
              class="relative flex items-start gap-10 pt-0"
            >
              <!-- Horizontal branching rail connecting Level 1 nodes -->
              <div
                v-if="DEFAULT_ORG_DATA.children.length > 1"
                class="bg-border absolute top-0 right-[16.666%] left-[16.666%] h-px"
              />

              <!-- Iterate Level 1 VPs -->
              <div v-for="vp in DEFAULT_ORG_DATA.children" :key="vp.id" class="flex flex-col items-center">
                <!-- Top stem connecting rail to VP card -->
                <div class="bg-border h-8 w-px" />

                <!-- VP Node Card -->
                <div
                  :class="
                    cn(
                      'bg-card border-border hover:border-primary/50 relative w-72 cursor-pointer rounded-xl border text-left shadow-xs transition-all duration-200 hover:shadow-md',
                      selectedEmployeeId === vp.id && 'ring-primary border-primary bg-primary/[0.02] ring-2',
                      isNodeHighlighted(vp) &&
                        'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500 dark:bg-emerald-950/20',
                      isNodeDimmed(vp) && 'opacity-35 grayscale-[25%]',
                    )
                  "
                  tabindex="0"
                  role="button"
                  :aria-label="`Select ${vp.name}`"
                  @click="selectEmployee(vp)"
                  @keydown.enter="selectEmployee(vp)"
                  @keydown.space.prevent="selectEmployee(vp)"
                >
                  <div :class="cn('h-1 w-full rounded-t-xl', getDeptTopStripClasses(vp.department))" />

                  <div class="space-y-3 p-4">
                    <div class="flex items-start justify-between gap-2.5">
                      <div class="flex min-w-0 items-center gap-2.5">
                        <div class="relative">
                          <Avatar class="border-border ring-background size-10 border ring-1">
                            <AvatarImage :src="vp.avatar" :alt="vp.name" />
                            <AvatarFallback>{{ vp.initials }}</AvatarFallback>
                          </Avatar>
                          <span
                            class="ring-background absolute right-0 bottom-0 size-2.5 rounded-full bg-emerald-500 ring-2"
                          />
                        </div>
                        <div class="min-w-0">
                          <h4 class="text-foreground truncate text-sm font-semibold">{{ vp.name }}</h4>
                          <p class="text-muted-foreground truncate text-xs">{{ vp.role }}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        :class="cn('shrink-0 text-xs font-normal', getDeptBadgeClasses(vp.department))"
                      >
                        {{ vp.department }}
                      </Badge>
                    </div>

                    <div class="text-muted-foreground space-y-1 text-xs">
                      <div class="flex items-center gap-1.5">
                        <MapPin class="size-3.5 shrink-0" />
                        <span class="truncate">{{ vp.location }}</span>
                      </div>
                      <div class="flex items-center gap-1.5">
                        <Mail class="size-3.5 shrink-0" />
                        <span class="truncate">{{ vp.email }}</span>
                      </div>
                    </div>

                    <!-- Direct Reports Count Pill -->
                    <div class="bg-muted/60 flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs">
                      <div class="text-foreground flex items-center gap-1.5 font-medium">
                        <Users class="text-muted-foreground size-3.5" />
                        <span>Direct reports: {{ vp.reportsCount }} teams</span>
                      </div>
                      <span class="text-muted-foreground text-xs">{{ vp.teamHeadcount }} staff</span>
                    </div>

                    <!-- Expand/Collapse Button -->
                    <Button
                      v-if="vp.children?.length"
                      variant="ghost"
                      size="sm"
                      class="text-muted-foreground hover:text-foreground h-7 w-full justify-between text-xs font-medium"
                      @click.stop="toggleExpand(vp.id)"
                    >
                      <span class="flex items-center gap-1.5">
                        <ChevronDown v-if="isExpanded(vp.id)" class="size-3.5" />
                        <ChevronRight v-else class="size-3.5" />
                        <span>{{
                          isExpanded(vp.id) ? 'Collapse Branch' : `Expand (${vp.children.length} Leads)`
                        }}</span>
                      </span>
                      <span class="bg-muted rounded px-1.5 py-0.5 text-xs">{{ vp.children.length }}</span>
                    </Button>
                  </div>
                </div>

                <!-- Connector down from VP -->
                <div v-if="isExpanded(vp.id) && vp.children?.length" class="bg-border h-8 w-px" />

                <!-- LEVEL 2: Staff Leads & Managers -->
                <div v-if="isExpanded(vp.id) && vp.children?.length" class="relative flex items-start gap-6 pt-0">
                  <!-- Horizontal rail for Level 2 nodes -->
                  <div
                    v-if="vp.children.length === 3"
                    class="bg-border absolute top-0 right-[16.666%] left-[16.666%] h-px"
                  />
                  <div
                    v-else-if="vp.children.length === 2"
                    class="bg-border absolute top-0 right-[25%] left-[25%] h-px"
                  />

                  <!-- Iterate Level 2 Leads -->
                  <div v-for="lead in vp.children" :key="lead.id" class="flex flex-col items-center">
                    <!-- Stem from rail to lead card -->
                    <div class="bg-border h-8 w-px" />

                    <!-- Lead Node Card -->
                    <div
                      :class="
                        cn(
                          'bg-card border-border hover:border-primary/50 relative w-64 cursor-pointer rounded-xl border text-left shadow-xs transition-all duration-200 hover:shadow-md',
                          selectedEmployeeId === lead.id && 'ring-primary border-primary bg-primary/[0.02] ring-2',
                          isNodeHighlighted(lead) &&
                            'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500 dark:bg-emerald-950/20',
                          isNodeDimmed(lead) && 'opacity-35 grayscale-[25%]',
                        )
                      "
                      tabindex="0"
                      role="button"
                      :aria-label="`Select ${lead.name}`"
                      @click="selectEmployee(lead)"
                      @keydown.enter="selectEmployee(lead)"
                      @keydown.space.prevent="selectEmployee(lead)"
                    >
                      <div :class="cn('h-1 w-full rounded-t-xl', getDeptTopStripClasses(lead.department))" />

                      <div class="space-y-2.5 p-3.5">
                        <div class="flex items-start justify-between gap-2">
                          <div class="flex min-w-0 items-center gap-2">
                            <div class="relative">
                              <Avatar class="border-border ring-background size-9 border ring-1">
                                <AvatarImage :src="lead.avatar" :alt="lead.name" />
                                <AvatarFallback>{{ lead.initials }}</AvatarFallback>
                              </Avatar>
                              <span
                                class="ring-background absolute right-0 bottom-0 size-2 rounded-full bg-emerald-500 ring-2"
                              />
                            </div>
                            <div class="min-w-0">
                              <h5 class="text-foreground truncate text-xs font-semibold">{{ lead.name }}</h5>
                              <p class="text-muted-foreground truncate text-xs">{{ lead.role }}</p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            :class="
                              cn('shrink-0 px-1.5 py-0 text-xs font-normal', getDeptBadgeClasses(lead.department))
                            "
                          >
                            {{ lead.department }}
                          </Badge>
                        </div>

                        <div class="text-muted-foreground space-y-1 text-xs">
                          <div class="flex items-center gap-1.5">
                            <MapPin class="size-3.5 shrink-0" />
                            <span class="truncate">{{ lead.location }}</span>
                          </div>
                          <div class="flex items-center gap-1.5">
                            <Mail class="size-3.5 shrink-0" />
                            <span class="truncate">{{ lead.email }}</span>
                          </div>
                        </div>

                        <!-- Team Headcount -->
                        <div class="bg-muted/60 flex items-center justify-between rounded-lg px-2 py-1 text-xs">
                          <div class="text-foreground flex items-center gap-1 font-medium">
                            <Users class="text-muted-foreground size-3" />
                            <span>{{ lead.reportsCount }} reports</span>
                          </div>
                          <span class="text-muted-foreground text-xs">{{ lead.teamHeadcount }} members</span>
                        </div>

                        <!-- Expand/Collapse Level 3 -->
                        <Button
                          v-if="lead.children?.length"
                          variant="ghost"
                          size="sm"
                          class="text-muted-foreground hover:text-foreground h-6 w-full justify-between text-xs font-medium"
                          @click.stop="toggleExpand(lead.id)"
                        >
                          <span class="flex items-center gap-1">
                            <ChevronDown v-if="isExpanded(lead.id)" class="size-3" />
                            <ChevronRight v-else class="size-3" />
                            <span>{{ isExpanded(lead.id) ? 'Collapse' : `Team (${lead.children.length})` }}</span>
                          </span>
                          <span class="bg-muted rounded px-1 text-xs">{{ lead.children.length }}</span>
                        </Button>
                      </div>
                    </div>

                    <!-- Connector down from Lead -->
                    <div v-if="isExpanded(lead.id) && lead.children?.length" class="bg-border h-8 w-px" />

                    <!-- LEVEL 3: Team ICs / Senior Contributors -->
                    <div
                      v-if="isExpanded(lead.id) && lead.children?.length"
                      class="relative flex items-start gap-4 pt-0"
                    >
                      <!-- Horizontal rail for Level 3 -->
                      <div
                        v-if="lead.children.length === 2"
                        class="bg-border absolute top-0 right-[25%] left-[25%] h-px"
                      />

                      <!-- Iterate Level 3 ICs -->
                      <div v-for="ic in lead.children" :key="ic.id" class="flex flex-col items-center">
                        <div class="bg-border h-8 w-px" />

                        <!-- IC Card -->
                        <div
                          :class="
                            cn(
                              'bg-card border-border hover:border-primary/50 relative w-56 cursor-pointer rounded-xl border text-left shadow-2xs transition-all duration-200 hover:shadow-xs',
                              selectedEmployeeId === ic.id && 'ring-primary border-primary bg-primary/[0.02] ring-2',
                              isNodeHighlighted(ic) &&
                                'border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500 dark:bg-emerald-950/20',
                              isNodeDimmed(ic) && 'opacity-35 grayscale-[25%]',
                            )
                          "
                          tabindex="0"
                          role="button"
                          :aria-label="`Select ${ic.name}`"
                          @click="selectEmployee(ic)"
                          @keydown.enter="selectEmployee(ic)"
                          @keydown.space.prevent="selectEmployee(ic)"
                        >
                          <div :class="cn('h-1 w-full rounded-t-xl', getDeptTopStripClasses(ic.department))" />

                          <div class="space-y-2 p-3">
                            <div class="flex items-center gap-2">
                              <Avatar class="border-border size-8 border">
                                <AvatarImage :src="ic.avatar" :alt="ic.name" />
                                <AvatarFallback>{{ ic.initials }}</AvatarFallback>
                              </Avatar>
                              <div class="min-w-0">
                                <h6 class="text-foreground truncate text-xs font-semibold">{{ ic.name }}</h6>
                                <p class="text-muted-foreground truncate text-xs">{{ ic.role }}</p>
                              </div>
                            </div>

                            <div class="text-muted-foreground flex items-center justify-between text-xs">
                              <span class="truncate">{{ ic.location }}</span>
                              <Badge variant="outline" class="px-1 py-0 text-xs"> IC </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Employee Quick Info Drawer / Inspector Panel -->
      <div
        v-if="isDrawerOpen"
        class="border-border bg-card flex w-full shrink-0 flex-col border-t lg:w-96 lg:border-t-0 lg:border-l"
      >
        <!-- Drawer Header -->
        <div class="border-border flex items-center justify-between border-b p-4">
          <div class="flex items-center gap-2">
            <User class="text-primary size-4" />
            <h3 class="text-foreground text-sm font-semibold">Employee Profile</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            class="size-7"
            aria-label="Close profile drawer"
            @click="isDrawerOpen = false"
          >
            <X class="size-4" />
          </Button>
        </div>

        <!-- Drawer Body -->
        <div class="max-h-[700px] flex-1 space-y-5 overflow-y-auto p-5">
          <!-- Profile Identity Header -->
          <div class="flex items-start gap-3.5">
            <div class="relative">
              <Avatar class="border-border ring-background size-14 border ring-2">
                <AvatarImage :src="selectedEmployee.avatar" :alt="selectedEmployee.name" />
                <AvatarFallback>{{ selectedEmployee.initials }}</AvatarFallback>
              </Avatar>
              <span class="ring-background absolute right-0 bottom-0 size-3 rounded-full bg-emerald-500 ring-2" />
            </div>
            <div class="min-w-0 flex-1">
              <h4 class="text-foreground text-base font-semibold tracking-tight">{{ selectedEmployee.name }}</h4>
              <p class="text-muted-foreground text-xs">{{ selectedEmployee.role }}</p>
              <div class="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge
                  variant="outline"
                  :class="cn('text-xs font-medium', getDeptBadgeClasses(selectedEmployee.department))"
                >
                  {{ selectedEmployee.department }}
                </Badge>
                <Badge variant="secondary" class="text-xs font-normal"> Active · Full-time </Badge>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button as-child variant="outline" size="sm" class="h-8 gap-1.5 text-xs">
              <a :href="`mailto:${selectedEmployee.email}`">
                <Mail class="size-3.5" />
                <span>Send Email</span>
              </a>
            </Button>
            <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs" @click="copyEmail(selectedEmployee.email)">
              <Check v-if="emailCopied" class="size-3.5 text-emerald-500" />
              <Copy v-else class="size-3.5" />
              <span>{{ emailCopied ? 'Copied!' : 'Copy Email' }}</span>
            </Button>
          </div>

          <Separator />

          <!-- Bio / Leadership Scope -->
          <div class="space-y-1.5">
            <h5 class="text-foreground text-xs font-semibold tracking-wide uppercase">About & Focus</h5>
            <p class="text-muted-foreground text-xs leading-relaxed">
              {{ selectedEmployee.bio }}
            </p>
          </div>

          <!-- Key Details Grid -->
          <div class="space-y-1.5">
            <h5 class="text-foreground text-xs font-semibold tracking-wide uppercase">Overview Details</h5>
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div class="bg-muted/40 border-border/60 rounded-lg border p-2.5">
                <div class="text-muted-foreground flex items-center gap-1 text-xs">
                  <Users class="size-3" />
                  <span>Team Scope</span>
                </div>
                <p class="text-foreground mt-1 text-xs font-semibold">{{ selectedEmployee.teamHeadcount }} Members</p>
              </div>

              <div class="bg-muted/40 border-border/60 rounded-lg border p-2.5">
                <div class="text-muted-foreground flex items-center gap-1 text-xs">
                  <MapPin class="size-3" />
                  <span>Location</span>
                </div>
                <p class="text-foreground mt-1 truncate text-xs font-semibold">
                  {{ selectedEmployee.location }}
                </p>
              </div>

              <div class="bg-muted/40 border-border/60 rounded-lg border p-2.5">
                <div class="text-muted-foreground flex items-center gap-1 text-xs">
                  <Calendar class="size-3" />
                  <span>Tenure</span>
                </div>
                <p class="text-foreground mt-1 text-xs font-semibold">
                  {{ selectedEmployee.tenure }}
                </p>
              </div>

              <div class="bg-muted/40 border-border/60 rounded-lg border p-2.5">
                <div class="text-muted-foreground flex items-center gap-1 text-xs">
                  <Briefcase class="size-3" />
                  <span>Phone</span>
                </div>
                <p class="text-foreground mt-1 truncate text-xs font-semibold">
                  {{ selectedEmployee.phone }}
                </p>
              </div>
            </div>
          </div>

          <!-- Reporting Manager Context (if applicable) -->
          <div v-if="selectedEmployee.managerName" class="space-y-1.5">
            <h5 class="text-foreground text-xs font-semibold tracking-wide uppercase">Reports To</h5>
            <div class="border-border/80 bg-muted/20 flex items-center justify-between rounded-lg border p-2.5">
              <div class="min-w-0">
                <p class="text-foreground text-xs font-medium">{{ selectedEmployee.managerName }}</p>
                <p class="text-muted-foreground text-xs">{{ selectedEmployee.managerRole }}</p>
              </div>
              <Button variant="ghost" size="sm" class="h-7 gap-1 text-xs" @click="selectSelectedManager">
                <span>View</span>
                <ArrowRight class="size-3" />
              </Button>
            </div>
          </div>

          <!-- Direct Reports Roster (if has children) -->
          <div v-if="selectedEmployee.children?.length" class="space-y-2">
            <div class="flex items-center justify-between">
              <h5 class="text-foreground text-xs font-semibold tracking-wide uppercase">
                Direct Reports ({{ selectedEmployee.children.length }})
              </h5>
              <span class="text-muted-foreground text-xs font-medium"
                >{{ selectedEmployee.reportsCount }} reporting teams</span
              >
            </div>

            <div class="space-y-1.5">
              <div
                v-for="sub in selectedEmployee.children"
                :key="sub.id"
                class="border-border/60 bg-muted/20 hover:bg-muted/40 flex cursor-pointer items-center justify-between rounded-lg border p-2 transition-colors"
                @click="selectAndExpandEmployee(sub)"
              >
                <div class="flex min-w-0 items-center gap-2">
                  <Avatar class="border-border size-7 border">
                    <AvatarImage :src="sub.avatar" :alt="sub.name" />
                    <AvatarFallback>{{ sub.initials }}</AvatarFallback>
                  </Avatar>
                  <div class="min-w-0">
                    <p class="text-foreground truncate text-xs font-medium">{{ sub.name }}</p>
                    <p class="text-muted-foreground truncate text-xs">{{ sub.role }}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  :class="cn('shrink-0 px-1.5 py-0 text-xs', getDeptBadgeClasses(sub.department))"
                >
                  {{ sub.teamHeadcount }} staff
                </Badge>
              </div>
            </div>
          </div>

          <!-- Skills & Competencies -->
          <div class="space-y-1.5">
            <h5 class="text-foreground text-xs font-semibold tracking-wide uppercase">Core Competencies</h5>
            <div class="flex flex-wrap gap-1.5">
              <Badge
                v-for="skill in selectedEmployee.skills"
                :key="skill"
                variant="secondary"
                class="text-xs font-normal"
              >
                {{ skill }}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
