import Story from "../../components/story/Story";
import { Button } from "@react-registry/button";
import {
  IconTransition,
  type IconTransitionHandle,
} from "@react-registry/icon-transition";
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  Heart,
  Link2,
  Plus,
  Share2,
  Star,
  ThumbsUp,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { useRef, useState } from "react";

const sampleUrl = "https://uipkge.dev/r/vue/button.json";

export default function IconTransitionDemo() {
  const [liked, setLiked] = useState(false);
  const bookmarkRef = useRef<IconTransitionHandle>(null);

  async function copySample() {
    try {
      await navigator.clipboard?.writeText(sampleUrl);
      return true;
    } catch {
      return false;
    }
  }

  return (
    <>
      <Story
        title="Default — copy command"
        description="Standard copy button. Click runs the async action; on success the icon springs into the Check, then auto-reverts after 1.5s."
      >
        <div className="bg-muted/30 border-border flex items-center gap-3 rounded-lg border px-4 py-3 font-mono text-sm">
          <code className="min-w-0 flex-1 truncate">{sampleUrl}</code>
          <IconTransition
            defaultIcon={Copy}
            activeIcon={Check}
            iconClass="size-4"
            label="Copy URL"
            activeLabel="Copied"
            className="text-muted-foreground hover:bg-muted hover:text-foreground size-8 rounded-md"
            action={copySample}
          />
        </div>
      </Story>

      <Story
        title="Externally controlled — like button"
        description="Pass `:active` to drive the icon swap from your own state, instead of using the built-in click handler. Useful when the parent already manages the toggle."
      >
        <Button
          variant="outline"
          className={liked ? "text-rose-500" : ""}
          onClick={() => setLiked(!liked)}
        >
          <IconTransition
            as="span"
            defaultIcon={Heart}
            activeIcon={Heart}
            active={liked}
            activeClass="text-rose-500 fill-current"
            iconClass="size-4"
            className="size-4"
          />
          {liked ? "Liked" : "Like"}
        </Button>
      </Story>

      <Story
        title="Stay active — bookmark with manual reset"
        description='Pass `:resetAfter="0"` to keep the active icon. Reset programmatically by calling the exposed `reset()` method via a template ref.'
      >
        <div className="flex items-center gap-3">
          <IconTransition
            ref={bookmarkRef}
            defaultIcon={Bookmark}
            activeIcon={BookmarkCheck}
            resetAfter={0}
            iconClass="size-5"
            label="Save"
            activeLabel="Saved"
            className="border-border hover:bg-muted size-9 rounded-md border"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => bookmarkRef.current?.reset()}
          >
            Reset
          </Button>
        </div>
      </Story>

      <Story
        title="Different icons per role"
        description="The active icon does not have to be a Check — any pair of icons works. Here are share/follow/star patterns built on the same primitive."
      >
        <div className="flex flex-wrap gap-2">
          <IconTransition
            defaultIcon={Share2}
            activeIcon={Check}
            iconClass="size-4"
            label="Share"
            activeLabel="Shared"
            className="border-border hover:bg-muted size-9 rounded-md border"
          />
          <IconTransition
            defaultIcon={UserPlus}
            activeIcon={UserCheck}
            iconClass="size-4"
            label="Follow"
            activeLabel="Following"
            activeClass="text-info"
            className="border-border hover:bg-muted size-9 rounded-md border"
          />
          <IconTransition
            defaultIcon={Star}
            activeIcon={Star}
            iconClass="size-4"
            label="Star"
            activeLabel="Starred"
            activeClass="text-amber-500 fill-current"
            className="border-border hover:bg-muted size-9 rounded-md border"
          />
          <IconTransition
            defaultIcon={ThumbsUp}
            activeIcon={ThumbsUp}
            iconClass="size-4"
            label="Upvote"
            activeLabel="Upvoted"
            activeClass="text-emerald-500 fill-current"
            className="border-border hover:bg-muted size-9 rounded-md border"
          />
          <IconTransition
            defaultIcon={Plus}
            activeIcon={Check}
            iconClass="size-4"
            label="Add"
            activeLabel="Added"
            className="border-border hover:bg-muted size-9 rounded-md border"
          />
        </div>
      </Story>

      <Story
        title="Inline inside a chip"
        description='Use `as="span"` and `:active` to make the icon a passive child of an outer button. The chip handles the click and tracks state — the icon just animates.'
      >
        <div className="flex flex-wrap gap-1.5">
          {["button", "data-table", "dialog", "sonner"].map((name) => (
            <button
              key={name}
              type="button"
              className="group bg-muted/30 border-border hover:border-primary/40 focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-2.5 py-1.5 font-mono text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
              onClick={copySample}
            >
              <span className="text-muted-foreground font-sans tracking-wider uppercase">
                add
              </span>
              <span>{name}</span>
              <IconTransition
                as="span"
                defaultIcon={Link2}
                activeIcon={Check}
                iconClass="size-3"
                className="text-muted-foreground size-3"
              />
            </button>
          ))}
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          Each chip is its own button; the IconTransition lives inside in
          `as="span"` mode and never receives clicks directly.
        </p>
      </Story>
    </>
  );
}
