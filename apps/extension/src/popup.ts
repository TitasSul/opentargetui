import type { ExtensionSettings } from "@opentargetui/core";

const status = document.querySelector<HTMLSpanElement>("#status");
const uiToggle = document.querySelector<HTMLButtonElement>("#ui-toggle");
const brandIcon = document.querySelector<HTMLDivElement>("#brand-icon");
const SETTINGS_KEY = "opentargetui:v1:settings";

const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: false,
  outputDetail: "standard",
  markerColor: "#35c5b1",
  serverUrl: "http://localhost:4747",
  syncEnabled: false,
  hideMarkers: false,
  blockPageInteractions: true
};

const icons = {
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
  const { copyOnAdd: _copyOnAdd, ...storedSettings } = (result[SETTINGS_KEY] ?? {}) as Partial<ExtensionSettings> & {
    copyOnAdd?: unknown;
  };
  return { ...DEFAULT_SETTINGS, ...storedSettings, enabled: false };
}

async function saveSettings(next: ExtensionSettings): Promise<void> {
  const { copyOnAdd: _copyOnAdd, ...settings } = next as ExtensionSettings & { copyOnAdd?: unknown };
  await chrome.storage.local.set({ [SETTINGS_KEY]: { ...settings, enabled: false } });
}

function renderEnabledState(enabled: boolean): void {
  if (status) status.textContent = enabled ? "UI enabled on this tab" : "UI hidden by default";
  if (uiToggle) {
    uiToggle.classList.toggle("primary", !enabled);
    uiToggle.innerHTML = enabled
      ? '<span class="button-icon" data-icon="target"></span><span>Hide UI</span>'
      : '<span class="button-icon" data-icon="target"></span><span>Show UI</span>';
  }
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

async function activeTabId(): Promise<number> {
  const tab = await activeTab();
  if (!tab?.id) throw new Error("No active tab");
  return tab.id;
}

async function getActiveUiState(): Promise<{ enabled: boolean }> {
  try {
    return (await sendToTab<{ enabled?: boolean }>("get-state").then((state) => ({ enabled: Boolean(state?.enabled) })));
  } catch {
    return { enabled: false };
  }
}

async function ensureContentScript(): Promise<void> {
  const tabId = await activeTabId();
  try {
    await chrome.tabs.sendMessage(tabId, { source: "opentargetui-popup", type: "get-state" });
    return;
  } catch {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"]
    });
  }
}

async function sendToReadyTab<T = unknown>(type: string, payload: Record<string, unknown> = {}): Promise<T | undefined> {
  await ensureContentScript();
  return sendToTab<T>(type, payload);
}

uiToggle?.addEventListener("click", async () => {
  try {
    const currentSettings = await loadSettings();
    const currentState = await getActiveUiState();
    const next = { ...currentSettings, enabled: !currentState.enabled };
    await saveSettings(currentSettings);
    renderEnabledState(next.enabled);
    if (next.enabled) {
      await sendToReadyTab("set-enabled", { enabled: true });
      return;
    }
    await sendToTab("set-enabled", { enabled: false }).catch(() => undefined);
  } catch {
    if (status) status.textContent = "Reload the page, then try again";
  }
});

void getActiveUiState()
  .then((state) => renderEnabledState(state.enabled))
  .catch(() => {
    if (status) status.textContent = "Settings unavailable";
  });
