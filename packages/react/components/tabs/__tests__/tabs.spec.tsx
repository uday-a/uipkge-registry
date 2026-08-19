import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../tabs";

describe("Tabs", () => {
  it('renders with data-slot="tabs"', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );
    expect(container.querySelector('[data-slot="tabs"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    );
    expect(
      container
        .querySelector('[data-slot="tabs"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it('TabsList renders with data-slot="tabs-list"', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    );
    expect(container.querySelector('[data-slot="tabs-list"]')).toBeTruthy();
  });

  it('TabsTrigger renders with data-slot="tabs-trigger"', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    );
    expect(container.querySelector('[data-slot="tabs-trigger"]')).toBeTruthy();
  });

  it('TabsContent renders with data-slot="tabs-content"', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    );
    expect(container.querySelector('[data-slot="tabs-content"]')).toBeTruthy();
  });

  it('TabsTrigger has role="tab"', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    );
    expect(
      container
        .querySelector('[data-slot="tabs-trigger"]')
        ?.getAttribute("role"),
    ).toBe("tab");
  });

  it('TabsContent has role="tabpanel"', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    );
    expect(
      container
        .querySelector('[data-slot="tabs-content"]')
        ?.getAttribute("role"),
    ).toBe("tabpanel");
  });

  it('TabsTrigger shows data-state="active" when selected', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );
    const triggers = container.querySelectorAll('[data-slot="tabs-trigger"]');
    expect(triggers[0].getAttribute("data-state")).toBe("active");
  });

  it('TabsTrigger shows data-state="inactive" when not selected', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );
    const triggers = container.querySelectorAll('[data-slot="tabs-trigger"]');
    expect(triggers[1].getAttribute("data-state")).toBe("inactive");
  });

  it("TabsTrigger renders children", () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    );
    expect(
      container.querySelector('[data-slot="tabs-trigger"]')?.textContent,
    ).toContain("Tab 1");
  });

  it("TabsContent renders children when active", () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    );
    expect(
      container.querySelector('[data-slot="tabs-content"]')?.textContent,
    ).toContain("Content 1");
  });

  it("TabsTrigger is disabled when disabled prop is true", () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>
            Tab 2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );
    const triggers = container.querySelectorAll('[data-slot="tabs-trigger"]');
    expect(triggers[1].hasAttribute("disabled")).toBe(true);
  });

  it('TabsList has data-slot="tabs-indicator" when animated', () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList animated>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    );
    expect(
      container.querySelector('[data-slot="tabs-indicator"]'),
    ).toBeTruthy();
  });

  it("Tabs applies data-orientation attribute", () => {
    const { container } = render(
      <Tabs defaultValue="tab1" orientation="vertical">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    );
    expect(
      container
        .querySelector('[data-slot="tabs"]')
        ?.getAttribute("data-orientation"),
    ).toBe("vertical");
  });

  it("TabsTrigger has aria-selected when active", () => {
    const { container } = render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );
    const triggers = container.querySelectorAll('[data-slot="tabs-trigger"]');
    expect(triggers[0].getAttribute("aria-selected")).toBe("true");
    expect(triggers[1].getAttribute("aria-selected")).toBe("false");
  });
});
