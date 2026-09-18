import Story from '../../components/story/Story'
import { Card, CardContent } from '@react-registry/card'
import { Grid } from '@react-registry/grid'

export default function GridDemo() {
  return (
    <>
      <Story title="3 columns" description="Three-column grid with a small gap.">
        <Grid cols={3} gap={3}>
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-center text-sm">{i + 1}</CardContent>
            </Card>
          ))}
        </Grid>
      </Story>

      <Story title="4 columns" description="Four-column grid with a larger gap.">
        <Grid cols={4} gap={6}>
          {Array.from({ length: 8 }, (_, i) => (
            <Card key={i}>
              <CardContent className="p-3 text-center text-sm">{i + 1}</CardContent>
            </Card>
          ))}
        </Grid>
      </Story>

      <Story
        title="Responsive"
        description="Pass a breakpoint map for a layout that adapts: 1 column on phones, 2 on small tablets, 4 on desktop."
      >
        <Grid cols={{ base: 1, sm: 2, lg: 4 }} gap={4}>
          {Array.from({ length: 8 }, (_, i) => (
            <Card key={i}>
              <CardContent className="p-3 text-center text-sm">{i + 1}</CardContent>
            </Card>
          ))}
        </Grid>
      </Story>
    </>
  )
}
