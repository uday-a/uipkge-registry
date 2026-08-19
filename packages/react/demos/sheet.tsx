import Story from "../../components/story/Story";
import { Button } from "@react-registry/button";
import { Input } from "@react-registry/input";
import { Label } from "@react-registry/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@react-registry/sheet";

export default function SheetDemo() {
  return (
    <>
      <Story
        title="Default (left)"
        description="Side panel anchored to the left edge with header, body fields, and footer action."
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open left sheet</Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 px-4 py-2">
              <div className="grid gap-2">
                <Label htmlFor="sheet-name-l">Name</Label>
                <Input id="sheet-name-l" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="sheet-username-l">Username</Label>
                <Input id="sheet-username-l" defaultValue="@peduarte" />
              </div>
            </div>
            <SheetFooter>
              <Button>Save changes</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Story>

      <Story
        title="Right (default drawer)"
        description="The most common drawer position — slides in from the trailing edge."
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open right sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Cart</SheetTitle>
              <SheetDescription>
                3 items · estimated total $182.50
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-3 px-4 py-2 text-sm">
              <div className="flex justify-between">
                <span>Mechanical keyboard</span>
                <span className="tabular-nums">$129.00</span>
              </div>
              <div className="flex justify-between">
                <span>USB-C cable (2m)</span>
                <span className="tabular-nums">$14.50</span>
              </div>
              <div className="flex justify-between">
                <span>Desk mat</span>
                <span className="tabular-nums">$39.00</span>
              </div>
            </div>
            <SheetFooter>
              <Button>Checkout</Button>
              <SheetClose asChild>
                <Button variant="outline">Continue shopping</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Story>

      <Story
        title="Top"
        description="Slides down from the top edge — good for site-wide notifications or banners."
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open top sheet</Button>
          </SheetTrigger>
          <SheetContent side="top">
            <SheetHeader>
              <SheetTitle>System maintenance scheduled</SheetTitle>
              <SheetDescription>
                We'll be performing routine maintenance on Sunday at 02:00 UTC.
                Expect brief intermittent downtime over a 30 minute window.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose asChild>
                <Button>Got it</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Story>

      <Story
        title="Bottom (mobile pattern)"
        description="Slides up from the bottom edge — the canonical mobile bottom-sheet."
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open bottom sheet</Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Refine the list with the controls below.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-3 px-4 py-2 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="filter-cat">Category</Label>
                <Input id="filter-cat" defaultValue="All" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="filter-min">Min price</Label>
                <Input id="filter-min" defaultValue="0" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="filter-max">Max price</Label>
                <Input id="filter-max" defaultValue="500" />
              </div>
            </div>
            <SheetFooter>
              <Button>Apply</Button>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Story>

      <Story
        title="Long scrollable content"
        description="The body region scrolls independently when content overflows the panel height."
      >
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open scrollable sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Release notes</SheetTitle>
              <SheetDescription>
                Highlights from the last several versions.
              </SheetDescription>
            </SheetHeader>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-2 text-sm">
              {Array.from({ length: 12 }, (_, idx) => {
                const i = idx + 1;
                return (
                  <section key={i} className="space-y-1">
                    <h4 className="font-medium">v1.{12 - i + 1}.0</h4>
                    <p className="text-muted-foreground">
                      Notes for release v1.{12 - i + 1}.0 — fixes, features, and
                      assorted improvements across the registry. Multiple
                      paragraphs of placeholder copy keep the body tall enough
                      that scrolling becomes necessary on most viewport heights.
                    </p>
                    <p className="text-muted-foreground">
                      Additional context for v1.{12 - i + 1}.0 with deprecation
                      notes and migration steps where relevant.
                    </p>
                  </section>
                );
              })}
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button>Close</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Story>
    </>
  );
}
