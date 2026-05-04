import Story from '../../components/story/Story'
import { Button } from '@react-registry/button'
import { Img } from '@react-registry/lazy-image'
import { useState } from 'react'

const galleryItems = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  src: `https://picsum.photos/seed/uipkge-${i}/600/400`,
  alt: `Stock photo ${i + 1}`,
}))

export default function LazyImageDemo() {
  const [swapSrc, setSwapSrc] = useState('https://picsum.photos/seed/uipkge-swap-a/800/450')
  function swap() {
    setSwapSrc((prev) =>
      prev.includes('swap-a')
        ? 'https://picsum.photos/seed/uipkge-swap-b/800/450'
        : 'https://picsum.photos/seed/uipkge-swap-a/800/450',
    )
  }

  return (
    <>
      <Story
        title="Default"
        description="loading='lazy' plus IntersectionObserver hold. Skeleton placeholder fades to image on load. Aspect ratio reserved up front to avoid layout shift."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {galleryItems.slice(0, 6).map((item) => (
            <Img key={item.id} src={item.src} alt={item.alt} aspectRatio="3/2" className="rounded-md" />
          ))}
        </div>
      </Story>

      <Story
        title="Aspect ratios"
        description="Pass aspectRatio as a string (16/9, 1/1, etc.) or a number. Container reserves the slot before the image arrives."
      >
        <div className="flex flex-wrap gap-3">
          <Img
            src="https://picsum.photos/seed/uipkge-square/400/400"
            alt="Square"
            aspectRatio="1/1"
            className="w-40 rounded-md"
          />
          <Img
            src="https://picsum.photos/seed/uipkge-wide/800/450"
            alt="Wide"
            aspectRatio="16/9"
            className="w-72 rounded-md"
          />
          <Img
            src="https://picsum.photos/seed/uipkge-portrait/400/600"
            alt="Portrait"
            aspectRatio="2/3"
            className="w-36 rounded-md"
          />
        </div>
      </Story>

      <Story
        title="Cover vs contain"
        description="cover (default) crops to fill, contain letterboxes. Useful when the image aspect ratio doesn't match the container."
      >
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-muted-foreground mb-2 text-xs">cover (default)</p>
            <Img
              src="https://picsum.photos/seed/uipkge-cover/400/600"
              alt="Cover example"
              aspectRatio="16/9"
              className="rounded-md"
            />
          </div>
          <div>
            <p className="text-muted-foreground mb-2 text-xs">contain</p>
            <Img
              src="https://picsum.photos/seed/uipkge-cover/400/600"
              alt="Contain example"
              aspectRatio="16/9"
              cover={false}
              className="rounded-md"
            />
          </div>
        </div>
      </Story>

      <Story
        title="Error fallback (slot + URL)"
        description="On error: render the fallback slot if provided, else the fallback URL, else a 'Image unavailable' placeholder."
      >
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-muted-foreground mb-2 text-xs">No fallback</p>
            <Img src="https://example.invalid/missing.jpg" alt="Broken" aspectRatio="1/1" className="rounded-md" />
          </div>
          <div>
            <p className="text-muted-foreground mb-2 text-xs">Fallback URL</p>
            <Img
              src="https://example.invalid/missing.jpg"
              alt="Broken with URL fallback"
              aspectRatio="1/1"
              fallback="https://picsum.photos/seed/uipkge-fallback/400/400"
              className="rounded-md"
            />
          </div>
          <div>
            <p className="text-muted-foreground mb-2 text-xs">Slot fallback</p>
            <Img
              src="https://example.invalid/missing.jpg"
              alt="Broken with slot"
              aspectRatio="1/1"
              className="rounded-md"
              fallbackContent={
                <div className="bg-destructive/10 text-destructive flex h-full items-center justify-center text-xs font-medium">
                  Failed
                </div>
              }
            />
          </div>
        </div>
      </Story>

      <Story
        title="Eager"
        description="eager skips the IntersectionObserver hold and uses loading='eager' + decoding='sync'. Use for above-the-fold hero images."
      >
        <Img
          src="https://picsum.photos/seed/uipkge-hero/1200/600"
          alt="Hero"
          aspectRatio="2/1"
          eager
          className="rounded-md"
        />
      </Story>

      <Story
        title="Swap src"
        description="Updating the src resets state to loading and re-runs the placeholder + fade flow."
      >
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button size="sm" onClick={swap}>
              Swap image
            </Button>
            <span className="text-muted-foreground self-center text-xs">{swapSrc.split('/').slice(-3).join('/')}</span>
          </div>
          <Img src={swapSrc} alt="Swappable" aspectRatio="16/9" className="rounded-md" />
        </div>
      </Story>
    </>
  )
}
