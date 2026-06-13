import type { ExtensionSettings } from "@opentargetui/core";

const SETTINGS_KEY = "opentargetui:v1:settings";

const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: true,
  outputDetail: "standard",
  markerColor: "#35c5b1",
  serverUrl: "http://localhost:4747",
  syncEnabled: false,
  copyOnAdd: false,
  hideMarkers: false,
  blockPageInteractions: true
};

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get(SETTINGS_KEY);
  if (!existing[SETTINGS_KEY]) {
    await chrome.storage.local.set({ [SETTINGS_KEY]: DEFAULT_SETTINGS });
  }
});
