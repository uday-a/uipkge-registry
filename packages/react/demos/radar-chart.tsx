import Story from '../../components/story/Story'
import { RadarChart } from '@react-registry/charts'

const carIndicators = [
  { name: 'Speed', max: 100 },
  { name: 'Reliability', max: 100 },
  { name: 'Comfort', max: 100 },
  { name: 'Safety', max: 100 },
  { name: 'Efficiency', max: 100 },
]

const carData = [
  { name: 'Model A', value: [85, 90, 70, 95, 80] },
  { name: 'Model B', value: [70, 85, 90, 80, 75] },
]

const skillIndicators = [
  { name: 'TypeScript', max: 10 },
  { name: 'Vue', max: 10 },
  { name: 'CSS', max: 10 },
  { name: 'Testing', max: 10 },
  { name: 'Tooling', max: 10 },
  { name: 'Design', max: 10 },
]

const skillData = [{ name: 'You', value: [9, 8, 7, 6, 9, 5] }]

// Heavier fill — emphasise the shape over the outline.
const filledOption = {
  series: [
    {
      data: [
        {
          name: 'Model A',
          value: [85, 90, 70, 95, 80],
          areaStyle: { opacity: 0.45 },
          lineStyle: { width: 1 },
        },
        {
          name: 'Model B',
          value: [70, 85, 90, 80, 75],
          areaStyle: { opacity: 0.45 },
          lineStyle: { width: 1 },
        },
      ],
    },
  ],
}

// Polygon grid instead of circular — gives the radar a more "tactical" look.
const polygonOption = {
  radar: {
    indicator: carIndicators,
    shape: 'polygon' as const,
    radius: '62%',
    splitNumber: 4,
    splitArea: { areaStyle: { color: ['rgba(245,245,245,0.4)', 'rgba(220,220,220,0.05)'] } },
  },
}

export default function RadarChartDemo() {
  return (
    <>
      <Story
        title="Basic radar"
        description="Multi-series radar with light fill and circular grid. Two cars compared on five attributes."
      >
        <RadarChart indicators={carIndicators} data={carData} height="340" />
      </Story>

      <Story
        title="Single series"
        description="One filled polygon — common for self-assessments, skill matrices, scorecards."
      >
        <RadarChart indicators={skillIndicators} data={skillData} height="340" />
      </Story>

      <Story
        title="Heavy fill"
        description="Bump area opacity and thin the outline to read shape-first instead of outline-first."
      >
        <RadarChart indicators={carIndicators} data={carData} option={filledOption} height="340" />
      </Story>

      <Story
        title="Polygon grid"
        description="Override the radar shape to polygon for a tactical / hexagonal grid look."
      >
        <RadarChart indicators={carIndicators} data={carData} option={polygonOption} height="340" />
      </Story>

      <Story
        title="Compact scorecard"
        description="Shorter height + single series — drops into a profile card, candidate slate, or team scorecard tile without overwhelming neighbouring content."
      >
        <div className="mx-auto max-w-[360px]">
          <RadarChart indicators={skillIndicators} data={skillData} height="220" />
        </div>
      </Story>
    </>
  )
}
