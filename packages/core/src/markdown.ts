import type { Annotation, MarkdownOptions, OutputDetail, RectSnapshot } from "./types.js";

function line(label: string, value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  return `**${label}:** ${String(value)}`;
}

function rect(annotation: Annotation): string | null {
  if (!annotation.boundingBox) return null;
  const b = annotation.boundingBox;
  return `${Math.round(b.x)}px, ${Math.round(b.y)}px (${Math.round(b.width)}x${Math.round(b.height)}px)`;
}

function rectSnapshot(value: RectSnapshot): string {
  return `${Math.round(value.x)}px, ${Math.round(value.y)}px (${Math.round(value.width)}x${Math.round(value.height)}px)`;
}

function codeBlock(label: string, value?: string): string | null {
  if (!value) return null;
  return `**${label}:**\n\n\`\`\`\n${value.trim()}\n\`\`\``;
}

function codeSpan(value: string): string {
  const text = value.trim();
  if (!text) return "";
  if (!text.includes("`")) return `\`${text}\``;
  return `\`\` ${text} \`\``;
}

function quoteInline(value: string): string {
  return `"${value.replace(/\s+/g, " ").trim()}"`;
}

function uniqueValues(values: Array<string | undefined>): string[] {
  return [...new Set(values.map((value) => value?.trim()).filter(Boolean) as string[])];
}

function commentLines(comment: string, index: number): string[] {
  const lines = comment
    .trim()
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  if (lines.length === 0) return [`${index + 1}. Change the selected target`];
  return [`${index + 1}. ${lines[0]}`, ...lines.slice(1).map((item) => `   ${item}`)];
}

function formatChangeRequestAnnotation(
  annotation: Annotation,
  index: number,
  detail: OutputDetail,
  includeUrl: boolean
): string {
  const lines = [
    ...commentLines(annotation.comment, index),
    `   - Target: ${codeSpan(annotation.elementPath)}`,
    annotation.element ? `   - Element: ${codeSpan(annotation.element)}` : null,
    includeUrl && annotation.url ? `   - URL: ${codeSpan(annotation.url)}` : null,
    annotation.selectedText ? `   - Selected text: ${quoteInline(annotation.selectedText)}` : null,
    annotation.rearrange ? `   - Move from: ${codeSpan(rectSnapshot(annotation.rearrange.originalRect))}` : null,
    annotation.rearrange ? `   - Move to: ${codeSpan(rectSnapshot(annotation.rearrange.currentRect))}` : null
  ].filter(Boolean) as string[];

  if (detail === "compact" || detail === "standard") return lines.join("\n");

  lines.push(
    ...[
      line("Position", rect(annotation)),
      line("Classes", annotation.cssClasses),
      line("Accessibility", annotation.accessibility),
      line("Nearby Text", annotation.nearbyText)
    ]
      .filter(Boolean)
      .map((item) => `   - ${item}`)
  );

  if (detail === "detailed") return lines.join("\n");

  const thread = annotation.thread?.length
    ? annotation.thread.map((message) => `     - ${message.role}: ${message.content}`).join("\n")
    : undefined;

  lines.push(
    ...[
      line("Fixed/Sticky", annotation.isFixed),
      line("Full DOM Path", annotation.fullPath),
      annotation.computedStyles ? `**Computed Styles:**\n\n\`\`\`\n${annotation.computedStyles.trim()}\n\`\`\`` : null,
      thread ? `**Thread:**\n${thread}` : null
    ]
      .filter(Boolean)
      .map((item) => `   - ${item}`)
  );

  return lines.join("\n");
}

function formatChangeRequestMarkdown(annotations: Annotation[], options: MarkdownOptions): string {
  const detail = options.detail ?? "standard";
  const includeHeader = options.includeHeader ?? true;
  const sorted = [...annotations].sort((a, b) => a.timestamp - b.timestamp);

  if (sorted.length === 0) {
    return "No annotations captured.";
  }

  const urls = uniqueValues(sorted.map((annotation) => annotation.url));
  const sharedUrl = urls.length === 1 ? urls[0] : undefined;
  const includePerAnnotationUrl = urls.length > 1;
  const header = includeHeader
    ? `${[
        "Implement these UI changes in one pass. Verify each target against the current DOM before editing.",
        sharedUrl ? `Page: ${codeSpan(sharedUrl)}` : null
      ]
        .filter(Boolean)
        .join("\n")}\n\n`
    : "";

  return `${header}${sorted
    .map((annotation, index) => formatChangeRequestAnnotation(annotation, index, detail, includePerAnnotationUrl))
    .join("\n\n")}`;
}

function formatAnnotation(annotation: Annotation, index: number, detail: OutputDetail): string {
  if (detail === "compact") {
    return [
      `- **#${index + 1} ${annotation.elementPath}**`,
      annotation.selectedText ? `  - Selected text: "${annotation.selectedText}"` : null,
      `  - Feedback: ${annotation.comment}`
    ]
      .filter(Boolean)
      .join("\n");
  }

  const standardLines = [
    `## Annotation #${index + 1}`,
    line("Element", annotation.element),
    line("Path", annotation.elementPath),
    line("URL", annotation.url),
    line("Selected Text", annotation.selectedText ? `"${annotation.selectedText}"` : undefined),
    line("Feedback", annotation.comment)
  ].filter(Boolean) as string[];

  if (detail === "standard") return standardLines.join("\n\n");

  const detailedLines = [
    ...standardLines,
    line("Position", rect(annotation)),
    line("Classes", annotation.cssClasses),
    line("Accessibility", annotation.accessibility),
    line("Nearby Text", annotation.nearbyText)
  ].filter(Boolean) as string[];

  if (detail === "detailed") return detailedLines.join("\n\n");

  const thread = annotation.thread?.length
    ? annotation.thread.map((message) => `- ${message.role}: ${message.content}`).join("\n")
    : undefined;

  return [
    ...detailedLines,
    line("Fixed/Sticky", annotation.isFixed),
    line("Full DOM Path", annotation.fullPath),
    codeBlock("Computed Styles", annotation.computedStyles),
    codeBlock("Thread", thread)
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function formatAnnotationsMarkdown(annotations: Annotation[], options: MarkdownOptions = {}): string {
  if (options.mode === "change-request") return formatChangeRequestMarkdown(annotations, options);

  const detail = options.detail ?? "standard";
  const sorted = [...annotations].sort((a, b) => a.timestamp - b.timestamp);

  if (sorted.length === 0) {
    return "No annotations captured.";
  }

  return sorted.map((annotation, index) => formatAnnotation(annotation, index, detail)).join("\n\n");
}
