import Story from '../../components/story/Story'
import { SearchResultsPage } from '@react-registry-blocks/search-results-page/SearchResultsPage'

export default function SearchResultsPageDemo() {
  return (
    <Story
      title="Search results page"
      description="Full search results page: pre-filled query with result count, removable filter chips, a facet sidebar, six result rows with snippets and meta, and pagination."
    >
      <SearchResultsPage />
    </Story>
  )
}
