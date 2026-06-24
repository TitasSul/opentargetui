import {
  accessibilitySummary,
  computedStyleSnapshot,
  elementLabel,
  elementPath,
  formatAnnotationsMarkdown,
  nearbyText,
  pageSessionKey,
  pageStorageKey,
  settingsStorageKey,
  type Annotation,
  type AnnotationIntent,
  type AnnotationSeverity,
  type ExtensionSettings,
  type OutputDetail,
  type RectSnapshot,
  type UiPosition
} from "@opentargetui/core";
import checkIcon from "lucide-static/icons/check.svg?raw";
import clipboardListIcon from "lucide-static/icons/clipboard-list.svg?raw";
import copyIcon from "lucide-static/icons/copy.svg?raw";
import eyeIcon from "lucide-static/icons/eye.svg?raw";
import eyeOffIcon from "lucide-static/icons/eye-off.svg?raw";
import maximizeIcon from "lucide-static/icons/maximize-2.svg?raw";
import messageIcon from "lucide-static/icons/message-square.svg?raw";
import mousePointerIcon from "lucide-static/icons/mouse-pointer-2.svg?raw";
import panelCloseIcon from "lucide-static/icons/panel-right-close.svg?raw";
import pauseIcon from "lucide-static/icons/pause.svg?raw";
import playIcon from "lucide-static/icons/play.svg?raw";
import serverIcon from "lucide-static/icons/server.svg?raw";
import settingsIcon from "lucide-static/icons/settings.svg?raw";
import targetIcon from "lucide-static/icons/target.svg?raw";
import trashIcon from "lucide-static/icons/trash.svg?raw";
import xIcon from "lucide-static/icons/x.svg?raw";

const ROOT_ID = "opentargetui-root";
const PAUSE_STYLE_ID = "opentargetui-pause-style";

const DEFAULT_SETTINGS: ExtensionSettings = {
  enabled: false,
  outputDetail: "standard",
  markerColor: "#35c5b1",
  serverUrl: "http://localhost:4747",
  syncEnabled: false,
  hideMarkers: false,
  blockPageInteractions: true
};

const ICONS = {
  check: checkIcon,
  clipboardList: clipboardListIcon,
  copy: copyIcon,
  eye: eyeIcon,
  eyeOff: eyeOffIcon,
  maximize: maximizeIcon,
  message: messageIcon,
  mousePointer: mousePointerIcon,
  panelClose: panelCloseIcon,
  pause: pauseIcon,
  play: playIcon,
  server: serverIcon,
  settings: settingsIcon,
  target: targetIcon,
  trash: trashIcon,
  x: xIcon
} as const;

type IconName = keyof typeof ICONS;

function icon(name: IconName): string {
  return ICONS[name]
    .replace(/<!--[\s\S]*?-->\s*/g, "")
    .replace("<svg", '<svg aria-hidden="true" focusable="false"')
    .replace('class="lucide', 'class="otu-icon lucide');
}

