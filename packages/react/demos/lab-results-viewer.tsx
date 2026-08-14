import Story from '../../components/story/Story'
import { LabResultsViewer } from '@react-registry-blocks/lab-results-viewer/LabResultsViewer'

export default function LabResultsViewerDemo() {
  return (
    <Story
      title="Default"
      description="Quest and Labcorp style diagnostic lab results report with reference ranges, flags, linear range scales, 6-month historical trends, and physician clinical impression."
    >
      <LabResultsViewer />
    </Story>
  )
}
