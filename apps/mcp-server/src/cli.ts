#!/usr/bin/env node
import { startHttpServer } from "./http.js";
import { runMcpServer } from "./mcp.js";
import { defaultStorePath } from "./store.js";

function argValue(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function help(): void {
  console.log(`OpenTarget UI server

Usage:
  opentargetui-server server [--port 4747] [--store ./sessions.json]
  opentargetui-server mcp [--store ./sessions.json]
  opentargetui-server doctor [--port 4747]

Environment:
  OPENTARGETUI_PORT        HTTP server port
  OPENTARGETUI_STORE_PATH  JSON store location
`);
}

async function doctor(): Promise<void> {
  const port = Number(argValue("--port") ?? process.env.OPENTARGETUI_PORT ?? 4747);
  const url = `http://localhost:${port}/health`;
  console.log(`Store: ${argValue("--store") ?? defaultStorePath()}`);
  try {
    const response = await fetch(url);
    const body = await response.json();
    console.log(`HTTP: ${response.ok ? "ok" : "failed"} ${url}`);
    console.log(JSON.stringify(body, null, 2));
  } catch (error) {
    console.log(`HTTP: unavailable ${url}`);
    console.log((error as Error).message);
  }
}

async function main(): Promise<void> {
  const command = process.argv[2] ?? "help";
  const storePath = argValue("--store");

  if (command === "server") {
    const port = Number(argValue("--port") ?? process.env.OPENTARGETUI_PORT ?? 4747);
    const handle = await startHttpServer({ port, ...(storePath ? { storePath } : {}) });
    console.log(`OpenTarget UI HTTP server listening on http://localhost:${handle.port}`);
    console.log(`Store: ${handle.store.filePath}`);
    process.on("SIGINT", async () => {
      await handle.close();
      process.exit(0);
    });
    return;
  }

  if (command === "mcp") {
    await runMcpServer(storePath);
    return;
  }

  if (command === "doctor") {
    await doctor();
    return;
  }

  help();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
