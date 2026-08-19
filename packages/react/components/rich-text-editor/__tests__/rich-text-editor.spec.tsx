import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { RichTextEditor } from "../rich-text-editor";

afterEach(cleanup);

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
    expect(el?.className).toContain("custom-editor");
    expect(el?.className).toContain("rich-text-editor");
  });
});
