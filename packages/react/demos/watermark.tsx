import Story from '../../components/story/Story'
import { Watermark } from '@react-registry/watermark'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@react-registry/card'
import { Button } from '@react-registry/button'

const reportText =
  'Q3 revenue grew 18% YoY, driven by enterprise expansion and a 32% increase in self-serve signups. Net retention reached 118%, with three of the top five accounts expanding their seat count beyond the 500-user threshold.'

export default function WatermarkDemo() {
  return (
    <>
      <Story
        title="Confidential document"
        description="A diagonal CONFIDENTIAL stamp deters screenshots of sensitive internal reports."
      >
        <Watermark content="CONFIDENTIAL" opacity={0.12} className="rounded-lg border p-6">
          <p className="text-sm leading-relaxed">{reportText}</p>
        </Watermark>
      </Story>

      <Story title="Draft card" description="Mark work-in-progress content so reviewers know it is not final.">
        <Watermark content="DRAFT" rotate={-30} opacity={0.15} fontSize={20} fontWeight={700}>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Onboarding flow v2</CardTitle>
              <CardDescription>Subject to review — do not share externally.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>1. Welcome screen with product tour</p>
              <p>2. Workspace setup (3 steps)</p>
              <p>3. Invite teammates</p>
            </CardContent>
          </Card>
        </Watermark>
      </Story>

      <Story
        title="Internal report"
        description="A subtle INTERNAL mark across a financial summary — visible enough to signal scope, quiet enough to read past."
      >
        <Watermark content="INTERNAL" opacity={0.08} rotate={-22} gap={140}>
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Quarterly Report</CardTitle>
              <CardDescription>FY2024 Q3 — Leadership review</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Revenue</span>
                <span className="tabular-nums">$1,240,000</span>
              </div>
              <div className="flex justify-between">
                <span>Expenses</span>
                <span className="tabular-nums">$890,000</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Net profit</span>
                <span className="tabular-nums">$350,000</span>
              </div>
            </CardContent>
          </Card>
        </Watermark>
      </Story>

      <Story
        title="Angle & density variants"
        description="Horizontal (0°), default (-22°), and steep (-45°) at three gap settings — pick the tiling that fits your content."
      >
        <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
          <Watermark content="UIPKGE" rotate={0} gap={80} className="rounded-lg border p-4">
            <p className="text-muted-foreground text-xs">0° · gap 80</p>
          </Watermark>
          <Watermark content="UIPKGE" rotate={-22} gap={100} className="rounded-lg border p-4">
            <p className="text-muted-foreground text-xs">-22° · gap 100</p>
          </Watermark>
          <Watermark content="UIPKGE" rotate={-45} gap={120} className="rounded-lg border p-4">
            <p className="text-muted-foreground text-xs">-45° · gap 120</p>
          </Watermark>
        </div>
      </Story>

      <Story
        title="Opacity & color"
        description="From barely-there (0.04) to prominent (0.2), with a branded blue accent for marketing assets."
      >
        <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
          <Watermark content="SAMPLE" opacity={0.04} className="rounded-lg border p-4">
            <p className="text-muted-foreground text-xs">opacity 0.04</p>
          </Watermark>
          <Watermark content="SAMPLE" opacity={0.12} className="rounded-lg border p-4">
            <p className="text-muted-foreground text-xs">opacity 0.12</p>
          </Watermark>
          <Watermark content="SAMPLE" opacity={0.2} color="#3b82f6" className="rounded-lg border p-4">
            <p className="text-muted-foreground text-xs">blue · 0.2</p>
          </Watermark>
        </div>
      </Story>

      <Story
        title="Interactive overlay"
        description="interactive=true captures pointer events, locking the content behind the watermark — useful for preview-only views."
      >
        <Watermark
          content="PREVIEW ONLY"
          interactive={true}
          opacity={0.15}
          rotate={-20}
          fontSize={18}
          className="rounded-lg border p-6"
        >
          <Button variant="outline" size="sm">
            Try clicking — blocked
          </Button>
        </Watermark>
      </Story>

      <Story
        title="Image watermark"
        description="Pass an image URL to tile a logo or avatar across the content instead of text."
      >
        <Watermark
          image="https://unavatar.io/twitter/shadcn"
          gap={120}
          opacity={0.3}
          rotate={-15}
          className="rounded-lg border p-8"
        >
          <p className="text-sm">Branded content with a repeating avatar watermark.</p>
        </Watermark>
      </Story>
    </>
  )
}
