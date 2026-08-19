import Story from "../../components/story/Story";
import { Video } from "@react-registry/video";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@react-registry/card";

const sampleMp4 = "/media/flower.mp4";
const samplePoster = "/media/flower.jpg";

export default function VideoDemo() {
  return (
    <>
      <Story
        title="Feature player"
        description="Custom controls with play/pause, seek, skip ±10s, volume, and fullscreen — the default hero video experience."
      >
        <Video src={sampleMp4} poster={samplePoster} className="max-w-2xl" />
      </Story>

      <Story
        title="Autoplay (muted)"
        description="Autoplay starts muted to satisfy browser policies — ideal for background reels and silent promos."
      >
        <Video
          src={sampleMp4}
          poster={samplePoster}
          autoplay
          muted
          loop
          className="max-w-2xl"
        />
      </Story>

      <Story
        title="Native controls"
        description="Drop in the browser's built-in controls when you don't need a branded overlay."
      >
        <Video
          src={sampleMp4}
          poster={samplePoster}
          nativeControls
          className="max-w-2xl"
        />
      </Story>

      <Story
        title="Aspect ratio variants"
        description="16/9 (default), 4/3 classic, 1/1 square, and 9/16 portrait — match the player to your source."
      >
        <div className="grid max-w-2xl gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">4/3 — classic TV</p>
            <Video src={sampleMp4} poster={samplePoster} aspectRatio="4/3" />
          </div>
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">1/1 — square</p>
            <Video src={sampleMp4} poster={samplePoster} aspectRatio="1/1" />
          </div>
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">9/16 — portrait</p>
            <Video
              src={sampleMp4}
              poster={samplePoster}
              aspectRatio="9/16"
              className="max-w-xs"
            />
          </div>
          <div className="space-y-1.5">
            <p className="text-muted-foreground text-xs">16/9 — widescreen</p>
            <Video src={sampleMp4} poster={samplePoster} aspectRatio="16/9" />
          </div>
        </div>
      </Story>

      <Story
        title="Without poster"
        description="No poster image — the player area is black until playback starts."
      >
        <Video src={sampleMp4} className="max-w-2xl" />
      </Story>

      <Story
        title="Custom playback rate"
        description="Set an initial playback rate — 1.5× for tutorials, 0.5× for slow-motion analysis."
      >
        <Video
          src={sampleMp4}
          poster={samplePoster}
          playbackRate={1.5}
          className="max-w-2xl"
        />
      </Story>

      <Story
        title="In a content card"
        description="Video embedded in a card with a title and description — the pattern for course lessons and media libraries."
      >
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Lesson 3 — Composition basics</CardTitle>
            <CardDescription>5 min · 1.5× speed recommended</CardDescription>
          </CardHeader>
          <CardContent>
            <Video src={sampleMp4} poster={samplePoster} playbackRate={1.5} />
          </CardContent>
        </Card>
      </Story>
    </>
  );
}
