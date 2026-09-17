import Story from '../../components/story/Story'
import { AssignmentSubmissionDropzone } from '@react-registry-blocks/assignment-submission-dropzone/AssignmentSubmissionDropzone'

export default function AssignmentSubmissionDropzoneDemo() {
  return (
    <>
      <Story
        title="Default"
        description="University coursework submission portal with attached project archive, clean plagiarism scan, deadline timer, and 4-category grading rubric."
      >
        <AssignmentSubmissionDropzone />
      </Story>

      <Story
        title="Empty Dropzone State"
        description="Initial state before student file upload with drag-and-drop zone and format constraints."
      >
        <AssignmentSubmissionDropzone initialFile={null} />
      </Story>

      <Story
        title="Submitted State"
        description="Read-only confirmation receipt after assignment submission with verification hash and timestamp."
      >
        <AssignmentSubmissionDropzone initialSubmitted={true} />
      </Story>

      <Story
        title="Plagiarism Warning State"
        description="Pre-scan indicator highlighting potential unoriginal content requiring review before final submission."
      >
        <AssignmentSubmissionDropzone
          initialFile={{
            name: 'distributed_system_draft.tar.gz',
            size: '22.1 MB',
            uploadedAt: 'Aug 24, 15:10 PST',
            similarity: 18.5,
            status: 'Review required',
          }}
        />
      </Story>
    </>
  )
}