function extensionAssetUrl(path: string): string {
  if (typeof chrome !== "undefined" && chrome.runtime?.getURL) {
    return chrome.runtime.getURL(path.replace(/^\//, ""));
  }
  return path;
}

function fontFaces(): string {
  return `
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
}

type DraftTarget = {
  element: Element;
  rect: DOMRect;
  clientX: number;
  clientY: number;
  selectedText: string;
};

type ComposerDragState = {
  pointerId: number;
  startX: number;
  startY: number;
  startLeft: number;
  startTop: number;
};

type UiDragState = ComposerDragState & {
  moved: boolean;
};

type MoveSource = {
  element: Element;
  rect: DOMRect;
  path: string;
  label: string;
};

type ServerStatus = "local" | "connecting" | "connected" | "offline";

let settings: ExtensionSettings = { ...DEFAULT_SETTINGS };
let annotations: Annotation[] = [];
let selectionMode = false;
let moveMode = false;
let collapsed = true;
let paused = false;
let pendingTarget: DraftTarget | null = null;
let editingId: string | null = null;
let sessionId: string | null = null;
let eventSource: EventSource | null = null;
let composerDrag: ComposerDragState | null = null;
let uiDrag: UiDragState | null = null;
let moveSource: MoveSource | null = null;
let clearConfirmUntil = 0;
let clearConfirmTimer: number | null = null;
let suppressNextToolbarClick = false;
let skipNextClick = false;
let pausedMedia: HTMLMediaElement[] = [];
let extensionContextInvalidated = false;
let serverOffline = false;
let serverOfflineNotified = false;
let serverStatus: ServerStatus = "local";
let pageEnabledOverride: boolean | null = null;
let bringToFrontFrame = 0;

const existingRoot = document.getElementById(ROOT_ID);
if (existingRoot) existingRoot.remove();

const root = document.createElement("div");
root.id = ROOT_ID;
root.setAttribute("data-opentargetui", "root");
root.setAttribute("popover", "manual");
root.style.all = "initial";
root.style.position = "fixed";
root.style.inset = "0";
root.style.zIndex = "2147483647";
root.style.pointerEvents = "none";
root.style.margin = "0";
root.style.border = "0";
root.style.padding = "0";
root.style.background = "transparent";

const shadow = root.attachShadow({ mode: "open" });
document.documentElement.appendChild(root);

const style = document.createElement("style");
style.textContent = `
  ${fontFaces()}

  :host {
    --otu-bg: #10100e;
    --otu-panel: rgba(18, 18, 16, 0.97);
    --otu-soft: #1c1b18;
    --otu-button: #171713;
    --otu-button-hover: #22221e;
    --otu-field: #0d0d0b;
    --otu-ink: #f4f2ea;
    --otu-muted: #aaa598;
    --otu-line: rgba(244, 242, 234, 0.14);
    --otu-accent: ${DEFAULT_SETTINGS.markerColor};
    --otu-accent-ink: #061916;
    --otu-danger: #ff6b5f;
    --otu-shadow: 0 18px 56px rgba(0, 0, 0, 0.44);
    all: initial;
    color-scheme: dark;
    font-family: "Geist", "Satoshi", "Aptos", ui-sans-serif, sans-serif;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    font-family: "Geist", "Satoshi", "Aptos", ui-sans-serif, sans-serif;
  }

  .otu-icon {
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
    stroke-width: 2.2;
  }

  .hover-frame {
    position: fixed;
    z-index: 10;
    display: none;
    pointer-events: none;
    border: 1.5px solid var(--otu-accent);
    border-radius: 4px;
    background: color-mix(in srgb, var(--otu-accent) 10%, transparent);
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.08);
  }

  .marker-layer {
    position: fixed;
    inset: 0;
    z-index: 20;
    pointer-events: none;
  }

  .marker {
    position: fixed;
    width: 26px;
    height: 26px;
    transform: translate(-50%, -50%);
    border: 2px solid var(--otu-bg);
    border-radius: 999px;
    background: var(--otu-accent);
    color: var(--otu-accent-ink);
    box-shadow: 0 8px 22px rgba(0, 0, 0, 0.38);
    font: 700 11px/1 "Geist", "Aptos", ui-sans-serif, sans-serif;
    display: grid;
    place-items: center;
    pointer-events: auto;
    cursor: pointer;
  }

  .marker[data-status="resolved"] {
    opacity: 0.46;
    filter: saturate(0.4);
  }

  .toolbar {
    position: fixed;
    z-index: 50;
    right: 18px;
    bottom: 18px;
    width: min(360px, calc(100vw - 28px));
    pointer-events: auto;
    display: grid;
    gap: 10px;
    padding: 12px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-panel);
    color: var(--otu-ink);
    box-shadow: var(--otu-shadow);
    backdrop-filter: blur(16px);
  }

  .toolbar.dragging {
    cursor: grabbing;
  }

  .toolbar.collapsed {
    width: auto;
    min-width: 0;
    padding: 8px;
  }

  .toolbar-header,
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-width: 0;
  }

  .toolbar-header {
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  .toolbar.dragging .toolbar-header,
  .toolbar.dragging .collapsed-button {
    cursor: grabbing;
  }

  .toolbar-header .icon-button {
    cursor: pointer;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 9px;
    min-width: 0;
  }

  .brand-mark {
    width: 30px;
    height: 30px;
    border: 1px solid color-mix(in srgb, var(--otu-accent) 42%, var(--otu-line));
    border-radius: 8px;
    background: color-mix(in srgb, var(--otu-accent) 12%, var(--otu-bg));
    color: var(--otu-accent);
    display: grid;
    place-items: center;
  }

  .brand-name {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .brand-title {
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0;
    color: var(--otu-ink);
    white-space: nowrap;
  }

  .brand-meta {
    color: var(--otu-muted);
    font-size: 11px;
    white-space: nowrap;
  }

  button,
  select,
  textarea,
  input {
    font: inherit;
  }

  button {
    -webkit-font-smoothing: antialiased;
  }

  .primary-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .utility-actions {
    display: grid;
    grid-template-columns: repeat(4, 36px);
    gap: 6px;
  }

  .action-button,
  .icon-button {
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-button);
    color: var(--otu-ink);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    position: relative;
  }

  .action-button {
    min-width: 0;
    min-height: 38px;
    padding: 0 12px;
  }

  .action-button span {
    min-width: 0;
    white-space: nowrap;
  }

  .icon-button {
    width: 36px;
    height: 34px;
    padding: 0;
  }

  .action-button:hover,
  .icon-button:hover,
  .collapsed-button:hover,
  .action-button.active,
  .icon-button.active {
    border-color: color-mix(in srgb, var(--otu-accent) 58%, var(--otu-line));
    background: color-mix(in srgb, var(--otu-accent) 12%, var(--otu-button-hover));
    color: var(--otu-accent);
  }

  .action-button.primary {
    border-color: color-mix(in srgb, var(--otu-accent) 66%, var(--otu-line));
    background: var(--otu-accent);
    color: var(--otu-accent-ink);
  }

  .action-button.primary:hover,
  .action-button.primary.active {
    background: color-mix(in srgb, var(--otu-accent) 82%, var(--otu-ink));
    color: var(--otu-accent-ink);
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.46;
  }

  button:disabled:hover {
    border-color: var(--otu-line);
    background: var(--otu-button);
    color: var(--otu-ink);
  }

  .icon-button.danger:hover {
    border-color: var(--otu-danger);
    background: color-mix(in srgb, var(--otu-danger) 14%, var(--otu-button));
    color: var(--otu-danger);
  }

  .collapsed-button {
    height: 38px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-panel);
    color: var(--otu-ink);
    box-shadow: var(--otu-shadow);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    font-size: 12px;
    font-weight: 700;
    position: relative;
    touch-action: none;
    user-select: none;
  }

  .icon-button[data-tooltip]::after,
  .collapsed-button[data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    right: 0;
    bottom: calc(100% + 8px);
    max-width: 180px;
    white-space: nowrap;
    padding: 6px 8px;
    border: 1px solid var(--otu-line);
    border-radius: 7px;
    background: var(--otu-field);
    color: var(--otu-ink);
    font-size: 11px;
    font-weight: 650;
    opacity: 0;
    pointer-events: none;
    transform: translateY(4px);
    transition: opacity 120ms ease, transform 120ms ease;
  }

  .icon-button[data-tooltip]:hover::after,
  .collapsed-button[data-tooltip]:hover::after {
    opacity: 1;
    transform: translateY(0);
  }

  .status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: var(--otu-muted);
    font-size: 11px;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .status-pill.warn {
    color: var(--otu-danger);
  }

  .dot {
    width: 7px;
    height: 7px;
    border-radius: 999px;
    background: var(--otu-muted);
  }

  .dot.on {
    background: var(--otu-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--otu-accent) 18%, transparent);
  }

  .panel {
    position: fixed;
    z-index: 40;
    pointer-events: auto;
    width: min(360px, calc(100vw - 28px));
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-panel);
    color: var(--otu-ink);
    box-shadow: var(--otu-shadow);
    backdrop-filter: blur(18px);
  }

  .composer {
    display: none;
    padding: 12px;
    gap: 10px;
    cursor: grab;
    touch-action: none;
    user-select: none;
  }

  .composer.open {
    display: grid;
  }

  .composer.dragging {
    cursor: grabbing;
  }

  .composer textarea,
  .composer button,
  .composer input,
  .composer select {
    cursor: auto;
    touch-action: auto;
    user-select: auto;
  }

  .composer textarea {
    cursor: text;
  }

  .target-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: var(--otu-muted);
    font-size: 11px;
  }

  .target-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .panel-title {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-width: 0;
    font-size: 13px;
    font-weight: 700;
    color: var(--otu-ink);
  }

  .target-card {
    display: grid;
    gap: 3px;
    padding: 9px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-soft);
  }

  .target-card strong {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--otu-ink);
    font-size: 12px;
  }

  .target-card span {
    color: var(--otu-muted);
    font-size: 11px;
  }

  textarea {
    width: 100%;
    min-height: 94px;
    resize: vertical;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    padding: 10px;
    background: var(--otu-field);
    color: var(--otu-ink);
    outline: none;
    line-height: 1.42;
    font-size: 13px;
  }

  textarea::placeholder,
  input::placeholder {
    color: color-mix(in srgb, var(--otu-muted) 78%, transparent);
  }

  .composer[data-mode="create"] textarea {
    min-height: 132px;
  }

  .composer[data-mode="create"] .button-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .composer[data-mode="create"] .command {
    min-height: 38px;
  }

  textarea:focus,
  select:focus,
  input:focus {
    border-color: var(--otu-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--otu-accent) 14%, transparent);
  }

  .field-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  select,
  input {
    min-height: 36px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    padding: 0 8px;
    background: var(--otu-field);
    color: var(--otu-ink);
    outline: none;
    font-size: 12px;
  }

  .form-field {
    display: grid;
    gap: 5px;
    color: var(--otu-muted);
    font-size: 11px;
  }

  .button-row {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .command {
    min-height: 34px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    padding: 0 12px;
    background: var(--otu-button);
    color: var(--otu-ink);
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
  }

  .command.primary {
    border-color: color-mix(in srgb, var(--otu-accent) 74%, var(--otu-ink));
    background: var(--otu-accent);
    color: var(--otu-accent-ink);
  }

  .command.danger {
    color: var(--otu-danger);
  }

  .settings {
    display: none;
    right: 18px;
    bottom: 108px;
    padding: 12px;
    gap: 10px;
  }

  .settings.open {
    display: grid;
  }

  .batch {
    display: none;
    right: 18px;
    bottom: 108px;
    width: min(420px, calc(100vw - 28px));
    padding: 12px;
    gap: 10px;
  }

  .batch.open {
    display: grid;
  }

  .batch-summary {
    color: var(--otu-muted);
    font-size: 11px;
    line-height: 1.45;
  }

  .batch-list {
    display: grid;
    gap: 8px;
    max-height: min(390px, calc(100vh - 248px));
    overflow: auto;
    padding-right: 2px;
  }

  .batch-item {
    display: grid;
    gap: 8px;
    min-height: 92px;
    padding: 10px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-button);
  }

  .batch-item-header {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
  }

  .batch-index {
    width: 22px;
    height: 22px;
    border-radius: 999px;
    background: var(--otu-accent);
    color: var(--otu-accent-ink);
    display: grid;
    place-items: center;
    font-size: 11px;
    font-weight: 800;
    line-height: 1;
  }

  .batch-comment {
    min-width: 0;
    color: var(--otu-ink);
    font-size: 12px;
    font-weight: 650;
    line-height: 1.35;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .batch-target {
    min-width: 0;
    color: var(--otu-muted);
    font-size: 11px;
    line-height: 1.35;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .batch-item-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .batch-item-actions .icon-button {
    width: 32px;
    height: 30px;
  }

  .batch-empty {
    display: grid;
    gap: 6px;
    min-height: 128px;
    place-items: center;
    text-align: center;
    padding: 18px;
    border: 1px dashed var(--otu-line);
    border-radius: 8px;
    background: var(--otu-soft);
    color: var(--otu-muted);
    font-size: 12px;
    line-height: 1.45;
  }

  .batch-empty strong {
    color: var(--otu-ink);
    font-size: 13px;
  }

  .settings h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0;
  }

  .setting-grid {
    display: grid;
    gap: 8px;
  }

  label.setting {
    display: grid;
    gap: 5px;
    color: var(--otu-muted);
    font-size: 11px;
  }

  .toggle-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: var(--otu-ink);
    padding: 9px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-button);
  }

  .toggle-copy {
    display: grid;
    gap: 2px;
  }

  .toggle-copy strong {
    font-size: 12px;
    font-weight: 700;
    color: var(--otu-ink);
  }

  .toggle-copy small {
    font-size: 11px;
    color: var(--otu-muted);
  }

  .toggle-row input {
    width: 18px;
    height: 18px;
    accent-color: var(--otu-accent);
  }

  .sync-health {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 9px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-soft);
    color: var(--otu-muted);
    font-size: 11px;
  }

  .sync-health strong {
    color: var(--otu-ink);
    font-size: 12px;
  }

  .toast {
    position: fixed;
    z-index: 60;
    left: 50%;
    bottom: 22px;
    transform: translateX(-50%) translateY(20px);
    opacity: 0;
    pointer-events: none;
    padding: 9px 12px;
    border: 1px solid var(--otu-line);
    border-radius: 8px;
    background: var(--otu-field);
    color: var(--otu-ink);
    font-size: 11px;
    transition: opacity 160ms ease, transform 160ms ease;
  }

  .toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .kbd {
    border: 1px solid var(--otu-line);
    border-radius: 5px;
    padding: 1px 5px;
    color: var(--otu-muted);
    font-size: 10px;
  }

  @media (max-width: 520px) {
    .toolbar {
      right: 10px;
      left: 10px;
      bottom: 10px;
      min-width: 0;
    }

    .utility-actions {
      grid-template-columns: repeat(4, minmax(32px, 1fr));
    }

    .batch,
    .settings {
      right: 10px;
      left: 10px;
      bottom: 104px;
      width: auto;
    }
  }
