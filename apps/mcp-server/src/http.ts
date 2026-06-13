import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { URL } from "node:url";
import type { Annotation, ServerEvent } from "@opentargetui/core";
import { EventBus } from "./events.js";
import { JsonStore } from "./store.js";

export type HttpServerHandle = {
  server: Server;
  store: JsonStore;
  port: number;
  close: () => Promise<void>;
};

type StartOptions = {
  port?: number;
  storePath?: string;
};

function setCors(res: ServerResponse): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Last-Event-ID");
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  setCors(res);
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

function sendError(res: ServerResponse, error: unknown): void {
  const status = Number((error as { statusCode?: number }).statusCode ?? 500);
  sendJson(res, status, {
    error: status === 500 ? "Internal server error" : (error as Error).message
  });
}

async function readBody<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? (JSON.parse(raw) as T) : ({} as T);
}

function writeSse(res: ServerResponse, event: ServerEvent): void {
  res.write(`id: ${event.id}\n`);
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

export async function startHttpServer(options: StartOptions = {}): Promise<HttpServerHandle> {
  const port = options.port ?? Number(process.env.OPENTARGETUI_PORT ?? 4747);
  const store = new JsonStore(options.storePath);
  await store.load();
  const bus = new EventBus();

  const server = createServer(async (req, res) => {
    setCors(res);
    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
    const pathname = url.pathname;

    try {
      if (req.method === "GET" && pathname === "/health") {
        sendJson(res, 200, { ok: true, name: "opentargetui-server", version: "0.1.0" });
        return;
      }

      if (req.method === "GET" && pathname === "/status") {
        const sessions = store.listSessions();
        sendJson(res, 200, {
          ok: true,
          sessions: sessions.length,
          pending: store.pending().length,
          storePath: store.filePath
        });
        return;
      }

      if (req.method === "POST" && pathname === "/sessions") {
        const body = await readBody<{ url: string; title?: string }>(req);
        if (!body.url) throw Object.assign(new Error("url is required"), { statusCode: 400 });
        const session = await store.createSession(body);
        bus.emit({ type: "session.created", sessionId: session.id, data: session });
        sendJson(res, 201, session);
        return;
      }

      if (req.method === "GET" && pathname === "/sessions") {
        sendJson(res, 200, { sessions: store.listSessions() });
        return;
      }

      const sessionMatch = pathname.match(/^\/sessions\/([^/]+)$/);
      if (req.method === "GET" && sessionMatch?.[1]) {
        const session = store.getSession(decodeURIComponent(sessionMatch[1]));
        if (!session) throw Object.assign(new Error("Session not found"), { statusCode: 404 });
        sendJson(res, 200, session);
        return;
      }

      const sessionAnnotationsMatch = pathname.match(/^\/sessions\/([^/]+)\/annotations$/);
      if (req.method === "POST" && sessionAnnotationsMatch?.[1]) {
        const sessionId = decodeURIComponent(sessionAnnotationsMatch[1]);
        const annotation = await store.upsertAnnotation(sessionId, await readBody<Annotation>(req));
        bus.emit({ type: "annotation.created", sessionId, annotationId: annotation.id, data: annotation });
        sendJson(res, 201, annotation);
        return;
      }

      const sessionPendingMatch = pathname.match(/^\/sessions\/([^/]+)\/pending$/);
      if (req.method === "GET" && sessionPendingMatch?.[1]) {
        sendJson(res, 200, { annotations: store.pending(decodeURIComponent(sessionPendingMatch[1])) });
        return;
      }

      if (req.method === "GET" && pathname === "/pending") {
        sendJson(res, 200, { annotations: store.pending() });
        return;
      }

      const annotationMatch = pathname.match(/^\/annotations\/([^/]+)$/);
      if (annotationMatch?.[1]) {
        const annotationId = decodeURIComponent(annotationMatch[1]);
        if (req.method === "PATCH") {
          const annotation = await store.patchAnnotation(annotationId, await readBody<Partial<Annotation>>(req));
          bus.emit({
            type: "annotation.updated",
            ...(annotation.sessionId ? { sessionId: annotation.sessionId } : {}),
            annotationId,
            data: annotation
          });
          sendJson(res, 200, annotation);
          return;
        }
        if (req.method === "DELETE") {
          const deleted = await store.deleteAnnotation(annotationId);
          bus.emit({
            type: "annotation.deleted",
            sessionId: deleted.sessionId,
            annotationId,
            data: deleted.annotation
          });
          sendJson(res, 200, { ok: true });
          return;
        }
        if (req.method === "GET") {
          const annotation = store
            .listSessions()
            .flatMap((session) => session.annotations)
            .find((item) => item.id === annotationId);
          if (!annotation) throw Object.assign(new Error("Annotation not found"), { statusCode: 404 });
          sendJson(res, 200, annotation);
          return;
        }
      }

      const threadMatch = pathname.match(/^\/annotations\/([^/]+)\/thread$/);
      if (req.method === "POST" && threadMatch?.[1]) {
        const body = await readBody<{ role?: "human" | "agent"; content: string }>(req);
        if (!body.content) throw Object.assign(new Error("content is required"), { statusCode: 400 });
        const annotation = await store.addThreadMessage(decodeURIComponent(threadMatch[1]), body.role ?? "agent", body.content);
        bus.emit({
          type: "thread.message",
          ...(annotation.sessionId ? { sessionId: annotation.sessionId } : {}),
          annotationId: annotation.id,
          data: annotation
        });
        sendJson(res, 201, annotation);
        return;
      }

      if (req.method === "GET" && (pathname === "/events" || /^\/sessions\/[^/]+\/events$/.test(pathname))) {
        const sessionId = pathname.match(/^\/sessions\/([^/]+)\/events$/)?.[1];
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          "Access-Control-Allow-Origin": "*"
        });
        res.write(": connected\n\n");
        const client = {
          ...(sessionId ? { sessionId: decodeURIComponent(sessionId) } : {}),
          send: (event: ServerEvent) => writeSse(res, event)
        };
        const lastId = Number(req.headers["last-event-id"] ?? 0);
        bus.replaySince(Number.isFinite(lastId) ? lastId : 0, client);
        const unsubscribe = bus.subscribe(client);
        req.on("close", unsubscribe);
        return;
      }

      sendJson(res, 404, { error: "Not found" });
    } catch (error) {
      sendError(res, error);
    }
  });

  await new Promise<void>((resolve) => server.listen(port, resolve));

  return {
    server,
    store,
    port,
    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      })
  };
}
