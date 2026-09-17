import Story from '../../components/story/Story'
import { ImportWizard } from '@react-registry-blocks/import-wizard/ImportWizard'

export default function ImportWizardDemo() {
  return (
    <>
      <Story title="Upload" description="Empty dropzone — click it to simulate selecting a parsed file.">
        <ImportWizard />
      </Story>

      <Story title="File selected" description="Post-parse summary card with row/column counts and a Parsed badge.">
        <ImportWizard initialFileSelected />
      </Story>

      <Story
        title="Mapping auto-filled"
        description="Columns auto-guessed with confidence badges; manager column skipped."
      >
        <ImportWizard initialStep={2} />
      </Story>

      <Story
        title="Unmapped required"
        description="Email left unmapped — warning alert appears and Review is disabled."
      >
        <ImportWizard
          initialStep={2}
          initialMapping={{
            full_name: 'Full name',
            email_address: 'Skip',
            dept: 'Department',
            job_title: 'Job title',
            start_date: 'Start date',
            manager: 'Skip',
          }}
        />
      </Story>

      <Story title="Preview clean" description="First five rows rendered through the mapped fields — nothing flagged.">
        <ImportWizard initialStep={3} />
      </Story>

      <Story
        title="Preview with flags"
        description="Missing name and malformed email highlight destructively in place."
      >
        <ImportWizard
          initialStep={3}
          initialMapping={{
            full_name: 'Full name',
            email_address: 'Email',
            dept: 'Department',
            job_title: 'Job title',
            start_date: 'Skip',
            manager: 'Skip',
          }}
        />
      </Story>

      <Story title="Result success" description="All rows committed; reset affordance returns to step one.">
        <ImportWizard initialStep={4} />
      </Story>

      <Story title="Wide dataset" description="Six mapped columns force horizontal scroll inside narrow containers.">
        <div className="max-w-md">
          <ImportWizard initialStep={3} />
        </div>
      </Story>

      <Story title="Compact" description="The same flow at phone-card width.">
        <div className="max-w-sm">
          <ImportWizard initialStep={2} />
        </div>
      </Story>
    </>
  )
}
