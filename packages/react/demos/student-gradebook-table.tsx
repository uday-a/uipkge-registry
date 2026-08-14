import Story from '../../components/story/Story'
import { StudentGradebookTable } from '@react-registry-blocks/student-gradebook-table/StudentGradebookTable'

export default function StudentGradebookTableDemo() {
  return (
    <Story
      title="Default"
      description="Academic course gradebook with weighted category scores, GPA summary metrics, and attendance records."
    >
      <StudentGradebookTable />
    </Story>
  )
}
