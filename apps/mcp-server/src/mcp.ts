import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { JsonStore } from "./store.js";

function jsonText(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2)
      }
    ]
  };
}

async function wait(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runMcpServer(storePath?: string): Promise<void> {
  const store = new JsonStore(storePath);
  await store.load();

  const server = new McpServer({
    name: "opentargetui",
    version: "0.1.0"
  });

  server.tool("opentargetui_list_sessions", "List OpenTarget UI annotation sessions.", {}, async () => {
    await store.reload();
    return jsonText({ sessions: store.listSessions() });
  });

  server.tool(
    "opentargetui_get_session",
    "Get one annotation session with all annotations.",
    { sessionId: z.string() },
    async ({ sessionId }) => {
      await store.reload();
      const session = store.getSession(sessionId);
      return jsonText(session ?? { error: "Session not found" });
    }
  );

  server.tool(
    "opentargetui_get_pending",
    "Get pending annotations for a session, or all sessions if no session ID is provided.",
    { sessionId: z.string().optional() },
    async ({ sessionId }) => {
      await store.reload();
      return jsonText({ annotations: store.pending(sessionId) });
    }
  );

  server.tool("opentargetui_get_all_pending", "Get pending annotations across all sessions.", {}, async () => {
    await store.reload();
    return jsonText({ annotations: store.pending() });
  });

  server.tool(
    "opentargetui_acknowledge",
    "Mark an annotation as acknowledged.",
    { annotationId: z.string() },
    async ({ annotationId }) => {
      await store.reload();
      return jsonText(await store.setStatus(annotationId, "acknowledged"));
    }
  );

  server.tool(
    "opentargetui_resolve",
    "Mark an annotation as resolved, optionally with a summary.",
    { annotationId: z.string(), summary: z.string().optional() },
    async ({ annotationId, summary }) => {
      await store.reload();
      return jsonText(await store.setStatus(annotationId, "resolved", summary));
    }
  );

  server.tool(
    "opentargetui_dismiss",
    "Dismiss an annotation with a reason.",
    { annotationId: z.string(), reason: z.string() },
    async ({ annotationId, reason }) => {
      await store.reload();
      return jsonText(await store.setStatus(annotationId, "dismissed", reason));
    }
  );

  server.tool(
    "opentargetui_reply",
    "Add a thread reply to an annotation.",
    { annotationId: z.string(), message: z.string() },
    async ({ annotationId, message }) => {
      await store.reload();
      return jsonText(await store.addThreadMessage(annotationId, "agent", message));
    }
  );

  server.tool(
    "opentargetui_watch_annotations",
    "Wait until new pending annotations appear, then return the pending batch.",
    {
      sessionId: z.string().optional(),
      batchWindowSeconds: z.number().min(0).max(60).default(3),
      timeoutSeconds: z.number().min(1).max(300).default(120)
    },
    async ({ sessionId, batchWindowSeconds, timeoutSeconds }) => {
      await store.reload();
      const seen = new Set(store.pending(sessionId).map((annotation) => annotation.id));
      const deadline = Date.now() + timeoutSeconds * 1000;

      while (Date.now() < deadline) {
        await wait(1000);
        await store.reload();
        const fresh = store.pending(sessionId).filter((annotation) => !seen.has(annotation.id));
        if (fresh.length > 0) {
          await wait(batchWindowSeconds * 1000);
          await store.reload();
          return jsonText({ annotations: store.pending(sessionId).filter((annotation) => !seen.has(annotation.id)) });
        }
      }

      return jsonText({ annotations: [] });
    }
  );

  await server.connect(new StdioServerTransport());
}
