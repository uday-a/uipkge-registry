import Story from '../../components/story/Story'
import { ApiDocumentationPage } from '@react-registry-blocks/api-documentation-page/ApiDocumentationPage'

export default function ApiDocumentationPageDemo() {
  return (
    <Story
      title="Default"
      description="Stripe and Mintlify style two-pane API documentation reference page with interactive language snippets (cURL, Node.js, Python, Go, Ruby), parameter schema tables, and response status payloads."
    >
      <ApiDocumentationPage />
    </Story>
  )
}
