import { mkdir, readFile, rename, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import { safeUrlParts, type Annotation, type AnnotationSession, type AnnotationStatus, type ThreadMessage } from "@opentargetui/core";

type StoredData = {
  version: 1;
  sessions: AnnotationSession[];
};

export type CreateSessionInput = {
  url: string;
  title?: string;
};

export function defaultStorePath(): string {
  return process.env.OPENTARGETUI_STORE_PATH || join(homedir(), ".opentargetui", "sessions.json");
}

function nowIso(): string {
  return new Date().toISOString();
}

function randomId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeAnnotation(annotation: Annotation, sessionId: string): Annotation {
  const timestamp = Date.now();
  return {
    ...annotation,
    id: annotation.id || randomId("otu"),
    sessionId,
    status: annotation.status ?? "pending",
    createdAt: annotation.createdAt ?? nowIso(),
    updatedAt: nowIso(),
    timestamp: annotation.timestamp || timestamp,
    thread: annotation.thread ?? []
  };
}

export class JsonStore {
  private data: StoredData = { version: 1, sessions: [] };

  constructor(public readonly filePath = defaultStorePath()) {}

  async load(): Promise<void> {
    try {
      const raw = await readFile(this.filePath, "utf8");
      const parsed = JSON.parse(raw) as StoredData;
      this.data = {
        version: 1,
        sessions: Array.isArray(parsed.sessions) ? parsed.sessions : []
      };
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code !== "ENOENT") throw error;
      this.data = { version: 1, sessions: [] };
      await this.save();
    }
  }

  async reload(): Promise<void> {
    await this.load();
  }

  async save(): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true });
    const tmp = `${this.filePath}.${process.pid}.tmp`;
    await writeFile(tmp, `${JSON.stringify(this.data, null, 2)}\n`, "utf8");
    await rename(tmp, this.filePath);
  }

  async mtimeMs(): Promise<number> {
    try {
      return (await stat(this.filePath)).mtimeMs;
    } catch {
      return 0;
    }
  }

  listSessions(): AnnotationSession[] {
    return [...this.data.sessions].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  getSession(id: string): AnnotationSession | undefined {
    return this.data.sessions.find((session) => session.id === id);
  }

  async createSession(input: CreateSessionInput): Promise<AnnotationSession> {
    const parts = safeUrlParts(input.url);
    const existing = this.data.sessions.find((session) => session.url === input.url);
    if (existing) {
      if (input.title !== undefined) existing.title = input.title;
      existing.updatedAt = nowIso();
      await this.save();
      return existing;
    }

    const session: AnnotationSession = {
      id: randomId("session"),
      url: input.url,
      origin: parts.origin,
      pathname: parts.pathname,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      annotations: []
    };
    if (input.title !== undefined) session.title = input.title;
    this.data.sessions.push(session);
    await this.save();
    return session;
  }

  async upsertAnnotation(sessionId: string, annotation: Annotation): Promise<Annotation> {
    const session = this.requireSession(sessionId);
    const normalized = normalizeAnnotation(annotation, sessionId);
    const index = session.annotations.findIndex((item) => item.id === normalized.id);
    if (index === -1) {
      session.annotations.push(normalized);
    } else {
      const existing = session.annotations[index];
      if (!existing) throw Object.assign(new Error(`Annotation not found: ${normalized.id}`), { statusCode: 404 });
      session.annotations[index] = {
        ...existing,
        ...normalized,
        createdAt: existing.createdAt ?? normalized.createdAt ?? nowIso(),
        updatedAt: nowIso()
      };
    }
    session.updatedAt = nowIso();
    await this.save();
    return session.annotations.find((item) => item.id === normalized.id) ?? normalized;
  }

  async patchAnnotation(annotationId: string, patch: Partial<Annotation>): Promise<Annotation> {
    const { session, annotation, index } = this.requireAnnotation(annotationId);
    const updated: Annotation = {
      ...annotation,
      ...patch,
      id: annotation.id,
      updatedAt: nowIso()
    };
    if (annotation.sessionId !== undefined) updated.sessionId = annotation.sessionId;
    session.annotations[index] = updated;
    session.updatedAt = nowIso();
    await this.save();
    return updated;
  }

  async setStatus(annotationId: string, status: AnnotationStatus, summary?: string): Promise<Annotation> {
    const patch: Partial<Annotation> = { status };
    if (status === "resolved") {
      patch.resolvedAt = nowIso();
      patch.resolvedBy = "agent";
    }
    const updated = await this.patchAnnotation(annotationId, patch);
    if (summary) {
      return this.addThreadMessage(annotationId, "agent", summary);
    }
    return updated;
  }

  async addThreadMessage(annotationId: string, role: "human" | "agent", content: string): Promise<Annotation> {
    const { annotation } = this.requireAnnotation(annotationId);
    const message: ThreadMessage = {
      id: randomId("thread"),
      role,
      content,
      timestamp: Date.now()
    };
    const thread = [...(annotation.thread ?? []), message];
    return this.patchAnnotation(annotationId, { thread });
  }

  async deleteAnnotation(annotationId: string): Promise<{ sessionId: string; annotation: Annotation }> {
    const { session, annotation, index } = this.requireAnnotation(annotationId);
    session.annotations.splice(index, 1);
    session.updatedAt = nowIso();
    await this.save();
    return { sessionId: session.id, annotation };
  }

  pending(sessionId?: string): Annotation[] {
    const sessions = sessionId ? [this.requireSession(sessionId)] : this.data.sessions;
    return sessions.flatMap((session) =>
      session.annotations.filter((annotation) => (annotation.status ?? "pending") === "pending")
    );
  }

  private requireSession(id: string): AnnotationSession {
    const session = this.getSession(id);
    if (!session) throw Object.assign(new Error(`Session not found: ${id}`), { statusCode: 404 });
    return session;
  }

  private requireAnnotation(annotationId: string): { session: AnnotationSession; annotation: Annotation; index: number } {
    for (const session of this.data.sessions) {
      const index = session.annotations.findIndex((annotation) => annotation.id === annotationId);
      if (index >= 0) {
        const annotation = session.annotations[index];
        if (!annotation) break;
        return { session, annotation, index };
      }
    }
    throw Object.assign(new Error(`Annotation not found: ${annotationId}`), { statusCode: 404 });
  }
}
