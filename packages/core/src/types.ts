export type AnnotationStatus = "pending" | "acknowledged" | "resolved" | "dismissed";
export type AnnotationKind = "feedback" | "placement" | "rearrange";
export type AnnotationIntent = "fix" | "change" | "question" | "approve";
export type AnnotationSeverity = "blocking" | "important" | "suggestion";
export type MarkdownMode = "feedback" | "change-request";
export type OutputDetail = "compact" | "standard" | "detailed" | "forensic";
export type ThreadRole = "human" | "agent";

export interface RectSnapshot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ThreadMessage {
  id: string;
  role: ThreadRole;
  content: string;
  timestamp: number;
}

export interface PlacementRequest {
  componentType: string;
  width: number;
  height: number;
  scrollY: number;
  text?: string;
}

export interface RearrangeRequest {
  selector: string;
  label: string;
  tagName: string;
  originalRect: RectSnapshot;
  currentRect: RectSnapshot;
}

export interface Annotation {
  id: string;
  comment: string;
  elementPath: string;
  timestamp: number;
  x: number;
  y: number;
  element: string;
  url?: string;
  title?: string;
  boundingBox?: RectSnapshot;
  reactComponents?: string;
  cssClasses?: string;
  computedStyles?: string;
  accessibility?: string;
  nearbyText?: string;
  selectedText?: string;
  isFixed?: boolean;
  isMultiSelect?: boolean;
  fullPath?: string;
  nearbyElements?: string;
  intent?: AnnotationIntent;
  severity?: AnnotationSeverity;
  kind?: AnnotationKind;
  placement?: PlacementRequest;
  rearrange?: RearrangeRequest;
  status?: AnnotationStatus;
  resolvedAt?: string;
  resolvedBy?: "human" | "agent";
  thread?: ThreadMessage[];
  sessionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnnotationSession {
  id: string;
  url: string;
  title?: string;
  origin: string;
  pathname: string;
  createdAt: string;
  updatedAt: string;
  annotations: Annotation[];
}

export interface MarkdownOptions {
  mode?: MarkdownMode;
  detail?: OutputDetail;
  includeHeader?: boolean;
  generatedAt?: Date;
}

export interface UiPosition {
  left: number;
  top: number;
}

export interface ExtensionSettings {
  enabled: boolean;
  outputDetail: OutputDetail;
  markerColor: string;
  serverUrl: string;
  syncEnabled: boolean;
  hideMarkers: boolean;
  blockPageInteractions: boolean;
  uiPosition?: UiPosition;
}

export interface ServerEvent<T = unknown> {
  id: number;
  type:
    | "annotation.created"
    | "annotation.updated"
    | "annotation.deleted"
    | "session.created"
    | "session.updated"
    | "session.closed"
    | "thread.message";
  timestamp: string;
  sessionId?: string;
  annotationId?: string;
  data: T;
}
