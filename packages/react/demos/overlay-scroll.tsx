import Story from "../../components/story/Story";
import { useEffect, useRef, useState } from "react";
import {
  OverlayScroll,
  type OverlayScrollHandle,
} from "@react-registry/overlay-scroll";
import { Button } from "@react-registry/button";

const messages = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  author: ["Sarah", "Marcus", "Priya", "Diego", "Yuki", "Aditya"][i % 6],
  text: [
    "Pushed the migration. Logs look clean on staging.",
    "Bumping this — anyone reviewing the auth PR?",
    "Standup notes from yesterday are in the doc.",
    "Mobile build green. Cutting RC1 now.",
    "Q3 OKR draft ready for feedback.",
    "Fixed the off-by-one. New build deploying.",
    "Anyone seeing slowdowns on /dashboard? Looking into it.",
    "Closed P-1342. Was a Redis cache miss.",
  ][i % 8],
  time: `${(i * 7) % 60}m`,
}));

const files = Array.from({ length: 18 }, (_, i) => ({
  name: [
    "src/auth/middleware.ts",
    "src/db/migrations/0042.sql",
    "app/routes/dashboard.vue",
    "lib/utils.ts",
    "tests/auth.spec.ts",
  ][i % 5],
  status: ["M", "A", "D", "M", "M"][i % 5],
}));

const navItems = [
  "Inbox",
  "Sent",
  "Drafts",
  "Spam",
  "Trash",
  "All Mail",
  "Important",
  "Starred",
  "Snoozed",
  "Scheduled",
  "Outbox",
  "Categories",
  "Social",
  "Updates",
  "Forums",
  "Promotions",
  "Archive",
  "Templates",
  "Tasks",
  "Notes",
  "Calendar",
  "Contacts",
];

const statusClass = (status: string) =>
  status === "M"
    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
    : status === "A"
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      : status === "D"
        ? "bg-red-500/15 text-red-600 dark:text-red-400"
        : "";

const detailClass = (detail: string) =>
  detail === "queued"
    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
    : detail === "in-flight"
      ? "bg-blue-500/15 text-blue-600 dark:text-blue-400"
      : detail === "done"
        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        : "bg-red-500/15 text-red-600 dark:text-red-400";

