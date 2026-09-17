import { describe, it, expect, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
} from "../context-menu";

afterEach(cleanup);

function renderOpenMenu(children: React.ReactNode) {
  const { container } = render(
    <ContextMenu>
      <ContextMenuTrigger>Right click</ContextMenuTrigger>
      <ContextMenuContent>{children}</ContextMenuContent>
    </ContextMenu>,
  );
  const trigger = container.querySelector(
    '[data-slot="context-menu-trigger"]',
  )!;
  fireEvent.contextMenu(trigger);
  return { container };
}

describe("ContextMenu", () => {
  it('ContextMenuTrigger renders with data-slot="context-menu-trigger"', () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenuTrigger>Right click</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    );
    expect(
      container.querySelector('[data-slot="context-menu-trigger"]'),
    ).toBeTruthy();
  });

  it('ContextMenuItem has data-slot="context-menu-item" when open', () => {
    renderOpenMenu(<ContextMenuItem>Item 1</ContextMenuItem>);
    expect(
      document.body.querySelector('[data-slot="context-menu-item"]'),
    ).toBeTruthy();
  });

  it("ContextMenuItem has data-uipkge", () => {
    renderOpenMenu(<ContextMenuItem>Item 1</ContextMenuItem>);
    expect(
      document.body
        .querySelector('[data-slot="context-menu-item"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("ContextMenuItem applies data-inset when inset is true", () => {
    renderOpenMenu(<ContextMenuItem inset>Item 1</ContextMenuItem>);
    expect(
      document.body
        .querySelector('[data-slot="context-menu-item"]')
        ?.hasAttribute("data-inset"),
    ).toBe(true);
  });

  it("ContextMenuItem applies data-variant when variant is destructive", () => {
    renderOpenMenu(
      <ContextMenuItem variant="destructive">Delete</ContextMenuItem>,
    );
    expect(
      document.body
        .querySelector('[data-slot="context-menu-item"]')
        ?.getAttribute("data-variant"),
    ).toBe("destructive");
  });

  it('ContextMenuContent has data-slot="context-menu-content" when open', () => {
    renderOpenMenu(<ContextMenuItem>Item 1</ContextMenuItem>);
    expect(
      document.body.querySelector('[data-slot="context-menu-content"]'),
    ).toBeTruthy();
  });

  it('ContextMenuLabel renders with data-slot="context-menu-label"', () => {
    renderOpenMenu(
      <>
        <ContextMenuLabel>Label</ContextMenuLabel>
        <ContextMenuItem>Item 1</ContextMenuItem>
      </>,
    );
    expect(
      document.body.querySelector('[data-slot="context-menu-label"]'),
    ).toBeTruthy();
  });

  it('ContextMenuSeparator renders with data-slot="context-menu-separator"', () => {
    renderOpenMenu(
      <>
        <ContextMenuItem>Item 1</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Item 2</ContextMenuItem>
      </>,
    );
    expect(
      document.body.querySelector('[data-slot="context-menu-separator"]'),
    ).toBeTruthy();
  });

  it("ContextMenuItem renders children", () => {
    renderOpenMenu(<ContextMenuItem>My Item Text</ContextMenuItem>);
    expect(
      document.body.querySelector('[data-slot="context-menu-item"]')
        ?.textContent,
    ).toContain("My Item Text");
  });
});
