import type { ExtensionSettings } from "@opentargetui/core";

const SETTINGS_KEY = "opentargetui:v1:settings";
const DEFAULT_DISABLED_MIGRATION_KEY = "opentargetui:v1:default-disabled-migrated";

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

chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get([SETTINGS_KEY, DEFAULT_DISABLED_MIGRATION_KEY]);
  const existingSettings = existing[SETTINGS_KEY] as Partial<ExtensionSettings> | undefined;
  const migrated = Boolean(existing[DEFAULT_DISABLED_MIGRATION_KEY]);

  if (!existingSettings) {
    await chrome.storage.local.set({ [SETTINGS_KEY]: DEFAULT_SETTINGS, [DEFAULT_DISABLED_MIGRATION_KEY]: true });
    return;
  }

  if (!migrated) {
    await chrome.storage.local.set({
      [SETTINGS_KEY]: { ...DEFAULT_SETTINGS, ...existingSettings, enabled: false },
      [DEFAULT_DISABLED_MIGRATION_KEY]: true
    });
  }
});
