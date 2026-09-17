import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarShortcut,
} from "../menubar";

afterEach(cleanup);

function renderOpenMenubar() {
  return render(
    <Menubar defaultValue="file">
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>File</MenubarLabel>
            <MenubarItem>New Tab</MenubarItem>
            <MenubarItem variant="destructive">Exit</MenubarItem>
            <MenubarSeparator />
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>,
  );
}

function renderClosedMenubar() {
  return render(
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
      </MenubarMenu>
    </Menubar>,
  );
}

describe("Menubar", () => {
  it('renders root with data-slot="menubar"', () => {
    const { container } = renderClosedMenubar();
    expect(container.querySelector('[data-slot="menubar"]')).toBeTruthy();
  });

  it("has data-uipkge on root", () => {
    const { container } = renderClosedMenubar();
    expect(
      container
        .querySelector('[data-slot="menubar"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it('renders triggers with data-slot="menubar-trigger"', () => {
    const { container } = renderClosedMenubar();
    const triggers = container.querySelectorAll(
      '[data-slot="menubar-trigger"]',
    );
    expect(triggers.length).toBe(2);
    expect(triggers[0].textContent).toContain("File");
  });

  it("applies data-orientation on root", () => {
    const { container } = renderClosedMenubar();
    expect(
      container
        .querySelector('[data-slot="menubar"]')
        ?.getAttribute("data-orientation"),
    ).toBe("horizontal");
  });

  it('renders menu items with data-slot="menubar-item" when open', () => {
    renderOpenMenubar();
    const items = document.body.querySelectorAll('[data-slot="menubar-item"]');
    expect(items.length).toBeGreaterThanOrEqual(2);
  });

  it("items have data-uipkge", () => {
    renderOpenMenubar();
    const item = document.body.querySelector('[data-slot="menubar-item"]');
    expect(item?.hasAttribute("data-uipkge")).toBe(true);
  });

  it('renders MenubarGroup with data-slot="menubar-group" when open', () => {
    renderOpenMenubar();
    expect(
      document.body.querySelector('[data-slot="menubar-group"]'),
    ).toBeTruthy();
  });

  it('renders MenubarSeparator with data-slot="menubar-separator" when open', () => {
    renderOpenMenubar();
    expect(
      document.body.querySelector('[data-slot="menubar-separator"]'),
    ).toBeTruthy();
  });
});