export default function OverlayScrollDemo() {
  const externalRef = useRef<OverlayScrollHandle | null>(null);
  function scrollToBottom() {
    const el = externalRef.current?.scrollerEl;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }
  function scrollToTop() {
    const el = externalRef.current?.scrollerEl;
    if (el) el.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Dynamic-growth demo. Starts with 20 rows. Manual button appends 20
  // more; auto-grow appends 1 row every 250ms. The thumb shrinks as the
  // content grows (ResizeObserver + MutationObserver inside OverlayScroll
  // pick up both the inner-element resize and the DOM insertions).
  const [dynamicRows, setDynamicRows] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      title: `Row ${i + 1}`,
      detail: ["queued", "in-flight", "done", "retrying"][i % 4],
    })),
  );
  function appendRows(n = 20) {
    setDynamicRows((rows) => {
      const start = rows.length;
      const next = [...rows];
      for (let i = 0; i < n; i++) {
        next.push({
          id: start + i,
          title: `Row ${start + i + 1}`,
          detail: ["queued", "in-flight", "done", "retrying"][(start + i) % 4],
        });
      }
      return next;
    });
  }
  const [autoGrow, setAutoGrow] = useState(false);
  useEffect(() => {
    if (!autoGrow) return;
    const timer = setInterval(() => {
      setDynamicRows((rows) => {
        if (rows.length >= 500) {
          setAutoGrow(false);
          return rows;
        }
        const start = rows.length;
        return [
          ...rows,
          {
            id: start,
            title: `Row ${start + 1}`,
            detail: ["queued", "in-flight", "done", "retrying"][start % 4],
          },
        ];
      });
    }, 250);
    return () => clearInterval(timer);
  }, [autoGrow]);

  return (
    <>
      <Story
        title="Default"
        description="No reserved gutter — content uses the full container width. Thumb fades in on scroll or hover and fades out after 800ms of inactivity. Drag the thumb to scroll."
      >
        <div className="bg-card h-[340px] w-full max-w-md rounded-lg border">
          <OverlayScroll className="h-full p-4">
            <div className="space-y-3">
              {messages.map((m) => (
                <div key={m.id} className="flex gap-3">
                  <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                    {m.author[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium">{m.author}</span>
                      <span className="text-muted-foreground text-xs">
                        {m.time}
                      </span>
                    </div>
                    <p className="text-foreground/90 text-sm">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </OverlayScroll>
        </div>
      </Story>

      <Story
        title="Sidebar nav"
        description="Long vertical list inside a fixed-height nav. The thumb sits at the inner edge — useful when the content extends edge-to-edge and a reserved gutter would push items inward."
      >
        <div className="bg-card h-[300px] w-56 rounded-lg border">
          <OverlayScroll className="h-full">
            <ul className="p-2">
              {navItems.map((item) => (
                <li key={item}>
                  <a className="hover:bg-accent block rounded-md px-3 py-1.5 text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </OverlayScroll>
        </div>
      </Story>

      <Story
        title="Compact file list"
        description="`thumbWidth` / `thumbOffset` shrink the thumb for dense surfaces. Status pill on the left, monospace path on the right."
      >
        <div className="bg-card h-[260px] w-full max-w-lg rounded-lg border">
          <OverlayScroll thumbWidth={3} thumbOffset={1} className="h-full">
            <ul className="divide-y">
              {files.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 px-3 py-2 text-sm"
                >
                  <span
                    className={`inline-flex size-5 items-center justify-center rounded font-mono text-xs font-semibold ${statusClass(f.status)}`}
                  >
                    {f.status}
                  </span>
                  <code className="text-foreground/90 truncate font-mono text-xs">
                    {f.name}
                  </code>
                </li>
              ))}
            </ul>
          </OverlayScroll>
        </div>
      </Story>

      <Story
        title="Programmatic scroll"
        description="The component exposes its scroller element via `useImperativeHandle` — bind a ref and call `.scrollTo()` to drive scroll from outside."
      >
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={scrollToTop}>
              Scroll to top
            </Button>
            <Button size="sm" variant="outline" onClick={scrollToBottom}>
              Scroll to bottom
            </Button>
          </div>
          <div className="bg-card h-[240px] w-full max-w-md rounded-lg border">
            <OverlayScroll ref={externalRef} className="h-full p-4">
              {Array.from({ length: 30 }, (_, i) => (
                <p key={i} className="text-foreground/90 mb-3 text-sm">
                  Paragraph {i + 1}. The parent controls scroll position via the
                  exposed `scrollerEl`.
                </p>
              ))}
            </OverlayScroll>
          </div>
        </div>
      </Story>

      <Story
        title="Dynamic growth (infinite scroll)"
        description="Rows append at runtime. The thumb shrinks and re-positions automatically because OverlayScroll wires a `ResizeObserver` on the inner element and a `MutationObserver` (`childList: true, subtree: true`) on the same node — so any DOM insertion or height change triggers thumb recalculation. Note: the registry's `virtual-list` primitive ships its own scroll container, so wrapping it in OverlayScroll would nest two scrollers. For windowed lists, use `virtual-list` directly; reach for OverlayScroll when you want overlay-style scrolling on real, dynamically-appended DOM."
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => appendRows(20)}>
              +20 rows
            </Button>
            <Button
              size="sm"
              variant={autoGrow ? "default" : "outline"}
              onClick={() => setAutoGrow((v) => !v)}
            >
              {autoGrow ? "Stop auto-grow" : "Start auto-grow"}
            </Button>
            <span className="text-muted-foreground text-xs">
              {dynamicRows.length} rows
            </span>
          </div>
          <div className="bg-card h-[280px] w-full max-w-lg rounded-lg border">
            <OverlayScroll className="h-full">
              <ul className="divide-y">
                {dynamicRows.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-center justify-between px-3 py-2 text-sm"
                  >
                    <span>{row.title}</span>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-xs font-semibold ${detailClass(row.detail)}`}
                    >
                      {row.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </OverlayScroll>
          </div>
        </div>
      </Story>

      <Story
        title="Non-draggable thumb"
        description="Pass `draggable={false}` to turn the thumb into a pure indicator. Wheel and trackpad still scroll; the user just can't drag the thumb itself."
      >
        <div className="bg-card h-[220px] w-full max-w-md rounded-lg border">
          <OverlayScroll draggable={false} className="h-full p-4">
            {Array.from({ length: 24 }, (_, i) => (
              <p key={i} className="text-foreground/90 mb-3 text-sm">
                Line {i + 1} — thumb shown but not draggable.
              </p>
            ))}
          </OverlayScroll>
        </div>
      </Story>
    </>
  );
}
