import type { OrbitChatClient } from "@orbitchat/sdk";

export interface OrbitMessageInput {
  readonly roomId: string;
  readonly body: string;
  readonly notify?: boolean;
}

export interface OrbitMessage {
  readonly id: string;
  readonly createdAt: string;
}

function requireNonEmptyString(value: string, field: string): string {
  if (value.trim().length === 0) {
    throw new TypeError(`${field} must be a non-empty string`);
  }

  return value;
}

export function createOrbitMessageService(client: OrbitChatClient): {
  sendOrbitMessage(input: OrbitMessageInput): Promise<OrbitMessage>;
} {
  return {
    async sendOrbitMessage(input) {
      const result = await client.messages.send({
        room: requireNonEmptyString(input.roomId, "roomId"),
        text: requireNonEmptyString(input.body, "body"),
        notify: input.notify
      });

      return {
        id: result.message_id,
        createdAt: result.created_at
      };
    }
  };
}

