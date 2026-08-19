import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "light" }),
}));

import { Toaster } from "../Sonner";

describe("Toaster", () => {
  it("renders without crashing", () => {
    const { container } = render(<Toaster />);
    expect(container).toBeTruthy();
  });

  it("renders a section element as the toaster container", () => {
    const { container } = render(<Toaster />);
    expect(container.querySelector("section")).toBeTruthy();
  });

  it("renders with default position", () => {
    const { container } = render(<Toaster />);
    // Sonner renders a <section> with aria-label for the toast region.
    const section = container.querySelector("section");
    expect(section).toBeTruthy();
    expect(section?.getAttribute("aria-label")).toContain("Notifications");
  });

  it("accepts custom position prop", () => {
    const { container } = render(<Toaster position="top-center" />);
    expect(container.querySelector("section")).toBeTruthy();
  });
});
