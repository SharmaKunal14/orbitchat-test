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
      const notification =
        input.notify === undefined
          ? {}
          : { notification: { enabled: input.notify } };
      const result = await client.messages.create({
        channelId: requireNonEmptyString(input.roomId, "roomId"),
        content: requireNonEmptyString(input.body, "body"),
        ...notification
      });

      return {
        id: result.id,
        createdAt: result.createdAt
      };
    }
  };
}

