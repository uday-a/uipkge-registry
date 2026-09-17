import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Transfer } from "../transfer";

describe("Transfer", () => {
  it('renders with data-slot="transfer"', () => {
    const { container } = render(
      <Transfer
        dataSource={[
          { key: "1", label: "Item 1" },
          { key: "2", label: "Item 2" },
        ]}
        targetKeys={[]}
      />,
    );
    expect(container.querySelector('[data-slot="transfer"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(
      <Transfer dataSource={[{ key: "1", label: "Item 1" }]} targetKeys={[]} />,
    );
    expect(
      container
        .querySelector('[data-slot="transfer"]')
        ?.hasAttribute("data-uipkge"),
    ).toBe(true);
  });

  it("renders two lists", () => {
    const { container } = render(
      <Transfer
        dataSource={[
          { key: "1", label: "Item 1" },
          { key: "2", label: "Item 2" },
        ]}
        targetKeys={[]}
      />,
    );
    const lists = container.querySelectorAll('[role="listbox"]');
    expect(lists.length).toBe(2);
  });

  it("renders titles", () => {
    const { container } = render(
      <Transfer
        dataSource={[{ key: "1", label: "Item 1" }]}
        targetKeys={[]}
        titles={["Source", "Target"]}
      />,
    );
    expect(container.textContent).toContain("Source");
    expect(container.textContent).toContain("Target");
  });

  it("renders items from dataSource", () => {
    const { container } = render(
      <Transfer
        dataSource={[
          { key: "1", label: "Item 1" },
          { key: "2", label: "Item 2" },
        ]}
        targetKeys={[]}
      />,
    );
    expect(container.textContent).toContain("Item 1");
    expect(container.textContent).toContain("Item 2");
  });

  it("shows search when showSearch is true", () => {
    const { container } = render(
      <Transfer
        dataSource={[{ key: "1", label: "Item 1" }]}
        targetKeys={[]}
        showSearch
      />,
    );
    const search = container.querySelector('input[aria-label^="Search"]');
    expect(search).toBeTruthy();
  });

  it("does not show search when showSearch is false", () => {
    const { container } = render(
      <Transfer
        dataSource={[{ key: "1", label: "Item 1" }]}
        targetKeys={[]}
        showSearch={false}
      />,
    );
    const search = container.querySelector('input[aria-label^="Search"]');
    expect(search).toBeNull();
  });

  it("disables when disabled", () => {
    const { container } = render(
      <Transfer
        dataSource={[{ key: "1", label: "Item 1" }]}
        targetKeys={[]}
        disabled
      />,
    );
    const options = container.querySelectorAll('[role="option"]');
    expect(options.length).toBeGreaterThan(0);
    expect(options[0].getAttribute("tabindex")).toBe("-1");
  });

  it("renders operation buttons", () => {
    const { container } = render(
      <Transfer dataSource={[{ key: "1", label: "Item 1" }]} targetKeys={[]} />,
    );
    const moveRight = container.querySelector(
      'button[aria-label="Move selected to right"]',
    );
    const moveLeft = container.querySelector(
      'button[aria-label="Move selected to left"]',
    );
    expect(moveRight).toBeTruthy();
    expect(moveLeft).toBeTruthy();
  });

  it('renders options with role="option"', () => {
    const { container } = render(
      <Transfer
        dataSource={[
          { key: "1", label: "Item 1" },
          { key: "2", label: "Item 2" },
        ]}
        targetKeys={[]}
      />,
    );
    const options = container.querySelectorAll('[role="option"]');
    expect(options.length).toBe(2);
  });
});
