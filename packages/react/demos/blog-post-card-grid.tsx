import Story from '../../components/story/Story'
import { BlogPostCardGrid } from '@react-registry-blocks/blog-post-card-grid/BlogPostCardGrid'

export default function BlogPostCardGridDemo() {
  return (
    <>
      <Story
        title="Editorial Magazine Grid"
        description="3-column modern editorial article card grid with featured lead hero story, category pills, reading times, author avatars, and interactive newsletter signup."
      >
        <BlogPostCardGrid />
      </Story>

      <Story
        title="Card Grid Only (No Hero)"
        description="Standard symmetric 3-column article cards layout without the top featured hero banner."
      >
        <BlogPostCardGrid showFeatured={false} />
      </Story>
    </>
  )
}
