import assert from "node:assert/strict";
import test from "node:test";
import {
  type OrbitChatClient,
  type SendMessageInput
} from "@orbitchat/sdk";
import { createOrbitMessageService } from "../src/integrations/orbitchat-client.js";

function createHarness(): {
  readonly sent: SendMessageInput[];
  readonly service: ReturnType<typeof createOrbitMessageService>;
} {
  const sent: SendMessageInput[] = [];
  const client: OrbitChatClient = {
    messages: {
      async send(input) {
        sent.push(input);
        return {
          message_id: "message-123",
          created_at: "2026-07-28T00:00:00.000Z"
        };
      }
    }
  };

  return {
    sent,
    service: createOrbitMessageService(client)
  };
}

test("maps the application request and response", async () => {
  const { sent, service } = createHarness();

  const result = await service.sendOrbitMessage({
    roomId: "support",
    body: "Customer needs help",
    notify: true
  });

  assert.deepEqual(sent, [
    {
      room: "support",
      text: "Customer needs help",
      notify: true
    }
  ]);
  assert.deepEqual(result, {
    id: "message-123",
    createdAt: "2026-07-28T00:00:00.000Z"
  });
});

test("preserves an explicit false notification value", async () => {
  const { sent, service } = createHarness();

  await service.sendOrbitMessage({
    roomId: "digest",
    body: "Daily digest",
    notify: false
  });

  assert.equal(sent[0]?.notify, false);
});

test("passes an omitted notification value as undefined", async () => {
  const { sent, service } = createHarness();

  await service.sendOrbitMessage({
    roomId: "digest",
    body: "Daily digest"
  });

  assert.equal(sent[0]?.notify, undefined);
});

test("rejects empty application input before calling the SDK transport", async () => {
  const { sent, service } = createHarness();

  await assert.rejects(
    service.sendOrbitMessage({
      roomId: " ",
      body: "Message"
    }),
    /roomId must be a non-empty string/
  );
  assert.equal(sent.length, 0);
});
