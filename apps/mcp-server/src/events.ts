import type { ServerEvent } from "@opentargetui/core";

type Client = {
  send: (event: ServerEvent) => void;
  sessionId?: string;
  origin?: string;
};

export class EventBus {
  private nextId = 1;
  private clients = new Set<Client>();
  private events: ServerEvent[] = [];

  emit<T>(event: Omit<ServerEvent<T>, "id" | "timestamp">): ServerEvent<T> {
    const fullEvent: ServerEvent<T> = {
      ...event,
      id: this.nextId++,
      timestamp: new Date().toISOString()
    };
    this.events.push(fullEvent as ServerEvent);
    this.events = this.events.slice(-1000);
    for (const client of this.clients) {
      if (client.sessionId && client.sessionId !== fullEvent.sessionId) continue;
      client.send(fullEvent as ServerEvent);
    }
    return fullEvent;
  }

  subscribe(client: Client): () => void {
    this.clients.add(client);
    return () => this.clients.delete(client);
  }

  replaySince(lastEventId: number, client: Client): void {
    this.events
      .filter((event) => event.id > lastEventId)
      .forEach((event) => {
        if (client.sessionId && client.sessionId !== event.sessionId) return;
        client.send(event);
      });
  }
}
