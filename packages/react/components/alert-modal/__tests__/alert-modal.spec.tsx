import { describe, it, expect, vi, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { AlertModal } from "../index";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

describe("AlertModal", () => {
  it("renders trigger when provided", () => {
    const { container } = render(
      <AlertModal
        trigger={<button data-testid="trigger-btn">Open</button>}
        onOpenChange={() => {}}
      />,
    );
    expect(container.querySelector('[data-testid="trigger-btn"]')).toBeTruthy();
  });

  it("opens modal when open is true", () => {
    render(<AlertModal open title="Delete?" onOpenChange={() => {}} />);
    expect(document.querySelector('[role="alertdialog"]')).toBeTruthy();
  });

  it("renders title text", () => {
    render(<AlertModal open title="Delete item?" onOpenChange={() => {}} />);
    expect(document.body.textContent).toContain("Delete item?");
  });

  it("renders description text", () => {
    render(
      <AlertModal
        open
        description="This is permanent."
        onOpenChange={() => {}}
      />,
    );
    expect(document.body.textContent).toContain("This is permanent.");
  });

  it("renders cancel button with default label", () => {
    render(<AlertModal open onOpenChange={() => {}} />);
    const buttons = document.querySelectorAll("button");
    const texts = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(texts).toContain("Cancel");
  });

  it("renders action button with default label", () => {
    render(<AlertModal open onOpenChange={() => {}} />);
    const buttons = document.querySelectorAll("button");
    const texts = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(texts).toContain("Continue");
  });

  it("hides cancel button when cancelLabel is null", () => {
    const { container } = render(
      <AlertModal open cancelLabel={null} onOpenChange={() => {}} />,
    );
    const buttons = document.querySelectorAll("button");
    const texts = Array.from(buttons).map((b) => b.textContent?.trim());
    expect(texts).not.toContain("Cancel");
  });

  it("renders icon when icon prop is set", () => {
    render(<AlertModal open icon="warning" onOpenChange={() => {}} />);
    expect(document.querySelectorAll("svg").length).toBeGreaterThan(0);
  });

  it("calls onAction when action button is clicked", () => {
    const onAction = vi.fn();
    render(<AlertModal open onAction={onAction} onOpenChange={() => {}} />);
    const buttons = document.querySelectorAll("button");
    const actionBtn = Array.from(buttons).find(
      (b) => b.textContent?.trim() === "Continue",
    );
    if (actionBtn) {
      fireEvent.click(actionBtn);
      expect(onAction).toHaveBeenCalled();
    }
  });
});
