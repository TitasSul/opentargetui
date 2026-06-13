const GENERATED_CLASS_RE = /(?:^|[-_])(?:[a-f0-9]{6,}|css|sc|module|chakra|mui|mantine|emotion)(?:[-_]|$)/i;

function escapeCss(value: string): string {
  if (globalThis.CSS && typeof globalThis.CSS.escape === "function") {
    return globalThis.CSS.escape(value);
  }

  return value.replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`);
}

function uniqueInDocument(selector: string, root: ParentNode): boolean {
  try {
    return root.querySelectorAll(selector).length === 1;
  } catch {
    return false;
  }
}

function stableClasses(element: Element): string[] {
  return Array.from(element.classList)
    .filter((className) => className.length >= 2 && !GENERATED_CLASS_RE.test(className))
    .slice(0, 3)
    .map((className) => `.${escapeCss(className)}`);
}

function nthOfType(element: Element): string {
  const tag = element.tagName.toLowerCase();
  let index = 1;
  let sibling = element.previousElementSibling;
  while (sibling) {
    if (sibling.tagName.toLowerCase() === tag) {
      index += 1;
    }
    sibling = sibling.previousElementSibling;
  }
  return `${tag}:nth-of-type(${index})`;
}

export function elementLabel(element: Element): string {
  const tag = element.tagName.toLowerCase();
  const text = (element.textContent ?? "").replace(/\s+/g, " ").trim();
  const aria = element.getAttribute("aria-label")?.trim();
  const alt = element.getAttribute("alt")?.trim();

  if ((tag === "button" || tag === "a") && text) return `${tag}[${text.slice(0, 48)}]`;
  if (aria) return `${tag}[aria-label="${aria.slice(0, 48)}"]`;
  if (alt) return `${tag}[alt="${alt.slice(0, 48)}"]`;
  if (/^h[1-6]$/.test(tag) && text) return `${tag}[${text.slice(0, 48)}]`;

  const id = element.id ? `#${element.id}` : "";
  const classes = Array.from(element.classList).slice(0, 2).join(".");
  return `${tag}${id}${classes ? `.${classes}` : ""}`;
}

export function selectorForElement(element: Element, root: ParentNode = document): string {
  const tag = element.tagName.toLowerCase();

  if (element.id) {
    const idSelector = `#${escapeCss(element.id)}`;
    if (uniqueInDocument(idSelector, root)) return idSelector;
  }

  const classSelector = stableClasses(element).join("");
  if (classSelector) {
    const selector = `${tag}${classSelector}`;
    if (uniqueInDocument(selector, root)) return selector;
  }

  return nthOfType(element);
}

export function elementPath(element: Element, root: ParentNode = document): string {
  const segments: string[] = [];
  let current: Element | null = element;

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    const selector = selectorForElement(current, root);
    segments.unshift(selector);

    const joined = segments.join(" > ");
    if (uniqueInDocument(joined, root)) return joined;

    if (current.tagName.toLowerCase() === "body") break;
    current = current.parentElement;
  }

  return segments.join(" > ");
}

export function accessibilitySummary(element: Element): string {
  const parts: string[] = [];
  const role = element.getAttribute("role");
  const ariaLabel = element.getAttribute("aria-label");
  const ariaExpanded = element.getAttribute("aria-expanded");
  const ariaPressed = element.getAttribute("aria-pressed");
  const disabled = element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true";

  if (role) parts.push(`role=${role}`);
  if (ariaLabel) parts.push(`aria-label="${ariaLabel}"`);
  if (ariaExpanded !== null) parts.push(`aria-expanded=${ariaExpanded}`);
  if (ariaPressed !== null) parts.push(`aria-pressed=${ariaPressed}`);
  if (disabled) parts.push("disabled=true");

  return parts.join("; ");
}

export function nearbyText(element: Element, maxLength = 240): string {
  const text = (element.textContent || element.parentElement?.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

export function computedStyleSnapshot(element: Element): string {
  const styles = getComputedStyle(element);
  const keys = [
    "display",
    "position",
    "width",
    "height",
    "margin",
    "padding",
    "font-size",
    "font-family",
    "font-weight",
    "line-height",
    "color",
    "background-color",
    "border",
    "border-radius",
    "box-shadow",
    "z-index"
  ];

  return keys
    .map((key) => `${key}: ${styles.getPropertyValue(key)};`)
    .filter((line) => !line.endsWith(": ;"))
    .join("\n");
}
