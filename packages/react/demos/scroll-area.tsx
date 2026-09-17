import Story from "../../components/story/Story";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@react-registry/card";
import { ScrollArea, ScrollBar } from "@react-registry/scroll-area";

const tags = Array.from({ length: 30 }, (_, i) => `tag-${i + 1}`);
const figures = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Figure ${i + 1}`,
  caption: `Photo by Photographer ${i + 1}`,
}));
const grid = Array.from({ length: 80 }, (_, i) => i + 1);

export default function ScrollAreaDemo() {
  return (
    <>
      <Story
        title="Default"
        description="Fixed-height container with a styled scrollbar for overflowing content."
      >
        <ScrollArea className="border-border h-48 max-w-xs rounded-md border p-4">
          <h4 className="mb-3 text-sm font-medium">Tags</h4>
          <div className="space-y-1 font-mono text-sm">
            {tags.map((t) => (
              <div key={t}>{t}</div>
            ))}
          </div>
        </ScrollArea>
      </Story>

      <Story
        title="Horizontal scroll"
        description="Long row of cards. Add a horizontal ScrollBar and let inline content overflow on the x-axis."
      >
        <ScrollArea className="border-border max-w-2xl rounded-md border whitespace-nowrap">
          <div className="flex w-max gap-4 p-4">
            {figures.map((f) => (
              <figure key={f.id} className="shrink-0">
                <div className="bg-muted text-muted-foreground grid size-32 place-items-center rounded-md text-xs">
                  {f.title}
                </div>
                <figcaption className="text-muted-foreground pt-2 text-xs">
                  {f.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Story>

      <Story
        title="Both axes"
        description="Large grid that overflows on both axes — vertical and horizontal scrollbars combine."
      >
        <ScrollArea className="border-border h-64 max-w-md rounded-md border">
          <div className="grid w-[640px] grid-cols-8 gap-2 p-4 font-mono text-xs">
            {grid.map((n) => (
              <div
                key={n}
                className="bg-muted grid aspect-square place-items-center rounded"
              >
                {n}
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Story>

      <Story
        title="Inside a card"
        description="Constrain a card body to a fixed height and make only the inner list scrollable."
      >
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle className="text-base">Activity feed</CardTitle>
            <CardDescription>Recent events, scrollable.</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <ScrollArea className="h-56 px-6">
              <ul className="space-y-3 text-sm">
                {Array.from({ length: 25 }, (_, i) => i + 1).map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="bg-muted mt-0.5 size-2 shrink-0 rounded-full" />
                    <div>
                      <p>Event #{i} — something happened.</p>
                      <p className="text-muted-foreground text-xs">
                        {i * 2} minutes ago
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </CardContent>
        </Card>
      </Story>
    </>
  );
}
