import Story from '../../components/story/Story'
import { BookmarkManagerGrid } from '@react-registry-blocks/bookmark-manager-grid/BookmarkManagerGrid'

export default function BookmarkManagerGridDemo() {
  return (
    <Story
      title="Default"
      description="Raindrop-style visual web bookmarks and engineering resources manager with collection sidebar, tag cloud filtering, instant search, responsive bookmark cards with website favicons and thumbnails, favorite toggles, copy URL, and Add Bookmark modal."
    >
      <BookmarkManagerGrid />
    </Story>
  )
}
