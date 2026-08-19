import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "../sheet";

afterEach(cleanup);

describe("Sheet", () => {
  it('SheetTrigger renders with data-slot="sheet-trigger"', () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
      </Sheet>,
    );
    expect(container.querySelector('[data-slot="sheet-trigger"]')).toBeTruthy();
  });

  it("SheetTrigger renders as a button", () => {
    const { container } = render(
      <Sheet>
        <SheetTrigger>Open</SheetTrigger>
      </Sheet>,
    );
    expect(
      container
        .querySelector('[data-slot="sheet-trigger"]')
        ?.tagName.toLowerCase(),
    ).toBe("button");
  });

  it('SheetContent has data-slot="sheet-content" when open', () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Desc</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );
    expect(
      document.body.querySelector('[data-slot="sheet-content"]'),
    ).toBeTruthy();
  });

  it("SheetContent has data-uipkge", () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Desc</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );
    expect(
      document.body
        .querySelector('[data-slot="sheet-content"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it('SheetContent has data-state="open" when open', () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Desc</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );
    expect(
      document.body
        .querySelector('[data-slot="sheet-content"]')
        ?.getAttribute("data-state"),
    ).toBe("open");
  });

  it("SheetContent renders close button", () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Desc</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );
    // SheetContent renders a built-in close button (DialogPrimitive.Close) with an X icon
    expect(
      document.body.querySelector('[data-slot="sheet-content"] svg'),
    ).toBeTruthy();
  });

  it('SheetHeader renders with data-slot="sheet-header"', () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Desc</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );
    expect(
      document.body.querySelector('[data-slot="sheet-header"]'),
    ).toBeTruthy();
  });

  it('SheetFooter renders with data-slot="sheet-footer"', () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetFooter>Footer</SheetFooter>
        </SheetContent>
      </Sheet>,
    );
    expect(
      document.body.querySelector('[data-slot="sheet-footer"]'),
    ).toBeTruthy();
  });

  it('SheetTitle renders with data-slot="sheet-title"', () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Desc</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );
    expect(
      document.body.querySelector('[data-slot="sheet-title"]'),
    ).toBeTruthy();
  });

  it('SheetDescription renders with data-slot="sheet-description"', () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Title</SheetTitle>
            <SheetDescription>Desc</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );
    expect(
      document.body.querySelector('[data-slot="sheet-description"]'),
    ).toBeTruthy();
  });

  it('SheetClose renders with data-slot="sheet-close"', () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetClose>Close</SheetClose>
        </SheetContent>
      </Sheet>,
    );
    const closes = document.body.querySelectorAll('[data-slot="sheet-close"]');
    expect(closes.length).toBeGreaterThan(0);
  });

  it("SheetContent renders title text when open", () => {
    render(
      <Sheet defaultOpen>
        <SheetTrigger>Open</SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>My Sheet Title</SheetTitle>
            <SheetDescription>Desc</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>,
    );
    expect(document.body.textContent).toContain("My Sheet Title");
  });
});
