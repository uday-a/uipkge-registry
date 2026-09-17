import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, fireEvent } from "@testing-library/react";
import { RichTextEditor } from "../rich-text-editor";

afterEach(cleanup);

/** Toolbar controls are labelled, not ordered — find by accessible name. */
function control(container: HTMLElement, label: string) {
  return Array.from(container.querySelectorAll("button")).find(
    (b) => b.getAttribute("aria-label") === label,
  );
}

describe("RichTextEditor (React)", () => {
  it('renders container with data-slot="rich-text-editor"', () => {
    const { container } = render(<RichTextEditor placeholder="Type here..." />);
    expect(
      container.querySelector('[data-slot="rich-text-editor"]'),
    ).toBeTruthy();
  });

  it("renders editor content area and applies classes", () => {
    const { container } = render(
      <RichTextEditor
        value="<p>Initial content</p>"
        className="custom-editor"
      />,
    );
    const el = container.querySelector('[data-slot="rich-text-editor"]');
    expect(el?.classList.contains("custom-editor")).toBe(true);
  });

  it("renders the incoming value as editable content", () => {
    const { container } = render(
      <RichTextEditor value="<p>Initial text</p>" />,
    );
    const surface = container.querySelector(".tiptap");

    expect(surface).toBeTruthy();
    expect(surface?.getAttribute("contenteditable")).toBe("true");
    expect(container.textContent).toContain("Initial text");
  });

  it("exposes a labelled formatting toolbar", () => {
    const { container } = render(<RichTextEditor value="<p>Hi</p>" />);
    const toolbar = container.querySelector('[role="toolbar"]');

    expect(toolbar).toBeTruthy();
    expect(toolbar?.getAttribute("aria-label")).toBe("Text formatting");
    for (const label of [
      "Bold",
      "Italic",
      "Underline",
      "Bullet list",
      "Link",
      "Undo",
      "Redo",
    ]) {
      expect(
        control(container, label),
        `missing control: ${label}`,
      ).toBeTruthy();
    }
  });

  it("reflects the active mark on its toolbar toggle", () => {
    const { container } = render(<RichTextEditor value="<p>Hello</p>" />);
    const bold = control(container, "Bold")!;

    expect(bold.getAttribute("aria-pressed")).toBe("false");

    fireEvent.click(bold);

    // Bold is armed for the next keystroke, so the control reads as pressed
    // even though a collapsed selection leaves the document unchanged.
    expect(bold.getAttribute("aria-pressed")).toBe("true");
    expect(bold.getAttribute("data-state")).toBe("on");
  });

  it("announces the extended toolbar row as expanded when opened", () => {
    const { container } = render(<RichTextEditor value="<p>Hi</p>" />);
    const expand = control(container, "Show more options")!;

    expect(expand.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(expand);

    expect(expand.getAttribute("aria-expanded")).toBe("true");
    expect(expand.getAttribute("aria-label")).toBe("Hide more options");
    // Heading / alignment / task-list controls live in that second row.
    expect(control(container, "Heading 1")).toBeTruthy();
    expect(control(container, "Align center")).toBeTruthy();
  });

  // The link control used to be window.prompt — unstyleable, untestable and
  // blocked in sandboxed iframes. These cover the popover that replaced it.
  it("opens a labelled URL field instead of a native prompt", () => {
    const { container } = render(<RichTextEditor value="<p>Hello</p>" />);

    fireEvent.click(control(container, "Link")!);

    const field = document.querySelector<HTMLInputElement>(
      '[data-slot="popover-content"] input',
    );
    expect(field).toBeTruthy();
    expect(field!.type).toBe("url");
    expect(
      document
        .querySelector('[data-slot="popover-content"] label')
        ?.textContent?.trim(),
    ).toBe("Link URL");
  });

  it("closes the popover once a URL is submitted", () => {
    // Applying the mark itself needs a real ProseMirror selection, which this
    // environment cannot produce; that path is covered in the browser. What is
    // testable here is that the form commits and dismisses.
    const { container } = render(<RichTextEditor value="<p>Hello</p>" />);

    fireEvent.click(control(container, "Link")!);
    const field = document.querySelector<HTMLInputElement>(
      '[data-slot="popover-content"] input',
    )!;
    fireEvent.change(field, { target: { value: "https://uipkge.dev" } });
    fireEvent.submit(
      document.querySelector('[data-slot="popover-content"] form')!,
    );

    expect(document.querySelector('[data-slot="popover-content"]')).toBeNull();
  });

  it("keeps Apply disabled until a URL is typed", () => {
    const { container } = render(<RichTextEditor value="<p>Hello</p>" />);

    fireEvent.click(control(container, "Link")!);

    const apply = Array.from(
      document.querySelectorAll<HTMLButtonElement>(
        '[data-slot="popover-content"] button',
      ),
    ).find((b) => b.textContent?.trim() === "Apply");
    expect(apply?.disabled).toBe(true);
  });

  it("renders content updates pushed in through the value prop", () => {
    const { container, rerender } = render(
      <RichTextEditor value="<p>First</p>" />,
    );
    expect(container.textContent).toContain("First");

    rerender(<RichTextEditor value="<p>Second</p>" />);

    expect(container.textContent).toContain("Second");
    expect(container.textContent).not.toContain("First");
  });

  it("applies the configured minimum height to the editing surface", () => {
    const { container } = render(
      <RichTextEditor value="<p>Hi</p>" minHeight="240px" />,
    );
    expect(container.innerHTML).toContain("240px");
  });
});