`;
shadow.appendChild(style);

const hoverFrame = document.createElement("div");
hoverFrame.className = "hover-frame";
shadow.appendChild(hoverFrame);

const markerLayer = document.createElement("div");
markerLayer.className = "marker-layer";
shadow.appendChild(markerLayer);

const toolbar = document.createElement("div");
toolbar.className = "toolbar";
shadow.appendChild(toolbar);

const composer = document.createElement("div");
composer.className = "panel composer";
shadow.appendChild(composer);

const batchPanel = document.createElement("div");
batchPanel.className = "panel batch";
shadow.appendChild(batchPanel);

const settingsPanel = document.createElement("div");
settingsPanel.className = "panel settings";
shadow.appendChild(settingsPanel);

const toast = document.createElement("div");
toast.className = "toast";
shadow.appendChild(toast);

function hasChromeStorage(): boolean {
  if (extensionContextInvalidated) return false;
  try {
    return typeof chrome !== "undefined" && Boolean(chrome.runtime?.id) && Boolean(chrome.storage?.local);
  } catch (error) {
    if (isExtensionContextInvalidated(error)) extensionContextInvalidated = true;
    return false;
  }
}

async function storageGet<T>(key: string, fallback: T): Promise<T> {
  if (!hasChromeStorage()) return fallback;
  try {
    const result = await chrome.storage.local.get(key);
    return (result[key] as T | undefined) ?? fallback;
  } catch (error) {
    if (isExtensionContextInvalidated(error)) extensionContextInvalidated = true;
    else console.warn("[OpenTarget UI] Storage read failed", error);
    return fallback;
  }
}

async function storageSet(key: string, value: unknown): Promise<void> {
  if (!hasChromeStorage()) return;
  try {
    await chrome.storage.local.set({ [key]: value });
  } catch (error) {
    if (isExtensionContextInvalidated(error)) extensionContextInvalidated = true;
    else console.warn("[OpenTarget UI] Storage write failed", error);
  }
}

async function persistSettingsPreferences(): Promise<void> {
  const { copyOnAdd: _copyOnAdd, ...persisted } = settings as ExtensionSettings & { copyOnAdd?: unknown };
  await storageSet(settingsStorageKey(), { ...persisted, enabled: false });
}

function normalizeServerUrl(value: string): string {
  return value.trim().replace(/\/+$/, "") || DEFAULT_SETTINGS.serverUrl;
}

function showToast(message: string): void {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1600);
}

function isExtensionContextInvalidated(error: unknown): boolean {
  return error instanceof Error && /extension context invalidated/i.test(error.message);
}

function isNetworkFetchError(error: unknown): boolean {
  return error instanceof TypeError && /failed to fetch/i.test(error.message);
}

function markServerAvailable(): void {
  serverOffline = false;
  serverOfflineNotified = false;
  setServerStatus(settings.syncEnabled ? "connected" : "local");
}

function markServerUnavailable(error: unknown, message: string): void {
  disconnectEvents();
  serverOffline = true;
  setServerStatus(settings.syncEnabled ? "offline" : "local");
  if (!serverOfflineNotified) {
    serverOfflineNotified = true;
    showToast(message);
    if (error && !isNetworkFetchError(error)) {
      console.warn("[OpenTarget UI] Server sync failed", error);
    }
  }
}

function queueRemoteSync(operation: () => Promise<void>): void {
  if (serverOffline) return;
  void operation().catch((error) => markServerUnavailable(error, "Saved locally; server unavailable"));
}

function isInsideOverlay(event: Event): boolean {
  return event.composedPath().includes(root) || event.composedPath().includes(shadow);
}

function updateAccent(): void {
  style.textContent = style.textContent?.replace(/--otu-accent: #[0-9a-fA-F]{6};/, `--otu-accent: ${settings.markerColor};`) ?? "";
}

function isRootPopoverOpen(): boolean {
  try {
    return root.matches(":popover-open");
  } catch {
    return false;
  }
}

function showRootPopover(): void {
  const popoverRoot = root as HTMLElement & { showPopover?: () => void };
  if (typeof popoverRoot.showPopover !== "function" || isRootPopoverOpen()) return;
  try {
    popoverRoot.showPopover();
  } catch {
    // z-index fallback still applies on pages/browsers without stable popover support.
  }
}

function bringRootToFront(): void {
  const popoverRoot = root as HTMLElement & { hidePopover?: () => void; showPopover?: () => void };
  if (typeof popoverRoot.showPopover !== "function") return;
  try {
    if (isRootPopoverOpen()) popoverRoot.hidePopover?.();
    popoverRoot.showPopover();
  } catch {
    // z-index fallback still applies.
  }
}

function scheduleBringRootToFront(): void {
  if (!settings.enabled || bringToFrontFrame) return;
  bringToFrontFrame = window.requestAnimationFrame(() => {
    bringToFrontFrame = 0;
    bringRootToFront();
  });
}

function hideRootPopover(): void {
  const popoverRoot = root as HTMLElement & { hidePopover?: () => void };
  if (typeof popoverRoot.hidePopover !== "function" || !isRootPopoverOpen()) return;
  try {
    popoverRoot.hidePopover();
  } catch {
    // no-op
  }
}

function setRootVisible(visible: boolean): void {
  if (visible) {
    root.style.display = "block";
    showRootPopover();
    return;
  }
  hideRootPopover();
  root.style.display = "none";
}

function syncStatusLabel(): string {
  if (!settings.syncEnabled) return "Local only";
  if (serverStatus === "connecting") return "Connecting";
  if (serverStatus === "connected") return "Server connected";
  if (serverStatus === "offline") return "Server unavailable";
  return "Sync enabled";
}

function syncStatusClass(): string {
  if (serverStatus === "offline") return " warn";
  return "";
}

function rerenderSyncStatus(): void {
  renderToolbar();
  if (settingsPanel.classList.contains("open")) renderSettings(true);
}

function setServerStatus(next: ServerStatus): void {
  if (serverStatus === next) return;
  serverStatus = next;
  rerenderSyncStatus();
}

const topLayerObserver = new MutationObserver((mutations) => {
  if (!settings.enabled) return;
  const pagePopupChanged = mutations.some((mutation) => {
    const target = mutation.target;
    if (target instanceof Element && (target === root || target.closest(`[data-opentargetui]`))) return false;
    return mutation.type === "childList" || mutation.attributeName === "open";
  });
  if (pagePopupChanged) scheduleBringRootToFront();
});
topLayerObserver.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["open"],
  childList: true,
  subtree: true
});
document.addEventListener("toggle", (event) => {
  if (!settings.enabled) return;
  const target = event.target;
  if (target instanceof Element && target.closest(`[data-opentargetui]`)) return;
  scheduleBringRootToFront();
}, true);

function activeAnnotations(): Annotation[] {
  return annotations.filter((annotation) => annotation.status !== "dismissed" && annotation.status !== "resolved");
}

function annotationCountLabel(): string {
  const count = activeAnnotations().length;
  return `${count} ${count === 1 ? "note" : "notes"}`;
}

function clearConfirmationActive(): boolean {
  return clearConfirmUntil > Date.now();
}

function resetClearConfirmation(): void {
  clearConfirmUntil = 0;
  if (clearConfirmTimer !== null) {
    window.clearTimeout(clearConfirmTimer);
    clearConfirmTimer = null;
  }
}

function armClearConfirmation(): void {
  clearConfirmUntil = Date.now() + 3200;
  if (clearConfirmTimer !== null) window.clearTimeout(clearConfirmTimer);
  clearConfirmTimer = window.setTimeout(() => {
    resetClearConfirmation();
    renderToolbar();
    if (batchPanel.classList.contains("open")) renderBatch(true);
  }, 3200);
}

function oneLine(value: string, fallback = "Untitled change"): string {
  return value.replace(/\s+/g, " ").trim() || fallback;
}

function clampUiPosition(left: number, top: number, width: number, height: number, margin = 10): UiPosition {
  const maxLeft = Math.max(margin, window.innerWidth - width - margin);
  const maxTop = Math.max(margin, window.innerHeight - height - margin);
  return {
    left: Math.min(Math.max(left, margin), maxLeft),
    top: Math.min(Math.max(top, margin), maxTop)
  };
}

function defaultToolbarPosition(): UiPosition {
  const rect = toolbar.getBoundingClientRect();
  const width = rect.width || Math.min(360, window.innerWidth - 28);
  const height = rect.height || 180;
  return clampUiPosition(window.innerWidth - width - 18, window.innerHeight - height - 18, width, height);
}

function setFixedPosition(element: HTMLElement, position: UiPosition): void {
  element.style.left = `${position.left}px`;
  element.style.top = `${position.top}px`;
  element.style.right = "auto";
  element.style.bottom = "auto";
}

function applyToolbarPosition(): void {
  const rect = toolbar.getBoundingClientRect();
  const width = rect.width || Math.min(360, window.innerWidth - 28);
  const height = rect.height || 180;
  const position = settings.uiPosition
    ? clampUiPosition(settings.uiPosition.left, settings.uiPosition.top, width, height)
    : defaultToolbarPosition();
  setFixedPosition(toolbar, position);
  positionOpenPanels();
}

function positionPanelNearToolbar(panel: HTMLElement): void {
  if (!panel.classList.contains("open")) return;
  const toolbarRect = toolbar.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const gap = 10;
  const width = panelRect.width || 360;
  const height = panelRect.height || 240;
  const left = toolbarRect.right - width;
  let top = toolbarRect.top - height - gap;
  if (top < 10) top = toolbarRect.bottom + gap;
  setFixedPosition(panel, clampUiPosition(left, top, width, height));
}

function positionOpenPanels(): void {
  positionPanelNearToolbar(batchPanel);
  positionPanelNearToolbar(settingsPanel);
}

function sentenceCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function intentLabel(value: AnnotationIntent): string {
  const labels: Record<AnnotationIntent, string> = {
    fix: "Fix issue",
    change: "Change design",
    question: "Ask question",
    approve: "Approve"
  };
  return labels[value];
}

function renderToolbar(): void {
  if (!settings.enabled) {
    toolbar.innerHTML = "";
    return;
  }

  toolbar.className = `toolbar${collapsed ? " collapsed" : ""}`;

  if (collapsed) {
    toolbar.innerHTML = `
      <button class="collapsed-button" data-action="expand" aria-label="Open OpenTarget UI" data-tooltip="Open OpenTarget UI">
        ${icon("target")}
        <span>OpenTarget</span>
      </button>
    `;
  } else {
    toolbar.innerHTML = `
      <div class="toolbar-header">
        <div class="brand">
          <div class="brand-mark">${icon("target")}</div>
          <div class="brand-name">
            <div class="brand-title">OpenTarget UI</div>
            <div class="brand-meta">${annotationCountLabel()} on this page</div>
          </div>
        </div>
        <button class="icon-button" data-action="collapse" aria-label="Collapse toolbar" data-tooltip="Collapse toolbar">
          ${icon("panelClose")}
        </button>
      </div>
      <div class="primary-actions">
        <button class="action-button primary ${selectionMode ? "active" : ""}" data-action="select" aria-label="Annotate page">
          ${icon("mousePointer")}
          <span>${selectionMode ? "Annotating" : "Annotate"}</span>
        </button>
        <button class="action-button ${moveMode ? "active" : ""}" data-action="move" aria-label="Move an element">
          ${icon("maximize")}
          <span>${moveMode ? (moveSource ? "Place" : "Select") : "Move"}</span>
        </button>
        <button class="action-button ${batchPanel.classList.contains("open") ? "active" : ""}" data-action="batch" aria-label="Review annotation batch">
          ${icon("clipboardList")}
          <span>Review</span>
        </button>
        <button class="action-button" data-action="copy" aria-label="Copy change request">
          ${icon("copy")}
          <span>Copy request</span>
        </button>
      </div>
      <div class="utility-actions" aria-label="OpenTarget UI utilities">
        <button class="icon-button ${settings.hideMarkers ? "active" : ""}" data-action="hide" aria-label="${settings.hideMarkers ? "Show markers" : "Hide markers"}" data-tooltip="${settings.hideMarkers ? "Show markers" : "Hide markers"}">
          ${settings.hideMarkers ? icon("eye") : icon("eyeOff")}
        </button>
        <button class="icon-button ${paused ? "active" : ""}" data-action="pause" aria-label="${paused ? "Resume page motion" : "Pause page motion"}" data-tooltip="${paused ? "Resume motion" : "Pause motion"}">
          ${paused ? icon("play") : icon("pause")}
        </button>
        <button class="icon-button" data-action="settings" aria-label="Open settings" data-tooltip="Settings">
          ${icon("settings")}
        </button>
        <button class="icon-button danger ${clearConfirmationActive() ? "active" : ""}" data-action="clear" aria-label="${clearConfirmationActive() ? "Confirm clear annotations" : "Clear annotations"}" data-tooltip="${clearConfirmationActive() ? "Click again to clear" : "Clear annotations"}">
          ${icon("trash")}
        </button>
      </div>
      <div class="status-row">
        <span class="status-pill"><span class="dot ${selectionMode || moveMode ? "on" : ""}"></span>${selectionMode ? "Click a target" : moveMode ? (moveSource ? "Click destination" : "Click item to move") : "Ready"}</span>
        <span class="status-pill${syncStatusClass()}">${icon("server")} ${syncStatusLabel()}</span>
      </div>
    `;
  }

  toolbar.querySelectorAll<HTMLButtonElement>("[data-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      if (suppressNextToolbarClick) {
        suppressNextToolbarClick = false;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      void handleToolbarAction(button.dataset.action ?? "");
    });
  });
  applyToolbarPosition();
}

function renderMarkers(): void {
  markerLayer.innerHTML = "";
  if (!settings.enabled) {
    markerLayer.style.display = "none";
    return;
  }

  markerLayer.style.display = settings.hideMarkers ? "none" : "block";

  annotations.forEach((annotation, index) => {
    if (annotation.status === "dismissed") return;

    const marker = document.createElement("button");
    marker.className = "marker";
    marker.type = "button";
    marker.dataset.id = annotation.id;
    marker.dataset.status = annotation.status ?? "pending";
    marker.textContent = String(index + 1);
    marker.title = annotation.comment;
    marker.style.left = `${annotation.x}%`;
    marker.style.top = `${annotation.isFixed ? annotation.y : annotation.y - window.scrollY}px`;
    marker.style.setProperty("--otu-accent", settings.markerColor);
    marker.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openEditComposer(annotation.id);
    });
    markerLayer.appendChild(marker);
  });
}

function renderBatch(open = false): void {
  batchPanel.className = `panel batch${open ? " open" : ""}`;
  if (!open) {
    batchPanel.innerHTML = "";
    return;
  }

  const items = activeAnnotations();
  const clearArmed = clearConfirmationActive();
  batchPanel.innerHTML = `
    <div class="panel-header">
      <h2 class="panel-title">${icon("clipboardList")} Review batch</h2>
      <button class="icon-button" data-batch-close aria-label="Close batch manager" data-tooltip="Close">
        ${icon("x")}
      </button>
    </div>
    <div class="batch-summary">
      ${items.length > 0 ? `${items.length} ${items.length === 1 ? "change" : "changes"} ready for the copied request.` : "No changes in this page batch yet."}
    </div>
    ${
      items.length > 0
        ? `<div class="batch-list">
            ${items
              .map(
                (annotation, index) => `
                  <article class="batch-item">
                    <div class="batch-item-header">
                      <span class="batch-index">${index + 1}</span>
                      <div class="batch-comment">${escapeHtml(oneLine(annotation.comment))}</div>
                      <div class="batch-item-actions">
                        <button class="icon-button" data-batch-edit="${escapeHtml(annotation.id)}" aria-label="Edit change ${index + 1}" data-tooltip="Edit">
                          ${icon("message")}
                        </button>
                        <button class="icon-button danger" data-batch-delete="${escapeHtml(annotation.id)}" aria-label="Delete change ${index + 1}" data-tooltip="Delete">
                          ${icon("trash")}
                        </button>
                      </div>
                    </div>
                    <div class="batch-target">${escapeHtml(annotation.kind === "rearrange" ? `Move: ${annotation.elementPath}` : annotation.elementPath)}</div>
                  </article>
                `
              )
              .join("")}
          </div>`
        : `<div class="batch-empty">
            <strong>Nothing to send</strong>
            <span>Click Annotate or Move, then add a change to build the request.</span>
          </div>`
    }
    <div class="button-row">
      <button class="command danger" data-batch-clear ${items.length === 0 ? "disabled" : ""}>${icon("trash")} ${clearArmed ? "Confirm clear" : "Clear all"}</button>
    </div>
  `;

  batchPanel.querySelector<HTMLButtonElement>("[data-batch-close]")?.addEventListener("click", () => {
    renderBatch(false);
    renderToolbar();
  });
  batchPanel.querySelector<HTMLButtonElement>("[data-batch-clear]")?.addEventListener("click", () => {
    void handleToolbarAction("clear");
  });
  batchPanel.querySelectorAll<HTMLButtonElement>("[data-batch-edit]").forEach((button) => {
    button.addEventListener("click", () => {
      renderBatch(false);
      renderToolbar();
      openEditComposer(button.dataset.batchEdit ?? "");
    });
  });
  batchPanel.querySelectorAll<HTMLButtonElement>("[data-batch-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      void deleteAnnotationById(button.dataset.batchDelete ?? "");
    });
  });
  positionPanelNearToolbar(batchPanel);
}

function renderSettings(open = false): void {
  settingsPanel.className = `panel settings${open ? " open" : ""}`;
  settingsPanel.innerHTML = `
    <div class="panel-header">
      <h2 class="panel-title">${icon("settings")} Settings</h2>
      <button class="icon-button" data-settings-close aria-label="Close settings" data-tooltip="Close settings">
        ${icon("x")}
      </button>
    </div>
    <div class="setting-grid">
      <label class="setting">
        Output detail
        <select id="otu-output-detail">
          ${(["compact", "standard", "detailed", "forensic"] satisfies OutputDetail[])
            .map((value) => `<option value="${value}" ${settings.outputDetail === value ? "selected" : ""}>${sentenceCase(value)}</option>`)
            .join("")}
        </select>
      </label>
      <label class="setting">
        Marker colour
        <input id="otu-marker-color" type="color" value="${settings.markerColor}" />
      </label>
      <label class="setting">
        Server URL
        <input id="otu-server-url" type="url" value="${settings.serverUrl}" />
      </label>
      <label class="toggle-row">
        <span class="toggle-copy">
          <strong>Sync to local server</strong>
          <small>Send notes to the MCP bridge.</small>
        </span>
        <input id="otu-sync" type="checkbox" ${settings.syncEnabled ? "checked" : ""} />
      </label>
      <div class="sync-health">
        <span>${icon("server")} <strong>${syncStatusLabel()}</strong></span>
        ${settings.syncEnabled && serverStatus === "offline" ? `<button class="command" data-sync-retry>Retry</button>` : ""}
      </div>
      <label class="toggle-row">
        <span class="toggle-copy">
          <strong>Block page clicks while annotating</strong>
          <small>Prevents accidental page actions.</small>
        </span>
        <input id="otu-block" type="checkbox" ${settings.blockPageInteractions ? "checked" : ""} />
      </label>
    </div>
    <div class="button-row">
      <button class="command" data-settings-close>${icon("x")} Close</button>
      <button class="command primary" data-settings-save>${icon("check")} Save settings</button>
    </div>
  `;

  settingsPanel.querySelector<HTMLButtonElement>("[data-settings-close]")?.addEventListener("click", () => {
    renderSettings(false);
  });

  settingsPanel.querySelector<HTMLButtonElement>("[data-sync-retry]")?.addEventListener("click", () => {
    void connectToServer();
  });

  settingsPanel.querySelector<HTMLButtonElement>("[data-settings-save]")?.addEventListener("click", async () => {
    const detail = settingsPanel.querySelector<HTMLSelectElement>("#otu-output-detail")?.value as OutputDetail;
    const markerColor = settingsPanel.querySelector<HTMLInputElement>("#otu-marker-color")?.value || settings.markerColor;
    const serverUrl = normalizeServerUrl(settingsPanel.querySelector<HTMLInputElement>("#otu-server-url")?.value || settings.serverUrl);
    const syncEnabled = Boolean(settingsPanel.querySelector<HTMLInputElement>("#otu-sync")?.checked);
    const blockPageInteractions = Boolean(settingsPanel.querySelector<HTMLInputElement>("#otu-block")?.checked);

    settings = { ...settings, outputDetail: detail, markerColor, serverUrl, syncEnabled, blockPageInteractions };
    await persistSettingsPreferences();
    updateAccent();
    renderToolbar();
    renderMarkers();
    renderSettings(false);
    if (settings.syncEnabled) void connectToServer();
    else {
      disconnectEvents();
      markServerAvailable();
    }
    showToast("Settings saved");
  });
  positionPanelNearToolbar(settingsPanel);
}

async function handleToolbarAction(action: string): Promise<void> {
  if (!settings.enabled) return;

  if (action === "expand") {
    collapsed = false;
    renderToolbar();
    return;
  }

  if (action === "collapse") {
    collapsed = true;
    selectionMode = false;
    moveMode = false;
    moveSource = null;
    closeComposer();
    renderBatch(false);
    renderSettings(false);
    renderToolbar();
    return;
  }

  if (action === "select") {
    selectionMode = !selectionMode;
    moveMode = false;
    moveSource = null;
    renderBatch(false);
    renderSettings(false);
    renderToolbar();
    showToast(selectionMode ? "Click or select text to annotate" : "Targeting off");
    return;
  }

  if (action === "move") {
    moveMode = !moveMode;
    moveSource = null;
    selectionMode = false;
    closeComposer();
    renderBatch(false);
    renderSettings(false);
    renderToolbar();
    showToast(moveMode ? "Click the item to move" : "Move mode off");
    return;
  }

  if (action === "batch") {
    const open = !batchPanel.classList.contains("open");
    renderSettings(false);
    renderBatch(open);
    renderToolbar();
    return;
  }

  if (action === "hide") {
    settings = { ...settings, hideMarkers: !settings.hideMarkers };
    await persistSettingsPreferences();
    renderToolbar();
    renderMarkers();
    return;
  }

  if (action === "pause") {
    paused ? resumeMotion() : pauseMotion();
    renderToolbar();
    return;
  }

  if (action === "copy") {
    await copyFeedback();
    return;
  }

  if (action === "clear") {
    if (activeAnnotations().length === 0) {
      resetClearConfirmation();
      renderToolbar();
      if (batchPanel.classList.contains("open")) renderBatch(true);
      showToast("No annotations to clear");
      return;
    }

    if (!clearConfirmationActive()) {
      armClearConfirmation();
      renderToolbar();
      if (batchPanel.classList.contains("open")) renderBatch(true);
      showToast("Click clear again to delete notes");
      return;
    }

    await clearAnnotations();
    return;
  }

  if (action === "settings") {
    renderBatch(false);
    renderSettings(!settingsPanel.classList.contains("open"));
  }
}

async function clearAnnotations(): Promise<void> {
  const removed = annotations;
  annotations = [];
  resetClearConfirmation();
  await persistAnnotations();
  renderToolbar();
  renderMarkers();
  if (batchPanel.classList.contains("open")) renderBatch(true);
  showToast("Annotations cleared");
  if (settings.syncEnabled) {
    removed.forEach((annotation) => queueRemoteSync(() => deleteAnnotationRemote(annotation.id)));
  }
}

async function deleteAnnotationById(id: string): Promise<void> {
  if (!id) return;
  const existing = annotations.find((annotation) => annotation.id === id);
  if (!existing) return;
  annotations = annotations.filter((annotation) => annotation.id !== id);
  await persistAnnotations();
  renderToolbar();
  renderMarkers();
  if (batchPanel.classList.contains("open")) renderBatch(true);
  if (editingId === id) closeComposer();
  showToast("Annotation deleted");
  if (settings.syncEnabled) queueRemoteSync(() => deleteAnnotationRemote(id));
}

function pageFixed(element: Element): boolean {
  let current: Element | null = element;
  while (current && current !== document.documentElement) {
    const position = getComputedStyle(current).position;
    if (position === "fixed" || position === "sticky") return true;
    current = current.parentElement;
  }
  return false;
}

function annotationFromDraft(target: DraftTarget, comment: string, intent: AnnotationIntent, severity: AnnotationSeverity): Annotation {
  const rect = target.rect;
  const fixed = pageFixed(target.element);
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const path = elementPath(target.element);
  const timestamp = Date.now();
  const annotation: Annotation = {
    id: `otu_${timestamp.toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    comment,
    elementPath: path,
    timestamp,
    x: Math.max(0, Math.min(100, (centerX / Math.max(window.innerWidth, 1)) * 100)),
    y: fixed ? centerY : centerY + window.scrollY,
    element: target.element.tagName.toLowerCase(),
    url: location.href,
    title: document.title,
    boundingBox: {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height
    },
    cssClasses: Array.from(target.element.classList).join(" "),
    computedStyles: computedStyleSnapshot(target.element),
    accessibility: accessibilitySummary(target.element),
    nearbyText: nearbyText(target.element),
    isFixed: fixed,
    fullPath: path,
    intent,
    severity,
    kind: "feedback",
    status: "pending",
    thread: []
  };

  if (target.selectedText) annotation.selectedText = target.selectedText;
  if (sessionId) annotation.sessionId = sessionId;

  return annotation;
}

