#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const distDir = join(repoRoot, "apps", "extension", "dist");

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

function fileHash(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function snapshot() {
  return new Map(
    walk(distDir)
      .map((path) => [relative(distDir, path).split(sep).join("/"), fileHash(path)])
      .sort(([a], [b]) => a.localeCompare(b))
  );
}

function changedFiles(before, after) {
  const names = new Set([...before.keys(), ...after.keys()]);
  return [...names].filter((name) => before.get(name) !== after.get(name)).sort();
}

const before = snapshot();
const build = spawnSync("pnpm", ["--filter", "@opentargetui/extension", "build"], {
  cwd: repoRoot,
  stdio: "inherit",
  shell: process.platform === "win32"
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

const changed = changedFiles(before, snapshot());
if (changed.length > 0) {
  console.error("apps/extension/dist is stale. Run pnpm --filter @opentargetui/extension build and commit the updated dist files.");
  for (const name of changed.slice(0, 20)) console.error(` - ${name}`);
  if (changed.length > 20) console.error(` - ${changed.length - 20} more`);
  process.exit(1);
}

console.log("apps/extension/dist is current.");
