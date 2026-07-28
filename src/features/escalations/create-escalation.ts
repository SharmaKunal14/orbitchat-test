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
  const created = await orbit.messages.send({
    room: escalation.channelId,
    text: `[${escalation.id}] ${escalation.summary}`,
    notify: true
  });

  await audit.record("orbit_message_created", {
    escalationId: escalation.id,
    externalId: created.message_id
  });

  return created.message_id;
}

