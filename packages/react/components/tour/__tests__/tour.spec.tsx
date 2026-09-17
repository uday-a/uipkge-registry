import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { Tour } from "../index";
import type { TourStep } from "../index";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

const steps: TourStep[] = [
  { title: "Welcome", description: "Get started with the app" },
  { title: "Features", description: "Explore the features" },
  { title: "Finish", description: "You are all set" },
];

describe("Tour", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <Tour open={false} steps={steps} onOpenChange={() => {}} />,
    );
    expect(container.querySelector('[data-slot="tour-card"]')).toBeNull();
    expect(document.querySelector('[data-slot="tour-card"]')).toBeNull();
  });

  it("opens tour card when open is true", () => {
    render(<Tour open steps={steps} onOpenChange={() => {}} />);
    expect(document.querySelector('[data-slot="tour-card"]')).toBeTruthy();
  });

  it("renders step title", () => {
    render(<Tour open steps={steps} onOpenChange={() => {}} />);
    expect(document.body.textContent).toContain("Welcome");
  });

  it("renders step description", () => {
    render(<Tour open steps={steps} onOpenChange={() => {}} />);
    expect(document.body.textContent).toContain("Get started with the app");
  });

  it("renders close button with aria-label", () => {
    render(<Tour open steps={steps} onOpenChange={() => {}} />);
    const closeBtn = document.querySelector('button[aria-label="Close tour"]');
    expect(closeBtn).toBeTruthy();
  });

  it("renders next button on first step", () => {
    render(<Tour open current={0} steps={steps} onOpenChange={() => {}} />);
    const buttons = document.querySelectorAll("button");
    const texts = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(texts).toContain("Next");
  });

  it("renders prev button on non-first step", () => {
    render(<Tour open current={1} steps={steps} onOpenChange={() => {}} />);
    const buttons = document.querySelectorAll("button");
    const texts = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(texts).toContain("Previous");
  });

  it("renders finish button on last step", () => {
    render(<Tour open current={2} steps={steps} onOpenChange={() => {}} />);
    const buttons = document.querySelectorAll("button");
    const texts = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(texts).toContain("Finish");
  });

  it("shows step counter", () => {
    render(<Tour open current={0} steps={steps} onOpenChange={() => {}} />);
    expect(document.body.textContent).toContain("1 / 3");
  });

  it("calls onOpenChange(false) when close button is clicked", () => {
    const onOpenChange = vi.fn();
    render(<Tour open steps={steps} onOpenChange={onOpenChange} />);
    const closeBtn = document.querySelector('button[aria-label="Close tour"]');
    if (closeBtn) {
      fireEvent.click(closeBtn);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    }
  });
});
