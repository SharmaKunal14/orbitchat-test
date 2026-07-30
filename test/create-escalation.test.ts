import assert from "node:assert/strict";
import test from "node:test";
import type { OrbitChatClient } from "@orbitchat/sdk";
import {
  createEscalationMessage,
  type AuditWriter
} from "../src/features/escalations/create-escalation.js";

type CreateMessageInput = Parameters<
  OrbitChatClient["messages"]["create"]
>[0];

test("sends a direct OrbitChat escalation and records its message id", async () => {
  const sent: CreateMessageInput[] = [];
  const audits: Array<{
    readonly event: string;
    readonly attributes: {
      readonly escalationId: string;
      readonly externalId: string;
    };
  }> = [];

  const client: OrbitChatClient = {
    messages: {
      async create(input) {
        sent.push(input);
        return {
          id: "message-escalation",
          createdAt: "2026-07-28T00:00:00.000Z"
        };
      }
    }
  };
  const audit: AuditWriter = {
    async record(event, attributes) {
      audits.push({ event, attributes });
    }
  };

  const messageId = await createEscalationMessage(
    client,
    audit,
    {
      id: "escalation-42",
      channelId: "urgent-support",
      summary: "Customer cannot sign in"
    }
  );

  assert.equal(messageId, "message-escalation");
  assert.deepEqual(sent, [
    {
      channelId: "urgent-support",
      content: "[escalation-42] Customer cannot sign in",
      notification: { enabled: true }
    }
  ]);
  assert.deepEqual(audits, [
    {
      event: "orbit_message_created",
      attributes: {
        escalationId: "escalation-42",
        externalId: "message-escalation"
      }
    }
  ]);
});
