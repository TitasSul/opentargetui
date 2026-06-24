#!/bin/zsh
set -euo pipefail

cd "$(dirname "$0")"

port="${OPENTARGETUI_PORT:-4747}"
echo "OpenTarget UI local server"
echo "URL: http://localhost:${port}"
echo

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 20+ is required."
  echo "Install Node.js from https://nodejs.org, then double-click this file again."
  echo
  echo "Press any key to close."
  read -k 1
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  if command -v corepack >/dev/null 2>&1; then
    echo "Enabling pnpm..."
    corepack enable >/dev/null 2>&1 || true
    corepack prepare pnpm@10.25.0 --activate
  fi
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required, and Corepack could not enable it."
  echo "Run: corepack enable"
  echo
  echo "Press any key to close."
  read -k 1
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing dependencies..."
  pnpm install --frozen-lockfile
fi

echo "Building server..."
pnpm --filter @opentargetui/core build
pnpm --filter @opentargetui/mcp-server build

echo
echo "Server is starting. Keep this window open while using extension sync."
echo "Press Control-C to stop."
echo
pnpm --filter @opentargetui/mcp-server start
