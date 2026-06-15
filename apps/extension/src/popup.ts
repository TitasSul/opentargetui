import type { ExtensionSettings } from "@opentargetui/core";

const status = document.querySelector<HTMLSpanElement>("#status");
const uiToggle = document.querySelector<HTMLButtonElement>("#ui-toggle");
const toggle = document.querySelector<HTMLButtonElement>("#toggle");
const copy = document.querySelector<HTMLButtonElement>("#copy");
const brandIcon = document.querySelector<HTMLDivElement>("#brand-icon");
const SETTINGS_KEY = "opentargetui:v1:settings";

const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: false,
  outputDetail: "standard",
  markerColor: "#35c5b1",
  serverUrl: "http://localhost:4747",
  syncEnabled: false,
  copyOnAdd: false,
  hideMarkers: false,
  blockPageInteractions: true
};

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

async function loadSettings(): Promise<ExtensionSettings> {
  const result = await chrome.storage.local.get(SETTINGS_KEY);
  return { ...DEFAULT_SETTINGS, ...(result[SETTINGS_KEY] as Partial<ExtensionSettings> | undefined) };
}

async function saveSettings(next: ExtensionSettings): Promise<void> {
  await chrome.storage.local.set({ [SETTINGS_KEY]: next });
}

function renderEnabledState(enabled: boolean): void {
  if (status) status.textContent = enabled ? "UI enabled on this tab" : "UI hidden by default";
  if (uiToggle) {
    uiToggle.classList.toggle("primary", !enabled);
    uiToggle.innerHTML = enabled
      ? '<span class="button-icon" data-icon="target"></span><span>Hide UI</span>'
      : '<span class="button-icon" data-icon="target"></span><span>Show UI</span>';
  }
  if (toggle) toggle.disabled = !enabled;
  document.querySelectorAll<HTMLElement>("[data-icon]").forEach((slot) => {
    const key = slot.dataset.icon as keyof typeof icons;
    slot.innerHTML = icon(icons[key]);
  });
}

async function sendToTab<T = unknown>(type: string, payload: Record<string, unknown> = {}): Promise<T | undefined> {
  const tab = await activeTab();
  if (!tab?.id) throw new Error("No active tab");
  return (await chrome.tabs.sendMessage(tab.id, { source: "opentargetui-popup", type, ...payload })) as T | undefined;
}

uiToggle?.addEventListener("click", async () => {
  try {
    const current = await loadSettings();
    const next = { ...current, enabled: !current.enabled };
    await saveSettings(next);
    renderEnabledState(next.enabled);
    await sendToTab("set-enabled", { enabled: next.enabled });
  } catch {
    if (status) status.textContent = "Reload the page, then try again";
  }
});

toggle?.addEventListener("click", async () => {
  try {
    const current = await loadSettings();
    if (!current.enabled) {
      const next = { ...current, enabled: true };
      await saveSettings(next);
      renderEnabledState(true);
      await sendToTab("set-enabled", { enabled: true });
    }
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

void loadSettings()
  .then((settings) => renderEnabledState(settings.enabled))
  .catch(() => {
    if (status) status.textContent = "Settings unavailable";
  });
