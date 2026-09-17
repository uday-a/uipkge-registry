import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../collapsible";

describe("Collapsible", () => {
  it('renders with data-slot="collapsible"', () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );
    expect(container.querySelector('[data-slot="collapsible"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );
    expect(
      container
        .querySelector('[data-slot="collapsible"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it('CollapsibleTrigger renders with data-slot="collapsible-trigger"', () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );
    expect(
      container.querySelector('[data-slot="collapsible-trigger"]'),
    ).toBeTruthy();
  });

  it('CollapsibleContent renders with data-slot="collapsible-content" when open', () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );
    expect(
      container.querySelector('[data-slot="collapsible-content"]'),
    ).toBeTruthy();
  });

  it("CollapsibleTrigger is a button", () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );
    expect(
      container
        .querySelector('[data-slot="collapsible-trigger"]')
        ?.tagName.toLowerCase(),
    ).toBe("button");
  });

  it('Collapsible shows data-state="open" when open', () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );
    expect(
      container
        .querySelector('[data-slot="collapsible"]')
        ?.getAttribute("data-state"),
    ).toBe("open");
  });

  it('Collapsible shows data-state="closed" when closed', () => {
    const { container } = render(
      <Collapsible defaultOpen={false}>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );
    expect(
      container
        .querySelector('[data-slot="collapsible"]')
        ?.getAttribute("data-state"),
    ).toBe("closed");
  });

  it("CollapsibleContent renders children when open", () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>Content body</CollapsibleContent>
      </Collapsible>,
    );
    expect(
      container.querySelector('[data-slot="collapsible-content"]')?.textContent,
    ).toContain("Content body");
  });

  it("CollapsibleTrigger renders children", () => {
    const { container } = render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger>Trigger text</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>,
    );
    expect(
      container.querySelector('[data-slot="collapsible-trigger"]')?.textContent,
    ).toContain("Trigger text");
  });
});
