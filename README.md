# OpenTarget UI

OpenTarget UI is an MIT-licensed browser extension for giving precise visual feedback to AI coding agents. It lets you click elements on a live page, attach notes, and export structured markdown or sync annotations to a local MCP server.

This is a clean-room implementation. It is feature-compatible with the public idea of structured UI feedback, but it does not copy Agentation source code, branding, assets, or interface text.

## What ships in v0.1

- Chrome/Edge Manifest V3 extension.
- Click-to-annotate overlay with text selection support.
- Point-to-move mode for asking an agent to move a selected element to a clicked destination.
- Review batch panel for editing, deleting, copying, or clearing the current page changes.
- Local page storage through `chrome.storage.local`.
- LLM-ready merged change-request copy, with compact, standard, detailed, and forensic context levels.
- Optional sync to a local HTTP server on `http://localhost:4747`.
- MCP tools for agents to list, acknowledge, resolve, dismiss, reply to, and watch annotations.

## Install for development

```sh
pnpm install
pnpm build
```

Load the extension from `apps/extension/dist`:

1. Open `chrome://extensions` or `edge://extensions`.
2. Enable developer mode.
3. Click "Load unpacked".
4. Select `apps/extension/dist`.

Start the local server:

```sh
pnpm server
```

Run the server health check:

```sh
pnpm doctor
```

## MCP usage

Point your MCP-capable coding agent at:

```sh
pnpm --filter @opentargetui/mcp-server mcp
```

For a packed install, use the package binary after building:

```sh
opentargetui-server mcp
```

## Repository layout

- `apps/extension` - Manifest V3 extension.
- `apps/mcp-server` - Local HTTP server and MCP stdio server.
- `packages/core` - Shared annotation types, selector utilities, and markdown formatter.

## Notes

OpenTarget UI keeps annotation data local by default. Server sync is opt-in from the extension settings panel.
