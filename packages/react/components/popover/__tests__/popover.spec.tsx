import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverAnchor,
} from "../popover";

afterEach(cleanup);

describe("Popover", () => {
  it('PopoverTrigger renders with data-slot="popover-trigger"', () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    expect(
      container.querySelector('[data-slot="popover-trigger"]'),
    ).toBeTruthy();
  });

  it("PopoverTrigger renders as a button", () => {
    const { container } = render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    expect(
      container
        .querySelector('[data-slot="popover-trigger"]')
        ?.tagName.toLowerCase(),
    ).toBe("button");
  });

  it('PopoverContent has data-slot="popover-content" when open', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    expect(
      document.body.querySelector('[data-slot="popover-content"]'),
    ).toBeTruthy();
  });

  it("PopoverContent has data-uipkge", () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    expect(
      document.body
        .querySelector('[data-slot="popover-content"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it('PopoverContent has data-state="open" when open', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    expect(
      document.body
        .querySelector('[data-slot="popover-content"]')
        ?.getAttribute("data-state"),
    ).toBe("open");
  });

  it("PopoverContent renders children", () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>My Popover Content</PopoverContent>
      </Popover>,
    );
    expect(
      document.body.querySelector('[data-slot="popover-content"]')?.textContent,
    ).toContain("My Popover Content");
  });

  it('PopoverContent has role="dialog"', () => {
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    expect(
      document.body
        .querySelector('[data-slot="popover-content"]')
        ?.getAttribute("role"),
    ).toBe("dialog");
  });

  it("PopoverAnchor renders without crashing", () => {
    const { container } = render(
      <Popover defaultOpen>
        <PopoverAnchor asChild>
          <span>Anchor</span>
        </PopoverAnchor>
        <PopoverContent>Content</PopoverContent>
      </Popover>,
    );
    expect(
      container.querySelector('[data-slot="popover-anchor"]') ??
        document.body.querySelector('[data-slot="popover-anchor"]'),
    ).toBeTruthy();
  });
});
