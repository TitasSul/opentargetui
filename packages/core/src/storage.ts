export const STORAGE_PREFIX = "opentargetui:v1";

export function pageStorageKey(rawUrl: string): string {
  const url = new URL(rawUrl);
  return `${STORAGE_PREFIX}:page:${url.origin}${url.pathname}`;
}

export function pageSessionKey(rawUrl: string): string {
  const url = new URL(rawUrl);
  return `${STORAGE_PREFIX}:session:${url.origin}${url.pathname}`;
}

export function settingsStorageKey(): string {
  return `${STORAGE_PREFIX}:settings`;
}

export function structureReferenceStorageKey(): string {
  return `${STORAGE_PREFIX}:structure-reference`;
}

export function safeUrlParts(rawUrl: string): { origin: string; pathname: string } {
  try {
    const url = new URL(rawUrl);
    return { origin: url.origin, pathname: url.pathname };
  } catch {
    return { origin: "unknown", pathname: "/" };
  }
}
