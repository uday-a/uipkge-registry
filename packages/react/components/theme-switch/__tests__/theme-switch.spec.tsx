import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light", setTheme: vi.fn() }),
}));

import { ThemeSwitch } from "../index";

describe("ThemeSwitch", () => {
  it("renders buttons in cards variant", () => {
    const { container } = render(<ThemeSwitch value="light" />);
    expect(container.querySelectorAll('button[role="radio"]').length).toBe(3);
  });

  it('cards variant has data-slot via SectionCard (data-slot="card")', () => {
    const { container } = render(<ThemeSwitch value="light" />);
    expect(container.querySelector('[data-slot="card"]')).toBeTruthy();
  });

  it("cards variant has data-uipkge via SectionCard", () => {
    const { container } = render(<ThemeSwitch value="light" />);
    expect(container.querySelector("[data-uipkge]")).toBeTruthy();
  });

  it("renders icons (SVG) for each theme option", () => {
    const { container } = render(<ThemeSwitch value="light" />);
    expect(container.querySelectorAll("svg").length).toBeGreaterThanOrEqual(3);
  });

  it("calls onValueChange when a theme button is clicked", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <ThemeSwitch value="light" onValueChange={onValueChange} />,
    );
    const buttons = container.querySelectorAll('button[role="radio"]');
    fireEvent.click(buttons[1]); // Dark
    expect(onValueChange).toHaveBeenCalledWith("dark");
  });

  it("renders label text for theme options", () => {
    const { container } = render(<ThemeSwitch value="light" />);
    expect(container.textContent).toContain("Light");
    expect(container.textContent).toContain("Dark");
    expect(container.textContent).toContain("System");
  });

  it("icon-only variant renders a single button with an icon", () => {
    const { container } = render(
      <ThemeSwitch value="light" variant="icon-only" />,
    );
    expect(container.querySelector("button")).toBeTruthy();
    expect(container.querySelector("svg")).toBeTruthy();
  });
});
