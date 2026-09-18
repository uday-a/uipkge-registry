import Story from '../../components/story/Story'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@react-registry/card'
import { Badge } from '@react-registry/badge'
import { Button } from '@react-registry/button'
import { ArrowUpRight, Check } from 'lucide-react'

export default function CardDemo() {
  return (
    <>
      <Story title="Simple" description="Header (title + description) plus content.">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Simple card</CardTitle>
            <CardDescription>A basic Card with header and content.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              Cards group related content. They include headers, content, and footers — each as separate slots.
            </p>
          </CardContent>
        </Card>
      </Story>

      <Story title="With footer actions" description="CardFooter slot for save/cancel patterns.">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Edit profile</CardTitle>
            <CardDescription>Update your account details.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Form fields go here.</p>
          </CardContent>
          <CardFooter className="gap-2 border-t pt-4">
            <Button size="sm">Save</Button>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </Story>

      <Story title="With header action" description="Secondary action in the top-right corner.">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Recent activity</CardTitle>
                <CardDescription>Last 7 days.</CardDescription>
              </div>
              <Button variant="ghost" size="icon-sm" className="-mt-1 -mr-2">
                <ArrowUpRight className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">No new activity.</p>
          </CardContent>
        </Card>
      </Story>

      <Story
        title="Pricing card"
        description="Highlighted with border-primary. Badge in the header denotes recommendation."
      >
        <Card className="border-primary max-w-sm">
          <CardHeader>
            <Badge className="w-fit">Recommended</Badge>
            <CardTitle className="mt-2">Pro plan</CardTitle>
            <CardDescription>$24 / month, billed annually.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="flex gap-2">
              <Check className="size-4 text-emerald-500" /> Unlimited projects
            </p>
            <p className="flex gap-2">
              <Check className="size-4 text-emerald-500" /> Priority support
            </p>
            <p className="flex gap-2">
              <Check className="size-4 text-emerald-500" /> Custom themes
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Choose Pro</Button>
          </CardFooter>
        </Card>
      </Story>
    </>
  )
}
