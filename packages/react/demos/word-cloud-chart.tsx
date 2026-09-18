import Story from '../../components/story/Story'
import { WordCloudChart } from '@react-registry/charts'

const topics = [
  { name: 'dashboards', value: 96 },
  { name: 'echarts', value: 82 },
  { name: 'tokens', value: 74 },
  { name: 'registry', value: 68 },
  { name: 'vue', value: 61 },
  { name: 'react', value: 58 },
  { name: 'a11y', value: 44 },
  { name: 'dark-mode', value: 39 },
  { name: 'sparklines', value: 28 },
  { name: 'funnels', value: 22 },
]

export default function WordCloudChartDemo() {
  return (
    <>
      <Story title="Docs topics" description="Frequency-sized words from the chart palette.">
        <WordCloudChart data={topics} height={280} />
      </Story>
    </>
  )
}