function pageRectFromDom(rect: DOMRect): RectSnapshot {
  return {
    x: rect.left + window.scrollX,
    y: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height
  };
}

function moveAnnotationFromPoint(source: MoveSource, clientX: number, clientY: number): Annotation {
  const timestamp = Date.now();
  const width = Math.max(source.rect.width, 1);
  const height = Math.max(source.rect.height, 1);
  const currentRect: RectSnapshot = {
    x: clientX + window.scrollX - width / 2,
    y: clientY + window.scrollY - height / 2,
    width,
    height
  };
  const centerX = currentRect.x - window.scrollX + width / 2;
  const centerY = currentRect.y - window.scrollY + height / 2;
  const annotation: Annotation = {
    id: `otu_${timestamp.toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    comment: `Move ${source.label} to the pointed position`,
    elementPath: source.path,
    timestamp,
    x: Math.max(0, Math.min(100, (centerX / Math.max(window.innerWidth, 1)) * 100)),
    y: centerY + window.scrollY,
    element: source.element.tagName.toLowerCase(),
    url: location.href,
    title: document.title,
    boundingBox: currentRect,
    cssClasses: Array.from(source.element.classList).join(" "),
    accessibility: accessibilitySummary(source.element),
    nearbyText: nearbyText(source.element),
    isFixed: false,
    fullPath: source.path,
    intent: "change",
    severity: "important",
    kind: "rearrange",
    rearrange: {
      selector: source.path,
      label: source.label,
      tagName: source.element.tagName.toLowerCase(),
      originalRect: pageRectFromDom(source.rect),
      currentRect
    },
    status: "pending",
    thread: []
  };

  if (sessionId) annotation.sessionId = sessionId;
  return annotation;
}

function openCreateComposer(target: DraftTarget): void {
  pendingTarget = target;
  editingId = null;
  composer.className = "panel composer open";
  composer.dataset.mode = "create";
  composer.style.left = `${Math.min(target.clientX + 12, window.innerWidth - 376)}px`;
  composer.style.top = `${Math.min(target.clientY + 12, window.innerHeight - 260)}px`;
  composer.innerHTML = `
    <textarea id="otu-comment" placeholder="Type the change for this target"></textarea>
    <div class="button-row">
      <button class="command primary" data-merge>${icon("message")} Merge</button>
    </div>
  `;
  composer.querySelector<HTMLTextAreaElement>("#otu-comment")?.focus();
  composer.querySelector<HTMLButtonElement>("[data-merge]")?.addEventListener("click", () => {
    void addAnnotationFromComposer();
  });
}

function openEditComposer(id: string): void {
  const annotation = annotations.find((item) => item.id === id);
  if (!annotation) return;

  pendingTarget = null;
  editingId = id;
  composer.className = "panel composer open";
  composer.dataset.mode = "edit";
  composer.style.left = "18px";
  composer.style.top = "18px";
  composer.innerHTML = `
    <div class="panel-header">
      <div class="panel-title">${icon("message")} Edit annotation</div>
      <button class="icon-button" data-cancel aria-label="Close annotation editor" data-tooltip="Close">
        ${icon("x")}
      </button>
    </div>
    <div class="target-card">
      <strong>${escapeHtml(annotation.elementPath)}</strong>
      <span>${sentenceCase(annotation.status ?? "pending")} note</span>
    </div>
    <textarea id="otu-comment">${escapeHtml(annotation.comment)}</textarea>
    <div class="field-row">
      <label class="form-field">
        Intent
        <select id="otu-intent">
          ${(["fix", "change", "question", "approve"] satisfies AnnotationIntent[])
            .map((value) => `<option value="${value}" ${annotation.intent === value ? "selected" : ""}>${intentLabel(value)}</option>`)
            .join("")}
        </select>
      </label>
      <label class="form-field">
        Priority
        <select id="otu-severity">
          ${(["important", "blocking", "suggestion"] satisfies AnnotationSeverity[])
            .map((value) => `<option value="${value}" ${annotation.severity === value ? "selected" : ""}>${sentenceCase(value)}</option>`)
            .join("")}
        </select>
      </label>
    </div>
    <div class="button-row">
      <button class="command danger" data-delete>${icon("trash")} Delete</button>
      <button class="command" data-cancel>${icon("x")} Close</button>
      <button class="command primary" data-save>${icon("check")} Save note</button>
    </div>
  `;
  composer.querySelector<HTMLButtonElement>("[data-cancel]")?.addEventListener("click", closeComposer);
  composer.querySelector<HTMLButtonElement>("[data-delete]")?.addEventListener("click", deleteEditingAnnotation);
  composer.querySelector<HTMLButtonElement>("[data-save]")?.addEventListener("click", saveEditingAnnotation);
}

function closeComposer(): void {
  pendingTarget = null;
  editingId = null;
  composerDrag = null;
  composer.className = "panel composer";
  delete composer.dataset.mode;
  composer.innerHTML = "";
}

function handleComposerKeyDown(event: KeyboardEvent): void {
  if (event.key !== "Escape") return;
  if (!composer.classList.contains("open") || composer.dataset.mode !== "create") return;
  event.preventDefault();
  event.stopPropagation();
  closeComposer();
}

async function addAnnotationFromComposer(): Promise<void> {
  if (!pendingTarget) return;
  const comment = composer.querySelector<HTMLTextAreaElement>("#otu-comment")?.value.trim() ?? "";
  if (!comment) {
    showToast("Type a change first");
    return;
  }

  const annotation = annotationFromDraft(pendingTarget, comment, "change", "important");
  annotations = [...annotations, annotation];
  await persistAnnotations();
  renderToolbar();
  renderMarkers();
  if (batchPanel.classList.contains("open")) renderBatch(true);
  closeComposer();
  if (settings.syncEnabled) queueRemoteSync(() => syncAnnotation(annotation));
  showToast("Merged into batch");
}

async function saveEditingAnnotation(): Promise<void> {
  if (!editingId) return;
  const id = editingId;
  const comment = composer.querySelector<HTMLTextAreaElement>("#otu-comment")?.value.trim() ?? "";
  if (!comment) {
    showToast("Comment cannot be empty");
    return;
  }

  const intent = (composer.querySelector<HTMLSelectElement>("#otu-intent")?.value ?? "fix") as AnnotationIntent;
  const severity = (composer.querySelector<HTMLSelectElement>("#otu-severity")?.value ?? "important") as AnnotationSeverity;
  const updatedAt = new Date().toISOString();
  annotations = annotations.map((annotation) =>
    annotation.id === id ? { ...annotation, comment, intent, severity, updatedAt } : annotation
  );
  await persistAnnotations();
  renderToolbar();
  renderMarkers();
  if (batchPanel.classList.contains("open")) renderBatch(true);
  closeComposer();
  if (settings.syncEnabled) queueRemoteSync(() => patchAnnotation(id, { comment, intent, severity, updatedAt }));
}

async function deleteEditingAnnotation(): Promise<void> {
  if (!editingId) return;
  await deleteAnnotationById(editingId);
}

async function buildFeedbackMarkdown(items: Annotation[]): Promise<string | null> {
  if (items.length === 0) return null;
  return formatAnnotationsMarkdown(items, {
    mode: "change-request",
    detail: settings.outputDetail,
    includeHeader: true
  });
}

async function copyFeedback(show = true): Promise<boolean> {
  return copyAnnotations(activeAnnotations(), show);
}

async function copyAnnotations(items: Annotation[], show = true): Promise<boolean> {
  const markdown = await buildFeedbackMarkdown(items);
  if (markdown === null) {
    if (show) showToast("No changes to copy");
    return false;
  }
  await navigator.clipboard.writeText(markdown);
  if (show) showToast("Change request copied");
  return true;
}

function toolbarDragSource(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  if (target.closest(".toolbar-header .icon-button")) return false;
  return Boolean(target.closest(".toolbar-header, .collapsed-button"));
}

function handleToolbarPointerDown(event: PointerEvent): void {
  if (event.button !== 0 || !toolbarDragSource(event.target)) return;
  const rect = toolbar.getBoundingClientRect();
  uiDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startLeft: rect.left,
    startTop: rect.top,
    moved: false
  };
}

function handleToolbarPointerMove(event: PointerEvent): void {
  if (!uiDrag || uiDrag.pointerId !== event.pointerId) return;
  const dx = event.clientX - uiDrag.startX;
  const dy = event.clientY - uiDrag.startY;
  if (!uiDrag.moved && Math.hypot(dx, dy) < 4) return;
  uiDrag.moved = true;
  toolbar.classList.add("dragging");
  if (!toolbar.hasPointerCapture(event.pointerId)) {
    toolbar.setPointerCapture(event.pointerId);
  }
  const rect = toolbar.getBoundingClientRect();
  const next = clampUiPosition(uiDrag.startLeft + dx, uiDrag.startTop + dy, rect.width, rect.height);
  setFixedPosition(toolbar, next);
  positionOpenPanels();
  event.preventDefault();
  event.stopPropagation();
}

function endToolbarDrag(event: PointerEvent): void {
  if (!uiDrag || uiDrag.pointerId !== event.pointerId) return;
  const moved = uiDrag.moved;
  uiDrag = null;
  toolbar.classList.remove("dragging");
  if (toolbar.hasPointerCapture(event.pointerId)) {
    toolbar.releasePointerCapture(event.pointerId);
  }
  if (moved) {
    const rect = toolbar.getBoundingClientRect();
    const next = clampUiPosition(rect.left, rect.top, rect.width, rect.height);
    settings = { ...settings, uiPosition: next };
    void persistSettingsPreferences();
    suppressNextToolbarClick = true;
    window.setTimeout(() => {
      suppressNextToolbarClick = false;
    }, 250);
    showToast("UI position saved");
    event.preventDefault();
    event.stopPropagation();
  }
}

function composerDragBlocked(target: EventTarget | null): boolean {
  return target instanceof Element && Boolean(target.closest("textarea, button, input, select"));
}

function clampedComposerPosition(left: number, top: number): { left: number; top: number } {
  const rect = composer.getBoundingClientRect();
  const margin = 8;
  const maxLeft = Math.max(margin, window.innerWidth - rect.width - margin);
  const maxTop = Math.max(margin, window.innerHeight - rect.height - margin);
  return {
    left: Math.min(Math.max(left, margin), maxLeft),
    top: Math.min(Math.max(top, margin), maxTop)
  };
}

function handleComposerPointerDown(event: PointerEvent): void {
  if (!composer.classList.contains("open") || event.button !== 0 || composerDragBlocked(event.target)) return;
  const rect = composer.getBoundingClientRect();
  composerDrag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startLeft: rect.left,
    startTop: rect.top
  };
  composer.classList.add("dragging");
  composer.setPointerCapture(event.pointerId);
  event.preventDefault();
  event.stopPropagation();
}

function handleComposerPointerMove(event: PointerEvent): void {
  if (!composerDrag || composerDrag.pointerId !== event.pointerId) return;
  const next = clampedComposerPosition(
    composerDrag.startLeft + event.clientX - composerDrag.startX,
    composerDrag.startTop + event.clientY - composerDrag.startY
  );
  composer.style.left = `${next.left}px`;
  composer.style.top = `${next.top}px`;
  event.preventDefault();
  event.stopPropagation();
}

function endComposerDrag(event: PointerEvent): void {
  if (!composerDrag || composerDrag.pointerId !== event.pointerId) return;
  composerDrag = null;
  composer.classList.remove("dragging");
  if (composer.hasPointerCapture(event.pointerId)) {
    composer.releasePointerCapture(event.pointerId);
  }
  event.preventDefault();
  event.stopPropagation();
}

function pauseMotion(): void {
  if (!document.getElementById(PAUSE_STYLE_ID)) {
    const pauseStyle = document.createElement("style");
    pauseStyle.id = PAUSE_STYLE_ID;
    pauseStyle.textContent = `
      html.opentargetui-motion-paused *,
      html.opentargetui-motion-paused *::before,
      html.opentargetui-motion-paused *::after {
        animation-play-state: paused !important;
        transition-duration: 0s !important;
      }
    `;
    document.head.appendChild(pauseStyle);
  }

  pausedMedia = Array.from(document.querySelectorAll("video, audio")).filter((media): media is HTMLMediaElement => {
    if (media instanceof HTMLMediaElement && !media.paused) {
      media.pause();
      return true;
    }
    return false;
  });
  document.documentElement.classList.add("opentargetui-motion-paused");
  paused = true;
  showToast("Motion paused");
}

function resumeMotion(): void {
  document.documentElement.classList.remove("opentargetui-motion-paused");
  pausedMedia.forEach((media) => void media.play().catch(() => undefined));
  pausedMedia = [];
  paused = false;
  showToast("Motion resumed");
}

async function persistAnnotations(): Promise<void> {
  await storageSet(pageStorageKey(location.href), annotations);
}

async function loadState(): Promise<void> {
  const { copyOnAdd: _copyOnAdd, ...storedSettings } = await storageGet<Partial<ExtensionSettings> & { copyOnAdd?: unknown }>(
    settingsStorageKey(),
    DEFAULT_SETTINGS
  );
  settings = { ...DEFAULT_SETTINGS, ...storedSettings, enabled: pageEnabledOverride ?? false };
  settings.serverUrl = normalizeServerUrl(settings.serverUrl);
  annotations = await storageGet<Annotation[]>(pageStorageKey(location.href), []);
  sessionId = await storageGet<string | null>(pageSessionKey(location.href), null);
  updateAccent();
  applyEnabledState();
  renderToolbar();
  renderMarkers();
  renderSettings(false);
  if (settings.syncEnabled) void connectToServer();
}

function applyEnabledState(): void {
  setRootVisible(settings.enabled);
  if (settings.enabled) return;
  selectionMode = false;
  moveMode = false;
  moveSource = null;
  pendingTarget = null;
  editingId = null;
  hideHoverFrame();
  closeComposer();
  renderBatch(false);
  renderSettings(false);
}

function applySettings(next: ExtensionSettings): void {
  const wasEnabled = settings.enabled;
  const { copyOnAdd: _copyOnAdd, ...nextSettings } = next as ExtensionSettings & { copyOnAdd?: unknown };
  settings = {
    ...DEFAULT_SETTINGS,
    ...nextSettings,
    enabled: settings.enabled,
    serverUrl: normalizeServerUrl(next.serverUrl || DEFAULT_SETTINGS.serverUrl)
  };
  updateAccent();
  applyEnabledState();
  renderToolbar();
  renderMarkers();
  if (settings.enabled && !wasEnabled) collapsed = false;
  if (settings.enabled) {
    renderToolbar();
    if (batchPanel.classList.contains("open")) renderBatch(true);
  }
  if (settings.syncEnabled) void connectToServer();
  else {
    disconnectEvents();
    markServerAvailable();
  }
}

async function ensureSession(): Promise<string> {
  if (sessionId) return sessionId;
  const response = await fetch(`${settings.serverUrl}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: location.href, title: document.title })
  });
  if (!response.ok) throw new Error(`Session failed: ${response.status}`);
  const session = (await response.json()) as { id: string };
  const id = session.id;
  sessionId = id;
  await storageSet(pageSessionKey(location.href), id);
  annotations = annotations.map((annotation) => ({ ...annotation, sessionId: id }));
  await persistAnnotations();
  return id;
}

