import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
} from "../index";

// Sidebar uses useSidebar() which requires SidebarProvider context.
// Wrap in a template that provides the context.
function mountSidebar(template: string, props: Record<string, unknown> = {}) {
  return mount(
    {
      components: {
        SidebarProvider,
        Sidebar,
        SidebarContent,
        SidebarMenu,
        SidebarMenuItem,
        SidebarTrigger,
      },
      data() {
        return { sidebarProps: props };
      },
      template,
    },
    { attachTo: document.body },
  );
}

describe("Sidebar", () => {
  it('renders root with data-slot="sidebar"', () => {
    const w = mountSidebar(
      '<SidebarProvider><Sidebar collapsible="none" /></SidebarProvider>',
    );
    expect(w.find('[data-slot="sidebar"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge on root", () => {
    const w = mountSidebar(
      '<SidebarProvider><Sidebar collapsible="none" /></SidebarProvider>',
    );
    expect(w.find('[data-slot="sidebar"][data-uipkge]').exists()).toBe(true);
    w.unmount();
  });

  it("applies data-state on desktop sidebar", () => {
    const w = mountSidebar("<SidebarProvider><Sidebar /></SidebarProvider>");
    const sidebar = w.find('[data-slot="sidebar"]');
    expect(sidebar.exists()).toBe(true);
    expect(sidebar.attributes("data-state")).toBe("expanded");
    w.unmount();
  });

  it("applies data-collapsible attribute on desktop sidebar", () => {
    const w = mountSidebar("<SidebarProvider><Sidebar /></SidebarProvider>");
    const sidebar = w.find('[data-slot="sidebar"]');
    expect(sidebar.attributes("data-collapsible")).toBeDefined();
    w.unmount();
  });

  it("applies data-variant and data-side attributes", () => {
    const w = mountSidebar(
      '<SidebarProvider><Sidebar side="right" variant="floating" /></SidebarProvider>',
    );
    const sidebar = w.find('[data-slot="sidebar"]');
    expect(sidebar.attributes("data-variant")).toBe("floating");
    expect(sidebar.attributes("data-side")).toBe("right");
    w.unmount();
  });
});

describe("SidebarProvider", () => {
  it('renders with data-slot="sidebar-wrapper"', () => {
    const w = mountSidebar(
      '<SidebarProvider><Sidebar collapsible="none" /></SidebarProvider>',
    );
    expect(w.find('[data-slot="sidebar-wrapper"]').exists()).toBe(true);
    w.unmount();
  });

  it("has data-uipkge on wrapper", () => {
    const w = mountSidebar(
      '<SidebarProvider><Sidebar collapsible="none" /></SidebarProvider>',
    );
    expect(w.find('[data-slot="sidebar-wrapper"][data-uipkge]').exists()).toBe(
      true,
    );
    w.unmount();
  });
});

describe("SidebarContent", () => {
  it('renders with data-slot="sidebar-content" and data-uipkge', () => {
    const w = mountSidebar(
      '<SidebarProvider><Sidebar collapsible="none"><SidebarContent>Content</SidebarContent></Sidebar></SidebarProvider>',
    );
    const content = w.find('[data-slot="sidebar-content"]');
    expect(content.exists()).toBe(true);
    expect(content.attributes("data-uipkge")).toBeDefined();
    w.unmount();
  });
});

describe("SidebarMenu", () => {
  it('renders with data-slot="sidebar-menu" and data-uipkge', () => {
    const w = mountSidebar(
      '<SidebarProvider><Sidebar collapsible="none"><SidebarContent><SidebarMenu>Menu</SidebarMenu></SidebarContent></Sidebar></SidebarProvider>',
    );
    const menu = w.find('[data-slot="sidebar-menu"]');
    expect(menu.exists()).toBe(true);
    expect(menu.attributes("data-uipkge")).toBeDefined();
    w.unmount();
  });
});

describe("SidebarMenuItem", () => {
  it('renders with data-slot="sidebar-menu-item" and data-uipkge', () => {
    const w = mountSidebar(
      '<SidebarProvider><Sidebar collapsible="none"><SidebarContent><SidebarMenu><SidebarMenuItem>Item</SidebarMenuItem></SidebarMenu></SidebarContent></Sidebar></SidebarProvider>',
    );
    const item = w.find('[data-slot="sidebar-menu-item"]');
    expect(item.exists()).toBe(true);
    expect(item.attributes("data-uipkge")).toBeDefined();
    w.unmount();
  });
});

describe("SidebarTrigger", () => {
  it('renders a button with data-slot="sidebar-trigger" and data-uipkge', () => {
    const w = mountSidebar(
      '<SidebarProvider><Sidebar collapsible="none"><SidebarTrigger /></Sidebar></SidebarProvider>',
    );
    const trigger = w.find('[data-slot="sidebar-trigger"]');
    expect(trigger.exists()).toBe(true);
    expect(trigger.attributes("data-uipkge")).toBeDefined();
    expect(trigger.element.tagName.toLowerCase()).toBe("button");
    w.unmount();
  });
});
