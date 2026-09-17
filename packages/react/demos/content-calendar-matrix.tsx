import Story from '../../components/story/Story'
import { ContentCalendarMatrix } from '@react-registry-blocks/content-calendar-matrix/ContentCalendarMatrix'

export default function ContentCalendarMatrixDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Editorial publishing calendar with pacing KPI summary cards, channel filter tabs, month picker, publication status chips, author avatars, SEO keywords, and contextual action menus."
      >
        <ContentCalendarMatrix />
      </Story>

      <Story
        title="Custom Copy"
        description="Content calendar configured with tailored title and subtitle for media publication teams."
      >
        <ContentCalendarMatrix
          title="Global Media Publishing Grid"
          subtitle="Track multi-region blog, video, and social campaigns across your global content organization."
        />
      </Story>
    </>
  )
}
