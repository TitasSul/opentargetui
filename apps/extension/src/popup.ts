const status = document.querySelector<HTMLSpanElement>("#status");
const toggle = document.querySelector<HTMLButtonElement>("#toggle");
const copy = document.querySelector<HTMLButtonElement>("#copy");
const brandIcon = document.querySelector<HTMLDivElement>("#brand-icon");

const icons = {
  copy: `<svg class="icon lucide lucide-copy" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  target: `<svg class="icon lucide lucide-target" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`
} as const;

function icon(svg: string): string {
  return svg.replace("<svg", '<svg aria-hidden="true" focusable="false"');
}

function extensionAssetUrl(path: string): string {
  return chrome.runtime.getURL(path.replace(/^\//, ""));
}

const fontStyle = document.createElement("style");
fontStyle.textContent = `
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 400;
    src: url("${extensionAssetUrl("fonts/geist-latin-400-normal.woff2")}") format("woff2");
  }
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 500;
    src: url("${extensionAssetUrl("fonts/geist-latin-500-normal.woff2")}") format("woff2");
  }
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 600;
    src: url("${extensionAssetUrl("fonts/geist-latin-600-normal.woff2")}") format("woff2");
  }
  @font-face {
    font-family: "Geist";
    font-style: normal;
    font-display: swap;
    font-weight: 700;
    src: url("${extensionAssetUrl("fonts/geist-latin-700-normal.woff2")}") format("woff2");
  }
`;
document.head.appendChild(fontStyle);

brandIcon!.innerHTML = icon(icons.target);
document.querySelectorAll<HTMLElement>("[data-icon]").forEach((slot) => {
  const key = slot.dataset.icon as keyof typeof icons;
  slot.innerHTML = icon(icons[key]);
});

async function activeTab(): Promise<chrome.tabs.Tab | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function sendToTab<T = unknown>(type: string): Promise<T | undefined> {
  const tab = await activeTab();
  if (!tab?.id) throw new Error("No active tab");
  return (await chrome.tabs.sendMessage(tab.id, { source: "opentargetui-popup", type })) as T | undefined;
}

toggle?.addEventListener("click", async () => {
  try {
    await sendToTab("toggle-selection");
    if (status) status.textContent = "Annotation mode toggled";
  } catch {
    if (status) status.textContent = "Reload the page, then try again";
  }
});

copy?.addEventListener("click", async () => {
  try {
    const result = await sendToTab<{ copied?: boolean }>("copy-feedback");
    if (status) status.textContent = result?.copied === false ? "No changes to copy" : "Request copied";
  } catch {
    if (status) status.textContent = "No content script on this page";
  }
});