async function connectToServer(): Promise<void> {
  try {
    serverOffline = false;
    serverOfflineNotified = false;
    setServerStatus("connecting");
    const id = await ensureSession();
    await Promise.all(annotations.map((annotation) => syncAnnotation(annotation)));
    startEvents(id);
    markServerAvailable();
    showToast("Server connected");
  } catch (error) {
    markServerUnavailable(error, "Server unavailable");
  }
}

function disconnectEvents(): void {
  eventSource?.close();
  eventSource = null;
}

function startEvents(id: string): void {
  disconnectEvents();
  eventSource = new EventSource(`${settings.serverUrl}/sessions/${id}/events`);
  eventSource.onmessage = (message) => {
    const event = JSON.parse(message.data) as { type: string; data?: Annotation; annotationId?: string };
    if (event.type === "annotation.updated" && event.data) {
      annotations = annotations.map((annotation) => (annotation.id === event.data?.id ? event.data : annotation));
      void persistAnnotations();
      renderToolbar();
      renderMarkers();
      if (batchPanel.classList.contains("open")) renderBatch(true);
    }
    if (event.type === "annotation.deleted" && event.annotationId) {
      annotations = annotations.filter((annotation) => annotation.id !== event.annotationId);
      void persistAnnotations();
      renderToolbar();
      renderMarkers();
      if (batchPanel.classList.contains("open")) renderBatch(true);
    }
  };
  eventSource.onerror = () => {
    markServerUnavailable(undefined, "Server events disconnected");
  };
}

