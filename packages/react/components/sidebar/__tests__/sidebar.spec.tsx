import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "../index";

describe("Sidebar", () => {
  it('renders root with data-slot="sidebar"', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="none" />
      </SidebarProvider>,
    );
    expect(container.querySelector('[data-slot="sidebar"]')).toBeTruthy();
  });

  it("has data-uipkge on root", () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="none" />
      </SidebarProvider>,
    );
    expect(
      container.querySelector('[data-slot="sidebar"][data-uipkge]'),
    ).toBeTruthy();
  });

  it("applies data-state on desktop sidebar", () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar />
      </SidebarProvider>,
    );
    const sidebar = container.querySelector('[data-slot="sidebar"]');
    expect(sidebar).toBeTruthy();
    expect(sidebar?.getAttribute("data-state")).toBe("expanded");
  });

  it("applies data-collapsible attribute on desktop sidebar", () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar />
      </SidebarProvider>,
    );
    const sidebar = container.querySelector('[data-slot="sidebar"]');
    expect(sidebar?.getAttribute("data-collapsible")).toBeDefined();
  });

  it("applies data-variant and data-side attributes", () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar side="right" variant="floating" />
      </SidebarProvider>,
    );
    const sidebar = container.querySelector('[data-slot="sidebar"]');
    expect(sidebar?.getAttribute("data-variant")).toBe("floating");
    expect(sidebar?.getAttribute("data-side")).toBe("right");
  });
});

describe("SidebarProvider", () => {
  it('renders with data-slot="sidebar-wrapper"', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="none" />
      </SidebarProvider>,
    );
    expect(
      container.querySelector('[data-slot="sidebar-wrapper"]'),
    ).toBeTruthy();
  });

  it("has data-uipkge on wrapper", () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="none" />
      </SidebarProvider>,
    );
    expect(
      container.querySelector('[data-slot="sidebar-wrapper"][data-uipkge]'),
    ).toBeTruthy();
  });
});

describe("SidebarContent", () => {
  it('renders with data-slot="sidebar-content" and data-uipkge', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarContent>Content</SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );
    const content = container.querySelector('[data-slot="sidebar-content"]');
    expect(content).toBeTruthy();
    expect(content?.getAttribute("data-uipkge")).toBeDefined();
  });
});

describe("SidebarMenu", () => {
  it('renders with data-slot="sidebar-menu" and data-uipkge', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarContent>
            <SidebarMenu>Menu</SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );
    const menu = container.querySelector('[data-slot="sidebar-menu"]');
    expect(menu).toBeTruthy();
    expect(menu?.getAttribute("data-uipkge")).toBeDefined();
  });
});

describe("SidebarMenuItem", () => {
  it('renders with data-slot="sidebar-menu-item" and data-uipkge', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>Item</SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    );
    const item = container.querySelector('[data-slot="sidebar-menu-item"]');
    expect(item).toBeTruthy();
    expect(item?.getAttribute("data-uipkge")).toBeDefined();
  });
});

describe("SidebarTrigger", () => {
  it('renders a button with data-slot="sidebar-trigger" and data-uipkge', () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarTrigger />
        </Sidebar>
      </SidebarProvider>,
    );
    const trigger = container.querySelector('[data-slot="sidebar-trigger"]');
    expect(trigger).toBeTruthy();
    expect(trigger?.getAttribute("data-uipkge")).toBeDefined();
    expect(trigger?.tagName.toLowerCase()).toBe("button");
  });
});
