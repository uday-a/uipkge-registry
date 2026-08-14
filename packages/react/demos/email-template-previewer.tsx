import Story from '../../components/story/Story'
import { EmailTemplatePreviewer } from '@react-registry-blocks/email-template-previewer/EmailTemplatePreviewer'

export default function EmailTemplatePreviewerDemo() {
  return (
    <Story
      title="Email Template Previewer"
      description="Resend and Klaviyo style marketing email designer preview with viewport switcher, live subject line and preheader tester with emoji impact telemetry, spam score analyzer, domain authentication badges, and test email dispatcher modal."
    >
      <EmailTemplatePreviewer />
    </Story>
  )
}
