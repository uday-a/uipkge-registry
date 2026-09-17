import Story from '../../components/story/Story'
import { ExitIntentSurvey } from '@react-registry-blocks/exit-intent-survey/ExitIntentSurvey'
// ExitIntentSurvey is the block file the user installs. Open
// `components/blocks/ExitIntentSurvey.tsx` after install to change the
// options and post the response to your endpoint.

export default function ExitIntentSurveyDemo() {
  return (
    <Story
      title="Exit Intent — Survey"
      description="A one-question exit survey with preset answers and an optional free-text field, closing on a thank-you state rather than staying open."
    >
      <ExitIntentSurvey />
    </Story>
  )
}
