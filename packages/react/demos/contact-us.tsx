import Story from '../../components/story/Story'
import { ContactUs } from '@react-registry-blocks/contact-us/ContactUs'

const token = import.meta.env.PUBLIC_MAPBOX_TOKEN as string

export default function ContactUsDemo() {
  return (
    <Story
      title="Contact Us"
      description="Two-column contact section with a live map pinned to your office and a form Card that swaps to a success state on submit."
    >
      <ContactUs accessToken={token} location={[-122.4194, 37.7749]} locationLabel="San Francisco, CA" />
    </Story>
  )
}
