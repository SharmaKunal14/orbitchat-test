import type { OrbitChatClient } from "@orbitchat/sdk";

export interface Escalation {
  readonly id: string;
  readonly channelId: string;
  readonly summary: string;
}

export interface AuditWriter {
  record(
    event: "orbit_message_created",
    attributes: { readonly escalationId: string; readonly externalId: string }
  ): Promise<void>;
}

export async function createEscalationMessage(
  orbit: OrbitChatClient,
  audit: AuditWriter,
  escalation: Escalation
): Promise<string> {
  const created = await orbit.messages.create({
    channelId: escalation.channelId,
    content: `[${escalation.id}] ${escalation.summary}`,
    notification: { enabled: true }
  });

  await audit.record("orbit_message_created", {
    escalationId: escalation.id,
    externalId: created.id
  });

  return created.id;
}

