import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Inbox } from "lucide-react";
import { EmptyState } from "../index";

describe("EmptyState", () => {
  it("renders a container div", () => {
    const { container } = render(<EmptyState />);
    expect(container.querySelector("div")).toBeTruthy();
  });

  it("renders icon when icon prop is provided", () => {
    const { container } = render(<EmptyState icon={Inbox} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renders title text when title prop is provided", () => {
    const { container } = render(<EmptyState title="No results" />);
    expect(container.textContent).toContain("No results");
    expect(container.querySelector("h3")).toBeTruthy();
  });

  it("renders description text when description prop is provided", () => {
    const { container } = render(
      <EmptyState description="Try adjusting filters" />,
    );
    expect(container.textContent).toContain("Try adjusting filters");
  });

  it("renders action button via children", () => {
    const { container } = render(
      <EmptyState>
        <button>Action</button>
      </EmptyState>,
    );
    expect(container.querySelector("button")).toBeTruthy();
    expect(container.textContent).toContain("Action");
  });

  it('has role="status" by default', () => {
    const { container } = render(<EmptyState />);
    expect(container.querySelector("div")?.getAttribute("role")).toBe("status");
  });

  it("uses custom heading tag when headingTag prop is set", () => {
    const { container } = render(<EmptyState title="Title" headingTag="h2" />);
    expect(container.querySelector("h2")).toBeTruthy();
  });
});
