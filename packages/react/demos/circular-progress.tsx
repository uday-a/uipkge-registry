import { useEffect, useState } from 'react'
import Story from '../../components/story/Story'
import { CircularProgress } from '@react-registry/circular-progress'
import { Card, CardContent, CardHeader, CardTitle } from '@react-registry/card'
import { Check, Upload, Loader2 } from 'lucide-react'

export default function CircularProgressDemo() {
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setUploadProgress((v) => (v >= 100 ? 0 : v + 4))
    }, 400)
    return () => window.clearInterval(id)
  }, [])

  return (
    <>
      <Story
        title="Dashboard stat card"
        description="A KPI tile in a metrics dashboard — the ring makes the headline number scannable at a glance."
      >
        <div className="grid max-w-md grid-cols-2 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <CircularProgress value={78} size="lg" showValue />
              <div>
                <p className="text-2xl font-semibold tabular-nums">78%</p>
                <p className="text-muted-foreground text-xs">Monthly target</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <CircularProgress value={42} size="lg" color="#3b82f6" trackColor="#dbeafe" showValue />
              <div>
                <p className="text-2xl font-semibold tabular-nums">42%</p>
                <p className="text-muted-foreground text-xs">Quarterly goal</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Story>

      <Story
        title="File upload progress"
        description="A live upload indicator — the ring fills as bytes transfer, then swaps to a check on completion."
      >
        <Card className="max-w-md">
          <CardContent className="flex items-center gap-4 p-5">
            <CircularProgress value={uploadProgress} size="lg" color={uploadProgress >= 100 ? '#22c55e' : undefined}>
              {uploadProgress >= 100 ? (
                <Check className="size-7 text-emerald-500" />
              ) : (
                <Loader2 className="text-muted-foreground size-6 animate-spin" />
              )}
            </CircularProgress>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Upload className="text-muted-foreground size-4" />
                <p className="truncate text-sm font-medium">quarterly-report.xlsx</p>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {uploadProgress >= 100 ? 'Upload complete' : `Uploading… ${uploadProgress}%`}
              </p>
            </div>
          </CardContent>
        </Card>
      </Story>

      <Story
        title="Size variants"
        description="sm (40px), default (56px), and lg (80px) — pick the size that fits the surrounding density."
      >
        <div className="flex items-end gap-8">
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={60} size="sm" showValue />
            <span className="text-muted-foreground text-xs">sm</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={60} size="default" showValue />
            <span className="text-muted-foreground text-xs">default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={60} size="lg" showValue />
            <span className="text-muted-foreground text-xs">lg</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={60} size={120} thickness={12} showValue />
            <span className="text-muted-foreground text-xs">custom 120px</span>
          </div>
        </div>
      </Story>

      <Story
        title="Status colors"
        description="Color the arc to match the outcome — green for success, red for warning, blue for info."
      >
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={100} color="#22c55e" trackColor="#dcfce7" showValue />
            <span className="text-muted-foreground text-xs">Complete</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={35} color="#ef4444" trackColor="#fee2e2" showValue />
            <span className="text-muted-foreground text-xs">At risk</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CircularProgress value={65} color="#3b82f6" trackColor="#dbeafe" showValue />
            <span className="text-muted-foreground text-xs">In progress</span>
          </div>
        </div>
      </Story>

      <Story
        title="Indeterminate spinner"
        description="When the total is unknown, indeterminate mode spins a partial arc — useful while waiting on a server."
      >
        <div className="flex items-center gap-8">
          <CircularProgress indeterminate size="sm" />
          <CircularProgress indeterminate size="default" />
          <CircularProgress indeterminate size="lg" />
        </div>
      </Story>

      <Story
        title="Task checklist"
        description="Use the default slot to render a fraction label instead of a percentage — great for step counters."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-base">Onboarding progress</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-5">
            <CircularProgress value={67} size="lg">
              <span className="text-foreground text-sm font-semibold tabular-nums">4/6</span>
            </CircularProgress>
            <ul className="text-muted-foreground flex-1 space-y-1.5 text-sm">
              <li className="text-foreground flex items-center gap-2">
                <Check className="size-4 text-emerald-500" /> Create account
              </li>
              <li className="text-foreground flex items-center gap-2">
                <Check className="size-4 text-emerald-500" /> Verify email
              </li>
              <li className="text-foreground flex items-center gap-2">
                <Check className="size-4 text-emerald-500" /> Set up workspace
              </li>
              <li className="text-foreground flex items-center gap-2">
                <Check className="size-4 text-emerald-500" /> Invite teammates
              </li>
              <li>Connect calendar</li>
              <li>Complete profile</li>
            </ul>
          </CardContent>
        </Card>
      </Story>
    </>
  )
}
