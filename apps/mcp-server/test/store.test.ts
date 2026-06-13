import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { JsonStore } from "../src/store";

let tempDir: string | undefined;

afterEach(async () => {
  if (tempDir) await rm(tempDir, { recursive: true, force: true });
  tempDir = undefined;
});

describe("JsonStore", () => {
  it("creates sessions and stores pending annotations", async () => {
    tempDir = await mkdtemp(join(tmpdir(), "opentargetui-"));
    const store = new JsonStore(join(tempDir, "sessions.json"));
    await store.load();
    const session = await store.createSession({ url: "http://localhost:3000/dashboard", title: "Dashboard" });
    const annotation = await store.upsertAnnotation(session.id, {
      id: "ann_1",
      comment: "Fix spacing",
      elementPath: "main > button",
      timestamp: 1,
      x: 20,
      y: 100,
      element: "button"
    });

    expect(annotation.sessionId).toBe(session.id);
    expect(store.pending()).toHaveLength(1);
    await store.setStatus("ann_1", "resolved", "Spacing fixed");
    expect(store.pending()).toHaveLength(0);
  });
});
