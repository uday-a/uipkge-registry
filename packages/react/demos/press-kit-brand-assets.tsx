import Story from '../../components/story/Story'
import {
  PressKitBrandAssets,
  type BrandColor,
  type Executive,
  type LogoAsset,
} from '@react-registry-blocks/press-kit-brand-assets/PressKitBrandAssets'

const customColors: BrandColor[] = [
  {
    id: 'cyber-violet',
    name: 'Cyber Violet',
    hex: '#8B5CF6',
    oklch: 'oklch(0.627 0.265 303.90)',
    rgb: 'rgb(139, 92, 246)',
    role: 'Primary Brand Identifier',
    contrast: 'WCAG AAA 6.2:1',
    usage: 'Core brand identifier for hero CTA buttons, active state badges, and primary key visuals.',
    bgClass: 'bg-[#8B5CF6]',
    textDark: true,
  },
  {
    id: 'obsidian-black',
    name: 'Obsidian Black',
    hex: '#09090B',
    oklch: 'oklch(0.145 0.005 285.82)',
    rgb: 'rgb(9, 9, 11)',
    role: 'High Contrast Neutral Surface',
    contrast: 'WCAG AAA 18.4:1',
    usage: 'Dark mode base canvas, command bar backdrops, and high-density typography.',
    bgClass: 'bg-[#09090B]',
    textDark: false,
  },
  {
    id: 'electric-cyan',
    name: 'Electric Cyan',
    hex: '#06B6D4',
    oklch: 'oklch(0.715 0.143 221.72)',
    rgb: 'rgb(6, 182, 212)',
    role: 'Interactive Highlight Accent',
    contrast: 'WCAG AA 4.9:1',
    usage: 'Secondary interactive indicators, focus glow boundaries, and real-time status pulses.',
    bgClass: 'bg-[#06B6D4]',
    textDark: true,
  },
  {
    id: 'cloud-white',
    name: 'Cloud White',
    hex: '#FAFAFA',
    oklch: 'oklch(0.985 0.002 106.42)',
    rgb: 'rgb(250, 250, 250)',
    role: 'Light Mode Canvas Fill',
    contrast: 'WCAG AAA 20.1:1',
    usage: 'Standard light background fill, elevated card surfaces, and pristine sheet backdrops.',
    bgClass: 'bg-[#FAFAFA]',
    textDark: true,
  },
  {
    id: 'neon-coral',
    name: 'Neon Coral',
    hex: '#F43F5E',
    oklch: 'oklch(0.645 0.246 16.44)',
    rgb: 'rgb(244, 63, 94)',
    role: 'Live Alert & Spotlight Pill',
    contrast: 'WCAG AAA 7.1:1',
    usage: 'High-priority notification badges, live broadcast indicators, and attention banners.',
    bgClass: 'bg-[#F43F5E]',
    textDark: true,
  },
]

const customExecutives: Executive[] = [
  {
    id: 'sarah-chen',
    name: 'Dr. Sarah Chen',
    role: 'Chief Executive Officer & Founder',
    bio: 'Pioneered zero-latency distributed compilation algorithms. Former AI Research Fellow at Stanford. Leading Aether’s mission to unify cloud development environments.',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop',
    initials: 'SC',
    fileSize: '14.2 MB',
    dimensions: '4200 × 5200 px · 300 DPI',
    topics: ['Distributed Systems', 'Edge AI Acceleration', 'Developer Productivity'],
    socials: [
      { platform: 'x', url: 'https://x.com/sarahchen' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/sarahchen' },
      { platform: 'github', url: 'https://github.com/sarahchen' },
    ],
  },
  {
    id: 'alex-kovacs',
    name: 'Alex Kovacs',
    role: 'Head of Product & Design Systems',
    bio: 'Former Design Director at Stripe. Creator of open design token standards used by over 50,000 engineers globally.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    initials: 'AK',
    fileSize: '10.5 MB',
    dimensions: '4000 × 5000 px · 300 DPI',
    topics: ['Design Systems', 'Micro-Interactions', 'Web Typography'],
    socials: [
      { platform: 'x', url: 'https://x.com/alexkovacs' },
      { platform: 'linkedin', url: 'https://linkedin.com/in/alexkovacs' },
      { platform: 'github', url: 'https://github.com/alexkovacs' },
    ],
  },
]

const singleLogo: LogoAsset[] = [
  {
    id: 'horizontal-primary',
    title: 'Primary Horizontal Logo',
    category: 'Full Wordmark',
    description: 'The standard lockup combining the faceted block logomark with horizontal typography and .dev badge.',
    dimensions: '3840 × 1080 px',
    bestFor: 'Light surfaces, navigation bars, marketing hero headers, and pitch decks.',
    theme: 'light',
    formats: [
      { label: 'Vector SVG', ext: 'svg', size: '14 KB' },
      { label: '4K PNG (Alpha)', ext: 'png', size: '280 KB' },
      { label: 'Modern WebP', ext: 'webp', size: '94 KB' },
    ],
  },
]

export default function PressKitBrandAssetsDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Full press kit hub featuring vector logo downloads, OKLCH color token swatches, executive media headshots, and media relations contact card."
      >
        <PressKitBrandAssets />
      </Story>

      <Story
        title="Custom Company Brand"
        description="Customized for an enterprise cloud platform with tailored titles, custom OKLCH tokens, and executive spokespersons."
      >
        <PressKitBrandAssets
          companyName="Aether Cloud"
          title="Aether Cloud Press Kit & Brand Assets"
          subtitle="Official media resources, high-resolution vector logos, executive profiles, and press inquiries hub."
          version="v3.1"
          lastUpdated="September 2026"
          pressEmail="press@aethercloud.io"
          pressKitZipSize="64 MB"
          factSheetPdfSize="3.8 MB"
          boilerplateText="Aether Cloud is the high-performance edge compute platform powering real-time AI and collaborative applications for modern engineering teams."
          colors={customColors}
          executives={customExecutives}
        />
      </Story>

      <Story
        title="Logos & Vector Downloads"
        description="Official logo variants with transparent and contrast backdrops, dimension badges, and multi-format download actions."
      >
        <PressKitBrandAssets colors={[]} executives={[]} />
      </Story>

      <Story
        title="Color Palette Swatches"
        description="Interactive color swatches with one-click Hex and OKLCH clipboard copy buttons and accessibility contrast ratios."
      >
        <PressKitBrandAssets logos={[]} executives={[]} />
      </Story>

      <Story
        title="Executive Leadership"
        description="Executive leadership headshots with 300 DPI print downloads, speaking topics, and official biographical notes."
      >
        <PressKitBrandAssets logos={[]} colors={[]} />
      </Story>

      <Story
        title="Press Contact & Media Desk"
        description="Dedicated press desk card with response SLA, boilerplate copy, and PDF company factsheet download."
      >
        <PressKitBrandAssets logos={[]} colors={[]} executives={[]} />
      </Story>

      <Story
        title="Single Logo Asset"
        description="Minimal layout showing a single primary brand logo with format options."
      >
        <PressKitBrandAssets logos={singleLogo} colors={[]} executives={[]} />
      </Story>

      <Story
        title="Editorial Dark Container"
        description="Rendered inside a dark surface container verifying contrast layering and token discipline."
      >
        <div className="rounded-xl bg-zinc-950 p-6 text-zinc-100">
          <PressKitBrandAssets />
        </div>
      </Story>
    </>
  )
}
