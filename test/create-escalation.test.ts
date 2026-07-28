import assert from "node:assert/strict";
import test from "node:test";
import {
  createOrbitChatClient,
  type MessageTransport,
  type SendMessageInput
} from "@orbitchat/sdk";
import {
  createEscalationMessage,
  type AuditWriter
} from "../src/features/escalations/create-escalation.js";

test("sends a direct OrbitChat escalation and records its v1 message id", async () => {
  const sent: SendMessageInput[] = [];
  const audits: Array<{
    readonly event: string;
    readonly attributes: {
      readonly escalationId: string;
      readonly externalId: string;
    };
  }> = [];

  const transport: MessageTransport = {
    async send(input) {
      sent.push(input);
      return {
        message_id: "message-escalation",
        created_at: "2026-07-28T00:00:00.000Z"
      };
    }
  };
  const audit: AuditWriter = {
    async record(event, attributes) {
      audits.push({ event, attributes });
    }
  };

  const messageId = await createEscalationMessage(
    createOrbitChatClient({ transport }),
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
      room: "urgent-support",
      text: "[escalation-42] Customer cannot sign in",
      notify: true
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

