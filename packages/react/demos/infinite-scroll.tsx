import { useRef, useState } from "react";
import Story from "../../components/story/Story";
import { InfiniteScroll } from "@react-registry/infinite-scroll";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@react-registry/card";
import { Button } from "@react-registry/button";

interface FeedItem {
  id: number;
  title: string;
  author: string;
  time: string;
}

const titles = [
  "Shipping rate cards v2",
  "New onboarding flow is live",
  "Q3 retention deep-dive",
  "Design system tokens audit",
  "Customer feedback summary",
  "Pricing experiment results",
  "Mobile app crash report",
  "Hiring pipeline update",
];
const authors = [
  "Sarah Chen",
  "Marcus Webb",
  "Priya Patel",
  "Tom Garcia",
  "Lisa Wong",
];

function makePage(n: number): FeedItem[] {
  return Array.from({ length: 6 }, (_, i) => {
    const id = (n - 1) * 6 + i + 1;
    return {
      id,
      title: titles[(id - 1) % titles.length],
      author: authors[(id - 1) % authors.length],
      time: `${2 + ((id * 7) % 50)} min ago`,
    };
  });
}

interface ChatMsg {
  id: number;
  author: string;
  text: string;
}

export default function InfiniteScrollDemo() {
  const [items, setItems] = useState<FeedItem[]>(makePage(1));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  async function load() {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    pageRef.current += 1;
    setItems((prev) => [...prev, ...makePage(pageRef.current)]);
    if (pageRef.current >= 5) setHasMore(false);
    setLoading(false);
    loadingRef.current = false;
  }

  function reset() {
    pageRef.current = 1;
    loadingRef.current = false;
    setItems(makePage(1));
    setHasMore(true);
    setLoading(false);
  }

  // Reverse-mode chat demo
  const [messages, setMessages] = useState<ChatMsg[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      author: i % 2 === 0 ? "You" : "Maya",
      text: [
        "Hey, did you see the new deploy?",
        "Yeah, looks great!",
        "Pushing the fix now",
        "LGTM 👍",
      ][i % 4],
    })),
  );
  const [reverseLoading, setReverseLoading] = useState(false);
  const [reverseHasMore, setReverseHasMore] = useState(true);
  const reverseCountRef = useRef(8);
  const reverseLoadingRef = useRef(false);

  async function loadReverse() {
    if (reverseLoadingRef.current || !reverseHasMore) return;
    reverseLoadingRef.current = true;
    setReverseLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const next = Array.from({ length: 4 }, (_, i) => ({
      id: reverseCountRef.current + i + 1,
      author: (reverseCountRef.current + i) % 2 === 0 ? "You" : "Maya",
      text: ["Older message", "From earlier today", "Re: the deploy", "Got it"][
        i % 4
      ],
    }));
    reverseCountRef.current += 4;
    setMessages((prev) => [...next, ...prev]);
    if (reverseCountRef.current >= 20) setReverseHasMore(false);
    setReverseLoading(false);
    reverseLoadingRef.current = false;
  }

  return (
    <>
      <Story
        title="Activity feed"
        description="A realistic notification feed that loads more pages as you scroll the page downward."
      >
        <div className="w-full max-w-md">
          {items.map((item) => (
            <div
              key={item.id}
              className="border-border/60 flex items-start justify-between gap-3 border-b px-4 py-3"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-muted-foreground text-xs">
                  {item.author} · {item.time}
                </p>
              </div>
              <span className="bg-muted text-muted-foreground rounded px-2 py-0.5 text-xs tabular-nums">
                #{item.id}
              </span>
            </div>
          ))}
          <InfiniteScroll
            hasMore={hasMore}
            loading={loading}
            distance={200}
            onLoadMore={load}
          />
          {!hasMore ? (
            <Button size="sm" variant="ghost" className="mt-2" onClick={reset}>
              Reset feed
            </Button>
          ) : null}
        </div>
      </Story>

      <Story
        title="Custom loading & end slots"
        description="Replace the default spinner with branded text, and show a custom end message when data runs out."
      >
        <div className="w-full max-w-md">
          {items.map((item) => (
            <div
              key={`c-${item.id}`}
              className="border-border/60 flex items-start justify-between gap-3 border-b px-4 py-3"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-muted-foreground text-xs">{item.author}</p>
              </div>
            </div>
          ))}
          <InfiniteScroll
            hasMore={hasMore}
            loading={loading}
            distance={200}
            onLoadMore={load}
          />
        </div>
      </Story>

      <Story
        title="Chat timeline (reverse)"
        description="Sentinel at the top; new older messages prepend — the pattern for chat apps loading history upward."
      >
        <div className="border-border/60 max-h-80 w-full max-w-md overflow-y-auto rounded-md border">
          <InfiniteScroll
            hasMore={reverseHasMore}
            loading={reverseLoading}
            distance={50}
            reverse
            onLoadMore={loadReverse}
          >
            {messages.map((msg) => (
              <div
                key={`r-${msg.id}`}
                className="border-border/60 flex gap-2 border-b px-4 py-2.5 text-sm"
              >
                <span className="text-muted-foreground w-12 shrink-0 text-xs">
                  {msg.author}
                </span>
                <span>{msg.text}</span>
              </div>
            ))}
          </InfiniteScroll>
        </div>
      </Story>

      <Story
        title="Scrollable container target"
        description="scrollTarget pins the listener to a specific element instead of the window — useful for panels and drawers."
      >
        <div
          id="inf-scroll-box"
          className="border-border/60 max-h-64 w-full max-w-md overflow-y-auto rounded-md border"
        >
          {items.map((item) => (
            <div
              key={`el-${item.id}`}
              className="border-border/60 flex items-start justify-between gap-3 border-b px-4 py-3"
            >
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-muted-foreground text-xs">{item.author}</p>
              </div>
            </div>
          ))}
          <InfiniteScroll
            hasMore={hasMore}
            loading={loading}
            distance={50}
            scrollTarget="#inf-scroll-box"
            onLoadMore={load}
          />
        </div>
      </Story>

      <Story
        title="In a card"
        description="Infinite scroll embedded in a card with a header — the pattern for dashboards and activity panels."
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Updates from your team this week</CardDescription>
          </CardHeader>
          <CardContent>
            {items.map((item) => (
              <div
                key={`card-${item.id}`}
                className="border-border/60 flex items-start justify-between gap-3 border-b py-2.5 last:border-0"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-muted-foreground text-xs">
                    {item.author} · {item.time}
                  </p>
                </div>
              </div>
            ))}
            <InfiniteScroll
              hasMore={hasMore}
              loading={loading}
              distance={100}
              onLoadMore={load}
            />
          </CardContent>
        </Card>
      </Story>
    </>
  );
}
