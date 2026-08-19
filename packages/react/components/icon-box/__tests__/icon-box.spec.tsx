import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { IconBox } from "../index";

const StubIcon = (props: { className?: string }) => (
  <svg data-testid="stub-icon" className={props.className} />
);

describe("IconBox", () => {
  it('renders with data-slot="icon-box"', () => {
    const { container } = render(<IconBox icon={StubIcon} />);
    expect(container.querySelector('[data-slot="icon-box"]')).toBeTruthy();
  });

  it("has data-uipkge", () => {
    const { container } = render(<IconBox icon={StubIcon} />);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders as a div container", () => {
    const { container } = render(<IconBox icon={StubIcon} />);
    expect(
      container.querySelector('[data-slot="icon-box"]')?.tagName.toLowerCase(),
    ).toBe("div");
  });

  it("renders the icon component inside", () => {
    const { container } = render(<IconBox icon={StubIcon} />);
    expect(
      container.querySelector('svg[data-testid="stub-icon"]'),
    ).toBeTruthy();
  });

  it("applies primary variant classes by default", () => {
    const { container } = render(<IconBox icon={StubIcon} />);
    const el = container.querySelector('[data-slot="icon-box"]');
    expect(el?.className).toContain("bg-primary/10");
    expect(el?.className).toContain("text-primary");
  });

  it("applies muted variant classes", () => {
    const { container } = render(<IconBox icon={StubIcon} variant="muted" />);
    const el = container.querySelector('[data-slot="icon-box"]');
    expect(el?.className).toContain("bg-muted");
    expect(el?.className).toContain("text-muted-foreground");
  });

  it("applies size classes for sm", () => {
    const { container } = render(<IconBox icon={StubIcon} size="sm" />);
    expect(
      container.querySelector('[data-slot="icon-box"]')?.className,
    ).toContain("p-1.5");
  });

  it("applies circle shape classes", () => {
    const { container } = render(<IconBox icon={StubIcon} shape="circle" />);
    expect(
      container.querySelector('[data-slot="icon-box"]')?.className,
    ).toContain("rounded-full");
  });
});