async function syncAnnotation(annotation: Annotation): Promise<void> {
  const id = await ensureSession();
  const response = await fetch(`${settings.serverUrl}/sessions/${id}/annotations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(annotation)
  });
  if (!response.ok) throw new Error(`Annotation sync failed: ${response.status}`);
}

async function patchAnnotation(id: string, patch: Partial<Annotation>): Promise<void> {
  const response = await fetch(`${settings.serverUrl}/annotations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch)
  });
  if (!response.ok) throw new Error(`Annotation update failed: ${response.status}`);
}

async function deleteAnnotationRemote(id: string): Promise<void> {
  const response = await fetch(`${settings.serverUrl}/annotations/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error(`Annotation delete failed: ${response.status}`);
}

function updateHoverFrame(element: Element): void {
  const rect = element.getBoundingClientRect();
  hoverFrame.style.display = "block";
  hoverFrame.style.left = `${rect.left}px`;
  hoverFrame.style.top = `${rect.top}px`;
  hoverFrame.style.width = `${rect.width}px`;
  hoverFrame.style.height = `${rect.height}px`;
}

function hideHoverFrame(): void {
  hoverFrame.style.display = "none";
}

function eventElement(event: Event): Element | null {
  const target = event.target;
  if (!(target instanceof Element)) return null;
  if (target.closest(`[data-opentargetui]`)) return null;
  return target;
}

function handleMouseMove(event: MouseEvent): void {
  if (!settings.enabled) return;
  if ((!selectionMode && !moveMode) || isInsideOverlay(event)) return;
  const element = eventElement(event);
  if (!element) return;
  updateHoverFrame(element);
}

function handleMouseOut(): void {
  if (!settings.enabled) return;
  if (!selectionMode && !moveMode) hideHoverFrame();
}

async function handleMoveClick(event: MouseEvent): Promise<void> {
  if (!settings.enabled) return;
  if (isInsideOverlay(event)) return;
  const element = eventElement(event);
  if (!element && !moveSource) return;
  event.preventDefault();
  event.stopPropagation();

  if (!moveSource) {
    if (!element) return;
    const path = elementPath(element);
    moveSource = {
      element,
      rect: element.getBoundingClientRect(),
      path,
      label: elementLabel(element)
    };
    renderToolbar();
    showToast("Click the destination");
    return;
  }

  const annotation = moveAnnotationFromPoint(moveSource, event.clientX, event.clientY);
  annotations = [...annotations, annotation];
  moveMode = false;
  moveSource = null;
  await persistAnnotations();
  renderToolbar();
  renderMarkers();
  if (batchPanel.classList.contains("open")) renderBatch(true);
  if (settings.syncEnabled) queueRemoteSync(() => syncAnnotation(annotation));
  showToast("Move request added");
}

function handleMouseUp(event: MouseEvent): void {
  if (!settings.enabled) return;
  if (!selectionMode || isInsideOverlay(event)) return;
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed || selection.toString().trim().length === 0) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return;

  const ancestor = range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
    ? range.commonAncestorContainer
    : range.commonAncestorContainer.parentElement;
  if (!(ancestor instanceof Element)) return;

  skipNextClick = true;
  openCreateComposer({
    element: ancestor,
    rect,
    clientX: event.clientX,
    clientY: event.clientY,
    selectedText: selection.toString().trim()
  });
}

function handleClick(event: MouseEvent): void {
  if (!settings.enabled) return;
  if (moveMode) {
    void handleMoveClick(event);
    return;
  }

  if (!selectionMode || isInsideOverlay(event)) return;
  if (skipNextClick) {
    skipNextClick = false;
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  const element = eventElement(event);
  if (!element) return;
  if (settings.blockPageInteractions) {
    event.preventDefault();
    event.stopPropagation();
  }

  openCreateComposer({
    element,
    rect: element.getBoundingClientRect(),
    clientX: event.clientX,
    clientY: event.clientY,
    selectedText: ""
  });
}

function handleWindowResize(): void {
  if (!settings.enabled) return;
  renderMarkers();
  applyToolbarPosition();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

document.addEventListener("mousemove", handleMouseMove, true);
document.addEventListener("mouseout", handleMouseOut, true);
document.addEventListener("mouseup", handleMouseUp, true);
document.addEventListener("click", handleClick, true);
document.addEventListener("keydown", handleComposerKeyDown, true);
toolbar.addEventListener("pointerdown", handleToolbarPointerDown);
toolbar.addEventListener("pointermove", handleToolbarPointerMove);
toolbar.addEventListener("pointerup", endToolbarDrag);
toolbar.addEventListener("pointercancel", endToolbarDrag);
composer.addEventListener("pointerdown", handleComposerPointerDown);
composer.addEventListener("pointermove", handleComposerPointerMove);
composer.addEventListener("pointerup", endComposerDrag);
composer.addEventListener("pointercancel", endComposerDrag);
window.addEventListener("scroll", renderMarkers, { passive: true });
window.addEventListener("resize", handleWindowResize, { passive: true });

function handlePopupMessage(
  message: { source?: string; type?: string },
  _sender: chrome.runtime.MessageSender,
  sendResponse: (response?: unknown) => void
): boolean {
  if (message.source !== "opentargetui-popup") return false;
  if (message.type === "get-state") {
    sendResponse({ ok: true, enabled: settings.enabled });
    return true;
  }
  if (message.type === "set-enabled") {
    const enabled = Boolean((message as { enabled?: boolean }).enabled);
    pageEnabledOverride = enabled;
    settings = { ...settings, enabled };
    applyEnabledState();
    renderToolbar();
    renderMarkers();
    if (enabled) {
      collapsed = false;
      renderToolbar();
    }
    sendResponse({ ok: true, enabled });
    return true;
  }
  return false;
}

try {
  if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener(handlePopupMessage);
  }
  if (typeof chrome !== "undefined" && chrome.storage?.onChanged) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local") return;
      const change = changes[settingsStorageKey()];
      if (!change?.newValue) return;
      applySettings(change.newValue as ExtensionSettings);
    });
  }
} catch (error) {
  if (isExtensionContextInvalidated(error)) extensionContextInvalidated = true;
  else console.warn("[OpenTarget UI] Message handler unavailable", error);
}

void loadState();
