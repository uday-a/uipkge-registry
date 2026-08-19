import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../resizable";

describe("Resizable", () => {
  it('ResizablePanelGroup renders with data-slot="resizable-panel-group"', () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(
      container.querySelector('[data-slot="resizable-panel-group"]'),
    ).toBeTruthy();
  });

  it("ResizablePanelGroup has data-uipkge", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(
      container
        .querySelector('[data-slot="resizable-panel-group"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it('ResizablePanel renders with data-slot="resizable-panel"', () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(
      container.querySelector('[data-slot="resizable-panel"]'),
    ).toBeTruthy();
  });

  it("ResizablePanel has data-uipkge", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(
      container
        .querySelector('[data-slot="resizable-panel"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it('ResizableHandle renders with data-slot="resizable-handle"', () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Panel 2</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(
      container.querySelector('[data-slot="resizable-handle"]'),
    ).toBeTruthy();
  });

  it("ResizableHandle has data-uipkge", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Panel 2</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(
      container
        .querySelector('[data-slot="resizable-handle"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("ResizableHandle renders grip icon when withHandle is true", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>Panel 2</ResizablePanel>
      </ResizablePanelGroup>,
    );
    const handle = container.querySelector('[data-slot="resizable-handle"]');
    expect(handle?.querySelector("svg")).toBeTruthy();
  });

  it("ResizableHandle does not render grip icon when withHandle is false", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Panel 2</ResizablePanel>
      </ResizablePanelGroup>,
    );
    const handle = container.querySelector('[data-slot="resizable-handle"]');
    expect(handle?.querySelector("svg")).toBeNull();
  });

  it("Panels render children", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>Panel 1</ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>Panel 2</ResizablePanel>
      </ResizablePanelGroup>,
    );
    expect(container.textContent).toContain("Panel 1");
    expect(container.textContent).toContain("Panel 2");
  });
});
