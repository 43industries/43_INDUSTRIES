type EventPayload = Record<string, unknown>;

export function trackEvent(event: string, payload: EventPayload) {
  if (process.env.NODE_ENV !== "production") {
    console.info(`[event] ${event}`, payload);
  }
}
