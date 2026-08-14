import Story from '../../components/story/Story'
import { CareersJobBoard } from '@react-registry-blocks/careers-job-board/CareersJobBoard'

export default function CareersJobBoardDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Careers page and open positions board with perks summary, interactive department and location filters, live keyword search, and open application CTA."
      >
        <CareersJobBoard />
      </Story>

      <Story
        title="Custom copy"
        description="Customized headline and subheadline props for tailored company messaging."
      >
        <CareersJobBoard
          title="Build the future of UI with us"
          subtitle="We are looking for craft-obsessed engineers and designers to expand our component ecosystem."
        />
      </Story>
    </>
  )
}
