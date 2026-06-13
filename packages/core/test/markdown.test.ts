import { describe, expect, it } from "vitest";
import { formatAnnotationsMarkdown, pageStorageKey } from "../src";
import type { Annotation } from "../src";

const annotation: Annotation = {
  id: "ann_1",
  comment: "Button needs more contrast",
  elementPath: "main > button.cta",
  timestamp: 1000,
  x: 45,
  y: 120,
  element: "button",
  url: "http://localhost:3000/",
  boundingBox: { x: 50, y: 120, width: 180, height: 44 },
  cssClasses: "cta primary",
  computedStyles: "color: rgb(0, 0, 0);",
  status: "pending"
};

describe("formatAnnotationsMarkdown", () => {
  it("serializes compact feedback", () => {
    const markdown = formatAnnotationsMarkdown([annotation], {
      detail: "compact",
      includeHeader: false
    });

    expect(markdown).toContain("main > button.cta");
    expect(markdown).toContain("Button needs more contrast");
    expect(markdown).not.toContain("# OpenTarget UI Feedback");
    expect(markdown).not.toContain("Generated:");
    expect(markdown).not.toContain("Annotations:");
    expect(markdown).not.toContain("Computed Styles");
    expect(markdown).not.toContain("Intent");
    expect(markdown).not.toContain("Severity");
    expect(markdown).not.toContain("Status");
  });

  it("includes forensic context", () => {
    const markdown = formatAnnotationsMarkdown([annotation], {
      detail: "forensic",
      includeHeader: false
    });

    expect(markdown).toContain("Position");
    expect(markdown).toContain("Computed Styles");
  });

  it("formats merged change requests for LLM copy", () => {
    const markdown = formatAnnotationsMarkdown(
      [
        {
          ...annotation,
          id: "ann_2",
          comment: "Move the CTA above the fold",
          elementPath: "main > section.hero > button",
          timestamp: 2000
        },
        annotation
      ],
      {
        mode: "change-request",
        detail: "standard",
        generatedAt: new Date("2026-06-13T01:04:26.617Z")
      }
    );

    expect(markdown).toContain("Implement these UI changes in one pass.");
    expect(markdown).toContain("Page: `http://localhost:3000/`");
    expect(markdown).toContain("Page: `http://localhost:3000/`\n\n1. Button needs more contrast");
    expect(markdown).toContain("1. Button needs more contrast");
    expect(markdown).toContain("2. Move the CTA above the fold");
    expect(markdown).toContain("- Target: `main > button.cta`");
    expect(markdown).not.toContain("# OpenTarget UI Feedback");
    expect(markdown).not.toContain("Generated:");
    expect(markdown).not.toContain("Annotations:");
    expect(markdown).not.toContain("Intent");
    expect(markdown).not.toContain("Severity");
    expect(markdown).not.toContain("Status");
  });

  it("includes destination geometry for move requests", () => {
    const markdown = formatAnnotationsMarkdown(
      [
        {
          ...annotation,
          id: "ann_move",
          comment: "Move button[Start trial] to the pointed position",
          kind: "rearrange",
          rearrange: {
            selector: "main > button.cta",
            label: "button[Start trial]",
            tagName: "button",
            originalRect: { x: 50, y: 120, width: 180, height: 44 },
            currentRect: { x: 320, y: 240, width: 180, height: 44 }
          }
        }
      ],
      {
        mode: "change-request",
        detail: "standard"
      }
    );

    expect(markdown).toContain("Move button[Start trial] to the pointed position");
    expect(markdown).toContain("- Move from: `50px, 120px (180x44px)`");
    expect(markdown).toContain("- Move to: `320px, 240px (180x44px)`");
  });
});

describe("pageStorageKey", () => {
  it("keys annotations by origin and path", () => {
    expect(pageStorageKey("https://example.com/a?b=1#c")).toBe("opentargetui:v1:page:https://example.com/a");
  });
});
