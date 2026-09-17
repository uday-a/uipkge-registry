import Story from '../../components/story/Story'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@react-registry/breadcrumb'
import { Button } from '@react-registry/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@react-registry/card'
import { Page, PageBody, PageHeader, PageHeaderHeading } from '@react-registry/page'
import { Download, Filter, Plus } from 'lucide-react'

export default function PageDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Page layout with a header (title, description, action slot) and a card body region."
      >
        <Page>
          <PageHeader
            actions={
              <>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button size="sm">Save</Button>
              </>
            }
          >
            <PageHeaderHeading
              title="Page header"
              description="Page is the root layout for app screens. PageHeader stacks title + actions."
            />
          </PageHeader>

          <PageBody>
            <Card>
              <CardContent className="text-muted-foreground py-8 text-center text-sm">
                Page body content goes here. Use SectionCard, blocks, or your own grid layout below the header.
              </CardContent>
            </Card>
          </PageBody>
        </Page>
      </Story>

      <Story
        title="Multiple actions"
        description="Header actions slot accepts any number of buttons — filter, export, and primary CTA."
      >
        <Page>
          <PageHeader
            actions={
              <>
                <Button variant="outline" size="sm">
                  <Filter className="size-4" aria-hidden="true" /> Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="size-4" aria-hidden="true" /> Export
                </Button>
                <Button size="sm">
                  <Plus className="size-4" aria-hidden="true" /> New report
                </Button>
              </>
            }
          >
            <PageHeaderHeading title="Reports" description="Sales performance across all channels." />
          </PageHeader>

          <PageBody>
            <Card>
              <CardContent className="text-muted-foreground py-8 text-center text-sm">
                {' '}
                Reports table goes here.{' '}
              </CardContent>
            </Card>
          </PageBody>
        </Page>
      </Story>

      <Story title="Body with grid" description="PageBody is a plain region — drop your own grid of cards inside.">
        <Page>
          <PageHeader>
            <PageHeaderHeading title="Dashboard" description="Key metrics and recent activity." />
          </PageHeader>

          <PageBody>
            <div className="grid gap-4 sm:grid-cols-3">
              {['Revenue', 'Active users', 'Conversion'].map((kpi) => (
                <Card key={kpi}>
                  <CardHeader className="pb-2">
                    <CardDescription>{kpi}</CardDescription>
                    <CardTitle className="text-2xl">
                      {kpi === 'Revenue' ? '$48.2k' : kpi === 'Active users' ? '12,310' : '3.4%'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-xs">vs. previous period</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageBody>
        </Page>
      </Story>

      <Story title="Title only" description="Description is optional — drop it for compact pages.">
        <Page>
          <PageHeader actions={<Button size="sm">Save changes</Button>}>
            <PageHeaderHeading title="Settings" />
          </PageHeader>

          <PageBody>
            <Card>
              <CardContent className="text-muted-foreground py-8 text-center text-sm">
                {' '}
                Settings form goes here.{' '}
              </CardContent>
            </Card>
          </PageBody>
        </Page>
      </Story>

      <Story
        title="With breadcrumb"
        description="Stack a Breadcrumb above the heading for nested-page navigation context."
      >
        <Page>
          <PageHeader
            actions={
              <>
                <Button variant="outline" size="sm">
                  Archive
                </Button>
                <Button size="sm">Edit</Button>
              </>
            }
          >
            <div className="space-y-2">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Workspace</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Projects</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Acme website</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <PageHeaderHeading title="Acme website" description="Customer-facing marketing site." />
            </div>
          </PageHeader>

          <PageBody>
            <Card>
              <CardContent className="text-muted-foreground py-8 text-center text-sm">
                {' '}
                Project details go here.{' '}
              </CardContent>
            </Card>
          </PageBody>
        </Page>
      </Story>
    </>
  )
}
