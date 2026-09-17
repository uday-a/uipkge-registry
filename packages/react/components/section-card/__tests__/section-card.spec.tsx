import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { SectionCard } from "../index";

describe("SectionCard", () => {
  it('renders container with data-slot="card" (via Card)', () => {
    const { container } = render(<SectionCard title="My Title" />);
    expect(container.querySelector('[data-slot="card"]')).toBeTruthy();
  });

  it("has data-uipkge (via Card)", () => {
    const { container } = render(<SectionCard title="My Title" />);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders the title", () => {
    const { container } = render(<SectionCard title="My Title" />);
    expect(container.textContent).toContain("My Title");
  });

  it("renders the description when provided", () => {
    const { container } = render(
      <SectionCard title="T" description="A description" />,
    );
    expect(container.textContent).toContain("A description");
  });

  it("does not render description when omitted", () => {
    const { container } = render(<SectionCard title="T" />);
    expect(
      container.querySelector('[data-slot="card-description"]'),
    ).toBeNull();
  });

  it("renders children content", () => {
    const { container } = render(
      <SectionCard title="T">Body content</SectionCard>,
    );
    expect(container.textContent).toContain("Body content");
  });

  it("renders headerAction prop", () => {
    const { container } = render(
      <SectionCard title="T" headerAction={<button>Action</button>} />,
    );
    expect(container.textContent).toContain("Action");
  });

  it("renders footer prop", () => {
    const { container } = render(
      <SectionCard title="T" footer={<div>Footer text</div>} />,
    );
    expect(container.textContent).toContain("Footer text");
  });
});
