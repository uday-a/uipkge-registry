import Story from '../../components/story/Story'
import { HeaderMegaMenu } from '@react-registry-blocks/header-mega-menu/HeaderMegaMenu'
// HeaderMegaMenu is the block file the user installs. Open
// `components/blocks/HeaderMegaMenu.tsx` after install to edit the `menus`
// array — panel columns derive from it, so a new group needs no markup.

export default function HeaderMegaMenuDemo() {
  return (
    <Story
      title="Header — Mega Menu"
      description="Navbar with full-width mega panels. Product and Resources open grouped link lists with descriptions and a highlighted card; arrow keys move between items and Escape closes."
    >
      <HeaderMegaMenu />
    </Story>
  )
}
