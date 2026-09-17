import Story from '../../components/story/Story'
import { Header01 } from '@react-registry-blocks/header-01/Header01'
// Header01 is sticky. Replace the anchor `href`s with real routes and wire
// the trial / sign-in CTAs after install.

export default function Header01Demo() {
  return (
    <Story
      title="Header 01"
      description="Sticky marketing top nav. Brand + 5 links + sign-in/CTA on desktop, hamburger + right-side Sheet on mobile."
    >
      <Header01 />
    </Story>
  )
}
